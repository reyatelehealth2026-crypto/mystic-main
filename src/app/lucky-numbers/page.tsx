"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RefreshCw, Share2, Download, ChevronLeft, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toPng } from "html-to-image";
import { cn } from "@/lib/cn";
import {
  analyseLuckyDigits,
  shuffleDigits,
  type LuckyDigit,
  type LuckyDigitAnalysis,
  type LuckyDigitCount,
} from "@/lib/lucky-numbers/engine";
import { trackEvent } from "@/lib/analytics/tracking";
import { AppBar } from "@/components/nav/AppBar";
import { Button, buttonVariants } from "@/components/ui/Button";
import { FeatureMenu } from "@/components/nav/FeatureMenu";
import { FAB } from "@/components/ui/FAB";

type Stage = "choose-count" | "picking" | "result";

const PICK_CHOICES: LuckyDigitCount[] = [2, 3, 4];

// Stagger between each card flip during the reveal animation (ms).
const REVEAL_STAGGER_MS = 850;
// Pause after a pick before reshuffling the next round (ms).
const PICK_TRANSITION_MS = 750;

const CARD_CLS = "rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-soft)]";

export default function LuckyNumbersPage() {
  const [stage, setStage] = useState<Stage>("choose-count");
  const [count, setCount] = useState<LuckyDigitCount>(2);
  const [deck, setDeck] = useState<LuckyDigit[]>(() => shuffleDigits());
  const [picked, setPicked] = useState<LuckyDigit[]>([]);
  const [pickingIndex, setPickingIndex] = useState<number | null>(null);

  const [analysis, setAnalysis] = useState<LuckyDigitAnalysis | null>(null);
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
    setRevealCount(0);
    trackEvent("reading_submitted", {
      vertical: "lucky-numbers",
      step: `choose_count:${n}`,
    });
  }, []);

  // When user taps a card: lift + glow, then commit and either reshuffle
  // or transition to the result stage. We never reveal the digit at pick time.
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
  useEffect(() => {
    if (stage !== "result" || !analysis) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= analysis.digits.length; i += 1) {
      timers.push(setTimeout(() => setRevealCount(i), i * REVEAL_STAGGER_MS));
    }
    return () => timers.forEach(clearTimeout);
  }, [stage, analysis]);

  const resetAll = useCallback(() => {
    setStage("choose-count");
    setPicked([]);
    setPickingIndex(null);
    setDeck(shuffleDigits());
    setAnalysis(null);
    setRevealCount(0);
  }, []);

  return (
    <main className="mx-auto w-full max-w-lg">
      <header className="px-5 pt-7 pb-3">
        <AppBar title="ไพ่เลขมงคล" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">ไพ่เลขมงคล</h1>
        <p className="mt-1 text-sm text-fg-muted">หยิบไพ่จากครึ่งวงกลม รับชุดเลขเสริมดวงแบบสด ๆ</p>
      </header>

      <div className="px-5 pb-10">
        {stage === "choose-count" && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn("mt-6 space-y-5", CARD_CLS)}
          >
            <div>
              <h2 className="text-lg font-semibold text-fg">เลือกจำนวนหลักก่อนเปิดไพ่</h2>
              <p className="mt-1 text-sm text-fg-muted">
                ระบบจะให้คุณหยิบไพ่จาก 10 ใบ (เลข 0-9) ทีละใบ ครบจำนวนแล้วจึงเปิดเผยผลพร้อมกัน
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {PICK_CHOICES.map((c) => (
                <motion.button
                  key={c}
                  type="button"
                  onClick={() => startPicking(c)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "h-auto flex flex-col items-center justify-center gap-1 py-6",
                  )}
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
              className={cn(CARD_CLS, "relative overflow-hidden")}
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={resetAll}
                  className="inline-flex items-center gap-1 text-sm text-accent"
                >
                  <ChevronLeft className="h-4 w-4" /> เปลี่ยนจำนวน
                </button>
                <p className="text-sm font-medium text-fg">
                  หยิบใบที่ {Math.min(picked.length + 1, count)} / {count}
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-accent/20 bg-accent/5 px-4 py-3 text-center text-sm leading-relaxed text-fg-muted">
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
                          : "border-accent/20 bg-accent/5",
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
                        <div className="flex h-full items-center justify-center text-xs text-accent/40">
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
            />
          </section>
        )}

        {stage === "result" && analysis && (
          <ResultView
            analysis={analysis}
            revealCount={revealCount}
            onReset={resetAll}
          />
        )}
      </div>

      <FAB />
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
}

