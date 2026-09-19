"use client";

import React, { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Loader2 } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/cn";
import { SITE_HOST } from "@/lib/site";

interface ShareableCardData {
  cardName: string;
  cardNameTh?: string;
  cardImage?: string;
  orientation: "upright" | "reversed";
  meaning: string;
  reading: string;
  question?: string;
  date: string;
  brand?: string;
}

interface ShareableCardProps {
  data: ShareableCardData;
  onShare?: () => void;
  className?: string;
}

const CARD_BG = "#1B1226";

export function ShareableCard({ data, onShare, className }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Returns the data URL so callers don't have to wait for the next render
  // to read it from state — `generatedImage` would still be null after
  // `await generateImage()` because React batches state updates.
  const generateImage = useCallback(async (): Promise<string | null> => {
    if (!cardRef.current) return null;

    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: CARD_BG,
      });
      setGeneratedImage(dataUrl);

      const link = document.createElement("a");
      link.download = `reffortune-${data.cardName.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();

      onShare?.();
      return dataUrl;
    } catch (error) {
      console.error("Failed to generate share image:", error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [data.cardName, onShare]);

  const handleNativeShare = useCallback(async () => {
    const dataUrl = generatedImage ?? (await generateImage());
    if (!dataUrl || !navigator.share) return;

    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "reffortune-reading.png", { type: "image/png" });

      await navigator.share({
        title: "ผลคำทำนายจาก REFFORTUNE",
        text: `${data.cardNameTh || data.cardName} — ${data.meaning}`,
        files: [file],
      });
    } catch {
      // User cancelled the share sheet — nothing to recover
    }
  }, [generatedImage, generateImage, data]);

  const orientationLabel = data.orientation === "upright" ? "ตั้งตรง" : "กลับหัว";

  return (
    <div className={cn("space-y-4", className)}>
      {/* Card captured by html-to-image */}
      <div
        ref={cardRef}
        className="w-[360px] rounded-sheet border border-gold/40 p-6 text-fg"
        style={{
          background: `radial-gradient(400px 260px at 50% -10%, rgba(110,76,122,0.35), transparent 70%), ${CARD_BG}`,
          boxShadow: "inset 0 0 0 1px rgba(226,196,138,0.12)",
        }}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <span className="font-serif text-sm font-semibold tracking-[0.04em] text-gold">
            {data.brand || "REFFORTUNE"}
          </span>
          <span className="text-xs text-fg-subtle">{data.date}</span>
        </div>

        {/* Question */}
        {data.question && (
          <div className="mb-4 rounded-card border border-line-faint bg-sunk p-3">
            <p className="eyebrow mb-1">คำถามของคุณ</p>
            <p className="line-clamp-2 text-sm text-fg">&ldquo;{data.question}&rdquo;</p>
          </div>
        )}

        {/* Card display */}
        <div className="relative mb-4">
          <div className="flex aspect-[2/3] items-center justify-center overflow-hidden rounded-[10px] border border-gold/60 bg-sunk">
            {data.cardImage ? (
              // eslint-disable-next-line @next/next/no-img-element -- plain <img> is required for html-to-image rasterisation
              <img
                src={data.cardImage}
                alt={data.cardName}
                className={cn(
                  "h-full w-full object-cover",
                  data.orientation === "reversed" && "rotate-180"
                )}
              />
            ) : (
              <p className="p-6 text-center text-sm text-fg-muted">{data.cardName}</p>
            )}
          </div>

          <div className="absolute right-3 top-3 rounded-pill border border-line bg-surface/90 px-3 py-1">
            <span className="text-xs font-medium text-gold">{orientationLabel}</span>
          </div>
        </div>

        {/* Card name */}
        <div className="mb-4 text-center">
          <h3 className="mb-1 font-display text-lg font-semibold text-fg">
            {data.cardNameTh || data.cardName}
          </h3>
          <p className="text-xs text-fg-subtle">{data.cardName}</p>
        </div>

        {/* Meaning */}
        <div className="mb-4 rounded-card border border-line-faint bg-sunk p-4">
          <p className="eyebrow mb-2">ความหมาย</p>
          <p className="text-sm leading-relaxed text-fg">{data.meaning}</p>
        </div>

        {/* Reading */}
        <div className="rounded-card border border-line bg-gold-soft p-4">
          <p className="eyebrow mb-2">คำทำนาย</p>
          <p className="text-sm leading-relaxed text-fg">{data.reading}</p>
        </div>

        {/* Footer */}
        <div className="mt-4 border-t border-line-faint pt-4 text-center">
          <p className="text-xs text-fg-subtle">ดูดวงกับเรฟ · {SITE_HOST}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={generateImage} disabled={isGenerating} className="flex-1">
          {isGenerating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" strokeWidth={1.5} />
          )}
          {isGenerating ? "กำลังสร้าง…" : "บันทึกรูป"}
        </Button>

        <Button
          onClick={handleNativeShare}
          disabled={isGenerating}
          variant="ghost"
          className="flex-1"
        >
          <Share2 className="size-4" strokeWidth={1.5} />
          แชร์
        </Button>
      </div>
    </div>
  );
}
