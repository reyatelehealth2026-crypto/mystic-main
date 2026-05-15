import { ThaiZodiacSign, ThaiDay, ThaiYearAnimal, ThaiElement } from "@/lib/thai-astrology/types";

export { ThaiZodiacSign, ThaiDay, ThaiYearAnimal, ThaiElement };

export enum ThaiPlanet {
  ATHIT = "athit",       // ๑ อาทิตย์ (Sun)
  CHAN = "chan",         // ๒ จันทร์ (Moon)
  ANGKAN = "angkan",     // ๓ อังคาร (Mars)
  PHUT = "phut",         // ๔ พุธ (Mercury)
  PHAHAT = "phahat",     // ๕ พฤหัสบดี (Jupiter)
  SUK = "suk",           // ๖ ศุกร์ (Venus)
  SAO = "sao",           // ๗ เสาร์ (Saturn)
}

export interface BirthChartInput {
  birthDate: Date;
  birthTime?: { hour: number; minute: number };
  province?: string;
}

export interface HousePlacement {
  house: number;
  sign: ThaiZodiacSign;
  ruler: ThaiPlanet;
  meaning: string;
}

export interface BirthChart {
  input: {
    birthDate: Date;
    birthTime?: { hour: number; minute: number };
    timeKnown: boolean;
    province: string;
    lat: number;
    lng: number;
  };
  ascendant?: ThaiZodiacSign;
  sunSign: ThaiZodiacSign;
  day: ThaiDay;
  dayPlanet: ThaiPlanet;
  yearAnimal: ThaiYearAnimal;
  element: ThaiElement;
  houses?: HousePlacement[];
}

export interface InterpretationSection {
  title: string;
  paragraphs: string[];
}

export interface BirthChartReading {
  chart: BirthChart;
  sections: InterpretationSection[];
  disclaimer: string;
}
