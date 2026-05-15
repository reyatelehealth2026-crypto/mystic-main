"use client";

import React from "react";
import { cn } from "@/lib/cn";
import {
  SHARE_FORMATS,
  SHARE_FORMAT_ORDER,
  type ShareFormatId,
} from "./formats";

interface ShareFormatToggleProps {
  value: ShareFormatId;
  onChange: (next: ShareFormatId) => void;
  className?: string;
}

export function ShareFormatToggle({
  value,
  onChange,
  className,
}: ShareFormatToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="เลือกขนาดรูปสำหรับแชร์"
      className={cn(
        "inline-flex rounded-full bg-violet-100/70 p-1 ring-1 ring-violet-200",
        className,
      )}
    >
      {SHARE_FORMAT_ORDER.map((id) => {
        const f = SHARE_FORMATS[id];
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(id)}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-full transition-all",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
              active
                ? "bg-white text-violet-700 shadow-sm"
                : "text-violet-500 hover:text-violet-700",
            )}
            title={f.hint}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
