"use client";

import React, { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { TarotShareData } from "../types";
import {
  SHARE_FORMATS,
  buildFilename,
  type ShareFormatId,
} from "../common/formats";
import { ShareFormatToggle } from "../common/ShareFormatToggle";
import { QRCodeImage } from "../common/QRCode";

interface TarotShareableCardProps {
  data: TarotShareData;
  onShare?: (formatId: ShareFormatId) => void;
  className?: string;
}

const SHARE_URL = "https://www.reffortune.com";

export function TarotShareableCard({
  data,
  onShare,
  className,
}: TarotShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formatId, setFormatId] = useState<ShareFormatId>("story");
  const format = SHARE_FORMATS[formatId];

  const captureToDataUrl = useCallback(async () => {
    if (!cardRef.current) return null;
    const options: Parameters<typeof toPng>[1] = {
      quality: 1,
      pixelRatio: format.pixelRatio,
      backgroundColor: "#faf5ff",
      cacheBust: true,
    };
    if (format.cssHeight !== "auto") {
      options.canvasWidth = format.exportWidth;
      options.canvasHeight = format.exportHeight;
    }
    return toPng(cardRef.current, options);
  }, [format]);

  const generateImage = useCallback(async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await captureToDataUrl();
      if (!dataUrl) return;
      const link = document.createElement("a");
      link.download = buildFilename("tarot", formatId);
      link.href = dataUrl;
      link.click();
      onShare?.(formatId);
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [captureToDataUrl, formatId, onShare]);

  const handleNativeShare = useCallback(async () => {
    try {
      const dataUrl = await captureToDataUrl();
      if (!dataUrl) return;
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], buildFilename("tarot", formatId), {
        type: "image/png",
      });

      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          title: "ผลการเปิดไพ่ทาโรต์ — REFFORTUNE",
          text: `เปิดไพ่ ${data.cards.length} ใบ — ${data.cards
            .map((c) => c.nameTh || c.name)
            .join(", ")}`,
          files: [file],
        });
        onShare?.(formatId);
      } else {
        await generateImage();
      }
    } catch (err) {
      console.log("Share failed:", err);
      await generateImage();
    }
  }, [captureToDataUrl, data.cards, formatId, generateImage, onShare]);

  return (
    <div className={cn("space-y-4 w-full", className)}>
      <div className="flex flex-col items-center gap-2">
        <ShareFormatToggle value={formatId} onChange={setFormatId} />
        <p className="text-[11px] text-fg-subtle">{format.hint}</p>
      </div>

      <div className="flex justify-center overflow-x-auto py-2">
        <CardArtwork
          ref={cardRef}
          data={data}
          formatId={formatId}
          width={format.cssWidth}
          height={format.cssHeight}
        />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={generateImage}
          disabled={isGenerating}
          className="flex-1 bg-violet-500 hover:bg-violet-600 text-white h-12"
        >
          {isGenerating ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Download className="w-5 h-5 mr-2" />
          )}
          {isGenerating ? "กำลังสร้าง..." : "บันทึกรูป"}
        </Button>

        <Button
          onClick={handleNativeShare}
          disabled={isGenerating}
          variant="secondary"
          className="flex-1 border-violet-300 text-violet-600 hover:bg-violet-50 h-12"
        >
          <Share2 className="w-5 h-5 mr-2" />
          แชร์
        </Button>
      </div>
    </div>
  );
}

interface CardArtworkProps {
  data: TarotShareData;
  formatId: ShareFormatId;
  width: number;
  height: number | "auto";
}

const CardArtwork = React.forwardRef<HTMLDivElement, CardArtworkProps>(
  function CardArtwork({ data, formatId, width, height }, ref) {
    if (formatId === "story") {
      return (
        <StoryLayout
          ref={ref}
          data={data}
          width={width}
          height={height === "auto" ? undefined : height}
        />
      );
    }
    if (formatId === "square") {
      return (
        <SquareLayout
          ref={ref}
          data={data}
          width={width}
          height={height === "auto" ? undefined : height}
        />
      );
    }
    return <OriginalLayout ref={ref} data={data} width={width} />;
  },
);

