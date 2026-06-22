"use client";

import { FormEvent, useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useLibrary } from "@/lib/library/useLibrary";
import { buildSavedSpiritCardReading } from "@/lib/library/storage";
import { trackEvent } from "@/lib/analytics/tracking";
import { evaluatePaywall, recordFreeReading } from "@/lib/monetization/paywall";
import { runReadingPipeline } from "@/lib/reading/pipeline";
import type { ReadingSession } from "@/lib/reading/types";
import { spiritCardFromDob } from "@/lib/tarot/spirit";
import { AppBar } from "@/components/nav/AppBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FeatureMenu } from "@/components/nav/FeatureMenu";
import { FAB } from "@/components/ui/FAB";

function normalizeText(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((v) => normalizeText(v)).join("\n");
  if (value && typeof value === "object") {
    try {
      const obj = value as Record<string, unknown>;
      const numericKeys = Object.keys(obj).every((k) => /^\d+$/.test(k));
      if (numericKeys) {
        return Object.keys(obj)
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => normalizeText(obj[k]))
          .join("\n");
      }
      return JSON.stringify(obj, null, 2);
    } catch {
      return "";
    }
  }
  return "";
}

export default function SpiritCardPage() {
  const lib = useLibrary();
  const [savedId, setSavedId] = useState<string | null>(null);

  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittedDob, setSubmittedDob] = useState<string | null>(null);
  const [aiReading, setAiReading] = useState<null | { summary: string; cardStructure: string }>(null);
  const [session, setSession] = useState<ReadingSession | null>(null);
  const [needCredits, setNeedCredits] = useState(false);

  // Generate + charge server-side (paywall enforced; re-view of same dob free).
  useEffect(() => {
    setSession(null);
    setNeedCredits(false);
    if (!submittedDob) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/reading", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "spirit_card", params: { dob: submittedDob }, dedupeKey: submittedDob }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data.ok) {
          setSession(data.reading as ReadingSession);
          window.dispatchEvent(new Event("rf:credits-changed"));
        } else if (res.status === 402) {
          setNeedCredits(true);
          setError("แต้มไม่พอ — เติมแต้มก่อนนะคะ");
        } else if (res.status === 401) {
          setError("กรุณาเข้าสู่ระบบด้วย LINE ก่อนดูดวง");
        } else {
          setError("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
        }
      } catch {
        if (!cancelled) setError("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [submittedDob]);

  useEffect(() => {
    trackEvent("reading_start", { vertical: "spirit-card", step: "form_view" });
  }, []);

  useEffect(() => {
    if (!submittedDob) {
      setSavedId(null);
      return;
    }

    const existing = lib.items.find(
      (item) => "kind" in item && item.kind === "spirit_card" && (item as any).dob === submittedDob
    );
    setSavedId(existing?.id ?? null);
  }, [lib.items, submittedDob]);

  const paywall = useMemo(() => {
    if (!session) return null;
    return evaluatePaywall({
      vertical: "spirit-card",
      stage: "result",
      sessionId: session.sessionId,
    });
  }, [session]);

  const spirit = useMemo(() => {
    if (!submittedDob) return null;
    return spiritCardFromDob(submittedDob);
  }, [submittedDob]);

  const toggleSaved = useCallback(() => {
    if (!submittedDob || !spirit) return;

    if (savedId) {
      lib.remove(savedId);
      setSavedId(null);
      return;
    }

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());

    const title = `Spirit Card — ${spirit.card.nameTh ?? spirit.card.name}`;

    lib.upsert(
      buildSavedSpiritCardReading({
        id,
        dob: submittedDob,
        cardId: spirit.card.id,
        orientation: spirit.orientation,
        lifePathNumber: spirit.lifePathNumber,
        title,
        aiSummary: aiReading?.summary,
        aiCardStructure: aiReading?.cardStructure,
        tags: [spirit.card.name, ...(spirit.card.keywordsUpright ?? []), ...(spirit.card.keywordsReversed ?? [])],
        snapshot: session
          ? {
              input: { dob: submittedDob },
              card: {
                cardId: spirit.card.id,
                orientation: spirit.orientation,
                lifePathNumber: spirit.lifePathNumber,
              },
              session,
              output: aiReading ? { message: aiReading.summary, practice: aiReading.cardStructure } : undefined,
            }
          : undefined,
      })
    );

    setSavedId(id);
  }, [aiReading?.cardStructure, aiReading?.summary, lib, savedId, session, spirit, submittedDob]);

  useEffect(() => {
    if (!session || !submittedDob) return;

    recordFreeReading();
    trackEvent("reading_result_viewed", {
      vertical: "spirit-card",
      sessionId: session.sessionId,
    });

    if (paywall?.show) {
      trackEvent("paywall_shown", {
        vertical: "spirit-card",
        reason: paywall.reason,
        ctaVariant: paywall.variant,
      });
    }

    const controller = new AbortController();
    const fallback = {
      summary: session.summary,
      cardStructure: session.blocks.map((b) => `${b.title}: ${b.body}`).join("\n\n"),
    };

    const fallbackTimer = setTimeout(() => {
      setAiReading((prev) => prev ?? fallback);
    }, 7000);

    fetch("/api/ai/spirit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dob: submittedDob }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        return data?.ai ?? null;
      })
      .then((ai) => {
        if (!ai) {
          setAiReading((prev) => prev ?? fallback);
          return;
        }
        setAiReading({
          summary: normalizeText(ai.summary) || fallback.summary,
          cardStructure: normalizeText(ai.cardStructure) || fallback.cardStructure,
        });
      })
      .catch(() => {
        setAiReading((prev) => prev ?? fallback);
      })
      .finally(() => {
        clearTimeout(fallbackTimer);
      });

    return () => controller.abort();
  }, [session, submittedDob, paywall]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!dob.trim()) return;

    const next = runReadingPipeline({ kind: "spirit-card", dob });
    if (!next) {
      setError("กรุณาใส่วันเกิดในรูปแบบที่ถูกต้อง");
      return;
    }

    trackEvent("reading_submitted", { vertical: "spirit-card", step: "form_submit" });
    setError("");
    setAiReading(null);
    setLoading(true);
    setSubmittedDob(dob);
    setLoading(false);
  }

  return (
    <main className="mx-auto w-full max-w-lg">
      <header className="px-5 pt-7 pb-3">
        <AppBar title="ไพ่จิตวิญญาณ" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">ไพ่จิตวิญญาณ</h1>
        <p className="mt-1 text-sm text-fg-muted">รับข้อความจากจักรวาล ผ่านวันเกิดของคุณ</p>
      </header>

      <div className="px-5 pb-6">
        <Card className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-accent block mb-2">วันเกิด</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? "กำลังอ่าน..." : "เปิดไพ่จิตวิญญาณ"}
            </Button>
          </form>
        </Card>

        {error && (
          <Card className="mt-4 p-4 border-danger/30 bg-bg">
            <p className="text-sm text-danger">{error}</p>
            {needCredits ? (
              <Link href="/pricing" className="mt-3 block rounded-lg bg-emerald-600 px-4 py-2 text-center font-semibold text-white">
                เติมแต้ม
              </Link>
            ) : null}
          </Card>
        )}

        {aiReading && (
          <div className="mt-5 space-y-4">
            <Card className="p-5">
              <h2 className="text-sm font-bold text-accent">สารจากจักรวาล</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-fg-muted">{aiReading.summary}</p>
            </Card>
            <Card className="p-5">
              <h2 className="text-sm font-bold text-accent">แนวทางปฏิบัติ</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-fg-muted">{aiReading.cardStructure}</p>
            </Card>

            <Card className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-fg">บันทึกไว้ในคลัง</p>
                <p className="mt-1 text-xs text-fg-muted">แตะหัวใจเพื่อบันทึก/ยกเลิกบันทึก</p>
              </div>
              <button
                onClick={toggleSaved}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                  savedId ? "bg-danger/10 text-danger" : "bg-surface border border-border text-fg-muted hover:bg-danger/10 hover:text-danger"
                }`}
                aria-label={savedId ? "ยกเลิกบันทึก" : "บันทึก"}
              >
                <Heart className={`w-5 h-5 ${savedId ? "fill-current" : ""}`} />
              </button>
            </Card>
          </div>
        )}

        <div className="mt-8">
          <FeatureMenu />
        </div>
      </div>

      <FAB />
    </main>
  );
}
