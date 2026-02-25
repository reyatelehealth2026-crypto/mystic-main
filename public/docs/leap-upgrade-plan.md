# MysticFlow Leap Upgrade Plan (System-first, not patch-first)

## 1) Competitive Gap Analysis vs Reffortune

> Assumption baseline from market pattern: reffortune wins by continuity, conversion instrumentation, and trust packaging—not by prettier cards alone.

### Current MysticFlow gap (today)
- **Feature islands**: tarot / spirit-card / numerology are separate UX + logic silos.
- **No shared interpretation contract**: output structures vary, hard to personalize and AB-test.
- **Weak monetization trigger timing**: no explicit rule engine for when to show premium CTA.
- **Event blind spots**: minimal funnel instrumentation means no learning loop.
- **Limited trust artifacts**: no confidence signals, no transparent method context per reading.

### Reffortune-like strengths (where they likely outperform)
- **Unified journey** from entry -> reading -> upsell -> retention.
- **Tighter paywall placement** at high-intent moments.
- **Progressive profiling** (collecting preference/history over sessions).
- **Lifecycle loop** (daily reminder + streak + personalized follow-up content).

### Leap thesis
MysticFlow should transition from “multiple pages that produce readings” to **one reading operating system**:
1. Single pipeline
2. Single interpretation schema
3. Unified event language
4. Rule-based monetization hooks
5. Retention-ready identity/memory layer

---

## 2) New Product System (Target Architecture)

## A. Personalization Engine
**Purpose:** turn static readings into context-aware guidance.

Core components:
- User profile traits (intent, preferred vertical, engagement depth)
- Session memory (recent readings + outcomes)
- Prompt policy / deterministic rules per segment
- Content variant selector (tone, block ordering, CTA framing)

P0 implemented now:
- Unified reading pipeline entrypoint for tarot/spirit-card/numerology
- Shared interpretation block schema to enable future per-segment rendering

P1/P2 next:
- User trait store + read history
- Dynamic block ranking by profile
- “next best reading” recommendation API

## B. Trust Layer
**Purpose:** increase belief + conversion by transparency and consistency.

Core components:
- Method disclosure (deterministic vs random)
- Structured interpretation (summary/insight/action/warning)
- Confidence framing and ethical wording
- Outcome reflection checkpoints (7-day loop)

P0 implemented now:
- Structured interpretation blocks consistently rendered
- Deterministic outputs surfaced through stable schema

P1/P2 next:
- Confidence/explainability tags
- “why this result” panel
- Reflection capture and trust score improvement loops

## C. Monetization Loop
**Purpose:** move from static pricing page to behavior-aware upsell system.

Core components:
- Rule-driven paywall decisioning
- CTA variant manager
- Offer cadence by free usage + intent
- Pricing attribution by source/reason

P0 implemented now:
- Local rule-based paywall trigger module (`free_limit_reached`, `high_intent_offer`)
- CTA placement hooks wired into reading result surfaces

P1/P2 next:
- Remote-configurable rule sets
- Offer experiments (plan, copy, bonus)
- Revenue attribution dashboards

## D. Retention Loop
**Purpose:** re-engage with value continuity, not random reminders.

Core components:
- Event-based lifecycle segments
- Daily/weekly ritual program
- Next-action messaging
- Streak and progress memory

P0 implemented now:
- Funnel event tracking utility + key events emitted

P1/P2 next:
- Cohort jobs (D1, D3, D7 nudges)
- Personalized follow-up content based on last reading tags
- Habit/streak mechanism + monthly report

---

## 3) Funnel Redesign + KPI Tree

## New funnel
1. **Acquire**: landing_view
2. **Activate**: reading_start
3. **Engage**: reading_submitted
4. **Value Realization**: reading_result_viewed
5. **Monetize**: paywall_shown -> paywall_cta_clicked -> checkout_started -> paid
6. **Retain**: return_reading_7d / streak

## North Star Metric
**Weekly Users who complete a reading and take an intentional next action**
(WSA: Weekly Spiritual Actions)

## Leading metrics (tree)
- **Top of funnel**
  - Landing -> reading_start rate
  - Channel quality (new users / bounce)
- **Activation depth**
  - reading_start -> reading_submitted
  - question attach rate (tarot high-intent signal)
- **Value delivery**
  - reading_submitted -> reading_result_viewed
  - result dwell / block completion
- **Monetization**
  - paywall_shown -> paywall_cta_clicked
  - checkout conversion
  - ARPPU / trial-to-paid
- **Retention**
  - D1/D7 return reading
  - weekly reading frequency
  - streak continuation rate

---

## 4) 14-Day Roadmap (P0/P1/P2)

## P0 (Day 1-4): Foundation (implemented in this cycle)

### P0-1 Unified Reading Pipeline
- **Owner:** Eng (Core Platform)
- **Acceptance:** one abstraction callable by tarot/spirit-card/numerology; returns shared ReadingSession
- **Status:** Done

### P0-2 Shared Interpretation Schema + Renderer
- **Owner:** Eng + Product Design
- **Acceptance:** all 3 verticals render through common blocks on result surfaces
- **Status:** Done

### P0-3 Event Tracking Utility + Funnel Wiring
- **Owner:** Eng + Growth
- **Acceptance:** landing_view, reading_start, reading_submitted, reading_result_viewed, paywall_shown, paywall_cta_clicked emitted
- **Status:** Done

### P0-4 Rule-driven Paywall Trigger + CTA Hooks
- **Owner:** Growth Eng
- **Acceptance:** deterministic decision function + CTA placement on result pages
- **Status:** Done

## P1 (Day 5-10): Optimization Layer

### P1-1 Remote config for paywall rules/copy
- **Owner:** Growth Eng
- **Acceptance:** rule thresholds and CTA copy controlled without deploy

### P1-2 Segment-aware content variants
- **Owner:** Product + Eng
- **Acceptance:** at least 2 variants per vertical with experiment IDs

### P1-3 Attribution-ready event schema expansion
- **Owner:** Data
- **Acceptance:** event payload includes source/campaign/offer IDs

### P1-4 Trust artifacts
- **Owner:** Product Content
- **Acceptance:** explainability snippets and outcome journaling UX

## P2 (Day 11-14): Retention + Revenue Flywheel

### P2-1 Re-engagement automation
- **Owner:** Growth Ops
- **Acceptance:** D1/D3/D7 lifecycle nudges from event cohorts

### P2-2 Subscription experience enhancement
- **Owner:** Monetization
- **Acceptance:** personalized premium package by reading history

### P2-3 KPI cockpit
- **Owner:** Data + Founder
- **Acceptance:** live dashboard for NSM + leading metrics + cohort retention

---

## 5) Risks / Dependencies
- Payment and CRM integrations not yet wired to close monetize -> retain loop.
- No server-side user identity yet; local-only counters are interim.
- Need analytics backend destination (GA4/Mixpanel/warehouse) for production use.
- Need experiment framework for rigorous P1/P2 optimization.

---

## 6) Definition of Leap (what changes strategically)
From **“three calculators with UI”** to **“an adaptive spiritual decision platform”** with:
- shared intelligence layer,
- measurable funnel behavior,
- intentional monetization timing,
- and retention-ready architecture.
