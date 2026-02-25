"use client";

import React, { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Loader2, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { HoroscopeShareData } from "../types";

interface HoroscopeShareableCardProps {
  data: HoroscopeShareData;
  onShare?: () => void;
  className?: string;
}

export function HoroscopeShareableCard({ data, onShare, className }: HoroscopeShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const elementColors: Record<string, string> = {
    ไฟ: "from-red-500 to-orange-500",
    ดิน: "from-emerald-500 to-green-600",
    ลม: "from-sky-500 to-blue-600",
    น้ำ: "from-cyan-500 to-blue-500",
  };

  const elementBg: Record<string, string> = {
    ไฟ: "#fef2f2",
    ดิน: "#f0fdf4",
    ลม: "#f0f9ff",
    น้ำ: "#ecfeff",
  };

  const gradientColor = elementColors[data.element] || "from-violet-500 to-purple-600";
  const bgColor = elementBg[data.element] || "#faf5ff";

  const generateImage = useCallback(async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 2, backgroundColor: bgColor });
      const link = document.createElement("a");
      link.download = `reffortune-horoscope-${data.zodiac}.png`;
      link.href = dataUrl;
      link.click();
      onShare?.();
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [bgColor, data.zodiac, onShare]);

  const handleNativeShare = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 2, backgroundColor: bgColor });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "reffortune-horoscope.png", { type: "image/png" });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `ดวงชะตา ${data.zodiacTh} — REFFORTUNE`,
          text: `ธาตุ${data.element}: ${data.prediction.slice(0, 100)}...`,
          files: [file],
        });
        onShare?.();
      } else {
        generateImage();
      }
    } catch {
      generateImage();
    }
  }, [bgColor, data, generateImage, onShare]);

  return (
    <div className={cn("space-y-4", className)}>
      <div
        ref={cardRef}
        className="w-[360px] p-6 rounded-3xl"
        style={{
          background: `linear-gradient(135deg, ${bgColor} 0%, #ffffff 50%, ${bgColor} 100%)`,
          boxShadow: `0 20px 60px rgba(0, 0, 0, 0.1)`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className={cn("w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg", gradientColor)}>
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-700 font-bold text-sm tracking-wide">{data.brand || "REFFORTUNE"}</span>
          </div>
          <span className="text-gray-400 text-xs font-medium">{data.date}</span>
        </div>

        {/* Zodiac Display */}
        <div className="text-center mb-5">
          <div className={cn("inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br shadow-xl mb-3", gradientColor)}>
            <span className="text-4xl">{getZodiacEmoji(data.zodiac)}</span>
          </div>
          <h3 className="text-gray-800 font-bold text-2xl">{data.zodiacTh}</h3>
          <p className="text-gray-500 text-sm">{data.zodiac}</p>
          <span className={cn("inline-block mt-2 px-3 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r", gradientColor)}>
            ธาตุ{data.element}
          </span>
        </div>

        {/* Prediction */}
        <div className="bg-white/80 rounded-2xl p-5 border border-gray-100 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className={cn("w-4 h-4", data.element === "ไฟ" ? "text-red-500" : data.element === "ดิน" ? "text-emerald-500" : data.element === "ลม" ? "text-sky-500" : "text-cyan-500")} />
            <p className="text-gray-600 text-xs font-bold uppercase tracking-wider">คำทำนายวันนี้</p>
          </div>
          <p className="text-gray-800 text-sm leading-relaxed">{data.prediction}</p>
        </div>

        {/* Lucky Items */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">เลขนำโชค</p>
            <p className="text-gray-800 font-bold">{data.lucky.numbers.join(", ")}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">สีมงคล</p>
            <p className="text-gray-800 font-bold">{data.lucky.color}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">ทิศนำโชค</p>
            <p className="text-gray-800 font-bold">{data.lucky.direction}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-gray-200/50 text-center">
          <p className="text-gray-400 text-xs font-medium">✨ ดูดวงฟรีได้ที่ reffortune.com</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button onClick={generateImage} disabled={isGenerating} className={cn("flex-1 h-12 text-white", gradientColor.replace("from-", "bg-").split(" ")[0])}>
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Download className="w-5 h-5 mr-2" />}
          {isGenerating ? "กำลังสร้าง..." : "บันทึกรูป"}
        </Button>
        <Button onClick={handleNativeShare} disabled={isGenerating} variant="secondary" className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 h-12">
          <Share2 className="w-5 h-5 mr-2" /> แชร์
        </Button>
      </div>
    </div>
  );
}

function getZodiacEmoji(zodiac: string): string {
  const emojis: Record<string, string> = {
    Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
    Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
    Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
    เมษ: "♈", พฤษภ: "♉", เมถุน: "♊", กรกฎ: "♋",
    สิงห์: "♌", กันย์: "♍", ตุล: "♎", พิจิก: "♏",
    ธนู: "♐", มังกร: "♑", กุมภ์: "♒", มีน: "♓",
  };
  return emojis[zodiac] || "✨";
}
