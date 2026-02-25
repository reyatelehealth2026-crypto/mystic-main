// Example usage of baseline horoscope generation
// This file demonstrates how to use the baseline horoscope module

import { getBaselineHoroscope } from './baseline';
import { ZodiacSign } from './types';

// Example 1: Generate baseline horoscope for Aries on a specific date
const ariesHoroscope = getBaselineHoroscope(ZodiacSign.ARIES, new Date('2024-01-15'));
console.log('Aries Horoscope for 2024-01-15:');
console.log('Love:', ariesHoroscope.love);
console.log('Career:', ariesHoroscope.career);
console.log('Finance:', ariesHoroscope.finance);
console.log('Health:', ariesHoroscope.health);
console.log('Advice:', ariesHoroscope.advice);
console.log('Lucky Numbers:', ariesHoroscope.luckyNumbers);
console.log('Lucky Colors:', ariesHoroscope.luckyColors);
console.log('');

// Example 2: Demonstrate deterministic behavior (same input = same output)
const horoscope1 = getBaselineHoroscope(ZodiacSign.LEO, new Date('2024-02-01'));
const horoscope2 = getBaselineHoroscope(ZodiacSign.LEO, new Date('2024-02-01'));
console.log('Deterministic test (same date):');
console.log('Same love content?', horoscope1.love === horoscope2.love);
console.log('Same lucky numbers?', JSON.stringify(horoscope1.luckyNumbers) === JSON.stringify(horoscope2.luckyNumbers));
console.log('');

// Example 3: Different dates produce different content
const horoscope3 = getBaselineHoroscope(ZodiacSign.LEO, new Date('2024-02-02'));
console.log('Different date test:');
console.log('Different content?', horoscope1.love !== horoscope3.love || horoscope1.career !== horoscope3.career);
console.log('');

// Example 4: Generate horoscopes for all zodiac signs
console.log('All zodiac signs on 2024-03-01:');
Object.values(ZodiacSign).forEach(sign => {
  const horoscope = getBaselineHoroscope(sign, new Date('2024-03-01'));
  console.log(`${sign}: Lucky numbers ${horoscope.luckyNumbers.join(', ')}, Colors: ${horoscope.luckyColors.join(', ')}`);
});
