/**
 * Divisional sign computations: D-3 (ตรียางค์), D-9 (นวางค์).
 *
 * The result is a SIGN INDEX, not a longitude. The Thai chart re-projects
 * each planet into the sub-sign for use in ตรียางค์จักร and นวางค์จักร.
 */

import { DECANATE_RULERS, SIGN_RULERS } from "./reference";
import type { PlanetId } from "./types";

/** §1 — D-3 decanate sign. Each 10° → a sign owned by the decanate ruler. */
export function decanateSign(longitudeDeg: number): { sign: number; ruler: PlanetId; index: 0 | 1 | 2 } {
  const lon = ((longitudeDeg % 360) + 360) % 360;
  const sign = Math.floor(lon / 30);
  const within = lon - sign * 30;
  const index = Math.min(2, Math.floor(within / 10)) as 0 | 1 | 2;
  const ruler = DECANATE_RULERS[sign][index];
  return { sign: rulerToSign(ruler, sign, index), ruler, index };
}

/**
 * Project a decanate ruler back to a sign for plotting on the ตรียางค์จักร.
 * BPHS-style trine rule: the decanate sign is (S + 4*index) % 12 — same sign
 * for index 0, +4 for index 1, +8 for index 2. Verified against §1 of the spec.
 */
function rulerToSign(_ruler: PlanetId, originalSign: number, index: 0 | 1 | 2): number {
  return (originalSign + index * 4) % 12;
}

/**
 * §1b — D-9 navamsha sign. Each 3°20' (= 200') → a sign starting from the
 * "first" of the sign's element group. Movable signs start from themselves;
 * fixed signs start from the 9th from themselves; dual signs from the 5th.
 */
export function navamshaSign(longitudeDeg: number): number {
  const lon = ((longitudeDeg % 360) + 360) % 360;
  const sign = Math.floor(lon / 30);
  const within = lon - sign * 30;
  const navIndex = Math.min(8, Math.floor(within / (30 / 9)));
  const startOffset = (sign % 3) * 8;
  return (sign + startOffset + navIndex) % 12;
}

/** Helper exposed to UI for D-1 sign rulership lookup. */
export function signRuler(signIdx: number): PlanetId {
  return SIGN_RULERS[((signIdx % 12) + 12) % 12];
}
