import { TarotCard, Suit } from "./types";
import { FORTUNE_DECK } from "./fortuneDeck";

const suitByPrefix: Record<string, Suit> = {
  wan: "wands",
  cup: "cups",
  swo: "swords",
  pen: "pentacles",
};

const courtNumber: Record<string, number> = {
  p: 11,
  k: 12,
  q: 13,
  K: 14,
};

function inferSuit(id: string): Suit | undefined {
  return suitByPrefix[id.slice(0, 3)];
}

function inferNumber(id: string): number {
  if (id.startsWith("maj")) {
    return Number(id.slice(3)) || 0;
  }

  const tail = id.slice(3);
  if (tail in courtNumber) {
    return courtNumber[tail as keyof typeof courtNumber];
  }

  const n = Number(tail);
  return Number.isFinite(n) ? n : 0;
}

function baseKeywords(cardId: string): string[] {
  const suit = inferSuit(cardId);
  if (suit === "wands") return ["พลังงาน", "การลงมือทำ", "ความกล้า"];
  if (suit === "cups") return ["ความสัมพันธ์", "อารมณ์", "หัวใจ"];
  if (suit === "swords") return ["ความคิด", "การตัดสินใจ", "ความชัดเจน"];
  if (suit === "pentacles") return ["งาน", "การเงิน", "ความมั่นคง"];
  return ["จังหวะชีวิต", "โอกาส", "การเติบโต"];
}

export const TAROT_DECK: TarotCard[] = FORTUNE_DECK.map((entry) => {
  const keywords = baseKeywords(entry.id);
  const suit = inferSuit(entry.id);

  // Use the original image path from the synced fortune deck
  // and normalize it to a public URL (always leading with "/").
  const rawImagePath = entry.img ?? "";
  const imagePath = rawImagePath.startsWith("/")
    ? rawImagePath
    : `/${rawImagePath}`;

  return {
    id: entry.id,
    name: entry.name,
    arcana: entry.id.startsWith("maj") ? "major" : "minor",
    suit,
    number: inferNumber(entry.id),
    keywordsUpright: keywords,
    keywordsReversed: ["ทบทวน", "ชะลอ", ...keywords],
    meaningUpright: entry.dailyAdvice,
    meaningReversed: `มุมเงา: ${entry.dailyAdvice}`,
    image: imagePath,
    source: "fortune",
  };
});

export const TAROT_DECK_BY_ID = new Map(TAROT_DECK.map((card) => [card.id, card]));

export function getCardById(cardId: string): TarotCard | null {
  return TAROT_DECK_BY_ID.get(cardId) ?? null;
}
