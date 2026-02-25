/**
 * Name Numerology Engine for REFFORTUNE
 * 
 * This module implements Thai name numerology calculations including:
 * - Name validation (Thai characters only)
 * - Score calculation with master number preservation (11, 22)
 * - First name, last name, full name, and destiny number calculations
 * 
 * Feature: popular-fortune-features
 * Requirements: 6.1, 6.2, 6.4, 6.5, 6.6, 6.7
 */

import { thaiCharToNumber } from './thai-mapping';
import { getBaselineInterpretation, generateLuckyNumbers } from './baseline';
import type { NameNumerologyInput, NameNumerologyReading } from './types';

/**
 * Validate that a name contains only Thai characters and spaces
 * 
 * Thai Unicode range: U+0E00 to U+0E7F
 * 
 * @param name - The name to validate
 * @returns True if the name contains only Thai characters and spaces
 * 
 * @example
 * ```typescript
 * isValidThaiName('สมชาย') // returns true
 * isValidThaiName('John') // returns false
 * isValidThaiName('สมชาย Smith') // returns false
 * isValidThaiName('สม ชาย') // returns true
 * ```
 */
export function isValidThaiName(name: string): boolean {
  // Check for empty or whitespace-only string
  if (!name || name.trim().length === 0) {
    return false;
  }
  
  // Thai Unicode range: U+0E00 to U+0E7F, plus spaces
  const thaiCharRegex = /^[\u0E00-\u0E7F\s]+$/;
  
  return thaiCharRegex.test(name);
}

/**
 * Calculate the numerological score for a name
 * 
 * Process:
 * 1. Convert each Thai character to its number value (1-9)
 * 2. Sum all the values
 * 3. Reduce to single digit by repeatedly summing digits
 * 4. Preserve master numbers 11 and 22 (do not reduce further)
 * 
 * @param name - The Thai name to calculate score for
 * @returns The numerological score (1-9, 11, or 22)
 * 
 * @example
 * ```typescript
 * calculateNameScore('สมชาย') // returns calculated score
 * calculateNameScore('นางสาว') // returns calculated score
 * ```
 */
export function calculateNameScore(name: string): number {
  // Remove spaces and calculate sum
  const cleanName = name.replace(/\s/g, '');
  
  // Sum all character values
  let sum = 0;
  for (const char of cleanName) {
    sum += thaiCharToNumber(char);
  }
  
  // Reduce to single digit, preserving master numbers 11 and 22
  return reduceToSingleDigit(sum);
}

/**
 * Reduce a number to a single digit (1-9)
 * Preserves master numbers 11 and 22
 * 
 * @param num - The number to reduce
 * @returns Single digit (1-9) or master number (11, 22)
 * 
 * @example
 * ```typescript
 * reduceToSingleDigit(38) // returns 2 (3+8=11, 1+1=2)
 * reduceToSingleDigit(29) // returns 11 (2+9=11, master number preserved)
 * reduceToSingleDigit(22) // returns 22 (master number preserved)
 * reduceToSingleDigit(47) // returns 11 (4+7=11, master number preserved)
 * ```
 */
function reduceToSingleDigit(num: number): number {
  // Keep reducing until we get a single digit or master number
  while (num > 9) {
    // Check for master numbers before reducing
    if (num === 11 || num === 22) {
      return num;
    }
    
    // Sum the digits
    let digitSum = 0;
    let temp = num;
    while (temp > 0) {
      digitSum += temp % 10;
      temp = Math.floor(temp / 10);
    }
    
    num = digitSum;
  }
  
  return num;
}

/**
 * Calculate all name scores for a Thai name pair
 * 
 * Calculates:
 * - firstName score: Numerological value of first name
 * - lastName score: Numerological value of last name
 * - fullName score: Numerological value of combined full name
 * - destiny score: Sum of firstName and lastName scores, reduced
 * 
 * @param firstName - Thai first name
 * @param lastName - Thai last name
 * @returns Object containing all four scores
 * 
 * @example
 * ```typescript
 * const scores = calculateAllNameScores('สมชาย', 'ใจดี');
 * // scores = {
 * //   firstName: 7,
 * //   lastName: 5,
 * //   fullName: 3,
 * //   destiny: 3
 * // }
 * ```
 */
export function calculateAllNameScores(
  firstName: string,
  lastName: string
): {
  firstName: number;
  lastName: number;
  fullName: number;
  destiny: number;
} {
  // Calculate individual scores
  const firstNameScore = calculateNameScore(firstName);
  const lastNameScore = calculateNameScore(lastName);
  
  // Calculate full name score (combined name)
  const fullName = `${firstName}${lastName}`;
  const fullNameScore = calculateNameScore(fullName);
  
  // Calculate destiny number (sum of first and last name scores)
  const destinyScore = reduceToSingleDigit(firstNameScore + lastNameScore);
  
  return {
    firstName: firstNameScore,
    lastName: lastNameScore,
    fullName: fullNameScore,
    destiny: destinyScore
  };
}

/**
 * Get baseline name numerology reading (deterministic)
 * 
 * Generates a complete name numerology reading using baseline interpretations
 * without AI enhancement. This provides consistent, deterministic results.
 * 
 * @param input - Name numerology input with first and last name
 * @returns Complete baseline reading with scores, interpretation, and lucky numbers
 * 
 * @example
 * ```typescript
 * const reading = getBaselineNameNumerology({
 *   firstName: 'สมชาย',
 *   lastName: 'ใจดี'
 * });
 * console.log(reading.scores.destiny); // Destiny number
 * console.log(reading.interpretation.personality); // Personality description
 * ```
 */
