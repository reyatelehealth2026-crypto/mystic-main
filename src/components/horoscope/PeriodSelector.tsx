'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { TimePeriod } from '@/lib/horoscope/types';

export interface PeriodSelectorProps {
  value?: TimePeriod;
  onChange?: (period: TimePeriod) => void;
  className?: string;
}

interface PeriodOption {
  period: TimePeriod;
  thaiName: string;
  thaiDesc: string;
  icon: string;
}

const periodOptions: PeriodOption[] = [
  {
    period: TimePeriod.DAILY,
    thaiName: 'รายวัน',
    thaiDesc: 'ดูดวงวันนี้',
    icon: '📅'
  },
  {
    period: TimePeriod.WEEKLY,
    thaiName: 'รายสัปดาห์',
    thaiDesc: 'ดูดวงสัปดาห์นี้',
    icon: '📆'
  },
  {
    period: TimePeriod.MONTHLY,
    thaiName: 'รายเดือน',
    thaiDesc: 'ดูดวงเดือนนี้',
    icon: '🗓️'
  }
];

/**
 * PeriodSelector Component
 * 
 * Displays time period options (daily, weekly, monthly) for horoscope readings.
 * Maintains zodiac selection when switching between periods.
 * 
 * @example
 * <PeriodSelector 
 *   value={selectedPeriod} 
 *   onChange={setSelectedPeriod} 
 * />
 */
export function PeriodSelector({ value, onChange, className }: PeriodSelectorProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4', className)}>
      {periodOptions.map((option) => {
        const isSelected = value === option.period;
        
        return (
          <button
            key={option.period}
            type="button"
            onClick={() => onChange?.(option.period)}
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] border p-4 transition-all duration-150',
              'hover:-translate-y-0.5 active:translate-y-px',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
              isSelected
                ? 'border-accent bg-accent/10 shadow-[var(--shadow-soft)]'
                : 'border-border bg-surface hover:border-border-strong hover:bg-bg-elevated'
            )}
            aria-pressed={isSelected}
            aria-label={`เลือก${option.thaiName}`}
          >
            <span 
              className={cn(
                'text-3xl transition-transform',
                isSelected && 'scale-110'
              )}
              aria-hidden="true"
            >
              {option.icon}
            </span>
            <span 
              className={cn(
                'text-base font-semibold transition-colors',
                isSelected ? 'text-accent' : 'text-fg'
              )}
            >
              {option.thaiName}
            </span>
            <span 
              className={cn(
                'text-xs transition-colors',
                isSelected ? 'text-accent/80' : 'text-fg-muted'
              )}
            >
              {option.thaiDesc}
            </span>
          </button>
        );
      })}
    </div>
  );
}
