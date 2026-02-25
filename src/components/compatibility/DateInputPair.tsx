"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";

export interface DateInputPairProps {
  person1Date: string;
  person2Date: string;
  onPerson1DateChange: (date: string) => void;
  onPerson2DateChange: (date: string) => void;
  person1Label?: string;
  person2Label?: string;
  person1Error?: string;
  person2Error?: string;
  className?: string;
}

/**
 * DateInputPair component for compatibility analysis
 * Provides two date inputs for birth dates with Thai labels and validation
 */
export function DateInputPair({
  person1Date,
  person2Date,
  onPerson1DateChange,
  onPerson2DateChange,
  person1Label = "วันเกิดคนที่ 1",
  person2Label = "วันเกิดคนที่ 2",
  person1Error,
  person2Error,
  className,
}: DateInputPairProps) {
  // Calculate max date (today)
  const maxDate = React.useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  // Min date (1900-01-01)
  const minDate = "1900-01-01";

  return (
    <div className={cn("space-y-4", className)}>
      {/* Person 1 Date Input */}
      <div className="space-y-2">
        <Label htmlFor="person1-date">{person1Label}</Label>
        <Input
          id="person1-date"
          type="date"
          value={person1Date}
          onChange={(e) => onPerson1DateChange(e.target.value)}
          min={minDate}
          max={maxDate}
          required
          className={cn(
            person1Error && "border-danger focus-visible:ring-danger"
          )}
        />
        {person1Error && (
          <p className="text-xs text-danger mt-1">{person1Error}</p>
        )}
      </div>

      {/* Person 2 Date Input */}
      <div className="space-y-2">
        <Label htmlFor="person2-date">{person2Label}</Label>
        <Input
          id="person2-date"
          type="date"
          value={person2Date}
          onChange={(e) => onPerson2DateChange(e.target.value)}
          min={minDate}
          max={maxDate}
          required
          className={cn(
            person2Error && "border-danger focus-visible:ring-danger"
          )}
        />
        {person2Error && (
          <p className="text-xs text-danger mt-1">{person2Error}</p>
        )}
      </div>
    </div>
  );
}
