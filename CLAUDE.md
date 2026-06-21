# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

REFFORTUNE (`web` package) — Thai-first online fortune-telling web app (Next.js 16 App Router + React 19 + TypeScript + Tailwind v4). All user-facing copy is Thai; the persona uses the pronoun "คุณ".

## Commands

```bash
npm run dev              # next dev --webpack (http://localhost:3000)
npm run build            # production build — must pass before deploy
npm run start            # production server
npm run lint             # eslint (uses eslint-config-next core-web-vitals + typescript)
npm run test             # vitest run (single pass)
npm run test:watch       # vitest watch
npm run test:coverage    # vitest run --coverage (v8 provider)
```

Run a single vitest file: `npx vitest run src/lib/ai/prompts.test.ts`
Run tests by name: `npx vitest run -t "validates tarot prompt"`

Property-based tests use `fast-check` and live in `*.property.test.ts` files (already covered by the `vitest.config.ts` include glob).

There are also standalone verifier scripts (not part of `npm test`) used for quick smoke checks of prompt builders without invoking Gemini, e.g. `npx tsx src/lib/ai/verify-prompts.ts`, `src/lib/ai/templates/verify-tarot.ts`, etc.

## Required environment

Create `.env.local`:

```env
GEMINI_API_KEY=...                       # required for /api/ai/* routes
GEMINI_MODEL=gemini-2.0-flash            # text model
GEMINI_IMAGE_MODEL=gemini-3-pro-image-preview  # used by /api/ai/wallpaper

# CRM + LINE login (see "CRM / LINE auth" below). All optional for the public
# fortune flows — when unset the app runs fully anonymously as before.
NEXT_PUBLIC_SUPABASE_URL=...             # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...        # not used client-side today (reserved)
SUPABASE_SERVICE_ROLE_KEY=...            # SERVER ONLY — never import client-side
LINE_LOGIN_CHANNEL_ID=...                # LINE Login channel
LINE_LOGIN_CHANNEL_SECRET=...
NEXT_PUBLIC_LIFF_ID=...                  # LIFF app id (in-app LINE login)
LINE_MESSAGING_CHANNEL_ACCESS_TOKEN=...  # LINE Messaging API push (optional)
SESSION_SECRET=...                       # >=32 bytes, HS256 session signing key
ADMIN_LINE_USER_IDS=Uxxx,Uyyy            # comma-separated admin allowlist
```

If `GEMINI_API_KEY` is missing, AI routes return `400 missing_gemini_api_key`. If Gemini call fails or returns malformed JSON, routes still respond `200 { ok: true, fallback: true }` with a deterministic structure built from the engine — keep this contract when modifying routes.

On Cloudflare, public values go in `wrangler.jsonc` `vars`; secrets (`SUPABASE_SERVICE_ROLE_KEY`, `LINE_LOGIN_CHANNEL_SECRET`, `SESSION_SECRET`, `LINE_MESSAGING_CHANNEL_ACCESS_TOKEN`, `ADMIN_LINE_USER_IDS`) go in via `wrangler secret put`. All are read with `process.env.X` directly, like `GEMINI_API_KEY`.

## CRM / LINE auth

The CRM/account layer is additive — anonymous fortune flows are untouched. Schema lives in `supabase/migrations/0001_init.sql` (run manually in Supabase). Server data access goes through `src/lib/supabase/` using the **service-role key only** (RLS is deny-all; the anon key is never used client-side). Auth supports both LIFF (in-LINE) and web LINE Login OAuth, converging on `verifyLineIdToken → upsertUserFromLine → signSession` (httpOnly `rf_session` cookie via `jose`). Credits are authoritative server-side via the atomic `apply_credit_delta` Postgres function and the `credit_transactions` ledger; AI routes opt in via `creditGate()`/`settleReading()` in `src/lib/auth/withCredits.ts` (logged-out callers pass through unchanged). Admin CRM pages live under `src/app/admin/customers/`, gated by `requireAdmin()` (the `ADMIN_LINE_USER_IDS` allowlist). `@line/liff` must only be dynamic-imported client-side.

## Architecture

### Two-layer reading model: deterministic engine + AI overlay

Every divination type has a deterministic engine in `src/lib/<domain>/` (e.g. `tarot/engine.ts`, `numerology/engine.ts`, `tarot/spirit.ts`) that produces a baseline interpretation from inputs. The Next.js API route then asks Gemini for a richer reading using a structured prompt, and falls back to the engine's baseline if the call fails. **Same input → same baseline** is an explicit product invariant (see `SYSTEM_LEAP_BLUEPRINT.md` §4A).

`src/lib/reading/pipeline.ts` is the orchestration layer:
- `runReadingPipeline(input)` handles the legacy core verticals (`tarot` | `spirit-card` | `numerology`) and returns a `ReadingSession` of typed `InterpretationBlock`s (summary / insight / focus / action / warning / cta).
- `processReading(request)` handles newer verticals via the `ReadingType` enum (HOROSCOPE, COMPATIBILITY, CHINESE_ZODIAC, SPECIALIZED, NAME_NUMEROLOGY) with caching via `src/lib/reading/cache.ts` and credit costs from `getCreditCost()`.

When adding a new reading type, add a `ReadingType` enum value, route it in `processReading()`, and emit blocks through the same `InterpretationBlock` shape so the result UI in `src/components/reading/` keeps working.

