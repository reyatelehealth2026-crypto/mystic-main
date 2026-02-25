# REFFORTUNE Web (Next.js)

เว็บดูดวงออนไลน์ (Thai-first) สำหรับ REFFORTUNE

## ฟีเจอร์หลัก

- ไพ่ทาโรต์ (เลือก 1/3/10 ใบ)
- ไพ่จิตวิญญาณ (Spirit Card)
- วิเคราะห์เบอร์มงคล (Numerology)
- ห้องสมุดไพ่ 78 ใบ
- โหมดถามต่อเกี่ยวกับไพ่
- ปุ่มนำทางลอย (FAB) + CTA แอดไลน์เด่นทุกหน้า

---

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS

---

## เริ่มต้นใช้งาน (Local)

```bash
npm install
npm run dev
```

เปิด `http://localhost:3000`

คำสั่งที่ใช้บ่อย:

```bash
npm run lint
npm run build
npm run start
```

---

## Environment Variables

สร้างไฟล์ `.env.local`

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-2.0-flash
```

> ถ้าไม่มี `GEMINI_API_KEY` บางหน้าอ่านผลเชิงลึกจะไม่ทำงานครบ

---

## โครงสร้างสำคัญ

- `src/app/page.tsx` — Landing Page
- `src/app/tarot/*` — Tarot flow (pick/result)
- `src/app/spirit-card/page.tsx` — Spirit Card
- `src/app/numerology/page.tsx` — Numerology
- `src/app/pricing/page.tsx` — แพ็กเกจ
- `src/app/api/ai/*` — API routes สำหรับ Gemini

---

## ขั้นตอนเตรียมก่อน Deploy ขึ้น Vercel (Checklist)

## 1) เช็กโค้ดก่อน

```bash
npm run lint
npm run build
```

ต้องผ่านทั้ง 2 คำสั่งก่อน deploy

## 2) เช็กค่า Environment ใน Vercel

ตั้งค่าใน Project Settings → Environment Variables:

- `GEMINI_API_KEY`
- `GEMINI_MODEL` (แนะนำ `gemini-2.0-flash`)

ใส่ครบทั้ง Environment ที่ใช้จริง (Production / Preview)

## 3) ตรวจหน้า/ฟีเจอร์สำคัญก่อนปล่อย

- Landing โหลดปกติ
- Tarot pick/result ทำงานครบ
- Spirit/Numerology แสดงผลได้
- CTA แอดไลน์และลิงก์แพ็กเกจกดได้
- API routes ตอบได้ (`/api/ai/tarot`, `/api/ai/spirit`, `/api/ai/numerology`, `/api/ai/tarot-chat`)

## 4) Deploy บน Vercel

วิธีง่ายสุด:

1. Push โค้ดขึ้น GitHub
2. Import repo บน Vercel
3. ตั้ง Root Directory เป็นโฟลเดอร์ `web` (ถ้าเป็น monorepo)
4. ใส่ Environment Variables
5. Deploy

## 5) Post-deploy smoke test

หลัง deploy ให้เทสต์ทันที:

- เปิดหน้าแรก
- เปิดไพ่ 1 ครั้ง
- ส่งคำถามในโหมดถามเกี่ยวกับไพ่ 1 ครั้ง
- เช็ก console/network ว่าไม่มี 500

---

## หมายเหตุเชิงปฏิบัติ

- ถ้าเจอ output จาก AI เป็น object แปลก ๆ ฝั่ง UI มี normalization guard แล้ว
- หาก Gemini โควต้าเต็ม ระบบมี fallback โครงข้อความพื้นฐานเพื่อกันหน้าแตก

---

พร้อมใช้งานสำหรับ deploy production ✅
