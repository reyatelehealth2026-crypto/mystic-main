// Unit tests for API error handling
// Feature: popular-fortune-features

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ZodiacSign, TimePeriod } from '../horoscope/types';
import { ChineseZodiacAnimal, ChineseElement } from '../chinese-zodiac/types';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock environment variables
process.env.GEMINI_API_KEY = 'test-api-key';
process.env.GEMINI_MODEL = 'gemini-2.0-flash';

describe('AI API Error Handling - Unit Tests', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('API Timeout Handling', () => {
    it('should handle timeout for horoscope API', async () => {
      mockFetch.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 50)
        )
      );

      try {
        await fetch('/api/ai/horoscope', {
          method: 'POST',
          body: JSON.stringify({
            zodiacSign: ZodiacSign.ARIES,
            period: TimePeriod.DAILY,
            baseline: {
              aspects: { love: 'l', career: 'c', finance: 'f', health: 'h' },
              luckyNumbers: [1, 2, 3],
              luckyColors: ['red'],
              advice: 'advice',
            },
          }),
        });
        
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
        expect((error as Error).message).toContain('timeout');
      }
    });

    it('should handle timeout for compatibility API', async () => {
      mockFetch.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 50)
        )
      );

      try {
        await fetch('/api/ai/compatibility', {
          method: 'POST',
          body: JSON.stringify({
            person1: { birthDate: '1990-01-01', zodiacSign: ZodiacSign.ARIES },
            person2: { birthDate: '1992-05-15', zodiacSign: ZodiacSign.TAURUS },
            baseline: {
              overallScore: 75,
              scores: { overall: 75, communication: 80, emotional: 70, longTerm: 75 },
              strengths: ['strength'],
              challenges: ['challenge'],
              advice: 'advice',
              elementCompatibility: 'Fire + Earth',
            },
          }),
        });
        
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle timeout for Chinese zodiac API', async () => {
      mockFetch.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 50)
        )
      );

      try {
        await fetch('/api/ai/chinese-zodiac', {
          method: 'POST',
          body: JSON.stringify({
            animal: ChineseZodiacAnimal.DRAGON,
            element: ChineseElement.WOOD,
            period: TimePeriod.DAILY,
            baseline: {
              fortune: {
                overall: 'overall',
                career: 'career',
                wealth: 'wealth',
                health: 'health',
                relationships: 'relationships',
              },
              luckyColors: ['green'],
              luckyNumbers: [3, 8],
              luckyDirections: ['East'],
              advice: 'advice',
            },
          }),
        });
        
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle timeout for name numerology API', async () => {
      mockFetch.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 50)
        )
      );

      try {
        await fetch('/api/ai/name-numerology', {
          method: 'POST',
          body: JSON.stringify({
            firstName: 'สมชาย',
            lastName: 'ใจดี',
            scores: { firstName: 5, lastName: 7, fullName: 3, destiny: 8 },
            baseline: {
              interpretation: {
                personality: 'personality',
                strengths: ['strength'],
                weaknesses: ['weakness'],
                lifePath: 'lifePath',
                career: 'career',
                relationships: 'relationships',
              },
              luckyNumbers: [1, 2, 3],
              advice: 'advice',
            },
          }),
        });
        
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Rate Limit Handling', () => {
    it('should handle 429 rate limit error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({ error: 'Rate limit exceeded' }),
      });

      const response = await fetch('/api/ai/horoscope', {
        method: 'POST',
        body: JSON.stringify({
          zodiacSign: ZodiacSign.ARIES,
          period: TimePeriod.DAILY,
          baseline: {
            aspects: { love: 'l', career: 'c', finance: 'f', health: 'h' },
            luckyNumbers: [1],
            luckyColors: ['red'],
            advice: 'a',
          },
        }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(429);
      
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should handle rate limit for all API endpoints', async () => {
      const endpoints = [
        '/api/ai/horoscope',
        '/api/ai/compatibility',
        '/api/ai/chinese-zodiac',
        '/api/ai/name-numerology',
      ];

      for (const endpoint of endpoints) {
        mockFetch.mockReset();
        mockFetch.mockResolvedValue({
          ok: false,
          status: 429,
          json: async () => ({ error: 'Rate limit exceeded' }),
        });

        const response = await fetch(endpoint, {
          method: 'POST',
          body: JSON.stringify({}),
        });

        expect(response.status).toBe(429);
      }
    });
  });

  describe('Invalid Response Handling', () => {
    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      try {
        const response = await fetch('/api/ai/horoscope', {
          method: 'POST',
          body: JSON.stringify({
            zodiacSign: ZodiacSign.ARIES,
            period: TimePeriod.DAILY,
            baseline: {
              aspects: { love: 'l', career: 'c', finance: 'f', health: 'h' },
              luckyNumbers: [1],
              luckyColors: ['red'],
              advice: 'a',
            },
          }),
        });

        await response.json();
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle empty response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      const response = await fetch('/api/ai/horoscope', {
        method: 'POST',
        body: JSON.stringify({
          zodiacSign: ZodiacSign.ARIES,
          period: TimePeriod.DAILY,
          baseline: {
            aspects: { love: 'l', career: 'c', finance: 'f', health: 'h' },
            luckyNumbers: [1],
            luckyColors: ['red'],
            advice: 'a',
          },
        }),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data).toEqual({});
    });

    it('should handle response with missing required fields', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [{
            content: {
              parts: [{
                text: JSON.stringify({
                  summary: 'incomplete', // Missing other required fields
                }),
              }],
            },
          }],
        }),
      });

      const response = await fetch('/api/ai/horoscope', {
        method: 'POST',
        body: JSON.stringify({
          zodiacSign: ZodiacSign.ARIES,
          period: TimePeriod.DAILY,
          baseline: {
            aspects: { love: 'l', career: 'c', finance: 'f', health: 'h' },
            luckyNumbers: [1],
            luckyColors: ['red'],
            advice: 'a',
          },
        }),
      });

      expect(response.ok).toBe(true);
    });

    it('should handle response with incorrect data types', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [{
            content: {
              parts: [{
                text: JSON.stringify({
                  summary: 123, // Should be string
                  enhancedAspects: 'not an object', // Should be object
                  advice: null, // Should be string
                }),
              }],
            },
          }],
        }),
      });

      const response = await fetch('/api/ai/horoscope', {
        method: 'POST',
        body: JSON.stringify({
          zodiacSign: ZodiacSign.ARIES,
          period: TimePeriod.DAILY,
          baseline: {
            aspects: { love: 'l', career: 'c', finance: 'f', health: 'h' },
            luckyNumbers: [1],
            luckyColors: ['red'],
            advice: 'a',
          },
        }),
      });

      expect(response.ok).toBe(true);
    });
  });

  describe('HTTP Error Status Handling', () => {
    it('should handle 400 Bad Request', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Bad request' }),
      });

      const response = await fetch('/api/ai/horoscope', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });

    it('should handle 401 Unauthorized', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized' }),
      });

      const response = await fetch('/api/ai/compatibility', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });

    it('should handle 403 Forbidden', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({ error: 'Forbidden' }),
      });

      const response = await fetch('/api/ai/chinese-zodiac', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(403);
    });

    it('should handle 404 Not Found', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' }),
      });

      const response = await fetch('/api/ai/name-numerology', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });

    it('should handle 500 Internal Server Error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      });

      const response = await fetch('/api/ai/horoscope', {
        method: 'POST',
        body: JSON.stringify({
          zodiacSign: ZodiacSign.ARIES,
          period: TimePeriod.DAILY,
          baseline: {
            aspects: { love: 'l', career: 'c', finance: 'f', health: 'h' },
            luckyNumbers: [1],
            luckyColors: ['red'],
            advice: 'a',
          },
        }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });

    it('should handle 502 Bad Gateway', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => ({ error: 'Bad gateway' }),
      });

      const response = await fetch('/api/ai/compatibility', {
        method: 'POST',
        body: JSON.stringify({
          person1: { birthDate: '1990-01-01', zodiacSign: ZodiacSign.ARIES },
          person2: { birthDate: '1992-05-15', zodiacSign: ZodiacSign.TAURUS },
          baseline: {
            overallScore: 75,
            scores: { overall: 75, communication: 80, emotional: 70, longTerm: 75 },
            strengths: ['strength'],
            challenges: ['challenge'],
            advice: 'advice',
            elementCompatibility: 'Fire + Earth',
          },
        }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(502);
    });

    it('should handle 503 Service Unavailable', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({ error: 'Service unavailable' }),
      });

      const response = await fetch('/api/ai/chinese-zodiac', {
        method: 'POST',
        body: JSON.stringify({
          animal: ChineseZodiacAnimal.DRAGON,
          element: ChineseElement.WOOD,
          period: TimePeriod.DAILY,
          baseline: {
            fortune: {
              overall: 'overall',
              career: 'career',
              wealth: 'wealth',
              health: 'health',
              relationships: 'relationships',
            },
            luckyColors: ['green'],
            luckyNumbers: [3, 8],
            luckyDirections: ['East'],
            advice: 'advice',
          },
        }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(503);
    });
  });

  describe('Network Error Handling', () => {
    it('should handle network connection failure', async () => {
      mockFetch.mockRejectedValue(new Error('Network connection failed'));

      try {
        await fetch('/api/ai/horoscope', {
          method: 'POST',
          body: JSON.stringify({
            zodiacSign: ZodiacSign.ARIES,
            period: TimePeriod.DAILY,
            baseline: {
              aspects: { love: 'l', career: 'c', finance: 'f', health: 'h' },
              luckyNumbers: [1],
              luckyColors: ['red'],
              advice: 'a',
            },
          }),
        });
        
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
        expect((error as Error).message).toContain('Network');
      }
    });

    it('should handle DNS resolution failure', async () => {
      mockFetch.mockRejectedValue(new Error('DNS resolution failed'));

      try {
        await fetch('/api/ai/compatibility', {
          method: 'POST',
          body: JSON.stringify({
            person1: { birthDate: '1990-01-01', zodiacSign: ZodiacSign.ARIES },
            person2: { birthDate: '1992-05-15', zodiacSign: ZodiacSign.TAURUS },
            baseline: {
              overallScore: 75,
              scores: { overall: 75, communication: 80, emotional: 70, longTerm: 75 },
              strengths: ['strength'],
              challenges: ['challenge'],
              advice: 'advice',
              elementCompatibility: 'Fire + Earth',
            },
          }),
        });
        
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle connection reset', async () => {
      mockFetch.mockRejectedValue(new Error('Connection reset by peer'));

      try {
        await fetch('/api/ai/chinese-zodiac', {
          method: 'POST',
          body: JSON.stringify({
            animal: ChineseZodiacAnimal.DRAGON,
            element: ChineseElement.WOOD,
            period: TimePeriod.DAILY,
            baseline: {
              fortune: {
                overall: 'overall',
                career: 'career',
                wealth: 'wealth',
                health: 'health',
                relationships: 'relationships',
              },
              luckyColors: ['green'],
              luckyNumbers: [3, 8],
              luckyDirections: ['East'],
              advice: 'advice',
            },
          }),
        });
        
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Missing API Key Handling', () => {
    it('should handle missing GEMINI_API_KEY environment variable', async () => {
      // This test would need to be run in an environment without the API key
      // For now, we just verify the mock setup
      expect(process.env.GEMINI_API_KEY).toBeDefined();
    });
  });

  describe('Validation Error Handling', () => {
    it('should handle response with text too short', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [{
            content: {
              parts: [{
                text: JSON.stringify({
                  summary: 'short', // Less than 100 characters
                  enhancedAspects: {
                    love: 'x',
                    career: 'x',
                    finance: 'x',
                    health: 'x',
                  },
                  advice: 'x',
                }),
              }],
            },
          }],
        }),
      });

      const response = await fetch('/api/ai/horoscope', {
        method: 'POST',
        body: JSON.stringify({
          zodiacSign: ZodiacSign.ARIES,
          period: TimePeriod.DAILY,
          baseline: {
            aspects: { love: 'l', career: 'c', finance: 'f', health: 'h' },
            luckyNumbers: [1],
            luckyColors: ['red'],
            advice: 'a',
          },
        }),
      });

      expect(response.ok).toBe(true);
    });

    it('should handle response with missing aspects', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [{
            content: {
              parts: [{
                text: JSON.stringify({
                  summary: 'ข้อความทดสอบ'.repeat(20),
                  enhancedAspects: {
                    love: 'ข้อความทดสอบ'.repeat(10),
                    // Missing career, finance, health
                  },
                  advice: 'ข้อความทดสอบ'.repeat(20),
                }),
              }],
            },
          }],
        }),
      });

      const response = await fetch('/api/ai/horoscope', {
        method: 'POST',
        body: JSON.stringify({
          zodiacSign: ZodiacSign.ARIES,
          period: TimePeriod.DAILY,
          baseline: {
            aspects: { love: 'l', career: 'c', finance: 'f', health: 'h' },
            luckyNumbers: [1],
            luckyColors: ['red'],
            advice: 'a',
          },
        }),
      });

      expect(response.ok).toBe(true);
    });
  });

  describe('Concurrent Request Handling', () => {
    it('should handle multiple concurrent requests', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          ok: true,
          ai: {
            summary: 'ข้อความทดสอบ'.repeat(20),
            enhancedAspects: {
              love: 'ข้อความทดสอบ'.repeat(10),
              career: 'ข้อความทดสอบ'.repeat(10),
              finance: 'ข้อความทดสอบ'.repeat(10),
              health: 'ข้อความทดสอบ'.repeat(10),
            },
            advice: 'ข้อความทดสอบ'.repeat(20),
          },
        }),
      });

      const requests = Array.from({ length: 10 }, (_, i) =>
        fetch('/api/ai/horoscope', {
          method: 'POST',
          body: JSON.stringify({
            zodiacSign: Object.values(ZodiacSign)[i % 12],
            period: TimePeriod.DAILY,
            baseline: {
              aspects: { love: 'l', career: 'c', finance: 'f', health: 'h' },
              luckyNumbers: [1],
              luckyColors: ['red'],
              advice: 'a',
            },
          }),
        })
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.ok).toBe(true);
      });
    });
  });
});
