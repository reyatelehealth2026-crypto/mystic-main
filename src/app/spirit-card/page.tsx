"use client";

import { FormEvent, useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";
import { useLibrary } from "@/lib/library/useLibrary";
import { buildSavedSpiritCardReading } from "@/lib/library/storage";
import { trackEvent } from "@/lib/analytics/tracking";
import { evaluatePaywall, recordFreeReading } from "@/lib/monetization/paywall";
import { runReadingPipeline } from "@/lib/reading/pipeline";
import { spiritCardFromDob } from "@/lib/tarot/spirit";

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

  const session = useMemo(() => {
    if (!submittedDob) return null;
    return runReadingPipeline({ kind: "spirit-card", dob: submittedDob });
  }, [submittedDob]);

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
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-4 pb-2">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <span className="font-serif text-lg font-semibold text-violet-600">MysticFlow</span>
        </Link>
      </header>

      <div className="px-5 py-6">
        <h1 className="font-serif text-2xl font-semibold text-gray-900">ไพ่จิตวิญญาณ</h1>
        <p className="mt-1 text-sm text-gray-500">รับข้อความจากจักรวาล ผ่านวันเกิดของคุณ</p>

        <form onSubmit={handleSubmit} className="mt-5 rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm">
          <label className="text-sm font-medium text-violet-600">วันเกิด</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full h-12 rounded-xl bg-violet-600 text-white font-semibold text-sm shadow-lg shadow-violet-200 transition hover:bg-violet-700 hover:shadow-xl disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? "กำลังอ่าน..." : "เปิดไพ่จิตวิญญาณ"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {aiReading && (
          <section className="mt-5 space-y-4">
            <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-violet-600">สารจากจักรวาล</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600">{aiReading.summary}</p>
            </div>
            <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-violet-600">แนวทางปฏิบัติ</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600">{aiReading.cardStructure}</p>
            </div>

            <div className="flex items-center justify-between rounded-[24px] border border-gray-200 bg-white p-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">บันทึกไว้ในคลัง</p>
                <p className="mt-1 text-xs text-gray-500">แตะหัวใจเพื่อบันทึก/ยกเลิกบันทึก</p>
              </div>
              <button
                onClick={toggleSaved}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                  savedId
                    ? "bg-red-50 text-red-500"
                    : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500"
                }`}
                aria-label={savedId ? "ยกเลิกบันทึก" : "บันทึก"}
              >
                <Heart className={`w-5 h-5 ${savedId ? "fill-current" : ""}`} />
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
