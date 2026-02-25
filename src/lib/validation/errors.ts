/**
 * Validation Error Types and Messages for REFFORTUNE
 * 
 * Centralized error definitions with Thai language messages.
 * All error messages are user-friendly and actionable.
 * 
 * Feature: popular-fortune-features
 * Requirements: 6.6, 6.7, 10.6
 */

/**
 * Validation error structure
 */
export interface ValidationError {
  code: string;
  message: string;
  field?: string;
}

/**
 * Result type for validation operations
 */
export type ValidationResult<T> = 
  | { success: true; value: T }
  | { success: false; error: ValidationError };

/**
 * Thai error messages for common validation scenarios
 */
export const ERROR_MESSAGES = {
  // Date validation errors
  INVALID_DATE_FORMAT: 'รูปแบบวันที่ไม่ถูกต้อง กรุณาระบุวันที่ในรูปแบบที่ถูกต้อง',
  FUTURE_DATE: 'ไม่สามารถใช้วันที่ในอนาคตได้',
  DATE_TOO_OLD: 'วันที่ต้องไม่เก่ากว่าปี ค.ศ. 1900',
  EMPTY_DATE: 'กรุณาระบุวันที่',
  INVALID_BIRTH_DATE: 'วันเกิดไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง',
  
  // Name validation errors
  EMPTY_NAME: 'กรุณาระบุชื่อ',
  EMPTY_FIRST_NAME: 'กรุณาระบุชื่อ',
  EMPTY_LAST_NAME: 'กรุณาระบุนามสกุล',
  INVALID_THAI_CHARACTERS: 'กรุณาใช้ตัวอักษรไทยเท่านั้น',
  NAME_TOO_SHORT: 'ชื่อสั้นเกินไป กรุณาระบุชื่อที่มีความยาวอย่างน้อย 2 ตัวอักษร',
  NAME_TOO_LONG: 'ชื่อยาวเกินไป กรุณาระบุชื่อที่มีความยาวไม่เกิน 50 ตัวอักษร',
  
  // Zodiac validation errors
  INVALID_ZODIAC_SIGN: 'ราศีที่เลือกไม่ถูกต้อง กรุณาเลือกราศีที่ถูกต้อง',
  EMPTY_ZODIAC_SIGN: 'กรุณาเลือกราศี',
  
  // Year validation errors
  INVALID_YEAR: 'ปีไม่ถูกต้อง กรุณาระบุปีที่ถูกต้อง',
  YEAR_TOO_OLD: 'ปีต้องไม่เก่ากว่า ค.ศ. 1900',
  YEAR_IN_FUTURE: 'ไม่สามารถใช้ปีในอนาคตได้',
  EMPTY_YEAR: 'กรุณาระบุปีเกิด',
  
  // Period validation errors
  INVALID_PERIOD: 'ช่วงเวลาที่เลือกไม่ถูกต้อง',
  EMPTY_PERIOD: 'กรุณาเลือกช่วงเวลา',
  
  // Domain validation errors
  INVALID_DOMAIN: 'หมวดหมู่ที่เลือกไม่ถูกต้อง',
  EMPTY_DOMAIN: 'กรุณาเลือกหมวดหมู่',
  
  // General validation errors
  REQUIRED_FIELD: 'กรุณากรอกข้อมูลในช่องนี้',
  INVALID_INPUT: 'ข้อมูลที่กรอกไม่ถูกต้อง',
} as const;

/**
 * Create a validation error
 */
export function createValidationError(
  code: keyof typeof ERROR_MESSAGES,
  field?: string
): ValidationError {
  return {
    code,
    message: ERROR_MESSAGES[code],
    field
  };
}

/**
 * Create a success result
 */
export function success<T>(value: T): ValidationResult<T> {
  return { success: true, value };
}

/**
 * Create an error result
 */
export function failure<T>(error: ValidationError): ValidationResult<T> {
  return { success: false, error };
}
