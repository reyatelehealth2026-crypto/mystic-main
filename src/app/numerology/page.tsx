"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRecordReadingView } from "@/lib/history/useRecordReadingView";
import { Share2, RefreshCw } from "lucide-react";
import { analyzeThaiPhone } from "@/lib/numerology/engine";
import { runReadingPipeline } from "@/lib/reading/pipeline";
import { removeReading } from "@/lib/library/storage";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { cn } from "@/lib/cn";
import { BrandLogo } from "@/components/ui/BrandLogo";

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
  const { theme } = useTheme();
  const isPastel = theme === "pastel";
  const isRainbow = theme === "rainbow";
  const [phone, setPhone] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState<string | null>(null);
  const [error, setError] = useState("");

  const baseline = useMemo(() => {
    if (!submittedPhone) return null;
    return analyzeThaiPhone(submittedPhone);
  }, [submittedPhone]);

  const session = useMemo(() => {
    if (!baseline) return null;
    return runReadingPipeline({ kind: "numerology", phone: baseline.normalizedPhone });
  }, [baseline]);

  const [aiReading, setAiReading] = useState<null | { summary: string; cardStructure: string }>(null);

  // Save
  const [savedId, setSavedId] = useState<string | null>(null);

  useRecordReadingView({
    type: "numerology",
    summary: aiReading?.summary,
    ready: !!submittedPhone,
    dedupeKey: submittedPhone ?? undefined,
  });

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
    <main className={cn("min-h-screen", isPastel ? "bg-transparent" : isRainbow ? "bg-transparent" : "bg-white")}>
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-4 pb-2">
        <Link href="/" className="flex items-center gap-2">
          <BrandLogo size={24} inverted={isPastel || isRainbow} />
        </Link>
      </header>

      <div className="px-5 pb-10 pt-6">
        <header className="space-y-2">
          <h1 className={cn("font-serif text-2xl font-semibold", isPastel || isRainbow ? "text-white" : "text-gray-900")}>วิเคราะห์เบอร์โทรศัพท์</h1>
          <p className={cn("text-sm", isPastel || isRainbow ? "text-white/70" : "text-gray-500")}>กรอกเบอร์ แล้วดูคะแนน/แนวโน้มงาน-เงิน-ความสัมพันธ์</p>
        </header>

        <div className={cn("mt-6 rounded-[24px] border p-5 shadow-sm", isPastel ? "bg-white/20 backdrop-blur border-white/30" : isRainbow ? "bg-[#1a1a2e]/80 border-[rgba(255,0,255,0.2)]" : "border-gray-200 bg-white")}>
          <h2 className={cn("text-lg font-semibold", isPastel || isRainbow ? "text-white" : "text-gray-900")}>คำนวณ</h2>
          <p className={cn("mt-1 text-sm", isPastel || isRainbow ? "text-white/70" : "text-gray-500")}>ใส่เบอร์โทรศัพท์ (ระบบจะจัดรูปแบบให้เอง)</p>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <div className="space-y-2">
              <label className={cn("text-sm font-medium", isPastel || isRainbow ? "text-white/80" : "text-gray-600")}>เบอร์โทรศัพท์</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                placeholder="เช่น 0812345678"
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-sm outline-none transition",
                  isPastel ? "bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/60" :
                  isRainbow ? "bg-[#1a1a2e]/80 border-[rgba(255,0,255,0.3)] text-white placeholder:text-white/40 focus:border-[#ff00ff]" :
                  "border-gray-200 bg-white text-gray-900 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                )}
                required
              />
              {error ? <p className="text-sm text-red-500">{error}</p> : null}
            </div>

            <button
              type="submit"
              className={cn(
                "w-full h-12 rounded-xl font-medium shadow-lg transition-all active:scale-[0.98]",
                isPastel ? "bg-white/30 backdrop-blur text-white border border-white/50 hover:bg-white/50" :
                isRainbow ? "bg-gradient-to-r from-[#ff00ff] to-[#00ffff] text-white shadow-[rgba(255,0,255,0.3)]" :
                "bg-violet-600 text-white shadow-violet-200 hover:bg-violet-700 hover:shadow-xl"
              )}
            >
              วิเคราะห์
            </button>
          </form>
        </div>

        {baseline && session && (
          <section className="mt-6 space-y-4">
            <div className={cn("rounded-[24px] border p-5 shadow-sm", isPastel ? "bg-white/20 backdrop-blur border-white/30" : isRainbow ? "bg-[#1a1a2e]/80 border-[rgba(255,0,255,0.2)]" : "border-gray-200 bg-white")}>
              <h2 className={cn("text-lg font-semibold", isPastel || isRainbow ? "text-white" : "text-gray-900")}>สรุปคะแนน</h2>
              <p className={cn("mt-2 text-sm", isPastel || isRainbow ? "text-white/80" : "text-gray-600")}>
                คะแนน {" "}
                <span className={cn("font-semibold", isPastel || isRainbow ? "text-white" : "text-violet-600")}>{baseline.score}/99</span> ({baseline.tier}) •
                เลขรวม {baseline.total} • เลขราก {baseline.root}
              </p>
            </div>

            <div className={cn("rounded-[24px] border p-5 shadow-sm", isPastel ? "bg-white/20 backdrop-blur border-white/30" : isRainbow ? "bg-[#1a1a2e]/80 border-[rgba(255,0,255,0.2)]" : "border-gray-200 bg-white")}>
              <h2 className={cn("text-lg font-semibold", isPastel || isRainbow ? "text-white" : "text-gray-900")}>คำทำนาย</h2>
              {!aiReading ? (
                <p className={cn("mt-2 text-sm", isPastel || isRainbow ? "text-white/50" : "text-gray-400")}>กำลังสรุปคำทำนาย...</p>
              ) : (
                <>
                  <p className={cn("mt-2 whitespace-pre-line text-sm leading-relaxed", isPastel || isRainbow ? "text-white/80" : "text-gray-600")}>{aiReading.summary}</p>
                  <div className={cn("mt-4 rounded-xl border p-4", isPastel ? "border-white/20 bg-white/10" : isRainbow ? "border-[rgba(255,0,255,0.2)] bg-[rgba(255,0,255,0.05)]" : "border-violet-100 bg-violet-50/50")}>
                    <p className={cn("text-xs font-medium", isPastel || isRainbow ? "text-white" : "text-violet-600")}>รายละเอียด</p>
                    <p className={cn("mt-2 whitespace-pre-line text-sm leading-relaxed", isPastel || isRainbow ? "text-white/80" : "text-gray-600")}>{aiReading.cardStructure}</p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      className={cn(
                        "w-full h-12 rounded-xl font-medium shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2",
                        isPastel ? "bg-white/30 backdrop-blur text-white border border-white/50 hover:bg-white/50" :
                        isRainbow ? "bg-gradient-to-r from-[#ff00ff] to-[#00ffff] text-white shadow-[rgba(255,0,255,0.3)]" :
                        "bg-violet-600 text-white shadow-violet-200 hover:bg-violet-700 hover:shadow-xl"
                      )}
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
                    </button>
                    <button
                      className={cn(
                        "w-full h-12 rounded-xl font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2",
                        isPastel ? "bg-white/10 border border-white/20 text-white hover:bg-white/20" :
                        isRainbow ? "bg-[#1a1a2e] border border-[rgba(255,0,255,0.3)] text-white hover:border-[rgba(255,0,255,0.5)]" :
                        "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                      )}
                      onClick={() => {
                        setSubmittedPhone(null);
                        setPhone("");
                      }}
                    >
                      <RefreshCw className="w-4 h-4" />
                      วิเคราะห์เบอร์อื่น
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