function SemicircleDeck({ roundKey, deck, pickingIndex, onPick }: SemicircleDeckProps) {
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

  // Half-circle (top hemisphere): spread from -75° to +75°.
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

      <p className="mt-2 text-center text-xs text-fg-muted">
        แตะใบที่รู้สึกว่า &ldquo;ใช่&rdquo; ที่สุด
      </p>
    </div>
  );
}

function deckLayoutForWidth(width: number) {
  const w = Math.max(280, Math.min(width, 460));
  // Card width clamps so 10 cards stay touch-friendly without overlapping.
  const cardW = Math.round(Math.max(48, Math.min(72, w / 6.2)));
  const cardH = Math.round(cardW * 1.55);
  // Keep the outermost card inside the container.
  const safeHalfWidth = w / 2 - cardW * 0.55;
  const radius = Math.round(
    Math.max(110, Math.min(safeHalfWidth / Math.sin((75 * Math.PI) / 180), 210)),
  );
  // Container height fits the arc plus card body comfortably.
  const height = Math.max(290, radius + cardH * 0.45 + 30);
  return { radius, cardW, cardH, height };
}

// ────────────────────────────────────────────────────────────────────────
// Result View — face-down cards flip one by one, share with image
// ────────────────────────────────────────────────────────────────────────

interface ResultViewProps {
  analysis: LuckyDigitAnalysis;
  revealCount: number;
  onReset: () => void;
}

