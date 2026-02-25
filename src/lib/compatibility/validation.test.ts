import { describe, it, expect } from 'vitest';
import {
  validateBirthDate,
  validateBirthDateString,
  validateCompatibilityDates,
} from './validation';

describe('validateBirthDate', () => {
  it('should accept valid birth dates', () => {
    const validDate = new Date('1990-01-15');
    const result = validateBirthDate(validDate);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual(validDate);
    }
  });

  it('should reject future dates', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const result = validateBirthDate(futureDate);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('FUTURE_DATE');
      expect(result.error.message).toBe('ไม่สามารถใช้วันที่ในอนาคตได้');
    }
  });

  it('should reject dates before 1900', () => {
    const oldDate = new Date('1899-12-31');
    const result = validateBirthDate(oldDate);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('DATE_TOO_OLD');
      expect(result.error.message).toBe('วันที่ต้องไม่เก่ากว่าปี ค.ศ. 1900');
    }
  });

  it('should reject invalid dates', () => {
    const invalidDate = new Date('invalid');
    const result = validateBirthDate(invalidDate);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('INVALID_DATE_FORMAT');
      expect(result.error.message).toBe('รูปแบบวันที่ไม่ถูกต้อง กรุณาระบุวันที่ในรูปแบบที่ถูกต้อง');
    }
  });

  it('should accept date exactly on 1900-01-01', () => {
    const minDate = new Date('1900-01-01');
    const result = validateBirthDate(minDate);

    expect(result.ok).toBe(true);
  });

  it('should accept today as valid date', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result = validateBirthDate(today);

    expect(result.ok).toBe(true);
  });
});

describe('validateBirthDateString', () => {
  it('should accept valid date strings', () => {
    const result = validateBirthDateString('1990-01-15');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.getFullYear()).toBe(1990);
      expect(result.value.getMonth()).toBe(0); // January is 0
      expect(result.value.getDate()).toBe(15);
    }
  });

  it('should reject empty strings', () => {
    const result = validateBirthDateString('');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('EMPTY_DATE');
      expect(result.error.message).toBe('กรุณาระบุวันเกิด');
    }
  });

  it('should reject whitespace-only strings', () => {
    const result = validateBirthDateString('   ');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('EMPTY_DATE');
    }
  });

  it('should reject invalid date format strings', () => {
    const result = validateBirthDateString('not-a-date');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('INVALID_DATE_FORMAT');
    }
  });

  it('should handle various date formats', () => {
    // ISO format
    const result1 = validateBirthDateString('1990-01-15');
    expect(result1.ok).toBe(true);

    // Different valid format
    const result2 = validateBirthDateString('1990/01/15');
    expect(result2.ok).toBe(true);
  });
});

describe('validateCompatibilityDates', () => {
  it('should accept two valid dates', () => {
    const result = validateCompatibilityDates('1990-01-15', '1992-05-20');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.date1.getFullYear()).toBe(1990);
      expect(result.value.date2.getFullYear()).toBe(1992);
    }
  });

  it('should return error for invalid first date', () => {
    const result = validateCompatibilityDates('', '1992-05-20');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.person1).toBeDefined();
      expect(result.error.person1?.code).toBe('EMPTY_DATE');
      expect(result.error.person2).toBeUndefined();
    }
  });

  it('should return error for invalid second date', () => {
    const result = validateCompatibilityDates('1990-01-15', '');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.person1).toBeUndefined();
      expect(result.error.person2).toBeDefined();
      expect(result.error.person2?.code).toBe('EMPTY_DATE');
    }
  });

  it('should return errors for both dates when both invalid', () => {
    const result = validateCompatibilityDates('', '');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.person1).toBeDefined();
      expect(result.error.person2).toBeDefined();
      expect(result.error.person1?.code).toBe('EMPTY_DATE');
      expect(result.error.person2?.code).toBe('EMPTY_DATE');
    }
  });

  it('should reject future dates for both persons', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateString = futureDate.toISOString().split('T')[0];

    const result = validateCompatibilityDates(futureDateString, futureDateString);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.person1?.code).toBe('FUTURE_DATE');
      expect(result.error.person2?.code).toBe('FUTURE_DATE');
    }
  });

  it('should handle mixed valid and invalid dates', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateString = futureDate.toISOString().split('T')[0];

    const result = validateCompatibilityDates('1990-01-15', futureDateString);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.person1).toBeUndefined();
      expect(result.error.person2).toBeDefined();
      expect(result.error.person2?.code).toBe('FUTURE_DATE');
    }
  });

  it('should accept dates at boundary (1900-01-01)', () => {
    const result = validateCompatibilityDates('1900-01-01', '1900-01-01');

    expect(result.ok).toBe(true);
  });

  it('should accept dates at boundary (today)', () => {
    const today = new Date().toISOString().split('T')[0];
    const result = validateCompatibilityDates(today, today);

    expect(result.ok).toBe(true);
  });
});
