import type { Metadata } from "next";
import { Suspense } from "react";
import ResultClient from "./ResultClient";

export const metadata: Metadata = {
  title: "ผลผูกดวงพิชัยสงคราม — REFFORTUNE",
  description: "ผลผูกดวงพิชัยสงครามแบบไทย พร้อมคำทำนายลัคนา ภพ และดาวประจำวันเกิด",
  robots: { index: false, follow: true },
};

export default function BirthChartResultPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-3xl px-4 py-10 text-sm text-fg-muted">
          กำลังประมวลผลดวง...
        </main>
      }
    >
      <ResultClient />
    </Suspense>
  );
}