export function getBaselineNameNumerology(input: NameNumerologyInput): NameNumerologyReading {
  const { firstName, lastName } = input;
  
  // Validate names
  if (!isValidThaiName(firstName)) {
    throw new Error('ชื่อต้องเป็นตัวอักษรไทยเท่านั้น');
  }
  
  if (!isValidThaiName(lastName)) {
    throw new Error('นามสกุลต้องเป็นตัวอักษรไทยเท่านั้น');
  }
  
  // Calculate all scores
  const scores = calculateAllNameScores(firstName, lastName);
  
  // Get baseline interpretation for destiny number
  const baselineInterp = getBaselineInterpretation(scores.destiny);
  
  // Generate lucky numbers
  const luckyNumbers = generateLuckyNumbers(scores.destiny);
  
  // Create advice based on destiny number
  const advice = generateAdvice(scores.destiny);
  
  return {
    firstName,
    lastName,
    scores,
    interpretation: baselineInterp,
    luckyNumbers,
    advice
  };
}

/**
 * Calculate complete name numerology reading
 * 
 * This is the main function that generates a complete name numerology reading.
 * Currently returns baseline interpretation. In the future, this can be extended
 * to include AI enhancement.
 * 
 * @param input - Name numerology input with first and last name
 * @returns Promise resolving to complete reading
 * 
 * @example
 * ```typescript
 * const reading = await calculateNameNumerology({
 *   firstName: 'สมชาย',
 *   lastName: 'ใจดี'
 * });
 * ```
 */
export async function calculateNameNumerology(
  input: NameNumerologyInput
): Promise<NameNumerologyReading> {
  // For now, return baseline interpretation
  // In the future, this can be extended to call AI API for enhancement
  return getBaselineNameNumerology(input);
}

/**
 * Generate advice based on destiny number
 * 
 * @param destinyNumber - The destiny number
 * @returns Personalized advice string in Thai
 */
function generateAdvice(destinyNumber: number): string {
  const adviceMap: Record<number, string> = {
    1: 'ใช้ความเป็นผู้นำของคุณเพื่อสร้างสรรค์สิ่งใหม่ๆ แต่อย่าลืมรับฟังความคิดเห็นของผู้อื่นด้วย พัฒนาความอดทนและการทำงานเป็นทีม จะช่วยให้คุณประสบความสำเร็จมากขึ้น',
    2: 'ใช้ความเห็นอกเห็นใจและความสามารถในการฟังเพื่อสร้างความสัมพันธ์ที่ดี พัฒนาความมั่นใจในตัวเองและกล้าตัดสินใจ อย่ากลัวที่จะแสดงความคิดเห็นของคุณ',
    3: 'ใช้ความคิดสร้างสรรค์และความสามารถในการสื่อสารเพื่อสร้างแรงบันดาลใจให้ผู้อื่น พัฒนาความมีสมาธิและวินัย จะช่วยให้คุณบรรลุเป้าหมายได้ง่ายขึ้น',
    4: 'ใช้ความมุ่งมั่นและวินัยเพื่อสร้างรากฐานที่มั่นคง พัฒนาความยืดหยุ่นและเปิดใจรับความเปลี่ยนแปลง จะช่วยให้ชีวิตของคุณสมดุลมากขึ้น',
    5: 'ใช้ความรักอิสระและความยืดหยุ่นเพื่อสำรวจโลกและเรียนรู้สิ่งใหม่ๆ พัฒนาความรับผิดชอบและความมั่นคง จะช่วยให้คุณประสบความสำเร็จในระยะยาว',
    6: 'ใช้ความเห็นอกเห็นใจและความรับผิดชอบเพื่อดูแลผู้อื่น แต่อย่าลืมดูแลตัวเองด้วย เรียนรู้ที่จะตั้งขอบเขตและรับความรักจากผู้อื่น',
    7: 'ใช้ความฉลาดและสัญชาตญาณเพื่อค้นหาความจริง พัฒนาทักษะทางสังคมและเปิดใจแสดงความรู้สึก จะช่วยให้ความสัมพันธ์ของคุณดีขึ้น',
    8: 'ใช้ความสามารถในการจัดการและวิสัยทัศน์เพื่อสร้างความสำเร็จ พัฒนาความสมดุลระหว่างงานและชีวิตส่วนตัว อย่าลืมให้เวลากับคนที่คุณรัก',
    9: 'ใช้ความเห็นอกเห็นใจและความคิดสร้างสรรค์เพื่อช่วยเหลือผู้อื่น พัฒนาการดูแลตัวเองและตั้งขอบเขต จะช่วยให้คุณมีพลังในการช่วยเหลือผู้อื่นได้มากขึ้น',
    11: 'ใช้สัญชาตญาณและวิสัยทัศน์เพื่อสร้างแรงบันดาลใจให้ผู้อื่น พัฒนาการจัดการความเครียดและหาความสมดุล จะช่วยให้คุณใช้พลังของคุณได้อย่างเต็มที่',
    22: 'ใช้วิสัยทัศน์และความสามารถในการจัดการเพื่อสร้างสรรค์สิ่งยิ่งใหญ่ พัฒนาการพักผ่อนและดูแลสุขภาพ จะช่วยให้คุณมีพลังในการบรรลุเป้าหมายที่ยิ่งใหญ่'
  };
  
  return adviceMap[destinyNumber] || adviceMap[1];
}
