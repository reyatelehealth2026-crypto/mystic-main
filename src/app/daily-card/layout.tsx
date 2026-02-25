import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ไพ่รายวัน — จับไพ่ทาโรต์ประจำวัน",
  description:
    "จับไพ่ทาโรต์รายวันกับ REFFORTUNE รับพลังงานและคำแนะนำประจำวัน เริ่มต้นวันใหม่ด้วยทิศทางที่ชัดเจน",
  alternates: { canonical: "/daily-card" },
  openGraph: {
    title: "ไพ่รายวัน — REFFORTUNE",
    description: "จับไพ่ทาโรต์ประจำวัน รับพลังงานและคำแนะนำเริ่มต้นวันใหม่",
    url: "/daily-card",
    images: [
      {
        url: "/daily.jpg",
        width: 1200,
        height: 630,
        alt: "ไพ่รายวัน — REFFORTUNE จับไพ่ทาโรต์ประจำวัน",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ไพ่รายวัน — REFFORTUNE",
    description: "จับไพ่ทาโรต์ประจำวัน รับพลังงานและคำแนะนำเริ่มต้นวันใหม่",
    images: ["/daily.jpg"],
  },
};

export default function DailyCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
