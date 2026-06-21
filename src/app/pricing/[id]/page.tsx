import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppBar } from "@/components/nav/AppBar";
import { Button } from "@/components/ui/Button";

interface PricingDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const packages: Record<string, {
  name: string;
  subtitle: string;
  price: string;
  priceAlt?: string;
  description: string;
  fullDescription: string;
  features: string[];
  includes: string[];
  deliveryTime: string;
  format: string;
}> = {
  "horoscope-full": {
    name: "เปิดดวงชะตาฉบับเต็ม",
    subtitle: "Personal Horoscope Report",
    price: "฿929",
    description: "PDF 15-20 หน้า",
    fullDescription: "เจาะลึกทุกมิติชีวิตด้วยโหราศาสตร์ไทย ทั้งพื้นดวงเดิม ดวงชะตาปี 2026 การเสริมดวง และการ์ดคำแนะนำจากไพ่ ฮีลใจประจำปี",
    features: [
      "พื้นดวงเดิม + Inner Self",
      "การเงิน & ความมั่งคั่ง",
      "อาชีพ & ความสำเร็จ",
      "ความรัก & คู่ครอง",
      "บริวาร & คนรอบข้าง",
      "สุขภาพ & อุปสรรค",
    ],
    includes: [
      "ดวงรายปี 2026 ครบทุกด้าน",
      "เคล็ดลับเสริมดวงเฉพาะบุคคล",
      "การ์ดฮีลใจประจำปีจาก Oracle Card",
    ],
    deliveryTime: "3-7 วัน",
    format: "PDF 15-20 หน้า",
  },
  "tarot-10": {
    name: "แพ็ก B | ไพ่ 10 ใบ + โหราศาสตร์",
    subtitle: "ยอดนิยม",
    price: "฿389",
    description: "คอล 20-30 นาที",
    fullDescription: "ดูภาพรวมดวงและทิศทางชีวิตในช่วงนี้ ครอบคลุมทุกเรื่องหลัก ทั้งการงาน การเงิน โชคลาภ ความรัก และจังหวะชีวิต",
    features: [
      "ไพ่ 10 ใบ ดูภาพรวมชีวิต",
      "การงาน การเงิน ความรัก",
      "โชคลาภ คนรอบข้าง สุขภาพ",
      "อ่านคู่โหราศาสตร์",
    ],
    includes: [
      "พิมพ์ + อัดเสียง",
      "คำแนะนำจากไพ่ที่นำไปใช้ได้จริง",
    ],
    deliveryTime: "1-2 วัน",
    format: "คอล 20-30 นาที | พิมพ์ | อัดเสียง",
  },
  "yearly": {
    name: "ดูดวงรายปี",
    subtitle: "รู้จังหวะชีวิตล่วงหน้า",
    price: "฿489",
    priceAlt: "฿749 (คอล 1 ชม)",
    description: "PDF หรือ คอล",
    fullDescription: "รู้จังหวะชีวิตล่วงหน้า วางแผนให้แม่นยำ ดวงปีนี้ควร 'โฟกัส' อะไรที่สุด?",
    features: [
      "ดวงปีนี้โฟกัสอะไร",
      "เงิน งาน รัก โชค",
      "ไฮไลท์ครบ พร้อมระวัง",
      "ทริคเสริมโชค",
    ],
    includes: [],
    deliveryTime: "1-3 วัน",
    format: "PDF หรือ คอล 1 ชม",
  },
  "hora-report": {
    name: "ดวงรายปี Hora-Report",
    subtitle: "เลข 7 ตัว",
    price: "฿489",
    description: "ไม่ต้องใช้เวลาเกิด",
    fullDescription: "ใช้ศาสตร์เลข 7 ตัว ในการทำนายเรื่องเด่นในช่วงอายุนั้นๆ ไม่ต้องใช้เวลาเกิด",
    features: [
      "เลข 7 ตัว แม่นยำ",
      "ดวงช่วงอายุนั้นๆ",
      "อะไรดี อะไรปัง อะไรระวัง",
      "เงิน งาน รัก สุขภาพ",
    ],
    includes: [
      "ทริคเสริมดวง",
    ],
    deliveryTime: "1-3 วัน",
    format: "PDF",
  },
  "qa-3": {
    name: "โปรเปิดไพ่ 3 คำถาม",
    subtitle: "พิเศษ",
    price: "฿99",
    description: "ถึง 31 ม.ค.",
    fullDescription: "เช็คดวง ดูแนวทางต่างๆ อยากเคลียร์ข้อสงสัย ไพ่ถามตอบ",
    features: [
      "ไพ่ถามตอบ 3 คำถาม",
      "เช็คดวง ดูแนวทาง",
      "พิมพ์ตอบกลับ",
    ],
    includes: [
      "เร็วสุดภายใน 1-2 ชั่วโมง",
    ],
    deliveryTime: "ภายในวันเดียว",
    format: "พิมพ์ตอบกลับ",
  },
  "qa-1": {
    name: "โปร 1 คำถาม",
    subtitle: "เหมาๆ",
    price: "฿39",
    description: "ถึง 31 ม.ค.",
    fullDescription: "มีข้อสงสัย เปิดไพ่แบบ Q/A การงาน ความรัก",
    features: [
      "ไพ่ถามตอบ 1 คำถาม",
      "การงาน ความรัก",
      "พิมพ์ตอบกลับ",
    ],
    includes: [],
    deliveryTime: "ภายในวันเดียว",
    format: "พิมพ์ตอบกลับ",
  },
};

