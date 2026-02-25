/**
 * Tests for main prompt builder interface
 * 
 * These tests verify that the main prompts.ts module correctly exports
 * all prompt builder functions and they can be imported and used.
 */

import { describe, it, expect } from 'vitest';
import {
  buildTarotPrompt,
  buildSpiritPrompt,
  buildNumerologyPrompt,
  buildChatPrompt,
  PromptBuilder,
  buildBasePrompt,
} from './prompts';

describe('Main Prompt Builder Interface', () => {
  describe('Exports', () => {
    it('should export buildTarotPrompt function', () => {
      expect(buildTarotPrompt).toBeDefined();
      expect(typeof buildTarotPrompt).toBe('function');
    });

    it('should export buildSpiritPrompt function', () => {
      expect(buildSpiritPrompt).toBeDefined();
      expect(typeof buildSpiritPrompt).toBe('function');
    });

    it('should export buildNumerologyPrompt function', () => {
      expect(buildNumerologyPrompt).toBeDefined();
      expect(typeof buildNumerologyPrompt).toBe('function');
    });

    it('should export buildChatPrompt function', () => {
      expect(buildChatPrompt).toBeDefined();
      expect(typeof buildChatPrompt).toBe('function');
    });

    it('should export PromptBuilder class', () => {
      expect(PromptBuilder).toBeDefined();
      expect(typeof PromptBuilder).toBe('function');
    });

    it('should export buildBasePrompt function', () => {
      expect(buildBasePrompt).toBeDefined();
      expect(typeof buildBasePrompt).toBe('function');
    });
  });

  describe('PromptBuilder class', () => {
    it('should create a PromptBuilder instance', () => {
      const builder = new PromptBuilder();
      expect(builder).toBeInstanceOf(PromptBuilder);
    });

    it('should build a basic prompt', () => {
      const prompt = new PromptBuilder()
        .withRole('Test role')
        .withInstructions('Test instructions')
        .withUserData('Test data')
        .build();

      expect(prompt).toContain('Test role');
      expect(prompt).toContain('Test instructions');
      expect(prompt).toContain('Test data');
    });
  });

  describe('buildBasePrompt function', () => {
    it('should build a prompt from sections', () => {
      const prompt = buildBasePrompt({
        role: 'Test role',
        instructions: 'Test instructions',
        userData: 'Test data',
      });

      expect(prompt).toContain('Test role');
      expect(prompt).toContain('Test instructions');
      expect(prompt).toContain('Test data');
    });
  });
});
