// Name Numerology Types for REFFORTUNE
// Feature: popular-fortune-features

/**
 * Input for name numerology analysis
 */
export interface NameNumerologyInput {
  firstName: string; // Thai characters
  lastName: string; // Thai characters
}

/**
 * Complete name numerology reading result
 */
export interface NameNumerologyReading {
  firstName: string;
  lastName: string;
  scores: {
    firstName: number; // 1-9
    lastName: number; // 1-9
    fullName: number; // 1-9
    destiny: number; // 1-9
  };
  interpretation: {
    personality: string;
    strengths: string[];
    weaknesses: string[];
    lifePath: string;
    career: string;
    relationships: string;
  };
  luckyNumbers: number[];
  advice: string;
}
