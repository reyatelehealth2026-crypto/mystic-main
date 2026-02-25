# AI Prompt Engineering System

This directory contains the enhanced AI prompt engineering system for REFFORTUNE, providing structured prompt building for all divination services.

## Main Interface

The main entry point is `prompts.ts`, which exports all prompt builder functions:

```typescript
import {
  buildTarotPrompt,
  buildSpiritPrompt,
  buildNumerologyPrompt,
  buildChatPrompt,
} from '@/lib/ai/prompts';
```

## Usage Examples

### Tarot Reading Prompt

```typescript
import { buildTarotPrompt } from '@/lib/ai/prompts';

const prompt = buildTarotPrompt({
  cards: drawnCards,
  count: 3,
  question: 'What should I focus on this month?',
  spreadType: 3,
});

// Use prompt with Gemini API
const response = await callGeminiAPI(prompt);
```

### Spirit Card Prompt

```typescript
import { buildSpiritPrompt } from '@/lib/ai/prompts';

const prompt = buildSpiritPrompt({
  card: spiritCard,
  orientation: 'upright',
  lifePathNumber: 9,
  dob: '15/03/1990',
});
```

### Numerology Prompt

```typescript
import { buildNumerologyPrompt } from '@/lib/ai/prompts';

const prompt = buildNumerologyPrompt({
  normalizedPhone: '0812345678',
  score: 87,
  tier: 'ดีมาก',
  total: 45,
  root: 9,
  themes: {
    work: 'ก้าวหน้า มีโอกาสดี',
    money: 'มั่นคง เงินไหลเวียน',
    relationship: 'ราบรื่น เป็นที่รัก',
    caution: 'อย่าประมาท',
  },
});
```

### Chat Prompt

```typescript
import { buildChatPrompt } from '@/lib/ai/prompts';

const prompt = buildChatPrompt({
  cards: originalCards,
  baseQuestion: 'Should I change jobs?',
  followUpQuestion: 'When is the best time to make the move?',
  history: conversationHistory,
});
```

## Advanced Usage

For custom prompt building, you can use the `PromptBuilder` class directly:

```typescript
import { PromptBuilder } from '@/lib/ai/prompts';

const prompt = new PromptBuilder()
  .withRole('You are an expert tarot reader')
  .withCulturalContext(thaiContext)
  .withFewShotExamples(examples)
  .withInstructions('Provide a detailed reading')
  .withUserData('Cards: The Fool, The Magician')
  .build();
```

## Directory Structure

```
src/lib/ai/
├── prompts.ts              # Main interface (exports all builders)
├── types.ts                # TypeScript type definitions
├── templates/
│   ├── base.ts            # Base PromptBuilder class
│   ├── tarot.ts           # Tarot-specific builder
│   ├── spirit.ts          # Spirit card builder
│   ├── numerology.ts      # Numerology builder
│   └── chat.ts            # Chat builder
├── examples/
│   ├── tarot-examples.ts  # Few-shot examples for tarot
│   ├── spirit-examples.ts # Few-shot examples for spirit
│   ├── numerology-examples.ts # Few-shot examples for numerology
│   └── chat-examples.ts   # Few-shot examples for chat
└── cultural/
    └── thai-context.ts    # Thai cultural context
```

## Requirements Satisfied

This implementation satisfies the following requirements:

- **Requirement 10.1**: Dedicated module at src/lib/ai/prompts.ts for all prompt templates
- **Requirement 10.2**: Export template builder functions for each divination type
- **Requirement 10.3**: Support template composition from reusable sections
- **Requirement 10.4**: Changes to templates apply to all API routes using that template
- **Requirement 10.5**: TypeScript types for template parameters and return values

## Testing

To verify the implementation:

```bash
# Run the verification script
npx tsx src/lib/ai/verify-prompts.ts

# Or run the test suite (when configured)
npm test src/lib/ai/prompts.test.ts
```

## Integration with API Routes

To integrate with API routes, replace inline prompts with builder functions:

```typescript
// Before
const prompt = `You are a tarot reader. ${cards}...`;

// After
import { buildTarotPrompt } from '@/lib/ai/prompts';
const prompt = buildTarotPrompt({ cards, count, question, spreadType });
```

See task 9 in the implementation plan for detailed integration steps.
