/**
 * High-level natal chart computation.
 *
 * Returns a fully-populated NatalChart including house, decanate, navamsha,
 * ฤกษ์ group, ตรียางค์พิษ status, and ranked มาตรฐานดาว (dignities) for
 * each placed body.
 */

import { ayanamsaFor } from "./ayanamsa";
import { weekdayPlanetForJD } from "./dasha";
import { dignitiesOf, sortDignities } from "./dignities";
import { decanateSign, navamshaSign } from "./divisional";
import { houseFromSigns } from "./houses";
import { birthToJulianDay, localSiderealTimeDeg, norm360 } from "./julian";
import { tropicalAscendant } from "./lagna";
import { poisonAt } from "./poison";
import { planetTropical } from "./positions";
import { roekGroupFor } from "./reference";
import { sunriseFor } from "./sunrise";
import type {
  BirthInput,
  ChartSystem,
  NakshatraPosition,
  NatalChart,
  PlanetId,
  PlanetPosition,
  SunriseHeader,
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
  const pada = Math.min(4, Math.floor(within / (span / 4)) + 1);
  return { index: idx, pada };
}

export function computeNatalChart(
  input: BirthInput,
  system: ChartSystem
): NatalChart {
  const jdUT = birthToJulianDay(input);
  const ayanamsa = ayanamsaFor(system, jdUT);
  const lst = localSiderealTimeDeg(jdUT, input.longitude);

  const lagnaTropical = tropicalAscendant(lst, input.latitude, jdUT);
  const lagnaSidereal = norm360(lagnaTropical - ayanamsa);
  const lagnaSign = Math.floor(lagnaSidereal / 30);

  const planets: PlanetPosition[] = PLANET_ORDER.map((id) => {
    const info = getPlanetInfo(id);
    let tropical: number;
    let retrograde = false;

    if (id === "lagna") {
      tropical = lagnaTropical;
    } else {
      const r = planetTropical(id, jdUT);
      tropical = r.longitude;
      retrograde = r.retrograde;
    }

    const sidereal = norm360(tropical - ayanamsa);
    const zodiac = toZodiac(sidereal);
    const dec = decanateSign(sidereal);
    const nav = navamshaSign(sidereal);
    const nak = toNakshatra(sidereal);
    const roek = roekGroupFor(nak.index);
    const poison = poisonAt(sidereal);
    const labels = id === "lagna"
      ? []
      : sortDignities(dignitiesOf(id, zodiac.sign, zodiac.degree));

    return {
      id,
      thaiName: info.thaiName,
      thaiNumeral: info.thaiNumeral,
      longitude: sidereal,
      zodiac,
      nakshatra: nak,
      retrograde,
      house: houseFromSigns(lagnaSign, zodiac.sign),
      decanateSign: dec.sign,
      navamshaSign: nav,
      roekGroupId: roek.id,
      poison,
      dignities: labels,
    };
  });

  const weekday = weekdayPlanetForJD(jdUT - input.timezoneHours / 24);

  let sunrise: SunriseHeader | null = null;
  const sr = sunriseFor(
    input.year,
    input.month,
    input.day,
    input.latitude,
    input.longitude,
    input.timezoneHours
  );
  if (sr) {
    const siderealSun = norm360(sr.sunLongitudeTropical - ayanamsa);
    const z = toZodiac(siderealSun);
    sunrise = {
      hourLocal: sr.hourLocal,
      minuteLocal: sr.minuteLocal,
      sunSign: z.sign,
      sunDegree: z.degree,
      sunMinute: z.minute,
      longitudeSidereal: siderealSun,
    };
  }

  return {
    system,
    ayanamsa,
    input,
    julianDayUT: jdUT,
    localSiderealTime: lst,
    planets,
    weekday,
    sunrise,
  };
}

export function nakshatraName(index: number): string {
  return NAKSHATRAS[((index % 27) + 27) % 27].thaiName;
}
