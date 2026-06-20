"use client";

import * as React from "react";
import { requestConfirm } from "@/lib/ui/confirm";

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

const CHARGED_STORE = "rf:charged-views";

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
 * When a reading is ready, ask the user to confirm the credit spend (popup),
 * then record the view server-side (which charges). Confirms once per distinct
 * reading (dedupeKey + localStorage), so refresh/revisit won't re-prompt.
 */
export function useRecordReadingView(params: {
  type: string;
  summary?: string | null;
  ready: boolean;
  dedupeKey?: string;
}): void {
  const { type, summary, ready, dedupeKey } = params;
  const sent = React.useRef(false);

  React.useEffect(() => {
    if (!ready || sent.current) return;
    if (dedupeKey && alreadyCharged(`${type}:${dedupeKey}`)) {
      sent.current = true;
      return;
    }
    sent.current = true;

    void (async () => {
      let cost: number | null = null;
      try {
        const res = await fetch("/api/service-costs", { cache: "no-store" });
        const d = await res.json();
        cost = d?.costs?.[COST_KEY[type] ?? type]?.cost ?? null;
      } catch {
        /* ignore — confirm without the number */
      }

      const ok = await requestConfirm({
        title: "ยืนยันการดูดวง",
        icon: "🔮",
        message: cost == null ? "บันทึกผลและหักแต้มตามแพ็กเกจ" : undefined,
        details: cost == null ? undefined : [{ label: "ใช้แต้ม", value: `${cost} แต้ม`, highlight: true }],
        confirmText: "ดูเลย",
        cancelText: "ยังไม่ดู",
        tone: "spend",
      });
      if (!ok) {
        sent.current = false; // allow re-confirm later
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
  }, [ready, type, summary, dedupeKey]);
}
