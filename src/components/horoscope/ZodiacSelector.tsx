'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { ZodiacSign } from '@/lib/horoscope/types';
import { getAllZodiacSigns } from '@/lib/horoscope/zodiac';

export interface ZodiacSelectorProps {
  value?: ZodiacSign;
  onChange?: (sign: ZodiacSign) => void;
  className?: string;
}

/**
 * ZodiacSelector Component
 * 
 * Displays all 12 Western zodiac signs with Thai names and symbols.
 * Supports selection state management.
 * 
 * @example
 * <ZodiacSelector 
 *   value={selectedSign} 
 *   onChange={setSelectedSign} 
 * />
 */
export function ZodiacSelector({ value, onChange, className }: ZodiacSelectorProps) {
  const allSigns = getAllZodiacSigns();

  return (
    <div className={cn('grid grid-cols-3 gap-3 sm:grid-cols-4 md:gap-4', className)}>
      {allSigns.map((zodiac) => {
        const isSelected = value === zodiac.sign;
        
        return (
          <button
            key={zodiac.sign}
            type="button"
            onClick={() => onChange?.(zodiac.sign)}
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] border p-3 transition-all duration-150',
              'hover:-translate-y-0.5 active:translate-y-px',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
              isSelected
                ? 'border-accent bg-accent/10 shadow-[var(--shadow-soft)]'
                : 'border-border bg-surface hover:border-border-strong hover:bg-bg-elevated'
            )}
            aria-pressed={isSelected}
            aria-label={`เลือกราศี${zodiac.thaiName}`}
          >
            <span 
              className={cn(
                'text-2xl transition-transform',
                isSelected && 'scale-110'
              )}
              aria-hidden="true"
            >
              {zodiac.symbol}
            </span>
            <span 
              className={cn(
                'text-sm font-medium transition-colors',
                isSelected ? 'text-accent' : 'text-fg'
              )}
            >
              {zodiac.thaiName}
            </span>
          </button>
        );
      })}
    </div>
  );
}
