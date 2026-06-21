"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Sparkles, Star, ChevronRight, Crown, Settings, ImageIcon } from "lucide-react";
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
    price: "",
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
  const isRainbow = theme === "rainbow";
  const { toggles } = useConfigStore();

  useEffect(() => {
    trackEvent("landing_view", { step: "home" });
  }, []);

  return (
    <main className={cn("min-h-screen pb-24", isPastel ? "bg-transparent" : isRainbow ? "bg-transparent" : "bg-bg")}>
      {/* Header - Redesigned */}
      <header className="px-5 pt-6 pb-4 flex justify-between items-center">
        <div className="w-10"></div> {/* Spacer for centering logo */}
        <Link href="/" className="flex flex-col items-center">
          {/* Logo with background glow effect */}
          <div className="relative">
            {/* Glow effect */}
            <div className={cn("absolute inset-0 blur-3xl rounded-full scale-150", isPastel ? "bg-white/30" : isRainbow ? "bg-[rgba(255,0,255,0.2)]" : "bg-violet-400/20")} />
            {/* Logo image — orb + wordmark + tagline (transparent PNG) */}
            <Image
              src="/logo-home.png"
              alt="REFFORTUNE"
              width={767}
              height={649}
              className="relative h-24 w-auto object-contain drop-shadow-[0_8px_24px_rgba(124,58,237,0.35)]"
              priority
            />
          </div>
        </Link>
        <Link href="/admin-config-panel" className={cn(
          "w-10 h-10 flex items-center justify-center rounded-full transition-colors",
          isPastel ? "hover:bg-white/10 text-white/70 hover:text-white" : isRainbow ? "hover:bg-white/10 text-white/60 hover:text-white" : "hover:bg-surface text-fg-subtle hover:text-fg"
        )}>
          <Settings className="w-5 h-5" />
        </Link>
      </header>

      {/* Hero Section */}
      <section className="px-5 pt-4">
        <div className={cn(
          "relative p-6 text-white",
          // Design-system "orb" hero: triple inset/outset shadow + bokeh
          // corners are baked into .ds-hero. For non-light themes we keep the
          // theme-specific surfaces (pastel glass / rainbow dark).
          isPastel
            ? "overflow-hidden rounded-[28px] bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(199,125,255,0.3)]"
            : isRainbow
              ? "overflow-hidden rounded-[28px] bg-[#1a1a2e]/90 backdrop-blur-xl border border-[rgba(255,0,255,0.3)] shadow-[0_8px_32px_rgba(255,0,255,0.2)]"
              : "ds-hero",
        )}>
          {(isPastel || isRainbow) && (
            <>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            </>
          )}

          <div className="relative z-10">
            <p className={cn("text-sm mb-1", isPastel || isRainbow ? "text-white/80" : "text-violet-100")}>{greeting()}</p>
            <h1 className="font-serif text-[28px] sm:text-[32px] font-semibold leading-[1.15] tracking-[-0.01em]">
              ค้นหาคำตอบที่คุณตามหา
            </h1>
            <p className={cn("mt-2 text-sm leading-relaxed", isPastel || isRainbow ? "text-white/70" : "text-violet-100")}>
              ไพ่ทาโรต์ · ดวงชะตา · ความรัก · เลขศาสตร์
            </p>

            <div className="mt-5 flex gap-3">
              {toggles.enableTarot ? (
                <Link href="/tarot" className="flex-1">
                  <button className={cn(
                    "w-full h-[50px] rounded-[14px] font-bold text-[14.5px] tracking-[0.01em] transition-all active:scale-[0.98]",
                    isPastel
                      ? "bg-white/30 backdrop-blur text-white border border-white/50 hover:bg-white/50 shadow-lg"
                      : isRainbow
                        ? "bg-gradient-to-r from-[#ff00ff] to-[#00ffff] text-white hover:opacity-90 shadow-lg"
                        : "ds-hero__cta",
                  )}>
                    เริ่มดูดวง
                  </button>
                </Link>
              ) : (
                <div className="flex-1">
                  <button disabled className={cn(
                    "w-full h-[50px] rounded-[14px] font-bold text-[14.5px] opacity-50 cursor-not-allowed shadow-lg",
                    isPastel
                      ? "bg-white/10 backdrop-blur text-white/50 border border-white/20"
                      : isRainbow
                        ? "bg-[#1a1a2e] text-white/40 border border-[rgba(255,0,255,0.1)]"
                        : "bg-surface text-fg-subtle",
                  )}>
                    ปิดปรับปรุงชั่วคราว
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats — uses .ds-stat tone recipes from the design kit */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {toggles.enableDailyAuspicious && (
            <Link href="/daily-card">
              <div className={cn(
                isPastel
                  ? "p-4 rounded-2xl border bg-white/20 backdrop-blur border-white/30 transition-all"
                  : isRainbow
                    ? "p-4 rounded-2xl border bg-[#1a1a2e]/80 border-[rgba(0,255,255,0.2)] transition-all"
                    : "ds-stat ds-stat--violet",
              )}>
                <div className={cn("flex items-center gap-2 mb-1", isPastel || isRainbow ? "text-white" : "text-[var(--accent)]")}>
                  <Star className="w-4 h-4" />
                  <span className="text-xs font-medium">ไพ่ประจำวัน</span>
                </div>
                <p className={cn("text-[11px]", isPastel || isRainbow ? "text-white/70" : "text-[var(--text-subtle)]")}>{todayDate()}</p>
              </div>
            </Link>
          )}

          <Link href="/library/saved">
            <div className={cn(
              isPastel
                ? "p-4 rounded-2xl border bg-white/20 backdrop-blur border-white/30 transition-all"
                : isRainbow
                  ? "p-4 rounded-2xl border bg-[#1a1a2e]/80 border-[rgba(255,0,255,0.15)] transition-all"
                  : "ds-stat ds-stat--neutral",
            )}>
              <div className={cn("flex items-center gap-2 mb-1", isPastel || isRainbow ? "text-white" : "text-[var(--text)]")}>
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-medium">การอ่านของฉัน</span>
              </div>
              <p className={cn("text-[11px]", isPastel || isRainbow ? "text-white/70" : "text-[var(--text-subtle)]")}>ดูย้อนหลัง</p>
            </div>
          </Link>

          <Link href="/wallpaper">
            <div className={cn(
              isPastel
                ? "p-4 rounded-2xl border bg-amber-500/20 backdrop-blur border-amber-400/30 transition-all"
                : isRainbow
                  ? "p-4 rounded-2xl border bg-[#1a1a2e]/80 border-[rgba(255,215,0,0.2)] transition-all"
                  : "ds-stat ds-stat--amber",
            )}>
              <div className={cn("flex items-center gap-2 mb-1", isPastel ? "text-amber-100" : isRainbow ? "text-white" : "text-[var(--gold)]")}>
                <ImageIcon className="w-4 h-4" />
                <span className="text-xs font-medium">วอลเปเปอร์เสริมดวง</span>
              </div>
              <p className={cn("text-[11px]", isPastel ? "text-amber-200/70" : isRainbow ? "text-white/60" : "text-amber-700/70")}>AI สร้างให้ วันละ 1 ครั้ง</p>
            </div>
          </Link>

          {toggles.enableLoveTarot && (
            <Link href="/love-tarot" className="col-span-2">
              <div className={cn(
                "flex items-center justify-between",
                isPastel
                  ? "p-4 rounded-2xl border bg-pink-500/20 backdrop-blur border-pink-400/30 transition-all"
                  : isRainbow
                    ? "p-4 rounded-2xl border bg-[#1a1a2e]/80 border-[rgba(255,0,255,0.2)] transition-all"
                    : "ds-stat ds-stat--pink",
              )}>
                <div>
                  <div className={cn("flex items-center gap-2 mb-1", isPastel ? "text-pink-100" : isRainbow ? "text-white" : "text-[#be185d]")}>
                    <span className="text-base">❤️</span>
                    <span className="text-xs font-medium">ดูดวงความรัก</span>
                  </div>
                  <p className={cn("text-[11px]", isPastel ? "text-pink-200/70" : isRainbow ? "text-white/60" : "text-pink-600/70")}>เจาะลึกเรื่องหัวใจ</p>
                </div>
                <ChevronRight className={cn("w-4 h-4", isPastel ? "text-pink-200/50" : isRainbow ? "text-white/40" : "text-pink-300")} />
              </div>
            </Link>
          )}

          <Link href="/lucky-numbers" className="col-span-2">
            <div className={cn(
              "flex items-center justify-between",
              isPastel
                ? "p-4 rounded-2xl border bg-indigo-500/20 backdrop-blur border-indigo-400/30 transition-all"
                : isRainbow
                  ? "p-4 rounded-2xl border bg-[#1a1a2e]/80 border-[rgba(0,255,255,0.25)] transition-all"
                  : "ds-stat ds-stat--violet",
            )}>
              <div>
                <div className={cn("flex items-center gap-2 mb-1", isPastel ? "text-indigo-100" : isRainbow ? "text-white" : "text-[var(--accent)]")}>
                  <span className="text-base">🔢</span>
                  <span className="text-xs font-medium">ไพ่เลขมงคล</span>
                </div>
                <p className={cn("text-[11px]", isPastel ? "text-indigo-200/70" : isRainbow ? "text-white/60" : "text-[var(--text-subtle)]")}>หยิบ 2 หรือ 4 ใบจากครึ่งวงกลม</p>
              </div>
              <ChevronRight className={cn("w-4 h-4", isPastel ? "text-indigo-200/50" : isRainbow ? "text-white/40" : "text-[var(--accent-light)]")} />
            </div>
          </Link>
        </div>
      </section>

      {/* Packages Section */}
      <section className="px-5 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className={cn("font-serif text-xl font-semibold", isPastel || isRainbow ? "text-white" : "text-fg")}>แพ็กเกจแนะนำ</h2>
          <Link href="/pricing" className={cn("text-sm flex items-center gap-1", isPastel || isRainbow ? "text-white/80" : "text-accent")}>
            ดูทั้งหมด <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {packages.map((pkg, idx) => {
            const circleColors = [
              "bg-gradient-to-br from-red-400 to-red-600",
              "bg-gradient-to-br from-violet-400 to-violet-600",
              "bg-gradient-to-br from-amber-400 to-orange-500",
              "bg-gradient-to-br from-blue-400 to-blue-600",
              "bg-gradient-to-br from-emerald-400 to-emerald-600",
              "bg-gradient-to-br from-pink-400 to-pink-600",
            ];
            const circleColor = circleColors[idx % circleColors.length];
            const badgeLabel = pkg.popular
              ? (pkg.subtitle === "มาใหม่" ? "มาใหม่" : "ลดนิยม")
              : (pkg.subtitle === "ยอดนิยม" ? "ยอดนิยม" : pkg.subtitle === "พิเศษ" ? "แนะนำ" : pkg.subtitle === "เหมาๆ" ? "แนะนำ" : null);
            const maxFeatures = 4;
            const visibleFeatures = pkg.features.slice(0, maxFeatures);
            const extraCount = pkg.features.length - maxFeatures;

            return (
              <Link key={pkg.id} href={pkg.href ?? `/pricing/${pkg.id}`} className="block">
                <div className={cn(
                  "relative p-4 rounded-2xl border transition-all active:scale-[0.98]",
                  isPastel
                    ? "bg-white/15 backdrop-blur border-white/25 hover:bg-white/25"
                    : isRainbow
                      ? "bg-[#1a1a2e]/80 border-[rgba(255,0,255,0.15)] hover:border-[rgba(255,0,255,0.3)] shadow-sm"
                      : "bg-surface border-border hover:border-accent/20 shadow-sm"
                )}>
                  {/* Badge */}
                  {badgeLabel && (
                    <span className={cn(
                      "inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-2",
                      isPastel
                        ? "bg-white/20 text-white"
                        : isRainbow
                          ? "bg-[rgba(255,0,255,0.2)] text-white"
                          : "bg-accent/10 text-accent"
                    )}>
                      <Crown className="w-3 h-3" />
                      {badgeLabel}
                    </span>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    {/* Left content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={cn("font-semibold text-base leading-snug", isPastel || isRainbow ? "text-white" : "text-fg")}>
                          {pkg.name}
                        </h3>
                        <p className={cn("text-base font-bold shrink-0", isPastel || isRainbow ? "text-white" : "text-accent")}>
                          {pkg.price}
                        </p>
                      </div>

                      <p className={cn("text-xs mt-0.5", isPastel || isRainbow ? "text-white/60" : "text-fg-muted")}>
                        {pkg.description}
                      </p>

                      {pkg.detail && (
                        <p className={cn("text-xs mt-1", isPastel ? "text-violet-200" : isRainbow ? "text-[#ff00ff]/80" : "text-accent")}>
                          {pkg.detail}
                        </p>
                      )}

                      {/* Features */}
                      <div className="mt-2.5">
                        <span className={cn("text-[11px]", isPastel || isRainbow ? "text-white/50" : "text-fg-muted")}>รวม:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {visibleFeatures.map((feature) => (
                            <span key={feature} className={cn(
                              "text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap",
                              isPastel
                                ? "bg-white/15 text-white/80"
                                : isRainbow
                                  ? "bg-[rgba(255,0,255,0.1)] text-white/70"
                                  : "bg-surface text-fg-muted"
                            )}>
                              {feature}
                            </span>
                          ))}
                          {extraCount > 0 && (
                            <span className={cn(
                              "text-[11px] px-2 py-0.5 rounded-full",
                              isPastel ? "bg-white/10 text-white/60" : isRainbow ? "bg-[rgba(255,0,255,0.1)] text-white/50" : "bg-accent/5 text-accent"
                            )}>
                              +{extraCount} รายการ
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Circle avatar */}
                    <div className={cn("shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-md self-start mt-1", circleColor)}>
                      {pkg.price === "FREE" ? (
                        <span className="text-white font-bold text-[11px]">FREE</span>
                      ) : (
                        <Sparkles className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Daily Tip */}
      <section className="px-5 pt-8">
        <div className={cn(
          "p-5 rounded-2xl border",
          isPastel
            ? "bg-white/20 backdrop-blur border-white/30"
            : isRainbow
              ? "bg-[#1a1a2e]/60 border-[rgba(255,215,0,0.2)]"
              : "bg-accent/5 border-accent/20"
        )}>
          <div className={cn("flex items-center gap-2 mb-2", isPastel || isRainbow ? "text-white" : "text-accent")}>
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium">คำแนะนำวันนี้</span>
          </div>
          <p className={cn("text-sm leading-relaxed", isPastel || isRainbow ? "text-white/90" : "text-fg-muted")}>
            "การเปิดรับพลังงานบวกจะช่วยให้คุณผ่านพ้นวันที่ท้าทายไปได้ด้วยดี"
          </p>
        </div>
      </section>

      {/* Social Footer */}
      <SocialFooter />
    </main>
  );
}