function ResultView({ analysis, revealCount, onReset }: ResultViewProps) {
  const allRevealed = revealCount >= analysis.digits.length;
  const shareableRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<null | "share" | "download">(null);

  const generateImage = useCallback(async () => {
    if (!shareableRef.current) return null;
    return toPng(shareableRef.current, {
      quality: 1,
      pixelRatio: 2,
      backgroundColor: "#0b0b1a",
      cacheBust: true,
    });
  }, []);

  const handleDownload = useCallback(async () => {
    setBusy("download");
    try {
      const dataUrl = await generateImage();
      if (!dataUrl) return;
      const link = document.createElement("a");
      link.download = `reffortune-lucky-${analysis.combined}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setBusy(null);
    }
  }, [analysis.combined, generateImage]);

  const handleShare = useCallback(async () => {
    setBusy("share");
    try {
      const dataUrl = await generateImage();
      if (!dataUrl) return;

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `reffortune-lucky-${analysis.combined}.png`, { type: "image/png" });

      const navAny = navigator as Navigator & {
        canShare?: (data: ShareData) => boolean;
      };
      if (navAny.share && navAny.canShare?.({ files: [file] })) {
        await navAny.share({
          title: "ไพ่เลขมงคลของฉัน — REFFORTUNE",
          text: `เลขมงคลที่ฉันหยิบได้: ${analysis.combined}`,
          files: [file],
        });
        return;
      }

      // Fallback: download the image.
      const link = document.createElement("a");
      link.download = `reffortune-lucky-${analysis.combined}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // Swallow user-cancelled share dialogs.
    } finally {
      setBusy(null);
    }
  }, [analysis.combined, generateImage]);

  return (
    <section className="mt-6 space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={CARD_CLS}
      >
        <h2 className="text-lg font-semibold text-fg">ชุดเลขมงคลของคุณ</h2>
        <p className="mt-1 text-sm text-fg-muted">
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
                  className="text-xs uppercase tracking-widest text-accent"
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
              className="mt-6 text-center text-3xl font-semibold tracking-[0.3em] text-accent"
            >
              {analysis.combined}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {allRevealed && (
          <motion.div
            key="actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            <Button
              disabled={busy !== null}
              className="w-full flex items-center justify-center gap-2 disabled:opacity-60"
              size="lg"
              onClick={handleShare}
            >
              {busy === "share" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
              แชร์รูป
            </Button>
            <Button
              variant="outline"
              disabled={busy !== null}
              className="w-full flex items-center justify-center gap-2 disabled:opacity-60"
              size="lg"
              onClick={handleDownload}
            >
              {busy === "download" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              บันทึกรูป
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              size="lg"
              onClick={onReset}
            >
              <RefreshCw className="w-4 h-4" />
              เริ่มใหม่
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {allRevealed && (
        <div className="mt-8">
          <FeatureMenu />
        </div>
      )}

      {/* Off-screen shareable card — rendered once all flips have happened
          so html-to-image captures the final state. */}
      {allRevealed && (
        <ShareableCardOffscreen
          ref={shareableRef}
          analysis={analysis}
        />
      )}
    </section>
  );
}

// Off-screen card with deterministic styling for html-to-image rendering.
const ShareableCardOffscreen = function ShareableCardOffscreenInner({
  ref,
  analysis,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  analysis: LuckyDigitAnalysis;
}) {
  return (
    <div className="pointer-events-none fixed -left-[2000px] top-0 z-[-1]">
      <div
        ref={ref}
        style={{
          width: 540,
          padding: 36,
          borderRadius: 32,
          background: "linear-gradient(160deg, #1a1a2e 0%, #2a1657 50%, #0b0b1a 100%)",
          color: "#f5e6c8",
          fontFamily: "ui-serif, Georgia, serif",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          {/* Brand mark from public/logo.png — survives html-to-image because
              the file is on the same origin and rendered via a raw <img>. */}
          <img
            src="/logo.png"
            alt="REFFORTUNE"
            style={{ height: 56, width: "auto", objectFit: "contain", filter: "drop-shadow(0 4px 18px rgba(255,215,140,0.35))" }}
          />
          <span style={{ fontSize: 12, color: "#c2a96b", letterSpacing: "0.2em" }}>LUCKY NUMBERS</span>
        </div>

        <p style={{ textAlign: "center", fontSize: 14, letterSpacing: "0.35em", color: "#d4b97a", marginBottom: 4 }}>
          เลขมงคลของฉัน
        </p>
        <p style={{ textAlign: "center", fontSize: 56, fontWeight: 700, letterSpacing: "0.3em", color: "#fff5d6", marginBottom: 28 }}>
          {analysis.combined}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 28 }}>
          {analysis.digits.map((d, i) => (
            <img
              key={i}
              src={`/lucky-numbers/${d}.png`}
              alt=""
              style={{
                width: 96,
                height: 148,
                objectFit: "cover",
                borderRadius: 12,
                border: "1px solid rgba(212,185,122,0.45)",
                boxShadow: "0 0 24px rgba(255,215,140,0.25)",
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "16px 20px",
            background: "rgba(255, 215, 140, 0.08)",
            border: "1px solid rgba(212, 185, 122, 0.25)",
            borderRadius: 16,
            marginBottom: 24,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#c2a96b" }}>ผลรวม</p>
            <p style={{ fontSize: 26, fontWeight: 600, color: "#fff5d6", marginTop: 4 }}>{analysis.sum}</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#c2a96b" }}>เลขราก</p>
            <p style={{ fontSize: 26, fontWeight: 600, color: "#fff5d6", marginTop: 4 }}>{analysis.root}</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#c2a96b" }}>จำนวนหลัก</p>
            <p style={{ fontSize: 26, fontWeight: 600, color: "#fff5d6", marginTop: 4 }}>{analysis.count}</p>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#a89368", letterSpacing: "0.18em" }}>
          ✨ ขอพรขอเลขนำโชค ที่ reffortune.com
        </p>
      </div>
    </div>
  );
};
