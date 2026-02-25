"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HeartSave } from "@/components/ui/HeartSave";
import { ShareButton } from "@/components/ui/ShareButton";
import { useLibrary } from "@/lib/library/useLibrary";
import { buildSavedDailyCardReading, removeReading, upsertReading } from "@/lib/library/storage";
import { TAROT_DECK } from "@/lib/tarot/deck";
import { cardMeaning } from "@/lib/tarot/engine";
import { DrawnCard } from "@/lib/tarot/types";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "reffortune_daily_card";
const BACK_IMAGE = "https://www.reffortune.com/icon/backcard.png";

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function drawOneCard(): DrawnCard {
  const card = TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)] ?? TAROT_DECK[0];
  return {
    card,
    orientation: "upright", // No reversed cards
  };
}

function loadTodayCard(): DrawnCard | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.date !== getTodayKey()) return null;
    const card = TAROT_DECK.find((c) => c.id === parsed.cardId);
    if (!card) return null;
    return { card, orientation: parsed.orientation };
  } catch {
    return null;
  }
}

function saveTodayCard(drawn: DrawnCard) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      date: getTodayKey(),
      cardId: drawn.card.id,
      orientation: drawn.orientation,
    }),
  );
}

function normalizeText(value: unknown): string {
  if (typeof value === "string") return value;
  return "";
}

