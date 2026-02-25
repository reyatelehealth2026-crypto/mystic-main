import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "วิเคราะห์เบอร์มงคล — เลขศาสตร์และมหาสัตตเลข",
  description:
    "วิเคราะห์เบอร์มงคลด้วยศาสตร์มหาสัตตเลขกับ REFFORTUNE ตรวจสอบเบอร์โทรศัพท์ เลขทะเบียน เลขบ้าน หาเบอร์ที่เสริมดวงชะตา",
  alternates: { canonical: "/numerology" },
  openGraph: {
    title: "วิเคราะห์เบอร์มงคล — REFFORTUNE",
    description: "วิเคราะห์เบอร์มงคลด้วยศาสตร์มหาสัตตเลข หาเบอร์ที่เสริมดวงชะตา",
    url: "/numerology",
  },
};

export default function NumerologyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
