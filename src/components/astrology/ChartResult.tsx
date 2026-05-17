"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { ChartWheel } from "./ChartWheel";
import { PlanetTable } from "./PlanetTable";
import { ZODIAC_SIGNS } from "@/lib/astrology/zodiac";
import type { NatalChart } from "@/lib/astrology/types";

export interface ChartResultProps {
  natal: NatalChart;
  transit: NatalChart;
  view: "natal" | "transit" | "overlay";
  className?: string;
}

const THAI_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

function formatHM(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}น.`;
}

function ayanamsaDMS(degrees: number): string {
  const total = Math.abs(degrees);
  const d = Math.floor(total);
  const m = Math.floor((total - d) * 60);
  const s = Math.round(((total - d) * 60 - m) * 60);
  return `${d}° ${String(m).padStart(2, "0")}' ${String(s).padStart(2, "0")}"`;
}

function describeChart(chart: NatalChart): string {
  const sun = chart.planets.find((p) => p.id === "sun");
  const lagna = chart.planets[0];
  if (!sun) return "";
  const sunSign = ZODIAC_SIGNS[sun.zodiac.sign].thaiName;
  const lagnaSign = ZODIAC_SIGNS[lagna.zodiac.sign].thaiName;
  return `อาทิตย์ ${sun.zodiac.degree}°${String(sun.zodiac.minute).padStart(2, "0")}' ราศี${sunSign} · ลัคนา ${lagna.zodiac.degree}°${String(lagna.zodiac.minute).padStart(2, "0")}' ราศี${lagnaSign}`;
}

export function ChartResult({
  natal,
  transit,
  view,
  className,
}: ChartResultProps) {
  const primary = view === "transit" ? transit : natal;
  const overlayWith = view === "overlay" ? transit : undefined;

  return (
    <div className={cn("space-y-5", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-3">
          <div className="text-[11px] uppercase tracking-wide text-violet-600 font-semibold mb-1">
            ดวงกำเนิด
          </div>
          <div className="text-xs text-fg">
            วันที่{" "}
            <span className="font-medium">
              {natal.input.day} {THAI_MONTHS[natal.input.month - 1]}{" "}
              พ.ศ.{natal.input.year + 543}
            </span>{" "}
            เวลา{" "}
            <span className="font-medium">
              {formatHM(natal.input.hour, natal.input.minute)}
            </span>
          </div>
          <div className="mt-1 text-xs text-fg-muted">{describeChart(natal)}</div>
        </div>

        <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3">
          <div className="text-[11px] uppercase tracking-wide text-rose-600 font-semibold mb-1">
            ดวงจร / วันที่ทำนาย
          </div>
          <div className="text-xs text-fg">
            วันที่{" "}
            <span className="font-medium">
              {transit.input.day} {THAI_MONTHS[transit.input.month - 1]}{" "}
              พ.ศ.{transit.input.year + 543}
            </span>{" "}
            เวลา{" "}
            <span className="font-medium">
              {formatHM(transit.input.hour, transit.input.minute)}
            </span>
          </div>
          <div className="mt-1 text-xs text-fg-muted">
            {describeChart(transit)}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <ChartWheel chart={primary} transit={overlayWith} size={360} />
      </div>

      <PlanetTable chart={primary} />

      <div className="text-center text-[11px] text-fg-subtle">
        ระบบ
        {primary.system === "suriyayatra" ? "สุริยยาตร์" : "นิรายนะ (Lahiri)"}
        {" · "}อายนางศะ {ayanamsaDMS(primary.ayanamsa)}
        {" · "}© พ.ศ. {transit.input.year + 543} REFFORTUNE
      </div>
    </div>
  );
}
