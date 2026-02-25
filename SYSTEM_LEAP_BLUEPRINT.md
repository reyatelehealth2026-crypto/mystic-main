# MysticFlow — System Leap Blueprint (MVP -> Growth Engine)

## 1) Funnel Re-architecture (Awareness -> Reading -> Trust -> Share -> Paid -> Retain)

1. **Awareness**
   - Entry pages: Home, Daily Card teaser, SEO card library.
   - Promise: "แม่น + เข้าใจง่าย + มี action ทำได้จริง"
   - CTA: Quick win first (`/daily-card`) to reduce friction.

2. **Reading**
   - Unified reading pipeline across Tarot / Spirit / Numerology.
   - Fast first result (<= 5 sec interaction time).
   - Deterministic interpretation baseline for repeatability.

3. **Trust**
   - "Trust transparency" panel for every result:
     - input used
     - evidence tokens
     - confidence label
   - Interpretation schema enforces consistent structure.

4. **Share**
   - Share CTA after result blocks (next slice): copy summary + deep link.
   - Event tracked: `share_clicked`.

5. **Paid**
   - Rule-based paywall triggered at high-intent moments (result pages).
   - Offer ladder by session depth (starter credits -> monthly pro).

6. **Retain**
   - Daily return loop: daily-card + streak + saved readings (next slice).
   - Nudges from history deltas (week-over-week signal change).

## 2) Product Pillars (beat Reffortune)

1. **Personalization Depth**
   - Multi-signal composition: tarot cards + DOB + phone numerology.
   - Deterministic base + optional adaptive layer later.

2. **Trust Transparency**
   - Show evidence and confidence for each reading.
   - Same input => same core interpretation.

3. **Outcome-Oriented Guidance**
   - Interpretation blocks always include action and caution.
   - Replace vague prophecy with behavior-level recommendations.

4. **Retention Loops**
   - Daily low-friction session.
   - Progressive unlocks and follow-up prompts.

## 3) Modular Architecture Map

- `src/lib/reading/pipeline.ts`
  - **Boundary:** orchestration only
  - stages: normalize -> run engine -> compose schema blocks
- `src/lib/interpretation/schema.ts`
  - **Contract:** cross-vertical output format
- `src/lib/tarot/*`
  - tarot/spirit deterministic engines
- `src/lib/numerology/*`
  - phone normalization + scoring + themes
- `src/lib/analytics/events.ts`
  - event taxonomy utility (local queue for MVP)
- `src/lib/monetization/paywall.ts`
  - configurable trigger rules by funnel surface

Data contract (shared output):
- kind, title, subtitle, confidenceLabel
- summary
- blocks[]: label/content/tone
- evidence[]
- generatedAt

## 4) Quality Framework

### A) Interpretation Consistency Rubric (Thai)
- **ชัดเจน:** อ่านแล้วเข้าใจในครั้งเดียว (ไม่กำกวม)
- **มีเหตุผล:** มี evidence อ้างอิงจาก input/token
- **ลงมือได้:** มี action ภายใน 24 ชม.
- **สมดุล:** มีทั้งโอกาส + ข้อควรระวัง
- **คงเส้นคงวา:** input เดิม -> output แกนเดิม

### B) UX Clarity Rubric
- First meaningful result <= 2 interactions.
- Result page must show 3 parts: summary, structured blocks, trust panel.
- CTA hierarchy: primary (next step), secondary (rerun/share).

### C) Performance Budgets
- LCP target: < 2.5s (mobile)
- JS route payload target: < 170KB initial
- Interaction to result: < 5s user-time on first read

## 5) Monetization System Design

- **Credit Economy**
  - 1 standard reading = 1 credit
  - deep report = 3-5 credits
- **Paywall placements**
  - after reading result render
  - after repeated completed readings
- **Package ladder**
  - Starter Pack (30 credits)
  - Pro Monthly (unlimited standard + weekly deep report quota)
  - Premium Annual (best ARPU/retention target)
- **Entitlements**
  - Free: basic summary + limited blocks
  - Paid: deeper blocks, weekly plan, saved timeline, comparisons

## 6) Analytics Plan

### Event taxonomy (implemented core)
- `page_view`
- `reading_started`
- `reading_completed`
- `paywall_triggered`
- `paywall_cta_clicked`

### North-star metric
- **Weekly Qualified Readings per Active User (WQR/AU)**

### Input metrics
- Landing -> reading start rate
- Reading complete rate
- Paywall trigger -> CTA click rate
- D1 / D7 return rate

### Dashboard slices
- by vertical: tarot/spirit/numerology
- by traffic source
- by first-session vs repeat-session
- by paywall offer code

## 7) 14-day execution plan (impact-ranked)

### P0 (Days 1-4)
1. Unified pipeline + shared schema (done in this slice)
2. Core funnel tracking events (done in this slice)
3. Rule-based paywall trigger + CTA stub (done in this slice)
4. Trust panel on all result pages (done in this slice)

**Hypothesis:** +20-30% reading completion, +10-15% trust engagement, +8-12% paywall exposure quality.

### P1 (Days 5-9)
1. Persist reading history (local + backend-ready contract)
2. Share flow (copy/line share with summary card)
3. Credit ledger + pricing page integration

**Hypothesis:** +15% D1 retention, +5-8% share-assisted traffic.

### P2 (Days 10-14)
1. Weekly follow-up loop + reminder hooks
2. A/B paywall variants by intent depth
3. Quality scoring harness for interpretation consistency

**Hypothesis:** +8-12% D7 retention, +10-20% conversion lift from paywall optimization.
