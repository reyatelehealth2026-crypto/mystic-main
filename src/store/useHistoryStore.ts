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

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      addHistory: (item) =>
        set((state) => {
          const newItem: HistoryItem = {
            ...item,
            id: Math.random().toString(36).substring(2, 9),
            date: new Date().toISOString(),
          };
          return { history: [newItem, ...state.history] };
        }),
      clearHistory: () => set({ history: [] }),
      removeHistoryItem: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
    }),
    {
      name: 'app-history-storage',
    }
  )
);
