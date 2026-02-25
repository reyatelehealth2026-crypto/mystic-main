# REFFORTUNE (mysticflow/web) — Implementation Plan

**Brand:** REFFORTUNE — ดูดวงกับเรฟ  
**Language:** Thai-first, ใช้สรรพนาม “คุณ”  
**Theme:** Mystical Modern — **Palette B (Midnight + Solar Gold)**  
**Tech:** Next.js 16 (App Router) + React 19 + TS + Tailwind

> เป้าหมายรอบนี้: ทำให้ UI “นิ่งและสวย” แบบธีมเดียวทั้งเว็บ + ทำ core loop ให้จบ (Tarot pick → result → save → library) โดยใช้ **localStorage**

---

## 0) Design & Copy Standards (ใช้ทั้งระบบ)

### Palette B (canonical)
- bg: `#06070B`
- surface: `#10121A`
- surface-2: `#171B27`
- border: `#2A3147`
- text: `#F3F4F8`
- muted: `#B6BDD2`
- gold (accent): `#F4C86A`
- rose (accent-2): `#FF4AA2`
- teal (accent-3): `#2DE2E6`
- success: `#3DDB84`
- warning: `#F9D65C`
- danger: `#FF5B5B`

### Typography
- Display: **Cinzel** 600–700
- Body/UI: **Inter** 400–600

### Motion
- ค่าเริ่มต้น 150–250ms, easing-out
- ต้องรองรับ `prefers-reduced-motion` (ลด/ปิด shimmer/flip ที่ไม่จำเป็น)

### Copy base
- Loading: `กำลังโหลด…`
- Processing: `กำลังประมวลผล…`
- Success toast: `บันทึกเรียบร้อย`
- Error: `ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง`
- Retry: `ลองใหม่`
- Disclaimer (สั้น): `ผลลัพธ์นี้ใช้เพื่อการสะท้อนแนวโน้มและการตัดสินใจของคุณ`

---

## 1) Sprint 0 — Theme Final + UI Primitives (เริ่มจาก A)

### 1.1 Tailwind theme (final)
**ไฟล์เป้าหมาย**
- `tailwind.config.(js|ts)`
- `src/app/globals.css`

**สิ่งที่ต้องมี**
- Colors: `bg/surface/surface-2/border/text/muted/gold/rose/teal/success/warning/danger`
- Background: หน้าเว็บใช้ gradient/aurora แบบเบา (ไม่กิน perf)
- Shadow: glass inset + glow accent
- Radius scale: inputs (10px) / cards (14px) / modals (18px) / hero (24px)

### 1.2 Fonts setup (Next.js)
**ไฟล์เป้าหมาย**
- `src/app/layout.tsx`

**แนวทาง**
- ใช้ `next/font/google` โหลด Cinzel + Inter
- ผูกเป็น CSS variables เช่น `--font-display`, `--font-sans`

### 1.3 UI class recipes (single source of truth)
**ไฟล์เป้าหมาย**
- `src/components/ui/classes.ts` (หรือ `src/lib/ui/classes.ts`)

**ต้องมี**
- `surface`, `card`
- `btnBase`, `btnPrimary` (gold), `btnGhost`, `btnDanger`
- `input`, `label`, `helperText`
- `pill`, `iconBtn`

### 1.4 AppShell + Global CTA
**ไฟล์เป้าหมาย**
- `src/components/layout/AppShell.tsx`
- `src/components/cta/LineFab.tsx`

**ข้อกำหนด**
- Header/Nav: Tarot / Numerology / Library / Pricing
- FAB “LINE” + tooltip: `ต้องการความช่วยเหลือ? คุยกับเราใน LINE`
- ปุ่ม CTA inline: `เปิด LINE` (+ optional copy id)

---

## 2) Sprint 1 — Core Loop (Tarot pick → result → save → library) + localStorage

### 2.1 LocalStorage model (MVP)
**ไฟล์เป้าหมาย**
- `src/lib/storage/readings.ts`
- `src/lib/storage/schema.ts` (optional)
- `src/hooks/useReadings.ts`

**Types (แนะนำ)**
- `ReadingType = 'tarot' | 'numerology' | 'spirit' | 'daily'`
- `TarotSpread = 1 | 3 | 10`
- `SavedReading`:
  - `id: string` (uuid)
  - `type: ReadingType`
  - `createdAt: number`
  - `topic?: string`
  - `question?: string`
  - `spread?: TarotSpread`
  - `cards?: Array<{ id: string; name: string; upright?: boolean }>`
  - `summary?: string; advice?: string; caution?: string`
  - `rawText?: string` (กัน schema AI เปลี่ยน)
  - `note?: string`
  - `schemaVersion: number`

**Functions**
- `getReadings()`
- `saveReading(reading)`
- `updateReading(id, patch)`
- `deleteReading(id)`
- `migrateIfNeeded()` (schema versioning กันของเก่าพัง)

> ข้อควรระวัง: localStorage ต้องเรียกใน client เท่านั้น (hook/component ใส่ `'use client'`)

### 2.2 Routes ที่ต้อง “จบ” ให้ครบ states
- `src/app/tarot/page.tsx` — entry (เลือกหัวข้อ + จำนวนไพ่ + CTA)
- `src/app/tarot/pick/page.tsx` — เลือกไพ่ + progress + reset
- `src/app/tarot/result/page.tsx` — แสดงผล + ปุ่มบันทึก + error/empty
- `src/app/library/page.tsx` — “คลังของฉัน” (saved readings)

**State requirements**
- loading / empty / error ทุกหน้าหลัก
- deep link ไป result โดยไม่มี data → ต้องมี recover CTA (`กลับไปเลือกไพ่`)

---

## 3) Sprint 2 — Retention + Monetization Surfaces

- `/daily-card` (เปิดไพ่วันนี้ + สรุป/คำแนะนำ/ระวัง)
- `/spirit-card` (ไพ่พลังงาน)
- `/numerology` (Life Path + Personal Year) + validation วันเกิด
- `/pricing` (โครงแพ็กเกจ + FAQ + ปุ่มคุย LINE)

**Monetization principle**
- Free ต้องได้ “คำตอบหลัก” เสมอ
- Premium เป็น “เจาะลึกเพิ่ม/ความต่อเนื่อง/เครื่องมือ” (ไม่ paywall ทั้งหน้า)

---

## 4) QA Gate (ก่อนปล่อยทุกสปรินต์)
- a11y: focus-visible, keyboard, semantics, contrast, reduced motion
- edge cases: refresh/back/deeplink, กดซ้ำ, API fail/timeout/429
- perf: ไม่ preload ทั้งเด็ค, lazy-load รูป, จำกัด animation

---

## 5) Definition of Done (MVP)
- ผู้ใช้เข้า `/tarot` → เลือก 1/3/10 → ดู `/tarot/result` ได้จริง
- กด **บันทึกผลนี้** แล้วไปดูใน `/library` ได้
- UI ธีม Palette B ครบทั้งเว็บ + LINE FAB/CTA แสดงทุกหน้า
