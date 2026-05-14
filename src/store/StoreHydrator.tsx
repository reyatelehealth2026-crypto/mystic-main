"use client";

import { useEffect } from "react";
import { useConfigStore } from "./useConfigStore";
import { useHistoryStore } from "./useHistoryStore";

/**
 * Triggers zustand `persist` rehydration after the first client render.
 * Required because both stores set `skipHydration: true` to avoid a
 * server/client mismatch on the initial paint.
 */
export function StoreHydrator() {
  useEffect(() => {
    useConfigStore.persist.rehydrate();
    useHistoryStore.persist.rehydrate();
  }, []);
  return null;
}
