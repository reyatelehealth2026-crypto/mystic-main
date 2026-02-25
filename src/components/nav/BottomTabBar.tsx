"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Home, Compass, Sparkles, Settings, Bookmark } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";

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
  const { theme } = useTheme();

  const isPastel = theme === "pastel";

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[9999] w-full",
        isPastel 
          ? "border-t border-white/30 bg-white/20 backdrop-blur-xl"
          : "border-t border-violet-100 bg-white/90 backdrop-blur-xl",
        isPastel 
          ? "shadow-[0_-4px_20px_rgba(199,125,255,0.3)]" 
          : "shadow-[0_-4px_20px_rgba(124,58,237,0.08)]"
      )}
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
                "focus-visible:outline-none focus-visible:ring-2",
                isPastel 
                  ? active
                    ? "bg-white/30 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/20"
                  : active
                    ? "bg-violet-50 text-violet-600"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50",
                isPastel && "focus-visible:ring-white/50"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={cn("w-5 h-5", active && (isPastel ? "text-white" : "text-violet-600"))} />
              <span className={cn("text-[10px] font-medium", active && (isPastel ? "text-white" : "text-violet-600"))}>
                {tab.label}
              </span>
              {active && (
                <span className={cn("absolute -top-0.5 w-1 h-1 rounded-full", isPastel ? "bg-white" : "bg-violet-600")} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
