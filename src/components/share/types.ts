export interface BaseShareableData {
  date: string;
  brand?: string;
  vertical: "tarot" | "spirit" | "numerology" | "daily" | "horoscope" | "compatibility" | "chinese-zodiac";
}

export interface TarotShareData extends BaseShareableData {
  vertical: "tarot";
  cards: Array<{
    name: string;
    nameTh?: string;
    image?: string;
    orientation: "upright" | "reversed";
    meaning: string;
    position?: string;
  }>;
  reading: string;
  question?: string;
  spreadType: string;
}

export interface SpiritShareData extends BaseShareableData {
  vertical: "spirit";
  cardName: string;
  cardNameTh?: string;
  cardImage?: string;
  birthDate: string;
  lifePath: string;
  meaning: string;
  guidance: string;
}

export interface NumerologyShareData extends BaseShareableData {
  vertical: "numerology";
  input: string;
  inputType: "phone" | "name";
  result: string;
  luckyNumbers: number[];
  analysis: string;
}

export interface DailyCardShareData extends BaseShareableData {
  vertical: "daily";
  cardName: string;
  cardNameTh?: string;
  cardImage?: string;
  meaning: string;
  advice: string;
  dayOfWeek: string;
}

export interface HoroscopeShareData extends BaseShareableData {
  vertical: "horoscope";
  zodiac: string;
  zodiacTh: string;
  element: string;
  prediction: string;
  lucky: {
    numbers: number[];
    color: string;
    direction: string;
  };
}

export interface CompatibilityShareData extends BaseShareableData {
  vertical: "compatibility";
  sign1: { name: string; nameTh: string; element: string };
  sign2: { name: string; nameTh: string; element: string };
  score: number;
  result: string;
  advice: string;
}

export interface ChineseZodiacShareData extends BaseShareableData {
  vertical: "chinese-zodiac";
  animal: string;
  animalTh: string;
  element: string;
  year: number;
  prediction: string;
  lucky: {
    numbers: number[];
    color: string;
  };
}

export type ShareableData =
  | TarotShareData
  | SpiritShareData
  | NumerologyShareData
  | DailyCardShareData
  | HoroscopeShareData
  | CompatibilityShareData
  | ChineseZodiacShareData;
