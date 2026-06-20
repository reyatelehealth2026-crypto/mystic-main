import { create } from "zustand";

export interface ConfirmDetail {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface ConfirmOptions {
  title: string;
  message?: string;
  details?: ConfirmDetail[];
  confirmText?: string;
  cancelText?: string;
  /** "spend" tints the confirm button to signal credits will be used. */
  tone?: "default" | "spend" | "danger";
  icon?: string;
  /** Disable the confirm button (e.g. insufficient balance). */
  disabled?: boolean;
}

interface ConfirmState {
  open: boolean;
  opts: ConfirmOptions | null;
  resolver: ((v: boolean) => void) | null;
  request: (opts: ConfirmOptions) => Promise<boolean>;
  resolve: (v: boolean) => void;
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  open: false,
  opts: null,
  resolver: null,
  request: (opts) =>
    new Promise<boolean>((resolve) => {
      set({ open: true, opts, resolver: resolve });
    }),
  resolve: (v) => {
    const r = get().resolver;
    set({ open: false, opts: null, resolver: null });
    r?.(v);
  },
}));

/** Imperative helper usable anywhere (hooks, stores) without React context. */
export function requestConfirm(opts: ConfirmOptions): Promise<boolean> {
  return useConfirmStore.getState().request(opts);
}
