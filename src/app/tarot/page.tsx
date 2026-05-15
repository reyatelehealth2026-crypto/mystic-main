"use client";

import Link from "next/link";
import { Sparkles, Layers, Grid3X3, LayoutGrid } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { cn } from "@/lib/cn";

const spreads = [
  {
    count: 1,
    title: "ไพ่ 1 ใบ",
    description: "เพื่อคำตอบที่ ชัดเจน ตรงประเด็น",
    eta: "",
    icon: Layers,
  },
  {
    count: 2,
    title: "ไพ่ 2 ใบ",
    description: "เปิดไพ่เปรียบเทียบหรือ เปิดไพ่ คำตอบ + ไพ่ขยายความ",
    eta: "",
    icon: Grid3X3,
  },
  {
    count: 3,
    title: "ไพ่ 3 ใบ",
    description: "ดู ทิศทางชีวิตปัจจุบัน • อนาคต • ผลสรุป",
    eta: "",
    icon: Grid3X3,
  },
  {
    count: 4,
    title: "ไพ่ 4 ใบ",
    description: "ปิดไพ่ตัวแทนความรัก • การเงิน • การงาน • สุขภาพ หรือเลือกหัวข้ออื่นๆ",
    eta: "",
    icon: LayoutGrid,
  },
  {
    count: 5,
    title: "ไพ่ 5 ใบ",
    description: "เปิดไพ่โครงสร้างตรวจดวงลึก ครบทุกมิติ",
    eta: "",
    icon: LayoutGrid,
  },
  {
    count: 10,
    title: "ไพ่ 10 ใบ",
    description: "Celtic Cross การอ่านไพ่ตาม ราศีจักรวิเคราะห์เชิงลึกแบบมืออาชีพ",
    eta: "",
    icon: LayoutGrid,
  },
];

export default function TarotHomePage() {
  const { theme } = useTheme();
  const isPastel = theme === "pastel";
  const isRainbow = theme === "rainbow";

  return (
    <main className={cn("min-h-screen", isPastel ? "bg-transparent" : isRainbow ? "bg-transparent" : "bg-white")}>
      <header className="flex items-center justify-between px-5 pt-4 pb-2">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className={cn("w-5 h-5", isPastel || isRainbow ? "text-white" : "text-violet-600")} />
          <span className={cn("font-serif text-lg font-semibold", isPastel || isRainbow ? "text-white" : "text-violet-600")}>REFFORTUNE</span>
        </Link>
      </header>

      <section className="px-5 pt-4 pb-3">
        <h1 className={cn("font-serif text-3xl font-semibold tracking-tight", isPastel || isRainbow ? "text-white" : "text-gray-900")}>
          ทาโรต์
        </h1>
        <p className={cn("mt-1 text-sm", isPastel || isRainbow ? "text-white/70" : "text-gray-500")}>
          เลือกจำนวนไพ่ที่ต้องการทำนาย
        </p>
      </section>

      <section className="px-5 pb-6">
        <div className="flex flex-col gap-3">
          {spreads.map((spread) => (
            <Link
              key={spread.title}
              href={`/tarot/pick?count=${spread.count}`}
              className="block"
            >
              <div className={cn(
                "p-5 rounded-[24px] transition-all hover:-translate-y-0.5",
                isPastel
                  ? "bg-white/20 backdrop-blur border border-white/30 hover:bg-white/30 hover:shadow-[0_8px_32px_rgba(199,125,255,0.3)]"
                  : isRainbow
                    ? "bg-[#1a1a2e]/80 backdrop-blur border border-[rgba(255,0,255,0.15)] hover:border-[rgba(255,0,255,0.4)] hover:shadow-[0_8px_32px_rgba(255,0,255,0.2)]"
                    : "ds-card hover:[border-color:var(--border-mystical)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(46,16,101,0.05),0_12px_28px_-8px_rgba(124,58,237,0.18)]"
              )}>
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "flex h-12 w-12 flex-shrink-0 items-center justify-center",
                    isPastel ? "bg-white/20 text-white rounded-2xl" : isRainbow ? "bg-[rgba(255,0,255,0.15)] text-white rounded-2xl" : "ds-bubble",
                  )}>
                    <spread.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={cn("text-base font-semibold", isPastel || isRainbow ? "text-white" : "text-[var(--text)]")}>{spread.title}</h3>
                    <div className={cn("mt-1 text-sm", isPastel || isRainbow ? "text-white/70" : "text-[var(--text-muted)]")}>
                      {spread.description}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
