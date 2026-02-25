export type ReadingVertical = "tarot" | "spirit-card" | "numerology";

export type ReadingBlockType =
  | "summary"
  | "insight"
  | "focus"
  | "action"
  | "warning"
  | "cta";

export interface InterpretationBlock {
  id: string;
  type: ReadingBlockType;
  title: string;
  body: string;
  emphasis?: "neutral" | "positive" | "caution";
  meta?: string;
}

export interface ReadingSession {
  sessionId: string;
  vertical: ReadingVertical;
  headline: string;
  summary: string;
  blocks: InterpretationBlock[];
  tags: string[];
}

export interface TarotReadingInput {
  kind: "tarot";
  cardsToken: string;
  count: number;
  question?: string;
}

export interface SpiritCardReadingInput {
  kind: "spirit-card";
  dob: string;
}

export interface NumerologyReadingInput {
  kind: "numerology";
  phone: string;
}

export type ReadingInput = TarotReadingInput | SpiritCardReadingInput | NumerologyReadingInput;

// New reading types for popular fortune features
export enum ReadingType {
  // Existing types
  TAROT = 'tarot',
  SPIRIT_CARD = 'spirit_card',
  NUMEROLOGY = 'numerology',
  DAILY_CARD = 'daily_card',
  // New types
  HOROSCOPE = 'horoscope',
  COMPATIBILITY = 'compatibility',
  CHINESE_ZODIAC = 'chinese_zodiac',
  SPECIALIZED = 'specialized',
  NAME_NUMEROLOGY = 'name_numerology'
}

// Extended reading request interface
export interface ReadingRequest {
  type: ReadingType;
  input: any; // Type-specific input
  userId?: string; // Optional user identifier
}

// Extended reading result interface
export interface ReadingResult {
  type: ReadingType;
  timestamp: Date;
  data: any; // Type-specific result
  creditCost: number;
  cached: boolean;
}
