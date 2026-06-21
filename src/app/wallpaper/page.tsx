"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Sparkles, Download, Share2, ChevronLeft, ChevronRight,
  Loader2, Lock, Calendar, Palette, Star, Hash, Wand2, Type,
  Coins, Briefcase, Heart, Clover, Activity,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { AppBar } from "@/components/nav/AppBar";
import { Button, buttonVariants } from "@/components/ui/Button";
import { FeatureMenu } from "@/components/nav/FeatureMenu";
import { FAB } from "@/components/ui/FAB";
import { calculateBirthColors, type AuspiciousColor, type BirthColorResult } from "@/lib/thai-astrology/colors";
import { calculateLuckyElements, type LuckyElement, type LuckyElementsResult } from "@/lib/thai-astrology/luckyElements";
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

export default function WallpaperPage() {
  // Wizard step: 1=birthdate, 2=topic+lucky, 3=custom elements+text, 4=style, 5=generating/result
  const [step, setStep] = useState(1);

  // Step 1: Birth date
  const [birthDateStr, setBirthDateStr] = useState("");
  const [birthTimeStr, setBirthTimeStr] = useState("");
  const [birthColors, setBirthColors] = useState<BirthColorResult | null>(null);
  const [selectedColors, setSelectedColors] = useState<AuspiciousColor[]>([]);

  // Step 2: Topic + Lucky number
  const [selectedTopic, setSelectedTopic] = useState<WallpaperTopic>("finance");
  const [topicSymbols, setTopicSymbols] = useState<TopicSymbols | null>(null);
  const [luckyNumbers, setLuckyNumbers] = useState<LuckyNumberOption[]>([]);
  const [selectedLucky, setSelectedLucky] = useState<number | null>(null);

  // Step 3: Custom elements + overlay text
  const [luckyElements, setLuckyElements] = useState<LuckyElementsResult | null>(null);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
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

  // ── Step 1: Calculate birth colors and lucky elements ──
  const handleBirthSubmit = useCallback(() => {
    if (!birthDateStr) return;
    const date = new Date(birthDateStr);
    if (isNaN(date.getTime())) return;

    const hourNum = birthTimeStr ? parseInt(birthTimeStr.split(":")[0], 10) : undefined;
    const colors = calculateBirthColors(date, hourNum);
    setBirthColors(colors);
    setSelectedColors([]);

    const elements = calculateLuckyElements(date);
    setLuckyElements(elements);
    setSelectedElements([]);
  }, [birthDateStr, birthTimeStr]);

  const toggleColor = useCallback((color: AuspiciousColor) => {
    setSelectedColors((prev) => {
      const exists = prev.some((c) => c.hex === color.hex);
      if (exists) return prev.filter((c) => c.hex !== color.hex);
      if (prev.length >= 2) return [prev[1], color];
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
    if (step === 3) return true;
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

    const finalText = customText.trim();
    const elementDescs = selectedElements
      .map((id) => luckyElements?.elements.find((e) => e.id === id)?.en ?? "")
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
  }, [alreadyGenerated, isGenerating, selectedColors, selectedTopic, topicSymbols, selectedLucky, selectedStyle, selectedElements, customText, luckyElements]);

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

  const STEP_LABELS = ["วันเกิด", "เรื่องเสริม", "เลขมงคล", "สไตล์", "ผลลัพธ์"];

  return (
    <main className="mx-auto w-full max-w-lg">
      <header className="px-5 pt-7 pb-3">
        <AppBar title="วอลเปเปอร์เสริมดวง" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">วอลเปเปอร์เสริมดวง</h1>
        <p className="mt-1 text-sm text-fg-muted">สร้างวอลเปเปอร์มงคลด้วย AI วันละ 1 ครั้ง</p>
      </header>

      <div className="px-5 pb-6">
        {/* Step Progress */}
        {step < 5 && (
          <div className="flex items-center gap-1 mb-6">
            {STEP_LABELS.slice(0, 4).map((label, i) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-1">
                <div className={cn(
                  "h-1.5 w-full rounded-full transition-all",
                  i + 1 <= step ? "bg-accent" : "bg-border"
                )} />
                <span className={cn("text-[10px]", i + 1 <= step ? "text-fg" : "text-fg-muted")}>
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
              <Calendar className="w-8 h-8 mx-auto mb-2 text-accent" />
              <h2 className="font-serif text-xl font-bold text-fg">กรอกวันเกิดของคุณ</h2>
              <p className="text-sm mt-1 text-fg-muted">ระบบจะคำนวณสีมงคลจากทักษา ราศี และลัคนา</p>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-border">
              <label className="text-sm font-semibold block mb-2 text-fg">
                วัน/เดือน/ปีเกิด *
              </label>
              <input
                type="date"
                value={birthDateStr}
                onChange={(e) => { setBirthDateStr(e.target.value); setBirthColors(null); setSelectedColors([]); }}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition bg-bg border border-border text-fg focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-border">
              <label className="text-sm font-semibold block mb-2 text-fg">
                เวลาเกิด (ไม่บังคับ — สำหรับคำนวณลัคนา)
              </label>
              <input
                type="time"
                value={birthTimeStr}
                onChange={(e) => { setBirthTimeStr(e.target.value); setBirthColors(null); setSelectedColors([]); }}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition bg-bg border border-border text-fg focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            {birthDateStr && !birthColors && (
              <button
                onClick={handleBirthSubmit}
                className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full")}
              >
                <Palette className="w-4 h-4 inline mr-2" />
                คำนวณสีมงคล
              </button>
            )}

            {birthColors && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-center text-fg">
                  เลือกสีมงคล 1-2 สี สำหรับวอลเปเปอร์
                </p>

                <div className="p-4 rounded-2xl bg-surface border border-border">
                  <p className="text-xs font-semibold mb-3 text-fg-muted">{birthColors.dayColors.label}</p>
                  <div className="flex gap-3">
                    {[birthColors.dayColors.primary, birthColors.dayColors.secondary].filter(Boolean).map((c) => c && (
                      <ColorSwatch
                        key={c.hex}
                        color={c}
                        selected={selectedColors.some((s) => s.hex === c.hex)}
                        onToggle={() => toggleColor(c)}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-border">
                  <p className="text-xs font-semibold mb-3 text-fg-muted">{birthColors.zodiacColors.label}</p>
                  <div className="flex gap-3">
                    {[birthColors.zodiacColors.primary, birthColors.zodiacColors.secondary].filter(Boolean).map((c) => c && (
                      <ColorSwatch
                        key={c.hex}
                        color={c}
                        selected={selectedColors.some((s) => s.hex === c.hex)}
                        onToggle={() => toggleColor(c)}
                      />
                    ))}
                  </div>
                </div>

                {birthColors.ascendantColors && (
                  <div className="p-4 rounded-2xl bg-surface border border-border">
                    <p className="text-xs font-semibold mb-3 text-fg-muted">{birthColors.ascendantColors.label}</p>
                    <div className="flex gap-3">
                      {[birthColors.ascendantColors.primary, birthColors.ascendantColors.secondary].filter(Boolean).map((c) => c && (
                        <ColorSwatch
                          key={c.hex}
                          color={c}
                          selected={selectedColors.some((s) => s.hex === c.hex)}
                          onToggle={() => toggleColor(c)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {selectedColors.length > 0 && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs text-fg-muted">สีที่เลือก:</span>
                    {selectedColors.map((c) => (
                      <div
                        key={c.hex}
                        className="w-6 h-6 rounded-full ring-2 ring-border"
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
              <Star className="w-8 h-8 mx-auto mb-2 text-accent" />
              <h2 className="font-serif text-xl font-bold text-fg">เลือกเรื่องที่ต้องการเสริม</h2>
              <p className="text-sm mt-1 text-fg-muted">เลือกหมวดและเลขมงคลเสริมดวง</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {TOPICS.map((t) => {
                const isActive = selectedTopic === t.id && !!topicSymbols;
                const iconCls = cn("w-5 h-5 mx-auto mb-1", isActive ? "text-accent" : "text-fg-subtle");
                return (
                  <button
                    key={t.id}
                    onClick={() => handleTopicSelect(t.id)}
                    className={cn(
                      "p-3 rounded-2xl border text-center transition-all active:scale-[0.97]",
                      isActive
                        ? "bg-accent/10 border-accent shadow-sm"
                        : "bg-surface border-border hover:border-accent/50"
                    )}
                  >
                    {t.id === "finance" && <Coins className={iconCls} />}
                    {t.id === "career" && <Briefcase className={iconCls} />}
                    {t.id === "love" && <Heart className={iconCls} />}
                    {t.id === "luck" && <Clover className={iconCls} />}
                    {t.id === "health" && <Activity className={iconCls} />}
                    <p className="text-xs font-medium text-fg">{t.label}</p>
                    <p className="text-[10px] opacity-60 text-fg-muted">{t.sublabel}</p>
                  </button>
                );
              })}
            </div>

            {topicSymbols && luckyNumbers.length > 0 && (
              <div className="space-y-3">
                <div className="text-center">
                  <Hash className="w-6 h-6 mx-auto mb-1 text-accent" />
                  <h3 className="font-semibold text-fg">เลขมงคลเสริมดวง</h3>
                  <p className="text-xs mt-1 text-fg-muted">
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
                        selectedLucky === ln.num
                          ? "bg-accent/10 border-accent shadow-sm"
                          : "bg-surface border-border hover:border-accent/50"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0",
                        selectedLucky === ln.num ? "bg-accent/20 text-accent" : "bg-surface text-fg-subtle"
                      )}>
                        {ln.num}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-fg">{ln.reasonTh}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-fg-muted">พลังเสริม</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "w-2 h-2 rounded-full",
                                  i < ln.score ? "bg-accent" : "bg-border"
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
              <Type className="w-8 h-8 mx-auto mb-2 text-accent" />
              <h2 className="font-serif text-xl font-bold text-fg">ปรับแต่งภาพ</h2>
              <p className="text-sm mt-1 text-fg-muted">เลือกองค์ประกอบและข้อความ (ไม่บังคับ)</p>
            </div>

            {luckyElements && (
              <div>
                <p className="text-sm font-semibold mb-2 text-fg">องค์ประกอบมงคลสำหรับคุณ</p>
                <p className="text-xs mb-3 text-fg-muted">คำนวณจากวัน/เดือน/ปีเกิด</p>
                <div className="flex flex-wrap gap-2">
                  {luckyElements.elements.map((el) => {
                    const isSelected = selectedElements.includes(el.id);
                    return (
                      <button
                        key={el.id}
                        onClick={() => setSelectedElements((prev) =>
                          isSelected ? prev.filter((id) => id !== el.id) : [...prev, el.id]
                        )}
                        className={cn(
                          "px-3 py-2 rounded-full border text-sm transition-all active:scale-[0.96]",
                          isSelected
                            ? "bg-accent/10 border-accent shadow-sm"
                            : "bg-surface border-border hover:border-accent/50"
                        )}
                      >
                        {el.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-semibold mb-2 text-fg">เพิ่มข้อความในภาพ</p>
              <p className="text-xs mb-3 text-fg-muted">ข้อความเล็กๆ ใต้รูปเหมือนลายเซ็นศิลปิน (ไม่บังคับ)</p>

              <div className="relative">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => {
                    if (e.target.value.length <= 12) setCustomText(e.target.value);
                  }}
                  placeholder="พิมพ์ข้อความ (สูงสุด 12 ตัว)"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-fg placeholder:text-fg-subtle text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                  style={{ fontFamily: "'Srisakdi', 'Charm', 'Noto Sans Thai', cursive" }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-fg-muted">
                  {customText.length}/12
                </span>
              </div>

              {customText.trim() && (
                <div className="mt-3 px-3 py-2 rounded-lg text-center bg-surface border border-border">
                  <span
                    className="text-xs italic tracking-wide text-fg"
                    style={{ fontFamily: "'Srisakdi', 'Charm', 'Noto Sans Thai', cursive" }}
                  >
                    — {customText.trim()} —
                  </span>
                  <p className="text-[10px] mt-1 text-fg-muted">ตัวอย่างลายเซ็นข้อความ</p>
                </div>
              )}
            </div>

            <p className="text-xs text-center text-fg-muted">
              ข้ามได้เลย ถ้าไม่ต้องการปรับแต่ง
            </p>
          </div>
        )}

        {/* ════════════════ STEP 4: Style ════════════════ */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="text-center mb-2">
              <Palette className="w-8 h-8 mx-auto mb-2 text-accent" />
              <h2 className="font-serif text-xl font-bold text-fg">เลือกสไตล์ภาพ</h2>
              <p className="text-sm mt-1 text-fg-muted">เลือกบรรยากาศของวอลเปเปอร์</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStyle(s.id)}
                  className={cn(
                    "p-5 rounded-2xl border text-center transition-all active:scale-[0.97]",
                    selectedStyle === s.id
                      ? "bg-accent/10 border-accent shadow-sm"
                      : "bg-surface border-border hover:border-accent/50"
                  )}
                >
                  <span className="text-3xl">{s.emoji}</span>
                  <p className="text-sm font-bold mt-2 text-fg">{s.label}</p>
                  <p className="text-xs mt-1 text-fg-muted">{s.desc}</p>
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl space-y-2 bg-surface border border-border">
              <p className="text-xs font-semibold text-fg-muted">สรุปก่อนสร้าง</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-fg-muted">สี:</span>
                {selectedColors.map((c) => (
                  <div key={c.hex} className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.hex }} />
                    <span className="text-xs text-fg">{c.nameTh}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-fg-muted">
                เรื่อง: <span className="text-fg">{TOPIC_INFO[selectedTopic].emoji} {TOPIC_INFO[selectedTopic].labelTh}</span>
              </p>
              <p className="text-xs text-fg-muted">
                เลขมงคล: <span className="text-fg">{selectedLucky}</span>
              </p>
              {selectedElements.length > 0 && luckyElements && (
                <p className="text-xs text-fg-muted">
                  องค์ประกอบ: <span className="text-fg">{selectedElements.map(id => luckyElements.elements.find(e => e.id === id)?.label).filter(Boolean).join(", ")}</span>
                </p>
              )}
              {customText.trim() && (
                <p className="text-xs text-fg-muted">
                  ข้อความ: <span className="font-semibold tracking-wider text-fg">✦ {customText.trim()} ✦</span>
                </p>
              )}
              <p className="text-xs text-fg-muted">
                สไตล์: <span className="text-fg">{STYLES.find(s => s.id === selectedStyle)?.label}</span>
              </p>
            </div>
          </div>
        )}

        {/* ════════════════ STEP 5: Generating / Result ════════════════ */}
        {step === 5 && (
          <div className="space-y-6">
            {isGenerating && (
              <div className="text-center py-16">
                <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-accent" />
                <p className="text-lg font-semibold text-fg">กำลังสร้างวอลเปเปอร์เสริมดวง...</p>
                <p className="text-sm mt-2 text-fg-muted">กรุณารอสักครู่</p>
              </div>
            )}

            {error && !generatedImage && (
              <div className="text-center py-8">
                <p className="text-sm text-danger">{error}</p>
                <button
                  onClick={() => { setError(null); setStep(5); }}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}
                >
                  ลองใหม่
                </button>
              </div>
            )}

            {generatedImage && (
              <>
                <div
                  className="relative rounded-3xl overflow-hidden shadow-2xl shadow-accent/20 mx-auto"
                  style={{ maxWidth: 280, aspectRatio: "9/16" }}
                >
                  <img src={generatedImage} alt="วอลเปเปอร์เสริมดวง" className="w-full h-full object-cover" />
                </div>

                <div className="p-5 rounded-2xl bg-surface border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <span className="text-sm font-bold text-fg">
                      วอลเปเปอร์เสริมดวง{TOPIC_INFO[selectedTopic].labelTh}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    {savedData?.selectedColorNames && (
                      <p className="text-xs text-fg-muted">
                        สีมงคล: {savedData.selectedColorNames.join(", ")}
                      </p>
                    )}
                    {(savedData?.luckyNumber || selectedLucky) && (
                      <p className="text-xs text-fg-muted">
                        เลขมงคล: {savedData?.luckyNumber || selectedLucky}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleDownload}
                    className={cn(buttonVariants({ variant: "default", size: "lg" }), "flex items-center gap-2")}
                  >
                    <Download className="w-4 h-4" />
                    ดาวน์โหลด
                  </button>
                  {typeof navigator !== "undefined" && "share" in navigator && (
                    <button
                      onClick={handleShare}
                      className={cn(buttonVariants({ variant: "outline", size: "lg" }), "flex items-center gap-2")}
                    >
                      <Share2 className="w-4 h-4" />
                      แชร์
                    </button>
                  )}
                </div>

                {alreadyGenerated && (
                  <div className="p-4 rounded-2xl text-center bg-surface border border-border">
                    <Lock className="w-6 h-6 mx-auto mb-2 text-fg-muted" />
                    <p className="text-sm font-medium text-fg">สร้างวอลเปเปอร์วันนี้แล้ว</p>
                    <p className="text-xs mt-1 text-fg-muted">
                      กลับมาสร้างใหม่ได้อีกใน {getTimeUntilTomorrow()}
                    </p>
                  </div>
                )}

                <div className="mt-4">
                  <FeatureMenu />
                </div>
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
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "flex-1 flex items-center justify-center gap-1")}
              >
                <ChevronLeft className="w-4 h-4" />
                ย้อนกลับ
              </button>
            )}
            <button
              onClick={step === 4 ? handleGenerate : goNext}
              disabled={!canGoNext}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "flex-1 flex items-center justify-center gap-1",
                !canGoNext && "opacity-40 cursor-not-allowed"
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

      <FAB />
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
}: {
  color: AuspiciousColor;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex flex-col items-center gap-1.5 transition-all active:scale-[0.95]"
    >
      <div
        className={cn(
          "w-12 h-12 rounded-full shadow-md transition-all",
          selected ? "ring-2 ring-offset-2 ring-accent scale-110" : "opacity-70 hover:opacity-100"
        )}
        style={{ backgroundColor: color.hex }}
      />
      <span className="text-[11px] font-medium text-fg-muted">
        {color.nameTh}
      </span>
    </button>
  );
}
