# FortuneReadingBlocks Component

A comprehensive display component for all fortune reading types in the REFFORTUNE platform.

## Overview

`FortuneReadingBlocks` is a unified component that renders structured fortune readings with appropriate formatting for each reading type. It supports:

- Horoscope readings (daily, weekly, monthly)
- Compatibility analysis
- Chinese zodiac fortunes
- Name numerology interpretations
- Specialized domain readings (finance/career, love/relationships)

## Features

- **Type-specific rendering**: Each reading type has its own optimized layout
- **Confidence indicators**: Shows when AI enhancement is applied (for horoscope readings)
- **Responsive design**: Grid layouts adapt to mobile and desktop screens
- **Color-coded sections**: Different aspects use distinct colors for easy scanning
- **Post-reading actions**: Optional buttons for viewing another reading, sharing, or returning to menu
- **Thai language**: All UI text and labels in Thai

## Usage

```tsx
import { FortuneReadingBlocks } from '@/components/reading/FortuneReadingBlocks';

// Horoscope example
<FortuneReadingBlocks 
  reading={{
    type: 'horoscope',
    data: horoscopeData
  }}
  onViewAnother={() => router.push('/horoscope')}
  onShare={() => handleShare()}
  onReturnToMenu={() => router.push('/')}
/>

// Compatibility example
<FortuneReadingBlocks 
  reading={{
    type: 'compatibility',
    data: compatibilityData
  }}
  onViewAnother={() => router.push('/compatibility')}
  onReturnToMenu={() => router.push('/')}
/>
```

## Props

### `reading` (required)

Union type containing the reading type and data:

```typescript
type FortuneReading = 
  | { type: 'horoscope'; data: HoroscopeReading }
  | { type: 'compatibility'; data: CompatibilityReading }
  | { type: 'chinese_zodiac'; data: ChineseZodiacReading }
  | { type: 'name_numerology'; data: NameNumerologyReading }
  | { type: 'specialized'; data: SpecializedReading };
```

### `onViewAnother` (optional)

Callback function when user clicks "ดูดวงอีกครั้ง" (View another reading) button.

### `onShare` (optional)

Callback function when user clicks "แชร์ผลการดูดวง" (Share reading) button.

### `onReturnToMenu` (optional)

Callback function when user clicks "กลับไปเมนูหลัก" (Return to main menu) button.

## Reading Type Layouts

### Horoscope

- Date range display
- AI enhancement indicator (if confidence > 50)
- Four aspect cards: Love (💕), Career (💼), Finance (💰), Health (🏥)
- Lucky numbers and colors
- Advice section

### Compatibility

- Overall score with circular display
- Element compatibility description
- Four score categories: Communication, Emotional, Long-term, Overall
- Strengths list
- Challenges list
- Advice section

### Chinese Zodiac

- Animal and element display with Thai and Chinese names
- Date range
- Five fortune sections: Overall, Career, Wealth, Health, Relationships
- Lucky colors, numbers, and directions
- Advice section

### Name Numerology

- Name display
- Four score cards: First name, Last name, Full name, Destiny number
- Six interpretation sections: Personality, Strengths, Weaknesses, Life path, Career, Relationships
- Lucky numbers
- Advice section

### Specialized

- Date range
- Prediction
- Opportunities and challenges (side by side)
- Action items list
- Advice section

## Styling

The component uses Tailwind CSS with the following color schemes:

- **Rose**: Love, relationships, challenges
- **Blue**: Career, communication, action items
- **Yellow**: Finance, wealth
- **Green**: Health
- **Emerald**: Positive emphasis, advice, strengths
- **Purple**: Relationships (in name numerology)
- **White/Slate**: Neutral content

## Accessibility

- Semantic HTML with `<article>` and `<section>` elements
- Clear heading hierarchy
- Readable text contrast ratios
- Responsive grid layouts

## Examples

See `FortuneReadingBlocks.example.tsx` for complete working examples of all reading types.

## Requirements Validation

This component validates the following requirements:

- **Requirement 9.5**: Display post-reading options (view another, share, return to menu)
- **Requirement 11.7**: Show confidence indicators for baseline vs AI content
- **Requirement 1.4**: Display horoscope content covering love, career, finance, and health aspects
- **Requirement 3.5**: Display compatibility results in categories
- **Requirement 4.5**: Provide guidance on lucky colors, numbers, and directions
- **Requirement 6.5**: Display interpretation of personality traits, strengths, weaknesses, and life path

## Related Components

- `ReadingBlocks`: Original component for tarot/spirit card readings
- `Button`: Used for post-reading action buttons
- `Card`: Base card component (not directly used, but similar styling)
