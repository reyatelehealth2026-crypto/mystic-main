import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ไพ่จิตวิญญาณ Oracle Card — รับข้อความจากจักรวาล",
  description:
    "เปิดไพ่ Oracle Card กับ REFFORTUNE รับข้อความจากจักรวาลและคำแนะนำเชิงลึก เข้าใจตัวเองมากขึ้น ใช้ได้จริงในชีวิตประจำวัน",
  alternates: { canonical: "/spirit-card" },
  openGraph: {
    title: "ไพ่จิตวิญญาณ Oracle Card — REFFORTUNE",
    description: "เปิดไพ่ Oracle Card รับข้อความจากจักรวาลและคำแนะนำเชิงลึก",
    url: "/spirit-card",
  },
};

export default function SpiritCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
