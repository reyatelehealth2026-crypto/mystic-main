# Tarot Prompt Builder Implementation

## Overview

The `buildTarotPrompt()` function creates comprehensive, culturally-aware prompts for tarot readings that integrate Thai Buddhist philosophy, few-shot learning examples, and spread-specific instructions.

## Features Implemented

### ✓ Core Requirements (Task 5.1)

1. **Spread-Specific Logic** (Requirements 6.1, 6.2, 6.5)
   - 1-card spread: Concise, focused guidance
   - 3-card spread: Past-Present-Future narrative flow analysis
   - 10-card Celtic Cross: Comprehensive position-based interpretation with theme identification

2. **Card Relationship Analysis** (Requirement 4.2)
   - Instructions for analyzing how cards connect and influence each other
   - Pattern recognition across multiple cards
   - Combined meaning interpretation

3. **Reversed Card Guidance** (Requirement 6.3)
   - Automatic detection of reversed cards
   - Shadow aspect and blocked energy interpretation
   - Guidance on unlocking reversed card energy

4. **Major Arcana Emphasis** (Requirement 6.4)
   - Automatic detection of Major Arcana cards
   - Instructions to emphasize their significance as major life themes
   - Connection to life path and personal growth

5. **Thai Cultural Context** (Requirements 1.1, 1.2, 1.3)
   - Buddhist philosophy (karma, merit, mindfulness, middle path)
   - Thai astrology concepts (destiny, timing, elements)
   - Natural, warm Thai guidance style

6. **Actionable Guidance** (Requirements 4.1, 4.3, 4.4)
   - Specific, concrete advice (not vague statements)
   - Step-by-step action plans with timeframes
   - Risk identification with specific examples
   - Focus on what the user can control

7. **Few-Shot Learning** (Requirement 2.1)
   - 2-3 examples per spread type
   - Diverse scenarios (positive, challenging, neutral)
   - Clear input-output boundaries

8. **Symbolism and Depth** (Requirements 4.5, 4.6)
   - Instructions to reference card symbolism
   - Archetypal meaning connections
   - Balanced predictions (avoid absolutes)

## Function Signature

```typescript
function buildTarotPrompt(params: TarotPromptParams): string

interface TarotPromptParams {
  cards: DrawnCard[];
  count: number;
  question?: string;
  spreadType: 1 | 2 | 3 | 4 | 10;
}
```

## Usage Example

```typescript
import { buildTarotPrompt } from '@/lib/ai/templates/tarot';

const prompt = buildTarotPrompt({
  cards: [
    {
      card: theFoolCard,
      orientation: 'upright'
    }
  ],
  count: 1,
  question: 'What should I focus on today?',
  spreadType: 1
});

// Use prompt with Gemini API
const response = await callGeminiAPI(prompt);
```

## Prompt Structure

The generated prompt follows this consistent order:

1. **Role Definition**: Expert tarot reader persona with REFFORTUNE values
2. **Cultural Context**: Thai Buddhist philosophy + astrology concepts
3. **Few-Shot Examples**: 2-3 examples matching the spread type
4. **Instructions**: 
   - Base instructions (structure, specificity, relationships)
   - Reversed card guidance (if applicable)
   - Major Arcana emphasis (if applicable)
   - Actionable guidance principles
   - Spread-specific instructions
5. **User Data**: Question, card count, and card details

## Adaptive Features

The prompt builder automatically adapts based on:

- **Spread Type**: Selects appropriate examples and instructions
- **Reversed Cards**: Adds reversed card interpretation guidance
- **Major Arcana**: Adds emphasis instructions for Major Arcana cards
- **Missing Question**: Handles gracefully with default text

## Response Format

The prompt instructs the AI to return JSON with:

```json
{
  "summary": "One paragraph overview in natural Thai",
  "cardStructure": "Three sections:\n- ภาพรวมสถานการณ์: Situation overview\n- จุดที่ควรระวัง: Specific warnings with examples\n- แนวทางที่ควรทำ: Step-by-step actions with timeframes"
}
```

## Testing

### Manual Verification

Run the verification script:
```bash
npx tsx src/lib/ai/templates/verify-tarot.ts
```

Add `--verbose` flag to see the full generated prompt.

### Unit Tests

Run unit tests (once Jest is configured):
```bash
npm test src/lib/ai/templates/tarot.test.ts
```

### Example Usage

See `tarot.example.ts` for complete usage examples with different spread types.

## Integration with API Routes

To use in the tarot API route:

```typescript
// src/app/api/ai/tarot/route.ts
import { buildTarotPrompt } from '@/lib/ai/templates/tarot';
import { parseCardTokens } from '@/lib/tarot/engine';

export async function POST(req: Request) {
  const body = await req.json();
  const cards = parseCardTokens(body.cardsToken);
  
  const prompt = buildTarotPrompt({
    cards,
    count: body.count,
    question: body.question,
    spreadType: body.count as 1 | 3 | 10
  });
  
  // Send prompt to Gemini API
  const response = await callGeminiAPI(prompt);
  // ...
}
```

## Requirements Coverage

This implementation satisfies the following requirements from the spec:

- ✓ 1.1, 1.2, 1.3: Thai cultural context integration
- ✓ 2.1: Few-shot examples for tarot (2-3 examples)
- ✓ 4.1: Specific, actionable guidance
- ✓ 4.2: Card relationship analysis
- ✓ 4.3: Specific risk identification
- ✓ 4.4: Step-by-step actions with timeframes
- ✓ 4.5: Symbolism and archetypal meanings
- ✓ 4.6: Avoid absolute predictions
- ✓ 6.1: 3-card past-present-future narrative
- ✓ 6.2: 10-card Celtic Cross theme identification
- ✓ 6.3: Reversed card shadow aspect explanation
- ✓ 6.4: Major Arcana emphasis
- ✓ 6.5: Spread-specific guidance

## Next Steps

1. Integrate with `/api/ai/tarot/route.ts` (Task 9.1)
2. Write property-based tests (Task 5.2)
3. Test with real Gemini API calls
4. Gather user feedback on interpretation quality
