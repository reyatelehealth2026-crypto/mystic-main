"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles, Download, Share2, ChevronLeft, ChevronRight,
  Loader2, Lock, ImageIcon, Calendar, Palette, Star, Hash, Wand2, Type,
  Coins, Briefcase, Heart, Clover, Activity,
} from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { cn } from "@/lib/cn";
import { calculateBirthColors, type AuspiciousColor, type BirthColorResult } from "@/lib/thai-astrology/colors";
import { getTopicSymbols, TOPIC_INFO, type WallpaperTopic, type TopicSymbols } from "@/lib/tarot/topicPools";
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

const TOPICS: { id: WallpaperTopic; label: string; sublabel: string }[] = [
  { id: "finance", label: "การเงิน", sublabel: "Pentacles" },
  { id: "career", label: "การงาน", sublabel: "Wands" },
  { id: "love", label: "ความรัก", sublabel: "Cups" },
  { id: "luck", label: "โชคลาภ", sublabel: "Arcana" },
  { id: "health", label: "สุขภาพ", sublabel: "All Suits" },
];

const STYLES = [
  { id: "minimal" as const, label: "มินิมอล", emoji: "🎯", desc: "สะอาด เรียบ มินิมอล" },
  { id: "cosmic" as const, label: "จักรวาล", emoji: "🌌", desc: "กาแลคซี่ จักรวาล ลึกลับ" },
];

const CUSTOM_ELEMENTS = [
  { id: "flower", emoji: "🌸", label: "ดอกไม้", en: "blooming flowers, cherry blossoms, lotus" },
  { id: "dragon", emoji: "🐉", label: "มังกร", en: "golden dragon, mystical dragon, celestial serpent" },
  { id: "gem", emoji: "💎", label: "อัญมณี", en: "precious gems, crystals, glowing jewels" },
  { id: "moon", emoji: "🌙", label: "พระจันทร์", en: "crescent moon, moonlight, lunar glow" },
  { id: "star", emoji: "✨", label: "ดาว", en: "shining stars, golden starlight, celestial sparks" },
  { id: "lantern", emoji: "🏮", label: "โคมไฟ", en: "glowing red lanterns, festive lights, paper lanterns" },
  { id: "butterfly", emoji: "🦋", label: "ผีเสื้อ", en: "magical butterflies, golden butterflies, ethereal wings" },
  { id: "lotus", emoji: "🪷", label: "บัวหลวง", en: "sacred lotus flower, pink lotus, divine bloom" },
  { id: "elephant", emoji: "🐘", label: "ช้าง", en: "auspicious elephant, white elephant, Thai elephant" },
  { id: "eye", emoji: "🧿", label: "ตาวิเศษ", en: "evil eye talisman, all-seeing eye, protective amulet" },
];

const PRESET_TEXTS: Record<WallpaperTopic, string[]> = {
  finance: ["เงินไหลมา", "มั่งมีศรีสุข", "โชคลาภ", "ร่ำรวย"],
  career: ["ก้าวหน้า", "สำเร็จ", "เป็นเลิศ", "เฮงรวย"],
  love: ["รักมั่นคง", "คู่แท้", "เสน่ห์", "ความรัก"],
  luck: ["โชคดี", "เฮง", "ปังปุริเย่", "ดวงดี"],
  health: ["แข็งแรง", "อายุยืน", "สุขภาพดี", "มีสุข"],
};

