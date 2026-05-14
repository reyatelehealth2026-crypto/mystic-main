/**
 * Lucky Numbers Prompt Template
 *
 * ผู้ใช้หยิบไพ่เอง (2 หรือ 4 ใบ) จาก 1-9 → ตีความตามเลขศาสตร์ไทย
 * RAG context appended by API route.
 */

import { PromptBuilder } from "./base";
import { getContextForDivinationType } from "../cultural/thai-context";
import type { LuckyDigitMeaning } from "@/lib/lucky-numbers/engine";

export interface LuckyNumbersPromptParams {
  digits: number[];
  combined: string;
  sum: number;
  root: number;
  meanings: LuckyDigitMeaning[];
}

export function buildLuckyNumbersPrompt(params: LuckyNumbersPromptParams): string {
  const role = `คุณคือผู้เชี่ยวชาญด้านเลขศาสตร์ไทยของโปรเจกต์ REFFORTUNE
ภารกิจของคุณคือการตีความ "ชุดเลขมงคล" ที่ผู้ใช้หยิบเอง (${params.digits.length} หลัก จากเลข 1-9)
- ใช้สรรพนาม "คุณ" ด้วยน้ำเสียงอบอุ่น เป็นมิตร เหมือนหมอดูคู่ใจ
- ตีความแต่ละหลักให้สัมพันธ์กันเป็นเรื่องเดียวกัน อย่าแยกเป็นรายการที่ตัดขาด
- ห้ามรับประกันรางวัล/โชคลาภที่จับต้องได้ เลขเหล่านี้เป็นเครื่องเสริมพลังใจเท่านั้น`;

  const culturalContext = getContextForDivinationType("numerology");

  const instructions = `## คำแนะนำการตีความ "ชุดเลขมงคล" (Schema-First)

### รูปแบบการตอบกลับ (JSON เท่านั้น)
ตอบกลับเป็น JSON ตามโครงสร้างนี้เคร่งครัด:
{
  "summary": "สรุปภาพรวมของชุดเลข ${params.combined} และพลังเด่นที่คุณจะได้รับ 2-3 บรรทัด",
  "cardNotes": [
    "เลข <digit>: ความหมายและวิธีใช้พลัง 1 บรรทัด",
    "...รวม ${params.digits.length} บรรทัด ตามลำดับไพ่ที่หยิบ"
  ],
  "opportunities": ["โอกาสที่ชุดเลขนี้เปิดให้ 1", "โอกาส 2"],
  "risks": ["จุดที่ควรระวังเมื่อใช้พลังเลขนี้ 1", "จุดระวัง 2"],
  "actions": ["วิธีใช้เลขมงคล (เช่น พกติดตัว/ใช้ในเบอร์โทร/วันเริ่มต้น) 1", "แนวทาง 2"],
  "luckyMoment": "ช่วงเวลาของวันหรือสัปดาห์ที่พลังเลขชุดนี้เด่นชัด",
  "disclaimer": "คำเตือนมาตรฐาน: เลขมงคลเป็นเครื่องเสริมพลังใจ ไม่ใช่การรับประกันโชคลาภ"
}

### หลักการตีความ
1. **มองภาพรวมก่อนรายตัว**: เริ่มจากผลรวม ${params.sum} และเลขราก ${params.root} เพื่อจับธีมหลัก
2. **เชื่อมโยงเลขแต่ละตัว**: อธิบายว่าตัวต่อตัวเสริมกันหรือถ่วงกัน
3. **กระชับและใช้งานได้**: actions ต้องเป็นสิ่งที่ทำได้จริงในชีวิตประจำวัน
4. **ใช้ Knowledge Base ที่แนบมา** ถ้ามีบริบทที่ลึกขึ้น`;

  const cardLines = params.meanings
    .map(
      (m, i) =>
        `ไพ่ใบที่ ${i + 1} → เลข ${m.digit} • ความหมายพื้นฐาน: ${m.keywordTh} — ${m.reasonTh}`,
    )
    .join("\n");

  const userData = `## ชุดเลขมงคลที่ผู้ใช้หยิบเอง

ผู้ใช้เลือกเปิด ${params.digits.length} ใบ และหยิบไพ่จากครึ่งวงกลม 9 ใบ ตามลำดับดังนี้:
${cardLines}

ชุดเลขรวม: ${params.combined}
ผลรวม: ${params.sum}
เลขราก: ${params.root}`;

  return new PromptBuilder()
    .withRole(role)
    .withCulturalContext(culturalContext)
    .withInstructions(instructions)
    .withUserData(userData)
    .build();
}
