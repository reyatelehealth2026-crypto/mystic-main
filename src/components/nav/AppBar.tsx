import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function AppBar({
  title,
  right,
  backHref,
  className,
  largeTitle = false,
}: {
  title: React.ReactNode;
  right?: React.ReactNode;
  backHref?: string;
  className?: string;
  /** iOS-style large title header */
  largeTitle?: boolean;
}) {
  return (
    <header
      className={cn(
        "flex items-center justify-between px-5 pt-6 pb-2",
        largeTitle ? "pb-4" : null,
        className
      )}
    >
      <div className="flex items-center gap-3">
        {backHref ? (
          <Link
            href={backHref}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface text-fg"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
        ) : null}
        <h1
          className={cn(
            "text-fg",
            largeTitle
              ? "text-3xl font-bold tracking-tight"
              : "text-xl font-bold"
          )}
        >
          {title}
        </h1>
      </div>
      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </header>
  );
}
