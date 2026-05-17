"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import type { BirthInput, ChartSystem } from "@/lib/astrology/types";

interface ThaiCity {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

const CITIES: ThaiCity[] = [
  { id: "bangkok", name: "กรุงเทพมหานคร", latitude: 13.7563, longitude: 100.5018 },
  { id: "chiangmai", name: "เชียงใหม่", latitude: 18.7883, longitude: 98.9853 },
  { id: "chiangrai", name: "เชียงราย", latitude: 19.9105, longitude: 99.8406 },
  { id: "khonkaen", name: "ขอนแก่น", latitude: 16.4419, longitude: 102.8359 },
  { id: "korat", name: "นครราชสีมา", latitude: 14.9799, longitude: 102.0978 },
  { id: "phuket", name: "ภูเก็ต", latitude: 7.8804, longitude: 98.3923 },
  { id: "hatyai", name: "หาดใหญ่", latitude: 7.0086, longitude: 100.4747 },
  { id: "udonthani", name: "อุดรธานี", latitude: 17.4138, longitude: 102.7872 },
  { id: "pattaya", name: "พัทยา", latitude: 12.9236, longitude: 100.8825 },
];

export interface ChartFormProps {
  initial?: Partial<BirthInput>;
  initialSystem?: ChartSystem;
  onSubmit: (input: BirthInput, system: ChartSystem) => void;
  className?: string;
}

function todayBE() {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}

export function ChartForm({ initial, initialSystem = "suriyayatra", onSubmit, className }: ChartFormProps) {
  const today = todayBE();
  const [year, setYear] = React.useState(initial?.year ?? today.year);
  const [month, setMonth] = React.useState(initial?.month ?? today.month);
  const [day, setDay] = React.useState(initial?.day ?? today.day);
  const [hour, setHour] = React.useState(initial?.hour ?? 6);
  const [minute, setMinute] = React.useState(initial?.minute ?? 20);
  const [cityId, setCityId] = React.useState("bangkok");
  const [system, setSystem] = React.useState<ChartSystem>(initialSystem);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const city = CITIES.find((c) => c.id === cityId) ?? CITIES[0];
    onSubmit(
      {
        year,
        month,
        day,
        hour,
        minute,
        timezoneHours: 7,
        latitude: city.latitude,
        longitude: city.longitude,
      },
      system
    );
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-bg px-3 py-2 text-sm text-fg focus:outline-none focus:ring-2 focus:ring-violet-300";

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div>
        <label className="block text-xs font-medium text-fg-muted mb-1">
          ระบบคำนวณ
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(["suriyayatra", "lahiri"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSystem(s)}
              className={cn(
                "rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                system === s
                  ? "border-violet-400 bg-violet-50 text-violet-700"
                  : "border-border bg-bg text-fg-muted hover:bg-surface"
              )}
            >
              {s === "suriyayatra" ? "สุริยยาตร์ (ไทย)" : "นิรายนะ (Lahiri)"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs font-medium text-fg-muted mb-1">
            ปี (ค.ศ.)
          </label>
          <input
            type="number"
            inputMode="numeric"
            min={1900}
            max={2100}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-fg-muted mb-1">
            เดือน
          </label>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={12}
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-fg-muted mb-1">
            วัน
          </label>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={31}
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-fg-muted mb-1">
            ชั่วโมง
          </label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={23}
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-fg-muted mb-1">
            นาที
          </label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={59}
            value={minute}
            onChange={(e) => setMinute(Number(e.target.value))}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-fg-muted mb-1">
          สถานที่เกิด
        </label>
        <select
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          className={inputClass}
        >
          {CITIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-[11px] text-fg-subtle">
          เวลามาตรฐาน ICT (UTC+7)
        </p>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-violet-600 text-white font-semibold py-3 hover:bg-violet-700 transition-colors"
      >
        คำนวณดวงชะตา
      </button>
    </form>
  );
}
