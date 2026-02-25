"use client";

import React, { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Loader2, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { SpiritShareData } from "../types";

interface SpiritShareableCardProps {
  data: SpiritShareData;
  onShare?: () => void;
  className?: string;
}

export function SpiritShareableCard({ data, onShare, className }: SpiritShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = useCallback(async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#f0fdfa",
      });
      const link = document.createElement("a");
      link.download = `reffortune-spirit-${data.lifePath}.png`;
      link.href = dataUrl;
      link.click();
      onShare?.();
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [data.lifePath, onShare]);

  const handleNativeShare = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 2, backgroundColor: "#f0fdfa" });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "reffortune-spirit.png", { type: "image/png" });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "ไพ่จิตวิญญาณของฉัน — REFFORTUNE",
          text: `Life Path ${data.lifePath}: ${data.cardNameTh || data.cardName}`,
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
          background: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)",
          boxShadow: "0 20px 60px rgba(20, 184, 166, 0.15)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="text-teal-700 font-bold text-sm tracking-wide">{data.brand || "REFFORTUNE"}</span>
          </div>
          <span className="text-teal-500 text-xs font-medium">{data.date}</span>
        </div>

        {/* Life Path Badge */}
        <div className="flex justify-center mb-5">
          <div className="px-5 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider">Life Path</span>
            <span className="text-2xl font-bold ml-2">{data.lifePath}</span>
          </div>
        </div>

        {/* Birth Date */}
        <div className="text-center mb-5">
          <p className="text-teal-600 text-xs font-medium uppercase tracking-wider mb-1">วันเกิด</p>
          <p className="text-teal-800 font-semibold">{data.birthDate}</p>
        </div>

        {/* Card Display */}
        <div className="relative w-40 aspect-[2/3] mx-auto mb-5 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-100 to-emerald-50 shadow-xl">
          {data.cardImage ? (
            <img src={data.cardImage} alt={data.cardName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl">✨</span>
            </div>
          )}
        </div>

        {/* Card Name */}
        <div className="text-center mb-5">
          <h3 className="text-teal-800 font-bold text-xl">{data.cardNameTh || data.cardName}</h3>          
          <p className="text-teal-500 text-sm mt-1">{data.cardName}</p>
        </div>

        {/* Meaning */}
        <div className="bg-white/80 rounded-2xl p-4 mb-4 border border-teal-100">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-teal-500" />
            <p className="text-teal-600 text-xs font-bold uppercase tracking-wider">ความหมาย</p>
          </div>
          <p className="text-teal-800 text-sm leading-relaxed">{data.meaning}</p>
        </div>

        {/* Guidance */}
        <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-xl p-4 border border-teal-200">
          <p className="text-teal-600 text-xs font-bold mb-1">🌟 คำแนะนำ</p>
          <p className="text-teal-900 text-sm leading-relaxed">{data.guidance}</p>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-teal-200/50 text-center">
          <p className="text-teal-500 text-xs font-medium">✨ ค้นหาไพ่จิตวิญญาณของคุณที่ reffortune.com</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button onClick={generateImage} disabled={isGenerating} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white h-12">
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Download className="w-5 h-5 mr-2" />}
          {isGenerating ? "กำลังสร้าง..." : "บันทึกรูป"}
        </Button>
        <Button onClick={handleNativeShare} disabled={isGenerating} variant="secondary" className="flex-1 border-teal-300 text-teal-600 hover:bg-teal-50 h-12">
          <Share2 className="w-5 h-5 mr-2" /> แชร์
        </Button>
      </div>
    </div>
  );
}
