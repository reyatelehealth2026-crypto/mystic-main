// Compatibility Types for REFFORTUNE
// Feature: popular-fortune-features

import { ZodiacSign } from '../horoscope/types';

/**
 * Input for compatibility analysis
 */
export interface CompatibilityInput {
  person1: {
    birthDate: Date;
    zodiacSign?: ZodiacSign; // Auto-calculated if not provided
  };
  person2: {
    birthDate: Date;
    zodiacSign?: ZodiacSign;
  };
}

/**
 * Complete compatibility reading result
 */
export interface CompatibilityReading {
  person1: {
    birthDate: Date;
    zodiacSign: ZodiacSign;
  };
  person2: {
    birthDate: Date;
    zodiacSign: ZodiacSign;
  };
  overallScore: number; // 0-100
  scores: {
    overall: number;
    communication: number;
    emotional: number;
    longTerm: number;
  };
  strengths: string[];
  challenges: string[];
  advice: string;
  elementCompatibility: string; // e.g., "Fire + Air = Harmonious"
}
