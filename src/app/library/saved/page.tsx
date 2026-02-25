import type { Metadata } from "next";
import { Suspense } from "react";
import SavedClient from "./savedClient";

export const metadata: Metadata = {
  title: "คลังคำทำนายของฉัน — บันทึกผลการดูดวง",
  description: "ดูบันทึกผลการดูดวงที่คุณเคยทำไว้ ทาโรต์ ดวงชะตา ความรัก ปีจีน และอื่นๆ",
  robots: { index: false, follow: true },
};

export default function SavedReadingsPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-6xl px-4 py-10 text-sm text-fg-muted">
          กำลังโหลด…
        </main>
      }
    >
      <SavedClient />
    </Suspense>
  );
}
