"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Share2, RefreshCw } from "lucide-react";
import { analyzeThaiPhone } from "@/lib/numerology/engine";
import type { ReadingSession } from "@/lib/reading/types";
import { removeReading } from "@/lib/library/storage";
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
      return JSON.stringify(value, null, 2);
    } catch {
      return "";
    }
  }
  return "";
}

export default function NumerologyPage() {
  const [phone, setPhone] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState<string | null>(null);
  const [error, setError] = useState("");

  const baseline = useMemo(() => {
    if (!submittedPhone) return null;
    return analyzeThaiPhone(submittedPhone);
  }, [submittedPhone]);

  const [session, setSession] = useState<ReadingSession | null>(null);
  const [needCredits, setNeedCredits] = useState(false);

  // Generate + charge server-side (paywall can't be bypassed). Re-viewing the
  // same phone is free (server dedups by clientId).
  useEffect(() => {
    setSession(null);
    setNeedCredits(false);
    if (!submittedPhone) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/reading", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "numerology", params: { phone: submittedPhone }, dedupeKey: submittedPhone }),
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
  }, [submittedPhone]);

  const [aiReading, setAiReading] = useState<null | { summary: string; cardStructure: string }>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    if (!submittedPhone) {
      setAiReading(null);
      setSavedId(null);
      return;
    }

    const controller = new AbortController();

    const fallback = session
      ? {
          summary: session.summary,
          cardStructure: session.blocks.map((b) => `${b.title}: ${b.body}`).join("\n\n"),
        }
      : null;

    const fallbackTimer = setTimeout(() => {
      if (fallback) setAiReading((prev) => prev ?? fallback);
    }, 7000);

    fetch("/api/ai/numerology", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: submittedPhone }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        return data?.ai ?? null;
      })
      .then((ai) => {
        if (!ai) {
          if (fallback) setAiReading((prev) => prev ?? fallback);
          return;
        }
        setAiReading({
          summary: normalizeText(ai.summary) || (fallback?.summary ?? ""),
          cardStructure: normalizeText(ai.cardStructure) || (fallback?.cardStructure ?? ""),
        });
      })
      .catch(() => {
        if (fallback) setAiReading((prev) => prev ?? fallback);
      })
      .finally(() => {
        clearTimeout(fallbackTimer);
      });

    return () => {
      controller.abort();
    };
  }, [session, submittedPhone]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    const raw = phone.trim();
    if (!raw) return;

    const r = analyzeThaiPhone(raw);
    if (!r) {
      setError("กรุณาใส่เบอร์โทรศัพท์ให้ถูกต้อง");
      setSubmittedPhone(null);
      return;
    }

    setError("");
    setSubmittedPhone(raw);
  }

  function toggleSaved() {
    if (!baseline || !session) return;

    if (savedId) {
      removeReading(savedId);
      setSavedId(null);
      return;
    }

    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
    setSavedId(id);
  }

  return (
    <main className="mx-auto w-full max-w-lg">
      <header className="px-5 pt-7 pb-3">
        <AppBar title="เลขศาสตร์" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">วิเคราะห์เบอร์โทรศัพท์</h1>
        <p className="mt-1 text-sm text-fg-muted">กรอกเบอร์ แล้วดูคะแนน/แนวโน้มงาน-เงิน-ความสัมพันธ์</p>
      </header>

      <div className="px-5 pb-6">
        <Card className="p-5">
          <h2 className="text-base font-semibold text-fg">คำนวณ</h2>
          <p className="mt-1 text-sm text-fg-muted">ใส่เบอร์โทรศัพท์ (ระบบจะจัดรูปแบบให้เอง)</p>

          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-fg-muted">เบอร์โทรศัพท์</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                placeholder="เช่น 0812345678"
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 placeholder:text-fg-subtle"
                required
              />
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              {needCredits ? (
                <Link href="/pricing" className="mt-2 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
                  เติมแต้ม
                </Link>
              ) : null}
            </div>

            <Button type="submit" className="w-full" size="lg">
              วิเคราะห์
            </Button>
          </form>
        </Card>

        {baseline && session && (
          <div className="mt-5 space-y-4">
            <Card className="p-5">
              <h2 className="text-base font-semibold text-fg">สรุปคะแนน</h2>
              <p className="mt-2 text-sm text-fg-muted">
                คะแนน{" "}
                <span className="font-semibold text-accent">{baseline.score}/99</span> ({baseline.tier}) •
                เลขรวม {baseline.total} • เลขราก {baseline.root}
              </p>
            </Card>

            <Card className="p-5">
              <h2 className="text-base font-semibold text-fg">คำทำนาย</h2>
              {!aiReading ? (
                <p className="mt-2 text-sm text-fg-subtle">กำลังสรุปคำทำนาย...</p>
              ) : (
                <>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-fg-muted">{aiReading.summary}</p>
                  <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4">
                    <p className="text-xs font-medium text-accent">รายละเอียด</p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-fg-muted">{aiReading.cardStructure}</p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <Button
                      className="w-full flex items-center justify-center gap-2"
                      size="lg"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: "ผลวิเคราะห์เบอร์โทรศัพท์",
                            text: aiReading.summary,
                            url: window.location.href,
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert("คัดลอกลิงก์แล้ว!");
                        }
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                      แชร์ผลลัพธ์
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                      size="lg"
                      onClick={() => {
                        setSubmittedPhone(null);
                        setPhone("");
                      }}
                    >
                      <RefreshCw className="w-4 h-4" />
                      วิเคราะห์เบอร์อื่น
                    </Button>
                  </div>
                </>
              )}
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
