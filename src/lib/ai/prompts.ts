/**
 * Main Prompt Builder Interface
 * 
 * This module serves as the central entry point for all AI prompt building functionality.
 * It exports convenience functions for building prompts for each divination type:
 * - Tarot readings (1, 3, 10-card spreads)
 * - Spirit card readings (birth date-based)
 * - Numerology readings (phone number analysis)
 * - Chat conversations (follow-up questions)
 * 
 * Usage:
 * ```typescript
 * import { buildTarotPrompt, buildSpiritPrompt } from '@/lib/ai/prompts';
 * 
 * const tarotPrompt = buildTarotPrompt({
 *   cards: drawnCards,
 *   count: 3,
 *   question: 'What should I focus on?',
 *   spreadType: 3
 * });
 * ```
 */

// Re-export all prompt builder functions
export { buildTarotPrompt } from './templates/tarot';
export { buildDailyCardPrompt } from './templates/daily-card';
export { buildSpiritPrompt } from './templates/spirit';
export { buildSpiritPathPrompt } from './templates/spiritPath';
export { buildNumerologyPrompt } from './templates/numerology';
export { buildChatPrompt } from './templates/chat';
export { buildLuckyNumbersPrompt } from './templates/lucky-numbers';

// Re-export the base PromptBuilder class for advanced usage
export { PromptBuilder, buildBasePrompt } from './templates/base';

// Re-export types for convenience
export type {
  TarotPromptParams,
  SpiritPromptParams,
  NumerologyPromptParams,
  ChatPromptParams,
  PromptSection,
  FewShotExample,
  DivinationType,
} from './types';
