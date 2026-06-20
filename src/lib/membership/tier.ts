/**
 * Membership tiers driven by LIFETIME earned credits (สะสมรวม). Pure + testable;
 * thresholds are easy to tweak in one place.
 */
export interface Tier {
  name: string;
  min: number; // lifetime credits required to reach this tier
}

export const TIERS: Tier[] = [
  { name: "Member", min: 0 },
  { name: "Silver", min: 500 },
  { name: "Gold", min: 2000 },
  { name: "Platinum", min: 5000 },
];

export interface TierProgress {
  tier: string;
  nextTier: string | null;
  lifetime: number;
  toNext: number; // lifetime credits still needed to reach nextTier (0 at top)
  progressPct: number; // 0-100 progress within current → next band
}

export function computeTier(lifetime: number): TierProgress {
  let current: Tier = TIERS[0];
  let next: Tier | null = null;

  for (let i = 0; i < TIERS.length; i++) {
    if (lifetime >= TIERS[i].min) {
      current = TIERS[i];
      next = TIERS[i + 1] ?? null;
    }
  }

  const toNext = next ? Math.max(0, next.min - lifetime) : 0;
  let progressPct = 100;
  if (next) {
    const span = next.min - current.min;
    progressPct = span > 0 ? Math.min(100, Math.round(((lifetime - current.min) / span) * 100)) : 0;
  }

  return { tier: current.name, nextTier: next?.name ?? null, lifetime, toNext, progressPct };
}
