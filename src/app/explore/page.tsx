"use client";

import Link from "next/link";
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
  Search
} from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { cn } from "@/lib/cn";

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
];

export default function ExplorePage() {
  const { theme } = useTheme();
  const isPastel = theme === "pastel";

  return (
    <main className={cn("min-h-screen pb-24", isPastel ? "bg-transparent" : "bg-white")}>
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-40 backdrop-blur-sm",
        isPastel ? "bg-white/10 border-b border-white/20" : "bg-white/95 border-b border-gray-100"
      )}>
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className={cn("w-5 h-5", isPastel ? "text-white" : "text-violet-600")} />
            <span className={cn("font-serif text-lg font-semibold", isPastel ? "text-white" : "text-violet-600")}>MysticFlow</span>
          </Link>
        </div>
        
        {/* Search Bar */}
        <div className="px-5 pb-4">
          <div className="relative">
            <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5", isPastel ? "text-white/60" : "text-gray-400")} />
            <input
              type="text"
              placeholder="ค้นหาศาสตร์การดูดวง..."
              className={cn(
                "w-full h-12 pl-12 pr-4 rounded-2xl focus:outline-none",
                isPastel 
                  ? "bg-white/20 border border-white/30 text-white placeholder-white/60 focus:border-white/50 focus:ring-2 focus:ring-white/20"
                  : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              )}
            />
          </div>
        </div>
      </header>

      {/* Categories Grid */}
      <section className="px-5 py-6">
        <h1 className={cn("font-serif text-2xl font-semibold mb-2", isPastel ? "text-white" : "text-gray-900")}>สำรวจศาสตร์</h1>
        <p className={cn("text-sm mb-6", isPastel ? "text-white/70" : "text-gray-500")}>เลือกศาสตร์ที่คุณสนใจเพื่อเริ่มดูดวง</p>
        
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className={cn(
                  "group p-4 rounded-2xl transition-all hover:-translate-y-0.5",
                  isPastel
                    ? "bg-white/20 backdrop-blur border border-white/30 hover:bg-white/30 hover:shadow-[0_8px_32px_rgba(199,125,255,0.3)]"
                    : "bg-white border border-gray-200 hover:border-violet-300 hover:shadow-[0_8px_32px_rgba(124,58,237,0.12)]"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center mb-3",
                  isPastel ? "bg-white/20 text-white" : "bg-violet-50 text-violet-600"
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className={cn("font-semibold text-sm mb-1", isPastel ? "text-white" : "text-gray-900")}>{cat.title}</h3>
                <p className={cn("text-xs line-clamp-2", isPastel ? "text-white/70" : "text-gray-500")}>{cat.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Section */}
      <section className="px-5 pb-6">
        <h2 className={cn("font-serif text-xl font-semibold mb-4", isPastel ? "text-white" : "text-gray-900")}>ยอดนิยม</h2>
        
        <div className="space-y-3">
          <Link href="/tarot" className={cn(
            "flex items-center gap-4 p-4 rounded-2xl border",
            isPastel
              ? "bg-white/20 backdrop-blur border-white/30"
              : "bg-violet-50 border-violet-100"
          )}>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", isPastel ? "bg-white/20 text-white" : "bg-violet-100 text-violet-600")}>
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className={cn("font-semibold", isPastel ? "text-white" : "text-gray-900")}>ไพ่ทาโรต์ 3 ใบ</h3>
              <p className={cn("text-sm", isPastel ? "text-white/70" : "text-gray-500")}>อดีต ปัจจุบัน อนาคต</p>
            </div>
            <span className={isPastel ? "text-white" : "text-violet-600"}>→</span>
          </Link>

          <Link href="/daily-card" className={cn(
            "flex items-center gap-4 p-4 rounded-2xl border",
            isPastel
              ? "bg-white/20 backdrop-blur border-white/30"
              : "bg-rose-50 border-rose-100"
          )}>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", isPastel ? "bg-white/20 text-white" : "bg-rose-100 text-rose-600")}>
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className={cn("font-semibold", isPastel ? "text-white" : "text-gray-900")}>ไพ่ประจำวัน</h3>
              <p className={cn("text-sm", isPastel ? "text-white/70" : "text-gray-500")}>พลังงานวันนี้ของคุณ</p>
            </div>
            <span className={isPastel ? "text-white" : "text-rose-600"}>→</span>
          </Link>

          <Link href="/numerology" className={cn(
            "flex items-center gap-4 p-4 rounded-2xl border",
            isPastel
              ? "bg-white/20 backdrop-blur border-white/30"
              : "bg-indigo-50 border-indigo-100"
          )}>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", isPastel ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-600")}>
              <Hash className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className={cn("font-semibold", isPastel ? "text-white" : "text-gray-900")}>วิเคราะห์เบอร์มงคล</h3>
              <p className={cn("text-sm", isPastel ? "text-white/70" : "text-gray-500")}>เลขศาสตร์เบอร์โทร</p>
            </div>
            <span className={isPastel ? "text-white" : "text-indigo-600"}>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
