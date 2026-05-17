/**
 * §2 — ตรียางค์พิษ / นวางค์พิษ.
 *
 * The "core" 3°20'-wide poison sits at the 2nd navamsha (10/3 ≈ 3.33°)
 * of the afflicted decanate. Outside that range but still inside the
 * decanate, the affliction is graded "เบา" (mild).
 */

import { POISON_NAMES, POISON_TABLE } from "./reference";
import type { PoisonKind } from "./reference";

export type { PoisonKind };

export type PoisonSeverity = "none" | "light" | "heavy";

export interface PoisonResult {
  kind: PoisonKind | null;
  severity: PoisonSeverity;
  label: string;
}

export function poisonAt(longitudeDeg: number): PoisonResult {
  const lon = ((longitudeDeg % 360) + 360) % 360;
  const sign = Math.floor(lon / 30);
  const within = lon - sign * 30;
  const decanate = Math.min(2, Math.floor(within / 10));

  const entry = POISON_TABLE[sign];
  if (!entry || entry.decanate !== decanate) {
    return { kind: null, severity: "none", label: "—" };
  }

  const decanateOffset = within - decanate * 10;
  let severity: PoisonSeverity = "light";
  if (decanateOffset >= 3 + 1 / 3 && decanateOffset <= 6 + 2 / 3) {
    severity = "heavy";
  }

  const kindLabel = POISON_NAMES[entry.kind];
  return {
    kind: entry.kind,
    severity,
    label:
      severity === "heavy" ? `${kindLabel} (นวางค์พิษ)` : kindLabel,
  };
}
