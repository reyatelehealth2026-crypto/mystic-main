/**
 * Input Validation Functions for REFFORTUNE
 * 
 * Provides validation for all input types used in fortune features:
 * - Zodiac signs
 * - Birth dates
 * - Thai names
 * - Years
 * - Time periods
 * - Domains
 * 
 * Feature: popular-fortune-features
 * Requirements: 6.6, 6.7, 10.6
 */

import { ZodiacSign, TimePeriod } from '@/lib/horoscope/types';
import { ReadingDomain } from '@/lib/horoscope/specialized';
import {
  ValidationResult,
  createValidationError,
  success,
  failure
} from './errors';

/**
 * Validate zodiac sign selection
 * 
 * @param sign - The zodiac sign to validate
 * @returns Validation result with ZodiacSign or error
 * 
 * @example
 * ```typescript
 * const result = validateZodiacSign('aries');
 * if (result.success) {
 *   console.log(result.value); // ZodiacSign.ARIES
 * }
 * ```
 */
export function validateZodiacSign(sign: string | null | undefined): ValidationResult<ZodiacSign> {
  if (!sign) {
    return failure(createValidationError('EMPTY_ZODIAC_SIGN', 'zodiacSign'));
  }
  
  if (!Object.values(ZodiacSign).includes(sign as ZodiacSign)) {
    return failure(createValidationError('INVALID_ZODIAC_SIGN', 'zodiacSign'));
  }
  
  return success(sign as ZodiacSign);
}

/**
 * Validate birth date
 * 
 * Checks:
 * - Date is valid
 * - Date is not in the future
 * - Date is not before 1900
 * 
 * @param date - The date to validate
 * @returns Validation result with Date or error
 * 
 * @example
 * ```typescript
 * const result = validateBirthDate(new Date('1990-01-01'));
 * if (result.success) {
 *   console.log(result.value); // Valid Date object
 * }
 * ```
 */
export function validateBirthDate(date: Date | string | null | undefined): ValidationResult<Date> {
  if (!date) {
    return failure(createValidationError('EMPTY_DATE', 'birthDate'));
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return failure(createValidationError('INVALID_DATE_FORMAT', 'birthDate'));
  }
  
  const now = new Date();
  const minDate = new Date('1900-01-01');
  
  // Check if date is in the future
  if (dateObj > now) {
    return failure(createValidationError('FUTURE_DATE', 'birthDate'));
  }
  
  // Check if date is too old
  if (dateObj < minDate) {
    return failure(createValidationError('DATE_TOO_OLD', 'birthDate'));
  }
  
  return success(dateObj);
}

/**
 * Validate Thai name
 * 
 * Checks:
 * - Name is not empty
 * - Name contains only Thai characters (U+0E00-U+0E7F) and spaces
 * - Name length is reasonable (2-50 characters)
 * 
 * @param name - The Thai name to validate
 * @param fieldName - Field name for error messages (default: 'name')
 * @returns Validation result with trimmed name or error
 * 
 * @example
 * ```typescript
 * const result = validateThaiName('สมชาย', 'firstName');
 * if (result.success) {
 *   console.log(result.value); // 'สมชาย'
 * }
 * ```
 */
export function validateThaiName(
  name: string | null | undefined,
  fieldName: 'firstName' | 'lastName' | 'name' = 'name'
): ValidationResult<string> {
  if (!name || name.trim().length === 0) {
    const errorCode = fieldName === 'firstName' 
      ? 'EMPTY_FIRST_NAME'
      : fieldName === 'lastName'
      ? 'EMPTY_LAST_NAME'
      : 'EMPTY_NAME';
    return failure(createValidationError(errorCode, fieldName));
  }
  
  const trimmedName = name.trim();
  
  // Check for Thai characters only (U+0E00-U+0E7F) and spaces
  const thaiCharRegex = /^[\u0E00-\u0E7F\s]+$/;
  if (!thaiCharRegex.test(trimmedName)) {
    return failure(createValidationError('INVALID_THAI_CHARACTERS', fieldName));
  }
  
  // Check minimum length (at least 2 characters, excluding spaces)
  const nameWithoutSpaces = trimmedName.replace(/\s/g, '');
  if (nameWithoutSpaces.length < 2) {
    return failure(createValidationError('NAME_TOO_SHORT', fieldName));
  }
  
  // Check maximum length (50 characters)
  if (trimmedName.length > 50) {
    return failure(createValidationError('NAME_TOO_LONG', fieldName));
  }
  
  return success(trimmedName);
}

