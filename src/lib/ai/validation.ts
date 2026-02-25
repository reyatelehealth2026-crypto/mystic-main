/**
 * Response validation system for AI-generated interpretations
 * 
 * This module provides validation functions to ensure AI responses meet
 * quality standards before being returned to users. It includes:
 * - Minimum length validation for Thai text
 * - Structure section validation for required fortune sections
 * - Fallback structure generation for invalid responses
 * - Error logging and metrics tracking
 */

import type { AIResponse, ValidationResult, DivinationType, ErrorLog } from './types';

/**
 * In-memory metrics storage for validation tracking
 */
interface ValidationMetrics {
  totalValidations: number;
  passedValidations: number;
  failedValidations: number;
  fallbackUsages: number;
  errorsByType: Record<string, number>;
  errorsByDivinationType: Record<DivinationType, number>;
}

/**
 * Global metrics tracker
 */
const metrics: ValidationMetrics = {
  totalValidations: 0,
  passedValidations: 0,
  failedValidations: 0,
  fallbackUsages: 0,
  errorsByType: {},
  errorsByDivinationType: {
    tarot: 0,
    spirit: 0,
    numerology: 0,
    chat: 0
  }
};

/**
 * Error log storage (in-memory for now, can be extended to external logging service)
 */
const errorLogs: ErrorLog[] = [];

/**
 * Required sections for fortune structure in Thai
 */
const REQUIRED_SECTIONS = [
  'ภาพรวมสถานการณ์',
  'จุดที่ควรระวัง',
  'แนวทางที่ควรทำ'
] as const;

/**
 * Validates that text contains at least the specified number of Thai characters
 * 
 * @param text - The text to validate
 * @param minChars - Minimum number of Thai characters required (default: 50)
 * @returns true if text contains enough Thai characters, false otherwise
 * 
 * @example
 * validateMinimumLength('สวัสดีครับ', 5) // true
 * validateMinimumLength('Hello', 5) // false
 */
export function validateMinimumLength(text: string, minChars: number = 100): boolean {
  if (!text) return false;
  
  // Count Thai characters (Unicode range: 0E00-0E7F)
  const thaiChars = text.match(/[\u0E00-\u0E7F]/g);
  const thaiCharCount = thaiChars ? thaiChars.length : 0;
  
  return thaiCharCount >= minChars;
}

/**
 * Validates that structure contains all three required sections
 * 
 * @param structure - The cardStructure text to validate
 * @param requiredSections - Array of required section names (default: REQUIRED_SECTIONS)
 * @returns true if all required sections are present, false otherwise
 * 
 * @example
 * validateStructureSections('ภาพรวมสถานการณ์: ... จุดที่ควรระวัง: ... แนวทางที่ควรทำ: ...')
 * // returns true
 */
export function validateStructureSections(
  structure: string,
  requiredSections: readonly string[] = REQUIRED_SECTIONS
): boolean {
  if (!structure) return false;
  
  // Check if all required sections are present in the structure
  return requiredSections.every(section => structure.includes(section));
}

/**
 * Ensures fortune structure has all required sections, adding fallback content if needed
 * 
 * @param input - The cardStructure text to validate/fix
 * @param summary - The summary text to use in fallback content
 * @param type - The divination type (for logging)
 * @returns Properly formatted cardStructure with all required sections
 * 
 * @example
 * ensureFortuneStructure('', 'คำทำนายสั้น', 'tarot')
 * // returns formatted structure with all three sections
 */
