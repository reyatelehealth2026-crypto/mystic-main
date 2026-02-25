/**
 * Unit tests for base prompt template system
 */

import { describe, it, expect } from '@jest/globals';
import { PromptBuilder, buildBasePrompt } from './base';
import type { FewShotExample, PromptSection } from '@/lib/ai/types';

describe('PromptBuilder', () => {
  describe('fluent API', () => {
    it('should build prompt with all sections in correct order', () => {
      const prompt = new PromptBuilder()
        .withRole('You are an expert')
        .withCulturalContext('Thai context')
        .withFewShotExamples([])
        .withInstructions('Do this task')
        .withUserData('User input')
        .build();

      expect(prompt).toContain('You are an expert');
      expect(prompt).toContain('Thai context');
      expect(prompt).toContain('Do this task');
      expect(prompt).toContain('User input');

      // Verify order
      const roleIndex = prompt.indexOf('You are an expert');
      const contextIndex = prompt.indexOf('Thai context');
      const instructionsIndex = prompt.indexOf('Do this task');
      const dataIndex = prompt.indexOf('User input');

      expect(roleIndex).toBeLessThan(contextIndex);
      expect(contextIndex).toBeLessThan(instructionsIndex);
      expect(instructionsIndex).toBeLessThan(dataIndex);
    });

    it('should build prompt with only required sections', () => {
      const prompt = new PromptBuilder()
        .withInstructions('Do this task')
        .withUserData('User input')
        .build();

      expect(prompt).toContain('Do this task');
      expect(prompt).toContain('User input');
      expect(prompt).not.toContain('undefined');
    });

    it('should support method chaining', () => {
      const builder = new PromptBuilder();
      const result = builder
        .withRole('Expert')
        .withInstructions('Task')
        .withUserData('Data');

      expect(result).toBe(builder);
    });
  });

  describe('few-shot examples formatting', () => {
    it('should format examples with clear boundaries', () => {
      const examples: FewShotExample[] = [
        {
          scenario: 'Test scenario',
          input: 'Test input',
          output: 'Test output',
        },
      ];

      const prompt = new PromptBuilder()
        .withFewShotExamples(examples)
        .withInstructions('Task')
        .withUserData('Data')
        .build();

      expect(prompt).toContain('ตัวอย่างการตีความที่ดี');
      expect(prompt).toContain('**INPUT:**');
      expect(prompt).toContain('**OUTPUT:**');
      expect(prompt).toContain('Test input');
      expect(prompt).toContain('Test output');
    });

    it('should format multiple examples with separators', () => {
      const examples: FewShotExample[] = [
        {
          scenario: 'Scenario 1',
          input: 'Input 1',
          output: 'Output 1',
        },
        {
          scenario: 'Scenario 2',
          input: 'Input 2',
          output: 'Output 2',
        },
      ];

      const prompt = new PromptBuilder()
        .withFewShotExamples(examples)
        .withInstructions('Task')
        .withUserData('Data')
        .build();

      expect(prompt).toContain('ตัวอย่างที่ 1');
      expect(prompt).toContain('ตัวอย่างที่ 2');
      expect(prompt).toContain('---');
    });

    it('should include notes when provided', () => {
      const examples: FewShotExample[] = [
        {
          scenario: 'Test',
          input: 'Input',
          output: 'Output',
          notes: 'Important note',
        },
      ];

      const prompt = new PromptBuilder()
        .withFewShotExamples(examples)
        .withInstructions('Task')
        .withUserData('Data')
        .build();

      expect(prompt).toContain('หมายเหตุ: Important note');
    });

    it('should handle empty examples array', () => {
      const prompt = new PromptBuilder()
        .withFewShotExamples([])
        .withInstructions('Task')
        .withUserData('Data')
        .build();

      expect(prompt).not.toContain('ตัวอย่าง');
      expect(prompt).toContain('Task');
      expect(prompt).toContain('Data');
    });
  });

  describe('buildBasePrompt', () => {
    it('should compose sections in correct order', () => {
      const sections: PromptSection = {
        role: 'Role section',
        culturalContext: 'Cultural section',
        fewShotExamples: 'Examples section',
        instructions: 'Instructions section',
        userData: 'Data section',
      };

      const prompt = buildBasePrompt(sections);

      const roleIndex = prompt.indexOf('Role section');
      const culturalIndex = prompt.indexOf('Cultural section');
      const examplesIndex = prompt.indexOf('Examples section');
      const instructionsIndex = prompt.indexOf('Instructions section');
      const dataIndex = prompt.indexOf('Data section');

      expect(roleIndex).toBeLessThan(culturalIndex);
      expect(culturalIndex).toBeLessThan(examplesIndex);
      expect(examplesIndex).toBeLessThan(instructionsIndex);
      expect(instructionsIndex).toBeLessThan(dataIndex);
    });

    it('should handle missing optional sections', () => {
      const sections: PromptSection = {
        instructions: 'Instructions',
        userData: 'Data',
      };

      const prompt = buildBasePrompt(sections);

      expect(prompt).toBe('Instructions\n\nData');
    });

    it('should separate sections with double newlines', () => {
      const sections: PromptSection = {
        role: 'Role',
        instructions: 'Instructions',
        userData: 'Data',
      };

      const prompt = buildBasePrompt(sections);

      expect(prompt).toContain('Role\n\nInstructions\n\nData');
    });

    it('should trim whitespace from final prompt', () => {
      const sections: PromptSection = {
        instructions: '  Instructions  ',
        userData: '  Data  ',
      };

      const prompt = buildBasePrompt(sections);

      expect(prompt).not.toMatch(/^\s/);
      expect(prompt).not.toMatch(/\s$/);
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings in sections', () => {
      const prompt = new PromptBuilder()
        .withRole('')
        .withCulturalContext('')
        .withInstructions('Task')
        .withUserData('Data')
        .build();

      expect(prompt).toContain('Task');
      expect(prompt).toContain('Data');
    });

    it('should handle very long content', () => {
      const longContent = 'A'.repeat(10000);
      const prompt = new PromptBuilder()
        .withInstructions(longContent)
        .withUserData('Data')
        .build();

      expect(prompt).toContain(longContent);
      expect(prompt.length).toBeGreaterThan(10000);
    });

    it('should handle special characters', () => {
      const specialChars = '!@#$%^&*(){}[]|\\:";\'<>?,./`~';
      const prompt = new PromptBuilder()
        .withInstructions(specialChars)
        .withUserData('Data')
        .build();

      expect(prompt).toContain(specialChars);
    });

    it('should handle Thai characters', () => {
      const thaiText = 'สวัสดีครับ ทดสอบภาษาไทย';
      const prompt = new PromptBuilder()
        .withInstructions(thaiText)
        .withUserData('Data')
        .build();

      expect(prompt).toContain(thaiText);
    });
  });
});
