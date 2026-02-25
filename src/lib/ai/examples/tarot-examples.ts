import { FewShotExample } from "../types";

/**
 * Few-shot examples for Tarot readings
 * 
 * These examples demonstrate expert-level interpretations that:
 * - Use natural, conversational Thai language
 * - Provide specific, actionable guidance
 * - Explain card relationships and combined meanings
 * - Include concrete timeframes and steps
 * - Balance honesty with compassion
 * - Avoid absolute predictions while maintaining confidence
 */

/**
 * Example 1: 3-card spread - Positive scenario
 * Demonstrates: Clear narrative flow, actionable timeline, optimistic but grounded tone
 */
export const TAROT_3_CARD_POSITIVE: FewShotExample = {
  scenario: "3-card career decision - positive outcome",
  input: `คำถามผู้ใช้: ควรเปลี่ยนงานหรือไม่
จำนวนไพ่: 3
ไพ่ที่เปิดได้:
1. The Sun (ตั้งตรง) => ความสำเร็จ ความสุข พลังงานบวก ความชัดเจน
2. Two of Pentacles (ตั้งตรง) => การจัดการหลายเรื่อง ความยืดหยุ่น การชั่งน้ำหนัก
3. Ace of Wands (ตั้งตรง) => จุดเริ่มต้นใหม่ แรงบันดาลใจ โอกาสใหม่`,
  output: `{
  "summary": "ไพ่บอกว่าคุณมีพื้นฐานที่ดีจากความสำเร็จในอดีต ตอนนี้กำลังชั่งน้ำหนักทางเลือก และอนาคตเปิดโอกาสให้เริ่มต้นใหม่ด้วยพลังงานสดใส การเปลี่ยนงานในช่วงนี้มีโอกาสนำมาซึ่งความก้าวหน้าที่คุณรอคอย",
  "cardStructure": "ภาพรวมสถานการณ์: คุณมีประสบการณ์และความสำเร็จที่สั่งสมมา (The Sun) ทำให้มั่นใจในตัวเองพอที่จะพิจารณาทางเลือกใหม่ ขณะนี้กำลังชั่งน้ำหนักระหว่างความมั่นคงเดิมกับโอกาสใหม่ (Two of Pentacles) และพลังงานของ Ace of Wands บอกว่ามีโครงการหรือบทบาทใหม่ที่จะจุดประกายความกระตือรือร้นให้คุณ\\n\\nจุดที่ควรระวัง: อย่าตัดสินใจเพียงเพราะเบื่องานเดิม ต้องแน่ใจว่างานใหม่ตอบโจทย์ทั้งด้านการเงินและการเติบโต อย่าลืมว่า Two of Pentacles เตือนให้จัดการหลายเรื่องพร้อมกัน ดังนั้นช่วงเปลี่ยนผ่านอาจต้องใช้พลังงานมาก\\n\\nแนวทางที่ควรทำ: (1) ภายใน 1-2 สัปดาห์: รวบรวมข้อมูลงานใหม่ให้ครบ เช็กเงื่อนไข สวัสดิการ โอกาสเติบโต (2) สัปดาห์ที่ 3-4: คุยกับคนในวงการหรือคนที่ทำงานที่นั่นแล้ว (3) ตัดสินใจภายในเดือนนี้ เพราะ Ace of Wands บอกว่าโอกาสนี้มีกรอบเวลา ยิ่งรอนานยิ่งพลาดจังหวะ"
}`,
  notes: "Shows positive reading with clear past-present-future narrative and actionable timeline"
};

/**
 * Example 2: 3-card spread - Challenging scenario
 * Demonstrates: Honest assessment, constructive guidance, compassionate tone
 */
