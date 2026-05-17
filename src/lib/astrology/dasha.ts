/**
 * §4 — ทักษา (Thai 8-fold dasha).
 *
 * Two products:
 *   - ทักษาเดิม (ภูมิทักษา): static mapping of 8 slot names to planets
 *     based on the weekday of birth.
 *   - มหาทักษา: which planet's period is currently running given an age,
 *     using the 108-year Ashtottari cycle (default per spec) or 120-year
 *     Vimshottari as an opt-in.
 */

import {
  ASHTOTTARI_YEARS,
  TAKSA_CYCLE,
  TAKSA_SLOT_NAMES,
  VIMSHOTTARI_YEARS,
  WEEKDAY_PLANET,
  type TaksaSlotName,
} from "./reference";
import type { PlanetId } from "./types";

export interface TaksaSlot {
  name: TaksaSlotName;
  planet: PlanetId;
  isInauspicious: boolean;
}

/** Map of slot name → planet, anchored to the birth-weekday planet at บริวาร. */
export function taksaForWeekday(weekdayPlanet: PlanetId): TaksaSlot[] {
  const start = TAKSA_CYCLE.indexOf(weekdayPlanet);
  if (start < 0) throw new Error(`Unknown weekday planet: ${weekdayPlanet}`);
  return TAKSA_SLOT_NAMES.map((name, i) => {
    const planet = TAKSA_CYCLE[(start + i) % TAKSA_CYCLE.length];
    return {
      name,
      planet,
      isInauspicious: name === "กาลกิณี",
    };
  });
}

/** Return the weekday planet (0=Sun, 1=Mon, …) for a Julian Day in UT. */
export function weekdayPlanetForJD(jdUT: number): PlanetId {
  const dow = Math.floor(jdUT + 1.5) % 7;
  const idx = ((dow % 7) + 7) % 7;
  return WEEKDAY_PLANET[idx];
}

export type DashaScheme = "ashtottari" | "vimshottari";

export interface DashaPeriod {
  planet: PlanetId;
  startAge: number;
  endAge: number;
  durationYears: number;
}

/**
 * Build the full ทักษา period sequence from birth.
 *
 * Ashtottari (108 yr): order of planets follows the รัศมีของทักษา 8-cycle
 * starting from the weekday planet (myhora convention).
 *
 * Vimshottari (120 yr): uses the nakshatra index of the natal Moon to find
 * the starting planet and remaining fraction; we approximate by starting
 * at the weekday planet with a full slot (this matches the Thai
 * mahataksa-jorn presentation, not pure Vedic Vimshottari).
 */
export function buildDashaSequence(
  weekdayPlanet: PlanetId,
  scheme: DashaScheme = "ashtottari",
  totalYears: number = 120
): DashaPeriod[] {
  const table = scheme === "ashtottari" ? ASHTOTTARI_YEARS : VIMSHOTTARI_YEARS;
  const cycle = scheme === "ashtottari"
    ? TAKSA_CYCLE
    : [...TAKSA_CYCLE, "ketu"] as PlanetId[];

  const start = cycle.indexOf(weekdayPlanet);
  if (start < 0) throw new Error(`weekday planet ${weekdayPlanet} not in cycle`);

  const out: DashaPeriod[] = [];
  let age = 0;
  let i = 0;
  while (age < totalYears) {
    const planet = cycle[(start + i) % cycle.length];
    const dur = table[planet] ?? 0;
    if (dur <= 0) {
      i += 1;
      continue;
    }
    const end = age + dur;
    out.push({ planet, startAge: age, endAge: end, durationYears: dur });
    age = end;
    i += 1;
  }
  return out;
}

export function findActiveDasha(
  sequence: DashaPeriod[],
  ageYears: number
): DashaPeriod | null {
  return sequence.find(
    (p) => ageYears >= p.startAge && ageYears < p.endAge
  ) ?? null;
}
