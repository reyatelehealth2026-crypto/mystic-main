"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import {
  buildDashaSequence,
  findActiveDasha,
  taksaForWeekday,
  type DashaScheme,
} from "@/lib/astrology/dasha";
import { getPlanetInfo } from "@/lib/astrology/zodiac";
import type { NatalChart, PlanetId } from "@/lib/astrology/types";

/**
 * ทักษา / ภูมิทักษา + มหาทักษา.
 *
 *   - Left card: the 8 slots (บริวาร..กาลกิณี) anchored to the birth-weekday
 *     planet — this is the natal ทักษาเดิม table.
 *   - Right card: the full Ashtottari period list with the row of the
 *     current age highlighted.
 */

export interface DashaTableProps {
  chart: NatalChart;
  asOfDate: Date;
  scheme?: DashaScheme;
  className?: string;
}

function ageYears(birth: Date, asOf: Date): number {
  const ms = asOf.getTime() - birth.getTime();
  return ms / (365.2425 * 24 * 3600 * 1000);
}

const WEEKDAY_TH = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

export function DashaTable({
  chart,
  asOfDate,
  scheme = "ashtottari",
  className,
}: DashaTableProps) {
  const birth = new Date(
    chart.input.year,
    chart.input.month - 1,
    chart.input.day,
    chart.input.hour,
    chart.input.minute
  );
  const age = ageYears(birth, asOfDate);

  const slots = taksaForWeekday(chart.weekday);
  const sequence = buildDashaSequence(
    chart.weekday,
    scheme,
    scheme === "ashtottari" ? 108 : 120
  );
  const active = findActiveDasha(sequence, age);

  const weekdayIdx = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"].indexOf(
    chart.weekday
  );

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-3", className)}>
      <div className="rounded-xl border border-border bg-bg p-4">
        <div className="text-[11px] uppercase tracking-wide text-fg-muted font-semibold mb-2">
          ทักษาเดิม · เกิดวัน{WEEKDAY_TH[weekdayIdx] ?? ""}
        </div>
        <ul className="space-y-1.5">
          {slots.map((s) => {
            const info = getPlanetInfo(s.planet);
            return (
              <li
                key={s.name}
                className={cn(
                  "flex items-center justify-between text-xs",
                  s.isInauspicious && "text-rose-600 font-medium"
                )}
              >
                <span>
                  <span className="font-mono text-fg-muted mr-1">
                    {info.thaiNumeral}
                  </span>
                  {info.thaiName}
                </span>
                <span className="text-fg-muted">{s.name}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-xl border border-border bg-bg p-4">
        <div className="text-[11px] uppercase tracking-wide text-fg-muted font-semibold mb-2">
          มหาทักษา · {scheme === "ashtottari" ? "อัษโฏตตรี 108 ปี" : "วิมโศตตรี 120 ปี"}
        </div>
        <div className="text-xs text-fg-muted mb-2">
          อายุปัจจุบัน {age.toFixed(1)} ปี
          {active && (
            <>
              {" · "}
              ปัจจุบันเสวยอายุ{" "}
              <span className="font-semibold text-violet-700">
                {getPlanetInfo(active.planet as PlanetId).thaiName}
              </span>
            </>
          )}
        </div>
        <ul className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
          {sequence.map((p, i) => {
            const info = getPlanetInfo(p.planet as PlanetId);
            const isActive = active && active.startAge === p.startAge;
            return (
              <li
                key={`${p.planet}-${i}`}
                className={cn(
                  "flex items-center justify-between text-xs py-1 px-2 rounded",
                  isActive ? "bg-violet-100 text-violet-900 font-medium" : "text-fg-muted"
                )}
              >
                <span>
                  <span className="font-mono mr-1">{info.thaiNumeral}</span>
                  {info.thaiName}
                </span>
                <span className="tabular-nums">
                  อายุ {p.startAge.toFixed(0)}–{p.endAge.toFixed(0)} ปี
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
