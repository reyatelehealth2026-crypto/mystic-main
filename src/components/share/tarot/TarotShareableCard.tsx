"use client";

import React, { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { TarotShareData } from "../types";

interface TarotShareableCardProps {
  data: TarotShareData;
  onShare?: () => void;
  className?: string;
}

export function TarotShareableCard({ data, onShare, className }: TarotShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = useCallback(async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#faf5ff",
      });
      
      const link = document.createElement("a");
      link.download = `reffortune-tarot-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      
      onShare?.();
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [onShare]);

  const handleNativeShare = useCallback(async () => {
    if (!cardRef.current) return;
    
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#faf5ff",
      });
      
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "reffortune-tarot.png", { type: "image/png" });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "ผลการเปิดไพ่ทาโรต์ — REFFORTUNE",
          text: `เปิดไพ่ ${data.cards.length} ใบ — ${data.cards.map(c => c.nameTh || c.name).join(", ")}`,
          files: [file],
        });
        onShare?.();
      } else {
        generateImage();
      }
    } catch (err) {
      console.log("Share failed:", err);
      generateImage();
    }
  }, [data, generateImage, onShare]);

  const isMultiCard = data.cards.length > 1;
  const isTenCardSpread = isMultiCard && data.cards.length === 10;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Hidden card for image generation */}
      <div
        ref={cardRef}
        className="w-[400px] p-6 rounded-3xl"
        style={{
          background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)",
          boxShadow: "0 20px 60px rgba(124, 58, 237, 0.15)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-violet-700 font-bold text-sm tracking-wide">
              {data.brand || "REFFORTUNE"}
            </span>
          </div>
          <span className="text-violet-400 text-xs font-medium">{data.date}</span>
        </div>

        {/* Question */}
        {data.question && (
          <div className="mb-5 p-4 bg-white/70 rounded-2xl border border-violet-100">
            <p className="text-violet-500 text-xs font-semibold mb-1.5 uppercase tracking-wider">คำถาม</p>
            <p className="text-violet-800 text-sm leading-relaxed font-medium">"{data.question}"</p>
          </div>
        )}

        {/* Cards Display - Multi card layout */}
        <div className={cn(
          "mb-5",
          isMultiCard
            ? isTenCardSpread
              ? "grid grid-cols-5 gap-3"
              : "grid grid-cols-3 gap-3"
            : "flex justify-center"
        )}>
          {data.cards.map((card, index) => (
            <div
              key={index}
              className={cn(
                "relative rounded-2xl overflow-hidden bg-gradient-to-br from-violet-100 to-purple-50 shadow-lg",
                isMultiCard ? "aspect-[2/3]" : "w-48 aspect-[2/3]"
              )}
            >
              {card.image ? (
                <img
                  src={card.image}
                  alt={card.name}
                  className={cn(
                    "w-full h-full object-cover",
                    card.orientation === "reversed" && "rotate-180"
                  )}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-5xl">🔮</span>
                </div>
              )}
              
              {/* Position label for multi-card */}
              {isMultiCard && card.position && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-violet-900/80 to-transparent p-2">
                  <p className="text-white text-[10px] font-medium text-center">{card.position}</p>
                </div>
              )}
              
              {/* Orientation badge */}
              <div className="absolute top-2 right-2 bg-white/95 backdrop-blur px-2 py-1 rounded-full shadow-md">
                <span className="text-violet-600 text-[10px] font-bold">
                  {card.orientation === "upright" ? "☀️" : "🌙"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Card names intentionally hidden for share image (only show visual cards) */}

        {/* Spread Type intentionally hidden to avoid extra text like "Celtic Cross" */}

        {/* Tarot AI prediction intentionally omitted: image shows เฉพาะไพ่ + คำถาม */}

        {/* Footer CTA */}
        <div className="mt-6 pt-5 border-t border-violet-200/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-violet-800 font-bold text-sm">ดูดวงฟรี 24 ชม.</span>
            <span className="text-violet-500 text-xs mt-0.5">www.reffortune.com</span>
          </div>
          <div className="bg-violet-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md">
            แอดไลน์ @REFFORTUNE
          </div>
        </div>
      </div>

      {/* Action Buttons */}
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
