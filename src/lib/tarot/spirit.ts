import { getCardById, TAROT_DECK } from "./deck";
import { Orientation, TarotCard } from "./types";

export interface SpiritCardResult {
  card: TarotCard;
  orientation: Orientation;
  lifePathNumber: number;
  seed: number;
}

function sumDigits(input: string): number {
  return input
    .split("")
    .map((char) => Number(char))
    .reduce((sum, value) => sum + value, 0);
}

function reduceToLifePath(value: number): number {
  let current = value;
  while (current > 9 && current !== 11 && current !== 22 && current !== 33) {
    current = sumDigits(String(current));
  }
  return current;
}

export function spiritCardFromDob(dobIso: string): SpiritCardResult | null {
  // Pattern alone (`\d{4}-\d{2}-\d{2}`) accepts impossible dates like
  // `9999-99-99` or `2025-02-30`. Round-trip through Date and confirm the
  // parts agree to reject those.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dobIso)) {
    return null;
  }

  const year = Number(dobIso.slice(0, 4));
  const month = Number(dobIso.slice(5, 7));
  const day = Number(dobIso.slice(8, 10));

  if (year < 1900) return null;
  // Use UTC constructor + getUTC*() to avoid Date's silent month overflow
  // surviving a local-time round-trip across DST boundaries.
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    Number.isNaN(probe.getTime()) ||
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }
  // Reject dates in the future (caller's clock — sanity guard, not strict).
  const today = new Date();
  if (probe.getTime() > today.getTime()) return null;

  const digits = dobIso.replace(/-/g, "");
  const raw = sumDigits(digits);
  const lifePathNumber = reduceToLifePath(raw);

  const seed = year * 10000 + month * 100 + day + lifePathNumber * 37;
  const cardIndex = Math.abs(seed) % TAROT_DECK.length;
  const card = TAROT_DECK[cardIndex] ?? getCardById("maj00");

  if (!card) {
    return null;
  }

  const orientation: Orientation = "upright"; // Always upright (no reversed cards)

  return {
    card,
    orientation,
    lifePathNumber,
    seed,
  };
}
