"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { NAKSHATRAS, ZODIAC_SIGNS } from "@/lib/astrology/zodiac";
import type { NatalChart } from "@/lib/astrology/types";

/**
 * Planet-position table mirroring the layout from
 *   myhora.com/astrology/thai.aspx
 *
 * Columns:
 *   ดาว/ปัจจัย  - planet / factor
 *   ราศี        - sign (Thai short label)
 *   °           - degrees within sign
 *   '           - arc-minutes
 *   นวางค์      - navamsha (sign at 1/9-th of a sign, 0..107)
 *   นักษัตร     - lunar mansion
 *   บาท         - pada (1..4)
 */

export interface PlanetTableProps {
  chart: NatalChart;
  className?: string;
}

function navamshaSign(longitudeDeg: number): string {
  const navamsaSpan = 360 / 108;
  const idx = Math.floor(((longitudeDeg % 360) + 360) % 360 / navamsaSpan) % 12;
  return ZODIAC_SIGNS[idx].thaiShort;
}

const PADA_THAI = ["ปฐม", "ทุติย", "ตติย", "จตุตถ"];

export function PlanetTable({ chart, className }: PlanetTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-xs md:text-sm border-collapse">
        <thead>
          <tr className="border-b border-border text-fg-muted">
            <th className="text-left py-2 px-2 font-medium underline">ดาว/ปัจจัย</th>
            <th className="text-left py-2 px-2 font-medium underline">ราศี</th>
            <th className="text-right py-2 px-2 font-medium underline">°</th>
            <th className="text-right py-2 px-2 font-medium underline">&apos;</th>
            <th className="text-left py-2 px-2 font-medium underline">นวางค์</th>
            <th className="text-left py-2 px-2 font-medium underline">นักษัตร</th>
            <th className="text-left py-2 px-2 font-medium underline">บาท</th>
          </tr>
        </thead>
        <tbody>
          {chart.planets.map((p) => {
            const sign = ZODIAC_SIGNS[p.zodiac.sign];
            const nak = NAKSHATRAS[p.nakshatra.index];
            return (
              <tr
                key={p.id}
                className="border-b border-border/40 last:border-0"
              >
                <td className="py-2 px-2 whitespace-nowrap">
                  <span className="font-mono text-fg-muted mr-1">
                    {p.thaiNumeral}
                  </span>
                  <span className="font-medium text-fg">{p.thaiName}</span>
                  {p.retrograde && (
                    <span className="ml-1 text-[10px] text-rose-600 align-super">
                      พ.
                    </span>
                  )}
                </td>
                <td className="py-2 px-2 whitespace-nowrap text-fg">
                  {sign.thaiShort}
                </td>
                <td className="py-2 px-2 text-right tabular-nums text-fg">
                  {String(p.zodiac.degree).padStart(2, "0")}
                </td>
                <td className="py-2 px-2 text-right tabular-nums text-fg">
                  {String(p.zodiac.minute).padStart(2, "0")}
                </td>
                <td className="py-2 px-2 whitespace-nowrap text-fg-muted">
                  {navamshaSign(p.zodiac.longitude)}
                </td>
                <td className="py-2 px-2 whitespace-nowrap text-fg-muted">
                  {nak.thaiName}
                </td>
                <td className="py-2 px-2 whitespace-nowrap text-fg-muted">
                  {PADA_THAI[p.nakshatra.pada - 1]}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
