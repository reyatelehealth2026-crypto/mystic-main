"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface DateValue {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export interface DateStepperProps {
  value: DateValue;
  onChange: (v: DateValue) => void;
  className?: string;
}

const THAI_MONTH_SHORT = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function clampDay(year: number, month: number, day: number): number {
  const max = daysInMonth(year, month);
  return Math.min(Math.max(1, day), max);
}

const BTN_CLASS =
  "inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-bg text-fg-muted hover:bg-surface hover:text-fg active:scale-95 transition";

type Field = "year" | "month" | "day" | "hour";

function StepperGroup({
  label,
  field,
  canDouble,
  onShift,
}: {
  label: React.ReactNode;
  field: Field;
  canDouble?: boolean;
  onShift: (field: Field, delta: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-2 py-1.5">
      {canDouble && (
        <button
          type="button"
          aria-label={`-12 ${field}`}
          onClick={() => onShift(field, -12)}
          className={BTN_CLASS}
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>
      )}
      <button
        type="button"
        aria-label={`-1 ${field}`}
        onClick={() => onShift(field, -1)}
        className={BTN_CLASS}
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <div className="min-w-[3.5rem] text-center text-sm font-medium text-fg tabular-nums">
        {label}
      </div>
      <button
        type="button"
        aria-label={`+1 ${field}`}
        onClick={() => onShift(field, 1)}
        className={BTN_CLASS}
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
      {canDouble && (
        <button
          type="button"
          aria-label={`+12 ${field}`}
          onClick={() => onShift(field, 12)}
          className={BTN_CLASS}
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export function DateStepper({ value, onChange, className }: DateStepperProps) {
  function shift(field: Field, delta: number) {
    const v = { ...value };
    if (field === "year") {
      v.year += delta;
    } else if (field === "month") {
      let m = v.month + delta;
      while (m < 1) {
        m += 12;
        v.year -= 1;
      }
      while (m > 12) {
        m -= 12;
        v.year += 1;
      }
      v.month = m;
    } else if (field === "day") {
      const date = new Date(v.year, v.month - 1, v.day);
      date.setDate(date.getDate() + delta);
      v.year = date.getFullYear();
      v.month = date.getMonth() + 1;
      v.day = date.getDate();
    } else {
      const totalMin = v.hour * 60 + v.minute + delta * 60;
      const dayDelta = Math.floor(totalMin / 1440);
      const rem = ((totalMin % 1440) + 1440) % 1440;
      if (dayDelta !== 0) {
        const date = new Date(v.year, v.month - 1, v.day);
        date.setDate(date.getDate() + dayDelta);
        v.year = date.getFullYear();
        v.month = date.getMonth() + 1;
        v.day = date.getDate();
      }
      v.hour = Math.floor(rem / 60);
      v.minute = rem % 60;
    }
    v.day = clampDay(v.year, v.month, v.day);
    onChange(v);
  }

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-2", className)}>
      <StepperGroup label={`${value.year + 543}`} field="year" canDouble onShift={shift} />
      <StepperGroup
        label={THAI_MONTH_SHORT[value.month - 1]}
        field="month"
        canDouble
        onShift={shift}
      />
      <StepperGroup label={`${value.day}`} field="day" onShift={shift} />
      <StepperGroup
        label={`${String(value.hour).padStart(2, "0")}:${String(value.minute).padStart(2, "0")}`}
        field="hour"
        onShift={shift}
      />
    </div>
  );
}