export default function DailyCardPage() {
  const lib = useLibrary();
  const [savedId, setSavedId] = useState<string | null>(null);

  const [drawn, setDrawn] = useState<DrawnCard | null>(null);
  const [alreadyDrawn, setAlreadyDrawn] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiReading, setAiReading] = useState<null | { summary: string; cardStructure: string }>(null);

  useEffect(() => {
    const saved = loadTodayCard();
    if (saved) {
      setDrawn(saved);
      setAlreadyDrawn(true);
      setFlipped(true);
      setShowDetails(true);
    } else {
      setDrawn(drawOneCard());
    }
  }, []);

  // Fetch AI reading for the day
  useEffect(() => {
    if (!drawn || !flipped) return;

    const controller = new AbortController();
    const dayKey = getTodayKey();

    // Fallback based on engine
    const fallback = {
      summary: cardMeaning(drawn),
      cardStructure: "เปิดไพ่สำเร็จ รับพลังงานบวกสำหรับวันนี้",
    };

    const fallbackTimer = setTimeout(() => {
      setAiReading((prev) => prev ?? fallback);
    }, 7000);

    fetch("/api/ai/daily-card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: drawn.card.id, orientation: drawn.orientation, dayKey }),
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
    };
  }, [drawn, flipped]);

  useEffect(() => {
    const dayKey = getTodayKey();
    const existing = lib.entries.find(
      (entry) =>
        entry.type === "daily_card" &&
        (entry.data as any).dayKey === dayKey
    );
    setSavedId(existing?.id ?? null);
  }, [lib.entries]);

  const handleFlip = useCallback(() => {
    if (flipped || !drawn) return;
    saveTodayCard(drawn);
    setAlreadyDrawn(true);
    setFlipped(true);
    setTimeout(() => setShowDetails(true), 600);
  }, [flipped, drawn]);

  const orientationLabel = drawn?.orientation === "upright" ? "ตั้งตรง" : "กลับหัว";

  const shareText = drawn
    ? `ไพ่รายวัน: ${drawn.card.nameTh ?? drawn.card.name} (${orientationLabel}) — MysticFlow`
    : "";
  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://tarot.reffortune.com/daily-card";

  const handleSharePlatform = useCallback(
    (platform: string) => {
      const text = encodeURIComponent(shareText);
      const url = encodeURIComponent(shareUrl);

      switch (platform) {
        case "line":
          window.open(`https://line.me/R/msg/text/?${text}%0A${url}`, "_blank");
          break;
        case "facebook":
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, "_blank");
          break;
      }
    },
    [shareText, shareUrl],
  );

  const toggleSaved = useCallback(() => {
    if (!drawn) return;

    if (savedId) {
      removeReading(savedId);
      setSavedId(null);
      return;
    }

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());

    const dayKey = getTodayKey();
    const title = `Daily Card — ${drawn.card.nameTh ?? drawn.card.name}`;

    upsertReading(
      buildSavedDailyCardReading({
        id,
        dayKey,
        cardId: drawn.card.id,
        orientation: drawn.orientation,
        title,
        summary: aiReading?.summary ?? cardMeaning(drawn),
        tags: [drawn.card.name, "daily"],
        snapshot: {
          dayKey,
          cardId: drawn.card.id,
          orientation: drawn.orientation,
          output: {
            message: aiReading?.summary ?? cardMeaning(drawn),
            focus: [],
            advice: { action: aiReading?.cardStructure || "", avoid: "" },
          },
        },
      })
    );

    setSavedId(id);
  }, [aiReading, drawn, savedId]);

  if (!drawn) {
    return (
      <main className="mx-auto w-full max-w-lg px-5 py-10">
        <p className="text-center text-sm text-fg-subtle">กำลังเตรียมไพ่...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-lg px-5 py-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold text-fg">
            ไพ่รายวัน
          </h1>
          <p className="mt-1 text-sm text-fg-subtle">
            {alreadyDrawn
              ? "คุณเปิดไพ่วันนี้แล้ว กลับมาเปิดใหม่ได้พรุ่งนี้"
              : "แตะที่ไพ่เพื่อเปิดพลังงานประจำวัน"}
          </p>
        </div>

        <div className="pt-1">
          <HeartSave saved={!!savedId} onToggle={toggleSaved} label="Save daily card" />
        </div>
      </div>

      {/* ── Card with flip animation ── */}
      <div className="mt-6 flex justify-center" style={{ perspective: "1000px" }}>
        <button
          type="button"
          onClick={handleFlip}
          disabled={flipped}
          className="relative cursor-pointer transition-transform duration-700"
          style={{
            width: "200px",
            height: "310px",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
          aria-label="เปิดไพ่รายวัน"
        >
          {/* Back face */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl border-2 border-accent-soft shadow-[var(--shadow-soft)] bg-bg-elevated"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Image src={BACK_IMAGE} alt="หลังไพ่" fill sizes="200px" className="object-cover" />
            {!flipped && (
              <div className="absolute inset-0 rounded-2xl bg-accent/5 animate-pulse" />
            )}
            {!flipped && (
              <div className="absolute inset-x-0 bottom-4 text-center">
                <span className="rounded-xl px-3 py-1 text-[11px] font-bold text-accent-ink bg-accent">
                  แตะเพื่อเปิด
                </span>
              </div>
            )}
          </div>

          {/* Front face */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl border-2 border-accent/20 shadow-[var(--shadow-soft)] bg-bg-elevated"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            {drawn.card.image ? (
              <Image 
                src={drawn.card.image} 
                alt={drawn.card.name} 
                fill 
                sizes="200px" 
                className={cn("object-cover", drawn.orientation === "reversed" && "rotate-180")} 
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-accent-soft">
                <span className="text-4xl">🔮</span>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* ── Card details (shown after flip) ── */}
      {showDetails && (
        <div className="mt-6 space-y-4" style={{ animation: "tarot-fade-up 0.5s ease-out both" }}>
          <div className="text-center">
            <h2 className="text-lg font-bold text-fg">
              {drawn.card.nameTh ?? drawn.card.name}
            </h2>
            <p className="mt-0.5 text-sm text-fg-muted">
              {drawn.card.name} • {orientationLabel}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-bg-elevated p-5">
            <h3 className="text-sm font-bold text-accent">สารจากจักรวาล</h3>
            {aiReading ? (
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-fg-muted">
                {aiReading.summary}
              </p>
            ) : (
              <div className="mt-2 flex items-center gap-2">
                <div className="h-3 w-3 animate-pulse rounded-full bg-accent" />
                <p className="text-sm text-fg-subtle">กำลังสรุปคำทำนาย...</p>
              </div>
            )}
          </div>

          {aiReading?.cardStructure && (
            <div className="rounded-2xl border border-border bg-bg-elevated p-5">
              <h3 className="text-sm font-bold text-fg">รายละเอียดเพิ่มเติม</h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-fg-muted">
                {aiReading.cardStructure}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={savedId ? "secondary" : "primary"}
                size="lg"
                className="w-full"
                onClick={toggleSaved}
              >
                {savedId ? "บันทึกแล้ว" : "บันทึก"}
              </Button>
              <ShareButton
                variant="secondary"
                size="lg"
                className="w-full"
                shareData={{
                  title: "ไพ่รายวันของฉัน",
                  text: aiReading?.summary || "ดูดวงรายวันกับ MysticFlow",
                  url: typeof window !== "undefined" ? window.location.href : "",
                }}
              />
            </div>

            <div className="mt-2 flex items-center justify-center gap-3">
              <p className="text-xs text-fg-subtle">แชร์ไปยัง:</p>
              <button type="button" onClick={() => handleSharePlatform("line")} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#06C755] transition hover:scale-110" aria-label="Share LINE">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 5.82 2 10.5c0 3.26 2.36 6.1 5.88 7.46-.08.72-.5 2.7-.57 3.12-.1.1.2.1.42.1.17-.1 2.4-1.6 3.3-2.3.2.0.5.0.8.0 5.5 0 10-3.8 10-8.5S17.5 2 12 2z" /></svg>
              </button>
              <button type="button" onClick={() => handleSharePlatform("facebook")} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1877F2] transition hover:scale-110" aria-label="Share Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setFlipped(false);
                setShowDetails(false);
                setAlreadyDrawn(false);
                setAiReading(null);
                setDrawn(drawOneCard());
              }}
              className="mt-2 w-full rounded-2xl border border-border-strong py-3 text-sm font-semibold text-fg-muted transition hover:bg-surface"
            >
              เปิดใหม่ (Debug เท่านั้น)
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
