"use client";

import React, { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { ChineseZodiacShareData } from "../types";
import { SITE_HOST } from "@/lib/site";

interface ChineseZodiacShareableCardProps {
  data: ChineseZodiacShareData;
  onShare?: () => void;
  className?: string;
}

export function ChineseZodiacShareableCard({ data, onShare, className }: ChineseZodiacShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const elementColors: Record<string, string> = {
    ไฟ: "from-red-500 to-orange-500",
    ดิน: "from-yellow-600 to-amber-600",
    โลหะ: "from-gray-400 to-slate-500",
    น้ำ: "from-blue-500 to-cyan-500",
    ไม้: "from-emerald-500 to-green-600",
  };

  const gradientColor = elementColors[data.element] || "from-red-500 to-orange-500";

  const generateImage = useCallback(async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 2, backgroundColor: "#fef2f2" });
      const link = document.createElement("a");
      link.download = `reffortune-chinese-zodiac-${data.animal}.png`;
      link.href = dataUrl;
      link.click();
      onShare?.();
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [data.animal, onShare]);

  const handleNativeShare = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 2, backgroundColor: "#fef2f2" });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "reffortune-chinese-zodiac.png", { type: "image/png" });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `ปีนักษัตร${data.animalTh} — REFFORTUNE`,
          text: `ปี ${data.year} ธาตุ${data.element}: ${data.prediction.slice(0, 100)}...`,
          files: [file],
        });
        onShare?.();
      } else {
        generateImage();
      }
    } catch {
      generateImage();
    }
  }, [data, generateImage, onShare]);

  return (
    <div className={cn("space-y-4", className)}>
      <div
        ref={cardRef}
        className="w-[360px] p-6 rounded-3xl"
        style={{
          background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 50%, #fecaca 100%)",
          boxShadow: "0 20px 60px rgba(239, 68, 68, 0.15)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className={cn("w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg", gradientColor)}>
              <span className="text-white text-lg">🧧</span>
            </div>
            <span className="text-red-700 font-bold text-sm tracking-wide">{data.brand || "REFFORTUNE"}</span>
          </div>
          <span className="text-red-400 text-xs font-medium">{data.date}</span>
        </div>

        {/* Year Badge */}
        <div className="flex justify-center mb-4">
          <span className="px-4 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-md">
            ปี {data.year}
          </span>
        </div>

        {/* Animal Display */}
        <div className="text-center mb-5">
          <div className={cn("inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br shadow-xl mb-3", gradientColor)}>
            <span className="text-6xl">{getAnimalEmoji(data.animal)}</span>
          </div>
          <h3 className="text-red-800 font-bold text-2xl">ปี{data.animalTh}</h3>
          <p className="text-red-500 text-sm">{data.animal}</p>
          <span className={cn("inline-block mt-2 px-3 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r", gradientColor)}>
            ธาตุ{data.element}
          </span>
        </div>

        {/* Prediction */}
        <div className="bg-white/80 rounded-2xl p-5 border border-red-100 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-red-500" />
            <p className="text-red-600 text-xs font-bold uppercase tracking-wider">คำทำนายปีนี้</p>
          </div>
          <p className="text-red-900 text-sm leading-relaxed">{data.prediction}</p>
        </div>

        {/* Lucky Items */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3 text-center border border-red-100">
            <p className="text-red-400 text-[10px] uppercase tracking-wider mb-1">เลขนำโชค</p>
            <div className="flex justify-center gap-1">
              {data.lucky.numbers.map((n, i) => (
                <span key={i} className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center">{n}</span>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-red-100">
            <p className="text-red-400 text-[10px] uppercase tracking-wider mb-1">สีมงคล</p>
            <p className="text-red-800 font-bold">{data.lucky.color}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-red-200/50 text-center">
          <p className="text-red-400 text-xs font-medium">🧧 ดูดวงปีจีนฟรีที่ {SITE_HOST}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button onClick={generateImage} disabled={isGenerating} className="flex-1 bg-red-500 hover:bg-red-600 text-white h-12">
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Download className="w-5 h-5 mr-2" />}
          {isGenerating ? "กำลังสร้าง..." : "บันทึกรูป"}
        </Button>
        <Button onClick={handleNativeShare} disabled={isGenerating} variant="secondary" className="flex-1 border-red-300 text-red-600 hover:bg-red-50 h-12">
          <Share2 className="w-5 h-5 mr-2" /> แชร์
        </Button>
      </div>
    </div>
  );
}

function getAnimalEmoji(animal: string): string {
  const emojis: Record<string, string> = {
    Rat: "🐭", Ox: "🐮", Tiger: "🐯", Rabbit: "🐰",
    Dragon: "🐲", Snake: "🐍", Horse: "🐴", Goat: "🐐",
    Monkey: "🐵", Rooster: "🐔", Dog: "🐶", Pig: "🐷",
    หนู: "🐭", วัว: "🐮", เสือ: "🐯", กระต่าย: "🐰",
    มังกร: "🐲", งู: "🐍", ม้า: "🐴", แพะ: "🐐",
    ลิง: "🐵", ไก่: "🐔", หมา: "🐶", หมู: "🐷",
  };
  return emojis[animal] || "🧧";
}
