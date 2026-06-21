"use client";

import Link from "next/link";
import { Sparkles, Sun, Palette, Rainbow, ChevronRight } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { AppBar } from "@/components/nav/AppBar";
import { FeatureMenu } from "@/components/nav/FeatureMenu";
import { FAB } from "@/components/ui/FAB";

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
    <main className="mx-auto w-full max-w-lg">
      <header className="px-5 pt-7 pb-3">
        <AppBar title="ตั้งค่า" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">ตั้งค่าธีม</h1>
        <p className="mt-1 text-sm text-fg-muted">เลือกโหมดที่เหมาะกับคุณ</p>
      </header>

      <div className="px-5 pb-6">
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
                    ? "border-accent bg-accent/10 shadow-lg shadow-accent/10"
                    : "border-border bg-surface hover:border-accent/30"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.color}`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-fg">{t.name}</h3>
                  <p className="text-sm text-fg-muted">{t.description}</p>
                </div>

                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isActive ? "border-accent bg-accent" : "border-border"
                }`}>
                  {isActive && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Preview Card — theme-specific content, keep theme checks */}
        <div className="mt-8 p-5 rounded-2xl border border-border bg-surface">
          <h3 className="font-semibold text-fg mb-4">ตัวอย่าง</h3>

          <div className={`p-4 rounded-xl ${
            theme === "rainbow"
              ? "bg-gradient-to-r from-purple-900 via-pink-900 to-cyan-900 text-white"
              : theme === "pastel"
                ? "bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 text-white"
                : "bg-bg border border-border"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                theme === "rainbow"
                  ? "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"
                  : theme === "pastel"
                    ? "bg-white/30 backdrop-blur"
                    : "bg-accent/10 text-accent"
              }`}>
                <Sparkles className={`w-5 h-5 ${theme === "rainbow" || theme === "pastel" ? "text-white" : ""}`} />
              </div>
              <div>
                <p className={`text-sm font-medium ${theme === "rainbow" ? "rainbow-text" : ""}`}>
                  {theme === "rainbow" ? "✨ เวทมนตร์สีรุ้ง ✨" :
                   theme === "pastel" ? "🎨 พาสเทลเมมฟิส" : "ตัวอย่างการ์ด"}
                </p>
                <p className={`text-xs ${theme === "light" ? "text-fg-muted" : "text-white/80"}`}>
                  {theme === "pastel" && "🌸 ม่วง-ชมพู สดใส"}
                  {theme === "light" && "☀️ โหมดกลางวัน"}
                  {theme === "rainbow" && "🌈 เต็มไปด้วยพลังงานบวก"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="mt-6 space-y-3">
          <Link
            href="/pricing"
            className="flex items-center justify-between p-4 border border-border rounded-2xl bg-surface transition-colors hover:border-accent/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-fg">แพ็กเกจของฉัน</p>
                <p className="text-sm text-fg-muted">ดูหรืออัปเกรดแพ็กเกจ</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-fg-muted" />
          </Link>

          <Link
            href="/privacy"
            className="flex items-center justify-between p-4 border border-border rounded-2xl bg-surface transition-colors hover:border-accent/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface border border-border">
                <span className="text-lg">🛡️</span>
              </div>
              <div>
                <p className="font-medium text-fg">ความเป็นส่วนตัว</p>
                <p className="text-sm text-fg-muted">นโยบายและการตั้งค่า</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-fg-muted" />
          </Link>
        </div>

        <div className="mt-8">
          <FeatureMenu />
        </div>
      </div>

      <FAB />
    </main>
  );
}
