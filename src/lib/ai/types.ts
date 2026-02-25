/**
 * Core types for the enhanced AI prompt engineering system
 */

import type { DrawnCard, TarotCard, Orientation } from '@/lib/tarot/types';

/**
 * Represents a section of a prompt template
 */
export interface PromptSection {
  role?: string;
  culturalContext?: string;
  fewShotExamples?: string;
  instructions: string;
  userData: string;
}

/**
 * Interface for prompt template builders
 */
export interface PromptTemplate {
  build(params: Record<string, unknown>): string;
  validate(params: Record<string, unknown>): boolean;
}

/**
 * Represents a few-shot learning example
 */
export interface FewShotExample {
  scenario: string;
  input: string;
  output: string;
  notes?: string;
}

/**
 * Result of validation operations
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Divination type identifier
 */
export type DivinationType = 'tarot' | 'spirit' | 'numerology' | 'chat';

/**
 * Parameters for building tarot reading prompts
 */
export interface TarotPromptParams {
  cards: DrawnCard[];
  count: number;
  question?: string;
  spreadType: 1 | 2 | 3 | 4 | 5 | 6 | 10;
}

/**
 * Parameters for building spirit card prompts
 */
export interface SpiritPromptParams {
  card: TarotCard;
  orientation: Orientation;
  lifePathNumber: number;
  dob: string;
}

/**
 * Parameters for building numerology prompts
 */
export interface NumerologyPromptParams {
  normalizedPhone: string;
  score: number;
  tier: string;
  total: number;
  root: number;
  themes: {
    work: string;
    money: string;
    relationship: string;
    caution: string;
  };
}

export interface DailyCardPromptParams {
  card: TarotCard;
  orientation: Orientation;
  dayKey: string;
}

/**
 * Represents a single turn in a chat conversation
 */
export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Parameters for building chat prompts
 */
export interface ChatPromptParams {
  cards: DrawnCard[];
  baseQuestion?: string;
  followUpQuestion: string;
  history: ChatTurn[];
}

/**
 * AI response structure from Gemini API
 */
export interface AIResponse {
  summary: string;
  cardStructure: string;
}

/**
 * Thai cultural context structure
 */
export interface ThaiCulturalContext {
  buddhism: {
    karma: string;
    merit: string;
    mindfulness: string;
    middlePath: string;
  };
  astrology: {
    destiny: string;
    timing: string;
    elements: string;
  };
  numerology: {
    auspicious: string[];
    meanings: Record<number, string>;
  };
  guidance: {
    tone: string;
    structure: string;
  };
}

/**
 * Set of few-shot examples covering different scenarios
 */
export interface ExampleSet {
  positive: FewShotExample;
  challenging: FewShotExample;
  neutral?: FewShotExample;
}

/**
 * Error log entry for monitoring
 */
export interface ErrorLog {
  timestamp: Date;
  errorType: 'template' | 'validation' | 'api';
  divinationType: DivinationType;
  errorMessage: string;
  context: Record<string, unknown>;
}
