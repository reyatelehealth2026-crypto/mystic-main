/**
 * One-time migration of localStorage reading history to the server for a
 * logged-in user. Idempotent per user via a localStorage flag plus the server's
 * `(user_id, client_id)` unique constraint.
 *
 * Credits are intentionally NOT migrated from localStorage — `mf.user.credits`
 * is client-editable and untrusted. Paid credits come only from the signup
 * bonus + verified purchases.
 */

const HISTORY_KEY = "app-history-storage";

interface PersistedHistory {
  state?: {
    history?: Array<{
      id?: string;
      type?: string;
      date?: string;
      summary?: string;
      details?: Record<string, unknown>;
    }>;
  };
}

function syncFlagKey(userId: string): string {
  return `mf.sync.v1.done.${userId}`;
}

export async function syncLocalHistoryToServer(userId: string): Promise<void> {
  if (typeof window === "undefined") return;
  const flag = syncFlagKey(userId);
  try {
    if (window.localStorage.getItem(flag) === "true") return;

    const raw = window.localStorage.getItem(HISTORY_KEY);
    const items = raw ? (JSON.parse(raw) as PersistedHistory).state?.history ?? [] : [];

    if (items.length) {
      const resp = await fetch("/api/history/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!resp.ok) return; // try again next session
    }
    window.localStorage.setItem(flag, "true");
  } catch {
    // Non-fatal; will retry on next login.
  }
}
