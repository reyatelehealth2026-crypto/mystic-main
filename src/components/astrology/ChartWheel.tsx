"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { ZODIAC_SIGNS } from "@/lib/astrology/zodiac";
import type { NatalChart, PlanetPosition } from "@/lib/astrology/types";

/**
 * จักรราศีวิภาค — circular natal-chart wheel.
 *
 * The wheel is drawn from the lagna sign at the *9 o'clock* position
 * (myhora.com convention), with the 12 houses running anti-clockwise.
 * Each sign cell is an annular sector. Planets inside the same sign
 * stack vertically; the column splits when the cell gets crowded.
 */

export interface ChartWheelProps {
  chart: NatalChart;
  size?: number;
  className?: string;
}

const SIGN_RING_OUTER = 0.96;
const SIGN_RING_INNER = 0.78;
const HOUSE_RING_OUTER = SIGN_RING_INNER;
const HOUSE_RING_INNER = 0.32;

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
  const sweep = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${x1} ${y1}`,
    `A ${rOuter} ${rOuter} 0 ${sweep} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${rInner} ${rInner} 0 ${sweep} 0 ${x4} ${y4}`,
    "Z",
  ].join(" ");
}

export function ChartWheel({ chart, size = 360, className }: ChartWheelProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  const lagnaSign = chart.planets[0].zodiac.sign;

  function signCenterDeg(signIdx: number): number {
    const offset = ((signIdx - lagnaSign + 12) % 12) * 30;
    return (270 - offset - 15 + 360) % 360;
  }

  function signBoundariesDeg(signIdx: number): [number, number] {
    const center = signCenterDeg(signIdx);
    return [(center - 15 + 360) % 360, (center + 15) % 360];
  }

  const planetsBySign = new Map<number, PlanetPosition[]>();
  for (const p of chart.planets) {
    const list = planetsBySign.get(p.zodiac.sign) ?? [];
    list.push(p);
    planetsBySign.set(p.zodiac.sign, list);
  }

  return (
    <svg
      role="img"
      aria-label="จักรราศีวิภาค"
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={cn("max-w-full", className)}
    >
      <circle
        cx={cx}
        cy={cy}
        r={r * SIGN_RING_OUTER}
        fill="white"
        stroke="currentColor"
        strokeWidth="1"
        className="text-fg-subtle"
      />

      {ZODIAC_SIGNS.map((sign) => {
        const [start, end] = signBoundariesDeg(sign.index);
        const startN = end < start ? start - 360 : start;
        return (
          <path
            key={`sign-bg-${sign.index}`}
            d={annularSector(
              cx,
              cy,
              r * SIGN_RING_OUTER,
              r * SIGN_RING_INNER,
              startN,
              end
            )}
            fill={sign.index % 2 === 0 ? "#fafaf9" : "#f3f4f6"}
            stroke="currentColor"
            strokeWidth="0.75"
            className="text-fg-subtle"
          />
        );
      })}

      {ZODIAC_SIGNS.map((sign) => {
        const center = signCenterDeg(sign.index);
        const [x, y] = polar(cx, cy, r * ((SIGN_RING_OUTER + SIGN_RING_INNER) / 2), center);
        return (
          <text
            key={`sign-label-${sign.index}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={size * 0.04}
            className="fill-fg font-medium"
          >
            {sign.thaiName}
          </text>
        );
      })}

      <circle
        cx={cx}
        cy={cy}
        r={r * HOUSE_RING_OUTER}
        fill="white"
        stroke="currentColor"
        strokeWidth="1"
        className="text-fg-subtle"
      />

      {ZODIAC_SIGNS.map((sign) => {
        const [start, end] = signBoundariesDeg(sign.index);
        const startN = end < start ? start - 360 : start;
        const [x1, y1] = polar(cx, cy, r * HOUSE_RING_OUTER, startN);
        const [x2, y2] = polar(cx, cy, r * HOUSE_RING_INNER, startN);
        return (
          <line
            key={`house-line-${sign.index}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="0.75"
            className="text-fg-subtle"
          />
        );
      })}

      {ZODIAC_SIGNS.map((sign) => {
        const planets = planetsBySign.get(sign.index) ?? [];
        if (planets.length === 0) return null;
        const center = signCenterDeg(sign.index);
        const rMid = r * ((HOUSE_RING_OUTER + HOUSE_RING_INNER) / 2);
        const [cxLabel, cyLabel] = polar(cx, cy, rMid, center);
        const lineHeight = size * 0.035;
        return (
          <g key={`planets-${sign.index}`}>
            {planets.map((p, idx) => (
              <text
                key={p.id}
                x={cxLabel}
                y={cyLabel + (idx - (planets.length - 1) / 2) * lineHeight}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={size * 0.034}
                className={cn(
                  "fill-fg font-semibold",
                  p.id === "lagna" && "fill-violet-700"
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
        r={r * HOUSE_RING_INNER}
        fill="white"
        stroke="currentColor"
        strokeWidth="1"
        className="text-fg-subtle"
      />

      <text
        x={cx}
        y={cy - size * 0.025}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.045}
        className="fill-fg font-serif font-semibold"
      >
        จักรราศี
      </text>
      <text
        x={cx}
        y={cy + size * 0.025}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.035}
        className="fill-fg-muted"
      >
        วิภาค
      </text>
    </svg>
  );
}
