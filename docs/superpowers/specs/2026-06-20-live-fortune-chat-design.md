# Live Fortune Chat (ปรึกษาหมอดูสด) — Design

**Date:** 2026-06-20
**Status:** Approved
**Approach:** A — chat happens natively in LINE OA; the app handles login, credit deduction, round tracking, and a หมอดู console.

## Goal

Let a logged-in customer spend credits to open a **live consultation round** with a
real human fortune teller (หมอดู). The actual conversation happens in the LINE
Official Account (OA) chat. The app is responsible for:

- charging a **flat credit cost per round**,
- recording each round,
- giving the หมอดู a console to see open rounds and **close** them manually.

This replaces reliance on AI (Gemini) for readings — no `GEMINI_API_KEY` needed for
this feature.

## Non-goals (Phase 1)

- No custom in-app realtime chat UI (chat lives in LINE OA).
- No automatic LINE push notifications (deferred to Phase 2).
- No multi-หมอดู assignment/routing (single หมอดู = admin for now).
- No auto-refund logic (admin uses the existing credit-grant button if needed).
- No per-time or per-message billing (flat per round only).

## Architecture

Stack: Next.js 16 on Vercel (serverless) + Supabase (Postgres, service-role access,
RLS deny-all). Serverless cannot hold websockets, so the หมอดू console refreshes by
**polling** (~5s). No Supabase Realtime needed for Phase 1.

Four new components:

1. **`consultations` table** — one row per round.
2. **Customer API** `POST /api/consultation/start` — deduct credits + open a round.
3. **Customer UI** — "ปรึกษาหมอดูสด" button, round status, link to add/open LINE OA.
4. **หมอดู Console** `/admin/consultations` + `POST /api/admin/consultation/[id]/close`
   — list open rounds, close a round. Gated by existing `requireAdmin()`.

## Data model

New migration `supabase/migrations/0002_consultations.sql`:

```sql
create table public.consultations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  credits_spent integer not null,
  status        text not null default 'open',   -- 'open' | 'closed'
  opened_at     timestamptz not null default now(),
  closed_at     timestamptz,
  closed_by     text                            -- line_user_id of the หมอดู who closed
);
create index on public.consultations (status, opened_at);
alter table public.consultations enable row level security;
-- deny-all: no policies (service-role bypasses RLS, like every other table)
```

Credit movement continues to use the atomic `apply_credit_delta` Postgres function
and is logged in the existing `credit_transactions` ledger.

## Pricing

A single config constant `CONSULTATION_CREDIT_COST` (default **1** credit/round),
kept in one config file so it is easy to change.

## Flows

### Customer — open a round

1. Customer sees **"ปรึกษาหมอดูสด · 1 เครดิต"** (in the fortune menu / profile).
2. Tap → confirm → `POST /api/consultation/start`.
3. Server:
   - require an authenticated user (logged-out → 401);
   - if the user already has an `open` round → **return that round, do not charge again**;
   - credit check → insufficient → **402**, no round opened;
   - deduct credits via `apply_credit_delta` + insert `consultations(status='open')`.
4. App shows **"เปิดรอบแล้ว ✅ ทักหาหมอดูที่ LINE ได้เลย"** + a button to add/open the
   LINE OA + a "round is open" status.
5. Customer messages the OA → chats with the หมอดู natively in LINE.

### หมอดู — manage rounds (Console `/admin/consultations`)

- Table of **open** rounds: customer `display_name`, credits spent, opened-at (elapsed).
- The หมอดู finds that customer in LINE OA Manager **by name** and answers in LINE.
- When finished → **"ปิดรอบ"** → `POST /api/admin/consultation/[id]/close` → set
  `status='closed'`, `closed_at`, `closed_by`.
- List refreshes by polling (~5s).

## LINE prerequisites

- Chat is in the OA, so the customer must **add the OA as a friend** first. After
  opening a round the app shows an **add-OA button** (`https://line.me/R/ti/p/@<oa-id>`)
  or QR.
- Automatic push (Phase 2) requires the **Login channel (2009830063)** and
  **Messaging channel (2009829798)** to live under the **same LINE provider** so the
  `userId` matches across channels.

## Customer ↔ LINE chat matching

Phase 1 matches **by display name** — the console shows the customer's LINE display
name; the หมอดู locates them in OA Manager. If name collisions become a problem, add a
deep link later.

## Notifications

- **Phase 1 (MVP):** no push. Customer adds the OA themselves; the หมอดู watches the
  console.
- **Phase 2 (optional):** on round-open, push to the customer ("หมอดูพร้อมแล้ว") and to
  the หมอดู ("มีลูกค้าใหม่"), after verifying the same-provider prerequisite.

## Edge cases

- Insufficient credits → 402, no round.
- Re-open while a round is already open → return the existing round, no double charge.
- Close is admin-only (`requireAdmin`).
- Open and close both leave a clear trail in `credit_transactions` / `consultations`.

## Testing (unit, following the existing 13-test pattern)

- Deducts the correct credits and prevents double-open.
- Insufficient credits → 402.
- Close: admin-only; sets `status`/`closed_at`/`closed_by` correctly.
- Migration `0002_consultations.sql` applies cleanly.

## Phase 1 scope

`consultations` table + `start`/`close` APIs + customer button/status UI + หมอดู
console + unit tests. **Push notifications excluded** (Phase 2).
