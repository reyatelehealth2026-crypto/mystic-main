/**
 * Chat Prompt Template Builder
 * 
 * This module provides specialized prompt building for tarot chat follow-up conversations with:
 * - Conversation history integration (last 6 turns)
 * - Card reference from original reading
 * - Concise response instructions (1-3 paragraphs)
 * - Empathetic and grounded guidance
 * - Focus on user's control and agency
 * - Thai cultural context integration
 */

import type { ChatPromptParams } from '@/lib/ai/types';
import { PromptBuilder } from './base';
import { getContextForDivinationType } from '../cultural/thai-context';
import { CHAT_EXAMPLES } from '../examples/chat-examples';
import { cardMeaning } from '@/lib/tarot/engine';

import { retrieveRag, formatRagContext } from "@/lib/rag/retriever";

/**
 * Defensive sanitization for client-supplied free text. The prompt format
 * uses lines like `ผู้ใช้:` / `ผู้ช่วย:` as role markers, so any user-supplied
 * content containing those tokens or newlines could spoof an assistant turn.
 * We also length-cap to bound the prompt size.
 */
const MAX_CHARS_PER_TURN = 1000;
const MAX_HISTORY_TURNS = 6;
const MAX_QUESTION_CHARS = 1500;

function sanitizeUserText(value: string | undefined, max: number): string {
  if (!value) return '';
  return value
    .replace(/[\r\n]+/g, ' ') // collapse line breaks that could spoof a new turn
    .replace(/ผู้ช่วย\s*:/g, 'ผู้ช่วย ') // neutralize role marker
    .replace(/ผู้ใช้\s*:/g, 'ผู้ใช้ ')
    .trim()
    .slice(0, max);
}

/**
 * Build a complete chat prompt with conversation history and card context
 *
 * @param params - Chat parameters (cards, baseQuestion, followUpQuestion, history)
 * @returns Complete prompt string ready for Gemini API
 */
export function buildChatPrompt(params: ChatPromptParams): string {
  const { cards, baseQuestion, followUpQuestion, history } = params;

  // Build role definition
  const role = buildChatRole();

  // Get Thai cultural context for chat
  const culturalContext = getContextForDivinationType('chat');

  // Use chat examples
  const examples = CHAT_EXAMPLES;

  // Build chat-specific instructions
  const instructions = buildChatInstructions();

  // Format user data (cards, history, and question)
  const userData = formatChatUserData(params);

  // Retrieve RAG context — use the sanitized follow-up question so
  // injection attempts don't taint retrieval either.
  const ragResult = retrieveRag({
    query: sanitizeUserText(followUpQuestion, MAX_QUESTION_CHARS),
    limit: 5
  });
  const knowledgeBase = formatRagContext(ragResult.chunks);

  // Compose the complete prompt
  return new PromptBuilder()
    .withRole(role)
    .withCulturalContext(culturalContext)
    .withFewShotExamples(examples)
    .withInstructions(instructions)
    .withUserData(userData)
    .withKnowledgeBase(knowledgeBase)
    .build();
}

/**
 * Build the role definition for chat AI
 */
function buildChatRole(): string {
  return `คุณคือที่ปรึกษาเชิงจิตใจและหมอดูไพ่ทาโรต์ที่ทำงานกับโปรเจกต์ REFFORTUNE

บทบาทของคุณในโหมดแชท:
- ตอบคำถามติดตามจากการอ่านไพ่เดิม
- ใช้ภาษาไทยที่เป็นธรรมชาติ อบอุ่น และเข้าใจง่าย
- ตอบแบบสั้นกระชับ เหมาะกับรูปแบบการสนทนา (1-3 ย่อหน่า)
- อ้างอิงไพ่จากการอ่านเดิมเพื่อให้คำตอบที่สอดคล้อง
- รับฟังความรู้สึกของผู้ถามและให้มุมมองที่สมดุล
- โฟกัสที่สิ่งที่ผู้ถามสามารถควบคุมได้`;
}

/**
 * Build chat-specific instructions
 */
