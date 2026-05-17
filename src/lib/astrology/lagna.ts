/**
 * Lagna (ลัคนา) — the rising sign at birth.
 *
 *   tan(λ_asc) = -cos(LST) / (sin(LST) cos(ε) + tan(φ) sin(ε))
 *
 * where LST is local sidereal time (degrees), ε is the mean obliquity, and
 * φ is the observer latitude (north-positive). Result is normalised to [0, 360)
 * and adjusted so that 0° ≤ λ_asc - LST mod 360 < 180° (the eastern horizon).
 */

import { meanObliquityDeg } from "./ayanamsa";
import { degToRad, norm360, radToDeg } from "./julian";

export function tropicalAscendant(
  localSiderealDeg: number,
  latitudeDeg: number,
  jdUT: number
): number {
  const ramc = degToRad(localSiderealDeg);
  const epsilon = degToRad(meanObliquityDeg(jdUT));
  const phi = degToRad(latitudeDeg);

  const y = -Math.cos(ramc);
  const x = Math.sin(ramc) * Math.cos(epsilon) + Math.tan(phi) * Math.sin(epsilon);
  const asc = norm360(radToDeg(Math.atan2(y, x)));

  let diff = asc - localSiderealDeg;
  diff = ((diff % 360) + 360) % 360;
  if (diff >= 180) {
    return norm360(asc + 180);
  }
  return asc;
}
