"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { ChartWheel } from "./ChartWheel";
import { PlanetTable } from "./PlanetTable";
import { ZODIAC_SIGNS } from "@/lib/astrology/zodiac";
import type { NatalChart } from "@/lib/astrology/types";

export interface ChartResultProps {
  chart: NatalChart;
  className?: string;
}

function formatHM(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}น.`;
}

function ayanamsaDMS(degrees: number): string {
  const total = Math.abs(degrees);
  const d = Math.floor(total);
  const m = Math.floor((total - d) * 60);
  const s = Math.round((((total - d) * 60) - m) * 60);
  const sign = degrees < 0 ? "-" : "";
  return `${sign}${d}° ${String(m).padStart(2, "0")}' ${String(s).padStart(2, "0")}"`;
}

export function ChartResult({ chart, className }: ChartResultProps) {
  const lagna = chart.planets[0];
  const lagnaSign = ZODIAC_SIGNS[lagna.zodiac.sign];

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center">
        <h2 className="text-2xl font-serif font-semibold text-fg">
          จักรราศีวิภาค
        </h2>
        <p className="mt-1 text-xs text-fg-muted">
          {chart.system === "suriyayatra"
            ? "สมผุสโหราศาสตร์ไทย สุริยยาตร์"
            : "สมผุสโหราศาสตร์ไทย นิรายนะวิธี (Lahiri)"}
        </p>
        <p className="mt-0.5 text-xs text-fg-subtle">
          เกิดวันที่ {chart.input.day}/{chart.input.month}/{chart.input.year}{" "}
          เวลา {formatHM(chart.input.hour, chart.input.minute)} · ลัคนาราศี
          {lagnaSign.thaiName}
        </p>
        <p className="mt-0.5 text-xs text-fg-subtle">
          อายนางศะ {ayanamsaDMS(chart.ayanamsa)}
        </p>
      </div>

      <div className="flex justify-center">
        <ChartWheel chart={chart} size={360} />
      </div>

      <PlanetTable chart={chart} />

      <div className="text-center text-[11px] text-fg-subtle">
        © พ.ศ. {chart.input.year + 543} คำนวณโดย REFFORTUNE
      </div>
    </div>
  );
}
