/**
 * Julian-date and angle utilities used by every astrology engine.
 * Formulae are from Meeus, "Astronomical Algorithms", 2nd ed., ch. 7 & 12.
 */

import type { BirthInput } from "./types";

/** Julian Day Number for the given Gregorian calendar date at 0h UT. */
export function gregorianToJDN(
  year: number,
  month: number,
  day: number
): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    b -
    1524.5
  );
}

/** Julian Day (UT) from a birth input. */
export function birthToJulianDay(input: BirthInput): number {
  const jdn = gregorianToJDN(input.year, input.month, input.day);
  const utHours =
    input.hour + input.minute / 60 - input.timezoneHours;
  return jdn + utHours / 24;
}

/** Julian centuries since J2000.0 (TT). */
export function julianCenturiesT(jd: number): number {
  return (jd - 2451545.0) / 36525;
}

/** Normalise angle to [0, 360). */
export function norm360(deg: number): number {
  const x = deg % 360;
  return x < 0 ? x + 360 : x;
}

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Greenwich mean sidereal time (degrees) for the given JD UT.
 * Meeus eq. 12.4. Result in [0, 360).
 */
export function greenwichMeanSiderealTime(jdUT: number): number {
  const T = julianCenturiesT(jdUT);
  const gmst =
    280.46061837 +
    360.98564736629 * (jdUT - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000;
  return norm360(gmst);
}

/** Local mean sidereal time in degrees for an east-positive longitude. */
export function localSiderealTimeDeg(
  jdUT: number,
  longitudeEast: number
): number {
  return norm360(greenwichMeanSiderealTime(jdUT) + longitudeEast);
}
