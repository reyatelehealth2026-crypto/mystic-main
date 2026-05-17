"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import type { BirthInput, ChartSystem } from "@/lib/astrology/types";
import {
  PROVINCES_BY_REGION,
  REGION_NAMES,
  findProvince,
  type ThaiRegion,
} from "@/lib/astrology/thai-provinces";

const REGION_ORDER: ThaiRegion[] = [
  "central",
  "east",
  "north",
  "northeast",
  "south",
  "west",
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
  const [provinceId, setProvinceId] = React.useState("bangkok");
  const [system, setSystem] = React.useState<ChartSystem>(initialSystem);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const province = findProvince(provinceId);
    if (!province) return;
    onSubmit(
      {
        year,
        month,
        day,
        hour,
        minute,
        timezoneHours: 7,
        latitude: province.latitude,
        longitude: province.longitude,
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
          จังหวัดที่เกิด
        </label>
        <select
          value={provinceId}
          onChange={(e) => setProvinceId(e.target.value)}
          className={inputClass}
        >
          {REGION_ORDER.map((region) => (
            <optgroup key={region} label={REGION_NAMES[region]}>
              {PROVINCES_BY_REGION[region].map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <p className="mt-1 text-[11px] text-fg-subtle">
          77 จังหวัด · ใช้พิกัดของอำเภอเมือง · เวลามาตรฐาน ICT (UTC+7)
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
