"use client";

import * as React from "react";
import { getFriendshipStatus } from "@/lib/auth/liff";

/**
 * Shows a card prompting the user to add the LINE OA as a friend.
 * Renders only when:
 *   - running inside the LINE app (LIFF available)
 *   - `getFriendshipStatus()` returns false (not yet a friend)
 *
 * Returns null when: running outside LINE, scope/OA not configured (null),
 * or already a friend (true) — so it never regresses non-LINE contexts.
 */
export function AddFriendPrompt() {
  const [isFriend, setIsFriend] = React.useState<boolean | null>(null);
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    getFriendshipStatus().then((status) => {
      if (!cancelled) {
        setIsFriend(status);
        setChecked(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Null = unknown/unavailable → don't render
  // True = already a friend → don't render
  if (!checked || isFriend !== false) return null;

  const addFriendUrl =
    process.env.NEXT_PUBLIC_LINE_OA_ADD_FRIEND_URL ??
    "https://line.me/R/ti/p/@reffortune";

  return (
    <div className="rounded-xl border border-[#06C755]/30 bg-[#f0fff4] p-4">
      <div className="flex items-start gap-3">
        {/* LINE icon */}
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#06C755]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M12 2C6.48 2 2 5.82 2 10.5c0 3.26 2.36 6.1 5.88 7.46-.08.72-.5 2.7-.57 3.12-.1.1.2.1.42.1.17-.1 2.4-1.6 3.3-2.3.2 0 .5 0 .8 0 5.5 0 10-3.8 10-8.5S17.5 2 12 2z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#15803d]">
            ✨ เพิ่มเพื่อนเพื่อรับไพ่รายวัน
          </p>
          <p className="mt-1 text-xs text-[#166534]">
            เพิ่ม @REFFORTUNE เป็นเพื่อนเพื่อรับไพ่ดวงรายวันทาง LINE ฟรีทุกเช้า
            ไม่มีโฆษณา ไม่เสียเครดิต
          </p>
          <a
            href={addFriendUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#06C755] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#05b34c]"
          >
            เพิ่มเพื่อน @REFFORTUNE
          </a>
        </div>
      </div>
    </div>
  );
}
