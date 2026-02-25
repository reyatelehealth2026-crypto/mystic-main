# Horoscope Components

This directory contains UI components for the horoscope feature.

## Components

### PeriodSelector

A component for selecting time periods (daily, weekly, monthly) for horoscope readings.

**Features:**
- Three period options: รายวัน (Daily), รายสัปดาห์ (Weekly), รายเดือน (Monthly)
- Thai language labels and descriptions
- Visual feedback for selected state
- Accessible with ARIA attributes
- Maintains zodiac selection when switching periods (Requirement 2.6)

**Usage:**

```tsx
import { PeriodSelector } from '@/components/horoscope/PeriodSelector';
import { TimePeriod } from '@/lib/horoscope/types';

function MyComponent() {
  const [period, setPeriod] = useState<TimePeriod>(TimePeriod.DAILY);
  
  return (
    <PeriodSelector 
      value={period} 
      onChange={setPeriod} 
    />
  );
}
```

**Props:**

- `value?: TimePeriod` - Currently selected period
- `onChange?: (period: TimePeriod) => void` - Callback when period changes
- `className?: string` - Additional CSS classes

**Validates Requirements:**
- 2.1: System supports three time period options (daily, weekly, monthly)
- 2.6: Maintains zodiac selection when switching periods

### ZodiacSelector

A component for selecting Western zodiac signs.

**Features:**
- All 12 zodiac signs with Thai names
- Visual symbols for each sign
- Selection state management
- Accessible with ARIA attributes

**Usage:**

```tsx
import { ZodiacSelector } from '@/components/horoscope/ZodiacSelector';
import { ZodiacSign } from '@/lib/horoscope/types';

function MyComponent() {
  const [sign, setSign] = useState<ZodiacSign>();
  
  return (
    <ZodiacSelector 
      value={sign} 
      onChange={setSign} 
    />
  );
}
```

## Example: Combined Usage

See `PeriodSelector.example.tsx` for a complete example showing how to use both components together while maintaining state across period changes.

```tsx
import { ZodiacSelector } from './ZodiacSelector';
import { PeriodSelector } from './PeriodSelector';

function HoroscopeSelection() {
  const [zodiacSign, setZodiacSign] = useState<ZodiacSign>();
  const [period, setPeriod] = useState<TimePeriod>(TimePeriod.DAILY);

  // Zodiac sign is maintained when period changes
  return (
    <>
      <PeriodSelector value={period} onChange={setPeriod} />
      <ZodiacSelector value={zodiacSign} onChange={setZodiacSign} />
    </>
  );
}
```

## Design Patterns

Both components follow consistent patterns:

1. **Client Components**: Use `'use client'` directive for interactivity
2. **Styling**: Use Tailwind CSS with custom design tokens
3. **Accessibility**: Include ARIA attributes for screen readers
4. **Thai Language**: All user-facing text in Thai
5. **Visual Feedback**: Hover, active, and selected states
6. **Type Safety**: Full TypeScript support with exported types
