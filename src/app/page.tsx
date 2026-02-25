"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Sparkles, Star, ChevronRight, Crown, Settings } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { SocialFooter } from "@/components/ui/SocialFooter";
import { cn } from "@/lib/cn";
import { useConfigStore } from "@/store/useConfigStore";

function trackEvent(event: string, data?: Record<string, unknown>) {
  console.log("[Analytics]", event, data);
}

function todayDate() {
  const d = new Date();
  const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  return `วัน${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "สวัสดีตอนเช้า";
  if (hour < 16) return "สวัสดีตอนบ่าย";
  return "สวัสดีตอนเย็น";
}

const packages = [
  {
    id: "esiimsi-promo",
    name: "เซียมซีเสี่ยงทาย",
    subtitle: "มาใหม่",
    price: "FREE",
    description: "เขย่าติ้วรับคำทำนายโบราณ",
    features: [
      "ระบบเขย่าแบบ Physical 3D",
      "AI ถอดรหัสคำทำนายเชิงลึก",
      "แนะนำแนวทางแก้ไขและโอกาส",
      "น้อมรับคำทำนายได้ไม่จำกัด",
    ],
    popular: true,
    detail: "ศาสตร์การเสี่ยงทายจากวัดดังทั่วไทย",
    href: "/esiimsi"
  },
  {
    id: "horoscope-full",
    name: "เปิดดวงชะตาฉบับเต็ม",
    subtitle: "Personal Horoscope Report",
    price: "฿929",
    description: "PDF 15-20 หน้า",
    features: [
      "พื้นดวงเดิม + Inner Self",
      "การเงิน & ความมั่งคั่ง",
      "อาชีพ & ความสำเร็จ",
      "ความรัก & คู่ครอง",
      "ดวงรายปี 2026 ครบทุกด้าน",
      "เคล็ดลับเสริมดวงเฉพาะบุคคล",
      "การ์ดฮีลใจประจำปี",
    ],
    popular: true,
    detail: "เจาะลึกทุกมิติชีวิตด้วยโหราศาสตร์ไทย ทำ 3-7 วัน",
  },
  {
    id: "tarot-10",
    name: "แพ็ก B | ไพ่ 10 ใบ + โหราศาสตร์",
    subtitle: "ยอดนิยม",
    price: "฿389",
    description: "คอล 20-30 นาที",
    features: [
      "ไพ่ 10 ใบ ดูภาพรวมชีวิต",
      "การงาน การเงิน ความรัก",
      "โชคลาภ คนรอบข้าง สุขภาพ",
      "อ่านคู่โหราศาสตร์",
      "พิมพ์ + อัดเสียง",
    ],
    popular: false,
    detail: "ดูทิศทางชีวิต 1-3 เดือน ชี้ชัดเรื่องไหนเด่น",
  },
  {
    id: "yearly",
    name: "ดูดวงรายปี",
    subtitle: "รู้จังหวะชีวิตล่วงหน้า",
    price: "฿489",
    priceAlt: "฿749 (คอล 1 ชม)",
    description: "PDF หรือ คอล",
    features: [
      "ดวงปีนี้โฟกัสอะไร",
      "เงิน งาน รัก โชค",
      "ไฮไลท์ครบ พร้อมระวัง",
      "ทริคเสริมโชค",
    ],
    popular: false,
    detail: "วางแผนให้แม่นยำ รู้ก่อนล่วงหน้า",
  },
  {
    id: "hora-report",
    name: "ดวงรายปี Hora-Report",
    subtitle: "เลข 7 ตัว",
    price: "฿489",
    description: "ไม่ต้องใช้เวลาเกิด",
    features: [
      "เลข 7 ตัว แม่นยำ",
      "ดวงช่วงอายุนั้นๆ",
      "อะไรดี อะไรปัง อะไรระวัง",
      "เงิน งาน รัก สุขภาพ",
      "ทริคเสริมดวง",
    ],
    popular: false,
    detail: "ศาสตร์เลข 7 ตัว ไม่ต้องใช้เวลาเกิด",
  },
  {
    id: "qa-3",
    name: "โปรเปิดไพ่ 3 คำถาม",
    subtitle: "พิเศษ",
    price: "฿99",
    description: "ถึง 31 ม.ค.",
    features: [
      "ไพ่ถามตอบ 3 คำถาม",
      "เช็คดวง ดูแนวทาง",
      "พิมพ์ตอบกลับ",
      "เร็วสุด 1-2 ชั่วโมง",
    ],
    popular: false,
    detail: "เคลียร์ข้อสงสัยเร็วๆ",
  },
  {
    id: "qa-1",
    name: "โปร 1 คำถาม",
    subtitle: "เหมาๆ",
    price: "฿39",
    description: "ถึง 31 ม.ค.",
    features: [
      "ไพ่ถามตอบ 1 คำถาม",
      "การงาน ความรัก",
      "พิมพ์ตอบกลับ",
    ],
    popular: false,
    detail: "มีข้อสงสัย เปิดไพ่ Q/A",
  },
];

export default function Home() {
  const { theme } = useTheme();
  const isPastel = theme === "pastel";
  const { toggles } = useConfigStore();

  useEffect(() => {
    trackEvent("landing_view", { step: "home" });
  }, []);

  return (
    <main className={cn("min-h-screen pb-24", isPastel ? "bg-transparent" : "bg-white")}>
      {/* Header - Redesigned */}
      <header className="px-5 pt-6 pb-4 flex justify-between items-center">
        <div className="w-10"></div> {/* Spacer for centering logo */}
        <Link href="/" className="flex flex-col items-center">
          {/* Logo with background glow effect */}
          <div className="relative">
            {/* Glow effect */}
            <div className={cn("absolute inset-0 blur-3xl rounded-full scale-150", isPastel ? "bg-white/30" : "bg-violet-400/20")} />
            {/* Logo image */}
            <Image 
              src="/logo.png" 
              alt="REFFORTUNE" 
              width={280} 
              height={100} 
              className="relative h-20 w-auto object-contain drop-shadow-lg"
              priority
            />
          </div>
        </Link>
        <Link href="/admin-config-panel" className={cn(
          "w-10 h-10 flex items-center justify-center rounded-full transition-colors",
          isPastel ? "hover:bg-white/10 text-white/70 hover:text-white" : "hover:bg-violet-50 text-gray-400 hover:text-violet-600"
        )}>
          <Settings className="w-5 h-5" />
        </Link>
      </header>

      {/* Hero Section */}
      <section className="px-5 pt-4">
        <div className={cn(
          "relative overflow-hidden rounded-[28px] p-6 text-white shadow-xl",
          isPastel 
            ? "bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(199,125,255,0.3)]"
            : "bg-gradient-to-br from-violet-600 via-violet-500 to-purple-500 shadow-violet-200"
        )}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <p className={cn("text-sm mb-1", isPastel ? "text-white/80" : "text-violet-100")}>{greeting()}</p>
            <h1 className="font-serif text-2xl font-semibold leading-tight">
              ค้นหาคำตอบที่คุณตามหา
            </h1>
            <p className={cn("mt-2 text-sm leading-relaxed", isPastel ? "text-white/70" : "text-violet-100")}>
              ไพ่ทาโรต์ • ดวงชะตา • ความรัก • เลขศาสตร์
            </p>

            <div className="mt-5 flex gap-3">
              {toggles.enableTarot ? (
                <Link href="/tarot" className="flex-1">
                  <button className={cn(
                    "w-full h-12 rounded-xl font-semibold shadow-lg transition-all active:scale-[0.98]",
                    isPastel 
                      ? "bg-white/30 backdrop-blur text-white border border-white/50 hover:bg-white/50"
                      : "bg-white text-violet-600 hover:bg-violet-50"
                  )}>
                    เริ่มดูดวง
                  </button>
                </Link>
              ) : (
                <div className="flex-1">
                  <button disabled className={cn(
                    "w-full h-12 rounded-xl font-semibold shadow-lg opacity-50 cursor-not-allowed",
                    isPastel 
                      ? "bg-white/10 backdrop-blur text-white/50 border border-white/20"
                      : "bg-gray-100 text-gray-400"
                  )}>
                    ปิดปรับปรุงชั่วคราว
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {toggles.enableDailyAuspicious && (
            <Link href="/daily-card">
              <div className={cn(
                "p-4 rounded-2xl border transition-all",
                isPastel
                  ? "bg-white/20 backdrop-blur border-white/30"
                  : "bg-violet-50 border-violet-100"
              )}>
                <div className={cn("flex items-center gap-2 mb-1", isPastel ? "text-white" : "text-violet-600")}>
                  <Star className="w-4 h-4" />
                  <span className="text-xs font-medium">ไพ่ประจำวัน</span>
                </div>
                <p className={cn("text-xs", isPastel ? "text-white/70" : "text-gray-500")}>{todayDate()}</p>
              </div>
            </Link>
          )}

          <Link href="/library/saved">
            <div className={cn(
              "p-4 rounded-2xl border transition-all",
              isPastel
                ? "bg-white/20 backdrop-blur border-white/30"
                : "bg-gray-50 border-gray-100"
            )}>
              <div className={cn("flex items-center gap-2 mb-1", isPastel ? "text-white" : "text-gray-600")}>
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-medium">การอ่านของฉัน</span>
              </div>
              <p className={cn("text-xs", isPastel ? "text-white/70" : "text-gray-500")}>ดูย้อนหลัง</p>
            </div>
          </Link>

          {toggles.enableLoveTarot && (
            <Link href="/love-tarot" className="col-span-2">
              <div className={cn(
                "p-4 rounded-2xl border transition-all flex items-center justify-between",
                isPastel
                  ? "bg-pink-500/20 backdrop-blur border-pink-400/30"
                  : "bg-pink-50 border-pink-100"
              )}>
                <div>
                  <div className={cn("flex items-center gap-2 mb-1", isPastel ? "text-pink-100" : "text-pink-600")}>
                    <span className="text-base">❤️</span>
                    <span className="text-xs font-medium">ดูดวงความรัก</span>
                  </div>
                  <p className={cn("text-xs", isPastel ? "text-pink-200/70" : "text-pink-500/70")}>เจาะลึกเรื่องหัวใจ</p>
                </div>
                <ChevronRight className={cn("w-4 h-4", isPastel ? "text-pink-200/50" : "text-pink-300")} />
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Packages Section */}
      <section className="px-5 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className={cn("font-serif text-xl font-semibold", isPastel ? "text-white" : "text-gray-900")}>แพ็กเกจแนะนำ</h2>
          <Link href="/pricing" className={cn("text-sm flex items-center gap-1", isPastel ? "text-white/80" : "text-violet-600")}>
            ดูทั้งหมด <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {useConfigStore.getState().packages.map((pkg) => (
            <Link key={pkg.id} href={`/pricing/${pkg.id}`} className="block">
              <div
                className={cn(
                  "relative p-5 rounded-2xl border transition-all active:scale-[0.98]",
                  isPastel
                    ? "bg-white/20 backdrop-blur border-white/30 hover:bg-white/30"
                    : "bg-white border-gray-200 hover:border-violet-200"
                )}
              >
                <div className="flex gap-4">
                  {pkg.imageUrl && (
                    <div className="flex-shrink-0">
                      <img 
                        src={pkg.imageUrl} 
                        alt={pkg.name} 
                        className="w-20 h-20 rounded-xl object-cover border-2 border-white/20 shadow-sm"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={cn("font-semibold text-lg leading-tight", isPastel ? "text-white" : "text-gray-900")}>{pkg.name}</h3>
                      <p className={cn("text-lg font-bold ml-2", isPastel ? "text-white" : "text-violet-600")}>{pkg.price}</p>
                    </div>
                    <p className={cn("text-sm mt-1 mb-3 line-clamp-2", isPastel ? "text-white/70" : "text-gray-500")}>{pkg.description}</p>
                    
                    <ul className="flex flex-wrap gap-2">
                      {pkg.features.slice(0, 2).map((feature) => (
                        <li key={feature} className={cn(
                          "text-[10px] px-2 py-1 rounded-full whitespace-nowrap",
                          isPastel ? "text-white bg-white/20" : "text-gray-600 bg-gray-50 border border-gray-100"
                        )}>
                          {feature}
                        </li>
                      ))}
                      {pkg.features.length > 2 && (
                        <li className={cn(
                          "text-[10px] px-2 py-1 rounded-full",
                          isPastel ? "text-white/80 bg-white/10" : "text-gray-500 bg-gray-50"
                        )}>
                          +{pkg.features.length - 2}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Daily Tip */}
      <section className="px-5 pt-8">
        <div className={cn(
          "p-5 rounded-2xl border",
          isPastel
            ? "bg-white/20 backdrop-blur border-white/30"
            : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100"
        )}>
          <div className={cn("flex items-center gap-2 mb-2", isPastel ? "text-white" : "text-amber-600")}>
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium">คำแนะนำวันนี้</span>
          </div>
          <p className={cn("text-sm leading-relaxed", isPastel ? "text-white/90" : "text-gray-700")}>
            "การเปิดรับพลังงานบวกจะช่วยให้คุณผ่านพ้นวันที่ท้าทายไปได้ด้วยดี"
          </p>
        </div>
      </section>

      {/* Social Footer */}
      <SocialFooter />
    </main>
  );
}
