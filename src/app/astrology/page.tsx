import type { Metadata } from "next";
import Link from "next/link";
import { AppBar } from "@/components/nav/AppBar";
import { Card } from "@/components/ui/Card";
import { FeatureMenu } from "@/components/nav/FeatureMenu";
import { FAB } from "@/components/ui/FAB";

export const metadata: Metadata = {
  title: "โหราศาสตร์ไทย — ดูดวง ดูฤกษ์ ปฏิทินโหราศาสตร์ ทักษา ลัคนา",
  description:
    "ศูนย์รวมเมนูโหราศาสตร์ไทย ดูดวง 2569 ดูฤกษ์ยาม ปฏิทินโหราศาสตร์ไทย สุริยยาตร์/นิรายนะวิธี ลัคนา ทักษา ตรีวัย ดาวเกษตร และดาราศาสตร์",
  alternates: { canonical: "/astrology" },
  openGraph: {
    title: "โหราศาสตร์ไทย — REFFORTUNE",
    description:
      "ศูนย์รวมเมนูโหราศาสตร์ไทย ดูดวง ดูฤกษ์ ปฏิทินโหราศาสตร์ และเครื่องมือคำนวณดวงชะตา",
    url: "/astrology",
  },
};

type AstrologyItem = {
  title: string;
  description: string;
  icon: string;
  href: string;
  comingSoon?: boolean;
};

type AstrologySection = {
  heading: string;
  subheading: string;
  items: AstrologyItem[];
};

const sections: AstrologySection[] = [
  {
    heading: "ดูดวง",
    subheading: "พยากรณ์ดวงชะตาด้วยศาสตร์โหราศาสตร์ไทยและไพ่",
    items: [
      {
        title: "ดูดวง 2569",
        description: "ดวงชะตารายปี เห็นจังหวะชีวิตล่วงหน้า",
        icon: "🔮",
        href: "/horoscope",
      },
      {
        title: "ดูดวงรายวัน",
        description: "พลังงานและจังหวะของวันนี้",
        icon: "📅",
        href: "/horoscope/daily",
      },
      {
        title: "ดูดวงรายสัปดาห์",
        description: "ทิศทางสัปดาห์นี้ของคุณ",
        icon: "📆",
        href: "/horoscope/weekly",
      },
      {
        title: "ดูดวงรายเดือน",
        description: "ภาพรวมและแนวโน้มรายเดือน",
        icon: "🗓️",
        href: "/horoscope/monthly",
      },
      {
        title: "หมอดูไพ่ทาโรต์",
        description: "เปิดไพ่หาคำตอบเรื่องที่ค้างคาใจ",
        icon: "🃏",
        href: "/tarot",
      },
      {
        title: "ไพ่ประจำวัน",
        description: "ไพ่ใบเดียวสำหรับวันนี้",
        icon: "✨",
        href: "/daily-card",
      },
    ],
  },
  {
    heading: "ดูฤกษ์",
    subheading: "เลือกวันเวลามงคลสำหรับเรื่องสำคัญในชีวิต",
    items: [
      {
        title: "ฤกษ์มงคลทั่วไป",
        description: "วันดี เวลาดี ตามหลักโหราศาสตร์ไทย",
        icon: "🕊️",
        href: "/astrology/auspicious",
        comingSoon: true,
      },
      {
        title: "ฤกษ์แต่งงาน",
        description: "เลือกวันแต่งให้ชีวิตคู่ราบรื่น",
        icon: "💍",
        href: "/astrology/auspicious/wedding",
        comingSoon: true,
      },
      {
        title: "ฤกษ์ขึ้นบ้านใหม่",
        description: "วันดีสำหรับเริ่มต้นชีวิตในบ้านหลังใหม่",
        icon: "🏡",
        href: "/astrology/auspicious/housewarming",
        comingSoon: true,
      },
      {
        title: "ฤกษ์ออกรถ",
        description: "วันดีสำหรับการรับรถใหม่",
        icon: "🚗",
        href: "/astrology/auspicious/car",
        comingSoon: true,
      },
    ],
  },
  {
    heading: "ปฏิทินโหราศาสตร์ไทย",
    subheading: "ปฏิทินดวงดาวสำหรับการคำนวณดวงชะตา",
    items: [
      {
        title: "ปฏิทินสุริยยาตร์",
        description: "ปฏิทินโหราศาสตร์ไทยแบบสุริยยาตร์",
        icon: "☀️",
        href: "/astrology/calendar/surya",
        comingSoon: true,
      },
      {
        title: "ปฏิทินนิรายนะวิธี",
        description: "ปฏิทินโหราศาสตร์ไทยแบบนิรายนะ",
        icon: "🌙",
        href: "/astrology/calendar/nirayana",
        comingSoon: true,
      },
      {
        title: "ดาราศาสตร์",
        description: "ตำแหน่งดาวและปรากฏการณ์ท้องฟ้า",
        icon: "🌌",
        href: "/astrology/astronomy",
        comingSoon: true,
      },
    ],
  },
  {
    heading: "เครื่องมือคำนวณดวงชะตา",
    subheading: "วางลัคนา คำนวณทักษา และวิเคราะห์ดาวประจำตัว",
    items: [
      {
        title: "จักรราศีวิภาค",
        description: "ผังดวงชะตาแบบไทย สุริยยาตร์ / นิรายนะ",
        icon: "🪐",
        href: "/astrology/chart",
      },
      {
        title: "ลัคนา",
        description: "คำนวณลัคนาราศีจากวันเวลาเกิด",
        icon: "♈",
        href: "/astrology/chart",
      },
      {
        title: "ทักษา",
        description: "ดาวประจำวันเกิดและช่วงอายุ",
        icon: "⭐",
        href: "/astrology/taksa",
        comingSoon: true,
      },
      {
        title: "ตรีวัย",
        description: "วิเคราะห์ชีวิตสามช่วงวัย",
        icon: "🔱",
        href: "/astrology/triwai",
        comingSoon: true,
      },
      {
        title: "ดาวเกษตร",
        description: "ดาวประจำราศีและความสัมพันธ์",
        icon: "🌟",
        href: "/astrology/dao-kaset",
        comingSoon: true,
      },
      {
        title: "เลข 7 ตัว",
        description: "ดวงเลข 7 ตัวจากวันเดือนปีเกิด",
        icon: "🔢",
        href: "/numerology",
      },
      {
        title: "เลขศาสตร์ชื่อ",
        description: "วิเคราะห์ชื่อภาษาไทยตามเลขศาสตร์",
        icon: "📝",
        href: "/name-numerology",
      },
    ],
  },
];

