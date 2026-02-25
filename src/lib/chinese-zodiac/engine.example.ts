/**
 * Example usage of Chinese Zodiac Engine
 * 
 * This file demonstrates how to use the Chinese zodiac engine
 * to generate fortune readings.
 */

import { generateChineseZodiacReading } from './engine';
import { TimePeriod } from '../horoscope/types';

// Example 1: Generate daily fortune for someone born in 2024 (Dragon year)
async function exampleDailyReading() {
  const reading = await generateChineseZodiacReading({
    birthYear: 2024,
    period: TimePeriod.DAILY,
    date: new Date()
  });
  
  console.log('Daily Reading for Dragon (2024):');
  console.log('Animal:', reading.thaiName, reading.chineseName);
  console.log('Element:', reading.element);
  console.log('Overall Fortune:', reading.fortune.overall);
  console.log('Lucky Colors:', reading.luckyColors.join(', '));
  console.log('Lucky Numbers:', reading.luckyNumbers.join(', '));
  console.log('Lucky Directions:', reading.luckyDirections.join(', '));
}

// Example 2: Generate weekly fortune for someone born in 1990 (Horse year)
async function exampleWeeklyReading() {
  const reading = await generateChineseZodiacReading({
    birthYear: 1990,
    period: TimePeriod.WEEKLY,
    date: new Date()
  });
  
  console.log('\nWeekly Reading for Horse (1990):');
  console.log('Animal:', reading.thaiName, reading.chineseName);
  console.log('Career Fortune:', reading.fortune.career);
  console.log('Wealth Fortune:', reading.fortune.wealth);
}

// Example 3: Generate monthly fortune for someone born in 2000 (Dragon year)
async function exampleMonthlyReading() {
  const reading = await generateChineseZodiacReading({
    birthYear: 2000,
    period: TimePeriod.MONTHLY,
    date: new Date()
  });
  
  console.log('\nMonthly Reading for Dragon (2000):');
  console.log('Date Range:', reading.dateRange.start, 'to', reading.dateRange.end);
  console.log('Health Fortune:', reading.fortune.health);
  console.log('Relationships Fortune:', reading.fortune.relationships);
  console.log('Advice:', reading.advice);
}

// Run examples
if (require.main === module) {
  (async () => {
    await exampleDailyReading();
    await exampleWeeklyReading();
    await exampleMonthlyReading();
  })();
}
