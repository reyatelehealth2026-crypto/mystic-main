import type { Metadata } from "next";
import { Suspense } from "react";
import PickClient from "./PickClient";

export const metadata: Metadata = {
  title: "เลือกไพ่ทาโรต์ — โฟกัสคำถามแล้วเปิดไพ่",
  description:
    "โฟกัสคำถามในใจ แล้วแตะเลือกไพ่ทาโรต์ที่ดึงดูดคุณ รับคำทำนายแม่นยำจาก REFFORTUNE",
  robots: { index: false, follow: true },
};

export default function TarotPickPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-4xl px-4 py-10 text-sm text-fg-muted">
          กำลังเตรียมไพ่...
        </main>
      }
    >
      <PickClient />
    </Suspense>
  );
}