interface LayoutProps {
  data: TarotShareData;
  width: number;
  height?: number;
}

const BACKGROUND_GRADIENT =
  "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)";
const STORY_GRADIENT =
  "linear-gradient(160deg, #1e1240 0%, #3b1d6e 45%, #6d28d9 100%)";

function Brand({ tone = "light" }: { tone?: "light" | "dark" }) {
  const colors =
    tone === "dark"
      ? { wrap: "text-white", sub: "text-violet-200" }
      : { wrap: "text-violet-700", sub: "text-violet-400" };
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className={cn("font-bold text-sm tracking-wide", colors.wrap)}>
          REFFORTUNE
        </span>
        <span className={cn("text-[10px]", colors.sub)}>ดูดวงกับเรฟ</span>
      </div>
    </div>
  );
}

function FooterCTA({ tone = "light" }: { tone?: "light" | "dark" }) {
  const isDark = tone === "dark";
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-2xl p-3",
        isDark
          ? "bg-white/10 border border-white/15"
          : "bg-white/70 border border-violet-100",
      )}
    >
      <div className="flex items-center gap-3">
        <QRCodeImage
          value={SHARE_URL}
          size={56}
          fg={isDark ? "#1e1240" : "#5b21b6"}
          bg="#ffffff"
        />
        <div className="flex flex-col">
          <span
            className={cn(
              "font-bold text-xs",
              isDark ? "text-white" : "text-violet-800",
            )}
          >
            ดูดวงต่อที่นี่
          </span>
          <span
            className={cn(
              "text-[11px]",
              isDark ? "text-violet-200" : "text-violet-500",
            )}
          >
            www.reffortune.com
          </span>
        </div>
      </div>
      <div
        className={cn(
          "text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md whitespace-nowrap",
          isDark ? "bg-white text-violet-700" : "bg-violet-600 text-white",
        )}
      >
        @REFFORTUNE
      </div>
    </div>
  );
}

function CardImage({
  card,
  className,
}: {
  card: TarotShareData["cards"][number];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden bg-gradient-to-br from-violet-100 to-purple-50 shadow-lg",
        className,
      )}
    >
      {card.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={card.image}
          alt={card.name}
          className={cn(
            "w-full h-full object-cover",
            card.orientation === "reversed" && "rotate-180",
          )}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-5xl">🔮</span>
        </div>
      )}
      {card.position && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-violet-900/80 to-transparent p-2">
          <p className="text-white text-[10px] font-medium text-center">
            {card.position}
          </p>
        </div>
      )}
    </div>
  );
}