export default function AstrologyHubPage() {
  return (
    <main className="mx-auto w-full max-w-lg">
      <header className="px-5 pt-7 pb-3">
        <AppBar
          title={<span className="sr-only">โหราศาสตร์ไทย</span>}
          backHref="/explore"
          className="px-0 pt-0 pb-0"
        />
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-fg">
          โหราศาสตร์ไทย
        </h1>
        <p className="mt-1 text-sm text-fg-muted">
          ศูนย์รวมเมนูโหราศาสตร์ไทย ดูดวง ดูฤกษ์ ปฏิทินโหราศาสตร์
          และเครื่องมือคำนวณดวงชะตา
        </p>
      </header>

      <div className="px-5 pb-6 space-y-8">
        {sections.map((section) => (
          <section key={section.heading} aria-labelledby={`sec-${section.heading}`}>
            <div className="mb-3 px-1">
              <h2
                id={`sec-${section.heading}`}
                className="text-lg font-semibold text-fg"
              >
                {section.heading}
              </h2>
              <p className="mt-0.5 text-xs text-fg-muted">{section.subheading}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {section.items.map((item) => {
                const card = (
                  <Card className="h-full p-4 bg-bg">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-surface text-xl">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-sm font-semibold text-fg">
                            {item.title}
                          </h3>
                          {item.comingSoon && (
                            <span className="inline-flex items-center rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-fg-subtle border border-border">
                              เร็วๆ นี้
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-fg-muted line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );

                if (item.comingSoon) {
                  return (
                    <div
                      key={item.title}
                      aria-disabled="true"
                      className="opacity-70 cursor-not-allowed"
                    >
                      {card}
                    </div>
                  );
                }

                return (
                  <Link key={item.title} href={item.href} className="block">
                    {card}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        <div className="pt-2">
          <FeatureMenu title="ลองดูดวงแบบอื่น" />
        </div>
      </div>

      <FAB label="เพิ่มเพื่อน LINE" />
    </main>
  );
}
