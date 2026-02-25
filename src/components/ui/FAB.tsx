"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface FABProps {
  className?: string;
  onClick?: () => void;
  href?: string;
  label?: string;
  icon?: React.ReactNode;
}

/**
 * Floating Action Button (FAB) Component
 * 
 * A circular button that floats above the content, typically used for
 * primary actions like "Add to LINE" CTA.
 * 
 * @example
 * <FAB label="เพิ่มเพื่อน LINE" href="https://line.me/..." />
 */
export function FAB({
  className,
  onClick,
  href,
  label = "เพิ่มเพื่อน LINE",
  icon,
}: FABProps) {
  const defaultIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );

  const content = (
    <>
      <span className="flex-shrink-0">{icon || defaultIcon}</span>
      <span className="text-sm font-semibold">{label}</span>
    </>
  );

  const baseClasses = cn(
    "fixed bottom-24 right-5 z-40",
    "flex items-center gap-2 px-5 py-3 rounded-full",
    "bg-[#06C755] text-white shadow-lg",
    "hover:bg-[#05B04D] active:scale-95",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06C755] focus-visible:ring-offset-2",
    className
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
}
