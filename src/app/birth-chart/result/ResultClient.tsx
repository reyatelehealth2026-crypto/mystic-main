"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buildBirthChartReading } from "@/lib/birth-chart/engine";
import { ThaiChart } from "@/components/birth-chart/ThaiChart";
import { Button } from "@/components/ui/Button";

export default function ResultClient() {
  const params = useSearchParams();
  const reading = useMemo(() => {
    const y = parseInt(params.get("y") ?? "", 10);
    const m = parseInt(params.get("m") ?? "", 10);
    const d = parseInt(params.get("d") ?? "", 10);
    if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return null;

    const hStr = params.get("h");
    const mmStr = params.get("mm");
    const birthTime =
      hStr !== null && mmStr !== null
        ? { hour: parseInt(hStr, 10), minute: parseInt(mmStr, 10) }
        : undefined;

    const province = params.get("p") ?? undefined;
    const birthDate = new Date(Date.UTC(y, m - 1, d) - 7 * 60 * 60 * 1000);

    return buildBirthChartReading({ birthDate, birthTime, province });
  }, [params]);

  if (!reading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          ข้อมูลการเกิดไม่ครบ กรุณากลับไปกรอกข้อมูลใหม่
        </div>
        <Link href="/birth-chart" className="mt-4 inline-block">
          <Button variant="ghost">ย้อนกลับ</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 space-y-8">
      <header className="text-center space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-500">
          ดวงพิชัยสงคราม
        </p>
        <h1 className="text-2xl font-bold text-fg">ผลผูกดวงของคุณ</h1>
      </header>

      <section>
        <ThaiChart chart={reading.chart} />
      </section>

      <section className="space-y-5">
        {reading.sections.map((section, i) => (
          <article
            key={i}
            className="rounded-2xl border border-purple-100 bg-white p-5 shadow-card space-y-2"
          >
            <h2 className="text-base font-semibold text-purple-700">{section.title}</h2>
            <div className="space-y-1.5">
              {section.paragraphs.map((p, j) => (
                <p key={j} className="text-sm text-fg leading-relaxed whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl bg-purple-50 border border-purple-100 p-4">
        <p className="text-xs text-purple-700 leading-relaxed">{reading.disclaimer}</p>
      </section>

      <div className="flex gap-3">
        <Link href="/birth-chart" className="flex-1">
          <Button variant="ghost" size="lg" className="w-full">
            ผูกดวงคนใหม่
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            กลับหน้าหลัก
          </Button>
        </Link>
      </div>
    </main>
  );
}
