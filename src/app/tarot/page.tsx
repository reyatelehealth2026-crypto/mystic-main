import Link from "next/link";
import { Layers, Grid3X3, LayoutGrid } from "lucide-react";
import { AppBar } from "@/components/nav/AppBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FeatureMenu } from "@/components/nav/FeatureMenu";
import { FAB } from "@/components/ui/FAB";

const spreads = [
  {
    count: 1,
    title: "ไพ่ 1 ใบ",
    description: "เพื่อคำตอบที่ ชัดเจน ตรงประเด็น",
    icon: Layers,
  },
  {
    count: 2,
    title: "ไพ่ 2 ใบ",
    description: "เปิดไพ่เปรียบเทียบหรือ เปิดไพ่ คำตอบ + ไพ่ขยายความ",
    icon: Grid3X3,
  },
  {
    count: 3,
    title: "ไพ่ 3 ใบ",
    description: "ดู ทิศทางชีวิตปัจจุบัน • อนาคต • ผลสรุป",
    icon: Grid3X3,
  },
  {
    count: 4,
    title: "ไพ่ 4 ใบ",
    description: "ปิดไพ่ตัวแทนความรัก • การเงิน • การงาน • สุขภาพ หรือเลือกหัวข้ออื่นๆ",
    icon: LayoutGrid,
  },
  {
    count: 5,
    title: "ไพ่ 5 ใบ",
    description: "เปิดไพ่โครงสร้างตรวจดวงลึก ครบทุกมิติ",
    icon: LayoutGrid,
  },
  {
    count: 10,
    title: "ไพ่ 10 ใบ",
    description: "Celtic Cross การอ่านไพ่ตาม ราศีจักรวิเคราะห์เชิงลึกแบบมืออาชีพ",
    icon: LayoutGrid,
  },
];

export default function TarotHomePage() {
  return (
    <main className="mx-auto w-full max-w-lg">
      <header className="px-5 pt-7 pb-3">
        <AppBar title="ทาโรต์" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">เลือกไพ่ทาโรต์</h1>
        <p className="mt-1 text-sm text-fg-muted">เลือกจำนวนไพ่ที่ต้องการทำนาย</p>
      </header>

      <div className="px-5 pb-6">
        <div className="flex flex-col gap-3">
          {spreads.map((spread) => (
            <Link key={spread.count} href={`/tarot/pick?count=${spread.count}`} className="block">
              <Card className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <spread.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-fg">{spread.title}</h3>
                    <p className="mt-1 text-sm text-fg-muted">{spread.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="sticky bottom-20 z-30 mt-6">
          <Link href="/tarot/pick?count=3">
            <Button className="w-full" size="lg">เริ่มเปิดไพ่ 3 ใบ</Button>
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