export function ensureFortuneStructure(
  input: string, 
  summary: string,
  type?: DivinationType
): string {
  const text = input.replace(/\s+/g, ' ').trim();
  
  // If input is empty, return complete fallback structure
  if (!text) {
    if (type) {
      trackFallbackUsage(type, 'Empty cardStructure input');
    }
    return [
      `ภาพรวมสถานการณ์: ${summary}`,
      'จุดที่ควรระวัง: อย่ารีบตัดสินใจจากอารมณ์หรือข้อมูลที่ยังไม่ครบ',
      'แนวทางที่ควรทำ: โฟกัส 1 ประเด็นหลัก วางขั้นตอน แล้วลงมือทีละส่วน'
    ].join('\n');
  }
  
  // If structure already has labels, return as-is
  const hasLabels = REQUIRED_SECTIONS.some(section => text.includes(section));
  if (hasLabels) {
    return text;
  }
  
  // If no labels, wrap content with structure
  if (type) {
    trackFallbackUsage(type, 'Missing section labels in cardStructure');
  }
  
  return [
    `ภาพรวมสถานการณ์: ${summary || text}`,
    `จุดที่ควรระวัง: ${text}`,
    'แนวทางที่ควรทำ: ตั้งกรอบเวลาให้ชัด เช็กความเสี่ยง และตัดสินใจจากข้อเท็จจริง'
  ].join('\n');
}

/**
 * Validates an AI response for quality and completeness
 * 
 * @param response - The AI response to validate
 * @param type - The divination type (for context-specific validation)
 * @returns ValidationResult with isValid flag, errors, and warnings
 * 
 * @example
 * validateAIResponse({ summary: 'คำทำนาย...', cardStructure: '...' }, 'tarot')
 * // returns { isValid: true, errors: [], warnings: [] }
 */
export function validateAIResponse(
  response: AIResponse,
  type: DivinationType
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Track validation attempt
  metrics.totalValidations++;
  
  // Validate summary exists and has minimum length
  if (!response.summary) {
    errors.push('Summary is missing');
    trackError('summary_missing', type);
  } else if (!validateMinimumLength(response.summary, 100)) {
    errors.push('Summary contains fewer than 100 Thai characters - need more comprehensive overview');
    trackError('summary_too_short', type);
  } else if (response.summary.length < 200) {
    warnings.push('Summary is quite short (less than 200 characters) - consider adding more depth');
  }
  
  // Validate cardStructure exists and has required sections
  if (!response.cardStructure) {
    errors.push('CardStructure is missing');
    trackError('cardstructure_missing', type);
  } else if (!validateStructureSections(response.cardStructure)) {
    errors.push('CardStructure is missing one or more required sections (ภาพรวมสถานการณ์, จุดที่ควรระวัง, แนวทางที่ควรทำ)');
    trackError('cardstructure_incomplete_sections', type);
  } else if (!validateMinimumLength(response.cardStructure, 300)) {
    errors.push('CardStructure is too short (less than 300 Thai characters) - need more comprehensive analysis');
    trackError('cardstructure_too_short', type);
  }
  
  // Add warnings for edge cases and depth checks
  if (response.cardStructure && response.cardStructure.length < 500) {
    warnings.push('CardStructure could be more detailed (less than 500 characters) - consider adding psychological insights, symbolic meanings, or energy patterns');
  }
  
  // Check for depth indicators
  const depthIndicators = ['เพราะว่า', 'เนื่องจาก', 'ซึ่งหมายความว่า', 'ดังนั้น', 'อย่างไรก็ตาม', 'นอกจากนี้'];
  const hasDepthIndicators = depthIndicators.some(indicator => 
    response.cardStructure?.includes(indicator) || response.summary?.includes(indicator)
  );
  
  if (!hasDepthIndicators) {
    warnings.push('Response may lack depth - consider adding more explanations and connections between ideas');
  }
  
  // Update metrics based on validation result
  const isValid = errors.length === 0;
  if (isValid) {
    metrics.passedValidations++;
  } else {
    metrics.failedValidations++;
    metrics.errorsByDivinationType[type]++;
    
    // Log validation failure
    logError({
      timestamp: new Date(),
      errorType: 'validation',
      divinationType: type,
      errorMessage: `Validation failed: ${errors.join(', ')}`,
      context: {
        errors,
        warnings,
        summaryLength: response.summary?.length || 0,
        cardStructureLength: response.cardStructure?.length || 0
      }
    });
  }
  
  return {
    isValid,
    errors,
    warnings
  };
}

