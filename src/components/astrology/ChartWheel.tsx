"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { NAKSHATRAS, ZODIAC_SIGNS } from "@/lib/astrology/zodiac";
import { HOUSE_INFO } from "@/lib/astrology/reference";
import type { NatalChart, PlanetPosition } from "@/lib/astrology/types";

/**
 * จักรราศีวิภาค — three-ring circular natal wheel.
 *
 *   Ring 0 (outermost): 27 นักษัตร × 13°20' segments with name labels.
 *   Ring 1: 12 ราศี × 30° segments with Thai sign abbreviation.
 *   Ring 2: 12 ภพ × 30° segments rotated so house 1 starts at the lagna
 *           (drawn at the 9 o'clock position, myhora convention).
 *   Centre: planet glyphs placed at their actual longitude inside each
 *           ราศี (with offsets per-sign to avoid overlap), plus the
 *           ลัคน์ marker.
 *
 * A second `transit` chart may be passed; its planets render in rose
 * on a thin inner band.
 */

export interface ChartWheelProps {
  chart: NatalChart;
  transit?: NatalChart;
  size?: number;
  className?: string;
}

const RING = {
  nakshatraOuter: 0.985,
  nakshatraInner: 0.86,
  rashiOuter: 0.86,
  rashiInner: 0.73,
  bhavaOuter: 0.73,
  bhavaInner: 0.6,
  planetOuter: 0.6,
  planetInner: 0.32,
  centreInner: 0.18,
};

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

const SIGN_BG = ["#fef3c7", "#fde2e2", "#e0f2fe", "#dcfce7"];

