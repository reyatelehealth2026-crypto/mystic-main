/**
 * Base Prompt Template System
 * 
 * This module provides the core PromptBuilder class and helper functions
 * for constructing AI prompts with consistent structure and composition.
 */

import type { PromptSection, FewShotExample } from '@/lib/ai/types';

/**
 * PromptBuilder class for fluent prompt construction
 * 
 * Provides a chainable API for building prompts with consistent section ordering:
 * role → cultural context → few-shot examples → instructions → user data
 * 
 * @example
 * ```typescript
 * const prompt = new PromptBuilder()
 *   .withRole('You are an expert tarot reader')
 *   .withCulturalContext(THAI_BUDDHIST_PHILOSOPHY)
 *   .withFewShotExamples(TAROT_EXAMPLES)
 *   .withInstructions('Provide a 3-card reading')
 *   .withUserData('Cards: The Fool, The Magician, The High Priestess')
 *   .build();
 * ```
 */
export class PromptBuilder {
  private sections: PromptSection & { knowledgeBase?: string } = {
    instructions: '',
    userData: '',
  };

  /**
   * Set the role/persona for the AI
   * 
   * @param role - Description of the AI's role and expertise
   * @returns This builder instance for chaining
   */
  withRole(role: string): this {
    this.sections.role = role;
    return this;
  }

  /**
   * Add Knowledge Base context to the prompt
   * 
   * @param kb - Formatted knowledge base content from RAG
   * @returns This builder instance for chaining
   */
  withKnowledgeBase(kb: string): this {
    this.sections.knowledgeBase = kb;
    return this;
  }

  /**
   * Add Thai cultural context to the prompt
   * 
   * @param context - Cultural context string (Buddhist philosophy, astrology, etc.)
   * @returns This builder instance for chaining
   */
  withCulturalContext(context: string): this {
    this.sections.culturalContext = context;
    return this;
  }

  /**
   * Add few-shot learning examples to the prompt
   * 
   * @param examples - Array of example input-output pairs
   * @returns This builder instance for chaining
   */
  withFewShotExamples(examples: FewShotExample[]): this {
    this.sections.fewShotExamples = formatFewShotExamples(examples);
    return this;
  }

  /**
   * Set specific instructions for the AI task
   * 
   * @param instructions - Detailed instructions for the AI
   * @returns This builder instance for chaining
   */
  withInstructions(instructions: string): this {
    this.sections.instructions = instructions;
    return this;
  }

  /**
   * Set the user data/input for the AI to process
   * 
   * @param data - User-specific data (cards, numbers, questions, etc.)
   * @returns This builder instance for chaining
   */
  withUserData(data: string): this {
    this.sections.userData = data;
    return this;
  }

  /**
   * Build the final prompt string with all sections in order
   * 
   * @returns Complete prompt string ready for AI API
   */
  build(): string {
    return buildBasePrompt(this.sections);
  }
}

/**
 * Build a complete prompt from sections in consistent order
 * 
 * Order: role → knowledge base → cultural context → few-shot examples → instructions → user data
 * 
 * @param sections - Prompt sections to compose
 * @returns Formatted prompt string
 */
export function buildBasePrompt(sections: PromptSection & { knowledgeBase?: string }): string {
  const parts: string[] = [];

  // Add sections in consistent order
  if (sections.role) {
    parts.push(sections.role);
  }

  if (sections.knowledgeBase) {
    parts.push(sections.knowledgeBase);
  }

  if (sections.culturalContext) {
    parts.push(sections.culturalContext);
  }

  if (sections.fewShotExamples) {
    parts.push(sections.fewShotExamples);
  }

  // Instructions are required
  if (sections.instructions) {
    parts.push(sections.instructions);
  }

  // User data is required
  if (sections.userData) {
    parts.push(sections.userData);
  }

  // Join with double newlines for clear section separation
  return parts.join('\n\n').trim();
}

/**
 * Format few-shot examples with clear input-output boundaries
 * 
 * @param examples - Array of few-shot examples
 * @returns Formatted examples string
 */
function formatFewShotExamples(examples: FewShotExample[]): string {
  if (examples.length === 0) {
    return '';
  }

  const header = '## ตัวอย่างการตีความที่ดี (Few-Shot Examples)\n';
  
  const formattedExamples = examples.map((example, index) => {
    const parts = [
      `### ตัวอย่างที่ ${index + 1}: ${example.scenario}`,
      '',
      '**INPUT:**',
      example.input.trim(),
      '',
      '**OUTPUT:**',
      example.output.trim(),
    ];

    if (example.notes) {
      parts.push('', `*หมายเหตุ: ${example.notes}*`);
    }

    return parts.join('\n');
  });

  return header + '\n' + formattedExamples.join('\n\n---\n\n');
}