export const TAROT_3_CARD_CHALLENGING: FewShotExample = {
  scenario: "3-card relationship question - challenging situation",
  input: `คำถามผู้ใช้: ความสัมพันธ์จะไปต่อได้ไหม
จำนวนไพ่: 3
ไพ่ที่เปิดได้:
1. Five of Cups (ตั้งตรง) => ความผิดหวัง การสูญเสีย ความเสียใจ
2. The Tower (ตั้งตรง) => การพังทลาย การเปลี่ยนแปลงกะทันหัน ความจริงที่เจ็บปวด
3. Six of Swords (ตั้งตรง) => การเดินทางออกจากความยากลำบาก การเปลี่ยนผ่าน`,
  output: `{
  "summary": "ไพ่สะท้อนว่าความสัมพันธ์นี้ผ่านความผิดหวังมาแล้ว และตอนนี้กำลังเผชิญจุดเปลี่ยนครั้งใหญ่ที่บังคับให้เห็นความจริง แม้ Six of Swords บอกว่าจะผ่านพ้นไปได้ แต่การ 'ผ่านพ้น' อาจหมายถึงการปล่อยวางและเดินหน้าต่อในทางของตัวเอง",
  "cardStructure": "ภาพรวมสถานการณ์: ความสัมพันธ์นี้มีรอยแตกมาตั้งแต่อดีต (Five of Cups) จากเหตุการณ์ที่ทำให้ผิดหวังหรือรู้สึกสูญเสียบางอย่าง ปัจจุบัน The Tower บอกว่าสิ่งที่สร้างมาอาจกำลังพังทลาย ไม่ใช่เพราะใครผิดใครถูก แต่เพราะรากฐานไม่แข็งแรงพอ Six of Swords ในอนาคตหมายถึงการเคลื่อนไปสู่ที่ที่สงบกว่า แต่ต้องยอมรับว่าบางอย่างต้องทิ้งไว้ข้างหลัง\\n\\nจุดที่ควรระวัง: อย่าพยายามซ่อมแซมสิ่งที่พังจนไม่เหลือรูปร่าง The Tower บอกว่าบางครั้งการพังทลายคือการเริ่มต้นใหม่ที่จำเป็น อย่าหลอกตัวเองว่าทุกอย่างจะกลับมาเหมือนเดิม เพราะ Six of Swords บอกว่าทางออกคือการเดินหน้า ไม่ใช่ย้อนกลับ\\n\\nแนวทางที่ควรทำ: (1) สัปดาห์นี้: ให้เวลาตัวเองคิดอย่างสงบ ไม่ต้องรีบตัดสินใจทันที (2) สัปดาห์หน้า: คุยกันตรงๆ ว่าทั้งคู่ยังต้องการอะไรจากความสัมพันธ์นี้ (3) ภายใน 2-3 สัปดาห์: ถ้าคำตอบไม่ตรงกัน ให้กล้าปล่อยวางด้วยความเคารพซึ่งกันและกัน Six of Swords บอกว่าการเดินออกจากสถานการณ์ที่เป็นพิษคือการดูแลตัวเอง"
}`,
  notes: "Shows challenging reading with honest assessment and constructive guidance without being harsh"
};

/**
 * Example 3: 1-card spread - Neutral/balanced scenario
 * Demonstrates: Concise interpretation, balanced perspective, practical advice
 */
export const TAROT_1_CARD_NEUTRAL: FewShotExample = {
  scenario: "1-card daily guidance - neutral situation",
  input: `คำถามผู้ใช้: วันนี้ควรระวังอะไร
จำนวนไพ่: 1
ไพ่ที่เปิดได้:
1. The Hermit (ตั้งตรง) => การใคร่ครวญ ความเงียบ การค้นหาภายใน ปัญญา`,
  output: `{
  "summary": "วันนี้ The Hermit บอกว่าคุณต้องการเวลาอยู่กับตัวเอง ไม่ใช่เพราะหนีปัญหา แต่เพราะต้องการความชัดเจนจากภายใน บางคำตอบไม่ได้อยู่ข้างนอก แต่อยู่ในความเงียบของคุณเอง",
  "cardStructure": "ภาพรวมสถานการณ์: วันนี้พลังงานของ The Hermit เชื้อเชิญให้คุณชะลอความเร่งรีบและหันเข้าหาตัวเอง อาจมีคำถามหรือสถานการณ์ที่ต้องการความคิดเชิงลึก ไม่ใช่แค่ตอบสนองตามอารมณ์หรือความคาดหวังของคนอื่น นี่คือช่วงเวลาที่ดีสำหรับการทบทวน วางแผน หรือศึกษาหาความรู้\\n\\nจุดที่ควรระวัง: อย่าแยกตัวจนเกินไปหรือปิดกั้นคนที่ห่วงใยคุณ The Hermit ต้องการความสงบ ไม่ใช่ความโดดเดี่ยว ระวังอย่าคิดมากจนเป็นกังวล บางครั้งการคิดมากเกินไปก็ทำให้เห็นภาพไม่ชัด\\n\\nแนวทางที่ควรทำ: ให้เวลาตัวเอง 30-60 นาทีในวันนี้เพื่อนั่งคิดอย่างสงบ อาจเป็นการเดินเล่น เขียนไดอารี่ หรือนั่งสมาธิ ถ้ามีเรื่องต้องตัดสินใจ อย่ารีบ ให้เวลาตัวเองคิดจนกระจ่างก่อน และจำไว้ว่าความเงียบไม่ใช่ความอ่อนแอ แต่เป็นพื้นที่ให้ปัญญาเติบโต"
}`,
  notes: "Shows 1-card reading with balanced perspective and practical daily guidance"
};

