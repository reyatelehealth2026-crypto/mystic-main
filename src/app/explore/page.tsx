"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Sparkles,
  Calendar,
  Ghost,
  Hash,
  Star,
  Heart,
  CircleDot,
  Compass,
  FileText,
  Search,
  ImageIcon,
  Moon
} from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { cn } from "@/lib/cn";
import { BrandLogo } from "@/components/ui/BrandLogo";

const categories = [
  {
    title: "ทาโรต์",
    description: "เปิดไพ่ทาโรต์ 1, 3, หรือ 10 ใบ",
    href: "/tarot",
    icon: Sparkles,
  },
  {
    title: "ไพ่รายวัน",
    description: "ไพ่ประจำวันของคุณ",
    href: "/daily-card",
    icon: Calendar,
  },
  {
    title: "เส้นทางจิตวิญญาณ",
    description: "ไพ่ประจำราศี + ไพ่จิตวิญญาณ",
    href: "/spirit-path",
    icon: Ghost,
  },
  {
    title: "เลขศาสตร์",
    description: "วิเคราะห์เบอร์โทรศัพท์",
    href: "/numerology",
    icon: Hash,
  },
  {
    title: "ดวงชะตา",
    description: "ดูดวงรายวัน รายสัปดาห์ รายเดือน",
    href: "/horoscope",
    icon: Star,
  },
  {
    title: "โหราศาสตร์ไทย",
    description: "ดูฤกษ์ ปฏิทินโหราศาสตร์ ลัคนา ทักษา",
    href: "/astrology",
    icon: Moon,
  },
  {
    title: "ความเข้ากัน",
    description: "ดูดวงความรักและความสัมพันธ์",
    href: "/compatibility",
    icon: Heart,
  },
  {
    title: "ปีจีน",
    description: "ดวงตามปีเกิดจีน",
    href: "/chinese-zodiac",
    icon: CircleDot,
  },
  {
    title: "เฉพาะทาง",
    description: "การงาน การเงิน หรือความรัก",
    href: "/specialized",
    icon: Compass,
  },
  {
    title: "เลขศาสตร์ชื่อ",
    description: "วิเคราะห์ชื่อภาษาไทย",
    href: "/name-numerology",
    icon: FileText,
  },
  {
    title: "เซียมซีเสี่ยงทาย",
    description: "เขย่าติ้วรับคำทำนายจากศาสตร์โบราณ",
    href: "/esiimsi",
    icon: Sparkles,
  },
  {
    title: "วอลเปเปอร์เสริมดวง",
    description: "สร้างวอลเปเปอร์มงคลด้วย AI วันละ 1 ครั้ง",
    href: "/wallpaper",
    icon: ImageIcon,
  },
];

const HREF_TO_TYPE: Record<string, string> = {
  "/tarot": "tarot",
  "/daily-card": "daily_card",
  "/spirit-path": "spirit_card",
  "/numerology": "numerology",
  "/horoscope": "horoscope",
  "/compatibility": "compatibility",
  "/chinese-zodiac": "chinese_zodiac",
  "/name-numerology": "name_numerology",
};

