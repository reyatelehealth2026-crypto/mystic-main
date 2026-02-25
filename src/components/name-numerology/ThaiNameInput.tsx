'use client';

import * as React from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/Alert';
import { validateThaiName } from '@/lib/validation';
import { cn } from '@/lib/cn';

export interface ThaiNameInputProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  showValidation?: boolean;
  className?: string;
}

interface ValidationState {
  isValid: boolean;
  error?: string;
}

/**
 * Thai Name Input Component
 * 
 * A form component for inputting Thai names with real-time validation.
 * Validates that input contains only Thai characters (Unicode U+0E00-U+0E7F) and spaces.
 * 
 * Features:
 * - Real-time validation feedback
 * - Thai error messages
 * - Visual indicators for valid/invalid input
 * - Accessible form labels and helper text
 * 
 * Requirements: 6.1, 6.6, 6.7, 9.6
 * 
 * @example
 * ```tsx
 * const [firstName, setFirstName] = useState('');
 * const [lastName, setLastName] = useState('');
 * 
 * <ThaiNameInput
 *   firstName={firstName}
 *   lastName={lastName}
 *   onFirstNameChange={setFirstName}
 *   onLastNameChange={setLastName}
 *   showValidation={true}
 * />
 * ```
 */
export function ThaiNameInput({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  showValidation = false,
  className
}: ThaiNameInputProps) {
  const [firstNameTouched, setFirstNameTouched] = React.useState(false);
  const [lastNameTouched, setLastNameTouched] = React.useState(false);

  // Validate first name
  const firstNameValidation = React.useMemo((): ValidationState => {
    const result = validateThaiName(firstName, 'firstName');
    
    if (!result.success) {
      return {
        isValid: false,
        error: result.error.message
      };
    }

    return { isValid: true };
  }, [firstName]);

  // Validate last name
  const lastNameValidation = React.useMemo((): ValidationState => {
    const result = validateThaiName(lastName, 'lastName');
    
    if (!result.success) {
      return {
        isValid: false,
        error: result.error.message
      };
    }

    return { isValid: true };
  }, [lastName]);

  // Show validation only if showValidation prop is true and field has been touched
  const showFirstNameError = showValidation && firstNameTouched && !firstNameValidation.isValid;
  const showLastNameError = showValidation && lastNameTouched && !lastNameValidation.isValid;

  // Show success indicator when valid and touched
  const showFirstNameSuccess = showValidation && firstNameTouched && firstNameValidation.isValid;
  const showLastNameSuccess = showValidation && lastNameTouched && lastNameValidation.isValid;

  return (
    <div className={cn('space-y-6', className)}>
      {/* First Name Input */}
      <div className="space-y-2">
        <Label htmlFor="firstName">
          ชื่อ <span className="text-danger">*</span>
        </Label>
        <div className="relative">
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            onBlur={() => setFirstNameTouched(true)}
            placeholder="ระบุชื่อของคุณ"
            className={cn(
              showFirstNameError && 'border-danger focus-visible:ring-danger',
              showFirstNameSuccess && 'border-success focus-visible:ring-success'
            )}
            aria-invalid={showFirstNameError}
            aria-describedby={showFirstNameError ? 'firstName-error' : undefined}
          />
          {showFirstNameSuccess && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M16.667 5L7.5 14.167 3.333 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
        {showFirstNameError && (
          <p id="firstName-error" className="text-xs text-danger mt-1">
            {firstNameValidation.error}
          </p>
        )}
        {!showFirstNameError && (
          <p className="text-xs text-fg-subtle mt-1">ใช้ตัวอักษรไทยเท่านั้น</p>
        )}
      </div>

      {/* Last Name Input */}
      <div className="space-y-2">
        <Label htmlFor="lastName">
          นามสกุล <span className="text-danger">*</span>
        </Label>
        <div className="relative">
          <Input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            onBlur={() => setLastNameTouched(true)}
            placeholder="ระบุนามสกุลของคุณ"
            className={cn(
              showLastNameError && 'border-danger focus-visible:ring-danger',
              showLastNameSuccess && 'border-success focus-visible:ring-success'
            )}
            aria-invalid={showLastNameError}
            aria-describedby={showLastNameError ? 'lastName-error' : undefined}
          />
          {showLastNameSuccess && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M16.667 5L7.5 14.167 3.333 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
        {showLastNameError && (
          <p id="lastName-error" className="text-xs text-danger mt-1">
            {lastNameValidation.error}
          </p>
        )}
        {!showLastNameError && (
          <p className="text-xs text-fg-subtle mt-1">ใช้ตัวอักษรไทยเท่านั้น</p>
        )}
      </div>

      {/* Overall validation alert */}
      {showValidation && (!firstNameValidation.isValid || !lastNameValidation.isValid) && (
        <Alert tone="danger">
          <div className="font-medium">กรุณาตรวจสอบข้อมูล</div>
          <div className="mt-1 text-xs">
            {!firstNameValidation.isValid && <div>• {firstNameValidation.error}</div>}
            {!lastNameValidation.isValid && <div>• {lastNameValidation.error}</div>}
          </div>
        </Alert>
      )}
    </div>
  );
}

/**
 * Hook to manage Thai name input state and validation
 * 
 * Provides a convenient way to manage name input state with built-in validation.
 * 
 * @returns Object containing name values, setters, and validation state
 * 
 * @example
 * ```tsx
 * const nameInput = useThaiNameInput();
 * 
 * <ThaiNameInput
 *   firstName={nameInput.firstName}
 *   lastName={nameInput.lastName}
 *   onFirstNameChange={nameInput.setFirstName}
 *   onLastNameChange={nameInput.setLastName}
 *   showValidation={nameInput.showValidation}
 * />
 * 
 * <Button
 *   onClick={nameInput.validate}
 *   disabled={!nameInput.isValid}
 * >
 *   ดูผลการวิเคราะห์
 * </Button>
 * ```
 */
export function useThaiNameInput() {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [showValidation, setShowValidation] = React.useState(false);

  const isValid = React.useMemo(() => {
    const firstNameResult = validateThaiName(firstName, 'firstName');
    const lastNameResult = validateThaiName(lastName, 'lastName');
    return firstNameResult.success && lastNameResult.success;
  }, [firstName, lastName]);

  const validate = React.useCallback(() => {
    setShowValidation(true);
    return isValid;
  }, [isValid]);

  const reset = React.useCallback(() => {
    setFirstName('');
    setLastName('');
    setShowValidation(false);
  }, []);

  return {
    firstName,
    lastName,
    setFirstName,
    setLastName,
    isValid,
    showValidation,
    validate,
    reset
  };
}
