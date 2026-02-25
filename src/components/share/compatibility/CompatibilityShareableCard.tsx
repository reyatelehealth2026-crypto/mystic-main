"use client";

import React, { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Loader2, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { CompatibilityShareData } from "../types";

interface CompatibilityShareableCardProps {
  data: CompatibilityShareData;
  onShare?: () => void;
  className?: string;
}

export function CompatibilityShareableCard({ data, onShare, className }: CompatibilityShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = useCallback(async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 2, backgroundColor: "#fdf2f8" });
      const link = document.createElement("a");
      link.download = `reffortune-compatibility-${data.sign1.name}-${data.sign2.name}.png`;
      link.href = dataUrl;
      link.click();
      onShare?.();
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [data.sign1.name, data.sign2.name, onShare]);

  const handleNativeShare = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 2, backgroundColor: "#fdf2f8" });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "reffortune-compatibility.png", { type: "image/png" });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "ความเข้ากัน — REFFORTUNE",
          text: `${data.sign1.nameTh} + ${data.sign2.nameTh} = ${data.score}%`,
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-rose-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-rose-500";
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        ref={cardRef}
        className="w-[360px] p-6 rounded-3xl"
        style={{
          background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)",
          boxShadow: "0 20px 60px rgba(236, 72, 153, 0.15)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-pink-700 font-bold text-sm tracking-wide">{data.brand || "REFFORTUNE"}</span>
          </div>
          <span className="text-pink-400 text-xs font-medium">{data.date}</span>
        </div>

        {/* Title */}
        <div className="text-center mb-5">
          <p className="text-pink-600 text-xs font-bold uppercase tracking-wider mb-2">ความเข้ากัน</p>
        </div>

        {/* Signs Display */}
        <div className="flex items-center justify-center gap-4 mb-5">
          {/* Sign 1 */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mb-2">
              <span className="text-3xl">{getZodiacEmoji(data.sign1.name)}</span>
            </div>
            <p className="text-gray-800 font-bold">{data.sign1.nameTh}</p>
            <p className="text-gray-400 text-xs">{data.sign1.element}</p>
          </div>

          {/* Heart */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
          </div>

          {/* Sign 2 */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mb-2">
              <span className="text-3xl">{getZodiacEmoji(data.sign2.name)}</span>
            </div>
            <p className="text-gray-800 font-bold">{data.sign2.nameTh}</p>
            <p className="text-gray-400 text-xs">{data.sign2.element}</p>
          </div>
        </div>

        {/* Score */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-xl border-4 border-pink-100">
            <span className={cn("text-4xl font-bold", getScoreColor(data.score))}>{data.score}%</span>
          </div>
          <div className="mt-3 h-2 bg-white rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full transition-all", getScoreBg(data.score))} style={{ width: `${data.score}%` }} />
          </div>
        </div>

        {/* Result */}
        <div className="bg-white/80 rounded-2xl p-4 mb-4 border border-pink-100">
          <p className="text-gray-800 text-sm leading-relaxed text-center font-medium">{data.result}</p>
        </div>

        {/* Advice */}
        <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-xl p-4 border border-pink-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <p className="text-pink-600 text-xs font-bold">คำแนะนำ</p>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{data.advice}</p>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-pink-200/50 text-center">
          <p className="text-pink-400 text-xs font-medium">💕 ดูความเข้ากันฟรีที่ reffortune.com</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button onClick={generateImage} disabled={isGenerating} className="flex-1 bg-pink-500 hover:bg-pink-600 text-white h-12">
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Download className="w-5 h-5 mr-2" />}
          {isGenerating ? "กำลังสร้าง..." : "บันทึกรูป"}
        </Button>
        <Button onClick={handleNativeShare} disabled={isGenerating} variant="secondary" className="flex-1 border-pink-300 text-pink-600 hover:bg-pink-50 h-12">
          <Share2 className="w-5 h-5 mr-2" /> แชร์
        </Button>
      </div>
    </div>
  );
}

function getZodiacEmoji(sign: string): string {
  const emojis: Record<string, string> = {
    Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
    Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
    Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
  };
  return emojis[sign] || "✨";
}
