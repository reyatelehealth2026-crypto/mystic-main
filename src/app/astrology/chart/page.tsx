import type { Metadata } from "next";
import { AppBar } from "@/components/nav/AppBar";
import { ChartClient } from "./ChartClient";

export const metadata: Metadata = {
  title: "จักรราศีวิภาค — คำนวณดวงชะตาโหราศาสตร์ไทย สุริยยาตร์ / นิรายนะ",
  description:
    "คำนวณดวงชะตาตามโหราศาสตร์ไทย แสดงผลแบบจักรราศีวิภาค พร้อมตำแหน่ง 11 ดาว ราศี องศา นวางค์ นักษัตร และบาท สลับระบบสุริยยาตร์ / นิรายนะ (Lahiri) ได้",
  alternates: { canonical: "/astrology/chart" },
  openGraph: {
    title: "จักรราศีวิภาค — REFFORTUNE",
    description: "คำนวณดวงชะตาแบบโหราศาสตร์ไทย สุริยยาตร์ และนิรายนะ (Lahiri)",
    url: "/astrology/chart",
  },
};

export default function ChartPage() {
  return (
    <main className="mx-auto w-full max-w-lg pb-24">
      <header className="px-5 pt-7 pb-3">
        <AppBar
          title={<span className="sr-only">จักรราศีวิภาค</span>}
          backHref="/astrology"
          className="px-0 pt-0 pb-0"
        />
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-fg">
          จักรราศีวิภาค
        </h1>
        <p className="mt-1 text-sm text-fg-muted">
          คำนวณดวงชะตาตามวันเดือนปีเกิดและสถานที่
          แสดงผลแบบโหราศาสตร์ไทยพร้อมตารางสมผุสครบ 11 ดาว
        </p>
      </header>

      <div className="px-5">
        <ChartClient />
      </div>
    </main>
  );
}
