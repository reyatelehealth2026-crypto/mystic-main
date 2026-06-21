"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { parseCardTokens } from "@/lib/tarot/engine";
import { trackEvent } from "@/lib/analytics/tracking";
import { evaluatePaywall, recordFreeReading } from "@/lib/monetization/paywall";
import type { ReadingSession } from "@/lib/reading/types";
import { buildSavedTarotReading, removeReading, upsertReading } from "@/lib/library/storage";
import { HeartSave } from "@/components/ui/HeartSave";
import { Button } from "@/components/ui/Button";
import { ShareButton } from "@/components/ui/ShareButton";
import { TarotShareableCard } from "@/components/share/tarot/TarotShareableCard";
import { AppBar } from "@/components/nav/AppBar";
import { FeatureMenu } from "@/components/nav/FeatureMenu";
import { FAB } from "@/components/ui/FAB";
import { cn } from "@/lib/cn";
import { useHistoryStore } from "@/store/useHistoryStore";
import { SendToLine } from "./SendToLine";

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

export default function ResultClient() {
  const searchParams = useSearchParams();
  const count = Number(searchParams.get("count") ?? "0");
  const cardsToken = searchParams.get("cards") ?? "";
  const question = searchParams.get("question") ?? "";

  const [result, setResult] = useState<ReadingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [needCredits, setNeedCredits] = useState(false);
  const [authNeeded, setAuthNeeded] = useState(false);

  // Generate + charge server-side (paywall enforced; re-view of same cards free).
  useEffect(() => {
    setResult(null);
    setNeedCredits(false);
    setAuthNeeded(false);
    setLoading(true);
    if (!cardsToken || count <= 0) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/reading", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "tarot", params: { cardsToken, count: String(count), question }, dedupeKey: cardsToken }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data.ok) {
          setResult(data.reading as ReadingSession);
          window.dispatchEvent(new Event("rf:credits-changed"));
        } else if (res.status === 402) {
          setNeedCredits(true);
        } else if (res.status === 401) {
          setAuthNeeded(true);
        }
      } catch {
        /* ignore — handled by empty state below */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cardsToken, count, question]);

  const drawnCards = useMemo(() => parseCardTokens(cardsToken), [cardsToken]);

  const [aiReading, setAiReading] = useState<null | {
    summary: string;
    cardStructure: string;
  }>(null);

  const [savedId, setSavedId] = useState<string | null>(null);
  const [savedCreatedAt, setSavedCreatedAt] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);

  const paywall = useMemo(
    () =>
      result
        ? evaluatePaywall({
            vertical: "tarot",
            stage: "result",
            sessionId: result.sessionId,
            hasQuestion: question.trim().length > 0,
          })
        : null,
    [question, result]
  );

  const { addHistory } = useHistoryStore();
  const [hasSavedHistory, setHasSavedHistory] = useState(false);

  useEffect(() => {
    if (!result) return;
    recordFreeReading();
    trackEvent("reading_result_viewed", {
      vertical: "tarot",
      sessionId: result.sessionId,
      count,
      hasQuestion: question.trim().length > 0,
    });

    if (paywall?.show) {
      trackEvent("paywall_shown", {
        vertical: "tarot",
        sessionId: result.sessionId,
        reason: paywall.reason,
        ctaVariant: paywall.variant,
      });
    }
  }, [count, paywall, question, result]);

  // Initialize reading text **without** calling any AI APIs.
  // We use the deterministic pipeline summary + per-card meanings only.
  useEffect(() => {
    if (!result) return;

    const fallback = {
      summary: result.summary,
      cardStructure: drawnCards
        .map((drawn, i) => {
          const orient = drawn.orientation === "upright" ? "ตั้งตรง" : "กลับหัว";
          return `${i + 1}) ${drawn.card.nameTh ?? drawn.card.name} (${orient}) — ${
            drawn.orientation === "upright" ? drawn.card.meaningUpright : drawn.card.meaningReversed
          }`;
        })
        .join("\n"),
    };

    setAiReading(fallback);

    // Auto save to local history store once
    if (!hasSavedHistory && fallback.summary) {
      const mode = searchParams.get("mode");
      addHistory({
        type: mode === "love" ? "love-tarot" : "tarot",
        summary: fallback.summary,
        details: { 
          question: question || undefined,
          cards: drawnCards.map(c => c.card.nameTh || c.card.name).join(", ")
        }
      });
      setHasSavedHistory(true);
    }

    if (savedId && result) {
      upsertReading(
        buildSavedTarotReading({
          id: savedId,
          createdAt: savedCreatedAt ?? undefined,
          count,
          cardsToken,
          question,
          aiSummary: fallback.summary,
          aiCardStructure: fallback.cardStructure,
          snapshot: {
            input: { count, cardsToken, question },
            session: result,
            ai: { summary: fallback.summary, cardStructure: fallback.cardStructure },
          },
        })
      );
    }
  }, [cardsToken, count, question, result, drawnCards, savedCreatedAt, savedId]);

  // Follow-up chat with AI is disabled for tarot results.
  // This stub keeps state types intact without calling any API.
  async function sendFollowUpQuestion() {
    const q = chatInput.trim();
    if (!q) return;
    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: q },
      { role: "assistant", text: "ตอนนี้โหมดถามต่อด้วย AI ถูกปิดใช้งานอยู่ค่ะ" },
    ]);
    setChatInput("");
  }

  function handleSave() {
    if (!result) return;

    const id =
      savedId ??
      (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()));

    const createdAt = savedCreatedAt ?? new Date().toISOString();

    setSavedId(id);
    setSavedCreatedAt(createdAt);

    upsertReading(
      buildSavedTarotReading({
        id,
        createdAt,
        count,
        cardsToken,
        question,
        aiSummary: aiReading?.summary,
        aiCardStructure: aiReading?.cardStructure,
        snapshot: {
          input: { count, cardsToken, question },
          session: result,
          ai: aiReading ? { summary: aiReading.summary, cardStructure: aiReading.cardStructure } : undefined,
        },
      })
    );
    setSaveToast("Saved to library");
    setTimeout(() => setSaveToast(null), 1600);
  }

  function toggleSaved() {
    if (savedId) {
      removeReading(savedId);
      setSavedId(null);
      setSavedCreatedAt(null);
      setSaveToast("Removed");
      setTimeout(() => setSaveToast(null), 1200);
      return;
    }
    handleSave();
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-lg px-5 py-16 text-center">
        <div className="text-3xl">🔮</div>
        <p className="mt-3 text-sm text-fg-muted">กำลังเปิดไพ่...</p>
      </main>
    );
  }

  if (authNeeded || needCredits) {
    return (
      <main className="mx-auto w-full max-w-lg px-5 py-8">
        <div className="rounded-2xl border border-accent/30 bg-accent-soft p-5 text-center">
          <div className="text-3xl">🔮</div>
          <p className="mt-2 text-sm text-fg">
            {authNeeded ? "กรุณาเข้าสู่ระบบด้วย LINE ก่อนดูไพ่" : "แต้มไม่พอ — เติมแต้มก่อนนะคะ"}
          </p>
          {needCredits ? (
            <Link href="/pricing" className="mt-4 block">
              <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700">เติมแต้ม</Button>
            </Link>
          ) : null}
          <Link href="/tarot" className="mt-3 block">
            <Button className="w-full" variant="ghost">กลับไปเลือกไพ่</Button>
          </Link>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="mx-auto w-full max-w-lg px-5 py-8">
        <div className="rounded-2xl border border-danger/30 bg-danger/10 p-4">
          <p className="text-sm text-danger">ไม่พบข้อมูลไพ่ที่สมบูรณ์ กรุณากลับไปเปิดไพ่ใหม่อีกครั้ง</p>
          <Link href="/tarot" className="block mt-3">
            <Button className="w-full" size="lg">กลับไปเลือกไพ่</Button>
          </Link>
        </div>
      </main>
    );
  }

  const cardWidth = count <= 3 ? "w-[100px]" : count <= 5 ? "w-[80px]" : "w-16";
  const isTenCardSpread = count === 10;

  return (
    <main className="mx-auto w-full max-w-lg">
      <header className="px-5 pt-7 pb-3">
        <AppBar
          title="ผลไพ่ทาโรต์"
          className="px-0 pt-0 pb-0"
          right={<HeartSave saved={!!savedId} onToggle={toggleSaved} label="Save reading" />}
        />
        <h1 className="mt-1 text-xl font-bold tracking-tight text-fg">ผลการเปิดไพ่ {count} ใบ</h1>
      </header>

      <div className="px-5 pb-6">
      {saveToast && (
        <div className="mt-3 rounded-xl border border-success/25 bg-success/10 p-3 text-sm text-success">
          {saveToast}
        </div>
      )}

      {/* ── Drawn Cards Row ── */}
      {drawnCards.length > 0 && (
        <div className="mt-5 flex justify-center gap-3 overflow-x-auto pb-2">
          {drawnCards.map((drawn, index) => (
            <div
              key={`${drawn.card.id}-${index}`}
              className={cn(
                "flex-shrink-0 overflow-hidden rounded-xl border border-border bg-bg-elevated text-center",
                cardWidth
              )}
            >
              {drawn.card.image ? (
                <Image
                  src={drawn.card.image}
                  alt={drawn.card.name}
                  width={180}
                  height={270}
                  className={cn(
                    "h-auto w-full object-cover",
                    drawn.orientation === "reversed" && "rotate-180"
                  )}
                />
              ) : (
                <div className="flex h-24 items-center justify-center bg-surface">
                  <span className="text-2xl">🔮</span>
                </div>
              )}
              <p className="truncate px-1 py-1 text-[10px] font-medium text-fg-muted">
                {drawn.card.nameTh ?? drawn.card.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Question ── */}
      {question && (
        <div className="mt-4 rounded-2xl border border-border bg-bg-elevated p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">คำถาม</p>
          <p className="mt-1 text-sm text-fg">{question}</p>
        </div>
      )}

      {/* Tarot AI interpretations hidden by config */}

      {/* ── Shareable Result Card ── */}
      {drawnCards.length > 0 && aiReading && (
        <section className="mt-6 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/5 to-accent/10 p-4">
          <h2 className="text-sm font-bold text-fg flex items-center gap-2">
            <span>✨</span> แชร์ผลคำทำนาย
          </h2>
          <p className="mt-1 text-xs text-fg-subtle">บันทึกหรือแชร์ผลไพ่เป็นรูปภาพสวยงาม</p>
          
          <div className="mt-4 flex justify-center">
            <TarotShareableCard
              data={{
                vertical: "tarot",
                cards: drawnCards.map(d => ({
                  name: d.card.name,
                  nameTh: d.card.nameTh,
                  image: d.card.image,
                  orientation: d.orientation,
                  meaning: d.orientation === "upright" 
                    ? d.card.meaningUpright 
                    : d.card.meaningReversed,
                  // Card positions (สถานการณ์/อุปสรรค/... etc.) are intentionally omitted
                  // to avoid showing extra text on the result/share image.
                })),
                reading: aiReading.summary,
                question: question || undefined,
                date: new Date().toLocaleDateString("th-TH", { 
                  day: "numeric", 
                  month: "short", 
                  year: "numeric" 
                }),
                brand: "REFFORTUNE",
                spreadType: count === 1 ? "ไพ่รายวัน" : count === 3 ? "ไพ่ 3 ใบ" : count === 10 ? "Celtic Cross" : `${count} ใบ`,
              }}
              onShare={() => trackEvent("share_card_generated", { 
                vertical: "tarot", 
                card: drawnCards[0]?.card.name,
                count,
              })}
            />
          </div>
        </section>
      )}

      {/* Tarot AI chat is disabled and hidden by config */}

      {/* ── Bottom actions ── */}
      <div className="mt-6 flex flex-col gap-3">
        {drawnCards.length > 0 ? (
          <SendToLine
            cards={drawnCards.map((d) => ({
              name: d.card.nameTh ?? d.card.name,
              image: d.card.image ?? "",
              reversed: d.orientation === "reversed",
            }))}
          />
        ) : null}
        {/* Keep only library save + new reading to avoid duplicate share buttons */}
        <Button className="w-full" size="lg" onClick={toggleSaved}>
          {savedId ? "Saved" : "Save to Library"}
        </Button>
        <Link href="/tarot" className="block">
          <Button className="w-full" size="lg" variant="ghost">
            New Reading
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        <FeatureMenu />
      </div>
      </div>

      <FAB />
    </main>
  );
}
