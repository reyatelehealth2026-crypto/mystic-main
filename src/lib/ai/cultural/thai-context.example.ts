/**
 * Example usage of Thai cultural context module
 * This file demonstrates how to use the cultural context functions
 */

import {
  getContextForDivinationType,
  getCulturalElement,
  THAI_DIVINATION_CONTEXT,
} from './thai-context';

// Example 1: Get context for tarot reading
console.log('=== Tarot Reading Context ===');
const tarotContext = getContextForDivinationType('tarot');
console.log(tarotContext);
console.log('\n');

// Example 2: Get context for spirit card reading
console.log('=== Spirit Card Reading Context ===');
const spiritContext = getContextForDivinationType('spirit');
console.log(spiritContext);
console.log('\n');

// Example 3: Get context for numerology reading
console.log('=== Numerology Reading Context ===');
const numerologyContext = getContextForDivinationType('numerology');
console.log(numerologyContext);
console.log('\n');

// Example 4: Get context for chat mode
console.log('=== Chat Mode Context ===');
const chatContext = getContextForDivinationType('chat');
console.log(chatContext);
console.log('\n');

// Example 5: Get specific cultural elements
console.log('=== Buddhist Philosophy Only ===');
const philosophy = getCulturalElement('philosophy');
console.log(philosophy);
console.log('\n');

console.log('=== Numerology Beliefs Only ===');
const numerologyBeliefs = getCulturalElement('numerology');
console.log(numerologyBeliefs);
console.log('\n');

// Example 6: Access the complete context object
console.log('=== Complete Context Object ===');
console.log('Available keys:', Object.keys(THAI_DIVINATION_CONTEXT));
console.log('Philosophy length:', THAI_DIVINATION_CONTEXT.philosophy.length);
console.log('Astrology length:', THAI_DIVINATION_CONTEXT.astrology.length);
console.log('Numerology length:', THAI_DIVINATION_CONTEXT.numerology.length);
console.log('Guidance length:', THAI_DIVINATION_CONTEXT.guidance.length);