export async function generateStaticParams() {
  return Object.keys(packages).map((id) => ({ id }));
}

export async function generateMetadata({ params }: PricingDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const pkg = packages[id];
  if (!pkg) {
    return { title: "ไม่พบแพ็กเกจ" };
  }
  return {
    title: `${pkg.name} — ${pkg.price}`,
    description: pkg.fullDescription,
  };
}

export default async function PricingDetailPage({ params }: PricingDetailPageProps) {
  const { id } = await params;
  const pkg = packages[id];

  if (!pkg) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-lg">
      <header className="px-5 pt-7 pb-3">
        <AppBar title="แพ็กเกจ" className="px-0 pt-0 pb-0" backHref="/pricing" />
      </header>

      <div className="px-5 pb-24">
        {/* Header */}
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full mb-2">
            {pkg.subtitle}
          </span>
          <h1 className="text-2xl font-bold text-fg">{pkg.name}</h1>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-accent">{pkg.price}</span>
            {pkg.priceAlt && (
              <span className="text-sm text-fg-muted">หรือ {pkg.priceAlt}</span>
            )}
          </div>
          <p className="text-sm text-fg-muted mt-1">{pkg.description}</p>
        </div>

        {/* Description */}
        <div className="p-4 bg-accent/5 rounded-2xl border border-accent/20 mb-6">
          <p className="text-fg leading-relaxed">{pkg.fullDescription}</p>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-fg mb-3">รายละเอียดที่จะได้รับ</h2>
          <ul className="space-y-2">
            {pkg.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs">
                  ✓
                </span>
                <span className="text-fg">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Includes */}
        {pkg.includes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-fg mb-3">รวมในแพ็กเกจ</h2>
            <ul className="space-y-2">
              {pkg.includes.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs">
                    ⭐
                  </span>
                  <span className="text-fg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Delivery Info */}
        <div className="p-4 bg-surface rounded-2xl border border-border mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-fg-muted">ระยะเวลาทำงาน</p>
              <p className="font-medium text-fg">{pkg.deliveryTime}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-fg-muted">รูปแบบไฟล์</p>
              <p className="font-medium text-fg">{pkg.format}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-20 left-0 right-0 px-5 z-30">
        <div className="max-w-lg mx-auto">
          <Button className="w-full" size="lg">
            จองแพ็กเกจนี้
          </Button>
        </div>
      </div>
    </main>
  );
}
