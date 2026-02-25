/**
 * Example usage of PeriodSelector component
 * 
 * This example demonstrates how the PeriodSelector maintains
 * the zodiac selection when switching between time periods.
 */

'use client';

import * as React from 'react';
import { ZodiacSelector } from './ZodiacSelector';
import { PeriodSelector } from './PeriodSelector';
import { ZodiacSign, TimePeriod } from '@/lib/horoscope/types';

export function HoroscopeSelectionExample() {
  const [zodiacSign, setZodiacSign] = React.useState<ZodiacSign>();
  const [period, setPeriod] = React.useState<TimePeriod>(TimePeriod.DAILY);

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-fg">
          เลือกช่วงเวลา
        </h3>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* Zodiac Selection - maintains state when period changes */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-fg">
          เลือกราศี
        </h3>
        <ZodiacSelector value={zodiacSign} onChange={setZodiacSign} />
      </div>

      {/* Display current selection */}
      {zodiacSign && (
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4">
          <p className="text-sm text-fg-muted">
            คุณเลือก: <span className="font-semibold text-fg">{zodiacSign}</span>
            {' '}สำหรับ{' '}
            <span className="font-semibold text-fg">
              {period === TimePeriod.DAILY && 'รายวัน'}
              {period === TimePeriod.WEEKLY && 'รายสัปดาห์'}
              {period === TimePeriod.MONTHLY && 'รายเดือน'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
