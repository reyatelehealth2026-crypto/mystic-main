"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Home, Compass, Sparkles, Settings, Bookmark } from "lucide-react";

const bottomTabs = [
  { label: "หน้าแรก", href: "/", icon: Home },
  { label: "สำรวจ", href: "/explore", icon: Compass },
  { label: "ดูดวง", href: "/tarot", icon: Sparkles },
  { label: "บันทึก", href: "/library/saved", icon: Bookmark },
  { label: "ตั้งค่า", href: "/settings", icon: Settings },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "#") return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[9999] w-full border-t border-border bg-bg/90 backdrop-blur-xl shadow-[0_-4px_20px_rgba(124,58,237,0.08)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-1 px-2 py-2">
        {bottomTabs.map((tab) => {
          const active = isActive(pathname, tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                "relative flex h-14 min-w-[64px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                active
                  ? "bg-accent/10 text-accent"
                  : "text-fg-subtle hover:text-fg hover:bg-surface"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {active && (
                <span className="absolute -top-0.5 w-1 h-1 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
