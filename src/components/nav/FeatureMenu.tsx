"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";

/**
 * Feature menu items for all fortune-telling features
 */
const features = [
  {
    href: "/tarot",
    label: "ไพ่ทาโรต์",
    icon: "🃏",
    desc: "ดูดวงด้วยไพ่ทาโรต์",
  },
  {
    href: "/spirit-card",
    label: "ไพ่จิตวิญญาณ",
    icon: "✨",
    desc: "ค้นหาไพ่ประจำตัว",
  },
  {
    href: "/numerology",
    label: "เลขศาสตร์",
    icon: "🔢",
    desc: "ดูดวงจากเบอร์โทร",
  },
  {
    href: "/daily-card",
    label: "ไพ่ประจำวัน",
    icon: "📅",
    desc: "ดูดวงรายวัน",
  },
  {
    href: "/horoscope",
    label: "ดูดวงราศี",
    icon: "♈",
    desc: "ดูดวงตามราศี",
  },
  {
    href: "/compatibility",
    label: "ดูดวงความรัก",
    icon: "💕",
    desc: "ดูความเข้ากันได้",
  },
  {
    href: "/chinese-zodiac",
    label: "ดูดวงจีน",
    icon: "🐉",
    desc: "ดูดวง 12 นักษัตร",
  },
  {
    href: "/specialized",
    label: "ดูดวงเฉพาะด้าน",
    icon: "🎯",
    desc: "ดูดวงเจาะลึก",
  },
  {
    href: "/name-numerology",
    label: "เลขศาสตร์ชื่อ",
    icon: "📝",
    desc: "ดูดวงจากชื่อ",
  },
] as const;

export interface FeatureMenuProps {
  className?: string;
  title?: string;
  showTitle?: boolean;
}

/**
 * FeatureMenu Component
 * 
 * Displays a navigation menu linking to all fortune-telling features.
 * Used on feature pages to allow easy navigation between different divination methods.
 * 
 * @example
 * <FeatureMenu title="ลองดูดวงแบบอื่น" />
 */
export function FeatureMenu({
  className,
  title = "ลองดูดวงแบบอื่น",
  showTitle = true,
}: FeatureMenuProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {showTitle && (
        <h2 className="text-base font-semibold text-fg px-1">{title}</h2>
      )}

      <div className="grid grid-cols-2 gap-3">
        {features.map((feature) => {
          const active = isActive(feature.href);
          
          return (
            <Link
              key={feature.href}
              href={feature.href}
              className={cn(
                "block transition-transform hover:scale-[1.02] active:scale-[0.98]",
                active && "pointer-events-none"
              )}
            >
              <Card
                className={cn(
                  "p-4 h-full transition-colors",
                  active
                    ? "bg-accent/10 border-accent/30"
                    : "bg-bg hover:bg-bg-subtle"
                )}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{feature.icon}</span>
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        active ? "text-accent" : "text-fg"
                      )}
                    >
                      {feature.label}
                    </span>
                  </div>
                  <p className="text-xs text-fg-muted leading-relaxed">
                    {feature.desc}
                  </p>
                  {active && (
                    <div className="flex items-center gap-1 text-xs text-accent">
                      <span>•</span>
                      <span>กำลังดูอยู่</span>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
