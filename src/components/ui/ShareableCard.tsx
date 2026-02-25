"use client";

import React, { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Loader2 } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/cn";

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

export function ShareableCard({ data, onShare, className }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateImage = useCallback(async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#faf5ff",
      });
      setGeneratedImage(dataUrl);
      
      // Auto download
      const link = document.createElement("a");
      link.download = `reffortune-${data.cardName.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
      
      onShare?.();
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [data.cardName, onShare]);

  const handleNativeShare = useCallback(async () => {
    if (!generatedImage) {
      await generateImage();
    }
    
    if (navigator.share && generatedImage) {
      try {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const file = new File([blob], "reffortune-reading.png", { type: "image/png" });
        
        await navigator.share({
          title: "ผลคำทำนายจาก REFFORTUNE",
          text: `${data.cardNameTh || data.cardName} — ${data.meaning}`,
          files: [file],
        });
      } catch (err) {
        console.log("Share cancelled:", err);
      }
    }
  }, [generatedImage, generateImage, data]);

  const orientationLabel = data.orientation === "upright" ? "ตั้งตรง" : "กลับหัว";
  const orientationEmoji = data.orientation === "upright" ? "☀️" : "🌙";

  return (
    <div className={cn("space-y-4", className)}>
      {/* Hidden card for image generation */}
      <div
        ref={cardRef}
        className="w-[360px] p-6 rounded-3xl"
        style={{
          background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)",
          boxShadow: "0 20px 60px rgba(124, 58, 237, 0.15)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center">
              <span className="text-white text-sm">✦</span>
            </div>
            <span className="text-violet-700 font-semibold text-sm tracking-wide">
              {data.brand || "REFFORTUNE"}
            </span>
          </div>
          <span className="text-violet-400 text-xs">{data.date}</span>
        </div>

        {/* Question */}
        {data.question && (
          <div className="mb-4 p-3 bg-white/60 rounded-xl">
            <p className="text-violet-600 text-xs font-medium mb-1">คำถามของคุณ</p>
            <p className="text-violet-800 text-sm line-clamp-2">"{data.question}"</p>
          </div>
        )}

        {/* Card Display */}
        <div className="relative mb-4">
          <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-gradient-to-br from-violet-100 to-purple-50 flex items-center justify-center shadow-inner">
            {data.cardImage ? (
              <img
                src={data.cardImage}
                alt={data.cardName}
                className={cn(
                  "w-full h-full object-cover",
                  data.orientation === "reversed" && "rotate-180"
                )}
              />
            ) : (
              <div className="text-center p-6">
                <div className="text-6xl mb-2">🔮</div>
                <p className="text-violet-400 text-sm">{data.cardName}</p>
              </div>
            )}
          </div>
          
          {/* Orientation Badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-lg">
            <span className="text-violet-600 text-xs font-medium">
              {orientationEmoji} {orientationLabel}
            </span>
          </div>
        </div>

        {/* Card Info */}
        <div className="text-center mb-4">
          <h3 className="text-violet-800 font-bold text-lg mb-1">
            {data.cardNameTh || data.cardName}
          </h3>
          <p className="text-violet-500 text-xs">{data.cardName}</p>
        </div>

        {/* Meaning */}
        <div className="bg-white/70 rounded-xl p-4 mb-4">
          <p className="text-violet-600 text-xs font-medium mb-2 flex items-center gap-1">
            <span>✨</span> ความหมาย
          </p>
          <p className="text-violet-800 text-sm leading-relaxed">{data.meaning}</p>
        </div>

        {/* Reading */}
        <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl p-4 border border-violet-200">
          <p className="text-violet-600 text-xs font-medium mb-2 flex items-center gap-1">
            <span>🌟</span> คำทำนาย
          </p>
          <p className="text-violet-900 text-sm leading-relaxed">{data.reading}</p>
        </div>

        {/* Footer CTA */}
        <div className="mt-4 pt-4 border-t border-violet-200/50 text-center">
          <p className="text-violet-400 text-xs">
            🔮 ดูดวงฟรีได้ที่ reffortune.com
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={generateImage}
          disabled={isGenerating}
          className="flex-1 bg-violet-500 hover:bg-violet-600 text-white"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isGenerating ? "กำลังสร้าง..." : "บันทึกรูป"}
        </Button>
        
        <Button
          onClick={handleNativeShare}
          disabled={isGenerating}
          variant="secondary"
          className="flex-1 border-violet-300 text-violet-600 hover:bg-violet-50"
        >
          <Share2 className="w-4 h-4 mr-2" />
          แชร์
        </Button>
      </div>
    </div>
  );
}
