/**
 * Example usage of buildTarotPrompt
 * 
 * This file demonstrates how to use the tarot prompt builder
 * and can be used for manual testing/verification.
 */

import { buildTarotPrompt } from './tarot';
import type { TarotPromptParams } from '../types';
import type { DrawnCard } from '@/lib/tarot/types';

// Example 1: Single card reading
const singleCardExample: TarotPromptParams = {
  cards: [
    {
      card: {
        id: 'the-fool',
        name: 'The Fool',
        arcana: 'major',
        number: 0,
        keywordsUpright: ['new beginnings', 'innocence', 'adventure'],
        keywordsReversed: ['recklessness', 'fear'],
        meaningUpright: 'New beginnings and adventures',
        meaningReversed: 'Recklessness or fear of change',
      },
      orientation: 'upright',
    },
  ],
  count: 1,
  question: 'What should I focus on today?',
  spreadType: 1,
};

// Example 2: Three card reading with reversed card
const threeCardExample: TarotPromptParams = {
  cards: [
    {
      card: {
        id: 'the-sun',
        name: 'The Sun',
        arcana: 'major',
        number: 19,
        keywordsUpright: ['success', 'joy', 'positivity'],
        keywordsReversed: ['temporary setback', 'pessimism'],
        meaningUpright: 'Success and happiness',
        meaningReversed: 'Temporary clouds over success',
      },
      orientation: 'upright',
    },
    {
      card: {
        id: 'two-of-pentacles',
        name: 'Two of Pentacles',
        arcana: 'minor',
        suit: 'pentacles',
        number: 2,
        keywordsUpright: ['balance', 'flexibility', 'juggling'],
        keywordsReversed: ['imbalance', 'overwhelm'],
        meaningUpright: 'Managing multiple priorities',
        meaningReversed: 'Struggling with balance',
      },
      orientation: 'reversed',
    },
    {
      card: {
        id: 'ace-of-wands',
        name: 'Ace of Wands',
        arcana: 'minor',
        suit: 'wands',
        number: 1,
        keywordsUpright: ['inspiration', 'new opportunities'],
        keywordsReversed: ['delays', 'lack of direction'],
        meaningUpright: 'New creative opportunities',
        meaningReversed: 'Delays in new projects',
      },
      orientation: 'upright',
    },
  ],
  count: 3,
  question: 'Should I change careers?',
  spreadType: 3,
};

// Example 3: Ten card Celtic Cross
const celticCrossExample: TarotPromptParams = {
  cards: Array(10).fill(null).map((_, i) => ({
    card: {
      id: `card-${i}`,
      name: `Card ${i + 1}`,
      arcana: i < 3 ? 'major' : 'minor',
      suit: 'wands',
      number: i,
      keywordsUpright: ['keyword'],
      keywordsReversed: ['reversed'],
      meaningUpright: 'Upright meaning',
      meaningReversed: 'Reversed meaning',
    },
    orientation: (i % 3 === 0 ? 'reversed' : 'upright') as 'upright' | 'reversed',
  })),
  count: 10,
  question: 'What does the future hold for my business?',
  spreadType: 10,
};

/**
 * Run examples and log the prompts
 * Uncomment to test manually
 */
export function runExamples() {
  console.log('=== SINGLE CARD EXAMPLE ===');
  console.log(buildTarotPrompt(singleCardExample));
  console.log('\n\n');

  console.log('=== THREE CARD EXAMPLE ===');
  console.log(buildTarotPrompt(threeCardExample));
  console.log('\n\n');

  console.log('=== CELTIC CROSS EXAMPLE ===');
  console.log(buildTarotPrompt(celticCrossExample));
}

// Uncomment to run:
// runExamples();
