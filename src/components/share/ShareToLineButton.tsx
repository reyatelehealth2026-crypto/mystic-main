"use client";

import * as React from "react";
import { canShareTargetPicker, shareViaTargetPicker } from "@/lib/auth/liff";
import type { LineMessage } from "@/lib/line/messaging";

interface ShareToLineButtonProps {
  /** Called each time the button is clicked to build the messages to share. */
  buildMessages: () => LineMessage[];
  /** Called when shareTargetPicker is unavailable or returns false (e.g. desktop). */
  onFallback?: () => void;
  /** Button label. Defaults to "แชร์เข้า LINE". */
  labelTh?: string;
  className?: string;
}

/**
 * Green LINE share button that uses the native `shareTargetPicker` API.
 * Only rendered when running inside the LINE app with the API available,
 * so it never regresses non-LINE browsers.
 */
export function ShareToLineButton({
  buildMessages,
  onFallback,
  labelTh = "แชร์เข้า LINE",
  className,
}: ShareToLineButtonProps) {
  const [available, setAvailable] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    canShareTargetPicker().then((ok) => {
      if (!cancelled) setAvailable(ok);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!available) return null;

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const messages = buildMessages();
      const success = await shareViaTargetPicker(messages);
      if (!success) onFallback?.();
    } catch {
      onFallback?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={busy}
      className={
        "flex items-center justify-center gap-2 rounded-lg bg-[#06C755] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#05b34c] disabled:opacity-60 " +
        (className ?? "")
      }
      aria-label={labelTh}
    >
      {/* LINE icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2C6.48 2 2 5.82 2 10.5c0 3.26 2.36 6.1 5.88 7.46-.08.72-.5 2.7-.57 3.12-.1.1.2.1.42.1.17-.1 2.4-1.6 3.3-2.3.2 0 .5 0 .8 0 5.5 0 10-3.8 10-8.5S17.5 2 12 2z" />
      </svg>
      {busy ? "กำลังแชร์…" : labelTh}
    </button>
  );
}
