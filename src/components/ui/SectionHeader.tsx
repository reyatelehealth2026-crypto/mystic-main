import * as React from "react";
import { cn } from "@/lib/cn";

export function SectionHeader({
  title,
  action,
  className,
}: {
  title: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <h2 className="text-base font-semibold text-fg">{title}</h2>
      {action ? <div className="flex items-center">{action}</div> : null}
    </div>
  );
}
