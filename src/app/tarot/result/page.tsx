import type { Metadata } from "next";
import { Suspense } from "react";
import ResultClient from "./ResultClient";

export const metadata: Metadata = {
  title: "ผลคำทำนายไพ่ทาโรต์ — REFFORTUNE",
  description:
    "ผลการเปิดไพ่ทาโรต์ของคุณ พร้อมคำทำนายเชิงลึกและคำแนะนำที่ใช้ได้จริง",
  robots: { index: false, follow: true },
};

export default function TarotResultPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-4xl px-4 py-10 text-sm text-fg-muted">
          กำลังประมวลผลคำทำนาย...
        </main>
      }
    >
      <ResultClient />
    </Suspense>
  );
}
