/**
 * Thai natal chart (จักรราศีวิภาค) — shared types.
 *
 * Supports two longitude systems for the same chart input:
 *   - "suriyayatra"  — โหราศาสตร์ไทย สุริยยาตร์
 *   - "lahiri"       — นิรายนะวิธี (Chitrapaksha / Lahiri ayanamsa)
 *
 * Longitudes are stored in fractional sidereal degrees in [0, 360).
 * A separate `ZodiacPosition` carries the human-readable
 * ราศี / องศา / ลิปดา breakdown used by the UI.
 */

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

export interface PlanetPosition {
  id: PlanetId;
  thaiName: string;
  thaiNumeral: string;
  longitude: number;
  zodiac: ZodiacPosition;
  nakshatra: NakshatraPosition;
  retrograde: boolean;
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

export interface NatalChart {
  system: ChartSystem;
  ayanamsa: number;
  input: BirthInput;
  julianDayUT: number;
  localSiderealTime: number;
  planets: PlanetPosition[];
}