const OriginalLayout = React.forwardRef<HTMLDivElement, LayoutProps>(
  function OriginalLayout({ data, width }, ref) {
    const isMulti = data.cards.length > 1;
    const isTen = data.cards.length === 10;
    return (
      <div
        ref={ref}
        className="p-6 rounded-3xl"
        style={{
          width,
          background: BACKGROUND_GRADIENT,
          boxShadow: "0 20px 60px rgba(124, 58, 237, 0.15)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <Brand />
          <span className="text-violet-400 text-xs font-medium">
            {data.date}
          </span>
        </div>

        {data.question && (
          <div className="mb-5 p-4 bg-white/70 rounded-2xl border border-violet-100">
            <p className="text-violet-500 text-xs font-semibold mb-1.5 uppercase tracking-wider">
              คำถาม
            </p>
            <p className="text-violet-800 text-sm leading-relaxed font-medium">
              &ldquo;{data.question}&rdquo;
            </p>
          </div>
        )}

        <div
          className={cn(
            "mb-5",
            isMulti
              ? isTen
                ? "grid grid-cols-5 gap-3"
                : "grid grid-cols-3 gap-3"
              : "flex justify-center",
          )}
        >
          {data.cards.map((card, index) => (
            <CardImage
              key={index}
              card={card}
              className={isMulti ? "aspect-[2/3]" : "w-48 aspect-[2/3]"}
            />
          ))}
        </div>

        <div className="mt-6 pt-5 border-t border-violet-200/50">
          <FooterCTA />
        </div>
      </div>
    );
  },
);

const SquareLayout = React.forwardRef<HTMLDivElement, LayoutProps>(
  function SquareLayout({ data, width, height }, ref) {
    const isMulti = data.cards.length > 1;
    return (
      <div
        ref={ref}
        className="rounded-3xl flex flex-col"
        style={{
          width,
          height,
          background: BACKGROUND_GRADIENT,
          boxShadow: "0 20px 60px rgba(124, 58, 237, 0.15)",
          padding: 28,
        }}
      >
        <div className="flex items-center justify-between">
          <Brand />
          <span className="text-violet-400 text-xs font-medium">
            {data.date}
          </span>
        </div>

        {data.question && (
          <div className="mt-4 p-3 bg-white/70 rounded-2xl border border-violet-100">
            <p className="text-violet-500 text-[10px] font-semibold mb-1 uppercase tracking-wider">
              คำถาม
            </p>
            <p className="text-violet-800 text-sm leading-relaxed font-medium line-clamp-2">
              &ldquo;{data.question}&rdquo;
            </p>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center my-4">
          <div
            className={cn(
              "w-full",
              isMulti
                ? data.cards.length >= 5
                  ? "grid grid-cols-5 gap-2"
                  : "grid grid-cols-3 gap-3"
                : "flex justify-center",
            )}
          >
            {data.cards.map((card, index) => (
              <CardImage
                key={index}
                card={card}
                className={
                  isMulti ? "aspect-[2/3]" : "w-[55%] aspect-[2/3]"
                }
              />
            ))}
          </div>
        </div>

        <FooterCTA />
      </div>
    );
  },
);

const StoryLayout = React.forwardRef<HTMLDivElement, LayoutProps>(
  function StoryLayout({ data, width, height }, ref) {
    const isMulti = data.cards.length > 1;
    return (
      <div
        ref={ref}
        className="rounded-3xl relative overflow-hidden flex flex-col text-white"
        style={{
          width,
          height,
          background: STORY_GRADIENT,
          boxShadow: "0 20px 60px rgba(30, 18, 64, 0.45)",
          padding: 28,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 40% at 50% 0%, rgba(244,200,106,0.18), transparent 70%), radial-gradient(80% 60% at 100% 100%, rgba(124,58,237,0.45), transparent 70%)",
          }}
        />

        <div className="relative flex items-center justify-between">
          <Brand tone="dark" />
          <span className="text-violet-200 text-xs font-medium">
            {data.date}
          </span>
        </div>

        <div className="relative mt-5 text-center">
          <p className="text-violet-200 text-[11px] font-semibold uppercase tracking-[0.2em]">
            {data.spreadType}
          </p>
          <h2
            className="mt-2 text-2xl font-bold"
            style={{ fontFamily: "var(--font-display, serif)" }}
          >
            คำทำนายของคุณ
          </h2>
        </div>

        {data.question && (
          <div className="relative mt-4 p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
            <p className="text-violet-200 text-[10px] font-semibold uppercase tracking-wider">
              คำถาม
            </p>
            <p className="mt-1 text-sm leading-relaxed line-clamp-3">
              &ldquo;{data.question}&rdquo;
            </p>
          </div>
        )}

        <div className="relative flex-1 flex items-center justify-center my-5">
          <div
            className={cn(
              "w-full",
              isMulti
                ? data.cards.length >= 5
                  ? "grid grid-cols-5 gap-2"
                  : "grid grid-cols-3 gap-3"
                : "flex justify-center",
            )}
          >
            {data.cards.map((card, index) => (
              <CardImage
                key={index}
                card={card}
                className={
                  isMulti ? "aspect-[2/3]" : "w-[65%] aspect-[2/3]"
                }
              />
            ))}
          </div>
        </div>

        <div className="relative mt-auto">
          <FooterCTA tone="dark" />
        </div>
      </div>
    );
  },
);
