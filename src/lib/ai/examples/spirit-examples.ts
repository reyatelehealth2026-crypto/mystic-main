import { FewShotExample } from "../types";

/**
 * Few-shot examples for Spirit Card readings
 * 
 * These examples demonstrate expert-level interpretations that:
 * - Connect birth date and life path number to card meaning
 * - Explain natural strengths (upright) or growth areas (reversed)
 * - Provide life-long guidance rather than short-term predictions
 * - Link to personal development themes
 * - Use warm, encouraging Thai language
 * - Balance self-awareness with actionable direction
 */

/**
 * Example 1: Spirit card upright - Natural strengths and talents
 * Demonstrates: Life path connection, strength-based guidance, long-term perspective
 */
export const SPIRIT_CARD_UPRIGHT: FewShotExample = {
  scenario: "Spirit card upright - The Empress with life path 9",
  input: `วันเกิด: 15/03/1990
เลขเส้นทางชีวิต: 9
ไพ่ประจำตัว: The Empress (ตั้งตรง)
ความหมายไพ่: ความอุดมสมบูรณ์ การเลี้ยงดู ความคิดสร้างสรรค์ ความอบอุ่น`,
  output: `{
  "summary": "The Empress เป็นไพ่แห่งการเลี้ยงดูและความอุดมสมบูรณ์ ผสมกับเลขเส้นทาง 9 (เลขแห่งการให้และความเมตตา) บอกว่าคุณมีพรสวรรค์ในการดูแลคนอื่นและสร้างสรรค์สิ่งที่มีคุณค่า ชีวิตคุณมีพลังในการทำให้สิ่งต่างๆ เติบโตและเบ่งบาน",
  "cardStructure": "ภาพรวมสถานการณ์: คุณเกิดมาพร้อมพลัง Empress ที่ทำให้คุณเป็นคนอบอุ่น ใส่ใจคนรอบข้าง และมีความคิดสร้างสรรค์สูง เลข 9 เสริมให้คุณมีวิสัยทัศน์กว้าง เห็นภาพใหญ่ และมักคิดถึงประโยชน์ส่วนรวม คุณมีพรสวรรค์ในงานที่ต้องดูแลคน สอน หรือสร้างสรรค์ ผู้คนมักรู้สึกสบายใจและปลอดภัยเมื่ออยู่กับคุณ\\n\\nจุดที่ควรระวัง: อย่าให้มากเกินไปจนลืมดูแลตัวเอง The Empress บางครั้งอาจทำให้คุณเหนื่อยจากการดูแลคนอื่น เลข 9 อาจทำให้คุณรู้สึกว่าต้องช่วยทุกคน แต่จำไว้ว่าคุณไม่สามารถช่วยทุกคนได้ ต้องตั้งขอบเขตและรู้จักปฏิเสธเมื่อจำเป็น ระวังอย่าให้ความเมตตากลายเป็นการเสียสละจนหมดตัว\\n\\nแนวทางที่ควรทำ: ใช้พรสวรรค์ด้านการเลี้ยงดูในอาชีพที่เหมาะสม เช่น การสอน การดูแลสุขภาพ งานสร้างสรรค์ หรือธุรกิจที่เกี่ยวกับความงาม ฝึกสมดุลระหว่างการให้และการรับ สร้างพื้นที่ส่วนตัวที่ให้คุณได้พักผ่อนและเติมพลัง พัฒนาความคิดสร้างสรรค์ผ่านศิลปะ ดนตรี หรือการเขียน และจำไว้ว่าการดูแลตัวเองก็คือการดูแลคนที่คุณรักด้วย เพราะคุณที่แข็งแรงจึงจะดูแลคนอื่นได้อย่างยั่งยืน"
}`,
  notes: "Shows upright spirit card with focus on natural strengths, life-long guidance, and balance"
};

/**
 * Example 2: Spirit card reversed - Growth areas and challenges
 * Demonstrates: Compassionate challenge identification, constructive growth guidance, self-development focus
 */
