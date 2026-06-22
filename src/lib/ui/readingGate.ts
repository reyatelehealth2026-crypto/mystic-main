import { create } from "zustand";

interface ReadingGateState {
  open: boolean;
  cost: number;
  balance: number;
  resolver: ((v: boolean) => void) | null;
  request: (cost: number, balance: number) => Promise<boolean>;
  resolve: (v: boolean) => void;
}

export const useReadingGate = create<ReadingGateState>((set, get) => ({
  open: false,
  cost: 0,
  balance: 0,
  resolver: null,
  request: (cost, balance) =>
    new Promise<boolean>((resolve) => {
      set({ open: true, cost, balance, resolver: resolve });
    }),
  resolve: (v) => {
    const r = get().resolver;
    set({ open: false, resolver: null });
    r?.(v);
  },
}));

/** Blocks the reading behind a blur until the user confirms the spend. */
export function requestReadingUnlock(cost: number, balance: number): Promise<boolean> {
  return useReadingGate.getState().request(cost, balance);
}
