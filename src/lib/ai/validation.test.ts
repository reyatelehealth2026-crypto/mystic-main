/**
 * Unit tests for response validation system
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  validateMinimumLength,
  validateStructureSections,
  ensureFortuneStructure,
  validateAIResponse,
  getValidationMetrics,
  getValidationPassRate,
  getFallbackUsageRate,
  getErrorLogs,
  resetMetrics,
  trackFallbackUsage,
  logError
} from './validation';
import type { AIResponse } from './types';

describe('validateMinimumLength', () => {
  it('should return true for text with enough Thai characters', () => {
    const text = 'สวัสดีครับ ยินดีต้อนรับสู่ระบบทำนายดวงชะตา ขอให้โชคดีนะครับ';
    expect(validateMinimumLength(text, 50)).toBe(true);
  });

  it('should return false for text with insufficient Thai characters', () => {
    const text = 'สวัสดีครับ';
    expect(validateMinimumLength(text, 50)).toBe(false);
  });

  it('should return false for empty text', () => {
    expect(validateMinimumLength('', 50)).toBe(false);
  });

  it('should not count English characters', () => {
    const text = 'Hello World สวัสดี';
    expect(validateMinimumLength(text, 10)).toBe(false);
  });

  it('should use default minimum of 50 characters', () => {
    const shortText = 'สวัสดี';
    expect(validateMinimumLength(shortText)).toBe(false);
  });
});

describe('validateStructureSections', () => {
  it('should return true when all required sections are present', () => {
    const structure = `
      ภาพรวมสถานการณ์: คุณกำลังเผชิญกับการตัดสินใจสำคัญ
      จุดที่ควรระวัง: อย่ารีบตัดสินใจ
      แนวทางที่ควรทำ: ใช้เวลาคิดให้รอบคอบ
    `;
    expect(validateStructureSections(structure)).toBe(true);
  });

  it('should return false when missing one section', () => {
    const structure = `
      ภาพรวมสถานการณ์: คุณกำลังเผชิญกับการตัดสินใจสำคัญ
      จุดที่ควรระวัง: อย่ารีบตัดสินใจ
    `;
    expect(validateStructureSections(structure)).toBe(false);
  });

  it('should return false for empty structure', () => {
    expect(validateStructureSections('')).toBe(false);
  });

  it('should work with custom required sections', () => {
    const structure = 'Section A: content\nSection B: content';
    expect(validateStructureSections(structure, ['Section A', 'Section B'])).toBe(true);
  });
});

describe('ensureFortuneStructure', () => {
  it('should return fallback structure for empty input', () => {
    const result = ensureFortuneStructure('', 'คำทำนายสั้น');
    expect(result).toContain('ภาพรวมสถานการณ์');
    expect(result).toContain('จุดที่ควรระวัง');
    expect(result).toContain('แนวทางที่ควรทำ');
    expect(result).toContain('คำทำนายสั้น');
  });

  it('should return input as-is if it already has labels', () => {
    const input = 'ภาพรวมสถานการณ์: test\nจุดที่ควรระวัง: test\nแนวทางที่ควรทำ: test';
    const result = ensureFortuneStructure(input, 'summary');
    expect(result).toBe(input);
  });

  it('should wrap unlabeled content with structure', () => {
    const input = 'Some content without labels';
    const summary = 'Summary text';
    const result = ensureFortuneStructure(input, summary);
    expect(result).toContain('ภาพรวมสถานการณ์');
    expect(result).toContain('จุดที่ควรระวัง');
    expect(result).toContain('แนวทางที่ควรทำ');
    expect(result).toContain(summary);
  });

  it('should normalize whitespace', () => {
    const input = '  content   with   extra   spaces  ';
    const result = ensureFortuneStructure(input, 'summary');
    expect(result).not.toContain('  ');
  });
});

describe('validateAIResponse', () => {
  beforeEach(() => {
    // Reset metrics before each test
    resetMetrics();
  });

  it('should validate a complete and valid response', () => {
    const response: AIResponse = {
      summary: 'สวัสดีครับ ยินดีต้อนรับสู่ระบบทำนายดวงชะตา ขอให้โชคดีนะครับ ขอให้โชคดี',
      cardStructure: `
        ภาพรวมสถานการณ์: คุณกำลังเผชิญกับการตัดสินใจสำคัญในชีวิต
        จุดที่ควรระวัง: อย่ารีบตัดสินใจจากอารมณ์หรือข้อมูลที่ยังไม่ครบ
        แนวทางที่ควรทำ: โฟกัส 1 ประเด็นหลัก วางขั้นตอน แล้วลงมือทีละส่วน
      `
    };
    const result = validateAIResponse(response, 'tarot');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should fail validation when summary is missing', () => {
    const response: AIResponse = {
      summary: '',
      cardStructure: 'ภาพรวมสถานการณ์: test\nจุดที่ควรระวัง: test\nแนวทางที่ควรทำ: test'
    };
    const result = validateAIResponse(response, 'tarot');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Summary is missing');
  });

  it('should fail validation when summary is too short', () => {
    const response: AIResponse = {
      summary: 'สั้นเกินไป',
      cardStructure: 'ภาพรวมสถานการณ์: test\nจุดที่ควรระวัง: test\nแนวทางที่ควรทำ: test'
    };
    const result = validateAIResponse(response, 'tarot');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Summary contains fewer than 50 Thai characters');
  });

  it('should fail validation when cardStructure is missing', () => {
    const response: AIResponse = {
      summary: 'สวัสดีครับ ยินดีต้อนรับสู่ระบบทำนายดวงชะตา ขอให้โชคดีนะครับ ขอให้โชคดี',
      cardStructure: ''
    };
    const result = validateAIResponse(response, 'tarot');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('CardStructure is missing');
  });

  it('should fail validation when cardStructure is missing required sections', () => {
    const response: AIResponse = {
      summary: 'สวัสดีครับ ยินดีต้อนรับสู่ระบบทำนายดวงชะตา ขอให้โชคดีนะครับ ขอให้โชคดี',
      cardStructure: 'ภาพรวมสถานการณ์: test only'
    };
    const result = validateAIResponse(response, 'tarot');
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('missing one or more required sections'))).toBe(true);
  });

  it('should add warnings for short but valid content', () => {
    const response: AIResponse = {
      summary: 'สวัสดีครับ ยินดีต้อนรับสู่ระบบทำนายดวงชะตา ขอให้โชคดีนะครับ ขอให้โชคดี',
      cardStructure: 'ภาพรวมสถานการณ์: test\nจุดที่ควรระวัง: test\nแนวทางที่ควรทำ: test'
    };
    const result = validateAIResponse(response, 'tarot');
    expect(result.isValid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('should track validation metrics', () => {
    const validResponse: AIResponse = {
      summary: 'สวัสดีครับ ยินดีต้อนรับสู่ระบบทำนายดวงชะตา ขอให้โชคดีนะครับ ขอให้โชคดี',
      cardStructure: 'ภาพรวมสถานการณ์: test\nจุดที่ควรระวัง: test\nแนวทางที่ควรทำ: test'
    };
    
    validateAIResponse(validResponse, 'tarot');
    
    const metrics = getValidationMetrics();
    expect(metrics.totalValidations).toBe(1);
    expect(metrics.passedValidations).toBe(1);
    expect(metrics.failedValidations).toBe(0);
  });

  it('should track failed validations', () => {
    const invalidResponse: AIResponse = {
      summary: '',
      cardStructure: ''
    };
    
    validateAIResponse(invalidResponse, 'spirit');
    
    const metrics = getValidationMetrics();
    expect(metrics.totalValidations).toBe(1);
    expect(metrics.passedValidations).toBe(0);
    expect(metrics.failedValidations).toBe(1);
    expect(metrics.errorsByDivinationType.spirit).toBe(1);
  });

  it('should track error types', () => {
    const invalidResponse: AIResponse = {
      summary: '',
      cardStructure: 'ภาพรวมสถานการณ์: test\nจุดที่ควรระวัง: test\nแนวทางที่ควรทำ: test'
    };
    
    validateAIResponse(invalidResponse, 'numerology');
    
    const metrics = getValidationMetrics();
    expect(metrics.errorsByType.summary_missing).toBe(1);
  });
});

describe('Metrics and Logging', () => {
  beforeEach(() => {
    resetMetrics();
  });

  describe('getValidationMetrics', () => {
    it('should return initial metrics', () => {
      const metrics = getValidationMetrics();
      expect(metrics.totalValidations).toBe(0);
      expect(metrics.passedValidations).toBe(0);
      expect(metrics.failedValidations).toBe(0);
      expect(metrics.fallbackUsages).toBe(0);
    });

    it('should return updated metrics after validations', () => {
      const validResponse: AIResponse = {
        summary: 'สวัสดีครับ ยินดีต้อนรับสู่ระบบทำนายดวงชะตา ขอให้โชคดีนะครับ ขอให้โชคดี',
        cardStructure: 'ภาพรวมสถานการณ์: test\nจุดที่ควรระวัง: test\nแนวทางที่ควรทำ: test'
      };
      
      validateAIResponse(validResponse, 'tarot');
      validateAIResponse(validResponse, 'spirit');
      
      const metrics = getValidationMetrics();
      expect(metrics.totalValidations).toBe(2);
      expect(metrics.passedValidations).toBe(2);
    });
  });

  describe('getValidationPassRate', () => {
    it('should return null when no validations', () => {
      expect(getValidationPassRate()).toBeNull();
    });

    it('should calculate pass rate correctly', () => {
      const validResponse: AIResponse = {
        summary: 'สวัสดีครับ ยินดีต้อนรับสู่ระบบทำนายดวงชะตา ขอให้โชคดีนะครับ ขอให้โชคดี',
        cardStructure: 'ภาพรวมสถานการณ์: test\nจุดที่ควรระวัง: test\nแนวทางที่ควรทำ: test'
      };
      const invalidResponse: AIResponse = {
        summary: '',
        cardStructure: ''
      };
      
      validateAIResponse(validResponse, 'tarot');
      validateAIResponse(invalidResponse, 'tarot');
      
      expect(getValidationPassRate()).toBe(50);
    });

    it('should return 100 for all passing validations', () => {
      const validResponse: AIResponse = {
        summary: 'สวัสดีครับ ยินดีต้อนรับสู่ระบบทำนายดวงชะตา ขอให้โชคดีนะครับ ขอให้โชคดี',
        cardStructure: 'ภาพรวมสถานการณ์: test\nจุดที่ควรระวัง: test\nแนวทางที่ควรทำ: test'
      };
      
      validateAIResponse(validResponse, 'tarot');
      validateAIResponse(validResponse, 'spirit');
      
      expect(getValidationPassRate()).toBe(100);
    });
  });

  describe('getFallbackUsageRate', () => {
    it('should return null when no validations', () => {
      expect(getFallbackUsageRate()).toBeNull();
    });

    it('should calculate fallback usage rate correctly', () => {
      const validResponse: AIResponse = {
        summary: 'สวัสดีครับ ยินดีต้อนรับสู่ระบบทำนายดวงชะตา ขอให้โชคดีนะครับ ขอให้โชคดี',
        cardStructure: 'ภาพรวมสถานการณ์: test\nจุดที่ควรระวัง: test\nแนวทางที่ควรทำ: test'
      };
      
      validateAIResponse(validResponse, 'tarot');
      trackFallbackUsage('tarot', 'Test fallback');
      validateAIResponse(validResponse, 'spirit');
      
      // 1 fallback out of 2 validations = 50%
      expect(getFallbackUsageRate()).toBe(50);
    });
  });

  describe('trackFallbackUsage', () => {
    it('should increment fallback counter', () => {
      trackFallbackUsage('tarot', 'Empty input');
      
      const metrics = getValidationMetrics();
      expect(metrics.fallbackUsages).toBe(1);
    });

    it('should log fallback usage', () => {
      trackFallbackUsage('numerology', 'Missing sections');
      
      const logs = getErrorLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].divinationType).toBe('numerology');
      expect(logs[0].errorMessage).toContain('Fallback structure used');
    });
  });

  describe('logError', () => {
    it('should add error to logs', () => {
      logError({
        timestamp: new Date(),
        errorType: 'validation',
        divinationType: 'tarot',
        errorMessage: 'Test error',
        context: { test: true }
      });
      
      const logs = getErrorLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].errorMessage).toBe('Test error');
    });
  });

  describe('getErrorLogs', () => {
    beforeEach(() => {
      logError({
        timestamp: new Date('2024-01-01'),
        errorType: 'validation',
        divinationType: 'tarot',
        errorMessage: 'Error 1',
        context: {}
      });
      logError({
        timestamp: new Date('2024-01-02'),
        errorType: 'api',
        divinationType: 'spirit',
        errorMessage: 'Error 2',
        context: {}
      });
      logError({
        timestamp: new Date('2024-01-03'),
        errorType: 'validation',
        divinationType: 'numerology',
        errorMessage: 'Error 3',
        context: {}
      });
    });

    it('should return all logs without filters', () => {
      const logs = getErrorLogs();
      expect(logs.length).toBe(3);
    });

    it('should filter by error type', () => {
      const logs = getErrorLogs({ errorType: 'validation' });
      expect(logs.length).toBe(2);
      expect(logs.every(log => log.errorType === 'validation')).toBe(true);
    });

    it('should filter by divination type', () => {
      const logs = getErrorLogs({ divinationType: 'spirit' });
      expect(logs.length).toBe(1);
      expect(logs[0].divinationType).toBe('spirit');
    });

    it('should filter by date', () => {
      const logs = getErrorLogs({ since: new Date('2024-01-02') });
      expect(logs.length).toBe(2);
    });

    it('should limit results', () => {
      const logs = getErrorLogs({ limit: 2 });
      expect(logs.length).toBe(2);
    });

    it('should combine multiple filters', () => {
      const logs = getErrorLogs({
        errorType: 'validation',
        limit: 1
      });
      expect(logs.length).toBe(1);
      expect(logs[0].errorType).toBe('validation');
    });
  });

  describe('resetMetrics', () => {
    it('should reset all metrics to initial state', () => {
      const validResponse: AIResponse = {
        summary: 'สวัสดีครับ ยินดีต้อนรับสู่ระบบทำนายดวงชะตา ขอให้โชคดีนะครับ ขอให้โชคดี',
        cardStructure: 'ภาพรวมสถานการณ์: test\nจุดที่ควรระวัง: test\nแนวทางที่ควรทำ: test'
      };
      
      validateAIResponse(validResponse, 'tarot');
      trackFallbackUsage('tarot', 'Test');
      
      resetMetrics();
      
      const metrics = getValidationMetrics();
      expect(metrics.totalValidations).toBe(0);
      expect(metrics.passedValidations).toBe(0);
      expect(metrics.failedValidations).toBe(0);
      expect(metrics.fallbackUsages).toBe(0);
      expect(getErrorLogs().length).toBe(0);
    });
  });

  describe('ensureFortuneStructure with tracking', () => {
    it('should track fallback when input is empty', () => {
      ensureFortuneStructure('', 'summary', 'tarot');
      
      const metrics = getValidationMetrics();
      expect(metrics.fallbackUsages).toBe(1);
    });

    it('should track fallback when labels are missing', () => {
      ensureFortuneStructure('content without labels', 'summary', 'spirit');
      
      const metrics = getValidationMetrics();
      expect(metrics.fallbackUsages).toBe(1);
    });

    it('should not track fallback when structure is valid', () => {
      const validStructure = 'ภาพรวมสถานการณ์: test\nจุดที่ควรระวัง: test\nแนวทางที่ควรทำ: test';
      ensureFortuneStructure(validStructure, 'summary', 'numerology');
      
      const metrics = getValidationMetrics();
      expect(metrics.fallbackUsages).toBe(0);
    });

    it('should work without type parameter for backward compatibility', () => {
      const result = ensureFortuneStructure('', 'summary');
      expect(result).toContain('ภาพรวมสถานการณ์');
      
      // Should not track when type is not provided
      const metrics = getValidationMetrics();
      expect(metrics.fallbackUsages).toBe(0);
    });
  });
});
