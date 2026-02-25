# Validation Module

Centralized validation utilities with Thai error messages for REFFORTUNE fortune features.

## Features

- Type-safe validation with TypeScript
- Thai language error messages
- Consistent error structure
- Reusable validation functions
- Support for all input types (zodiac, dates, names, years, periods, domains)

## Usage

### Basic Validation

```typescript
import { validateThaiName, validateBirthDate, validateZodiacSign } from '@/lib/validation';

// Validate Thai name
const nameResult = validateThaiName('สมชาย', 'firstName');
if (nameResult.success) {
  console.log('Valid name:', nameResult.value);
} else {
  console.error('Error:', nameResult.error.message);
}

// Validate birth date
const dateResult = validateBirthDate(new Date('1990-01-01'));
if (dateResult.success) {
  console.log('Valid date:', dateResult.value);
} else {
  console.error('Error:', dateResult.error.message);
}

// Validate zodiac sign
const zodiacResult = validateZodiacSign('aries');
if (zodiacResult.success) {
  console.log('Valid zodiac:', zodiacResult.value);
} else {
  console.error('Error:', zodiacResult.error.message);
}
```

### In React Components

```typescript
'use client';

import * as React from 'react';
import { validateThaiName } from '@/lib/validation';
import { InlineError } from '@/components/ui/ErrorDisplay';
import { Input } from '@/components/ui/Input';

export function NameForm() {
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (value: string) => {
    setName(value);
    
    // Validate on change
    const result = validateThaiName(value, 'firstName');
    if (!result.success) {
      setError(result.error.message);
    } else {
      setError(null);
    }
  };

  return (
    <div>
      <Input
        value={name}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="ระบุชื่อของคุณ"
      />
      {error && <InlineError message={error} />}
    </div>
  );
}
```

### Form Validation

```typescript
import {
  validateThaiName,
  validateBirthDate,
  validateZodiacSign,
  ValidationError
} from '@/lib/validation';

interface FormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  zodiacSign: string;
}

function validateForm(data: FormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate first name
  const firstNameResult = validateThaiName(data.firstName, 'firstName');
  if (!firstNameResult.success) {
    errors.push(firstNameResult.error);
  }

  // Validate last name
  const lastNameResult = validateThaiName(data.lastName, 'lastName');
  if (!lastNameResult.success) {
    errors.push(lastNameResult.error);
  }

  // Validate birth date
  const dateResult = validateBirthDate(new Date(data.birthDate));
  if (!dateResult.success) {
    errors.push(dateResult.error);
  }

  // Validate zodiac sign
  const zodiacResult = validateZodiacSign(data.zodiacSign);
  if (!zodiacResult.success) {
    errors.push(zodiacResult.error);
  }

  return errors;
}
```

## Available Validators

### `validateZodiacSign(sign)`
Validates zodiac sign selection.

**Returns:** `ValidationResult<ZodiacSign>`

**Errors:**
- `EMPTY_ZODIAC_SIGN`: "กรุณาเลือกราศี"
- `INVALID_ZODIAC_SIGN`: "ราศีที่เลือกไม่ถูกต้อง กรุณาเลือกราศีที่ถูกต้อง"

### `validateBirthDate(date)`
Validates birth date (not in future, not before 1900).

**Returns:** `ValidationResult<Date>`

**Errors:**
- `EMPTY_DATE`: "กรุณาระบุวันที่"
- `INVALID_DATE_FORMAT`: "รูปแบบวันที่ไม่ถูกต้อง กรุณาระบุวันที่ในรูปแบบที่ถูกต้อง"
- `FUTURE_DATE`: "ไม่สามารถใช้วันที่ในอนาคตได้"
- `DATE_TOO_OLD`: "วันที่ต้องไม่เก่ากว่าปี ค.ศ. 1900"

### `validateThaiName(name, fieldName)`
Validates Thai name (only Thai characters and spaces, 2-50 characters).

**Parameters:**
- `name`: The name to validate
- `fieldName`: 'firstName' | 'lastName' | 'name'

**Returns:** `ValidationResult<string>`

**Errors:**
- `EMPTY_FIRST_NAME`: "กรุณาระบุชื่อ"
- `EMPTY_LAST_NAME`: "กรุณาระบุนามสกุล"
- `EMPTY_NAME`: "กรุณาระบุชื่อ"
- `INVALID_THAI_CHARACTERS`: "กรุณาใช้ตัวอักษรไทยเท่านั้น"
- `NAME_TOO_SHORT`: "ชื่อสั้นเกินไป กรุณาระบุชื่อที่มีความยาวอย่างน้อย 2 ตัวอักษร"
- `NAME_TOO_LONG`: "ชื่อยาวเกินไป กรุณาระบุชื่อที่มีความยาวไม่เกิน 50 ตัวอักษร"

### `validateBirthYear(year)`
Validates birth year (not in future, not before 1900).

**Returns:** `ValidationResult<number>`

**Errors:**
- `EMPTY_YEAR`: "กรุณาระบุปีเกิด"
- `INVALID_YEAR`: "ปีไม่ถูกต้อง กรุณาระบุปีที่ถูกต้อง"
- `YEAR_IN_FUTURE`: "ไม่สามารถใช้ปีในอนาคตได้"
- `YEAR_TOO_OLD`: "ปีต้องไม่เก่ากว่า ค.ศ. 1900"

### `validateTimePeriod(period)`
Validates time period selection (daily, weekly, monthly).

**Returns:** `ValidationResult<TimePeriod>`

**Errors:**
- `EMPTY_PERIOD`: "กรุณาเลือกช่วงเวลา"
- `INVALID_PERIOD`: "ช่วงเวลาที่เลือกไม่ถูกต้อง"

### `validateReadingDomain(domain)`
Validates reading domain selection (finance_career, love_relationships).

**Returns:** `ValidationResult<ReadingDomain>`

**Errors:**
- `EMPTY_DOMAIN`: "กรุณาเลือกหมวดหมู่"
- `INVALID_DOMAIN`: "หมวดหมู่ที่เลือกไม่ถูกต้อง"

### `validateDateString(dateStr)`
Validates date string in DD/MM/YYYY or YYYY-MM-DD format.

**Returns:** `ValidationResult<Date>`

**Errors:** Same as `validateBirthDate`

## Error Structure

```typescript
interface ValidationError {
  code: string;        // Error code (e.g., 'INVALID_DATE_FORMAT')
  message: string;     // Thai error message
  field?: string;      // Field name (e.g., 'birthDate')
}
```

## Result Type

```typescript
type ValidationResult<T> = 
  | { success: true; value: T }
  | { success: false; error: ValidationError };
```

## Error Messages

All error messages are in Thai and stored in `ERROR_MESSAGES` constant. They are:
- User-friendly and actionable
- Do not expose technical details
- Provide clear guidance on what to do

## Requirements

- Requirements: 6.6, 6.7, 10.6
- Feature: popular-fortune-features
