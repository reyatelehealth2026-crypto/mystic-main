"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { THAI_PROVINCES, DEFAULT_PROVINCE_ID } from "@/lib/birth-chart/data/provinces";

export interface BirthInputValue {
  year: number;
  month: number;
  day: number;
  hour: number | null;
  minute: number | null;
  province: string;
}

interface Props {
  onSubmit: (value: BirthInputValue) => void;
  className?: string;
}

export function BirthInputForm({ onSubmit, className }: Props) {
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear() - 25);
  const [month, setMonth] = useState<number>(1);
  const [day, setDay] = useState<number>(1);
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [knownTime, setKnownTime] = useState(true);
  const [province, setProvince] = useState<string>(DEFAULT_PROVINCE_ID);
  const [error, setError] = useState<string | null>(null);

  const months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
  ];

  const yearOptions: number[] = [];
  for (let y = today.getFullYear(); y >= 1920; y--) yearOptions.push(y);

  const daysInMonth = new Date(year, month, 0).getDate();
  const dayOptions: number[] = [];
  for (let d = 1; d <= daysInMonth; d++) dayOptions.push(d);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (knownTime) {
      const h = parseInt(hour, 10);
      const m = parseInt(minute, 10);
      if (Number.isNaN(h) || h < 0 || h > 23) {
        setError("กรุณาระบุชั่วโมงให้ถูกต้อง (0–23)");
        return;
      }
      if (Number.isNaN(m) || m < 0 || m > 59) {
        setError("กรุณาระบุนาทีให้ถูกต้อง (0–59)");
        return;
      }
      onSubmit({ year, month, day, hour: h, minute: m, province });
    } else {
      onSubmit({ year, month, day, hour: null, minute: null, province });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-5", className)}>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-fg">วันเกิด</label>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={day}
            onChange={(e) => setDay(parseInt(e.target.value, 10))}
            className="rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none"
            aria-label="วันที่"
          >
            {dayOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value, 10))}
            className="rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none"
            aria-label="เดือน"
          >
            {months.map((mName, i) => (
              <option key={i + 1} value={i + 1}>{mName}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
            className="rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none"
            aria-label="ปี ค.ศ."
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y + 543} (ค.ศ. {y})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-fg">เวลาเกิด</label>
          <label className="flex items-center gap-1.5 text-xs text-fg-muted">
            <input
              type="checkbox"
              checked={!knownTime}
              onChange={(e) => setKnownTime(!e.target.checked)}
              className="rounded border-purple-300 text-purple-600 focus:ring-purple-300"
            />
            ไม่ทราบเวลาที่แน่นอน
          </label>
        </div>
        {knownTime ? (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min={0}
              max={23}
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              placeholder="ชั่วโมง (0–23)"
              className="rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none"
              aria-label="ชั่วโมง"
            />
            <input
              type="number"
              min={0}
              max={59}
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              placeholder="นาที (0–59)"
              className="rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none"
              aria-label="นาที"
            />
          </div>
        ) : (
          <p className="text-xs text-fg-subtle">
            หากไม่ทราบเวลาเกิดที่แน่นอน เราจะข้ามการคำนวณลัคนาและภพ ๑๒ และให้คำทำนายจากราศีอาทิตย์ + ดาวประจำวันเกิดแทน
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-fg">สถานที่เกิด (จังหวัด)</label>
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="w-full rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none"
        >
          {THAI_PROVINCES.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <p className="text-xs text-fg-subtle">
          พิกัดของจังหวัดใช้คำนวณลัคนาให้ตรงกับท้องถิ่นเกิด
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">{error}</p>
      )}

      <Button type="submit" size="lg" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
        ผูกดวงพิชัยสงคราม
      </Button>

      <p className="text-[11px] text-fg-subtle text-center">
        ผลลัพธ์นี้คำนวณแบบ deterministic จากตำราโหราศาสตร์ไทย<br/>
        ไม่ใช้ AI · ดวงเดียวกันให้ผลเหมือนเดิมทุกครั้ง
      </p>
    </form>
  );
}
