/**
 * Example usage of PromptBuilder class
 * 
 * This file demonstrates how to use the PromptBuilder for creating AI prompts
 */

import { PromptBuilder } from './base';
import { getContextForDivinationType } from '@/lib/ai/cultural/thai-context';
import type { FewShotExample } from '@/lib/ai/types';

// Example 1: Simple prompt with minimal sections
export function createSimplePrompt(): string {
  return new PromptBuilder()
    .withInstructions('Provide a tarot card interpretation')
    .withUserData('Card: The Fool (upright)')
    .build();
}

// Example 2: Complete prompt with all sections
export function createCompletePrompt(): string {
  const examples: FewShotExample[] = [
    {
      scenario: 'Positive reading',
      input: 'Card: The Sun (upright)',
      output: '{"summary": "ความสุข ความสำเร็จ พลังงานบวก"}',
    },
  ];

  return new PromptBuilder()
    .withRole('คุณคือหมอดูไพ่ทาโรต์ผู้เชี่ยวชาญที่มีประสบการณ์มากกว่า 20 ปี')
    .withCulturalContext(getContextForDivinationType('tarot'))
    .withFewShotExamples(examples)
    .withInstructions(`
กรุณาตีความไพ่ทาโรต์โดย:
1. ให้คำแนะนำที่ชัดเจนและปฏิบัติได้จริง
2. อธิบายความสัมพันธ์ระหว่างไพ่
3. ระบุจุดที่ควรระวังอย่างเฉพาะเจาะจง
4. ให้แนวทางปฏิบัติทีละขั้นตอน
    `.trim())
    .withUserData('ไพ่ที่เปิด: The Fool, The Magician, The High Priestess')
    .build();
}

// Example 3: Prompt with cultural context only
export function createCulturalPrompt(): string {
  return new PromptBuilder()
    .withRole('คุณคือผู้เชี่ยวชาญด้านเลขศาสตร์ไทย')
    .withCulturalContext(getContextForDivinationType('numerology'))
    .withInstructions('วิเคราะห์ความหมายของเบอร์โทรศัพท์')
    .withUserData('เบอร์: 081-234-5678')
    .build();
}

// Example 4: Demonstrate method chaining
export function createChainedPrompt(): string {
  const builder = new PromptBuilder();
  
  return builder
    .withRole('Expert fortune teller')
    .withInstructions('Interpret the spirit card')
    .withUserData('Birth date: 15/03/1990, Card: The Empress')
    .build();
}

// Example 5: Prompt with multiple examples
export function createMultiExamplePrompt(): string {
  const examples: FewShotExample[] = [
    {
      scenario: 'High score numerology',
      input: 'Score: 87/99',
      output: '{"summary": "เบอร์มงคลระดับดีมาก"}',
      notes: 'Positive framing for high scores',
    },
    {
      scenario: 'Low score numerology',
      input: 'Score: 35/99',
      output: '{"summary": "มีโอกาสปรับปรุง"}',
      notes: 'Constructive framing for low scores',
    },
  ];

  return new PromptBuilder()
    .withRole('Numerology expert')
    .withFewShotExamples(examples)
    .withInstructions('Analyze phone number with appropriate tone based on score')
    .withUserData('Phone: 081-234-5678, Score: 65/99')
    .build();
}

// Verify all examples compile and produce output
if (require.main === module) {
  console.log('=== Simple Prompt ===');
  console.log(createSimplePrompt());
  console.log('\n=== Complete Prompt ===');
  console.log(createCompletePrompt());
  console.log('\n=== Cultural Prompt ===');
  console.log(createCulturalPrompt());
  console.log('\n=== Chained Prompt ===');
  console.log(createChainedPrompt());
  console.log('\n=== Multi-Example Prompt ===');
  console.log(createMultiExamplePrompt());
}
