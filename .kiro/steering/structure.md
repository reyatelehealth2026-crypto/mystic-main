# Project Structure

## Root Layout

```
src/
├── app/              # Next.js App Router pages and API routes
├── components/       # Reusable React components
└── lib/             # Business logic and utilities
```

## App Directory (`src/app/`)

Next.js 16 App Router structure with file-based routing:

- `page.tsx` - Landing page
- `layout.tsx` - Root layout with global styles
- `globals.css` - Global CSS with Tailwind directives

### Feature Routes

- `tarot/` - Tarot reading flow
  - `pick/` - Card selection interface
  - `result/` - Reading results display
- `spirit-card/` - Spirit card calculation
- `numerology/` - Phone number analysis
- `daily-card/` - Daily card feature
- `library/` - 78-card tarot library
  - `[cardId]/` - Individual card details
  - `saved/` - Saved readings
- `pricing/` - Pricing and packages

### API Routes (`src/app/api/ai/`)

- `tarot/route.ts` - Tarot interpretation via Gemini
- `spirit/route.ts` - Spirit card interpretation
- `numerology/route.ts` - Numerology interpretation
- `tarot-chat/route.ts` - Follow-up chat for tarot readings

## Library Directory (`src/lib/`)

Core business logic organized by domain:

### Divination Engines

- `tarot/` - Tarot card system
  - `deck.ts` - 78-card deck definitions
  - `engine.ts` - Shuffle, draw, orientation logic
  - `spirit.ts` - Spirit card calculation from DOB
  - `fortuneDeck.ts` - Fortune-specific deck variant
  - `types.ts` - Type definitions
  
- `numerology/` - Phone number analysis
  - `engine.ts` - Thai phone normalization and scoring

### Cross-Vertical Systems

- `reading/` - Unified reading pipeline
  - `pipeline.ts` - Orchestrates all reading types
  - `interpretation.ts` - Shared interpretation schema
  - `types.ts` - Common reading types

- `monetization/` - Paywall and credit system
  - `paywall.ts` - Rule-based paywall triggers

- `library/` - Reading history and storage
  - `storage.ts` - Local storage utilities
  - `useLibrary.ts` - React hook for library state
  - `types.ts` - Library type definitions

- `analytics/` - Event tracking
  - `tracking.ts` - Event taxonomy and tracking utilities

### Utilities

- `cn.ts` - Tailwind class name utility (clsx wrapper)

## Components Directory (`src/components/`)

### UI Components (`src/components/ui/`)

Reusable design system components:
- `Button.tsx` - Button with variants (primary, secondary, ghost, danger)
- `Card.tsx` - Card container component
- `Input.tsx` - Form input component
- `Alert.tsx` - Alert/notification component

### Feature Components (`src/components/reading/`)

- `ReadingBlocks.tsx` - Structured reading result display

## Naming Conventions

- Pages: `page.tsx` (Next.js convention)
- Client components: `PickClient.tsx`, `ResultClient.tsx` (explicit "Client" suffix)
- API routes: `route.ts` (Next.js convention)
- Types: `types.ts` per domain
- Engines: `engine.ts` for core logic

## File Organization Principles

1. Colocation: Related files grouped by feature/domain
2. Separation: UI (app/) vs logic (lib/) vs components (components/)
3. Shared types: Each domain has its own `types.ts`
4. API routes mirror feature structure
5. Client components explicitly marked when using "use client"
