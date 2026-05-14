/**
 * Numerology Prompt Template Builder
 * 
 * This module provides specialized prompt building for numerology readings with:
 * - Score-based framing logic (high vs low scores)
 * - Root number significance explanation
 * - Theme analysis instructions (work, money, relationships, caution)
 * - Thai cultural number beliefs integration
 * - Constructive guidance for all score ranges
 */

import type { NumerologyPromptParams } from '@/lib/ai/types';
import { PromptBuilder } from './base';
import { getContextForDivinationType } from '../cultural/thai-context';
import { NUMEROLOGY_EXAMPLES_BY_SCORE } from '../examples/numerology-examples';

/**
 * Build a complete numerology reading prompt with score-specific instructions.
 *
 * RAG knowledge base is intentionally NOT fetched here — the API route owns
 * RAG retrieval and appends the formatted context after the base prompt.
 *
 * @param params - Numerology reading parameters (phone, score, tier, total, root, themes)
 * @returns Complete prompt string ready for Gemini API
 */
export function buildNumerologyPrompt(params: NumerologyPromptParams): string {
  const { score } = params;

  // Build role definition
  const role = buildNumerologyRole();

  // Get Thai cultural context for numerology
  const culturalContext = getContextForDivinationType('numerology');

  // Select appropriate few-shot examples based on score
  const examples = selectExamplesForScore(score);

  // Build score-specific instructions
  const instructions = buildNumerologyInstructions(params);

  // Format user data (phone number and analysis)
  const userData = formatNumerologyUserData(params);

  // Compose the complete prompt
  return new PromptBuilder()
    .withRole(role)
    .withCulturalContext(culturalContext)
    .withFewShotExamples(examples)
    .withInstructions(instructions)
    .withUserData(userData)
    .build();
}

/**
 * Build the role definition for numerology reading AI
 */
function buildNumerologyRole(): string {
  return `คุณคือผู้เชี่ยวชาญด้านเลขศาสตร์ไทยที่ทำงานกับโปรเจกต์ REFFORTUNE

บทบาทของคุณในการวิเคราะห์เบอร์โทรศัพท์:
- วิเคราะห์ความหมายของตัวเลขตามความเชื่อไทยและเลขศาสตร์สากล
- อธิบายความสำคัญของเลขราก (root number) และเลขรวม (total)
- ให้คำแนะนำที่สมดุลและสร้างสรรค์ ไม่ว่าคะแนนจะสูงหรือต่ำ
- วิเคราะห์แต่ละธีม (งาน เงิน ความสัมพันธ์ คำเตือน) ด้วยตัวอย่างเฉพาะเจาะจง
- ใช้ภาษาไทยที่เข้าใจง่าย อบอุ่น และให้กำลังใจ`;
}

/**
 * Select appropriate few-shot examples based on score
 */
function selectExamplesForScore(score: number): typeof NUMEROLOGY_EXAMPLES_BY_SCORE.high {
  // High score: 80+
  if (score >= 80) {
    return NUMEROLOGY_EXAMPLES_BY_SCORE.high;
  }
  // Low score: < 40
  else if (score < 40) {
    return NUMEROLOGY_EXAMPLES_BY_SCORE.low;
  }
  // Medium score: use high score examples as they're more balanced
  else {
    return NUMEROLOGY_EXAMPLES_BY_SCORE.high;
  }
}

/**
 * Build score-specific instructions for numerology reading
 */
function buildNumerologyInstructions(params: NumerologyPromptParams): string {
  const { score } = params;

  // Base instructions for all numerology readings using the standardized JSON schema
  const baseInstructions = `## คำแนะนำการวิเคราะห์เบอร์โทรศัพท์ (Schema-First)

### รูปแบบการตอบกลับ (JSON Only)
คุณต้องตอบกลับเป็น JSON ที่ถูกต้องตามโครงสร้างนี้เท่านั้น:
{
  "summary": "สรุปภาพรวมของเบอร์และพลังงานหลัก (2-4 บรรทัด)",
  "opportunities": ["จุดเด่นด้านงาน/เงิน 1", "จุดเด่น 2"],
  "risks": ["จุดควรระวัง/ตัวเลขที่ขัดแย้ง 1", "จุดควรระวัง 2"],
  "actions": ["แนวทางปฏิบัติ/วิธีใช้เบอร์ 1", "แนวทาง 2"],
  "timeframe": "ช่วงเวลาที่พลังงานเด่นชัด",
  "confidence": "low|med|high",
  "disclaimer": "คำเตือนมาตรฐาน (ความเชื่อส่วนบุคคล)"
}

### หลักการวิเคราะห์เบอร์
1. **ความสำคัญของเลขรากและเลขรวม**: อธิบายความหมายตามความเชื่อไทย
2. **ความเฉพาะเจาะจง**: เชื่อมโยงผลลัพธ์กับธีมที่ผู้ใช้เน้น (งาน/เงิน/รัก)
3. **คุณภาพคำตอบ**: อ้างอิงข้อมูลจาก Knowledge Base ที่แนบมาให้มากที่สุด`;

  return baseInstructions;
}

/**
 * Format user data (phone number and analysis) for the prompt
 */
function formatNumerologyUserData(params: NumerologyPromptParams): string {
  const { normalizedPhone, score, tier, total, root, themes } = params;

  return `## ข้อมูลการวิเคราะห์เบอร์โทรศัพท์

เบอร์โทรศัพท์: ${formatPhoneDisplay(normalizedPhone)}
เบอร์ที่ปรับแล้ว: ${normalizedPhone}
คะแนน: ${score}/99 (${tier})
เลขรวม: ${total}
เลขราก: ${root}

ธีมการวิเคราะห์:
- งาน: ${themes.work}
- เงิน: ${themes.money}
- ความสัมพันธ์: ${themes.relationship}
- คำเตือน: ${themes.caution}`;
}

/**
 * Format phone number for display (add dashes for readability)
 */
function formatPhoneDisplay(normalizedPhone: string): string {
  // Format as XXX-XXX-XXXX
  if (normalizedPhone.length === 10) {
    return `${normalizedPhone.slice(0, 3)}-${normalizedPhone.slice(3, 6)}-${normalizedPhone.slice(6)}`;
  }
  return normalizedPhone;
}
