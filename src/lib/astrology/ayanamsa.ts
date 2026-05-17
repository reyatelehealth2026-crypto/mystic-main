/**
 * Ayanamsa (อายนางศะ) — the offset between tropical and sidereal zodiacs.
 *
 * Two systems are supported:
 *   - "lahiri"      — Chitrapaksha (สำนัก N. C. Lahiri)
 *                     Reference value 23°51'11" at 21 March 1956 0h UT (JD 2435553.0).
 *                     Drift ≈ 50.2884" per year.
 *   - "suriyayatra" — โหราศาสตร์ไทย สุริยยาตร์.
 *                     Reference value about 0°48'30" larger than Lahiri at J2000,
 *                     consistent with the published Thai สุริยยาตร์ tables that put
 *                     ลัคนาดาวอาทิตย์อุทัย ~6:20 น. on 17 พ.ค. 2569 (Surya = 03°กฎ).
 *                     Drift uses the same precession rate.
 */

import { julianCenturiesT } from "./julian";
import type { ChartSystem } from "./types";

const LAHIRI_REF_JD_J2000 = 2451545.0;
const LAHIRI_REF_VALUE_J2000 = 23.85675;

const PRECESSION_ARCSEC_PER_YEAR = 50.2884;
const ARCSEC_TO_DEG = 1 / 3600;
const DAYS_PER_YEAR = 365.25;

const SURIYAYATRA_OFFSET = 48.5 / 60;

export function lahiriAyanamsa(jdUT: number): number {
  const years = (jdUT - LAHIRI_REF_JD_J2000) / DAYS_PER_YEAR;
  return (
    LAHIRI_REF_VALUE_J2000 +
    years * PRECESSION_ARCSEC_PER_YEAR * ARCSEC_TO_DEG
  );
}

export function suriyayatraAyanamsa(jdUT: number): number {
  return lahiriAyanamsa(jdUT) + SURIYAYATRA_OFFSET;
}

export function ayanamsaFor(system: ChartSystem, jdUT: number): number {
  return system === "suriyayatra"
    ? suriyayatraAyanamsa(jdUT)
    : lahiriAyanamsa(jdUT);
}

export function meanObliquityDeg(jdUT: number): number {
  const T = julianCenturiesT(jdUT);
  const seconds =
    21.448 - 46.815 * T - 0.00059 * T * T + 0.001813 * T * T * T;
  return 23 + 26 / 60 + seconds / 3600;
}