/**
 * Example 4: 10-card Celtic Cross - Complex scenario
 * Demonstrates: Comprehensive analysis, pattern recognition across positions, integrated guidance
 */
export const TAROT_10_CARD_COMPLEX: FewShotExample = {
  scenario: "10-card Celtic Cross - career transition with multiple factors",
  input: `คำถามผู้ใช้: ควรเปิดธุรกิจส่วนตัวหรือไม่
จำนวนไพ่: 10
ไพ่ที่เปิดได้:
1. Three of Pentacles (ตั้งตรง) => ความร่วมมือ ทักษะ การทำงานเป็นทีม
2. Five of Wands (ตั้งตรง) => การแข่งขัน ความขัดแย้ง ความท้าทาย
3. The Magician (ตั้งตรง) => ทักษะ ความสามารถ การสร้างสรรค์
4. Four of Pentacles (กลับหัว) => ปล่อยวาง ความยืดหยุ่น ไม่ยึดติด
5. Eight of Pentacles (ตั้งตรง) => การฝึกฝน ความเชี่ยวชาญ การพัฒนา
6. Two of Cups (ตั้งตรง) => ความร่วมมือ พันธมิตร ความสัมพันธ์ที่ดี
7. King of Pentacles (ตั้งตรง) => ความมั่นคง ความสำเร็จ การจัดการที่ดี
8. Seven of Swords (กลับหัว) => ความซื่อสัตย์ ความโปร่งใส
9. The Star (ตั้งตรง) => ความหวัง แรงบันดาลใจ วิสัยทัศน์
10. Ten of Pentacles (ตั้งตรง) => ความมั่งคั่ง มรดก ความสำเร็จระยะยาว`,
  output: `{
  "summary": "ไพ่บอกว่าคุณมีทักษะและความพร้อมในการเปิดธุรกิจ (The Magician, Eight of Pentacles) แต่จะต้องเผชิญการแข่งขันและความท้าทาย (Five of Wands) กุญแจสำคัญคือการหาพันธมิตรที่ใช่ (Two of Cups) และการปล่อยวางความกลัวเรื่องเงิน (Four of Pentacles กลับหัว) ผลลัพธ์ระยะยาวมีโอกาสสูงที่จะประสบความสำเร็จและสร้างมูลค่าที่ยั่งยืน (Ten of Pentacles)",
  "cardStructure": "ภาพรวมสถานการณ์: คุณอยู่ในจุดที่มีทักษะและประสบการณ์จากการทำงานเป็นทีม (Three of Pentacles) และมีความสามารถที่จะสร้างสรรค์สิ่งใหม่ (The Magician) แต่กำลังเผชิญความกังวลเรื่องการแข่งขันในตลาด (Five of Wands) อดีตของคุณแสดงให้เห็นการพัฒนาทักษะอย่างต่อเนื่อง (Eight of Pentacles) และตอนนี้กำลังปล่อยวางความยึดติดกับความมั่นคงเดิม (Four of Pentacles กลับหัว) อนาคตใกล้บอกว่าคุณจะพบพันธมิตรหรือลูกค้าที่ใช่ (Two of Cups) และมีโอกาสเติบโตเป็นผู้นำที่มั่นคง (King of Pentacles) ความหวังและวิสัยทัศน์ของคุณชัดเจน (The Star) และผลลัพธ์สุดท้ายชี้ไปที่ความสำเร็จระยะยาวที่สร้างมูลค่าจริง (Ten of Pentacles)\\n\\nจุดที่ควรระวัง: Five of Wands เตือนว่าตลาดมีการแข่งขันสูง ต้องเตรียมพร้อมรับมือกับคู่แข่งและความท้าทาย Seven of Swords กลับหัวบอกว่าต้องโปร่งใสและซื่อสัตย์ในการทำธุรกิจ อย่าใช้กลยุทธ์ที่ไม่สุจริต อย่าคาดหวังว่าจะสำเร็จในชั่วข้ามคืน Eight of Pentacles บอกว่าต้องใช้เวลาฝึกฝนและพัฒนาอย่างต่อเนื่อง\\n\\nแนวทางที่ควรทำ: (1) เดือนแรก: วางแผนธุรกิจให้ละเอียด ศึกษาตลาดและคู่แข่ง ใช้ทักษะที่มี (The Magician) วิเคราะห์จุดแข็งจุดอ่อน (2) เดือนที่ 2-3: หาพันธมิตรหรือที่ปรึกษาที่เชื่อถือได้ (Two of Cups) อย่าทำคนเดียว (3) เดือนที่ 4-6: เริ่มต้นแบบค่อยเป็นค่อยไป ทดสอบตลาดก่อน อย่ากลัวที่จะปรับเปลี่ยน (Four of Pentacles กลับหัว) (4) ปีแรก: โฟกัสที่การสร้างฐานลูกค้าที่มั่นคงและพัฒนาคุณภาพอย่างต่อเนื่อง (Eight of Pentacles) มองเป้าหมายระยะยาว 3-5 ปี (Ten of Pentacles) ไม่ใช่แค่กำไรระยะสั้น"
}`,
  notes: "Shows 10-card Celtic Cross with comprehensive analysis, pattern recognition, and phased action plan"
};

