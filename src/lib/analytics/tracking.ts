export type FunnelEventName =
  | "landing_view"
  | "reading_start"
  | "reading_submitted"
  | "reading_result_viewed"
  | "paywall_shown"
  | "paywall_cta_clicked"
  | "share_card_generated";

export interface FunnelEventPayload {
  vertical?: "tarot" | "spirit-card" | "numerology" | "daily-card";
  step?: string;
  count?: number;
  hasQuestion?: boolean;
  sessionId?: string;
  reason?: string;
  ctaVariant?: string;
  card?: string;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(name: FunnelEventName, payload: FunnelEventPayload = {}): void {
  if (typeof window === "undefined") {
    return;
  }

  const event = {
    event: name,
    ts: new Date().toISOString(),
    ...payload,
  };

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(event);

  if (process.env.NODE_ENV !== "production") {
    console.info("[track]", event);
  }
}
