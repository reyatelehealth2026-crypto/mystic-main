"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export function HeartSave({
  saved,
  onToggle,
  className,
  label,
  disabled,
}: {
  saved: boolean;
  onToggle?: () => void;
  className?: string;
  label?: string;
  disabled?: boolean;
}) {
  const aria = label ?? (saved ? "Remove from saved" : "Save");

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={aria}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full",
        "border border-border bg-[var(--glass-bg)] text-fg backdrop-blur-xl",
        "transition-colors hover:bg-surface-2 disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(saved ? "text-accent" : "text-fg-muted")}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