export default function ExplorePage() {
  const { theme } = useTheme();
  const isPastel = theme === "pastel";
  const isRainbow = theme === "rainbow";
  const { user } = useAuth();
  const [costs, setCosts] = React.useState<Record<string, { label: string; cost: number }>>({});

  React.useEffect(() => {
    fetch("/api/service-costs", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok) setCosts(d.costs);
      })
      .catch(() => {});
  }, []);

  return (
    <main className={cn("min-h-screen pb-24", isPastel ? "bg-transparent" : isRainbow ? "bg-transparent" : "bg-white")}>
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-40 backdrop-blur-sm",
        isPastel ? "bg-white/10 border-b border-white/20" : isRainbow ? "bg-[#0f0f1a]/90 border-b border-[rgba(255,0,255,0.2)]" : "bg-white/95 border-b border-gray-100"
      )}>
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo size={24} inverted={isPastel || isRainbow} />
          </Link>
        </div>
        
        {/* Search Bar */}
        <div className="px-5 pb-4">
          <div className="relative">
            <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5", isPastel ? "text-white/60" : isRainbow ? "text-white/50" : "text-gray-400")} />
            <input
              type="text"
              placeholder="ค้นหาศาสตร์การดูดวง..."
              className={cn(
                "w-full h-12 pl-12 pr-4 rounded-2xl focus:outline-none",
                isPastel 
                  ? "bg-white/20 border border-white/30 text-white placeholder-white/60 focus:border-white/50 focus:ring-2 focus:ring-white/20"
                  : isRainbow
                    ? "bg-[#1a1a2e]/80 border border-[rgba(255,0,255,0.3)] text-white placeholder-white/40 focus:border-[#ff00ff] focus:ring-2 focus:ring-[rgba(255,0,255,0.2)]"
                    : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              )}
            />
          </div>
        </div>
      </header>

      {/* Categories Grid */}
      <section className="px-5 py-6">
        <h1 className={cn("font-serif text-2xl font-semibold mb-2", isPastel || isRainbow ? "text-white" : "text-gray-900")}>สำรวจศาสตร์</h1>
        <p className={cn("text-sm mb-3", isPastel || isRainbow ? "text-white/70" : "text-gray-500")}>เลือกศาสตร์ที่คุณสนใจเพื่อเริ่มดูดวง</p>

        {user ? (
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
            💎 แต้มคงเหลือ {user.credits}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className={cn(
                  "group p-4 transition-all hover:-translate-y-0.5",
                  isPastel
                    ? "rounded-2xl bg-white/20 backdrop-blur border border-white/30 hover:bg-white/30 hover:shadow-[0_8px_32px_rgba(199,125,255,0.3)]"
                    : isRainbow
                      ? "rounded-2xl bg-[#1a1a2e]/80 backdrop-blur border border-[rgba(255,0,255,0.15)] hover:border-[rgba(255,0,255,0.4)] hover:shadow-[0_8px_32px_rgba(255,0,255,0.2)]"
                      : "ds-card rounded-2xl hover:[border-color:var(--border-mystical)]",
                )}
              >
                <div className={cn(
                  "w-12 h-12 flex items-center justify-center mb-3",
                  isPastel ? "bg-white/20 text-white rounded-2xl" : isRainbow ? "bg-[rgba(255,0,255,0.15)] text-white rounded-2xl" : "ds-bubble",
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className={cn("font-semibold text-sm mb-1", isPastel || isRainbow ? "text-white" : "text-[var(--text)]")}>{cat.title}</h3>
                <p className={cn("text-xs line-clamp-2", isPastel || isRainbow ? "text-white/70" : "text-[var(--text-muted)]")}>{cat.description}</p>
                {(() => {
                  const t = HREF_TO_TYPE[cat.href];
                  const c = t ? costs[t] : undefined;
                  if (!c) return null;
                  const enough = !user || user.credits >= c.cost;
                  return (
                    <span
                      className={cn(
                        "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        enough ? "bg-violet-100 text-violet-700" : "bg-red-100 text-red-600",
                      )}
                    >
                      💎 {c.cost} เครดิต{!enough ? " · แต้มไม่พอ" : ""}
                    </span>
                  );
                })()}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Section */}
      <section className="px-5 pb-6">
        <h2 className={cn("font-serif text-xl font-semibold mb-4", isPastel || isRainbow ? "text-white" : "text-gray-900")}>ยอดนิยม</h2>
        
        <div className="space-y-3">
          <Link href="/tarot" className={cn(
            "flex items-center gap-4 p-4 rounded-2xl border",
            isPastel
              ? "bg-white/20 backdrop-blur border-white/30"
              : isRainbow
                ? "bg-[#1a1a2e]/80 border-[rgba(255,0,255,0.2)]"
                : "bg-violet-50 border-violet-100"
          )}>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", isPastel ? "bg-white/20 text-white" : isRainbow ? "bg-[rgba(255,0,255,0.15)] text-white" : "bg-violet-100 text-violet-600")}>
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className={cn("font-semibold", isPastel || isRainbow ? "text-white" : "text-gray-900")}>ไพ่ทาโรต์ 3 ใบ</h3>
              <p className={cn("text-sm", isPastel || isRainbow ? "text-white/70" : "text-gray-500")}>อดีต ปัจจุบัน อนาคต</p>
            </div>
            <span className={isPastel || isRainbow ? "text-white" : "text-violet-600"}>→</span>
          </Link>

          <Link href="/daily-card" className={cn(
            "flex items-center gap-4 p-4 rounded-2xl border",
            isPastel
              ? "bg-white/20 backdrop-blur border-white/30"
              : isRainbow
                ? "bg-[#1a1a2e]/80 border-[rgba(0,255,255,0.2)]"
                : "bg-rose-50 border-rose-100"
          )}>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", isPastel ? "bg-white/20 text-white" : isRainbow ? "bg-[rgba(0,255,255,0.15)] text-white" : "bg-rose-100 text-rose-600")}>
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className={cn("font-semibold", isPastel || isRainbow ? "text-white" : "text-gray-900")}>ไพ่ประจำวัน</h3>
              <p className={cn("text-sm", isPastel || isRainbow ? "text-white/70" : "text-gray-500")}>พลังงานวันนี้ของคุณ</p>
            </div>
            <span className={isPastel || isRainbow ? "text-white" : "text-rose-600"}>→</span>
          </Link>

          <Link href="/numerology" className={cn(
            "flex items-center gap-4 p-4 rounded-2xl border",
            isPastel
              ? "bg-white/20 backdrop-blur border-white/30"
              : isRainbow
                ? "bg-[#1a1a2e]/80 border-[rgba(255,215,0,0.2)]"
                : "bg-indigo-50 border-indigo-100"
          )}>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", isPastel ? "bg-white/20 text-white" : isRainbow ? "bg-[rgba(255,215,0,0.15)] text-white" : "bg-indigo-100 text-indigo-600")}>
              <Hash className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className={cn("font-semibold", isPastel || isRainbow ? "text-white" : "text-gray-900")}>วิเคราะห์เบอร์มงคล</h3>
              <p className={cn("text-sm", isPastel || isRainbow ? "text-white/70" : "text-gray-500")}>เลขศาสตร์เบอร์โทร</p>
            </div>
            <span className={isPastel || isRainbow ? "text-white" : "text-indigo-600"}>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
