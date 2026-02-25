"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles, Download, Share2, ChevronLeft, ChevronRight,
  Loader2, Lock, ImageIcon, Calendar, Palette, Star, Hash, Wand2,
} from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { cn } from "@/lib/cn";
import { calculateBirthColors, type AuspiciousColor, type BirthColorResult } from "@/lib/thai-astrology/colors";
import { drawTopicCard, TOPIC_INFO, type WallpaperTopic, type DrawnTopicCard } from "@/lib/tarot/topicPools";
import { getLuckyNumbers, type LuckyNumberOption } from "@/lib/tarot/luckyNumbers";

const STORAGE_KEY = "reffortune_wallpaper_daily";

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface SavedWallpaper {
  date: string;
  imageUrl: string;
  tarotCardName?: string;
  tarotAdvice?: string;
  topic?: string;
  luckyNumber?: number;
  selectedColorNames?: string[];
}

function loadTodayWallpaper(): SavedWallpaper | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.date !== getTodayKey()) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveTodayWallpaper(data: SavedWallpaper) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const TOPICS: { id: WallpaperTopic; label: string; emoji: string }[] = [
  { id: "finance", label: "การเงิน", emoji: "�" },
  { id: "career", label: "การงาน", emoji: "�" },
  { id: "love", label: "ความรัก", emoji: "💕" },
  { id: "luck", label: "โชคลาภ", emoji: "🍀" },
  { id: "health", label: "สุขภาพ", emoji: "�" },
];

const STYLES = [
  { id: "minimal" as const, label: "มินิมอล", emoji: "🎯", desc: "สะอาด เรียบ มินิมอล" },
  { id: "cosmic" as const, label: "จักรวาล", emoji: "🌌", desc: "กาแลคซี่ จักรวาล ลึกลับ" },
];

