/**
 * High-level natal chart computation: dispatches to either สุริยยาตร์
 * or Lahiri นิรายนะ and returns a fully-populated NatalChart.
 */

import { ayanamsaFor } from "./ayanamsa";
import { birthToJulianDay, localSiderealTimeDeg, norm360 } from "./julian";
import { tropicalAscendant } from "./lagna";
import { planetTropical } from "./positions";
import type {
  BirthInput,
  ChartSystem,
  NakshatraPosition,
  NatalChart,
  PlanetId,
  PlanetPosition,
  ZodiacPosition,
} from "./types";
import { getPlanetInfo, NAKSHATRAS } from "./zodiac";

const PLANET_ORDER: PlanetId[] = [
  "lagna",
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
  "rahu",
  "ketu",
  "uranus",
];

function toZodiac(longitude: number): ZodiacPosition {
  const lon = norm360(longitude);
  const sign = Math.floor(lon / 30);
  const within = lon - sign * 30;
  const degree = Math.floor(within);
  const minute = Math.floor((within - degree) * 60);
  return { sign, degree, minute, longitude: lon };
}

function toNakshatra(longitude: number): NakshatraPosition {
  const lon = norm360(longitude);
  const span = 360 / 27;
  const idx = Math.floor(lon / span);
  const within = lon - idx * span;
  const pada = Math.floor(within / (span / 4)) + 1;
  return { index: idx, pada };
}

export function computeNatalChart(
  input: BirthInput,
  system: ChartSystem
): NatalChart {
  const jdUT = birthToJulianDay(input);
  const ayanamsa = ayanamsaFor(system, jdUT);
  const lst = localSiderealTimeDeg(jdUT, input.longitude);

  const planets: PlanetPosition[] = PLANET_ORDER.map((id) => {
    const info = getPlanetInfo(id);
    let tropical: number;
    let retrograde = false;

    if (id === "lagna") {
      tropical = tropicalAscendant(lst, input.latitude, jdUT);
    } else {
      const result = planetTropical(id, jdUT);
      tropical = result.longitude;
      retrograde = result.retrograde;
    }

    const sidereal = norm360(tropical - ayanamsa);
    return {
      id,
      thaiName: info.thaiName,
      thaiNumeral: info.thaiNumeral,
      longitude: sidereal,
      zodiac: toZodiac(sidereal),
      nakshatra: toNakshatra(sidereal),
      retrograde,
    };
  });

  return {
    system,
    ayanamsa,
    input,
    julianDayUT: jdUT,
    localSiderealTime: lst,
    planets,
  };
}

export function nakshatraName(index: number): string {
  return NAKSHATRAS[((index % 27) + 27) % 27].thaiName;
}
