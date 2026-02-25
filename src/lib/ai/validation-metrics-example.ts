/**
 * Example usage of validation metrics and logging
 * 
 * This file demonstrates how to use the metrics and logging features
 * added to the validation module.
 */

import {
  validateAIResponse,
  getValidationMetrics,
  getValidationPassRate,
  getFallbackUsageRate,
  getErrorLogs,
  trackFallbackUsage,
  ensureFortuneStructure
} from './validation';
import type { AIResponse } from './types';

/**
 * Example 1: Basic validation with automatic metrics tracking
 */
export function exampleBasicValidation() {
  const response: AIResponse = {
    summary: 'สวัสดีครับ ยินดีต้อนรับสู่ระบบทำนายดวงชะตา ขอให้โชคดีนะครับ ขอให้โชคดี',
    cardStructure: `
      ภาพรวมสถานการณ์: คุณกำลังเผชิญกับการตัดสินใจสำคัญในชีวิต
      จุดที่ควรระวัง: อย่ารีบตัดสินใจจากอารมณ์หรือข้อมูลที่ยังไม่ครบ
      แนวทางที่ควรทำ: โฟกัส 1 ประเด็นหลัก วางขั้นตอน แล้วลงมือทีละส่วน
    `
  };

  // Validation automatically tracks metrics
  const result = validateAIResponse(response, 'tarot');
  
  console.log('Validation result:', result);
  // { isValid: true, errors: [], warnings: [] }
}

/**
 * Example 2: Checking validation metrics
 */
export function exampleCheckMetrics() {
  // Get current metrics
  const metrics = getValidationMetrics();
  
  console.log('Total validations:', metrics.totalValidations);
  console.log('Passed validations:', metrics.passedValidations);
  console.log('Failed validations:', metrics.failedValidations);
  console.log('Fallback usages:', metrics.fallbackUsages);
  console.log('Errors by type:', metrics.errorsByType);
  console.log('Errors by divination type:', metrics.errorsByDivinationType);
  
  // Get pass rate
  const passRate = getValidationPassRate();
  console.log('Pass rate:', passRate ? `${passRate.toFixed(2)}%` : 'No data yet');
  
  // Get fallback usage rate
  const fallbackRate = getFallbackUsageRate();
  console.log('Fallback rate:', fallbackRate ? `${fallbackRate.toFixed(2)}%` : 'No data yet');
}

/**
 * Example 3: Using ensureFortuneStructure with fallback tracking
 */
export function exampleFallbackTracking() {
  // This will trigger fallback tracking
  const structure = ensureFortuneStructure('', 'คำทำนายสั้น', 'tarot');
  
  console.log('Generated structure:', structure);
  
  // Check metrics to see fallback was tracked
  const metrics = getValidationMetrics();
  console.log('Fallback usages:', metrics.fallbackUsages);
}

/**
 * Example 4: Manually tracking fallback usage
 */
export function exampleManualFallbackTracking() {
  // In API routes, you can manually track fallback usage
  trackFallbackUsage('numerology', 'Gemini API returned invalid JSON');
  
  const metrics = getValidationMetrics();
  console.log('Fallback usages:', metrics.fallbackUsages);
}

/**
 * Example 5: Retrieving error logs
 */
export function exampleErrorLogs() {
  // Get all error logs
  const allLogs = getErrorLogs();
  console.log('Total error logs:', allLogs.length);
  
  // Get only validation errors
  const validationErrors = getErrorLogs({ errorType: 'validation' });
  console.log('Validation errors:', validationErrors.length);
  
  // Get errors for specific divination type
  const tarotErrors = getErrorLogs({ divinationType: 'tarot' });
  console.log('Tarot errors:', tarotErrors.length);
  
  // Get recent errors (last 10)
  const recentErrors = getErrorLogs({ limit: 10 });
  console.log('Recent errors:', recentErrors);
  
  // Get errors since a specific date
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const recentByDate = getErrorLogs({ since: yesterday });
  console.log('Errors since yesterday:', recentByDate.length);
}

/**
 * Example 6: Monitoring validation quality in production
 */
export function exampleProductionMonitoring() {
  // This could be called periodically (e.g., every hour) to monitor quality
  const metrics = getValidationMetrics();
  const passRate = getValidationPassRate();
  const fallbackRate = getFallbackUsageRate();
  
  // Alert if pass rate drops below threshold
  if (passRate !== null && passRate < 90) {
    console.warn(`⚠️ Validation pass rate is low: ${passRate.toFixed(2)}%`);
    
    // Get recent errors to investigate
    const recentErrors = getErrorLogs({ limit: 5 });
    console.log('Recent errors:', recentErrors);
  }
  
  // Alert if fallback usage is high
  if (fallbackRate !== null && fallbackRate > 10) {
    console.warn(`⚠️ Fallback usage is high: ${fallbackRate.toFixed(2)}%`);
  }
  
  // Log summary
  console.log('Validation Quality Summary:', {
    totalValidations: metrics.totalValidations,
    passRate: passRate ? `${passRate.toFixed(2)}%` : 'N/A',
    fallbackRate: fallbackRate ? `${fallbackRate.toFixed(2)}%` : 'N/A',
    topErrors: Object.entries(metrics.errorsByType)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
  });
}

/**
 * Example 7: Integration with API routes
 */
export async function exampleAPIIntegration(geminiResponse: unknown) {
  try {
    // Parse Gemini response
    const parsed = JSON.parse(JSON.stringify(geminiResponse));
    
    // Validate response
    const validation = validateAIResponse(parsed, 'tarot');
    
    if (!validation.isValid) {
      // Log validation failure (automatically done by validateAIResponse)
      console.error('Validation failed:', validation.errors);
      
      // Use fallback structure
      const fallbackStructure = ensureFortuneStructure(
        parsed.cardStructure || '',
        parsed.summary || 'ไม่สามารถสร้างคำทำนายได้',
        'tarot'
      );
      
      return {
        summary: parsed.summary || 'ไม่สามารถสร้างคำทำนายได้',
        cardStructure: fallbackStructure
      };
    }
    
    return parsed;
  } catch (error) {
    // Track API error
    trackFallbackUsage('tarot', `API error: ${error}`);
    
    // Return fallback
    return {
      summary: 'เกิดข้อผิดพลาดในการสร้างคำทำนาย',
      cardStructure: ensureFortuneStructure('', 'เกิดข้อผิดพลาด', 'tarot')
    };
  }
}
