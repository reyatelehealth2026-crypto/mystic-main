/**
 * §6/§7 — มาตรฐานดาว / เกณฑ์มาตรฐาน.
 *
 * For each placed planet, return the ordered list of named dignities it
 * currently holds (เกษตร, อุจจ์, มูลตรีโกณ, มหาจักร, ราชาโชค, เทวีโชค,
 * อุจจาวิลาส, อุจจาภิมุข, ปรเกษตร, นิจ).
 */

import {
  DEVI_LUCK,
  EXALTATION,
  MAHACHAK,
  MOOL_TRIKONA,
  RAJA_LUCK,
  SIGN_RULERS,
} from "./reference";
import type { PlanetId } from "./types";

export type DignityLabel =
  | "เกษตร"
  | "อุจจ์"
  | "มูลตรีโกณ"
  | "มหาจักร"
  | "ราชาโชค"
  | "เทวีโชค"
  | "อุจจาวิลาส"
  | "อุจจาภิมุข"
  | "ปรเกษตร"
  | "นิจ";

export function dignitiesOf(
  planet: PlanetId,
  sign: number,
  degreeInSign: number
): DignityLabel[] {
  const labels: DignityLabel[] = [];

  // เกษตร — own sign
  const ownSigns = ownSignsOf(planet);
  if (ownSigns.includes(sign)) labels.push("เกษตร");

  // อุจจ์ / นิจ
  const ex = EXALTATION[planet];
  if (ex) {
    if (sign === ex.exaltSign) labels.push("อุจจ์");
    if (sign === ex.debilSign) labels.push("นิจ");
    if (sign === (ex.exaltSign + 1) % 12) labels.push("อุจจาวิลาส");
    if (sign === (ex.exaltSign + 6) % 12 && sign !== ex.debilSign) {
      labels.push("อุจจาภิมุข");
    }
  }

  // มูลตรีโกณ
  const mt = MOOL_TRIKONA[planet];
  if (mt && sign === mt.sign && degreeInSign >= mt.startDeg && degreeInSign < mt.endDeg) {
    labels.push("มูลตรีโกณ");
  }

  // มหาจักร / ราชาโชค / เทวีโชค
  if (MAHACHAK[planet] === sign) labels.push("มหาจักร");
  if (RAJA_LUCK[planet] === sign) labels.push("ราชาโชค");
  if (DEVI_LUCK[planet] === sign) labels.push("เทวีโชค");

  // ปรเกษตร — sign opposite own sign
  const opposites = ownSigns.map((s) => (s + 6) % 12);
  if (opposites.includes(sign) && !labels.includes("นิจ")) {
    labels.push("ปรเกษตร");
  }

  return labels;
}

function ownSignsOf(planet: PlanetId): number[] {
  const out: number[] = [];
  for (let s = 0; s < 12; s++) {
    if (SIGN_RULERS[s] === planet) out.push(s);
  }
  return out;
}

const PRIORITY: DignityLabel[] = [
  "อุจจ์",
  "เกษตร",
  "มูลตรีโกณ",
  "มหาจักร",
  "ราชาโชค",
  "เทวีโชค",
  "อุจจาวิลาส",
  "อุจจาภิมุข",
  "ปรเกษตร",
  "นิจ",
];

export function sortDignities(labels: DignityLabel[]): DignityLabel[] {
  return [...labels].sort(
    (a, b) => PRIORITY.indexOf(a) - PRIORITY.indexOf(b)
  );
}
