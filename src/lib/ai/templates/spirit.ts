/**
 * Spirit Card Prompt Template Builder
 * 
 * This module provides specialized prompt building for spirit card readings with:
 * - Life path number connection guidance
 * - Orientation-specific instructions (upright vs reversed)
 * - Long-term personal development focus
 * - Natural strengths and growth areas analysis
 * - Thai cultural context integration
 */

import type { SpiritPromptParams } from '@/lib/ai/types';
import { PromptBuilder } from './base';
import { getContextForDivinationType } from '../cultural/thai-context';
import { SPIRIT_EXAMPLES_BY_ORIENTATION } from '../examples/spirit-examples';

import { retrieveRag, formatRagContext } from "@/lib/rag/retriever";

/**
 * Build a complete spirit card reading prompt with orientation-specific instructions
 * 
 * @param params - Spirit card reading parameters (card, orientation, lifePathNumber, dob)
 * @returns Complete prompt string ready for Gemini API
 */
export function buildSpiritPrompt(params: SpiritPromptParams): string {
  const { card, orientation, lifePathNumber, dob } = params;

  // Build role definition
  const role = buildSpiritRole();

  // Get Thai cultural context for spirit cards (includes astrology and numerology)
  const culturalContext = getContextForDivinationType('spirit');

  // Select appropriate few-shot examples based on orientation
  const examples = selectExamplesForOrientation(orientation);

  // Build orientation-specific instructions
  const instructions = buildSpiritInstructions(params);

  // Format user data (card, orientation, life path number, DOB)
  const userData = formatSpiritUserData(params);

  // Retrieve RAG context for spirit card/life path
  const ragResult = retrieveRag({
    query: `ไพ่ประจำตัว ${card.name} เลขเส้นทางชีวิต ${lifePathNumber}`,
    systemId: "tarot_th",
    limit: 4
  });
  const knowledgeBase = formatRagContext(ragResult.chunks);

  // Compose the complete prompt
  return new PromptBuilder()
    .withRole(role)
    .withKnowledgeBase(knowledgeBase)
    .withCulturalContext(culturalContext)
    .withFewShotExamples(examples)
    .withInstructions(instructions)
    .withUserData(userData)
    .build();
}

/**
 * Build the role definition for spirit card reading AI
 */
function buildSpiritRole(): string {
  return `คุณคือผู้เชี่ยวชาญด้านไพ่ทาโรต์และเลขศาสตร์ที่ทำงานกับโปรเจกต์ REFFORTUNE

บทบาทของคุณในการอ่านไพ่ประจำตัว (Spirit Card):
- วิเคราะห์ความเชื่อมโยงระหว่างวันเกิด เลขเส้นทางชีวิต และไพ่ประจำตัว
- ให้คำแนะนำระยะยาวเกี่ยวกับการพัฒนาตัวเอง ไม่ใช่การทำนายระยะสั้น
- อธิบายจุดแข็งตามธรรมชาติ (ไพ่ตั้งตรง) หรือจุดที่ต้องพัฒนา (ไพ่กลับหัว)
- ใช้ภาษาไทยที่อบอุ่น ให้กำลังใจ และสร้างแรงบันดาลใจ
- เชื่อมโยงไพ่กับธีมการพัฒนาตัวเองและเส้นทางชีวิต`;
}

/**
 * Select appropriate few-shot examples based on card orientation
 */
function selectExamplesForOrientation(orientation: SpiritPromptParams['orientation']) {
  if (orientation === 'upright') {
    return SPIRIT_EXAMPLES_BY_ORIENTATION.upright;
  } else {
    return SPIRIT_EXAMPLES_BY_ORIENTATION.reversed;
  }
}

/**
 * Build orientation-specific instructions for spirit card reading
 */
function buildSpiritInstructions(params: SpiritPromptParams): string {
  const { orientation } = params;

  // Base instructions for all spirit card readings using the standardized JSON schema
  const baseInstructions = `## คำแนะนำการตีความไพ่ประจำตัว (Schema-First)

### รูปแบบการตอบกลับ (JSON Only)
คุณต้องตอบกลับเป็น JSON ที่ถูกต้องตามโครงสร้างนี้เท่านั้น:
{
  "summary": "สรุปความหมายของไพ่ประจำตัวและพลังงานชีวิต (2-4 บรรทัด)",
  "opportunities": ["จุดแข็งตามธรรมชาติ 1", "จุดแข็ง 2"],
  "risks": ["จุดที่ต้องพัฒนา/ความท้าทาย 1", "ความท้าทาย 2"],
  "actions": ["แนวทางการพัฒนาตัวเอง/สายงานที่เหมาะ 1", "แนวทาง 2"],
  "timeframe": "ภาพรวมระยะยาวของเส้นทางชีวิต",
  "confidence": "low|med|high",
  "disclaimer": "คำเตือนมาตรฐาน (ความเชื่อส่วนบุคคล)"
}

### หลักการตีความ
1. **การเชื่อมโยง**: อธิบายว่าเลขเส้นทางชีวิตเสริมพลังของไพ่อย่างไร
2. **ความเฉพาะเจาะจง**: ให้แนวทางการเติบโตที่นำไปใช้ได้จริงในชีวิตประจำวัน
3. **คุณภาพคำตอบ**: อ้างอิงข้อมูลจาก Knowledge Base ที่แนบมาให้มากที่สุด`;

  return baseInstructions;
}

/**
 * Format user data (card, orientation, life path number, DOB) for the prompt
 */
function formatSpiritUserData(params: SpiritPromptParams): string {
  const { card, orientation, lifePathNumber, dob } = params;

  const orientationText = orientation === 'upright' ? 'ตั้งตรง' : 'กลับหัว';
  
  // Get card meaning/keywords
  const cardKeywords = getCardKeywords(card, orientation);

  return `## ข้อมูลไพ่ประจำตัว

วันเกิด: ${dob}
เลขเส้นทางชีวิต: ${lifePathNumber}
ไพ่ประจำตัว: ${card.name} (${orientationText})
ความหมายไพ่: ${cardKeywords}`;
}

/**
 * Get card keywords based on orientation
 */
function getCardKeywords(card: SpiritPromptParams['card'], orientation: SpiritPromptParams['orientation']): string {
  // For spirit cards, we use the card's meaning based on orientation
  const baseMeaning = orientation === 'upright' 
    ? card.meaningUpright 
    : card.meaningReversed;
  
  if (orientation === 'reversed') {
    return `${baseMeaning} (กลับหัว: พลังงานที่ถูกกดไว้ จุดที่ต้องพัฒนา ความท้าทายในการเติบโต)`;
  }
  
  return baseMeaning;
}
