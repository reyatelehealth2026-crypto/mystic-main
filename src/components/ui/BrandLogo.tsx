"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * REFFORTUNE brand mark.
 *
 * `variant`:
 *   - `"orb"`  — purple-and-gold orb only (square). Use in headers.
 *   - `"full"` — orb + wordmark composition on dark background.
 *   - `"text"` — wordmark only (CSS, no image).
 */
export interface BrandLogoProps {
  variant?: "orb" | "full" | "text";
  size?: number;
  showWordmark?: boolean;
  inverted?: boolean;
  className?: string;
}

export function BrandLogo({
  variant = "orb",
  size = 32,
  showWordmark = true,
  inverted = false,
  className,
}: BrandLogoProps) {
  if (variant === "text") {
    return (
      <span
        className={cn(
          "font-serif font-semibold tracking-[0.02em]",
          inverted ? "text-white" : "text-[var(--accent)]",
          className,
        )}
      >
        REFFORTUNE
      </span>
    );
  }

  if (variant === "full") {
    return (
      <span className={cn("inline-block", className)}>
        <Image
          src="/logo.png"
          alt="REFFORTUNE"
          width={size}
          height={Math.round(size * 0.75)}
          className="h-auto w-auto max-w-full"
          priority
        />
      </span>
    );
  }

  // variant === "orb" — square mark for headers
  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      aria-label="REFFORTUNE"
    >
      <span
        className="relative inline-block overflow-hidden rounded-full"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo-orb.png"
          alt=""
          fill
          sizes={`${size}px`}
          className="object-cover"
          priority
        />
      </span>
      {showWordmark && (
        <span
          className={cn(
            "font-serif font-semibold tracking-[0.02em]",
            inverted ? "text-white" : "text-[var(--accent)]",
          )}
          style={{ fontSize: Math.max(15, Math.round(size * 0.6)) }}
        >
          REFFORTUNE
        </span>
      )}
    </span>
  );
}
