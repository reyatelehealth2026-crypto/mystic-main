"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BirthInputForm, type BirthInputValue } from "@/components/birth-chart/BirthInputForm";

export default function BirthChartIntroClient() {
  const router = useRouter();

  const handleSubmit = (value: BirthInputValue) => {
    const params = new URLSearchParams({
      y: String(value.year),
      m: String(value.month),
      d: String(value.day),
      p: value.province,
    });
    if (value.hour !== null && value.minute !== null) {
      params.set("h", String(value.hour));
      params.set("mm", String(value.minute));
    }
    router.push(`/birth-chart/result?${params.toString()}`);
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 space-y-8">
      <header className="text-center space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-500">
          โหราศาสตร์ไทย
        </p>
        <h1 className="text-3xl font-bold text-fg">ผูกดวงพิชัยสงคราม</h1>
        <p className="text-sm text-fg-muted max-w-md mx-auto">
          ตำราโหราศาสตร์ไทยโบราณ คำนวณลัคนา ภพทั้ง ๑๒ ราศีอาทิตย์ และดาวประจำวันเกิด
          พร้อมคำทำนายแบบ deterministic ที่ดวงเดียวกันให้ผลเหมือนกันทุกครั้ง
        </p>
      </header>

      <section className="rounded-2xl border border-purple-200 bg-white p-6 shadow-card">
        <BirthInputForm onSubmit={handleSubmit} />
      </section>

      <section className="rounded-2xl bg-purple-50 border border-purple-100 p-5 space-y-2">
        <h2 className="text-sm font-semibold text-purple-700">เกี่ยวกับดวงพิชัยสงคราม</h2>
        <p className="text-xs text-fg-muted leading-relaxed">
          ดวงพิชัยสงครามคือดวงผูกแบบสี่เหลี่ยมตามตำราโหราศาสตร์ไทยที่ส่งต่อกันมาตั้งแต่สมัยอยุธยา
          แบ่งภพในชีวิตออกเป็น ๑๒ ภพ (ตนุ กดุมพะ สหัชชะ พันธุ ปุตตะ อริ ปัตนิ มรณะ ศุภะ กรรมะ ลาภะ วินาศนะ)
          และมีดาวพระเคราะห์ทั้ง ๗ เป็นเจ้าเรือนของแต่ละราศี เราใช้ค่าอายนางศะแบบลาหิรีในการคำนวณเชิงดาราศาสตร์
        </p>
      </section>
    </main>
  );
}