/**
 * Tracks specific error types for metrics
 * 
 * @param errorType - The type of error encountered
 * @param divinationType - The divination type where error occurred
 */
function trackError(errorType: string, divinationType: DivinationType): void {
  if (!metrics.errorsByType[errorType]) {
    metrics.errorsByType[errorType] = 0;
  }
  metrics.errorsByType[errorType]++;
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[AI Validation] ${errorType} in ${divinationType} reading`);
  }
}

/**
 * Logs an error with full context for monitoring and debugging
 * 
 * @param log - The error log entry to record
 */
export function logError(log: ErrorLog): void {
  errorLogs.push(log);
  
  // Log to console with structured format
  console.error('[AI Error Log]', {
    timestamp: log.timestamp.toISOString(),
    type: log.errorType,
    divination: log.divinationType,
    message: log.errorMessage,
    context: log.context
  });
  
  // In production, this could send to external logging service
  // Example: sendToLoggingService(log);
}

/**
 * Tracks fallback usage when validation fails
 * 
 * @param type - The divination type where fallback was used
 * @param reason - The reason fallback was triggered
 */
export function trackFallbackUsage(type: DivinationType, reason: string): void {
  metrics.fallbackUsages++;
  
  logError({
    timestamp: new Date(),
    errorType: 'validation',
    divinationType: type,
    errorMessage: `Fallback structure used: ${reason}`,
    context: { reason }
  });
  
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[AI Validation] Fallback used for ${type}: ${reason}`);
  }
}

/**
 * Gets current validation metrics
 * 
 * @returns Current metrics snapshot
 */
export function getValidationMetrics(): ValidationMetrics {
  return {
    ...metrics,
    errorsByType: { ...metrics.errorsByType },
    errorsByDivinationType: { ...metrics.errorsByDivinationType }
  };
}

/**
 * Gets validation pass rate as a percentage
 * 
 * @returns Pass rate (0-100) or null if no validations yet
 */
export function getValidationPassRate(): number | null {
  if (metrics.totalValidations === 0) return null;
  return (metrics.passedValidations / metrics.totalValidations) * 100;
}

/**
 * Gets fallback usage rate as a percentage
 * 
 * @returns Fallback usage rate (0-100) or null if no validations yet
 */
export function getFallbackUsageRate(): number | null {
  if (metrics.totalValidations === 0) return null;
  return (metrics.fallbackUsages / metrics.totalValidations) * 100;
}

/**
 * Gets error logs with optional filtering
 * 
 * @param options - Filter options
 * @returns Filtered error logs
 */
export function getErrorLogs(options?: {
  errorType?: ErrorLog['errorType'];
  divinationType?: DivinationType;
  since?: Date;
  limit?: number;
}): ErrorLog[] {
  let filtered = [...errorLogs];
  
  if (options?.errorType) {
    filtered = filtered.filter(log => log.errorType === options.errorType);
  }
  
  if (options?.divinationType) {
    filtered = filtered.filter(log => log.divinationType === options.divinationType);
  }
  
  if (options?.since) {
    const sinceDate = options.since;
    filtered = filtered.filter(log => log.timestamp >= sinceDate);
  }
  
  if (options?.limit) {
    filtered = filtered.slice(-options.limit);
  }
  
  return filtered;
}

/**
 * Resets all metrics and logs (useful for testing)
 */
export function resetMetrics(): void {
  metrics.totalValidations = 0;
  metrics.passedValidations = 0;
  metrics.failedValidations = 0;
  metrics.fallbackUsages = 0;
  metrics.errorsByType = {};
  metrics.errorsByDivinationType = {
    tarot: 0,
    spirit: 0,
    numerology: 0,
    chat: 0
  };
  errorLogs.length = 0;
}
