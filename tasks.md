## 📋 REFFORTUNE (mysticflow/web) — Dev Tasks

**Status:** 🟡 Planning → Implementing

> โฟกัสตอนนี้: **Sprint 0 (Theme final)** แล้วค่อยไป **Sprint 1 (localStorage library)**

---

## Sprint 0 — Theme Final + UI Primitives (A)

### Theme + fonts
- [ ] Update `tailwind.config.(js|ts)` ให้เป็น Palette B keys
  - [ ] colors: bg/surface/surface-2/border/text/muted/gold/rose/teal/success/warning/danger
  - [ ] shadows: glass inset + glow
  - [ ] radius: sm/md/lg/xl
  - [ ] backgroundImage: aurora/page gradient + sheen
- [ ] Update `src/app/globals.css`
  - [ ] base background + text color defaults
  - [ ] selection color + scrollbar (optional)
  - [ ] reduced motion helper class (optional)
- [ ] Fonts in `src/app/layout.tsx`
  - [ ] Cinzel + Inter via `next/font/google`
  - [ ] map to CSS vars + Tailwind fontFamily

### UI primitives (recipes)
- [ ] Create `src/components/ui/classes.ts`
  - [ ] `surface`, `card`
  - [ ] `btnBase`, `btnPrimary`(gold), `btnGhost`, `btnDanger`
  - [ ] `input`, `label`, `helperText`
  - [ ] `pill`, `iconBtn`
- [ ] Create small `cn()` helper (ถ้ามี) `src/lib/cn.ts`

### Layout + CTA
- [ ] Create `src/components/layout/AppShell.tsx`
  - [ ] Header/Nav: Tarot / Numerology / Library / Pricing
  - [ ] Responsive: mobile menu/drawer (ถ้าทัน)
- [ ] Create `src/components/cta/LineFab.tsx`
  - [ ] FAB label: `LINE`
  - [ ] tooltip: `ต้องการความช่วยเหลือ? คุยกับเราใน LINE`
- [ ] Add inline LINE CTA block component `src/components/cta/LineCtaBlock.tsx`

### A11y baseline
- [ ] Focus ring standard (อย่าปิด outline)
- [ ] Tap targets ≥44px (ปุ่มหลัก h-11)
- [ ] `prefers-reduced-motion` สำหรับ shimmer/flip

---

## Sprint 1 — Core Loop + localStorage Library

### Local storage layer
- [ ] Create `src/lib/storage/readings.ts`
  - [ ] key name: `reffortune.readings`
  - [ ] schemaVersion + migrate
  - [ ] CRUD: get/save/update/delete
- [ ] Create `src/hooks/useReadings.ts` (`'use client'`)
  - [ ] load on mount + sync on change

### Pages
- [ ] `/tarot` (`src/app/tarot/page.tsx`)
  - [ ] Topic selector (ภาพรวม/การงาน/การเงิน/ความรัก/สุขภาพ)
  - [ ] Spread selector (1/3/10)
  - [ ] CTA: `เริ่มเลือกไพ่`
- [ ] `/tarot/pick` (`src/app/tarot/pick/page.tsx`)
  - [ ] Instruction per spread + progress `เลือกแล้ว x / y ใบ`
  - [ ] Enforce selection count
  - [ ] Buttons: `ดูผล` (disabled until complete), `เริ่มใหม่`
- [ ] `/tarot/result` (`src/app/tarot/result/page.tsx`)
  - [ ] Sections: `สรุปสำหรับคุณ`, `คำแนะนำที่ทำได้ทันที`, `สิ่งที่ควรระวัง`
  - [ ] Utilities: `บันทึกผลนี้`, `คัดลอกข้อความ`, `แชร์`
  - [ ] Save → localStorage + toast `บันทึกเรียบร้อย`
  - [ ] Empty/missing data → CTA `กลับไปเลือกไพ่`
- [ ] `/library` (`src/app/library/page.tsx`)
  - [ ] List saved readings (type/date/topic)
  - [ ] Empty state + CTA ไป `/tarot`
  - [ ] Delete + confirm

### QA pass
- [ ] Keyboard-only ผ่าน flow Tarot ทั้งเส้น
- [ ] Refresh/back/deeplink ไม่พัง
- [ ] API error/timeout มี UI retry

---

## Sprint 2 — Retention + Monetization Surfaces
- [ ] `/daily-card`
- [ ] `/spirit-card`
- [ ] `/numerology` (Life Path + Personal Year) + validation
- [ ] `/pricing` + FAQ + LINE CTA
- [ ] Shareable result (image/link) (ถ้าทัน)

---

## QA / Release Gate (ทุกสปรินต์)
- [ ] Lighthouse/Axe ผ่านประเด็นหลัก (focus/contrast/labels)
- [ ] Responsive: 360, 390, 768, 1024, 1280+
- [ ] Performance: lazy-load images, จำกัด animation, no CLS เมื่อ AI text มา
