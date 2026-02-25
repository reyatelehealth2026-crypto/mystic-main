export type ArcanaType = "major" | "minor";
export type Suit = "wands" | "cups" | "swords" | "pentacles";
export type Orientation = "upright" | "reversed";

export interface TarotCard {
  id: string;
  name: string;
  nameTh?: string;
  arcana: ArcanaType;
  suit?: Suit;
  number: number;
  keywordsUpright: string[];
  keywordsReversed: string[];
  meaningUpright: string;
  meaningReversed: string;
  image?: string;
  source?: "fortune" | "mysticflow";
}

export interface DrawnCard {
  card: TarotCard;
  orientation: Orientation;
}
