"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, RefreshCw, Share2, X, Coins, Briefcase, Heart, Clover, Leaf } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { cn } from "@/lib/cn";
import {
  computeLuckyNumbers,
  parseDayKey,
  topicLabel,
  type LuckyNumbersResult,
  type LuckyTopic,
} from "@/lib/lucky-numbers/engine";
import { trackEvent } from "@/lib/analytics/tracking";

type AiReading = { summary: string; cardStructure: string };

type RitualPhase = "idle" | "intent" | "praying" | "revealing" | "done";

const TOPIC_OPTIONS: { id: LuckyTopic; emoji: string; Icon: typeof Coins }[] = [
  { id: "finance", emoji: "💰", Icon: Coins },
  { id: "career", emoji: "💼", Icon: Briefcase },
  { id: "love", emoji: "❤️", Icon: Heart },
  { id: "luck", emoji: "🍀", Icon: Clover },
  { id: "health", emoji: "🌿", Icon: Leaf },
];

const REVEAL_STAGGER_MS = 320;

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

export default function LuckyNumbersPage() {
  const { theme } = useTheme();
  const isPastel = theme === "pastel";
  const isRainbow = theme === "rainbow";

  const [dob, setDob] = useState("");
  const [topic, setTopic] = useState<LuckyTopic>("luck");
  const [intent, setIntent] = useState("");
  const [error, setError] = useState("");

  const [phase, setPhase] = useState<RitualPhase>("idle");
  const [revealedCount, setRevealedCount] = useState(0);

  const [baseline, setBaseline] = useState<LuckyNumbersResult | null>(null);
  const [aiReading, setAiReading] = useState<AiReading | null>(null);

  useEffect(() => {
    trackEvent("reading_start", { vertical: "lucky-numbers", step: "form_view" });
  }, []);

  function openRitual(e: FormEvent) {
    e.preventDefault();
    if (!dob) {
      setError("กรุณาเลือกวันเกิดก่อนเปิดไพ่");
      return;
    }
    const next = computeLuckyNumbers({ dob, topic, intent, dayKey: parseDayKey() });
    if (!next) {
      setError("กรุณาเลือกวันเกิดให้ถูกต้อง");
      return;
    }
    setError("");
    setBaseline(next);
    setAiReading(null);
    setRevealedCount(0);
    setPhase("intent");
    trackEvent("reading_submitted", {
      vertical: "lucky-numbers",
      step: `ritual_open:${topic}`,
    });
  }

  function beginPray() {
    setPhase("praying");
    trackEvent("reading_submitted", { vertical: "lucky-numbers", step: "praying" });
    setTimeout(() => setPhase("revealing"), 2400);
  }

  // Reveal cards one by one once we enter the revealing phase
  useEffect(() => {
    if (phase !== "revealing" || !baseline) return;
    const total = baseline.cards.length;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= total; i += 1) {
      timers.push(setTimeout(() => setRevealedCount(i), i * REVEAL_STAGGER_MS));
    }
    timers.push(
      setTimeout(() => {
        setPhase("done");
        trackEvent("reading_result_viewed", { vertical: "lucky-numbers" });
      }, total * REVEAL_STAGGER_MS + 600),
    );
    return () => timers.forEach(clearTimeout);
  }, [phase, baseline]);

  // Fetch AI reading as soon as the ritual opens — runs in background
  useEffect(() => {
    if (!baseline) return;
    if (phase === "idle") return;

    const controller = new AbortController();
    const fallback: AiReading = {
      summary: `ชุดเลขมงคล ${baseline.set} สำหรับ${baseline.topicLabelTh} • เลขเส้นทางชีวิต ${baseline.lifePathNumber}`,
      cardStructure: baseline.cards
        .map((c, i) => `ไพ่ที่ ${i + 1} (${c.role}) เลข ${c.digit}: ${c.reasonTh}`)
        .join("\n"),
    };

    const fallbackTimer = setTimeout(() => {
      setAiReading((prev) => prev ?? fallback);
    }, 8000);

    fetch("/api/ai/lucky-numbers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dob: baseline.dob,
        topic: baseline.topic,
        intent: baseline.intent ?? "",
        dayKey: baseline.dayKey,
      }),
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
      .finally(() => clearTimeout(fallbackTimer));

    return () => {
      controller.abort();
      clearTimeout(fallbackTimer);
    };
  }, [baseline, phase]);

  function closeOverlay() {
    setPhase("idle");
    setRevealedCount(0);
  }

  function pickAgain() {
    setPhase("idle");
    setBaseline(null);
    setAiReading(null);
    setRevealedCount(0);
  }

  const overlayOpen = phase !== "idle";
  const allRevealed = phase === "done";

  const themed = useMemo(() => {
    const isAlt = isPastel || isRainbow;
    return {
      page: cn("min-h-screen", isPastel ? "bg-transparent" : isRainbow ? "bg-transparent" : "bg-white"),
      header: cn("text-lg font-semibold", isAlt ? "text-white" : "text-violet-600"),
      title: cn("font-serif text-2xl font-semibold", isAlt ? "text-white" : "text-gray-900"),
      muted: cn("text-sm", isAlt ? "text-white/70" : "text-gray-500"),
      cardBox: cn(
        "rounded-[24px] border p-5 shadow-sm",
        isPastel
          ? "bg-white/20 backdrop-blur border-white/30"
          : isRainbow
          ? "bg-[#1a1a2e]/80 border-[rgba(255,0,255,0.2)]"
          : "border-gray-200 bg-white",
      ),
      sectionTitle: cn("text-lg font-semibold", isAlt ? "text-white" : "text-gray-900"),
      mutedSm: cn("text-sm", isAlt ? "text-white/70" : "text-gray-600"),
      primaryBtn: cn(
        "w-full h-12 rounded-xl font-semibold shadow-lg transition-all active:scale-[0.98]",
        isPastel
          ? "bg-white/30 backdrop-blur text-white border border-white/50 hover:bg-white/50"
          : isRainbow
          ? "bg-gradient-to-r from-[#ff00ff] to-[#00ffff] text-white shadow-[rgba(255,0,255,0.3)]"
          : "bg-violet-600 text-white shadow-violet-200 hover:bg-violet-700 hover:shadow-xl",
      ),
      ghostBtn: cn(
        "w-full h-12 rounded-xl font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2",
        isPastel
          ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
          : isRainbow
          ? "bg-[#1a1a2e] border border-[rgba(255,0,255,0.3)] text-white hover:border-[rgba(255,0,255,0.5)]"
          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
      ),
      input: cn(
        "w-full rounded-xl border px-4 py-3 text-sm outline-none transition",
        isPastel
          ? "bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/60"
          : isRainbow
          ? "bg-[#1a1a2e]/80 border-[rgba(255,0,255,0.3)] text-white placeholder:text-white/40 focus:border-[#ff00ff]"
          : "border-gray-200 bg-white text-gray-900 focus:border-violet-400 focus:ring-2 focus:ring-violet-100",
      ),
      label: cn("text-sm font-medium", isAlt ? "text-white/80" : "text-gray-600"),
    };
  }, [isPastel, isRainbow]);

  return (
    <main className={themed.page}>
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-4 pb-2">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className={cn("w-5 h-5", isPastel || isRainbow ? "text-white" : "text-violet-600")} />
          <span className={cn("font-serif text-lg font-semibold", isPastel || isRainbow ? "text-white" : "text-violet-600")}>
            REFFORTUNE
          </span>
        </Link>
      </header>

      <div className="px-5 pb-10 pt-6">
        <section className="space-y-2">
          <h1 className={themed.title}>ไพ่เลขมงคล</h1>
          <p className={themed.muted}>ตั้งจิตอธิษฐาน เปิดไพ่ 6 ใบ รับชุดเลขเสริมดวงเฉพาะของคุณวันนี้</p>
        </section>

        <form onSubmit={openRitual} className={cn("mt-6 space-y-5", themed.cardBox)}>
          <div>
            <h2 className={themed.sectionTitle}>1. เรื่องที่อยากเสริมดวง</h2>
            <p className={cn("mt-1 text-sm", isPastel || isRainbow ? "text-white/70" : "text-gray-500")}>เลือกหมวดที่ตรงกับใจคุณตอนนี้</p>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {TOPIC_OPTIONS.map((opt) => {
                const active = topic === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setTopic(opt.id)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 rounded-2xl border px-2 py-3 text-xs transition",
                      active
                        ? isRainbow
                          ? "border-[#ff00ff] bg-[rgba(255,0,255,0.15)] text-white"
                          : isPastel
                          ? "border-white bg-white/30 text-white"
                          : "border-violet-500 bg-violet-50 text-violet-700"
                        : isRainbow
                        ? "border-[rgba(255,0,255,0.2)] bg-transparent text-white/70"
                        : isPastel
                        ? "border-white/30 bg-white/10 text-white/80"
                        : "border-gray-200 bg-white text-gray-600",
                    )}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <span className="font-medium">{topicLabel(opt.id)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className={themed.sectionTitle}>2. วันเกิดของคุณ</h2>
            <label className={cn("mt-2 block", themed.label)}>วันเกิด (ใช้สำหรับเลขเส้นทางชีวิต)</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className={cn("mt-2", themed.input)}
            />
          </div>

          <div>
            <h2 className={themed.sectionTitle}>3. ตั้งจิตอธิษฐาน (ไม่บังคับ)</h2>
            <textarea
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              maxLength={140}
              rows={2}
              placeholder="เช่น ขอโชคลาภเรื่องการเงินสัปดาห์นี้"
              className={cn("mt-2 resize-none", themed.input)}
            />
            <p className={cn("mt-1 text-xs", isPastel || isRainbow ? "text-white/50" : "text-gray-400")}>
              {intent.length}/140
            </p>
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <button type="submit" className={themed.primaryBtn}>
            พร้อมเปิดไพ่
          </button>
        </form>

        {baseline && phase === "idle" && (
          <section className="mt-6 space-y-4">
            <div className={themed.cardBox}>
              <h2 className={themed.sectionTitle}>ผลล่าสุดของคุณ</h2>
              <p className={cn("mt-2", themed.mutedSm)}>
                หมวด {baseline.topicLabelTh} • เลขเส้นทางชีวิต {baseline.lifePathNumber} • อ่านเมื่อ {baseline.dayKey}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {baseline.cards.map((c) => (
                  <div
                    key={c.index}
                    className="relative h-20 w-14 overflow-hidden rounded-lg border border-white/20 shadow"
                  >
                    <Image
                      src={`/lucky-numbers/${c.digit}.png`}
                      alt={`ไพ่เลข ${c.digit}`}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className={cn("mt-4 text-sm", themed.mutedSm)}>
                เลขชุดคู่: <span className="font-semibold">{baseline.pair}</span> • เลขชุดสาม:{" "}
                <span className="font-semibold">{baseline.triple}</span>
              </p>
            </div>

            {aiReading && (
              <div className={themed.cardBox}>
                <h2 className={themed.sectionTitle}>คำทำนายชุดเลขมงคล</h2>
                <p className={cn("mt-2 whitespace-pre-line text-sm leading-relaxed", isPastel || isRainbow ? "text-white/80" : "text-gray-600")}>
                  {aiReading.summary}
                </p>
                <div
                  className={cn(
                    "mt-4 rounded-xl border p-4",
                    isPastel
                      ? "border-white/20 bg-white/10"
                      : isRainbow
                      ? "border-[rgba(255,0,255,0.2)] bg-[rgba(255,0,255,0.05)]"
                      : "border-violet-100 bg-violet-50/50",
                  )}
                >
                  <p className={cn("text-xs font-medium", isPastel || isRainbow ? "text-white" : "text-violet-600")}>รายละเอียด</p>
                  <p className={cn("mt-2 whitespace-pre-line text-sm leading-relaxed", isPastel || isRainbow ? "text-white/80" : "text-gray-600")}>
                    {aiReading.cardStructure}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                className={cn(themed.primaryBtn, "flex items-center justify-center gap-2")}
                onClick={() => {
                  const text = aiReading?.summary ?? `เลขมงคลของฉันวันนี้: ${baseline.set}`;
                  if (navigator.share) {
                    navigator.share({ title: "ไพ่เลขมงคล", text, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(`${text}\n${window.location.href}`);
                    alert("คัดลอกลิงก์แล้ว!");
                  }
                }}
              >
                <Share2 className="w-4 h-4" />
                แชร์ผลลัพธ์
              </button>
              <button type="button" className={themed.ghostBtn} onClick={pickAgain}>
                <RefreshCw className="w-4 h-4" />
                เปิดไพ่ใหม่
              </button>
            </div>
          </section>
        )}
      </div>

      {/* Ritual overlay */}
      <AnimatePresence>
        {overlayOpen && baseline && (
          <motion.div
            key="lucky-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col bg-[#0a0a1a]/95 text-white backdrop-blur-md"
          >
            <div className="flex items-center justify-between px-5 pt-5">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">REFFORTUNE · LUCKY</span>
              <button
                type="button"
                onClick={closeOverlay}
                className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
                aria-label="ปิด"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-5 pb-12">
              {phase === "intent" && (
                <div className="max-w-md text-center">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">ขั้นตอนที่ 1</p>
                  <h2 className="mt-3 font-serif text-3xl">ตั้งจิตอธิษฐาน</h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/70">
                    หลับตา หายใจเข้าลึก ๆ 3 ครั้ง นึกถึงเรื่อง{baseline.topicLabelTh}ที่อยากเสริมพลัง
                    เมื่อใจสงบแล้วกดปุ่มเพื่อเปิดไพ่
                  </p>
                  {baseline.intent ? (
                    <p className="mt-4 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm italic text-white/80">
                      &ldquo;{baseline.intent}&rdquo;
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={beginPray}
                    className="mt-8 w-full max-w-xs rounded-full bg-gradient-to-r from-[#a78bfa] to-[#f472b6] px-8 py-4 text-base font-semibold shadow-lg shadow-violet-500/20 transition hover:scale-[1.02]"
                  >
                    พร้อมเปิดไพ่
                  </button>
                </div>
              )}

              {phase === "praying" && (
                <div className="flex flex-col items-center gap-6 text-center">
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0.6 }}
                    animate={{ scale: [0.85, 1.1, 0.85], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="h-32 w-32 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#f472b6] blur-[2px]"
                  />
                  <p className="text-sm uppercase tracking-[0.5em] text-white/60">กำลังเปิดไพ่...</p>
                </div>
              )}

              {(phase === "revealing" || phase === "done") && (
                <div className="w-full max-w-md">
                  <p className="text-center text-xs uppercase tracking-[0.4em] text-white/50">ชุดเลขมงคลของคุณ</p>
                  <h2 className="mt-2 text-center font-serif text-2xl">{baseline.topicLabelTh} · {baseline.dayKey}</h2>

                  <div className="mt-8 grid grid-cols-3 gap-3">
                    {baseline.cards.map((card, i) => {
                      const flipped = i < revealedCount;
                      return (
                        <div key={card.index} className="flex flex-col items-center gap-2">
                          <div className="relative h-40 w-24 [perspective:800px] sm:h-48 sm:w-28">
                            <motion.div
                              className="relative h-full w-full"
                              initial={false}
                              animate={{ rotateY: flipped ? 180 : 0 }}
                              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                              style={{ transformStyle: "preserve-3d" }}
                            >
                              {/* Back */}
                              <div className="absolute inset-0 overflow-hidden rounded-xl border border-white/15 shadow-lg [backface-visibility:hidden]">
                                <Image
                                  src="/lucky-numbers/back.png"
                                  alt="ไพ่หลังลายมงคล"
                                  fill
                                  sizes="(min-width: 640px) 112px, 96px"
                                  className="object-cover"
                                  priority={i < 3}
                                />
                              </div>
                              {/* Front */}
                              <div className="absolute inset-0 overflow-hidden rounded-xl border border-white/30 shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
                                <Image
                                  src={`/lucky-numbers/${card.digit}.png`}
                                  alt={`ไพ่เลข ${card.digit}`}
                                  fill
                                  sizes="(min-width: 640px) 112px, 96px"
                                  className="object-cover"
                                />
                              </div>
                            </motion.div>
                          </div>
                          <span className="text-[10px] uppercase tracking-widest text-white/50">{card.role}</span>
                        </div>
                      );
                    })}
                  </div>

                  {allRevealed && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className="mt-8 space-y-3 text-center"
                    >
                      <p className="text-sm text-white/70">
                        เลขชุดคู่ <span className="font-semibold text-white">{baseline.pair}</span> · เลขชุดสาม{" "}
                        <span className="font-semibold text-white">{baseline.triple}</span>
                      </p>
                      <button
                        type="button"
                        onClick={closeOverlay}
                        className="w-full max-w-xs rounded-full bg-white px-8 py-4 text-base font-semibold text-[#1a1a2e] shadow-lg transition hover:scale-[1.02]"
                      >
                        ดูคำทำนายเต็ม
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