function buildChatInstructions(): string {
  return `## คำแนะนำการตอบคำถามในโหมดแชท

### รูปแบบการตอบ
- ตอบเป็นข้อความล้วน (plain text) ไม่ใช่ JSON
- ความยาว 1-3 ย่อหน้า เหมาะกับการสนทนา
- ใช้ภาษาที่เป็นกันเอง ไม่เป็นทางการเกินไป
- ตอบตรงประเด็นที่ถาม ไม่ขยายความยืดยาว

### หลักการตอบคำถาม

**1. อ้างอิงไพ่จากการอ่านเดิม**
- ระบุชื่อไพ่ที่เกี่ยวข้องกับคำถาม
- อธิบายว่าไพ่นั้นบอกอะไรเกี่ยวกับคำถามที่ถาม
- เชื่อมโยงกลับไปยังการตีความเดิม
- ตัวอย่าง: "จากไพ่ Ace of Wands ที่เปิดมา บอกว่า..."

**2. ให้กรอบเวลาที่สมจริง (เมื่อถูกถามเรื่องเวลา)**
- ใช้พลังงานของไพ่เป็นตัวบอกกรอบเวลา
- ให้ช่วงเวลาที่เป็นรูปธรรม (วัน สัปดาห์ เดือน)
- อธิบายว่าทำไมถึงเป็นช่วงเวลานั้น
- เตือนว่าเวลาขึ้นกับการลงมือทำของผู้ถามด้วย

**3. โฟกัสที่สิ่งที่ผู้ถามควบคุมได้ (เมื่อถามเรื่องคนอื่น)**
- รับฟังความรู้สึกของผู้ถามก่อน
- นำกลับมาที่สิ่งที่ผู้ถามสามารถทำได้
- แนะนำการสื่อสารหรือการตั้งขอบเขต
- หลีกเลี่ยงการคาดเดาความรู้สึกของคนอื่น

**4. รับฟังความกังวลและให้มุมมองที่สมดุล**
- เริ่มด้วยการรับฟังความรู้สึก ("เข้าใจว่า...", "รู้สึกว่า...")
- ให้มุมมองที่สมจริงจากไพ่
- ชี้ให้เห็นโอกาสในความท้าทาย
- จบด้วยการให้กำลังใจและแนวทางปฏิบัติ

**5. ใช้บริบทจากประวัติการสนทนา**
- อ่านประวัติการสนทนา (ถ้ามี) เพื่อเข้าใจบริบท
- ตอบให้สอดคล้องกับที่เคยพูดไปแล้ว
- ไม่ซ้ำคำตอบเดิม แต่เสริมข้อมูลใหม่
- แสดงให้เห็นว่าจำบริบทการสนทนาได้

**6. หลีกเลี่ยงการทำนายแบบเด็ดขาด**
- ใช้ภาษาที่แสดงแนวโน้มและโอกาส
- ไม่รับประกันผลลัพธ์ 100%
- เน้นว่าอนาคตขึ้นกับการกระทำของผู้ถาม
- ให้ความหวังแต่ไม่สร้างความคาดหวังที่ไม่สมจริง

**7. ความกระชับและชัดเจน**
- ตอบตรงประเด็น ไม่อ้อมค้อม
- ใช้ประโยคสั้นๆ อ่านง่าย
- หลีกเลี่ยงการอธิบายซ้ำซาก
- จบด้วยข้อความที่ให้กำลังใจหรือแนวทางปฏิบัติ`;
}

/**
 * Format user data (cards, history, and question) for the prompt.
 * All client-supplied free-text fields are sanitized to prevent prompt
 * injection (role-spoofing via newlines/role markers) and length-capped to
 * keep the prompt size bounded.
 */
function formatChatUserData(params: ChatPromptParams): string {
  const { cards, baseQuestion, followUpQuestion, history } = params;

  // Format card context (engine-derived — trusted)
  const cardContext = cards
    .map((drawn, index) => {
      const orientation = drawn.orientation === 'upright' ? 'ตั้งตรง' : 'กลับหัว';
      const meaning = cardMeaning(drawn);
      return `${index + 1}. ${drawn.card.name} (${orientation}) => ${meaning}`;
    })
    .join('\n');

  // Format conversation history. Drop turns with unknown role and sanitize
  // each turn's content before interpolation.
  const historyContext = history.length > 0
    ? history
        .filter((turn) => turn.role === 'user' || turn.role === 'assistant')
        .slice(-MAX_HISTORY_TURNS)
        .map((turn) => {
          const speaker = turn.role === 'user' ? 'ผู้ใช้' : 'ผู้ช่วย';
          const content = sanitizeUserText(turn.content, MAX_CHARS_PER_TURN);
          return `${speaker}: ${content}`;
        })
        .join('\n')
    : '(ยังไม่มี)';

  const baseQuestionText =
    sanitizeUserText(baseQuestion, MAX_QUESTION_CHARS) || '(ไม่ได้ระบุ)';
  const followUpText = sanitizeUserText(followUpQuestion, MAX_QUESTION_CHARS);

  return `## ข้อมูลอ่านไพ่

คำถามตั้งต้น: ${baseQuestionText}
จำนวนไพ่: ${cards.length}
ไพ่ที่เปิดได้:
${cardContext}

บริบทบทสนทนาก่อนหน้า:
${historyContext}

คำถามล่าสุดจากผู้ใช้:
${followUpText}`;
}
