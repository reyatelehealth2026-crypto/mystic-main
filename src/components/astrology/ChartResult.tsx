"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { ChartWheel } from "./ChartWheel";
import { PlanetTable } from "./PlanetTable";
import { PhromchartSquare } from "./PhromchartSquare";
import { SubWheel } from "./SubWheels";
import { DashaTable } from "./DashaTable";
import { TriwaiTable } from "./TriwaiTable";
import { ZODIAC_SIGNS } from "@/lib/astrology/zodiac";
import type { NatalChart } from "@/lib/astrology/types";

export interface ChartResultProps {
  natal: NatalChart;
  transit: NatalChart;
  asOf: Date;
  view: "natal" | "transit" | "overlay";
  className?: string;
}

const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

const WEEKDAY_PLANETS = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];

function formatHM(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}น.`;
}

function ayanamsaDMS(deg: number): string {
  const total = Math.abs(deg);
  const d = Math.floor(total);
  const m = Math.floor((total - d) * 60);
  const s = Math.round(((total - d) * 60 - m) * 60);
  return `${d}° ${String(m).padStart(2, "0")}' ${String(s).padStart(2, "0")}"`;
}

function describeChart(chart: NatalChart): string {
  const sun = chart.planets.find((p) => p.id === "sun");
  const lagna = chart.planets[0];
  if (!sun) return "";
  return `อาทิตย์ ${sun.zodiac.degree}°${String(sun.zodiac.minute).padStart(2, "0")}' ราศี${ZODIAC_SIGNS[sun.zodiac.sign].thaiName} · ลัคนา ${lagna.zodiac.degree}°${String(lagna.zodiac.minute).padStart(2, "0")}' ราศี${ZODIAC_SIGNS[lagna.zodiac.sign].thaiName}`;
}

export function ChartResult({
  natal,
  transit,
  asOf,
  view,
  className,
}: ChartResultProps) {
  const primary = view === "transit" ? transit : natal;
  const overlayWith = view === "overlay" ? transit : undefined;

  const birthDate = new Date(
    natal.input.year,
    natal.input.month - 1,
    natal.input.day,
    natal.input.hour,
    natal.input.minute
  );
  const ageMs = asOf.getTime() - birthDate.getTime();
  const ageYears = ageMs / (365.2425 * 24 * 3600 * 1000);

  const weekdayIdx = WEEKDAY_PLANETS.indexOf(natal.weekday);
  const weekdayName = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"][weekdayIdx] ?? "";

  return (
    <div className={cn("space-y-5", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-3">
          <div className="text-[11px] uppercase tracking-wide text-accent font-semibold mb-1">
            ดวงกำเนิด
          </div>
          <div className="text-xs text-fg">
            วัน{weekdayName} ที่{" "}
            <span className="font-medium">
              {natal.input.day} {THAI_MONTHS[natal.input.month - 1]} พ.ศ.{natal.input.year + 543}
            </span>{" "}
            เวลา <span className="font-medium">{formatHM(natal.input.hour, natal.input.minute)}</span>
          </div>
          <div className="mt-1 text-xs text-fg-muted">{describeChart(natal)}</div>
          {natal.sunrise && (
            <div className="mt-1 text-[11px] text-fg-subtle">
              สมผุสอาทิตย์อุทัย {formatHM(natal.sunrise.hourLocal, natal.sunrise.minuteLocal)} ·
              อาทิตย์ {natal.sunrise.sunDegree}°{String(natal.sunrise.sunMinute).padStart(2, "0")}&apos; ราศี{ZODIAC_SIGNS[natal.sunrise.sunSign].thaiName}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3">
          <div className="text-[11px] uppercase tracking-wide text-rose-600 font-semibold mb-1">
            ดวงจร / วันที่ทำนาย
          </div>
          <div className="text-xs text-fg">
            วันที่{" "}
            <span className="font-medium">
              {transit.input.day} {THAI_MONTHS[transit.input.month - 1]} พ.ศ.{transit.input.year + 543}
            </span>{" "}
            เวลา <span className="font-medium">{formatHM(transit.input.hour, transit.input.minute)}</span>
          </div>
          <div className="mt-1 text-xs text-fg-muted">{describeChart(transit)}</div>
          {transit.sunrise && (
            <div className="mt-1 text-[11px] text-fg-subtle">
              สมผุสอาทิตย์อุทัย {formatHM(transit.sunrise.hourLocal, transit.sunrise.minuteLocal)} ·
              อาทิตย์ {transit.sunrise.sunDegree}°{String(transit.sunrise.sunMinute).padStart(2, "0")}&apos; ราศี{ZODIAC_SIGNS[transit.sunrise.sunSign].thaiName}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <ChartWheel chart={primary} transit={overlayWith} size={480} />
      </div>

      <PlanetTable chart={primary} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-bg p-4 flex flex-col items-center">
          <div className="text-[11px] uppercase tracking-wide text-fg-muted font-semibold mb-2 self-start">
            ดวงพรหมชาติ
          </div>
          <PhromchartSquare chart={primary} size={300} />
        </div>

        <div className="rounded-xl border border-border bg-bg p-4 space-y-3">
          <div className="text-[11px] uppercase tracking-wide text-fg-muted font-semibold">
            ทักษิณาวัฏ — จักรขนาดเล็ก
          </div>
          <div className="grid grid-cols-2 gap-2">
            <SubWheel
              title="นวางค์จักร"
              chart={primary}
              signOf={(p) => p.navamshaSign}
              size={150}
            />
            <SubWheel
              title="ตรียางค์จักร"
              chart={primary}
              signOf={(p) => p.decanateSign}
              size={150}
            />
          </div>
        </div>
      </div>

      <DashaTable chart={natal} asOfDate={asOf} />

      <TriwaiTable chart={natal} ageYears={ageYears} />

      <div className="text-center text-[11px] text-fg-subtle">
        ระบบ
        {primary.system === "suriyayatra" ? "สุริยยาตร์" : "นิรายนะ (Lahiri)"}
        {" · "}อายนางศะ {ayanamsaDMS(primary.ayanamsa)}
        {" · "}© พ.ศ. {transit.input.year + 543} REFFORTUNE
      </div>
    </div>
  );
}
