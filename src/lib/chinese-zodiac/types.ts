// Chinese Zodiac Types for REFFORTUNE
// Feature: popular-fortune-features

import { TimePeriod } from '../horoscope/types';

/**
 * Chinese zodiac animals
 */
export enum ChineseZodiacAnimal {
  RAT = 'rat',
  OX = 'ox',
  TIGER = 'tiger',
  RABBIT = 'rabbit',
  DRAGON = 'dragon',
  SNAKE = 'snake',
  HORSE = 'horse',
  GOAT = 'goat',
  MONKEY = 'monkey',
  ROOSTER = 'rooster',
  DOG = 'dog',
  PIG = 'pig'
}

/**
 * Chinese five elements
 */
export enum ChineseElement {
  WOOD = 'wood',
  FIRE = 'fire',
  EARTH = 'earth',
  METAL = 'metal',
  WATER = 'water'
}

/**
 * Input for Chinese zodiac reading
 */
export interface ChineseZodiacInput {
  birthYear: number;
  period: TimePeriod; // DAILY, WEEKLY, MONTHLY, or year
  date: Date;
}

/**
 * Complete Chinese zodiac reading result
 */
export interface ChineseZodiacReading {
  animal: ChineseZodiacAnimal;
  element: ChineseElement;
  thaiName: string;
  chineseName: string;
  period: TimePeriod;
  dateRange: { start: Date; end: Date };
  fortune: {
    overall: string;
    career: string;
    wealth: string;
    health: string;
    relationships: string;
  };
  luckyColors: string[];
  luckyNumbers: number[];
  luckyDirections: string[];
  advice: string;
}
