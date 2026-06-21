"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { ZODIAC_SIGNS } from "@/lib/astrology/zodiac";
import type { NatalChart, PlanetPosition } from "@/lib/astrology/types";

/**
 * Compact 12-cell wheels used by myhora for the four divisional charts
 * (นวางค์จักร / ตรียางค์จักร / นักษัตรจักร / ภพจักร).
 *
 * Pass a `signOf` function that returns the cell-index a planet belongs to
 * in this divisional chart. The wheel always shows 12 outer cells.
 */

export interface SubWheelProps {
  title: string;
  chart: NatalChart;
  signOf: (p: PlanetPosition) => number;
  size?: number;
  className?: string;
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const;
}

function annularSector(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startDeg: number,
  endDeg: number
) {
  const [x1, y1] = polar(cx, cy, rOuter, startDeg);
  const [x2, y2] = polar(cx, cy, rOuter, endDeg);
  const [x3, y3] = polar(cx, cy, rInner, endDeg);
  const [x4, y4] = polar(cx, cy, rInner, startDeg);
  return [
    `M ${x1} ${y1}`,
    `A ${rOuter} ${rOuter} 0 0 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${rInner} ${rInner} 0 0 0 ${x4} ${y4}`,
    "Z",
  ].join(" ");
}

export function SubWheel({ title, chart, signOf, size = 220, className }: SubWheelProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;
  const lagnaSign = chart.planets[0].zodiac.sign;

  function cellSpan(idx: number): [number, number] {
    const offsetIdx = (idx - lagnaSign + 12) % 12;
    const start = 270 - offsetIdx * 30 - 30;
    const end = start + 30;
    const s = start;
    let e = end;
    while (e < s) e += 360;
    return [((s % 360) + 360) % 360, ((e % 360) + 360) % 360];
  }

  const cellPlanets = new Map<number, PlanetPosition[]>();
  for (const p of chart.planets) {
    const idx = signOf(p);
    const list = cellPlanets.get(idx) ?? [];
    list.push(p);
    cellPlanets.set(idx, list);
  }

  return (
    <figure className={cn("flex flex-col items-center", className)}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle
          cx={cx}
          cy={cy}
          r={r * 0.95}
          fill="white"
          stroke="currentColor"
          strokeWidth="0.8"
          className="text-fg-subtle"
        />
        {ZODIAC_SIGNS.map((sign) => {
          const [s, e] = cellSpan(sign.index);
          const sNorm = s;
          let eNorm = e;
          while (eNorm < sNorm) eNorm += 360;
          return (
            <path
              key={`sub-${title}-${sign.index}`}
              d={annularSector(cx, cy, r * 0.95, r * 0.55, sNorm, eNorm)}
              fill={sign.index === lagnaSign ? "#ede9fe" : "white"}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-fg-subtle"
            />
          );
        })}
        {ZODIAC_SIGNS.map((sign) => {
          const offsetIdx = (sign.index - lagnaSign + 12) % 12;
          const a = (270 - offsetIdx * 30 - 15 + 360) % 360;
          const [x, y] = polar(cx, cy, r * 0.84, a);
          return (
            <text
              key={`sub-${title}-label-${sign.index}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={size * 0.05}
              className="fill-fg-muted"
            >
              {sign.thaiShort}
            </text>
          );
        })}
        {Array.from(cellPlanets.entries()).map(([cellIdx, planets]) => {
          const offsetIdx = (cellIdx - lagnaSign + 12) % 12;
          const a = (270 - offsetIdx * 30 - 15 + 360) % 360;
          const [x, y] = polar(cx, cy, r * 0.68, a);
          const lh = size * 0.052;
          return (
            <g key={`sub-${title}-planets-${cellIdx}`}>
              {planets.map((p, i) => (
                <text
                  key={`${p.id}-${cellIdx}`}
                  x={x}
                  y={y + (i - (planets.length - 1) / 2) * lh}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={size * 0.055}
                  className={cn(
                    "font-semibold",
                    p.id === "lagna" ? "fill-accent" : "fill-fg"
                  )}
                >
                  {p.thaiNumeral}
                </text>
              ))}
            </g>
          );
        })}
        <circle
          cx={cx}
          cy={cy}
          r={r * 0.55}
          fill="white"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-fg-subtle"
        />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={size * 0.07}
          className="fill-fg font-serif"
        >
          {title}
        </text>
      </svg>
    </figure>
  );
}