/**
 * Example 5: 2-card spread - Choice/Duality scenario
 * Demonstrates: Comparison between two options, balanced analysis
 */
export const TAROT_2_CARD_CHOICE: FewShotExample = {
  scenario: "2-card choice comparison - career vs stability",
  input: `คำถามผู้ใช้: ควรเลือกงานใหม่หรืออยู่ที่เดิม
จำนวนไพ่: 2
ไพ่ที่เปิดได้:
1. The Chariot (ตั้งตรง) => ชัยชนะ ความมุ่งมั่น การเดินหน้า
2. Four of Pentacles (ตั้งตรง) => ความมั่นคง การยึดติด ความปลอดภัย`,
  output: `{
  "summary": "ไพ่บอกว่าทางเลือก A (งานใหม่) มีพลังขับเคลื่อนและโอกาสเติบโต แต่ต้องกล้าเสี่ยง ส่วนทางเลือก B (อยู่ที่เดิม) ให้ความมั่นคงแต่อาจขาดการเติบโต กุญแจคือคุณพร้อมรับความเปลี่ยนแปลงแค่ไหน",
  "cardStructure": "ภาพรวมสถานการณ์: คุณกำลังยืนอยู่ตรงกลางระหว่างการเดินหน้ากับความปลอดภัย The Chariot บอกว่างานใหม่จะพาคุณไปข้างหน้าอย่างรวดเร็ว แต่ต้องกล้าเสี่ยงและปรับตัวเยอะ ส่วน Four of Pentacles บอกว่างานเดิมให้ความมั่นคงทางการเงิน แต่อาจทำให้รู้สึกติดอยู่ใน comfort zone\n\nจุดที่ควรระวัง: ทางเลือก A อาจทำให้เหนื่อยและกดดันในช่วงแรก ทางเลือก B อาจทำให้พลาดโอกาสใหม่ๆ ถ้ายึดติดมากเกินไป\n\nแนวทางที่ควรทำ: ถ้าคุณพร้อมรับความเสี่ยงและอยากเติบโต งานใหม่เหมาะกว่า แต่ถ้าความมั่นคงทางการเงินสำคัญกว่า งานเดิมก็ยังรองรับได้ ลองตั้งเป้าหมายใหม่ในงานเดิมก่อนตัดสินใจลาออก"
}`,
  notes: "Shows 2-card reading with clear comparison between two choices"
};

