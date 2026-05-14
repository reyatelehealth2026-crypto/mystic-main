/**
 * Lucky Numbers Prompt Template
 *
 * Builds a Gemini prompt for interpreting a 6-card lucky-number set:
 * DOB + topic + life-path number → narrative + advice + warning.
 * RAG context is appended by the API route, not here.
 */

import { PromptBuilder } from "./base";
import { getContextForDivinationType } from "../cultural/thai-context";
import type { LuckyCard, LuckyTopic } from "@/lib/lucky-numbers/engine";

export interface LuckyNumbersPromptParams {
  dob: string;
  topic: LuckyTopic;
  topicLabelTh: string;
  lifePathNumber: number;
  dayKey: string;
  cards: LuckyCard[];
  pair: string;
  triple: string;
  intent?: string;
}

export function buildLuckyNumbersPrompt(params: LuckyNumbersPromptParams): string {
  const role = `คุณคือผู้เชี่ยวชาญด้านเลขศาสตร์ไทยของโปรเจกต์ REFFORTUNE
ภารกิจของคุณคือการตีความ "ชุดเลขมงคล" 6 ตัวที่ระบบสุ่มจากวันเกิดของผู้ใช้ + หมวดที่ต้องการเสริมดวง + พลังของวันนี้
- เชื่อมโยงตัวเลขแต่ละตัวเข้ากับความหมายเชิงเลขศาสตร์ไทย
- ใช้สรรพนาม "คุณ" ด้วยน้ำเสียงอบอุ่น เป็นมิตร เหมือนหมอดูคู่ใจ
- ห้ามรับประกันรางวัล/ผลตอบแทน เลขเหล่านี้เป็นแนวทางเสริมพลังใจเท่านั้น`;

  const culturalContext = getContextForDivinationType("numerology");

  const instructions = `## คำแนะนำการตีความ "ชุดเลขมงคล" (Schema-First)

### รูปแบบการตอบกลับ (JSON เท่านั้น)
ตอบกลับเป็น JSON ตามโครงสร้างนี้เคร่งครัด:
{
  "summary": "สรุปภาพรวมของชุดเลขมงคลและพลังเด่นที่คุณจะได้รับ 2-3 บรรทัด",
  "cardNotes": [
    "เลข <digit>: ความหมายและวิธีใช้พลัง 1 บรรทัด",
    "...รวม 6 บรรทัด ตามลำดับไพ่"
  ],
  "opportunities": ["โอกาสที่ชุดเลขนี้เปิดให้ 1", "โอกาส 2"],
  "risks": ["จุดที่ควรระวังเมื่อใช้พลังเลขนี้ 1", "จุดระวัง 2"],
  "actions": ["วิธีใช้เลขมงคล (เช่น พกติดตัว/ใช้ในเบอร์โทร/วันเริ่มต้น) 1", "แนวทาง 2"],
  "luckyMoment": "ช่วงเวลาของวันหรือสัปดาห์ที่พลังเลขชุดนี้เด่นชัด",
  "disclaimer": "คำเตือนมาตรฐาน: เลขมงคลเป็นเครื่องเสริมพลังใจ ไม่ใช่การรับประกันโชคลาภ"
}

### หลักการตีความ
1. **ผูกกับหมวด**: เน้นความหมายในมุมของหมวดที่ผู้ใช้เลือก (${params.topicLabelTh})
2. **อ้างเลขเส้นทางชีวิต**: เชื่อมโยงไพ่กับเลข ${params.lifePathNumber} หากเข้ากันได้
3. **กระชับและใช้งานได้**: actions ต้องเป็นสิ่งที่ทำได้จริงในชีวิตประจำวัน
4. **ใช้ความรู้จาก Knowledge Base ที่แนบมา**: หากมีข้อมูลที่เกี่ยวข้อง อ้างอิงให้ลึกขึ้น`;

  const cardLines = params.cards
    .map(
      (c, i) =>
        `ไพ่ที่ ${i + 1} (${c.role}) → เลข ${c.digit} • คะแนน ${c.score}/10 • เหตุผล: ${c.reasonTh}`,
    )
    .join("\n");

  const userData = `## ข้อมูลผู้ใช้และชุดเลขมงคล

วันเกิด: ${params.dob}
หมวดที่ต้องการเสริมดวง: ${params.topicLabelTh}
เลขเส้นทางชีวิต: ${params.lifePathNumber}
วันที่อ่าน: ${params.dayKey}
${params.intent ? `คำตั้งจิตของผู้ใช้: ${params.intent}\n` : ""}
ชุดไพ่ที่เปิดได้ (6 ใบ):
${cardLines}

เลขชุดคู่ที่แนะนำ: ${params.pair}
เลขชุดสามที่แนะนำ: ${params.triple}`;

  return new PromptBuilder()
    .withRole(role)
    .withCulturalContext(culturalContext)
    .withInstructions(instructions)
    .withUserData(userData)
    .build();
}