export default function WallpaperPage() {
  const { theme } = useTheme();
  const isPastel = theme === "pastel";
  const isRainbow = theme === "rainbow";

  // Wizard step: 1=birthdate, 2=topic+lucky, 3=custom elements+text, 4=style, 5=generating/result
  const [step, setStep] = useState(1);

  // Step 1: Birth date
  const [birthDateStr, setBirthDateStr] = useState("");
  const [birthTimeStr, setBirthTimeStr] = useState(""); // HH:MM or empty
  const [birthColors, setBirthColors] = useState<BirthColorResult | null>(null);
  const [selectedColors, setSelectedColors] = useState<AuspiciousColor[]>([]);

  // Step 2: Topic + Lucky number
  const [selectedTopic, setSelectedTopic] = useState<WallpaperTopic>("finance");
  const [topicSymbols, setTopicSymbols] = useState<TopicSymbols | null>(null);

  const [luckyNumbers, setLuckyNumbers] = useState<LuckyNumberOption[]>([]);
  const [selectedLucky, setSelectedLucky] = useState<number | null>(null);

  // Step 3: Custom elements + overlay text
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [overlayText, setOverlayText] = useState("");
  const [customText, setCustomText] = useState("");

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

  // ── Step 2: Get topic symbols on topic select ──
  const handleTopicSelect = useCallback((topic: WallpaperTopic) => {
    setSelectedTopic(topic);
    const symbols = getTopicSymbols(topic);
    setTopicSymbols(symbols);
    const nums = getLuckyNumbers(topic);
    setLuckyNumbers(nums);
    setSelectedLucky(nums[0]?.num ?? null);
  }, []);

  // ── Navigation ──
  const canGoNext = useMemo(() => {
    if (step === 1) return selectedColors.length >= 1;
    if (step === 2) return !!topicSymbols && selectedLucky !== null;
    if (step === 3) return true; // optional step
    if (step === 4) return !!selectedStyle;
    return false;
  }, [step, selectedColors, topicSymbols, selectedLucky, selectedStyle]);

  const goNext = useCallback(() => {
    if (step === 2 && !topicSymbols) {
      handleTopicSelect(selectedTopic);
    }
    if (step < 5 && canGoNext) setStep(step + 1);
  }, [step, canGoNext, topicSymbols, handleTopicSelect, selectedTopic]);

  const goBack = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  // ── Generate wallpaper ──
  const handleGenerate = useCallback(async () => {
    if (alreadyGenerated || isGenerating) return;
    setIsGenerating(true);
    setError(null);
    setStep(5);

    const finalText = customText.trim() || overlayText;
    const elementDescs = selectedElements
      .map((id) => CUSTOM_ELEMENTS.find((e) => e.id === id)?.en ?? "")
      .filter(Boolean)
      .join(", ");

    try {
      const resp = await fetch("/api/ai/wallpaper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedColors: selectedColors.map((c) => ({ nameEn: c.nameEn, hex: c.hex })),
          topic: selectedTopic,
          symbols: topicSymbols?.symbols ?? "",
          customElements: elementDescs,
          overlayText: finalText,
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
  }, [alreadyGenerated, isGenerating, selectedColors, selectedTopic, topicSymbols, selectedLucky, selectedStyle, selectedElements, overlayText, customText]);

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

        {/* ════════════════ STEP 2: Topic + Lucky Number ════════════════ */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="text-center mb-2">
              <Star className={cn("w-8 h-8 mx-auto mb-2", isPastel || isRainbow ? "text-white" : "text-violet-500")} />
              <h2 className={cn("font-serif text-xl font-bold", headingCls)}>เลือกเรื่องที่ต้องการเสริม</h2>
              <p className={cn("text-sm mt-1", subCls)}>เลือกหมวดและเลขมงคลเสริมดวง</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {TOPICS.map((t) => {
                const isActive = selectedTopic === t.id && !!topicSymbols;
                const iconCls = cn("w-5 h-5 mx-auto mb-1", isActive
                  ? isPastel || isRainbow ? "text-white" : "text-violet-600"
                  : isPastel || isRainbow ? "text-white/70" : "text-gray-400"
                );
                return (
                  <button
                    key={t.id}
                    onClick={() => handleTopicSelect(t.id)}
                    className={cn(
                      "p-3 rounded-2xl border text-center transition-all active:scale-[0.97]",
                      isActive ? selectedCls : unselectedCls
                    )}
                  >
                    {t.id === "finance" && <Coins className={iconCls} />}
                    {t.id === "career" && <Briefcase className={iconCls} />}
                    {t.id === "love" && <Heart className={iconCls} />}
                    {t.id === "luck" && <Clover className={iconCls} />}
                    {t.id === "health" && <Activity className={iconCls} />}
                    <p className={cn("text-xs font-medium", isPastel || isRainbow ? "text-white" : "text-gray-700")}>
                      {t.label}
                    </p>
                    <p className={cn("text-[10px] opacity-60", isPastel || isRainbow ? "text-white" : "text-gray-500")}>
                      {t.sublabel}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Lucky numbers */}
            {topicSymbols && luckyNumbers.length > 0 && (
              <div className="space-y-3">
                <div className="text-center">
                  <Hash className={cn("w-6 h-6 mx-auto mb-1", isPastel || isRainbow ? "text-white" : "text-violet-500")} />
                  <h3 className={cn("font-semibold", headingCls)}>เลขมงคลเสริมดวง</h3>
                  <p className={cn("text-xs mt-1", subCls)}>
                    สำหรับเรื่อง{TOPIC_INFO[selectedTopic].labelTh}
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
                                    ? isPastel ? "bg-white/60" : isRainbow ? "bg-[#00ffff]" : "bg-violet-400"
                                    : isPastel ? "bg-white/10" : isRainbow ? "bg-white/10" : "bg-gray-200"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════ STEP 3: Custom Elements + Text ════════════════ */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="text-center mb-2">
              <Type className={cn("w-8 h-8 mx-auto mb-2", isPastel || isRainbow ? "text-white" : "text-violet-500")} />
              <h2 className={cn("font-serif text-xl font-bold", headingCls)}>ปรับแต่งภาพ</h2>
              <p className={cn("text-sm mt-1", subCls)}>เลือกองค์ประกอบและข้อความมงคล (ไม่บังคับ)</p>
            </div>

            {/* Element chips */}
            <div>
              <p className={cn("text-sm font-semibold mb-3", headingCls)}>เน้นองค์ประกอบในภาพ</p>
              <div className="flex flex-wrap gap-2">
                {CUSTOM_ELEMENTS.map((el) => {
                  const isSelected = selectedElements.includes(el.id);
                  return (
                    <button
                      key={el.id}
                      onClick={() => setSelectedElements((prev) =>
                        isSelected ? prev.filter((id) => id !== el.id) : [...prev, el.id]
                      )}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm transition-all active:scale-[0.96]",
                        isSelected ? selectedCls : unselectedCls
                      )}
                    >
                      <span>{el.emoji}</span>
                      <span>{el.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Overlay text */}
            <div>
              <p className={cn("text-sm font-semibold mb-3", headingCls)}>ข้อความมงคลในภาพ</p>
              <p className={cn("text-xs mb-2", subCls)}>ตัวอักษรขลัง แบบ sacred/ancient style</p>

              {/* Preset text chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                {PRESET_TEXTS[selectedTopic].map((t) => (
                  <button
                    key={t}
                    onClick={() => setOverlayText(overlayText === t ? "" : t)}
                    className={cn(
                      "px-3 py-1.5 rounded-full border text-sm font-medium transition-all active:scale-[0.96]",
                      overlayText === t ? selectedCls : unselectedCls
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Custom text input */}
              <div className="relative">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => {
                    if (e.target.value.length <= 10) setCustomText(e.target.value);
                  }}
                  placeholder="หรือพิมพ์เองได้ (สูงสุด 10 ตัว)"
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all",
                    isPastel
                      ? "bg-white/20 backdrop-blur border-white/30 text-white placeholder-white/50 focus:border-white/60"
                      : isRainbow
                      ? "bg-[#1a1a2e] border-[rgba(255,0,255,0.2)] text-white placeholder-white/40 focus:border-[#ff00ff]/60"
                      : "bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-violet-400"
                  )}
                />
                <span className={cn("absolute right-3 top-1/2 -translate-y-1/2 text-xs", subCls)}>
                  {customText.length}/10
                </span>
              </div>

              {(overlayText || customText.trim()) && (
                <div className={cn("mt-2 px-3 py-2 rounded-lg text-center text-sm", cardCls)}>
                  <span className={cn("font-semibold tracking-widest", headingCls)}>
                    ✦ {customText.trim() || overlayText} ✦
                  </span>
                </div>
              )}
            </div>

            <p className={cn("text-xs text-center", subCls)}>
              ข้ามได้เลย ถ้าไม่ต้องการปรับแต่ง
            </p>
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
                เลขมงคล: <span className={headingCls}>{selectedLucky}</span>
              </p>
              {selectedElements.length > 0 && (
                <p className={cn("text-xs", subCls)}>
                  องค์ประกอบ: <span className={headingCls}>{selectedElements.map(id => CUSTOM_ELEMENTS.find(e => e.id === id)?.emoji).join(" ")}</span>
                </p>
              )}
              {(customText.trim() || overlayText) && (
                <p className={cn("text-xs", subCls)}>
                  ข้อความ: <span className={cn("font-semibold tracking-wider", headingCls)}>✦ {customText.trim() || overlayText} ✦</span>
                </p>
              )}
              <p className={cn("text-xs", subCls)}>
                สไตล์: <span className={headingCls}>{STYLES.find(s => s.id === selectedStyle)?.label}</span>
              </p>
            </div>
          </div>
        )}

        {/* ════════════════ STEP 5: Generating / Result ════════════════ */}
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
                  onClick={() => { setError(null); setStep(5); }}
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

                {/* Wallpaper info */}
                <div className={cn("p-5 rounded-2xl", cardCls)}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className={cn("w-5 h-5", isPastel || isRainbow ? "text-white" : "text-violet-500")} />
                    <span className={cn("text-sm font-bold", headingCls)}>
                      วอลเปเปอร์เสริมดวง{TOPIC_INFO[selectedTopic].labelTh}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
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
