import { ThaiDay, ThaiPlanet } from "../types";

export interface DayPlanetInterpretation {
  day: ThaiDay;
  dayNameTh: string;
  planet: ThaiPlanet;
  planetNameTh: string;
  symbol: string;
  color: string;
  trait: string;
  blessing: string;
  caution: string;
}

export const DAY_TO_PLANET: Record<ThaiDay, ThaiPlanet> = {
  [ThaiDay.ARWAN]: ThaiPlanet.ATHIT,
  [ThaiDay.JAN]: ThaiPlanet.CHAN,
  [ThaiDay.ANGKAN]: ThaiPlanet.ANGKAN,
  [ThaiDay.PHUT]: ThaiPlanet.PHUT,
  [ThaiDay.PHAHAT]: ThaiPlanet.PHAHAT,
  [ThaiDay.SUK]: ThaiPlanet.SUK,
  [ThaiDay.SAO]: ThaiPlanet.SAO,
};

export const DAY_PLANET_TABLE: Record<ThaiDay, DayPlanetInterpretation> = {
  [ThaiDay.ARWAN]: {
    day: ThaiDay.ARWAN,
    dayNameTh: "อาทิตย์",
    planet: ThaiPlanet.ATHIT,
    planetNameTh: "พระอาทิตย์ (๑)",
    symbol: "☉",
    color: "แดงชาด",
    trait:
      "คุณเป็นคนเด่นในกลุ่ม มั่นใจ ใจกว้าง รักเกียรติยศและมีพลังเป็นผู้นำ คนรอบข้างมักให้คุณตัดสินใจเรื่องสำคัญ",
    blessing: "พระอาทิตย์เสริมความสง่าและบารมี เหมาะกับการเป็นเจ้าคน นายคน ตำแหน่งสูง",
    caution: "ระวังอีโก้และโทสะ เมื่อคนอื่นไม่ทำตามใจ ฝึกอ่อนน้อมเพื่อรักษาความสัมพันธ์",
  },
  [ThaiDay.JAN]: {
    day: ThaiDay.JAN,
    dayNameTh: "จันทร์",
    planet: ThaiPlanet.CHAN,
    planetNameTh: "พระจันทร์ (๒)",
    symbol: "☽",
    color: "เหลืองนวล",
    trait:
      "คุณเป็นคนอ่อนโยน ใจดี โรแมนติก มีเสน่ห์แบบนุ่มนวล อ่อนไหวต่ออารมณ์คนรอบข้าง",
    blessing: "พระจันทร์เสริมความเมตตาและเสน่ห์ คนรักง่าย ทำงานที่เกี่ยวกับคนได้ดี",
    caution: "ระวังอารมณ์เปลี่ยนแปลงตามคนรอบตัว ฝึกตั้งหลักให้นิ่ง อย่าซึมซับความทุกข์คนอื่นจนเสียตัวเอง",
  },
  [ThaiDay.ANGKAN]: {
    day: ThaiDay.ANGKAN,
    dayNameTh: "อังคาร",
    planet: ThaiPlanet.ANGKAN,
    planetNameTh: "พระอังคาร (๓)",
    symbol: "♂",
    color: "ชมพู",
    trait:
      "คุณเป็นคนใจสู้ กล้าหาญ ทำอะไรเอาจริงเอาจัง รักความท้าทาย และไม่ยอมแพ้อะไรง่าย ๆ",
    blessing: "พระอังคารเสริมพลังกายและความกล้า เหมาะกับงานสายแข่งขัน บุกเบิก หรือกีฬา",
    caution: "ใจร้อนและพูดแรง ระวังเรื่องอุบัติเหตุและการทะเลาะวิวาท ฝึกสติก่อนตัดสินใจ",
  },
  [ThaiDay.PHUT]: {
    day: ThaiDay.PHUT,
    dayNameTh: "พุธ",
    planet: ThaiPlanet.PHUT,
    planetNameTh: "พระพุธ (๔)",
    symbol: "☿",
    color: "เขียวใบไม้",
    trait:
      "คุณเป็นคนพูดเก่ง เจรจาเก่ง คล่องตัว ปรับตัวเร็ว และเรียนรู้ไวกว่าคนทั่วไป",
    blessing: "พระพุธเสริมปัญญาและการสื่อสาร เหมาะกับงานการค้า การสอน และเทคโนโลยี",
    caution: "ระวังการพูดมากเกินไปและการกลับกลอก ฝึกรักษาคำพูดและจดจ่อกับเรื่องเดียวให้จบ",
  },
  [ThaiDay.PHAHAT]: {
    day: ThaiDay.PHAHAT,
    dayNameTh: "พฤหัสบดี",
    planet: ThaiPlanet.PHAHAT,
    planetNameTh: "พระพฤหัสบดี (๕)",
    symbol: "♃",
    color: "ส้ม",
    trait:
      "คุณเป็นคนใจกว้าง มีคุณธรรม เคารพหลักการ มีบารมีในวัยกลางคน คนเชื่อใจและขอคำปรึกษาบ่อย",
    blessing: "พระพฤหัสเสริมความรู้และความศรัทธา เหมาะกับครู ที่ปรึกษา ผู้พิพากษา และนักธุรกิจระยะยาว",
    caution: "ระวังการสอนคนอื่นมากเกินไปจนลืมฟัง ฝึกถ่อมตนและเปิดใจรับความคิดใหม่",
  },
  [ThaiDay.SUK]: {
    day: ThaiDay.SUK,
    dayNameTh: "ศุกร์",
    planet: ThaiPlanet.SUK,
    planetNameTh: "พระศุกร์ (๖)",
    symbol: "♀",
    color: "ฟ้า",
    trait:
      "คุณเป็นคนรักความสวยงาม มีรสนิยม เสน่ห์ดี ใส่ใจในการแต่งตัวและความสัมพันธ์",
    blessing: "พระศุกร์เสริมเสน่ห์และทรัพย์ที่มาจากความสวยงาม เหมาะกับงานศิลปะ แฟชั่น อาหาร และความบันเทิง",
    caution: "ระวังความฟุ่มเฟือยและความรักที่ทำให้ใจเสียสมดุล ฝึกเก็บออมและรักษาขอบเขต",
  },
  [ThaiDay.SAO]: {
    day: ThaiDay.SAO,
    dayNameTh: "เสาร์",
    planet: ThaiPlanet.SAO,
    planetNameTh: "พระเสาร์ (๗)",
    symbol: "♄",
    color: "ดำม่วง",
    trait:
      "คุณเป็นคนนิ่ง ลึก อดทน วินัยสูง ไม่แสดงออกง่าย แต่เมื่อเริ่มลงมือแล้วจะไปได้ไกล",
    blessing: "พระเสาร์เสริมความอดทนและความสำเร็จระยะยาว เหมาะกับงานที่ต้องใช้เวลาและฝีมือ",
    caution: "ระวังความเครียดสะสมและความโดดเดี่ยว ฝึกพักผ่อนและเปิดใจกับคนใกล้ตัว",
  },
};
