"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { NAKSHATRAS, ZODIAC_SIGNS } from "@/lib/astrology/zodiac";
import type { NatalChart } from "@/lib/astrology/types";
import { HOUSE_INFO } from "@/lib/astrology/reference";

/**
 * Planet-position table mirroring the myhora.com columns. The "เกณฑ์มาตรฐาน"
 * column is the slash-joined list of named dignities; "พิษ" shows the
 * ตรียางค์พิษ classification with a "(หนัก)" tag for the 2nd-navamsha core.
 */

export interface PlanetTableProps {
  chart: NatalChart;
  className?: string;
}

const PADA_THAI = ["ปฐม", "ทุติย", "ตติย", "จตุตถ"];

export function PlanetTable({ chart, className }: PlanetTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-[11px] md:text-xs border-collapse">
        <thead>
          <tr className="border-b border-border text-fg-muted">
            <Th>ดาว</Th>
            <Th>ราศี</Th>
            <Th right>°</Th>
            <Th right>&apos;</Th>
            <Th>ตรียางค์</Th>
            <Th>นวางค์</Th>
            <Th>ภพ</Th>
            <Th>นักษัตร</Th>
            <Th>บาท</Th>
            <Th>ฤกษ์</Th>
            <Th>พิษ</Th>
            <Th>เกณฑ์มาตรฐาน</Th>
          </tr>
        </thead>
        <tbody>
          {chart.planets.map((p) => {
            const sign = ZODIAC_SIGNS[p.zodiac.sign];
            const nak = NAKSHATRAS[p.nakshatra.index];
            const decSign = ZODIAC_SIGNS[p.decanateSign];
            const navSign = ZODIAC_SIGNS[p.navamshaSign];
            const houseLabel = HOUSE_INFO[p.house - 1]?.thai ?? "";
            const dignityText =
              p.dignities.length > 0 ? p.dignities.join(" / ") : "—";
            return (
              <tr
                key={p.id}
                className="border-b border-border/40 last:border-0 hover:bg-surface/40"
              >
                <Td>
                  <span className="font-mono text-fg-muted mr-1">
                    {p.thaiNumeral}
                  </span>
                  <span className="font-medium text-fg">{p.thaiName}</span>
                  {p.retrograde && (
                    <span className="ml-1 text-[10px] text-rose-600 align-super">
                      พ.
                    </span>
                  )}
                </Td>
                <Td>{sign.thaiShort}</Td>
                <Td right>
                  {String(p.zodiac.degree).padStart(2, "0")}
                </Td>
                <Td right>
                  {String(p.zodiac.minute).padStart(2, "0")}
                </Td>
                <Td muted>{decSign.thaiShort}</Td>
                <Td muted>{navSign.thaiShort}</Td>
                <Td muted>
                  <span className="font-mono">{p.house}</span>
                  <span className="ml-1 text-fg-subtle">{houseLabel}</span>
                </Td>
                <Td muted>{nak.thaiName}</Td>
                <Td muted>{PADA_THAI[p.nakshatra.pada - 1]}</Td>
                <Td muted>
                  <span className="text-[10px]">{roekShort(p.roekGroupId)}</span>
                </Td>
                <Td>
                  {p.poison.kind ? (
                    <span
                      className={cn(
                        "text-[10px] font-medium",
                        p.poison.severity === "heavy"
                          ? "text-rose-600"
                          : "text-amber-600"
                      )}
                    >
                      {p.poison.label}
                    </span>
                  ) : (
                    <span className="text-fg-subtle">—</span>
                  )}
                </Td>
                <Td>
                  <span className="text-[10px] text-violet-700 font-medium">
                    {dignityText}
                  </span>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const ROEK_SHORT = [
  "ทลิทโท",
  "มหัทธโน",
  "โจโร",
  "ภูมิปาโล",
  "เทศาตรี",
  "เทวี",
  "เพชฌฆาต",
  "ราชา",
  "สมโณ",
];

function roekShort(id: number): string {
  return ROEK_SHORT[id - 1] ?? "—";
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th
      className={cn(
        "py-2 px-1.5 font-medium underline",
        right ? "text-right" : "text-left"
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  right,
  muted,
}: {
  children: React.ReactNode;
  right?: boolean;
  muted?: boolean;
}) {
  return (
    <td
      className={cn(
        "py-2 px-1.5 whitespace-nowrap",
        right ? "text-right tabular-nums" : "",
        muted ? "text-fg-muted" : "text-fg"
      )}
    >
      {children}
    </td>
  );
}
