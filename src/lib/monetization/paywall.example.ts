/**
 * Example usage of paywall integration for new fortune features
 * 
 * This file demonstrates how to integrate the paywall system
 * with new reading features to handle credit checks and deductions.
 */

import { checkCredits, deductCredits } from './paywall';
import { ReadingType } from '@/lib/reading/types';
import { processReading } from '@/lib/reading/pipeline';

/**
 * Example 1: Check credits before generating a reading
 */
async function generateHoroscopeWithPaywall(zodiacSign: string, period: 'daily' | 'weekly' | 'monthly') {
  // Step 1: Check if user has credits or free reading available
  const creditCheck = checkCredits(ReadingType.HOROSCOPE, { period });
  
  if (!creditCheck.hasCredits) {
    // User doesn't have enough credits - show purchase prompt
    return {
      success: false,
      error: 'insufficient_credits',
      message: `ต้องการ ${creditCheck.requiredCredits} เครดิต แต่คุณมี ${creditCheck.currentCredits} เครดิต`,
      requiredCredits: creditCheck.requiredCredits,
      currentCredits: creditCheck.currentCredits
    };
  }
  
  // Step 2: Generate the reading
  const reading = await processReading({
    type: ReadingType.HOROSCOPE,
    input: { zodiacSign, period, date: new Date() }
  });
  
  // Step 3: Deduct credits (or mark free reading as used)
  const deducted = deductCredits(ReadingType.HOROSCOPE, { period });
  
  if (!deducted) {
    // This shouldn't happen if checkCredits passed, but handle it
    return {
      success: false,
      error: 'deduction_failed',
      message: 'ไม่สามารถหักเครดิตได้'
    };
  }
  
  // Step 4: Return the reading
  return {
    success: true,
    reading,
    isFreeReading: creditCheck.isFreeReading,
    creditsDeducted: creditCheck.isFreeReading ? 0 : creditCheck.requiredCredits
  };
}

/**
 * Example 2: Simple credit check for UI display
 */
function canUserAccessReading(readingType: ReadingType, options?: any): boolean {
  const creditCheck = checkCredits(readingType, options);
  return creditCheck.hasCredits;
}

/**
 * Example 3: Get credit cost for display in UI
 */
function displayCreditCost(readingType: ReadingType, options?: any): string {
  const creditCheck = checkCredits(readingType, options);
  
  if (creditCheck.isFreeReading) {
    return 'ฟรี (ครั้งแรก)';
  }
  
  return `${creditCheck.requiredCredits} เครดิต`;
}

/**
 * Example 4: Handle all new reading types
 */
async function generateAnyReading(
  readingType: ReadingType,
  input: any,
  options?: any
) {
  // Check credits
  const creditCheck = checkCredits(readingType, options);
  
  if (!creditCheck.hasCredits) {
    throw new Error(`Insufficient credits: need ${creditCheck.requiredCredits}, have ${creditCheck.currentCredits}`);
  }
  
  // Generate reading
  const reading = await processReading({
    type: readingType,
    input
  });
  
  // Deduct credits
  deductCredits(readingType, options);
  
  return reading;
}

/**
 * Example 5: Check multiple reading types for a feature selection page
 */
function getAvailableReadings() {
  return [
    {
      type: ReadingType.HOROSCOPE,
      name: 'ดูดวงรายวัน',
      available: canUserAccessReading(ReadingType.HOROSCOPE, { period: 'daily' }),
      cost: displayCreditCost(ReadingType.HOROSCOPE, { period: 'daily' })
    },
    {
      type: ReadingType.COMPATIBILITY,
      name: 'ดูดวงความรัก',
      available: canUserAccessReading(ReadingType.COMPATIBILITY),
      cost: displayCreditCost(ReadingType.COMPATIBILITY)
    },
    {
      type: ReadingType.CHINESE_ZODIAC,
      name: 'ดูดวงจีน',
      available: canUserAccessReading(ReadingType.CHINESE_ZODIAC),
      cost: displayCreditCost(ReadingType.CHINESE_ZODIAC)
    },
    {
      type: ReadingType.NAME_NUMEROLOGY,
      name: 'เลขศาสตร์ชื่อ',
      available: canUserAccessReading(ReadingType.NAME_NUMEROLOGY),
      cost: displayCreditCost(ReadingType.NAME_NUMEROLOGY)
    }
  ];
}

// Export examples for reference
export {
  generateHoroscopeWithPaywall,
  canUserAccessReading,
  displayCreditCost,
  generateAnyReading,
  getAvailableReadings
};
