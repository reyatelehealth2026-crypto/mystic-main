"use client";

import React, { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Loader2, Hash, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { NumerologyShareData } from "../types";

interface NumerologyShareableCardProps {
  data: NumerologyShareData;
  onShare?: () => void;
  className?: string;
}

export function NumerologyShareableCard({ data, onShare, className }: NumerologyShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = useCallback(async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 2, backgroundColor: "#fffbeb" });
      const link = document.createElement("a");
      link.download = `reffortune-numerology-${data.input}.png`;
      link.href = dataUrl;
      link.click();
      onShare?.();
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [data.input, onShare]);

  const handleNativeShare = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 2, backgroundColor: "#fffbeb" });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "reffortune-numerology.png", { type: "image/png" });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "เลขศาสตร์ของฉัน — REFFORTUNE",
          text: `${data.inputType === "phone" ? "เบอร์" : "ชื่อ"} ${data.input} = ${data.result}`,
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
          background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)",
          boxShadow: "0 20px 60px rgba(245, 158, 11, 0.15)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg">
              <Hash className="w-5 h-5 text-white" />
            </div>
            <span className="text-amber-700 font-bold text-sm tracking-wide">{data.brand || "REFFORTUNE"}</span>
          </div>
          <span className="text-amber-500 text-xs font-medium">{data.date}</span>
        </div>

        {/* Input Type Badge */}
        <div className="flex justify-center mb-5">
          <span className="px-4 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-full shadow-md uppercase tracking-wider">
            {data.inputType === "phone" ? "📱 เบอร์โทรศัพท์" : "📝 ชื่อ"}
          </span>
        </div>

        {/* Input Number Display */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-2xl shadow-lg border-2 border-amber-200">
            {data.input.split("").map((char, i) => (
              <span key={i} className="text-2xl font-bold text-amber-600 w-8 h-10 flex items-center justify-center bg-amber-50 rounded-lg">
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="text-center mb-5">
          <p className="text-amber-600 text-xs font-medium uppercase tracking-wider mb-2">ผลลัพธ์</p>
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-2xl shadow-lg">
            <span className="text-3xl font-bold">{data.result}</span>
          </div>
        </div>

        {/* Lucky Numbers */}
        <div className="flex justify-center gap-2 mb-5">
          {data.luckyNumbers.map((num, i) => (
            <div key={i} className="w-10 h-10 rounded-full bg-white border-2 border-amber-300 flex items-center justify-center shadow-md">
              <span className="text-amber-600 font-bold">{num}</span>
            </div>
          ))}
        </div>

        {/* Analysis */}
        <div className="bg-white/80 rounded-2xl p-5 border border-amber-100">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <p className="text-amber-600 text-xs font-bold uppercase tracking-wider">วิเคราะห์</p>
          </div>
          <p className="text-amber-800 text-sm leading-relaxed">{data.analysis}</p>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-amber-200/50 text-center">
          <p className="text-amber-500 text-xs font-medium">🔢 วิเคราะห์เลขศาสตร์ฟรีที่ reffortune.com</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button onClick={generateImage} disabled={isGenerating} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white h-12">
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Download className="w-5 h-5 mr-2" />}
          {isGenerating ? "กำลังสร้าง..." : "บันทึกรูป"}
        </Button>
        <Button onClick={handleNativeShare} disabled={isGenerating} variant="secondary" className="flex-1 border-amber-300 text-amber-600 hover:bg-amber-50 h-12">
          <Share2 className="w-5 h-5 mr-2" /> แชร์
        </Button>
      </div>
    </div>
  );
}
