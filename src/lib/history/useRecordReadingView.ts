"use client";

import * as React from "react";

/**
 * Records a reading view to the server once it's ready (which also charges the
 * credit cost). Fire-and-forget; anonymous users no-op server-side.
 *
 * Pass a stable `dedupeKey` (e.g. derived from the reading inputs) so a page
 * refresh of the SAME reading doesn't charge twice. Omit it to charge per view.
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
    sent.current = true;
    const clientId = dedupeKey ? `${type}:${dedupeKey}` : `${type}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
    void fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, summary: summary ?? "", clientId }),
    }).catch(() => {});
  }, [ready, type, summary, dedupeKey]);
}
