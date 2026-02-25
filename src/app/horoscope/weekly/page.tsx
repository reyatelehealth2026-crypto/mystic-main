"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppBar } from "@/components/nav/AppBar";
import { Button } from "@/components/ui/Button";
import { ZodiacSelector } from "@/components/horoscope/ZodiacSelector";
import { ZodiacSign } from "@/lib/horoscope/types";

export default function WeeklyHoroscopePage() {
  const router = useRouter();
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | undefined>();

  const handleSubmit = () => {
    if (!selectedSign) return;
    router.push(`/horoscope/weekly/result?sign=${selectedSign}`);
  };

  return (
    <main className="mx-auto w-full max-w-lg">
      <header className="px-5 pt-7 pb-3">
        <AppBar title="ดูดวงรายสัปดาห์" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">เลือกราศีของคุณ</h1>
        <p className="mt-1 text-sm text-fg-muted">
          เลือกราศีเพื่อดูดวงรายสัปดาห์ของคุณ
        </p>
      </header>

      <div className="px-5 pb-6">
        <ZodiacSelector value={selectedSign} onChange={setSelectedSign} className="mt-4" />

        <div className="sticky bottom-20 z-30 mt-6">
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={!selectedSign}
          >
            ดูดวงรายสัปดาห์
          </Button>
        </div>
      </div>
    </main>
  );
}
