"use client";

import Link from "next/link";
import { Sparkles, Sun, Palette, Rainbow, ChevronRight } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

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
    <main className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            <span className="font-serif text-lg font-semibold text-violet-600">MysticFlow</span>
          </Link>
        </div>
      </header>

      <div className="px-5 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <Palette className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-semibold text-gray-900">ตั้งค่าธีม</h1>
            <p className="text-sm text-gray-500">เลือกโหมดที่เหมาะกับคุณ</p>
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
                className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                  isActive
                    ? "border-violet-400 bg-violet-50 shadow-lg shadow-violet-100"
                    : "border-gray-200 bg-white hover:border-violet-200"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">{t.name}</h3>
                  <p className="text-sm text-gray-500">{t.description}</p>
                </div>
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isActive ? "border-violet-600 bg-violet-600" : "border-gray-300"
                }`}>
                  {isActive && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Preview Card */}
        <div className="mt-8 p-5 rounded-2xl border border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-4">ตัวอย่าง</h3>
          
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
          <Link href="/pricing" className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-violet-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">แพ็กเกจของฉัน</p>
                <p className="text-sm text-gray-500">ดูหรืออัปเกรดแพ็กเกจ</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link href="/privacy" className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-violet-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <span className="text-lg">🛡️</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">ความเป็นส่วนตัว</p>
                <p className="text-sm text-gray-500">นโยบายและการตั้งค่า</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
      </div>
    </main>
  );
}