export const SPIRIT_CARD_REVERSED: FewShotExample = {
  scenario: "Spirit card reversed - The Emperor with life path 4",
  input: `วันเกิด: 22/11/1988
เลขเส้นทางชีวิต: 4
ไพ่ประจำตัว: The Emperor (กลับหัว)
ความหมายไพ่: การควบคุม โครงสร้าง อำนาจ ความมั่นคง (กลับหัว: การควบคุมมากเกิน ความแข็งแกร่ง ขาดความยืดหยุ่น)`,
  output: `{
  "summary": "The Emperor กลับหัวผสมกับเลขเส้นทาง 4 (เลขแห่งโครงสร้างและระเบียบ) บอกว่าคุณมีความท้าทายในการสร้างสมดุลระหว่างการควบคุมกับการปล่อยวาง ชีวิตคุณเรียนรู้ที่จะเป็นผู้นำที่แข็งแกร่งแต่ยืดหยุ่น มีโครงสร้างแต่ไม่แข็งทื่อ",
  "cardStructure": "ภาพรวมสถานการณ์: คุณเกิดมาพร้อมพลัง Emperor ที่ต้องการความเป็นระเบียบและการควบคุม เลข 4 เสริมให้คุณชอบวางแผน สร้างระบบ และทำงานอย่างมีโครงสร้าง แต่เมื่อไพ่กลับหัว หมายถึงคุณอาจควบคุมมากเกินไป ยึดติดกับวิธีการของตัวเอง หรือกลัวการเปลี่ยนแปลง บางครั้งความต้องการความมั่นคงอาจทำให้คุณพลาดโอกาสใหม่ หรือสร้างความกดดันให้ตัวเองและคนรอบข้าง\\n\\nจุดที่ควรระวัง: อย่าปล่อยให้ความกลัวการสูญเสียการควบคุมทำให้คุณกลายเป็นคนเผด็จการหรือแข็งทื่อ The Emperor กลับหัวเตือนว่าการยึดติดกับแผนมากเกินไปอาจทำให้พลาดสิ่งที่ดีกว่า เลข 4 อาจทำให้คุณทำงานหนักเกินไปจนเหนื่อยล้า ระวังอย่าให้ความรับผิดชอบกลายเป็นภาระที่หนักเกินแบก อย่ากลัวที่จะขอความช่วยเหลือหรือมอบหมายงาน\\n\\nแนวทางที่ควรทำ: ฝึกความยืดหยุ่นโดยเริ่มจากเรื่องเล็กๆ ลองปล่อยวางการควบคุมในบางสถานการณ์และดูว่าเกิดอะไรขึ้น เรียนรู้ที่จะเชื่อใจคนอื่นและมอบหมายงาน พัฒนาทักษะการฟังและเปิดใจรับความคิดเห็นที่แตกต่าง สร้างสมดุลระหว่างการวางแผนกับการปรับตัว ใช้จุดแข็งด้านการจัดการและโครงสร้างในทางที่สร้างสรรค์ แต่อย่าลืมว่าชีวิตไม่ได้เป็นไปตามแผนเสมอ และบางครั้งความไม่แน่นอนก็นำมาซึ่งโอกาสที่ดีกว่า เป้าหมายของคุณคือเป็น Emperor ที่ฉลาดและยืดหยุ่น ไม่ใช่ผู้ปกครองที่แข็งทื่อ"
}`,
  notes: "Shows reversed spirit card with compassionate challenge identification and constructive growth path"
};

/**
 * All spirit card examples grouped by orientation
 */
export const SPIRIT_EXAMPLES_BY_ORIENTATION = {
  upright: [SPIRIT_CARD_UPRIGHT],
  reversed: [SPIRIT_CARD_REVERSED]
};

/**
 * All spirit card examples in a flat array
 */
export const SPIRIT_EXAMPLES: FewShotExample[] = [
  SPIRIT_CARD_UPRIGHT,
  SPIRIT_CARD_REVERSED
];