/**
 * Example 6: 4-card spread - Action Plan scenario
 * Demonstrates: Structured analysis with situation, obstacle, advice, outcome
 */
export const TAROT_4_CARD_ACTION: FewShotExample = {
  scenario: "4-card action plan - financial decision",
  input: `คำถามผู้ใช้: ควรลงทุนเปิดร้านหรือยัง
จำนวนไพ่: 4
ไพ่ที่เปิดได้:
1. Ace of Pentacles (ตั้งตรง) => โอกาสใหม่ ความมั่งคั่ง จุดเริ่มต้น
2. Seven of Swords (กลับหัว) => ความซื่อสัตย์ ความโปร่งใส
3. The Empress (ตั้งตรง) => ความอุดมสมบูรณ์ การเติบโต ความสร้างสรรค์
4. Ten of Pentacles (ตั้งตรง) => ความมั่งคั่ง ความสำเร็จระยะยาว`,
  output: `{
  "summary": "ไพ่บอกว่าสถานการณ์เหมาะกับการลงทุน โอกาสดีมีอยู่จริง แต่ต้องระวังเรื่องความโปร่งใสและข้อมูลที่ไม่ครบ หากทำตามแผนอย่างรอบคอบ ผลลัพธ์ระยะยาวชี้ไปที่ความมั่งคั่งทางการเงิน",
  "cardStructure": "ภาพรวมสถานการณ์: Ace of Pentacles บอกว่าคุณมีโอกาสทางการเงินที่ดีอยู่ตรงหน้า เป็นจังหวะที่เหมาะกับการเริ่มต้นสิ่งใหม่\n\nจุดที่ควรระวัง: Seven of Swords กลับหัวเตือนว่าอาจมีข้อมูลที่ไม่ครบหรือความเสี่ยงที่มองไม่เห็น ตรวจสอบข้อมูลให้ครบก่อนตัดสินใจ\n\nแนวทางที่ควรทำ: The Empress แนะนำให้เติบโตอย่างค่อยๆ เริ่มจากเล็กแล้วขยาย (1) ภายใน 2 สัปดาห์: ศึกษาตลาดและทำแผนธุรกิจให้ชัด (2) เดือนแรก: ลงทุนเล็กๆ เพื่อทดสอบตลาด (3) เดือนที่ 2-3: ขยายการลงทุนตามผลที่ได้"
}`,
  notes: "Shows 4-card action plan with clear situation-obstacle-advice-outcome structure"
};

/**
 * Example 7: 5-card spread - Five Card Cross scenario
 * Demonstrates: Cross-shaped spread with situation, past, future, goal, and foundation
 */