Each newer domain also ships a `baseline.ts` alongside `engine.ts` — this is where the deterministic fallback text lives, separately from the engine computation logic. Follow this pattern for new verticals.

### Prompt builder system (`src/lib/ai/`)

All Gemini prompts go through builders in `src/lib/ai/prompts.ts` — never inline a prompt string in a route. Architecture:

- `templates/base.ts` — `PromptBuilder` fluent API and `buildBasePrompt()` enforcing section order: role → cultural context → few-shot examples → instructions → user data.
- `templates/{tarot,spirit,numerology,chat,daily-card,spiritPath}.ts` — per-vertical builders exported as `build*Prompt`.
- `examples/*` — few-shot examples consumed by builders.
- `cultural/thai-context.ts` — shared Thai cultural framing.
- `validation.ts` — post-Gemini validation (min Thai char count, required sections `ภาพรวมสถานการณ์` / `จุดที่ควรระวัง` / `แนวทางที่ควรทำ`) plus in-memory metrics (`getValidationMetrics`, `getValidationPassRate`, `getFallbackUsageRate`, `getErrorLogs`). Metrics surface at `/ai-metrics`.

Changing a template propagates to every route using it — that's the point. Keep types in `src/lib/ai/types.ts` in sync.

### RAG retriever

`src/lib/rag/retriever.ts` is a dependency-free lexical retriever. The markdown files in `public/docs/` are **pre-bundled at build time** by `scripts/generate-rag-data.mjs` into `src/lib/rag/data.generated.ts` (auto-generated — never edit by hand). This makes the retriever bundle-safe for Edge/worker runtimes. Routes call `retrieveRag(...)` then append `formatRagContext(chunks)` to the built prompt. The `esiimsi` (เซียมซี) flow uses its own KB file and a special prompt branch in `src/app/api/ai/tarot/route.ts` — preserve that branch when refactoring.

### Astrology engine (`src/lib/astrology/`)

Vedic/Thai natal chart computation: tropical planet positions (`positions.ts`), ascendant/lagna (`lagna.ts`), houses (`houses.ts`), nakshatra placement, divisional charts — decanate and navamsha (`divisional.ts`), ฤกษ์ groups (`reference.ts`), ตรียางค์พิษ (`poison.ts`), dignitaries/มาตรฐานดาว (`dignities.ts`), dasha periods (`dasha.ts`), and sunrise offset (`sunrise.ts`). The high-level entry point is `engine.ts → computeNatalChart(BirthInput)` returning a `NatalChart`. Thai province data for local time is in `thai-provinces.ts`. The `src/app/astrology/` route drives this engine.

### Client state

Two zustand stores in `src/store/`, both `persist`-ed to localStorage:
- `useConfigStore.ts` — feature toggles + admin-editable `packages` for `/pricing`.
- `useHistoryStore.ts` — reading history.

Library/saved-reading persistence is separate: `src/lib/library/storage.ts` (versioned key `reffortune.library.v1`, `MAX_ENTRIES=50`) with a `useLibrary` hook. localStorage access must be client-only — components touching it need `'use client'`.

Theme is managed by `src/lib/theme/ThemeProvider.tsx` (themes: `light` | `pastel` | `rainbow` | `soft`), applied via `data-theme` on `<html>`. `src/app/layout.tsx` contains an inline pre-hydration script that reads `mf:theme` from localStorage to avoid FOUC — keep it in sync if theme storage keys change.

### Validation

`src/lib/validation/` provides `ValidationResult<T>`-returning validators with Thai error messages (zodiac, dates, Thai names, years, periods, domains). Use these at form/route boundaries; render errors via `components/ui/ErrorDisplay.tsx`'s `InlineError`.

## Conventions

- Path alias: `@/*` → `src/*` (`tsconfig.json`). Use it for all cross-directory imports.
- TypeScript `strict` is on. Don't loosen it locally; fix the types.
- File naming: pages are `page.tsx`, API handlers are `route.ts`, client components carry an explicit `Client` suffix (`PickClient.tsx`, `ResultClient.tsx`), per-domain types in `types.ts`, core logic in `engine.ts`.
- Thai copy strings (loading / error / retry / disclaimer) have canonical wording — see `IMPLEMENTATION.md` §0 before coining new ones.
- Result pages must include the three "trust panel" pieces (summary, structured blocks, evidence/confidence) — see `SYSTEM_LEAP_BLUEPRINT.md` §4B.
- Respect `prefers-reduced-motion` for shimmer/flip animations.
- shadcn is configured (`components.json`, style `new-york`, base color `neutral`, icon library `lucide`). Generated components go into `src/components/ui/`.

## Repo housekeeping notes

- Many files have a `*_Zone.Identifier` sibling (Windows alternate-data-stream metadata from a WSL/Windows transfer). They're zero-byte and tracked — leave them alone unless asked to clean up.
- `.kiro/specs/` and `.kiro/steering/` contain feature specs and product/tech/structure briefs that are the source of truth for ongoing work (`enhanced-ai-prompts`, `popular-fortune-features`).
- `IMPLEMENTATION.md`, `SYSTEM_LEAP_BLUEPRINT.md`, and `CHECKPOINT_*` documents describe sprint-level intent and acceptance criteria; consult them before large refactors.
- `public/docs/` ships the RAG knowledge base — do not delete files listed in `scripts/generate-rag-data.mjs`. Adding or renaming a doc there requires re-running the script (happens automatically on `npm run build`). `src/lib/rag/data.generated.ts` is auto-generated; never edit it by hand.