export function ChartWheel({ chart, transit, size = 480, className }: ChartWheelProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  const lagnaSign = chart.planets[0].zodiac.sign;
  const lagnaLon = chart.planets[0].longitude;

  // Helper: world-longitude → SVG-angle (deg, 0=top, clockwise).
  // Place 0° เมษ at the 9 o'clock position so the lagna sign reads from
  // the same orientation as myhora's traditional Thai engravings.
  //   svgAngle = 270 - (lon - lagnaLon)  (modulo 360)
  function lonToSvg(lon: number): number {
    return (270 - (lon - lagnaLon) + 360 * 4) % 360;
  }

  function signSpanSvg(signIdx: number): [number, number] {
    const startLon = signIdx * 30;
    const endLon = startLon + 30;
    const s = lonToSvg(endLon);
    const e = lonToSvg(startLon);
    return [s, e];
  }

  function bhavaSpanSvg(houseIdx: number): [number, number] {
    const startLon = ((lagnaSign + houseIdx) % 12) * 30;
    const endLon = startLon + 30;
    const s = lonToSvg(endLon);
    const e = lonToSvg(startLon);
    return [s, e];
  }

  function nakSpanSvg(nakIdx: number): [number, number] {
    const startLon = nakIdx * (360 / 27);
    const endLon = startLon + 360 / 27;
    const s = lonToSvg(endLon);
    const e = lonToSvg(startLon);
    return [s, e];
  }

  function normSpan(start: number, end: number): [number, number] {
    const s = start;
    let e = end;
    while (e < s) e += 360;
    return [s, e];
  }

  // Group natal planets by sign for placement
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
      {/* Ring background */}
      <circle
        cx={cx}
        cy={cy}
        r={r * RING.nakshatraOuter}
        fill="white"
        stroke="currentColor"
        strokeWidth="1"
        className="text-fg-subtle"
      />

      {/* 27 nakshatra cells */}
      {NAKSHATRAS.map((nak) => {
        const [s, e] = normSpan(...nakSpanSvg(nak.index));
        return (
          <path
            key={`nak-${nak.index}`}
            d={annularSector(
              cx,
              cy,
              r * RING.nakshatraOuter,
              r * RING.nakshatraInner,
              s,
              e
            )}
            fill={nak.index % 2 === 0 ? "#fafafa" : "#f3f4f6"}
            stroke="currentColor"
            strokeWidth="0.4"
            className="text-fg-subtle/60"
          />
        );
      })}

      {/* Nakshatra labels */}
      {NAKSHATRAS.map((nak) => {
        const startLon = nak.index * (360 / 27);
        const centreLon = startLon + 360 / 54;
        const a = lonToSvg(centreLon);
        const rText = r * ((RING.nakshatraOuter + RING.nakshatraInner) / 2);
        // place text along the ring, tangentially
        const [x, y] = polar(cx, cy, rText, a);
        // rotation: keep upright on top half, flip on bottom
        let rot = a - 90;
        const upright = a >= 90 && a <= 270;
        if (upright) rot += 180;
        return (
          <text
            key={`nak-label-${nak.index}`}
            transform={`translate(${x},${y}) rotate(${rot})`}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={size * 0.018}
            className="fill-fg-muted"
          >
            {nak.thaiName}
          </text>
        );
      })}

      {/* 12 ราศี cells */}
      {ZODIAC_SIGNS.map((sign) => {
        const [s, e] = normSpan(...signSpanSvg(sign.index));
        return (
          <path
            key={`sign-${sign.index}`}
            d={annularSector(
              cx,
              cy,
              r * RING.rashiOuter,
              r * RING.rashiInner,
              s,
              e
            )}
            fill={SIGN_BG[sign.index % SIGN_BG.length]}
            stroke="currentColor"
            strokeWidth="0.6"
            className="text-fg-subtle"
          />
        );
      })}

      {/* ราศี labels */}
      {ZODIAC_SIGNS.map((sign) => {
        const centreLon = sign.index * 30 + 15;
        const a = lonToSvg(centreLon);
        const [x, y] = polar(cx, cy, r * ((RING.rashiOuter + RING.rashiInner) / 2), a);
        return (
          <text
            key={`sign-label-${sign.index}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={size * 0.028}
            className="fill-fg font-medium"
          >
            {sign.thaiName}
          </text>
        );
      })}

      {/* 12 ภพ cells */}
      {Array.from({ length: 12 }).map((_, h) => {
        const [s, e] = normSpan(...bhavaSpanSvg(h));
        return (
          <path
            key={`bhava-${h}`}
            d={annularSector(
              cx,
              cy,
              r * RING.bhavaOuter,
              r * RING.bhavaInner,
              s,
              e
            )}
            fill={h === 0 ? "#ede9fe" : "white"}
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-fg-subtle"
          />
        );
      })}

      {/* ภพ labels */}
      {HOUSE_INFO.map((house, h) => {
        const centreLon = (((lagnaSign + h) % 12) * 30 + 15);
        const a = lonToSvg(centreLon);
        const [x, y] = polar(cx, cy, r * ((RING.bhavaOuter + RING.bhavaInner) / 2), a);
        return (
          <g key={`bhava-label-${h}`}>
            <text
              x={x}
              y={y - size * 0.012}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={size * 0.024}
              className="fill-accent font-semibold"
            >
              {house.number}
            </text>
            <text
              x={x}
              y={y + size * 0.014}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={size * 0.018}
              className="fill-fg-muted"
            >
              {house.thai}
            </text>
          </g>
        );
      })}

      {/* Planets at their longitude */}
      {Array.from(planetsBySign.entries()).map(([signIdx, planets]) => {
        const sortedByLon = [...planets].sort((a, b) => a.longitude - b.longitude);
        return sortedByLon.map((p, idx) => {
          const a = lonToSvg(p.longitude);
          const rBase = r * ((RING.planetOuter + RING.planetInner) / 2);
          const offset = (idx - (sortedByLon.length - 1) / 2) * size * 0.022;
          const rEff = rBase + offset;
          const [x, y] = polar(cx, cy, rEff, a);
          return (
            <g key={`planet-${p.id}-${signIdx}`}>
              <circle
                cx={x}
                cy={y}
                r={size * 0.018}
                fill="white"
                stroke="currentColor"
                strokeWidth="0.6"
                className={cn(
                  p.id === "lagna" ? "text-violet-600" : "text-fg"
                )}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={size * 0.026}
                className={cn(
                  "font-semibold",
                  p.id === "lagna" ? "fill-accent" : "fill-fg"
                )}
              >
                {p.thaiNumeral}
              </text>
            </g>
          );
        });
      })}

      {/* Transit planets (optional) */}
      {transit &&
        transit.planets
          .filter((p) => p.id !== "lagna")
          .map((p) => {
            const a = lonToSvg(p.longitude);
            const rTransit = r * (RING.planetInner + 0.04);
            const [x, y] = polar(cx, cy, rTransit, a);
            return (
              <g key={`transit-${p.id}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={size * 0.014}
                  fill="white"
                  stroke="#dc2626"
                  strokeWidth="0.6"
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={size * 0.02}
                  className="fill-rose-600 font-semibold"
                >
                  {p.thaiNumeral}
                </text>
              </g>
            );
          })}

      {/* Centre disc */}
      <circle
        cx={cx}
        cy={cy}
        r={r * RING.centreInner}
        fill="white"
        stroke="currentColor"
        strokeWidth="0.8"
        className="text-fg-subtle"
      />
      <text
        x={cx}
        y={cy - size * 0.018}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.034}
        className="fill-fg font-serif font-semibold"
      >
        จักรราศี
      </text>
      <text
        x={cx}
        y={cy + size * 0.018}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.026}
        className="fill-fg-muted"
      >
        วิภาค
      </text>
    </svg>
  );
}
