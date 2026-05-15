"use client";

import React from "react";
import { cn } from "@/lib/cn";
import type { BirthChart } from "@/lib/birth-chart/types";
import { LAKKANA_TABLE } from "@/lib/birth-chart/data/lakkana";
import { THAI_HOUSES } from "@/lib/birth-chart/data/houses";

interface ThaiChartProps {
  chart: BirthChart;
  className?: string;
}

const CELL_LAYOUT: { row: number; col: number; house: number }[] = [
  { row: 0, col: 1, house: 11 },
  { row: 0, col: 2, house: 12 },
  { row: 0, col: 3, house: 1 },
  { row: 1, col: 3, house: 2 },
  { row: 2, col: 3, house: 3 },
  { row: 3, col: 3, house: 4 },
  { row: 3, col: 2, house: 5 },
  { row: 3, col: 1, house: 6 },
  { row: 3, col: 0, house: 7 },
  { row: 2, col: 0, house: 8 },
  { row: 1, col: 0, house: 9 },
  { row: 0, col: 0, house: 10 },
];

export function ThaiChart({ chart, className }: ThaiChartProps) {
  const houseSigns = new Map<number, { signTh: string; symbol: string }>();
  if (chart.houses) {
    for (const h of chart.houses) {
      const sign = LAKKANA_TABLE[h.sign];
      houseSigns.set(h.house, { signTh: sign.nameTh, symbol: sign.symbol });
    }
  }

  const ascendantHouse = 1;

  return (
    <div
      className={cn(
        "relative aspect-square w-full max-w-md mx-auto rounded-2xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-violet-50 p-3 shadow-card",
        className,
      )}
      role="figure"
      aria-label="ดวงพิชัยสงครามแบบไทย"
    >
      <div className="absolute inset-3 grid grid-cols-4 grid-rows-4">
        {CELL_LAYOUT.map(({ row, col, house }) => {
          const info = houseSigns.get(house);
          const houseMeta = THAI_HOUSES[house - 1];
          const isAsc = house === ascendantHouse;
          return (
            <div
              key={house}
              className={cn(
                "border border-purple-200 p-1.5 flex flex-col items-center justify-center text-center",
                isAsc && "bg-amber-50 border-amber-300",
              )}
              style={{ gridRow: row + 1, gridColumn: col + 1 }}
            >
              <span className="text-[9px] font-semibold text-purple-500 leading-tight">
                {houseMeta.thaiName}
              </span>
              <span className="text-[8px] text-purple-400 leading-none">
                ภพ {house}
              </span>
              {info ? (
                <>
                  <span className="text-base leading-none mt-0.5">{info.symbol}</span>
                  <span className="text-[10px] text-purple-700 font-medium">
                    {info.signTh}
                  </span>
                </>
              ) : (
                <span className="text-[9px] text-purple-300 mt-0.5">—</span>
              )}
              {isAsc && (
                <span className="text-[8px] font-bold text-amber-600 mt-0.5">
                  ลัคนา
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="absolute inset-3 grid grid-cols-4 grid-rows-4 pointer-events-none">
        <div
          className="col-start-2 col-span-2 row-start-2 row-span-2 border border-purple-200 bg-white/70 flex flex-col items-center justify-center"
        >
          <span className="text-[10px] text-purple-500 uppercase tracking-wider">
            ดวงพิชัยสงคราม
          </span>
          <span className="mt-1 text-xs text-purple-700 font-semibold">
            {chart.input.province}
          </span>
          <span className="mt-1 text-[10px] text-purple-400">
            {formatThaiDate(chart.input.birthDate)}
          </span>
          {chart.input.timeKnown && chart.input.birthTime && (
            <span className="text-[10px] text-purple-400">
              {pad2(chart.input.birthTime.hour)}:{pad2(chart.input.birthTime.minute)} น.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatThaiDate(date: Date): string {
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
}