/**
 * Validate birth year
 * 
 * Checks:
 * - Year is a valid number
 * - Year is not in the future
 * - Year is not before 1900
 * 
 * @param year - The year to validate (number or string)
 * @returns Validation result with year number or error
 * 
 * @example
 * ```typescript
 * const result = validateBirthYear(1990);
 * if (result.success) {
 *   console.log(result.value); // 1990
 * }
 * ```
 */
export function validateBirthYear(year: number | string | null | undefined): ValidationResult<number> {
  if (year === null || year === undefined || year === '') {
    return failure(createValidationError('EMPTY_YEAR', 'birthYear'));
  }
  
  const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;
  
  // Check if year is a valid number
  if (isNaN(yearNum)) {
    return failure(createValidationError('INVALID_YEAR', 'birthYear'));
  }
  
  const currentYear = new Date().getFullYear();
  
  // Check if year is in the future
  if (yearNum > currentYear) {
    return failure(createValidationError('YEAR_IN_FUTURE', 'birthYear'));
  }
  
  // Check if year is too old
  if (yearNum < 1900) {
    return failure(createValidationError('YEAR_TOO_OLD', 'birthYear'));
  }
  
  return success(yearNum);
}

/**
 * Validate time period selection
 * 
 * @param period - The time period to validate
 * @returns Validation result with TimePeriod or error
 * 
 * @example
 * ```typescript
 * const result = validateTimePeriod('daily');
 * if (result.success) {
 *   console.log(result.value); // TimePeriod.DAILY
 * }
 * ```
 */
export function validateTimePeriod(period: string | null | undefined): ValidationResult<TimePeriod> {
  if (!period) {
    return failure(createValidationError('EMPTY_PERIOD', 'period'));
  }
  
  if (!Object.values(TimePeriod).includes(period as TimePeriod)) {
    return failure(createValidationError('INVALID_PERIOD', 'period'));
  }
  
  return success(period as TimePeriod);
}

/**
 * Validate reading domain selection
 * 
 * @param domain - The reading domain to validate
 * @returns Validation result with ReadingDomain or error
 * 
 * @example
 * ```typescript
 * const result = validateReadingDomain('finance_career');
 * if (result.success) {
 *   console.log(result.value); // ReadingDomain.FINANCE_CAREER
 * }
 * ```
 */
export function validateReadingDomain(domain: string | null | undefined): ValidationResult<ReadingDomain> {
  if (!domain) {
    return failure(createValidationError('EMPTY_DOMAIN', 'domain'));
  }
  
  if (!Object.values(ReadingDomain).includes(domain as ReadingDomain)) {
    return failure(createValidationError('INVALID_DOMAIN', 'domain'));
  }
  
  return success(domain as ReadingDomain);
}

/**
 * Validate date string format (DD/MM/YYYY or YYYY-MM-DD)
 * 
 * @param dateStr - The date string to validate
 * @returns Validation result with Date or error
 * 
 * @example
 * ```typescript
 * const result = validateDateString('01/01/1990');
 * if (result.success) {
 *   console.log(result.value); // Date object
 * }
 * ```
 */
export function validateDateString(dateStr: string | null | undefined): ValidationResult<Date> {
  if (!dateStr) {
    return failure(createValidationError('EMPTY_DATE', 'date'));
  }
  
  // Try to parse the date
  let date: Date;
  
  // Check for DD/MM/YYYY format
  const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const ddmmyyyyMatch = dateStr.match(ddmmyyyyRegex);
  
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch;
    // JavaScript Date uses 0-indexed months
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } else {
    // Try standard date parsing (YYYY-MM-DD, etc.)
    date = new Date(dateStr);
  }
  
  // Validate the parsed date
  return validateBirthDate(date);
}