export default function WallpaperPage() {
  const { theme } = useTheme();
  const isPastel = theme === "pastel";
  const isRainbow = theme === "rainbow";

  // Wizard step: 1=birthdate, 2=topic, 3=lucky number, 4=style, 5=generating/result
  const [step, setStep] = useState(1);

  // Step 1: Birth date
  const [birthDateStr, setBirthDateStr] = useState("");
  const [birthTimeStr, setBirthTimeStr] = useState(""); // HH:MM or empty
  const [birthColors, setBirthColors] = useState<BirthColorResult | null>(null);
  const [selectedColors, setSelectedColors] = useState<AuspiciousColor[]>([]);

  // Step 2: Topic + Tarot
  const [selectedTopic, setSelectedTopic] = useState<WallpaperTopic>("finance");
  const [drawnCard, setDrawnCard] = useState<DrawnTopicCard | null>(null);

  // Step 3: Lucky number
  const [luckyNumbers, setLuckyNumbers] = useState<LuckyNumberOption[]>([]);
  const [selectedLucky, setSelectedLucky] = useState<number | null>(null);

  // Step 4: Style
  const [selectedStyle, setSelectedStyle] = useState<"minimal" | "cosmic">("minimal");

  // Result
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [savedData, setSavedData] = useState<SavedWallpaper | null>(null);
  const [alreadyGenerated, setAlreadyGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadTodayWallpaper();
    if (saved) {
      setSavedData(saved);
      setGeneratedImage(saved.imageUrl);
      setAlreadyGenerated(true);
      setStep(5);
    }
  }, []);

  // ── Step 1: Calculate birth colors ──
  const handleBirthSubmit = useCallback(() => {
    if (!birthDateStr) return;
    const date = new Date(birthDateStr);
    if (isNaN(date.getTime())) return;

    const hourNum = birthTimeStr ? parseInt(birthTimeStr.split(":")[0], 10) : undefined;
    const colors = calculateBirthColors(date, hourNum);
    setBirthColors(colors);
    setSelectedColors([]); // reset
  }, [birthDateStr, birthTimeStr]);

  const toggleColor = useCallback((color: AuspiciousColor) => {
    setSelectedColors((prev) => {
      const exists = prev.some((c) => c.hex === color.hex);
      if (exists) return prev.filter((c) => c.hex !== color.hex);
      if (prev.length >= 2) return [prev[1], color]; // replace oldest
      return [...prev, color];
    });
  }, []);

  // ── Step 2: Draw tarot card on topic select ──
  const handleTopicSelect = useCallback((topic: WallpaperTopic) => {
    setSelectedTopic(topic);
    const card = drawTopicCard(topic);
    setDrawnCard(card);
    const nums = getLuckyNumbers(topic);
    setLuckyNumbers(nums);
    setSelectedLucky(nums[0]?.num ?? null);
  }, []);

  // ── Navigation ──
  const canGoNext = useMemo(() => {
    if (step === 1) return selectedColors.length >= 1;
    if (step === 2) return !!drawnCard;
    if (step === 3) return selectedLucky !== null;
    if (step === 4) return !!selectedStyle;
    return false;
  }, [step, selectedColors, drawnCard, selectedLucky, selectedStyle]);

  const goNext = useCallback(() => {
    if (step === 2 && !drawnCard) {
      handleTopicSelect(selectedTopic);
    }
    if (step < 5 && canGoNext) setStep(step + 1);
  }, [step, canGoNext, drawnCard, handleTopicSelect, selectedTopic]);

  const goBack = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  // ── Step 5: Generate wallpaper ──
  const handleGenerate = useCallback(async () => {
    if (alreadyGenerated || isGenerating) return;
    setIsGenerating(true);
    setError(null);
    setStep(5);

    try {
      const resp = await fetch("/api/ai/wallpaper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedColors: selectedColors.map((c) => ({ nameEn: c.nameEn, hex: c.hex })),
          topic: selectedTopic,
          tarotCardName: drawnCard?.card.name ?? "",
          tarotSymbols: drawnCard?.promptSymbols ?? "",
          luckyNumber: selectedLucky ?? 9,
          style: selectedStyle,
        }),
      });

      const data = await resp.json();

      if (!resp.ok || !data.ok) {
        setError(data.error === "gemini_error" ? "ไม่สามารถสร้างภาพได้ในขณะนี้ กรุณาลองใหม่" : "เกิดข้อผิดพลาด กรุณาลองใหม่");
        return;
      }

      setGeneratedImage(data.image);
      const saveData: SavedWallpaper = {
        date: getTodayKey(),
        imageUrl: data.image,
        tarotCardName: drawnCard?.card.name,
        tarotAdvice: drawnCard?.card.meaningUpright,
        topic: selectedTopic,
        luckyNumber: selectedLucky ?? undefined,
        selectedColorNames: selectedColors.map((c) => c.nameTh),
      };
      saveTodayWallpaper(saveData);
      setSavedData(saveData);
      setAlreadyGenerated(true);
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่");
    } finally {
      setIsGenerating(false);
    }
  }, [alreadyGenerated, isGenerating, selectedColors, selectedTopic, drawnCard, selectedLucky, selectedStyle]);

  // Auto-trigger generate when entering step 5
  useEffect(() => {
    if (step === 5 && !generatedImage && !isGenerating && !alreadyGenerated && !error) {
      handleGenerate();
    }
  }, [step, generatedImage, isGenerating, alreadyGenerated, error, handleGenerate]);

  const handleDownload = useCallback(() => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.download = `reffortune-wallpaper-${getTodayKey()}.png`;
    link.href = generatedImage;
    link.click();
  }, [generatedImage]);

  const handleShare = useCallback(async () => {
    if (!generatedImage || !navigator.share) return;
    try {
      const resp = await fetch(generatedImage);
      const blob = await resp.blob();
      const file = new File([blob], "reffortune-wallpaper.png", { type: "image/png" });
      await navigator.share({
        title: "วอลเปเปอร์เสริมดวง — REFFORTUNE",
        text: "วอลเปเปอร์เสริมดวงจาก REFFORTUNE",
        files: [file],
      });
    } catch {
      // Share cancelled
    }
  }, [generatedImage]);

  const getTimeUntilTomorrow = () => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} ชม. ${minutes} นาที`;
  };

  // ── Theme helper classes ──
  const cardCls = isPastel
    ? "bg-white/20 backdrop-blur border border-white/30"
    : isRainbow
      ? "bg-[#1a1a2e]/80 border border-[rgba(255,0,255,0.15)]"
      : "bg-white border border-gray-200";

  const headingCls = isPastel || isRainbow ? "text-white" : "text-gray-900";
  const subCls = isPastel ? "text-white/70" : isRainbow ? "text-white/70" : "text-gray-500";

  const btnPrimary = isPastel
    ? "bg-white/30 backdrop-blur text-white border border-white/50 hover:bg-white/50 shadow-lg"
    : isRainbow
      ? "bg-gradient-to-r from-[#ff00ff] to-[#00ffff] text-white shadow-lg shadow-[rgba(255,0,255,0.3)]"
      : "bg-violet-600 text-white hover:bg-violet-700 shadow-xl shadow-violet-200";

  const btnSecondary = isPastel
    ? "bg-white/10 text-white/80 border border-white/20 hover:bg-white/20"
    : isRainbow
      ? "bg-[#1a1a2e]/80 text-white/70 border border-[rgba(255,0,255,0.15)] hover:border-[rgba(255,0,255,0.3)]"
      : "bg-gray-100 text-gray-600 hover:bg-gray-200";

  const selectedCls = isPastel
    ? "bg-white/30 border-white/60 shadow-lg"
    : isRainbow
      ? "bg-[rgba(255,0,255,0.2)] border-[#ff00ff] shadow-lg"
      : "bg-violet-50 border-violet-400 shadow-md shadow-violet-100";

  const unselectedCls = isPastel
    ? "bg-white/10 border-white/20 hover:bg-white/20"
    : isRainbow
      ? "bg-[#1a1a2e]/80 border-[rgba(255,0,255,0.15)] hover:border-[rgba(255,0,255,0.3)]"
      : "bg-white border-gray-200 hover:border-violet-200";

  // ── Step indicators ──
  const STEP_LABELS = ["วันเกิด", "เรื่องเสริม", "เลขมงคล", "สไตล์", "ผลลัพธ์"];

  return (
    <main className={cn(
      "min-h-screen pb-24",
      isPastel ? "bg-transparent" : isRainbow ? "bg-transparent" : "bg-white"
    )}>
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-40 backdrop-blur-sm",
        isPastel ? "bg-white/10 border-b border-white/20" :
        isRainbow ? "bg-[#0f0f1a]/90 border-b border-[rgba(255,0,255,0.2)]" :
        "bg-white/95 border-b border-gray-100"
      )}>
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/" className={cn(
            "w-10 h-10 flex items-center justify-center rounded-full transition-colors",
            isPastel ? "hover:bg-white/10 text-white" :
            isRainbow ? "hover:bg-white/10 text-white" :
            "hover:bg-gray-100 text-gray-600"
          )}>
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <ImageIcon className={cn("w-5 h-5", isPastel || isRainbow ? "text-white" : "text-violet-600")} />
            <span className={cn("font-serif text-lg font-semibold", isPastel || isRainbow ? "text-white" : "text-violet-600")}>
              วอลเปเปอร์เสริมดวง
            </span>
          </div>
        </div>
      </header>

      <div className="px-5 py-6 max-w-lg mx-auto">
        {/* Step Progress */}
        {step < 5 && (
          <div className="flex items-center gap-1 mb-6">
            {STEP_LABELS.slice(0, 4).map((label, i) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-1">
                <div className={cn(
                  "h-1.5 w-full rounded-full transition-all",
                  i + 1 <= step
                    ? isPastel ? "bg-white/60" : isRainbow ? "bg-[#ff00ff]" : "bg-violet-500"
                    : isPastel ? "bg-white/20" : isRainbow ? "bg-white/10" : "bg-gray-200"
                )} />
                <span className={cn("text-[10px]", i + 1 <= step ? headingCls : subCls)}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ════════════════ STEP 1: Birth Date ════════════════ */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="text-center mb-2">
              <Calendar className={cn("w-8 h-8 mx-auto mb-2", isPastel || isRainbow ? "text-white" : "text-violet-500")} />
              <h2 className={cn("font-serif text-xl font-bold", headingCls)}>กรอกวันเกิดของคุณ</h2>
              <p className={cn("text-sm mt-1", subCls)}>ระบบจะคำนวณสีมงคลจากทักษา ราศี และลัคนา</p>
            </div>

            <div className={cn("p-4 rounded-2xl", cardCls)}>
              <label className={cn("text-sm font-semibold block mb-2", headingCls)}>
                วัน/เดือน/ปีเกิด *
              </label>
              <input
                type="date"
                value={birthDateStr}
                onChange={(e) => { setBirthDateStr(e.target.value); setBirthColors(null); setSelectedColors([]); }}
                className={cn(
                  "w-full rounded-xl px-4 py-3 text-sm outline-none transition",
                  isPastel ? "bg-white/20 border border-white/30 text-white focus:border-white/60" :
                  isRainbow ? "bg-[#1a1a2e] border border-[rgba(255,0,255,0.3)] text-white focus:border-[#ff00ff]" :
                  "bg-white border border-gray-200 text-gray-900 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                )}
              />
            </div>

            <div className={cn("p-4 rounded-2xl", cardCls)}>
              <label className={cn("text-sm font-semibold block mb-2", headingCls)}>
                เวลาเกิด (ไม่บังคับ — สำหรับคำนวณลัคนา)
              </label>
              <input
                type="time"
                value={birthTimeStr}
                onChange={(e) => { setBirthTimeStr(e.target.value); setBirthColors(null); setSelectedColors([]); }}
                className={cn(
                  "w-full rounded-xl px-4 py-3 text-sm outline-none transition",
                  isPastel ? "bg-white/20 border border-white/30 text-white focus:border-white/60" :
                  isRainbow ? "bg-[#1a1a2e] border border-[rgba(255,0,255,0.3)] text-white focus:border-[#ff00ff]" :
                  "bg-white border border-gray-200 text-gray-900 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                )}
              />
            </div>

            {/* Calculate button */}
            {birthDateStr && !birthColors && (
              <button
                onClick={handleBirthSubmit}
                className={cn("w-full py-3 rounded-xl font-semibold transition-all active:scale-[0.98]", btnPrimary)}
              >
                <Palette className="w-4 h-4 inline mr-2" />
                คำนวณสีมงคล
              </button>
            )}

            {/* Color results */}
            {birthColors && (
              <div className="space-y-4">
                <p className={cn("text-sm font-semibold text-center", headingCls)}>
                  เลือกสีมงคล 1-2 สี สำหรับวอลเปเปอร์
                </p>

                {/* Day colors */}
                <div className={cn("p-4 rounded-2xl", cardCls)}>
                  <p className={cn("text-xs font-semibold mb-3", subCls)}>{birthColors.dayColors.label}</p>
                  <div className="flex gap-3">
                    {[birthColors.dayColors.primary, birthColors.dayColors.secondary].filter(Boolean).map((c) => c && (
                      <ColorSwatch
                        key={c.hex}
                        color={c}
                        selected={selectedColors.some((s) => s.hex === c.hex)}
                        onToggle={() => toggleColor(c)}
                        isPastel={isPastel}
                        isRainbow={isRainbow}
                      />
                    ))}
                  </div>
                </div>

                {/* Zodiac colors */}
                <div className={cn("p-4 rounded-2xl", cardCls)}>
                  <p className={cn("text-xs font-semibold mb-3", subCls)}>{birthColors.zodiacColors.label}</p>
                  <div className="flex gap-3">
                    {[birthColors.zodiacColors.primary, birthColors.zodiacColors.secondary].filter(Boolean).map((c) => c && (
                      <ColorSwatch
                        key={c.hex}
                        color={c}
                        selected={selectedColors.some((s) => s.hex === c.hex)}
                        onToggle={() => toggleColor(c)}
                        isPastel={isPastel}
                        isRainbow={isRainbow}
                      />
                    ))}
                  </div>
                </div>

                {/* Ascendant colors */}
                {birthColors.ascendantColors && (
                  <div className={cn("p-4 rounded-2xl", cardCls)}>
                    <p className={cn("text-xs font-semibold mb-3", subCls)}>{birthColors.ascendantColors.label}</p>
                    <div className="flex gap-3">
                      {[birthColors.ascendantColors.primary, birthColors.ascendantColors.secondary].filter(Boolean).map((c) => c && (
                        <ColorSwatch
                          key={c.hex}
                          color={c}
                          selected={selectedColors.some((s) => s.hex === c.hex)}
                          onToggle={() => toggleColor(c)}
                          isPastel={isPastel}
                          isRainbow={isRainbow}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected preview */}
                {selectedColors.length > 0 && (
                  <div className="flex items-center justify-center gap-2">
                    <span className={cn("text-xs", subCls)}>สีที่เลือก:</span>
                    {selectedColors.map((c) => (
                      <div
                        key={c.hex}
                        className="w-6 h-6 rounded-full ring-2 ring-white/50"
                        style={{ backgroundColor: c.hex }}
                        title={c.nameTh}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════════════════ STEP 2: Topic + Tarot ════════════════ */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="text-center mb-2">
              <Star className={cn("w-8 h-8 mx-auto mb-2", isPastel || isRainbow ? "text-white" : "text-violet-500")} />
              <h2 className={cn("font-serif text-xl font-bold", headingCls)}>เลือกเรื่องที่ต้องการเสริม</h2>
              <p className={cn("text-sm mt-1", subCls)}>ระบบจะสุ่มไพ่ทาโรต์ที่เกี่ยวข้องกับเรื่องนี้</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {TOPICS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTopicSelect(t.id)}
                  className={cn(
                    "p-3 rounded-2xl border text-center transition-all active:scale-[0.97]",
                    selectedTopic === t.id && drawnCard ? selectedCls : unselectedCls
                  )}
                >
                  <span className="text-2xl">{t.emoji}</span>
                  <p className={cn("text-xs font-medium mt-1", isPastel || isRainbow ? "text-white" : "text-gray-700")}>
                    {t.label}
                  </p>
                </button>
              ))}
            </div>

            {/* Drawn card preview */}
            {drawnCard && (
              <div className={cn("p-5 rounded-2xl text-center", cardCls)}>
                <Wand2 className={cn("w-6 h-6 mx-auto mb-2", isPastel || isRainbow ? "text-white" : "text-violet-500")} />
                <p className={cn("text-lg font-bold", headingCls)}>{drawnCard.card.name}</p>
                {drawnCard.card.nameTh && (
                  <p className={cn("text-sm", subCls)}>{drawnCard.card.nameTh}</p>
                )}
                <p className={cn("text-sm mt-2 leading-relaxed", subCls)}>
                  {drawnCard.card.meaningUpright}
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  {drawnCard.card.image && (
                    <img src={drawnCard.card.image} alt={drawnCard.card.name} className="w-16 h-auto rounded-lg shadow-md" />
                  )}
                </div>
              </div>
            )}

            {!drawnCard && (
              <button
                onClick={() => handleTopicSelect(selectedTopic)}
                className={cn("w-full py-3 rounded-xl font-semibold transition-all active:scale-[0.98]", btnPrimary)}
              >
                <Wand2 className="w-4 h-4 inline mr-2" />
                จับไพ่ทาโรต์
              </button>
            )}
          </div>
        )}

        {/* ════════════════ STEP 3: Lucky Number ════════════════ */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="text-center mb-2">
              <Hash className={cn("w-8 h-8 mx-auto mb-2", isPastel || isRainbow ? "text-white" : "text-violet-500")} />
              <h2 className={cn("font-serif text-xl font-bold", headingCls)}>เลขมงคลเสริมดวง</h2>
              <p className={cn("text-sm mt-1", subCls)}>
                เลขมงคลสำหรับเรื่อง{TOPIC_INFO[selectedTopic].labelTh}
              </p>
            </div>

            <div className="space-y-2">
              {luckyNumbers.map((ln) => (
                <button
                  key={ln.num}
                  onClick={() => setSelectedLucky(ln.num)}
                  className={cn(
                    "w-full p-4 rounded-2xl border text-left transition-all active:scale-[0.98] flex items-center gap-4",
                    selectedLucky === ln.num ? selectedCls : unselectedCls
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0",
                    selectedLucky === ln.num
                      ? isPastel ? "bg-white/30 text-white" : isRainbow ? "bg-[#ff00ff]/30 text-white" : "bg-violet-100 text-violet-700"
                      : isPastel ? "bg-white/10 text-white/60" : isRainbow ? "bg-white/5 text-white/50" : "bg-gray-100 text-gray-500"
                  )}>
                    {ln.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium", headingCls)}>{ln.reasonTh}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className={cn("text-xs", subCls)}>พลังเสริม</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-2 h-2 rounded-full",
                              i < ln.score
                                ? isPastel ? "bg-white/60" : isRainbow ? "bg-[#ff00ff]" : "bg-violet-500"
                                : isPastel ? "bg-white/15" : isRainbow ? "bg-white/10" : "bg-gray-200"
                            )}
                          />
                        ))}
                      </div>
                      <span className={cn("text-xs font-bold", headingCls)}>+{ln.score}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════ STEP 4: Style ════════════════ */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="text-center mb-2">
              <Palette className={cn("w-8 h-8 mx-auto mb-2", isPastel || isRainbow ? "text-white" : "text-violet-500")} />
              <h2 className={cn("font-serif text-xl font-bold", headingCls)}>เลือกสไตล์ภาพ</h2>
              <p className={cn("text-sm mt-1", subCls)}>เลือกบรรยากาศของวอลเปเปอร์</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStyle(s.id)}
                  className={cn(
                    "p-5 rounded-2xl border text-center transition-all active:scale-[0.97]",
                    selectedStyle === s.id ? selectedCls : unselectedCls
                  )}
                >
                  <span className="text-3xl">{s.emoji}</span>
                  <p className={cn("text-sm font-bold mt-2", headingCls)}>{s.label}</p>
                  <p className={cn("text-xs mt-1", subCls)}>{s.desc}</p>
                </button>
              ))}
            </div>

            {/* Summary before generate */}
            <div className={cn("p-4 rounded-2xl space-y-2", cardCls)}>
              <p className={cn("text-xs font-semibold", subCls)}>สรุปก่อนสร้าง</p>
              <div className="flex items-center gap-2">
                <span className={cn("text-xs", subCls)}>สี:</span>
                {selectedColors.map((c) => (
                  <div key={c.hex} className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.hex }} />
                    <span className={cn("text-xs", headingCls)}>{c.nameTh}</span>
                  </div>
                ))}
              </div>
              <p className={cn("text-xs", subCls)}>
                เรื่อง: <span className={headingCls}>{TOPIC_INFO[selectedTopic].emoji} {TOPIC_INFO[selectedTopic].labelTh}</span>
              </p>
              <p className={cn("text-xs", subCls)}>
                ไพ่: <span className={headingCls}>{drawnCard?.card.name}</span>
              </p>
              <p className={cn("text-xs", subCls)}>
                เลขมงคล: <span className={headingCls}>{selectedLucky}</span>
              </p>
            </div>
          </div>
        )}

        {/* ════════════════ STEP 5: Result ════════════════ */}
        {step === 5 && (
          <div className="space-y-6">
            {isGenerating && (
              <div className="text-center py-16">
                <Loader2 className={cn("w-12 h-12 mx-auto mb-4 animate-spin", isPastel || isRainbow ? "text-white" : "text-violet-500")} />
                <p className={cn("text-lg font-semibold", headingCls)}>กำลังสร้างวอลเปเปอร์เสริมดวง...</p>
                <p className={cn("text-sm mt-2", subCls)}>กรุณารอสักครู่</p>
              </div>
            )}

            {error && !generatedImage && (
              <div className="text-center py-8">
                <p className={cn("text-sm", isPastel ? "text-pink-200" : isRainbow ? "text-pink-400" : "text-red-500")}>
                  {error}
                </p>
                <button
                  onClick={() => { setError(null); setStep(4); }}
                  className={cn("mt-4 px-6 py-2 rounded-xl text-sm font-semibold", btnSecondary)}
                >
                  ลองใหม่
                </button>
              </div>
            )}

            {generatedImage && (
              <>
                {/* Image */}
                <div className={cn(
                  "relative rounded-3xl overflow-hidden shadow-2xl mx-auto",
                  isPastel ? "shadow-[0_8px_40px_rgba(199,125,255,0.4)]" :
                  isRainbow ? "shadow-[0_8px_40px_rgba(255,0,255,0.3)]" :
                  "shadow-violet-200"
                )} style={{ maxWidth: 280, aspectRatio: "9/16" }}>
                  <img src={generatedImage} alt="วอลเปเปอร์เสริมดวง" className="w-full h-full object-cover" />
                </div>

                {/* Tarot card info */}
                {(savedData?.tarotCardName || drawnCard) && (
                  <div className={cn("p-5 rounded-2xl", cardCls)}>
                    <div className="flex items-center gap-2 mb-2">
                      <Wand2 className={cn("w-5 h-5", isPastel || isRainbow ? "text-white" : "text-violet-500")} />
                      <span className={cn("text-sm font-bold", headingCls)}>
                        {savedData?.tarotCardName || drawnCard?.card.name}
                      </span>
                    </div>
                    <p className={cn("text-sm leading-relaxed", subCls)}>
                      {savedData?.tarotAdvice || drawnCard?.card.meaningUpright}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      {savedData?.selectedColorNames && (
                        <p className={cn("text-xs", subCls)}>
                          สีมงคล: {savedData.selectedColorNames.join(", ")}
                        </p>
                      )}
                      {(savedData?.luckyNumber || selectedLucky) && (
                        <p className={cn("text-xs", subCls)}>
                          เลขมงคล: {savedData?.luckyNumber || selectedLucky}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleDownload}
                    className={cn("flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all active:scale-[0.98]", btnPrimary)}
                  >
                    <Download className="w-4 h-4" />
                    ดาวน์โหลด
                  </button>
                  {typeof navigator !== "undefined" && "share" in navigator && (
                    <button
                      onClick={handleShare}
                      className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all active:scale-[0.98]",
                        isPastel ? "bg-white/20 backdrop-blur text-white border border-white/30 hover:bg-white/30" :
                        isRainbow ? "bg-[#1a1a2e] text-white border border-[rgba(255,0,255,0.3)]" :
                        "bg-white text-violet-600 border border-violet-200 hover:bg-violet-50"
                      )}
                    >
                      <Share2 className="w-4 h-4" />
                      แชร์
                    </button>
                  )}
                </div>

                {/* Already generated notice */}
                {alreadyGenerated && (
                  <div className={cn("p-4 rounded-2xl text-center", cardCls)}>
                    <Lock className={cn("w-6 h-6 mx-auto mb-2", isPastel ? "text-white/50" : isRainbow ? "text-white/40" : "text-gray-400")} />
                    <p className={cn("text-sm font-medium", headingCls)}>สร้างวอลเปเปอร์วันนี้แล้ว</p>
                    <p className={cn("text-xs mt-1", subCls)}>
                      กลับมาสร้างใหม่ได้อีกใน {getTimeUntilTomorrow()}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ════════════════ Navigation Buttons ════════════════ */}
        {step < 5 && (
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={goBack}
                className={cn("flex-1 py-3 rounded-xl font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-1", btnSecondary)}
              >
                <ChevronLeft className="w-4 h-4" />
                ย้อนกลับ
              </button>
            )}
            <button
              onClick={step === 4 ? handleGenerate : goNext}
              disabled={!canGoNext}
              className={cn(
                "flex-1 py-3 rounded-xl font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-1",
                canGoNext ? btnPrimary : "opacity-40 cursor-not-allowed " + btnPrimary
              )}
            >
              {step === 4 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  สร้างวอลเปเปอร์
                </>
              ) : (
                <>
                  ถัดไป
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// ──────────────────────────────────────────────
// Color Swatch Component
// ──────────────────────────────────────────────

function ColorSwatch({
  color,
  selected,
  onToggle,
  isPastel,
  isRainbow,
}: {
  color: AuspiciousColor;
  selected: boolean;
  onToggle: () => void;
  isPastel: boolean;
  isRainbow: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex flex-col items-center gap-1.5 transition-all active:scale-[0.95]"
    >
      <div
        className={cn(
          "w-12 h-12 rounded-full shadow-md transition-all",
          selected
            ? "ring-3 ring-offset-2 scale-110 " + (
                isPastel ? "ring-white ring-offset-transparent" :
                isRainbow ? "ring-[#ff00ff] ring-offset-[#0f0f1a]" :
                "ring-violet-500 ring-offset-white"
              )
            : "opacity-70 hover:opacity-100"
        )}
        style={{ backgroundColor: color.hex }}
      />
      <span className={cn(
        "text-[11px] font-medium",
        isPastel || isRainbow ? "text-white/80" : "text-gray-600"
      )}>
        {color.nameTh}
      </span>
    </button>
  );
}
