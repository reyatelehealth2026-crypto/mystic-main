/**
 * §9 — Sunrise and สมผุสอาทิตย์อุทัย.
 *
 * Sunrise time using NOAA / Meeus simplified solar position. Returns the
 * Julian Day (UT) and local clock time of the *visible-disc* sunrise for
 * the given calendar date and observer.
 */

import { sunLongitude } from "./positions";
import { degToRad, gregorianToJDN, julianCenturiesT, norm360, radToDeg } from "./julian";

interface SunRiseSet {
  jdUT: number;
  hourLocal: number;
  minuteLocal: number;
  sunLongitudeTropical: number;
}

const SUNRISE_ZENITH_DEG = 90 + 50 / 60;

/**
 * Compute mean sunrise of the given civil date at the given location.
 * Geographic longitude is east-positive in degrees; latitude is north-positive.
 */
export function sunriseFor(
  year: number,
  month: number,
  day: number,
  latitudeDeg: number,
  longitudeEastDeg: number,
  timezoneHours: number
): SunRiseSet | null {
  const jdNoon = gregorianToJDN(year, month, day) + 0.5;
  const Tnoon = julianCenturiesT(jdNoon);
  const meanLon = norm360(280.46646 + 36000.76983 * Tnoon);
  const meanAnom = 357.52911 + 35999.05029 * Tnoon;
  const eccent = 0.016708634;
  const equationOfTimeMin = equationOfTime(jdNoon);

  const tropicalSunLon = sunLongitude(jdNoon);
  const obliquity = degToRad(23.4392911 - 0.0130042 * Tnoon);
  const sunDeclRad = Math.asin(
    Math.sin(obliquity) * Math.sin(degToRad(tropicalSunLon))
  );

  const phi = degToRad(latitudeDeg);
  const cosHA =
    (Math.cos(degToRad(SUNRISE_ZENITH_DEG)) -
      Math.sin(phi) * Math.sin(sunDeclRad)) /
    (Math.cos(phi) * Math.cos(sunDeclRad));
  if (cosHA > 1 || cosHA < -1) return null;

  const HArad = Math.acos(cosHA);
  const HAdeg = radToDeg(HArad);
  const solarNoonUTmin = 720 - 4 * longitudeEastDeg - equationOfTimeMin;
  const sunriseUTmin = solarNoonUTmin - 4 * HAdeg;
  const sunriseLocalMin = sunriseUTmin + timezoneHours * 60;
  const totalLocal = ((sunriseLocalMin % 1440) + 1440) % 1440;
  const hour = Math.floor(totalLocal / 60);
  const minute = Math.round(totalLocal % 60);

  const jdUT = jdNoon - 0.5 + sunriseUTmin / 1440;
  void meanLon;
  void meanAnom;
  void eccent;
  return {
    jdUT,
    hourLocal: hour,
    minuteLocal: minute,
    sunLongitudeTropical: sunLongitude(jdUT),
  };
}

/**
 * Equation of time in minutes at noon TT. Meeus chapter 28 simplified.
 */
function equationOfTime(jd: number): number {
  const T = julianCenturiesT(jd);
  const epsilon = degToRad(23.4392911 - 0.0130042 * T);
  const L0 = degToRad(280.46646 + 36000.76983 * T);
  const e = 0.016708634;
  const Mrad = degToRad(357.52911 + 35999.05029 * T);
  const y = Math.tan(epsilon / 2) ** 2;
  const Etime =
    y * Math.sin(2 * L0) -
    2 * e * Math.sin(Mrad) +
    4 * e * y * Math.sin(Mrad) * Math.cos(2 * L0) -
    0.5 * y * y * Math.sin(4 * L0) -
    1.25 * e * e * Math.sin(2 * Mrad);
  return radToDeg(Etime) * 4;
}
