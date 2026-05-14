"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

// Stagger between each card flip during the reveal animation (ms).
const REVEAL_STAGGER_MS = 900;
// Pause after a pick before reshuffling the next round (ms).
const PICK_TRANSITION_MS = 750;

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
  const [pickingIndex, setPickingIndex] = useState<number | null>(null);

  const [analysis, setAnalysis] = useState<LuckyDigitAnalysis | null>(null);
  const [aiReading, setAiReading] = useState<AiReading | null>(null);
  const [revealCount, setRevealCount] = useState(0);

  useEffect(() => {
    trackEvent("reading_start", { vertical: "lucky-numbers", step: "form_view" });
  }, []);

  const startPicking = useCallback((n: LuckyDigitCount) => {
    setCount(n);
    setPicked([]);
    setPickingIndex(null);
    setDeck(shuffleDigits());
    setStage("picking");
    setAnalysis(null);
    setAiReading(null);
    setRevealCount(0);
    trackEvent("reading_submitted", {
      vertical: "lucky-numbers",
      step: `choose_count:${n}`,
    });
  }, []);

  // When user taps a card: animate the pick (don't reveal the digit yet),
  // then commit and either reshuffle or transition to result.
  const handlePick = useCallback(
    (idx: number) => {
      if (pickingIndex !== null) return;
      setPickingIndex(idx);
      const chosen = deck[idx];

      setTimeout(() => {
        setPicked((prev) => {
          const next = [...prev, chosen];
          if (next.length >= count) {
            const result = analyseLuckyDigits(next);
            setAnalysis(result);
            setRevealCount(0);
            setStage("result");
            trackEvent("reading_result_viewed", { vertical: "lucky-numbers" });
          } else {
            setDeck(shuffleDigits());
            setPickingIndex(null);
          }
          return next;
        });
      }, PICK_TRANSITION_MS);
    },
    [count, deck, pickingIndex],
  );

  // Auto-reveal cards one-by-one once we land on the result stage.
  // revealCount is reset to 0 by handlePick/resetAll before this fires.
  useEffect(() => {
    if (stage !== "result" || !analysis) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= analysis.digits.length; i += 1) {
      timers.push(setTimeout(() => setRevealCount(i), i * REVEAL_STAGGER_MS));
    }
    return () => timers.forEach(clearTimeout);
  }, [stage, analysis]);

  // Fetch AI reading once on result stage (parallel to the flip animation).
  useEffect(() => {
    if (stage !== "result" || !analysis) return;

    const controller = new AbortController();
    const fallback: AiReading = {
      summary: `ชุดเลขมงคล ${analysis.combined} • ผลรวม ${analysis.sum} • เลขราก ${analysis.root}`,
      cardStructure: analysis.reading,
    };

    const fallbackTimer = setTimeout(() => {
      setAiReading((prev) => prev ?? fallback);
    }, 9000);

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
    setPickingIndex(null);
    setDeck(shuffleDigits());
    setAnalysis(null);
    setAiReading(null);
    setRevealCount(0);
  }, []);

  const themed = useMemo(() => {
    const isAlt = isPastel || isRainbow;
    return {
      page: cn(
        "min-h-screen",
        isPastel ? "bg-transparent" : isRainbow ? "bg-transparent" : "bg-white",
      ),
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

        {stage === "choose-count" && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn("mt-6 space-y-5", themed.cardBox)}
          >
            <div>
              <h2 className={themed.sectionTitle}>เลือกจำนวนหลักก่อนเปิดไพ่</h2>
              <p className={cn("mt-1", themed.mutedSm)}>
                ระบบจะให้คุณหยิบไพ่จาก 9 ใบ ทีละใบ ครบจำนวนแล้วจึงเปิดเผยผลทำนายพร้อมกัน
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {PICK_CHOICES.map((c) => (
                <motion.button
                  key={c}
                  type="button"
                  onClick={() => startPicking(c)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(themed.primaryBtn, "flex flex-col items-center justify-center gap-1 py-6")}
                >
                  <span className="text-3xl font-bold">{c}</span>
                  <span className="text-xs uppercase tracking-widest opacity-80">หลัก</span>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}

        {stage === "picking" && (
          <section className="mt-6 space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={cn(themed.cardBox, "relative overflow-hidden")}
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={resetAll}
                  className={cn(
                    "inline-flex items-center gap-1 text-sm",
                    isPastel || isRainbow ? "text-white/80" : "text-violet-600",
                  )}
                >
                  <ChevronLeft className="h-4 w-4" /> เปลี่ยนจำนวน
                </button>
                <p className={cn("text-sm font-medium", isPastel || isRainbow ? "text-white" : "text-gray-700")}>
                  หยิบใบที่ {Math.min(picked.length + 1, count)} / {count}
                </p>
              </div>

              <div className={cn(
                "mt-4 rounded-2xl border px-4 py-3 text-center text-sm leading-relaxed",
                isPastel
                  ? "border-white/30 bg-white/10 text-white/90"
                  : isRainbow
                  ? "border-[rgba(255,215,0,0.35)] bg-[rgba(255,215,0,0.06)] text-[#ffe79a]"
                  : "border-amber-200 bg-amber-50/60 text-amber-800",
              )}>
                🪔 หลับตา หายใจเข้าลึก ๆ ระลึกถึง<strong>เทวดาประจำตัว</strong>หรือ<strong>สิ่งศักดิ์สิทธิ์ที่คุณนับถือ</strong>
                <br />
                น้อมจิตขอพร ขอเลขนำโชค แล้วแตะใบที่รู้สึก &ldquo;ใช่&rdquo; ที่สุด
              </div>

              <div className="mt-4 flex justify-center gap-2">
                {Array.from({ length: count }).map((_, i) => {
                  const filled = i < picked.length;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "relative h-16 w-12 overflow-hidden rounded-md border transition",
                        filled
                          ? "border-white/40 shadow-[0_0_18px_rgba(167,139,250,0.45)]"
                          : isPastel
                          ? "border-white/30 bg-white/10"
                          : isRainbow
                          ? "border-[rgba(255,0,255,0.25)] bg-[#0f0f1a]"
                          : "border-violet-200 bg-violet-50",
                      )}
                    >
                      {filled && (
                        <Image
                          src="/lucky-numbers/back.png"
                          alt="ไพ่ที่หยิบไว้"
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                      {!filled && (
                        <div className={cn(
                          "flex h-full items-center justify-center text-xs",
                          isPastel || isRainbow ? "text-white/40" : "text-violet-300",
                        )}>
                          {i + 1}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <SemicircleDeck
              roundKey={picked.length}
              deck={deck}
              pickingIndex={pickingIndex}
              onPick={handlePick}
              isAlt={isPastel || isRainbow}
            />
          </section>
        )}

        {stage === "result" && analysis && (
          <ResultView
            analysis={analysis}
            revealCount={revealCount}
            aiReading={aiReading}
            themed={themed}
            isAlt={isPastel || isRainbow}
            isRainbow={isRainbow}
            isPastel={isPastel}
            onReset={resetAll}
          />
        )}
      </div>
    </main>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Semicircle Deck — face-down fan that responds to viewport width
// ────────────────────────────────────────────────────────────────────────

interface SemicircleDeckProps {
  roundKey: number;
  deck: LuckyDigit[];
  pickingIndex: number | null;
  onPick: (idx: number) => void;
  isAlt: boolean;
}

function SemicircleDeck({ roundKey, deck, pickingIndex, onPick, isAlt }: SemicircleDeckProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [{ radius, cardW, cardH, height }, setLayout] = useState(() => deckLayoutForWidth(360));

  useEffect(() => {
    const measure = () => {
      const w = containerRef.current?.clientWidth ?? 360;
      setLayout(deckLayoutForWidth(w));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Half-circle (top), -75° to +75°.
  const ANGLE_RANGE = 150;
  const START_ANGLE = -ANGLE_RANGE / 2;
  const STEP = ANGLE_RANGE / (deck.length - 1);

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-md">
      <div className="relative mx-auto w-full" style={{ height }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`fan-${roundKey}`}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {deck.map((digit, idx) => {
              const angle = START_ANGLE + STEP * idx;
              const isPicking = pickingIndex === idx;
              const isOther = pickingIndex !== null && !isPicking;

              return (
                <div
                  key={`${roundKey}-${idx}`}
                  className="absolute left-1/2 bottom-0"
                  style={{
                    transform: `translateX(-50%) rotate(${angle}deg) translateY(-${radius}px) rotate(${-angle}deg)`,
                    transformOrigin: "50% 100%",
                  }}
                >
                  <motion.button
                    type="button"
                    onClick={() => onPick(idx)}
                    disabled={pickingIndex !== null}
                    initial={{ opacity: 0, y: 24, scale: 0.85 }}
                    animate={{
                      opacity: isOther ? 0.18 : 1,
                      y: isPicking ? -42 : 0,
                      scale: isPicking ? 1.18 : 1,
                      filter: isPicking ? "brightness(1.4)" : "brightness(1)",
                    }}
                    transition={{
                      duration: 0.55,
                      delay: pickingIndex === null ? 0.04 * idx : 0,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={pickingIndex === null ? { y: -10, scale: 1.06 } : undefined}
                    aria-label={`ไพ่ใบที่ ${idx + 1}`}
                    className="relative block"
                    style={{ width: cardW, height: cardH }}
                    aria-hidden={digit === undefined}
                  >
                    <span
                      className={cn(
                        "pointer-events-none absolute -inset-2 rounded-2xl opacity-0 blur-md transition-opacity duration-500",
                        isPicking ? "opacity-100" : "",
                      )}
                      style={{
                        background:
                          "radial-gradient(circle at 50% 50%, rgba(255,215,140,0.65) 0%, rgba(167,139,250,0.35) 45%, transparent 75%)",
                      }}
                    />
                    <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                      <Image
                        src="/lucky-numbers/back.png"
                        alt="ไพ่หลังลายมงคล"
                        fill
                        sizes={`${cardW}px`}
                        className="object-cover"
                        priority={idx < 5}
                      />
                    </div>
                  </motion.button>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className={cn("mt-2 text-center text-xs", isAlt ? "text-white/55" : "text-gray-400")}>
        แตะใบที่รู้สึกว่า &ldquo;ใช่&rdquo; ที่สุด
      </p>
    </div>
  );
}

function deckLayoutForWidth(width: number) {
  const w = Math.max(280, Math.min(width, 460));
  // Card width scales with container; clamp so it stays touch-friendly.
  const cardW = Math.round(Math.max(54, Math.min(78, w / 5.5)));
  const cardH = Math.round(cardW * 1.55);
  // Radius keeps the outermost card inside the container; also leave room for glow.
  const safeHalfWidth = w / 2 - cardW * 0.55;
  const radius = Math.round(Math.max(110, Math.min(safeHalfWidth / Math.sin((75 * Math.PI) / 180), 200)));
  // Container needs to fit the arc plus the card height.
  const arcHeight = Math.round(radius * Math.cos((75 * Math.PI) / 180));
  const height = radius + cardH * 0.4 + arcHeight * 0 + 30; // tuned to comfortably contain the fan
  return { radius, cardW, cardH, height: Math.max(280, height) };
}

// ────────────────────────────────────────────────────────────────────────
// Result View — face-down cards flip one by one, summary fades in after
// ────────────────────────────────────────────────────────────────────────

interface ResultViewProps {
  analysis: LuckyDigitAnalysis;
  revealCount: number;
  aiReading: AiReading | null;
  themed: {
    cardBox: string;
    sectionTitle: string;
    mutedSm: string;
    primaryBtn: string;
    ghostBtn: string;
  };
  isAlt: boolean;
  isRainbow: boolean;
  isPastel: boolean;
  onReset: () => void;
}

function ResultView({ analysis, revealCount, aiReading, themed, isAlt, isRainbow, isPastel, onReset }: ResultViewProps) {
  const allRevealed = revealCount >= analysis.digits.length;

  return (
    <section className="mt-6 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={themed.cardBox}
      >
        <h2 className={themed.sectionTitle}>ชุดเลขมงคลของคุณ</h2>
        <p className={cn("mt-1", themed.mutedSm)}>
          {allRevealed
            ? `ผลรวม ${analysis.sum} • เลขราก ${analysis.root}`
            : "ค่อย ๆ เปิดไพ่ทีละใบ..."}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {analysis.digits.map((d, i) => {
            const flipped = i < revealCount;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="relative h-32 w-20 [perspective:900px] sm:h-36 sm:w-24">
                  <motion.div
                    className="relative h-full w-full"
                    initial={false}
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="absolute inset-0 overflow-hidden rounded-xl border border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.35)] [backface-visibility:hidden]">
                      <Image src="/lucky-numbers/back.png" alt="ไพ่หลัง" fill sizes="96px" className="object-cover" />
                    </div>
                    <div className="absolute inset-0 overflow-hidden rounded-xl border border-amber-300/40 shadow-[0_0_24px_rgba(255,215,140,0.45)] [transform:rotateY(180deg)] [backface-visibility:hidden]">
                      <Image src={`/lucky-numbers/${d}.png`} alt={`ไพ่เลข ${d}`} fill sizes="96px" className="object-cover" />
                    </div>
                  </motion.div>
                </div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: flipped ? 1 : 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className={cn("text-xs uppercase tracking-widest", isAlt ? "text-white/60" : "text-violet-500")}
                >
                  ใบที่ {i + 1}
                </motion.span>
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {allRevealed && (
            <motion.p
              key="combined"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={cn("mt-6 text-center text-3xl font-semibold tracking-[0.3em]", isAlt ? "text-white" : "text-violet-700")}
            >
              {analysis.combined}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {allRevealed && (
          <motion.div
            key="ai-reading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className={themed.cardBox}
          >
            <h2 className={themed.sectionTitle}>คำทำนาย</h2>
            {!aiReading ? (
              <p className={cn("mt-2", themed.mutedSm)}>กำลังสรุปคำทำนาย...</p>
            ) : (
              <>
                <p className={cn("mt-2 whitespace-pre-line text-sm leading-relaxed", isAlt ? "text-white/80" : "text-gray-600")}>
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
                  <p className={cn("text-xs font-medium", isAlt ? "text-white" : "text-violet-600")}>รายละเอียด</p>
                  <p className={cn("mt-2 whitespace-pre-line text-sm leading-relaxed", isAlt ? "text-white/80" : "text-gray-600")}>
                    {aiReading.cardStructure}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {allRevealed && (
          <motion.div
            key="actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
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
            <button type="button" className={cn(themed.ghostBtn, "w-full")} onClick={onReset}>
              <RefreshCw className="w-4 h-4" />
              เริ่มใหม่
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
