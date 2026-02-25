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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dobIso)) {
    return null;
  }

  const digits = dobIso.replace(/-/g, "");
  const raw = sumDigits(digits);
  const lifePathNumber = reduceToLifePath(raw);

  const year = Number(dobIso.slice(0, 4));
  const month = Number(dobIso.slice(5, 7));
  const day = Number(dobIso.slice(8, 10));

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
