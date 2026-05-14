import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HistoryItem {
  id: string;
  type: 'tarot' | 'love-tarot' | 'spirit-card' | 'numerology' | 'daily-card';
  date: string;
  summary: string;
  details?: Record<string, unknown>;
}

interface HistoryState {
  history: HistoryItem[];
  addHistory: (item: Omit<HistoryItem, 'id' | 'date'>) => void;
  clearHistory: () => void;
  removeHistoryItem: (id: string) => void;
}

// Cap history so localStorage can't grow without bound (would eventually
// trip `QuotaExceededError` on persist write).
const MAX_HISTORY_ENTRIES = 100;

function makeId(): string {
  // crypto.randomUUID() is the strong primitive; only fall back when it's
  // unavailable (e.g. very old browsers, SSR safety). The fallback still
  // mixes time + 11 random chars to reduce collision risk vs the prior
  // 7-char `Math.random()` ID.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 13)}`;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      addHistory: (item) =>
        set((state) => {
          const newItem: HistoryItem = {
            ...item,
            id: makeId(),
            date: new Date().toISOString(),
          };
          return { history: [newItem, ...state.history].slice(0, MAX_HISTORY_ENTRIES) };
        }),
      clearHistory: () => set({ history: [] }),
      removeHistoryItem: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
    }),
    {
      name: 'app-history-storage',
      // Defer rehydration to a client-side effect (see StoreHydrator) so that
      // server-rendered HTML and first client render both show the default
      // empty state. Without this, React 19 reports a hydration mismatch on
      // every page that reads from this store with persisted data.
      skipHydration: true,
    }
  )
);
