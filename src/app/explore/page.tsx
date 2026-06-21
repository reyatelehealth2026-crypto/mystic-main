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
  Search,
  ImageIcon,
  Moon
} from "lucide-react";
import { AppBar } from "@/components/nav/AppBar";
import { Card } from "@/components/ui/Card";
import { FAB } from "@/components/ui/FAB";

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

export default function ExplorePage() {
  return (
    <main className="mx-auto w-full max-w-lg pb-24">
      <header className="px-5 pt-7 pb-3">
        <AppBar title="สำรวจ" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">สำรวจศาสตร์</h1>
        <p className="mt-1 text-sm text-fg-muted">เลือกศาสตร์ที่คุณสนใจเพื่อเริ่มดูดวง</p>
        <div className="mt-3 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-fg-subtle" />
          <input
            type="text"
            placeholder="ค้นหาศาสตร์การดูดวง..."
            className="w-full h-12 pl-12 pr-4 rounded-2xl border border-border bg-surface text-fg placeholder:text-fg-subtle outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </header>

      <div className="px-5 pb-6">
        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.title} href={cat.href} className="block">
                <Card className="p-4">
                  <div className="w-12 h-12 flex items-center justify-center mb-3 rounded-2xl bg-accent/10 text-accent">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 text-fg">{cat.title}</h3>
                  <p className="text-xs line-clamp-2 text-fg-muted">{cat.description}</p>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Popular Section */}
        <div className="mt-6 space-y-3">
          <h2 className="font-semibold text-lg text-fg">ยอดนิยม</h2>

          <Link href="/tarot" className="block">
            <Card className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 text-accent">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-fg">ไพ่ทาโรต์ 3 ใบ</h3>
                <p className="text-sm text-fg-muted">อดีต ปัจจุบัน อนาคต</p>
              </div>
              <span className="text-accent shrink-0">→</span>
            </Card>
          </Link>

          <Link href="/daily-card" className="block">
            <Card className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 text-accent">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-fg">ไพ่ประจำวัน</h3>
                <p className="text-sm text-fg-muted">พลังงานวันนี้ของคุณ</p>
              </div>
              <span className="text-accent shrink-0">→</span>
            </Card>
          </Link>

          <Link href="/numerology" className="block">
            <Card className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 text-accent">
                <Hash className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-fg">วิเคราะห์เบอร์มงคล</h3>
                <p className="text-sm text-fg-muted">เลขศาสตร์เบอร์โทร</p>
              </div>
              <span className="text-accent shrink-0">→</span>
            </Card>
          </Link>
        </div>
      </div>

      <FAB />
    </main>
  );
}
