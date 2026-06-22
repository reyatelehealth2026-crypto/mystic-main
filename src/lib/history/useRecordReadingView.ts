"use client";

import * as React from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { requestReadingUnlock } from "@/lib/ui/readingGate";

// Map history type strings → service_costs keys (enum form) for the cost lookup.
const COST_KEY: Record<string, string> = {
  tarot: "tarot",
  "love-tarot": "tarot",
  "daily-card": "daily_card",
  "spirit-card": "spirit_card",
  "spirit-path": "spirit_card",
  numerology: "numerology",
  horoscope: "horoscope",
  compatibility: "compatibility",
  "chinese-zodiac": "chinese_zodiac",
  "name-numerology": "name_numerology",
};

// v2: invalidate pre-gate entries that were marked "charged" without an actual
// payment (older versions recorded even when the charge was skipped).
const CHARGED_STORE = "rf:charged-views-v2";

function alreadyCharged(key?: string): boolean {
  if (!key || typeof window === "undefined") return false;
  try {
    const list = JSON.parse(localStorage.getItem(CHARGED_STORE) || "[]") as string[];
    return list.includes(key);
  } catch {
    return false;
  }
}

function markCharged(key?: string): void {
  if (!key || typeof window === "undefined") return;
  try {
    const list = JSON.parse(localStorage.getItem(CHARGED_STORE) || "[]") as string[];
    if (!list.includes(key)) {
      list.push(key);
      localStorage.setItem(CHARGED_STORE, JSON.stringify(list.slice(-300)));
    }
  } catch {
    /* ignore */
  }
}

/**
 * Gates a reading behind a spend-confirm lock (blurs content until confirmed),
 * then records the view server-side (which charges). Logged-out users are not
 * gated/charged here (existing client paywall applies). Confirms once per
 * distinct reading (dedupeKey) so refresh/revisit won't re-prompt or re-charge.
 */
export function useRecordReadingView(params: {
  type: string;
  summary?: string | null;
  ready: boolean;
  dedupeKey?: string;
}): void {
  const { type, summary, ready, dedupeKey } = params;
  const { user } = useAuth();
  const sent = React.useRef(false);

  React.useEffect(() => {
    if (!ready || sent.current) return;
    if (!user) return; // anonymous: no server charge/gate
    if (dedupeKey && alreadyCharged(`${type}:${dedupeKey}`)) {
      sent.current = true;
      return;
    }
    sent.current = true;

    void (async () => {
      let cost = 1;
      try {
        const res = await fetch("/api/service-costs", { cache: "no-store" });
        const d = await res.json();
        cost = d?.costs?.[COST_KEY[type] ?? type]?.cost ?? 1;
      } catch {
        /* keep default */
      }

      const ok = await requestReadingUnlock(cost, user.credits);
      if (!ok) {
        sent.current = false; // allow re-prompt if they come back
        return;
      }

      const clientId = dedupeKey
        ? `${type}:${dedupeKey}`
        : `${type}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
      try {
        await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, summary: summary ?? "", clientId }),
        });
        markCharged(`${type}:${dedupeKey ?? clientId}`);
        window.dispatchEvent(new Event("rf:credits-changed"));
      } catch {
        /* ignore */
      }
    })();
  }, [ready, type, summary, dedupeKey, user]);
}
