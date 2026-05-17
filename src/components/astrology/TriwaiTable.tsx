"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { computeTriwai, currentStage } from "@/lib/astrology/triwai";
import { getPlanetInfo, ZODIAC_SIGNS } from "@/lib/astrology/zodiac";
import { HOUSE_INFO } from "@/lib/astrology/reference";
import type { NatalChart } from "@/lib/astrology/types";

/** ตรีวัย — three life stages with their lord (เจ้าวัย) and dignities. */

export interface TriwaiTableProps {
  chart: NatalChart;
  ageYears: number;
  className?: string;
}

export function TriwaiTable({ chart, ageYears, className }: TriwaiTableProps) {
  const assignments = computeTriwai(chart);
  const current = currentStage(ageYears);

  return (
    <div className={cn("rounded-xl border border-border bg-bg p-4", className)}>
      <div className="text-[11px] uppercase tracking-wide text-fg-muted font-semibold mb-3">
        ตรีวัย · อายุ {ageYears.toFixed(1)} ปี
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {assignments.map((a) => {
          const info = getPlanetInfo(a.lord);
          const sign = ZODIAC_SIGNS[a.lordSign];
          const houseInfo = HOUSE_INFO[a.lordHouse - 1];
          const isCurrent = current?.id === a.stage.id;
          return (
            <div
              key={a.stage.id}
              className={cn(
                "rounded-lg p-3 border",
                isCurrent
                  ? "border-violet-300 bg-violet-50"
                  : "border-border bg-surface/40"
              )}
            >
              <div className="text-xs font-semibold text-fg flex items-center justify-between">
                <span>{a.stage.thai}</span>
                <span className="text-fg-muted text-[10px]">
                  อายุ {a.stage.startAge}–{a.stage.endAge}
                </span>
              </div>
              <div className="mt-2 text-xs text-fg">
                เจ้าวัย:{" "}
                <span className="font-mono mr-1">{info.thaiNumeral}</span>
                <span className="font-medium">{info.thaiName}</span>
              </div>
              <div className="text-[11px] text-fg-muted">
                ราศี{sign.thaiName} · ภพที่ {a.lordHouse} ({houseInfo.thai})
              </div>
              {a.dignities.length > 0 && (
                <div className="mt-1 text-[10px] text-violet-700 font-medium">
                  {a.dignities.join(" / ")}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