export const TAROT_5_CARD_CROSS: FewShotExample = {
  scenario: "5-card cross - understanding current challenge",
  input: `คำถามผู้ใช้: ทำไมงานถึงไม่ก้าวหน้า
จำนวนไพ่: 5
ไพ่ที่เปิดได้:
1. Eight of Swords (ตั้งตรง) => ความรู้สึกติดกับดัก การถูกจำกัด ขาดทางออก
2. Five of Cups (ตั้งตรง) => ความผิดหวัง การสูญเสีย มองแต่สิ่งที่เสียไป
3. Three of Wands (ตั้งตรง) => การรอคอยผล การวางแผน การมองไปข้างหน้า
4. The Chariot (ตั้งตรง) => ชัยชนะ ความมุ่งมั่น การเดินหน้า
5. The Hermit (ตั้งตรง) => การใคร่ครวญ การค้นหาภายใน ปัญญา`,
  output: `{
  "summary": "ไพ่บอกว่าคุณกำลังรู้สึกติดกับดัก (Eight of Swords) เพราะยังผูกพันกับความผิดหวังในอดีต (Five of Cups) แต่แนวโน้มอนาคตดี (Three of Wands) เป้าหมายคือความก้าวหน้า (The Chariot) แต่ต้องเริ่มจากการค้นหาคำตอบจากภายใน (The Hermit) ก่อน",
  "cardStructure": "สถานการณ์หลัก (ศูนย์): Eight of Swords บอกว่าคุณรู้สึกเหมือนติดกับดัก ขาดทางเลือก แต่ความจริงคือข้อจำกัดส่วนใหญ่อยู่ในความคิด ไม่ใช่สถานการณ์จริง\\n\\nอดีต (ขวา): Five of Cups อธิบายว่าคุณผ่านความผิดหวังหรือความสูญเสียมา และยังมองแต่สิ่งที่เสียไปมากกว่าสิ่งที่เหลืออยู่ นี่คือพื้นฐานที่ทำให้รู้สึกติด\\n\\nอนาคต (ซ้าย): Three of Wands บอกว่าหากคุณยอมรับและปล่อยวาง โอกาสใหม่จะปรากฏ ต้องอดทนรอผลจากความพยายามที่ผ่านมา\\n\\nเป้าหมาย/ความท้าทาย (บน): The Chariot แสดงว่าเป้าหมายของคุณคือการเดินหน้าอย่างมุ่งมั่น แต่ต้องควบคุมทั้งความคิดและอารมณ์ให้เป็นอันหนึ่งอันเดียวกัน\\n\\nรากฐาน/จิตใต้สำนึก (ล่าง): The Hermit บอกว่าคำตอบอยู่ภายใน คุณต้องใช้เวลาอยู่กับตัวเองเพื่อเข้าใจว่าอะไรคือสิ่งที่แท้จริงต้องการ\\n\\nจุดที่ควรระวัง: อย่าหลอกตัวเองว่าไม่มีทางเลือก Eight of Swords บอกว่าคุณมีทางออกเสมอ แค่ยังมองไม่เห็น อย่าให้อดีตมากำหนดอนาคต\\n\\nแนวทางที่ควรทำ: (1) สัปดาห์นี้: หาเวลาอยู่กับตัวเอง ทบทวนว่าอะไรทำให้รู้สึกติด (The Hermit) (2) สัปดาห์หน้า: ลิสต์สิ่งที่ยังมีอยู่และสิ่งที่ทำได้ ไม่ใช่แค่สิ่งที่เสียไป (3) เดือนหน้า: ตั้งเป้าหมายก้าวหน้าที่ชัดเจนและลงมือทำทีละขั้น (The Chariot)"
}`,
  notes: "Shows 5-card cross spread with center, past, future, goal/challenge, and foundation positions"
};

/**
 * Example 8: 6-card spread - Relationship Spread scenario
 * Demonstrates: Deep relationship analysis with you, partner, past, present, future, outcome
 */
