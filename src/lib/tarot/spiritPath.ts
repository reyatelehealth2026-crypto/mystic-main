import { getCardById } from "./deck";

export type MajorId = `maj${string}`;

export interface SpiritPathInput {
  day: number;
  month: number;
  year: number; // CE
}

export interface SpiritPathResult {
  input: SpiritPathInput;
  zodiacCardId: string;
  soulCardId: string;
}

export function isValidGregorianDate(day: number, month: number, year: number): boolean {
  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) return false;
  if (year < 1 || year > 9999) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}

function mmdd(month: number, day: number): number {
  return month * 100 + day;
}

// Zodiac sign -> Major Arcana mapping (per provided HTML)
export function zodiacCardIdFromDate(day: number, month: number): string | null {
  const x = mmdd(month, day);

  // Aquarius 1/20-2/18
  if (x >= mmdd(1, 20) && x <= mmdd(2, 18)) return "maj17";
  // Pisces 2/19-3/20
  if (x >= mmdd(2, 19) && x <= mmdd(3, 20)) return "maj18";
  // Aries 3/21-4/19
  if (x >= mmdd(3, 21) && x <= mmdd(4, 19)) return "maj04";
  // Taurus 4/20-5/20
  if (x >= mmdd(4, 20) && x <= mmdd(5, 20)) return "maj05";
  // Gemini 5/21-6/20
  if (x >= mmdd(5, 21) && x <= mmdd(6, 20)) return "maj06";
  // Cancer 6/21-7/22
  if (x >= mmdd(6, 21) && x <= mmdd(7, 22)) return "maj07";
  // Leo 7/23-8/22
  if (x >= mmdd(7, 23) && x <= mmdd(8, 22)) return "maj08";
  // Virgo 8/23-9/22
  if (x >= mmdd(8, 23) && x <= mmdd(9, 22)) return "maj09";
  // Libra 9/23-10/22
  if (x >= mmdd(9, 23) && x <= mmdd(10, 22)) return "maj11";
  // Scorpio 10/23-11/21
  if (x >= mmdd(10, 23) && x <= mmdd(11, 21)) return "maj13";
  // Sagittarius 11/22-12/21
  if (x >= mmdd(11, 22) && x <= mmdd(12, 21)) return "maj14";
  // Capricorn 12/22-1/19 (wrap)
  if (x >= mmdd(12, 22) || x <= mmdd(1, 19)) return "maj15";

  return null;
}

export function reduceTo1to9(n: number): number {
  let x = Math.abs(Math.trunc(n));
  while (x > 9) {
    x = String(x)
      .split("")
      .reduce((sum, ch) => sum + Number(ch), 0);
  }
  if (x === 0) x = 9; // defensive (shouldn't happen for positive sums)
  return x;
}

export function soulCardIdFromDateParts(day: number, month: number, year: number): string {
  const sum = day + month + year;
  const reduced = reduceTo1to9(sum);
  return `maj0${reduced}`; // 1..9 => maj01..maj09
}

export function spiritPathFromDateParts(input: SpiritPathInput): SpiritPathResult | null {
  const { day, month, year } = input;
  if (!isValidGregorianDate(day, month, year)) return null;

  const zodiacCardId = zodiacCardIdFromDate(day, month);
  if (!zodiacCardId) return null;

  const soulCardId = soulCardIdFromDateParts(day, month, year);

  // Ensure cards exist in deck
  if (!getCardById(zodiacCardId) || !getCardById(soulCardId)) return null;

  return { input, zodiacCardId, soulCardId };
}
