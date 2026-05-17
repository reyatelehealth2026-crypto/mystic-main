/**
 * §5 — Whole-sign houses (ภพ).
 *
 * The Thai default (used by myhora and most textbooks) is whole-sign:
 *   - House 1 = the entire sign of the lagna
 *   - House 2 = next sign anti-clockwise (sidereal east → south → west → north)
 *   - …
 *
 * Returns 1..12.
 */

import { HOUSE_INFO } from "./reference";

export function houseFromSigns(lagnaSign: number, planetSign: number): number {
  return ((planetSign - lagnaSign + 12) % 12) + 1;
}

export function houseInfo(houseNumber: number) {
  const info = HOUSE_INFO[((houseNumber - 1) % 12 + 12) % 12];
  return info;
}