export const TAROT_6_CARD_RELATIONSHIP: FewShotExample = {
  scenario: "6-card relationship - understanding dynamics",
  input: `คำถามผู้ใช้: ความสัมพันธ์จะพัฒนาไปอย่างไร
จำนวนไพ่: 6
ไพ่ที่เปิดได้:
1. Queen of Cups (ตั้งตรง) => อารมณ์ ความเห็นอกเห็นใจ การดูแล
2. King of Swords (ตั้งตรง) => ความคิด ความยุติธรรม การตัดสินใจ
3. Two of Cups (ตั้งตรง) => ความรัก การเชื่อมโยง พันธมิตร
4. Five of Wands (ตั้งตรง) => ความขัดแย้ง การแข่งขัน ความเข้าใจผิด
5. The Lovers (ตั้งตรง) => ความรัก การเลือก ความสามัคคี
6. Ten of Cups (ตั้งตรง) => ความสุข ความสมบูรณ์ ครอบครัว`,
  output: `{
  "summary": "ไพ่บอกว่าคุณ (Queen of Cups) แสดงอารมณ์และความเห็นอกเห็นใจ ส่วนเขา (King of Swords) ใช้ความคิดและเหตุผล อดีตมีความรักและเชื่อมโยงดี (Two of Cups) แต่ปัจจุบันมีความขัดแย้ง (Five of Wands) อนาคตมีโอกาสเลือกความสามัคคี (The Lovers) และผลลัพธ์ชี้ไปที่ความสุข (Ten of Cups)",
  "cardStructure": "คุณ (ตำแหน่ง 1): Queen of Cups บอกว่าคุณเป็นคนอ่อนไหว ใส่ใจ และแสดงความรักผ่านการดูแล คุณให้คุณค่ากับความสัมพันธ์ทางอารมณ์\\n\\nเขา/อีกฝ่าย (ตำแหน่ง 2): King of Swords แสดงว่าเขาเป็นคนใช้เหตุผล ตัดสินใจจากข้อเท็จจริง อาจดูเย็นชาแต่ซื่อสัตย์ ความแตกต่างนี้คือทั้งจุดแข็งและจุดอ่อน\\n\\nอดีตความสัมพันธ์ (ตำแหน่ง 3): Two of Cups บอกว่าความสัมพันธ์เริ่มต้นด้วยความเชื่อมโยงที่ลึกซึ้ง มีความเข้าใจและรู้สึกว่าเป็นเนื้อคู่\\n\\nปัจจุบัน (ตำแหน่ง 4): Five of Wands แสดงว่าตอนนี้มีความขัดแย้งหรือความเข้าใจผิด อาจทะเลาะเรื่องเล็กน้อยหรือมีความเห็นไม่ตรงกัน\\n\\nอนาคต (ตำแหน่ง 5): The Lovers บอกว่าทั้งคู่จะต้องเลือกว่าจะรักษาความสัมพันธ์ไว้หรือไม่ ถ้าเลือกที่จะอยู่ด้วยกัน ความรักจะลึกซึ้งขึ้น\\n\\nผลลัพธ์ (ตำแหน่ง 6): Ten of Cups เป็นผลลัพธ์ที่ดีที่สุด บอกว่าหากผ่านช่วงทดสอบนี้ไปได้ ความสัมพันธ์จะเต็มไปด้วยความสุขและความสมบูรณ์\\n\\nจุดที่ควรระวัง: ความแตกต่างระหว่างอารมณ์กับเหตุผล (Queen vs King) อาจทำให้เข้าใจผิดกัน คุณอาจรู้สึกว่าเขาไม่ใส่ใจ เขาอาจรู้สึกว่าคุณอ่อนไหวเกินไป\\n\\nแนวทางที่ควรทำ: (1) คุยกันตรงๆ ว่าต่างคนต่างแสดงความรักแบบไหน (2) เมื่อทะเลาะ ให้เขาอธิบายเหตุผลก่อน แล้วคุณค่อยบอกความรู้สึก (3) ตั้งเป้าร่วมกันและทำให้ชัดเจนว่าทั้งคู่ต้องการความสัมพันธ์นี้จริงๆ"
}`,
  notes: "Shows 6-card relationship spread with you, partner, past, present, future, and outcome positions"
};

/**
 * All tarot examples grouped by spread type
 */
export const TAROT_EXAMPLES_BY_SPREAD = {
  single: [TAROT_1_CARD_NEUTRAL],
  dual: [TAROT_2_CARD_CHOICE],
  three: [TAROT_3_CARD_POSITIVE, TAROT_3_CARD_CHALLENGING],
  action: [TAROT_4_CARD_ACTION],
  five: [TAROT_5_CARD_CROSS],
  relationship: [TAROT_6_CARD_RELATIONSHIP],
  celtic: [TAROT_10_CARD_COMPLEX]
};

/**
 * All tarot examples in a flat array
 */
export const TAROT_EXAMPLES: FewShotExample[] = [
  TAROT_1_CARD_NEUTRAL,
  TAROT_2_CARD_CHOICE,
  TAROT_3_CARD_POSITIVE,
  TAROT_3_CARD_CHALLENGING,
  TAROT_4_CARD_ACTION,
  TAROT_5_CARD_CROSS,
  TAROT_6_CARD_RELATIONSHIP,
  TAROT_10_CARD_COMPLEX
];
