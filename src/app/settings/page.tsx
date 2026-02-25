"use client";

import Link from "next/link";
import { Sparkles, Sun, Palette, Rainbow, ChevronRight } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { cn } from "@/lib/cn";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const isPastel = theme === "pastel";
  const isRainbow = theme === "rainbow";

  const themes = [
    {
      id: "light" as const,
      name: "โหมดสว่าง",
      description: "สะอาดตา เรียบง่าย",
      icon: Sun,
      color: "bg-amber-100 text-amber-600",
    },
    {
      id: "pastel" as const,
      name: "โหมดพาสเทล",
      description: "ม่วง-ชมพู สดใส",
      icon: Palette,
      color: "bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 text-pink-600",
    },
    {
      id: "rainbow" as const,
      name: "โหมดเวทมนตร์",
      description: "สีรุ้ง พลังงานบวก",
      icon: Rainbow,
      color: "bg-gradient-to-r from-pink-100 via-purple-100 to-cyan-100 text-purple-600",
    },
  ];

  return (
    <main className={cn("min-h-screen pb-24", isPastel ? "bg-transparent" : isRainbow ? "bg-transparent" : "bg-white")}>
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-40 backdrop-blur-sm",
        isPastel ? "bg-white/10 border-b border-white/20" : isRainbow ? "bg-[#0f0f1a]/90 border-b border-[rgba(255,0,255,0.2)]" : "bg-white/95 border-b border-gray-100"
      )}>
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className={cn("w-5 h-5", isPastel || isRainbow ? "text-white" : "text-violet-600")} />
            <span className={cn("font-serif text-lg font-semibold", isPastel || isRainbow ? "text-white" : "text-violet-600")}>REFFORTUNE</span>
          </Link>
        </div>
      </header>

      <div className="px-5 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isPastel ? "bg-white/20" : isRainbow ? "bg-[rgba(255,0,255,0.15)]" : "bg-violet-100")}>
            <Palette className={cn("w-5 h-5", isPastel || isRainbow ? "text-white" : "text-violet-600")} />
          </div>
          <div>
            <h1 className={cn("font-serif text-xl font-semibold", isPastel || isRainbow ? "text-white" : "text-gray-900")}>ตั้งค่าธีม</h1>
            <p className={cn("text-sm", isPastel || isRainbow ? "text-white/70" : "text-gray-500")}>เลือกโหมดที่เหมาะกับคุณ</p>
          </div>
        </div>

        {/* Theme Options */}
        <div className="space-y-3">
          {themes.map((t) => {
            const Icon = t.icon;
            const isActive = theme === t.id;
            
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "w-full p-4 rounded-2xl border transition-all flex items-center gap-4",
                  isActive
                    ? isPastel ? "border-white/60 bg-white/25 shadow-lg" : isRainbow ? "border-[#ff00ff] bg-[rgba(255,0,255,0.15)] shadow-lg shadow-[rgba(255,0,255,0.2)]" : "border-violet-400 bg-violet-50 shadow-lg shadow-violet-100"
                    : isPastel ? "border-white/20 bg-white/10 hover:border-white/40" : isRainbow ? "border-[rgba(255,0,255,0.15)] bg-[#1a1a2e]/80 hover:border-[rgba(255,0,255,0.3)]" : "border-gray-200 bg-white hover:border-violet-200"
                )}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1 text-left">
                  <h3 className={cn("font-semibold", isPastel || isRainbow ? "text-white" : "text-gray-900")}>{t.name}</h3>
                  <p className={cn("text-sm", isPastel || isRainbow ? "text-white/70" : "text-gray-500")}>{t.description}</p>
                </div>
                
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                  isActive ? isRainbow ? "border-[#ff00ff] bg-[#ff00ff]" : "border-violet-600 bg-violet-600" : isPastel || isRainbow ? "border-white/40" : "border-gray-300"
                )}>
                  {isActive && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Preview Card */}
        <div className={cn("mt-8 p-5 rounded-2xl border", isPastel ? "border-white/20 bg-white/10" : isRainbow ? "border-[rgba(255,0,255,0.15)] bg-[#1a1a2e]/60" : "border-gray-200 bg-gray-50")}>
          <h3 className={cn("font-semibold mb-4", isPastel || isRainbow ? "text-white" : "text-gray-900")}>ตัวอย่าง</h3>
          
          <div className={`p-4 rounded-xl ${
            theme === "rainbow" 
              ? "bg-gradient-to-r from-purple-900 via-pink-900 to-cyan-900 text-white" 
              : theme === "pastel" 
                ? "bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 text-white" 
                : "bg-white border border-gray-200"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                theme === "rainbow"
                  ? "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"
                  : theme === "pastel"
                    ? "bg-white/30 backdrop-blur"
                    : "bg-violet-100 text-violet-600"
              }`}>
                <Sparkles className={`w-5 h-5 ${theme === "rainbow" || theme === "pastel" ? "text-white" : ""}`} />
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  theme === "rainbow" ? "rainbow-text" : ""
                }`}>
                  {theme === "rainbow" ? "✨ เวทมนตร์สีรุ้ง ✨" : 
                   theme === "pastel" ? "🎨 พาสเทลเมมฟิส" : "ตัวอย่างการ์ด"}
                </p>
                <p className={`text-xs ${
                  theme === "light" ? "text-gray-500" : "text-white/80"
                }`}>
                  {theme === "pastel" && "🌸 ม่วง-ชมพู สดใส"}
                  {theme === "light" && "☀️ โหมดกลางวัน"}
                  {theme === "rainbow" && "🌈 เต็มไปด้วยพลังงานบวก"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="mt-8 space-y-3">
          <Link href="/pricing" className={cn(
            "flex items-center justify-between p-4 border rounded-2xl transition-colors",
            isPastel ? "bg-white/10 border-white/20 hover:border-white/40" : isRainbow ? "bg-[#1a1a2e]/80 border-[rgba(255,0,255,0.15)] hover:border-[rgba(255,0,255,0.3)]" : "bg-white border-gray-200 hover:border-violet-300"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isPastel ? "bg-white/20" : isRainbow ? "bg-[rgba(255,215,0,0.15)]" : "bg-amber-100")}>
                <Sparkles className={cn("w-5 h-5", isPastel || isRainbow ? "text-white" : "text-amber-600")} />
              </div>
              <div>
                <p className={cn("font-medium", isPastel || isRainbow ? "text-white" : "text-gray-900")}>แพ็กเกจของฉัน</p>
                <p className={cn("text-sm", isPastel || isRainbow ? "text-white/60" : "text-gray-500")}>ดูหรืออัปเกรดแพ็กเกจ</p>
              </div>
            </div>
            <ChevronRight className={cn("w-5 h-5", isPastel || isRainbow ? "text-white/50" : "text-gray-400")} />
          </Link>

          <Link href="/privacy" className={cn(
            "flex items-center justify-between p-4 border rounded-2xl transition-colors",
            isPastel ? "bg-white/10 border-white/20 hover:border-white/40" : isRainbow ? "bg-[#1a1a2e]/80 border-[rgba(255,0,255,0.15)] hover:border-[rgba(255,0,255,0.3)]" : "bg-white border-gray-200 hover:border-violet-300"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isPastel ? "bg-white/20" : isRainbow ? "bg-[rgba(255,0,255,0.1)]" : "bg-gray-100")}>
                <span className="text-lg">🛡️</span>
              </div>
              <div>
                <p className={cn("font-medium", isPastel || isRainbow ? "text-white" : "text-gray-900")}>ความเป็นส่วนตัว</p>
                <p className={cn("text-sm", isPastel || isRainbow ? "text-white/60" : "text-gray-500")}>นโยบายและการตั้งค่า</p>
              </div>
            </div>
            <ChevronRight className={cn("w-5 h-5", isPastel || isRainbow ? "text-white/50" : "text-gray-400")} />
          </Link>
        </div>
      </div>
    </main>
  );
}
