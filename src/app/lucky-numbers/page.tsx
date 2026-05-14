"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, RefreshCw, Share2, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { cn } from "@/lib/cn";
import {
  analyseLuckyDigits,
  shuffleDigits,
  type LuckyDigit,
  type LuckyDigitAnalysis,
  type LuckyDigitCount,
} from "@/lib/lucky-numbers/engine";
import { trackEvent } from "@/lib/analytics/tracking";

type AiReading = { summary: string; cardStructure: string };

type Stage = "choose-count" | "picking" | "result";

const PICK_CHOICES: LuckyDigitCount[] = [2, 4];

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

  const [stage, setStage] = useState<Stage>("choose-count");
  const [count, setCount] = useState<LuckyDigitCount>(2);
  const [deck, setDeck] = useState<LuckyDigit[]>(() => shuffleDigits());
  const [picked, setPicked] = useState<LuckyDigit[]>([]);
  const [revealedIndex, setRevealedIndex] = useState<number | null>(null);

  const [analysis, setAnalysis] = useState<LuckyDigitAnalysis | null>(null);
  const [aiReading, setAiReading] = useState<AiReading | null>(null);

  useEffect(() => {
    trackEvent("reading_start", { vertical: "lucky-numbers", step: "form_view" });
  }, []);

  const startPicking = useCallback((n: LuckyDigitCount) => {
    setCount(n);
    setPicked([]);
    setRevealedIndex(null);
    setDeck(shuffleDigits());
    setStage("picking");
    setAnalysis(null);
    setAiReading(null);
    trackEvent("reading_submitted", {
      vertical: "lucky-numbers",
      step: `choose_count:${n}`,
    });
  }, []);

  const handlePick = useCallback(
    (idx: number) => {
      if (revealedIndex !== null) return;
      setRevealedIndex(idx);
    },
    [revealedIndex],
  );

  const goNext = useCallback(() => {
    if (revealedIndex === null) return;
    const chosen = deck[revealedIndex];
    const nextPicked = [...picked, chosen];

    if (nextPicked.length >= count) {
      const result = analyseLuckyDigits(nextPicked);
      setPicked(nextPicked);
      setAnalysis(result);
      setStage("result");
      trackEvent("reading_result_viewed", { vertical: "lucky-numbers" });
      return;
    }

    setPicked(nextPicked);
    setRevealedIndex(null);
    setDeck(shuffleDigits());
  }, [count, deck, picked, revealedIndex]);

  // Fetch AI reading when we land on the result stage
  useEffect(() => {
    if (stage !== "result" || !analysis) return;

    const controller = new AbortController();
    const fallback: AiReading = {
      summary: `ชุดเลขมงคล ${analysis.combined} • ผลรวม ${analysis.sum} • เลขราก ${analysis.root}`,
      cardStructure: analysis.reading,
    };

    const fallbackTimer = setTimeout(() => {
      setAiReading((prev) => prev ?? fallback);
    }, 8000);

    fetch("/api/ai/lucky-numbers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ digits: analysis.digits }),
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

    return () => {
      controller.abort();
      clearTimeout(fallbackTimer);
    };
  }, [stage, analysis]);

  const resetAll = useCallback(() => {
    setStage("choose-count");
    setPicked([]);
    setRevealedIndex(null);
    setDeck(shuffleDigits());
    setAnalysis(null);
    setAiReading(null);
  }, []);

  const themed = useMemo(() => {
    const isAlt = isPastel || isRainbow;
    return {
      page: cn("min-h-screen", isPastel ? "bg-transparent" : isRainbow ? "bg-transparent" : "bg-white"),
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
        "h-12 rounded-xl font-semibold shadow-lg transition-all active:scale-[0.98]",
        isPastel
          ? "bg-white/30 backdrop-blur text-white border border-white/50 hover:bg-white/50"
          : isRainbow
          ? "bg-gradient-to-r from-[#ff00ff] to-[#00ffff] text-white shadow-[rgba(255,0,255,0.3)]"
          : "bg-violet-600 text-white shadow-violet-200 hover:bg-violet-700 hover:shadow-xl",
      ),
      ghostBtn: cn(
        "h-12 rounded-xl font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2",
        isPastel
          ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
          : isRainbow
          ? "bg-[#1a1a2e] border border-[rgba(255,0,255,0.3)] text-white hover:border-[rgba(255,0,255,0.5)]"
          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
      ),
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

      <div className="px-5 pb-10 pt-4">
        <section className="space-y-1">
          <h1 className={themed.title}>ไพ่เลขมงคล</h1>
          <p className={themed.muted}>หยิบไพ่จากครึ่งวงกลม รับชุดเลขเสริมดวงแบบสด ๆ</p>
        </section>

        {/* Stage 1: choose count */}
        {stage === "choose-count" && (
          <section className={cn("mt-6 space-y-5", themed.cardBox)}>
            <div>
              <h2 className={themed.sectionTitle}>เลือกจำนวนหลักก่อนเปิดไพ่</h2>
              <p className={cn("mt-1", themed.mutedSm)}>
                ระบบจะให้คุณหยิบไพ่จาก 9 ใบ ทีละใบ ครบจำนวนแล้วเริ่มทำนายให้
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {PICK_CHOICES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => startPicking(c)}
                  className={cn(themed.primaryBtn, "flex flex-col items-center justify-center gap-1 py-6")}
                >
                  <span className="text-3xl font-bold">{c}</span>
                  <span className="text-xs uppercase tracking-widest opacity-80">หลัก</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Stage 2: picking */}
        {stage === "picking" && (
          <section className="mt-6 space-y-5">
            <div className={themed.cardBox}>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={resetAll}
                  className={cn("inline-flex items-center gap-1 text-sm", isPastel || isRainbow ? "text-white/80" : "text-violet-600")}
                >
                  <ChevronLeft className="h-4 w-4" /> เปลี่ยนจำนวน
                </button>
                <p className={cn("text-sm", isPastel || isRainbow ? "text-white/80" : "text-gray-600")}>
                  หยิบใบที่ {picked.length + 1} / {count}
                </p>
              </div>

              {/* Picked-so-far chips */}
              <div className="mt-4 flex justify-center gap-2">
                {Array.from({ length: count }).map((_, i) => {
                  const digit = picked[i];
                  return (
                    <div
                      key={i}
                      className={cn(
                        "relative h-16 w-12 overflow-hidden rounded-md border",
                        digit
                          ? "border-white/30 shadow"
                          : isPastel
                          ? "border-white/30 bg-white/10"
                          : isRainbow
                          ? "border-[rgba(255,0,255,0.3)] bg-[#0f0f1a]"
                          : "border-violet-200 bg-violet-50",
                      )}
                    >
                      {digit ? (
                        <Image
                          src={`/lucky-numbers/${digit}.png`}
                          alt={`ไพ่เลข ${digit}`}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-white/40">{i + 1}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <SemicircleDeck
              deck={deck}
              revealedIndex={revealedIndex}
              onPick={handlePick}
              onNext={goNext}
              isAlt={isPastel || isRainbow}
              themed={themed}
              roundNumber={picked.length + 1}
              total={count}
            />
          </section>
        )}

        {/* Stage 3: result */}
        {stage === "result" && analysis && (
          <section className="mt-6 space-y-4">
            <div className={themed.cardBox}>
              <h2 className={themed.sectionTitle}>ชุดเลขมงคลของคุณ</h2>
              <p className={cn("mt-2", themed.mutedSm)}>
                ผลรวม {analysis.sum} • เลขราก {analysis.root}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {analysis.digits.map((d, i) => (
                  <div key={`${i}-${d}`} className="relative h-28 w-20 overflow-hidden rounded-lg border border-white/20 shadow">
                    <Image src={`/lucky-numbers/${d}.png`} alt={`ไพ่เลข ${d}`} fill sizes="80px" className="object-cover" />
                  </div>
                ))}
              </div>
              <p className={cn("mt-4 text-center text-2xl font-semibold", isPastel || isRainbow ? "text-white" : "text-violet-700")}>
                {analysis.combined}
              </p>
            </div>

            <div className={themed.cardBox}>
              <h2 className={themed.sectionTitle}>คำทำนาย</h2>
              {!aiReading ? (
                <p className={cn("mt-2", themed.mutedSm)}>กำลังสรุปคำทำนาย...</p>
              ) : (
                <>
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
                </>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                className={cn(themed.primaryBtn, "w-full flex items-center justify-center gap-2")}
                onClick={() => {
                  const text = aiReading?.summary ?? `เลขมงคลของฉัน: ${analysis.combined}`;
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
              <button type="button" className={cn(themed.ghostBtn, "w-full")} onClick={resetAll}>
                <RefreshCw className="w-4 h-4" />
                เริ่มใหม่
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

interface SemicircleDeckProps {
  deck: LuckyDigit[];
  revealedIndex: number | null;
  onPick: (idx: number) => void;
  onNext: () => void;
  isAlt: boolean;
  themed: { primaryBtn: string };
  roundNumber: number;
  total: number;
}

function SemicircleDeck({ deck, revealedIndex, onPick, onNext, isAlt, themed, roundNumber, total }: SemicircleDeckProps) {
  // 9 cards arranged on a half-circle (top hemisphere), -75° to +75°
  const ANGLE_RANGE = 150; // degrees
  const START_ANGLE = -ANGLE_RANGE / 2;
  const STEP = ANGLE_RANGE / (deck.length - 1);
  const RADIUS = 130; // px — outward from arc center

  return (
    <div className="relative">
      <div className="relative mx-auto h-72 w-full max-w-md">
        {deck.map((digit, idx) => {
          const angle = START_ANGLE + STEP * idx;
          const isRevealed = revealedIndex === idx;
          const isFaded = revealedIndex !== null && !isRevealed;

          return (
            <motion.button
              key={`${roundNumber}-${idx}`}
              type="button"
              onClick={() => onPick(idx)}
              disabled={revealedIndex !== null}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: isFaded ? 0.25 : 1,
                y: 0,
                scale: isRevealed ? 1.12 : 1,
              }}
              transition={{ duration: 0.35, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
              whileHover={revealedIndex === null ? { y: -8 } : undefined}
              className="absolute left-1/2 top-full origin-bottom"
              style={{
                transform: `translateX(-50%) rotate(${angle}deg) translateY(-${RADIUS}px) rotate(${-angle}deg)`,
              }}
              aria-label={`ไพ่ใบที่ ${idx + 1}`}
            >
              <div className="relative h-32 w-20 [perspective:800px] sm:h-36 sm:w-22">
                <motion.div
                  className="relative h-full w-full"
                  initial={false}
                  animate={{ rotateY: isRevealed ? 180 : 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-0 overflow-hidden rounded-xl border border-white/15 shadow-lg [backface-visibility:hidden]">
                    <Image src="/lucky-numbers/back.png" alt="ไพ่หลังลายมงคล" fill sizes="80px" className="object-cover" priority={idx < 5} />
                  </div>
                  <div className="absolute inset-0 overflow-hidden rounded-xl border border-white/30 shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <Image src={`/lucky-numbers/${digit}.png`} alt={`ไพ่เลข ${digit}`} fill sizes="80px" className="object-cover" />
                  </div>
                </motion.div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {revealedIndex !== null ? (
          <motion.div
            key="next"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="mt-6 flex flex-col items-center gap-3"
          >
            <p className={cn("text-center text-sm", isAlt ? "text-white/80" : "text-gray-600")}>
              คุณหยิบได้เลข <span className="text-xl font-bold">{deck[revealedIndex]}</span>
            </p>
            <button type="button" onClick={onNext} className={cn(themed.primaryBtn, "w-full max-w-xs")}>
              {roundNumber >= total ? "ดูคำทำนาย" : "ต่อไป"}
            </button>
          </motion.div>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn("mt-6 text-center text-sm", isAlt ? "text-white/60" : "text-gray-500")}
          >
            แตะใบที่รู้สึก &quot;ใช่&quot; ที่สุด
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
