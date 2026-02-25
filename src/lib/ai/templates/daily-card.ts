import { PromptBuilder } from "./base";
import { getContextForDivinationType } from "../cultural/thai-context";
import { cardMeaning } from "@/lib/tarot/engine";
import type { DailyCardPromptParams } from "../types";

import { retrieveRag, formatRagContext } from "@/lib/rag/retriever";

export function buildDailyCardPrompt(params: DailyCardPromptParams): string {
  const { card, orientation, dayKey } = params;

  const role = `คุณคือผู้เชี่ยวชาญการอ่านไพ่รายวันของโปรเจกต์ REFFORTUNE

บทบาทของคุณ:
- วิเคราะห์พลังงานประจำวันที่ผู้ใช้ได้รับจากไพ่ 1 ใบ
- ให้คำแนะนำที่สั้น กระชับ แต่มีพลังและนำไปใช้ได้ทันที
- ใช้ภาษาไทยที่อบอุ่นและเป็นกันเอง เหมือนที่ปรึกษาส่วนตัว`;

  const culturalContext = getContextForDivinationType("tarot");

  const instructions = `## คำแนะนำการตีความไพ่รายวัน (Schema-First)

### รูปแบบการตอบกลับ (JSON Only)
คุณต้องตอบกลับเป็น JSON ที่ถูกต้องตามโครงสร้างนี้เท่านั้น:
{
  "summary": "สรุปพลังงานวันนี้ 1-2 บรรทัด",
  "opportunities": ["โอกาสหรือเรื่องดีๆ ที่จะเจอวันนี้ 1", "โอกาส 2"],
  "risks": ["สิ่งที่ต้องระวังหรือควรเลี่ยงวันนี้ 1", "จุดระวัง 2"],
  "actions": ["สิ่งที่ควรลงมือทำทันที 1", "แนวทาง 2"],
  "timeframe": "ช่วงเวลาของวันนี้ที่พลังงานเด่นชัด",
  "confidence": "high",
  "disclaimer": "คำทำนายเพื่อแนวทางใช้ชีวิตอย่างมีสติ"
}

### หลักการตีความ
1. **กระชับและมีพลัง**: เนื่องจากเป็นคำทำนายรายวัน ไม่ควรยาวเกินไป
2. **เฉพาะเจาะจง**: เชื่อมโยงความหมายไพ่เข้ากับเหตุการณ์ที่อาจเจอในวันหนึ่งๆ
3. **คุณภาพคำตอบ**: อ้างอิงความรู้จาก Knowledge Base ที่แนบมาให้มากที่สุด`;

  const userData = `## ข้อมูลไพ่วันนี้

วันที่: ${dayKey}
ไพ่ที่ได้: ${card.name} (${orientation === "upright" ? "ตั้งตรง" : "กลับหัว"})
ความหมายพื้นฐาน: ${cardMeaning({ card, orientation })}`;

  // Retrieve RAG context for daily card
  const ragResult = retrieveRag({
    query: `ทำนายไพ่รายวัน ไพ่ ${card.name}`,
    systemId: "tarot_th",
    intent: "timing",
    limit: 3
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
