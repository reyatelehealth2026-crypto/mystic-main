"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ensureLiff, loginWithLiff, getFriendshipStatus } from "@/lib/auth/liff";
import { useAuth } from "@/components/auth/AuthProvider";
import { AddFriendPrompt } from "@/components/onboarding/AddFriendPrompt";

/**
 * LIFF mini-app home. Configure this URL (e.g. https://<host>/liff) as the
 * LIFF app endpoint in the LINE console.
 *
 * After login this page becomes the mini-app home — a quick-access hub to all
 * major features. The AddFriendPrompt is shown when the user hasn't added the
 * OA yet (required for daily push to work).
 */

interface NavItem {
  href: string;
  emoji: string;
  label: string;
  desc: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/daily-card", emoji: "🃏", label: "ไพ่รายวัน", desc: "ดูไพ่ประจำวันนี้" },
  { href: "/tarot", emoji: "✨", label: "ทาโรต์", desc: "ถามคำถามไพ่ทาโรต์" },
  { href: "/astrology", emoji: "🔮", label: "ดูดวง", desc: "ดวงชะตารายวัน" },
  { href: "/lucky-numbers", emoji: "🍀", label: "เลขมงคล", desc: "เลขนำโชควันนี้" },
  { href: "/history", emoji: "📖", label: "ประวัติ", desc: "ผลดวงที่ผ่านมา" },
  { href: "/profile", emoji: "⚙️", label: "โปรไฟล์", desc: "ตั้งค่าและเครดิต" },
];

export function LiffClient() {
  const router = useRouter();
  const { refresh, user } = useAuth();
  const [status, setStatus] = React.useState("กำลังเชื่อมต่อกับ LINE…");
  const [ready, setReady] = React.useState(false);
  const [friendFlag, setFriendFlag] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await ensureLiff();
      if (!ok) {
        if (!cancelled) setStatus("ไม่พบการตั้งค่า LIFF");
        return;
      }
      const loggedIn = await loginWithLiff();
      if (cancelled) return;
      if (loggedIn) {
        await refresh();
        // Check friendship status after login (graceful: null = unknown)
        const flag = await getFriendshipStatus();
        if (!cancelled) {
          setFriendFlag(flag);
          setReady(true);
        }
      }
      // If not logged in, loginWithLiff() has triggered a LIFF redirect.
    })();
    return () => {
      cancelled = true;
    };
  }, [router, refresh]);

  // Not yet ready — show status
  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-5 text-center">
        <p className="text-sm text-fg-muted">{status}</p>
      </div>
    );
  }

  return (
    <div className="px-5 pb-8 pt-4">
      {/* Header */}
      <div className="mb-4 text-center">
        <p className="text-2xl font-bold text-fg">REFFORTUNE ✨</p>
        {user?.displayName ? (
          <p className="mt-1 text-sm text-fg-muted">สวัสดี, {user.displayName}</p>
        ) : null}
      </div>

      {/* Add-friend prompt — shown only when friendFlag === false */}
      {friendFlag === false && (
        <div className="mb-4">
          <AddFriendPrompt />
        </div>
      )}

      {/* Feature grid */}
      <div className="grid grid-cols-2 gap-3">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-start gap-1 rounded-xl border border-border bg-surface p-4 transition hover:bg-surface-hover active:scale-95"
          >
            <span className="text-2xl" aria-hidden="true">{item.emoji}</span>
            <span className="text-sm font-semibold text-fg">{item.label}</span>
            <span className="text-xs text-fg-muted">{item.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
