/**
 * Thai natal chart (จักรราศีวิภาค) — shared types.
 *
 * Supports two longitude systems:
 *   - "suriyayatra"  — โหราศาสตร์ไทย สุริยยาตร์ (Lahiri + 48.5')
 *   - "lahiri"       — นิรายนะวิธี (Chitrapaksha / Lahiri ayanamsa)
 */

import type { DignityLabel } from "./dignities";
import type { PoisonKind, PoisonSeverity } from "./poison";

export type ChartSystem = "suriyayatra" | "lahiri";

export type PlanetId =
  | "lagna"
  | "sun"
  | "moon"
  | "mars"
  | "mercury"
  | "jupiter"
  | "venus"
  | "saturn"
  | "rahu"
  | "ketu"
  | "uranus";

export interface ZodiacPosition {
  sign: number;
  degree: number;
  minute: number;
  longitude: number;
}

export interface NakshatraPosition {
  index: number;
  pada: number;
}

export interface PoisonInfo {
  kind: PoisonKind | null;
  severity: PoisonSeverity;
  label: string;
}

export interface PlanetPosition {
  id: PlanetId;
  thaiName: string;
  thaiNumeral: string;
  longitude: number;
  zodiac: ZodiacPosition;
  nakshatra: NakshatraPosition;
  retrograde: boolean;
  house: number;
  decanateSign: number;
  navamshaSign: number;
  roekGroupId: number;
  poison: PoisonInfo;
  dignities: DignityLabel[];
}

export interface BirthInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  timezoneHours: number;
  latitude: number;
  longitude: number;
}

export interface SunriseHeader {
  hourLocal: number;
  minuteLocal: number;
  sunSign: number;
  sunDegree: number;
  sunMinute: number;
  longitudeSidereal: number;
}

export interface NatalChart {
  system: ChartSystem;
  ayanamsa: number;
  input: BirthInput;
  julianDayUT: number;
  localSiderealTime: number;
  planets: PlanetPosition[];
  weekday: PlanetId;
  sunrise: SunriseHeader | null;
}
