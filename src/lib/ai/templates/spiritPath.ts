/**
 * Spirit Path (2-Card) Prompt Template Builder
 *
 * Goal: Return deep Thai interpretation in MARKDOWN with clear h4 headings.
 * Uses Zodiac Card (astrology→tarot mapping) + Soul Card (numerology reduction).
 */

import { PromptBuilder } from "./base";
import { getContextForDivinationType } from "../cultural/thai-context";
import { retrieveRag, formatRagContext } from "@/lib/rag/retriever";

export interface SpiritPathPromptParams {
  zodiacCardName: string;
  soulCardName: string;
  zodiacCardMeaning?: string;
  soulCardMeaning?: string;
  day: number;
  month: number;
  year: number;
}

export function buildSpiritPathPrompt(params: SpiritPathPromptParams): string {
  const role = `คุณคือที่ปรึกษาทางจิตวิญญาณและนักอ่านไพ่ทาโรต์เชิงจิตวิทยา (ไทย) ของโปรเจกต์ REFFORTUNE

กรอบการทำงาน:
- ตีความ "ไพ่ 2 ใบ" แบบลึกและใช้งานได้จริง: ไพ่ราศี (พลังภายนอก/บทบาทที่โลกคาดหวัง) + ไพ่จิตวิญญาณ (แรงขับภายใน/บทเรียนชีวิต)
- เน้นการแนะนำเชิงปฏิบัติ ไม่ชี้นำให้เชื่อแบบงมงาย และไม่ฟันธงอนาคต
- น้ำเสียง: อบอุ่น สุภาพ จริงใจ แบบโค้ช/ที่ปรึกษา`;

  const culturalContext = getContextForDivinationType("spirit");

  const instructions = `## ข้อกำหนดรูปแบบคำตอบ (JSON Schema)

คุณต้องตอบกลับเป็น JSON ที่ถูกต้องตามโครงสร้างนี้เท่านั้น:
{
  "summary": "#### ภาพรวมพลังงานของเส้นทางนี้\\n\\nคำอธิบายภาพรวม 2-4 บรรทัด",
  "sections": [
    {
      "title": "ไพ่ราศี (Zodiac Card): ความคาดหวังจากโลกภายนอก",
      "content": "การตีความไพ่ราศี"
    },
    {
      "title": "ไพ่จิตวิญญาณ (Soul Card): แรงขับลึกและบทเรียนชีวิต",
      "content": "การตีความไพ่จิตวิญญาณ"
    }
  ],
  "highlights": {
    "strengths": ["จุดแข็ง 1", "จุดแข็ง 2", "จุดแข็ง 3"],
    "risks": ["จุดระวัง 1", "จุดระวัง 2", "จุดระวัง 3"],
    "action_plan": ["แผนปฏิบัติ 1", "แผนปฏิบัติ 2", "แผนปฏิบัติ 3"]
  },
  "journal_question": "คำถามสะท้อนตัวเอง"
}

## แนวทางการตีความ
- เปรียบเทียบพลังของไพ่ทั้งสอง: เกื้อหนุนกันตรงไหน? ดึงรั้งกันตรงไหน?
- ให้คำแนะนำเป็น "พฤติกรรม" และ "ขอบเขต" ที่ทำได้จริง
- ใช้ภาษาธรรมชาติ อ่านง่าย แต่คมชัด ไม่ยืดยาวเกินจำเป็น
- อ้างอิงความรู้จาก Knowledge Base ที่แนบมาด้วยเสมอ`;

  const userData = `## ข้อมูลผู้ใช้

วันเกิด (ค.ศ.): ${params.day}/${params.month}/${params.year}

ไพ่ราศี (Zodiac Card): ${params.zodiacCardName}
ความหมายโดยย่อ: ${params.zodiacCardMeaning ?? "(ไม่ระบุ)"}

ไพ่จิตวิญญาณ (Soul Card): ${params.soulCardName}
ความหมายโดยย่อ: ${params.soulCardMeaning ?? "(ไม่ระบุ)"}`;

  // Retrieve RAG context for spirit path
  const ragResult = retrieveRag({
    query: `ไพ่ราศี ${params.zodiacCardName} ไพ่จิตวิญญาณ ${params.soulCardName}`,
    systemId: "tarot_th",
    limit: 4
  });
  const knowledgeBase = formatRagContext(ragResult.chunks);

  return new PromptBuilder()
    .withRole(role)
    .withKnowledgeBase(knowledgeBase)
    .withCulturalContext(culturalContext)
    .withInstructions(instructions)
    .withUserData(userData)
    .build();
}
