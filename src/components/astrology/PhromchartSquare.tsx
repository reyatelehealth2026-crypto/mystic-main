"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { ZODIAC_SIGNS } from "@/lib/astrology/zodiac";
import type { NatalChart, PlanetPosition } from "@/lib/astrology/types";

/**
 * ดวงพรหมชาติ — traditional Thai 12-cell square engraving.
 *
 * Layout (counted clockwise from top-right corner, the lagna):
 *
 *  +-------+-------+-------+-------+
 *  |   2   |   1   |  12   |  11   |
 *  +-------+-------+-------+-------+
 *  |   3   |               |  10   |
 *  +-------+   centre      +-------+
 *  |   4   |   title       |   9   |
 *  +-------+-------+-------+-------+
 *  |   5   |   6   |   7   |   8   |
 *  +-------+-------+-------+-------+
 *
 *  Each cell shows the sign abbreviation in a small badge plus the
 *  planet glyphs falling in that house.
 */

export interface PhromchartSquareProps {
  chart: NatalChart;
  size?: number;
  className?: string;
}

const CELL_HOUSE_ORDER = [
  // top row: cells (col, row) -> house number
  { col: 1, row: 0, house: 1 },
  { col: 0, row: 0, house: 2 },
  { col: 0, row: 1, house: 3 },
  { col: 0, row: 2, house: 4 },
  { col: 0, row: 3, house: 5 },
  { col: 1, row: 3, house: 6 },
  { col: 2, row: 3, house: 7 },
  { col: 3, row: 3, house: 8 },
  { col: 3, row: 2, house: 9 },
  { col: 3, row: 1, house: 10 },
  { col: 3, row: 0, house: 11 },
  { col: 2, row: 0, house: 12 },
];

export function PhromchartSquare({ chart, size = 360, className }: PhromchartSquareProps) {
  const cellSize = size / 4;
  const lagnaSign = chart.planets[0].zodiac.sign;

  const planetsByHouse = new Map<number, PlanetPosition[]>();
  for (const p of chart.planets) {
    const list = planetsByHouse.get(p.house) ?? [];
    list.push(p);
    planetsByHouse.set(p.house, list);
  }

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <rect
          x={0}
          y={0}
          width={size}
          height={size}
          fill="white"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-fg-subtle"
        />
        {CELL_HOUSE_ORDER.map(({ col, row, house }) => {
          const x = col * cellSize;
          const y = row * cellSize;
          const sign = (lagnaSign + house - 1) % 12;
          const signInfo = ZODIAC_SIGNS[sign];
          const planets = planetsByHouse.get(house) ?? [];
          const isLagnaHouse = house === 1;
          return (
            <g key={`cell-${house}`}>
              <rect
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                fill={isLagnaHouse ? "#ede9fe" : "white"}
                stroke="currentColor"
                strokeWidth="0.8"
                className="text-fg-subtle"
              />
              {/* house number badge */}
              <text
                x={x + 6}
                y={y + 14}
                fontSize={cellSize * 0.13}
                className="fill-fg-muted font-mono"
              >
                {house}
              </text>
              {/* sign abbreviation top-right */}
              <text
                x={x + cellSize - 6}
                y={y + 14}
                textAnchor="end"
                fontSize={cellSize * 0.13}
                className="fill-fg-muted"
              >
                {signInfo.thaiShort}
              </text>
              {/* planet glyphs */}
              {planets.map((p, i) => {
                const cols = Math.min(planets.length, 4);
                const rows = Math.ceil(planets.length / cols);
                const colI = i % cols;
                const rowI = Math.floor(i / cols);
                const cx = x + cellSize / 2 + (colI - (cols - 1) / 2) * cellSize * 0.22;
                const cy = y + cellSize / 2 + (rowI - (rows - 1) / 2) * cellSize * 0.28;
                return (
                  <text
                    key={`${house}-${p.id}`}
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={cellSize * 0.24}
                    className={cn(
                      "font-semibold",
                      p.id === "lagna" ? "fill-accent" : "fill-fg"
                    )}
                  >
                    {p.thaiNumeral}
                  </text>
                );
              })}
            </g>
          );
        })}
        {/* centre title */}
        <rect
          x={cellSize}
          y={cellSize}
          width={cellSize * 2}
          height={cellSize * 2}
          fill="white"
          stroke="currentColor"
          strokeWidth="0.8"
          className="text-fg-subtle"
        />
        <text
          x={size / 2}
          y={size / 2 - cellSize * 0.12}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={cellSize * 0.34}
          className="fill-fg font-serif font-semibold"
        >
          ดวง
        </text>
        <text
          x={size / 2}
          y={size / 2 + cellSize * 0.18}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={cellSize * 0.22}
          className="fill-fg-muted"
        >
          พรหมชาติ
        </text>
      </svg>
    </div>
  );
}
