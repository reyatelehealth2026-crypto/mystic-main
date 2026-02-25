/**
 * Validation utilities for compatibility feature
 */

export interface ValidationError {
  code: string;
  message: string;
  field: string;
}

export type Result<T, E> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

export function Ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function Err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

/**
 * Validate birth date
 * Checks for valid date format, range (1900-01-01 to today), and future dates
 */
export function validateBirthDate(date: Date): Result<Date, ValidationError> {
  const now = new Date();
  const minDate = new Date('1900-01-01');
  
  if (isNaN(date.getTime())) {
    return Err({
      code: 'INVALID_DATE_FORMAT',
      message: 'รูปแบบวันที่ไม่ถูกต้อง กรุณาระบุวันที่ในรูปแบบที่ถูกต้อง',
      field: 'birthDate'
    });
  }
  
  if (date > now) {
    return Err({
      code: 'FUTURE_DATE',
      message: 'ไม่สามารถใช้วันที่ในอนาคตได้',
      field: 'birthDate'
    });
  }
  
  if (date < minDate) {
    return Err({
      code: 'DATE_TOO_OLD',
      message: 'วันที่ต้องไม่เก่ากว่าปี ค.ศ. 1900',
      field: 'birthDate'
    });
  }
  
  return Ok(date);
}

/**
 * Validate birth date from string input
 * Converts string to Date and validates
 */
export function validateBirthDateString(dateString: string): Result<Date, ValidationError> {
  if (!dateString || dateString.trim().length === 0) {
    return Err({
      code: 'EMPTY_DATE',
      message: 'กรุณาระบุวันเกิด',
      field: 'birthDate'
    });
  }

  const date = new Date(dateString);
  return validateBirthDate(date);
}

/**
 * Validate both birth dates for compatibility analysis
 */
export function validateCompatibilityDates(
  date1: string,
  date2: string
): Result<{ date1: Date; date2: Date }, { person1?: ValidationError; person2?: ValidationError }> {
  const result1 = validateBirthDateString(date1);
  const result2 = validateBirthDateString(date2);

  if (!result1.ok || !result2.ok) {
    return Err({
      person1: !result1.ok ? result1.error : undefined,
      person2: !result2.ok ? result2.error : undefined,
    });
  }

  return Ok({
    date1: result1.value,
    date2: result2.value,
  });
}
