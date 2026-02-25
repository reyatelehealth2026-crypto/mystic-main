/**
 * ErrorDisplay Component for REFFORTUNE
 * 
 * User-friendly error message display with retry and dismiss actions.
 * All messages displayed in Thai language.
 * 
 * Feature: popular-fortune-features
 * Requirements: 10.6, 10.7
 */

import * as React from "react";
import { Alert } from "./Alert";
import { Button } from "./Button";
import { cn } from "@/lib/cn";

/**
 * Error types that can be displayed
 */
export type ErrorType = 
  | 'validation'    // Input validation errors
  | 'api'          // API/network errors
  | 'storage'      // Local storage errors
  | 'calculation'  // Calculation/processing errors
  | 'general';     // General errors

/**
 * Error information structure
 */
export interface ErrorInfo {
  code: string;           // Error code for debugging
  message: string;        // User-friendly Thai message
  type?: ErrorType;       // Error category
  retryable?: boolean;    // Whether retry action should be shown
  recoverable?: boolean;  // Whether error can be recovered from
}

export interface ErrorDisplayProps {
  error: ErrorInfo | string;  // Error info or simple message string
  onRetry?: () => void;       // Retry action handler
  onDismiss?: () => void;     // Dismiss action handler
  className?: string;
  showIcon?: boolean;         // Show error icon (default: true)
}

/**
 * ErrorDisplay Component
 * 
 * Displays user-friendly error messages in Thai with optional retry/dismiss actions.
 * 
 * @example
 * ```tsx
 * <ErrorDisplay
 *   error={{
 *     code: 'INVALID_DATE',
 *     message: 'รูปแบบวันที่ไม่ถูกต้อง',
 *     retryable: false
 *   }}
 *   onDismiss={() => setError(null)}
 * />
 * ```
 */
export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  className,
  showIcon = true
}: ErrorDisplayProps) {
  // Normalize error to ErrorInfo structure
  const errorInfo: ErrorInfo = typeof error === 'string'
    ? { code: 'GENERAL_ERROR', message: error, type: 'general' }
    : error;

  return (
    <Alert
      tone="danger"
      className={cn("flex flex-col gap-3", className)}
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className="flex-shrink-0 mt-0.5">
            <ErrorIcon />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-danger mb-1">
            เกิดข้อผิดพลาด
          </div>
          <div className="text-sm text-fg">
            {errorInfo.message}
          </div>
        </div>
      </div>
      
      {(onRetry || onDismiss) && (
        <div className="flex items-center gap-2 mt-1">
          {errorInfo.retryable && onRetry && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onRetry}
            >
              ลองอีกครั้ง
            </Button>
          )}
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
            >
              ปิด
            </Button>
          )}
        </div>
      )}
    </Alert>
  );
}

/**
 * Error icon component
 */
function ErrorIcon() {
  return (
    <svg
      className="w-5 h-5 text-danger"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}

/**
 * Inline error message component for form fields
 * 
 * @example
 * ```tsx
 * <InlineError message="กรุณาระบุชื่อ" />
 * ```
 */
export interface InlineErrorProps {
  message: string;
  className?: string;
}

export function InlineError({ message, className }: InlineErrorProps) {
  return (
    <div className={cn("flex items-center gap-1.5 text-sm text-danger mt-1.5", className)}>
      <svg
        className="w-4 h-4 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}
