import * as React from "react";
import { cn } from "@/lib/cn";

type CardVariant = "default" | "glass";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

export function Card({ className, variant = "default", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border p-4 shadow-[var(--shadow-soft)] transition-transform md:p-5",
        variant === "glass"
          ? "border-[color:var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl"
          : "border-border bg-surface",
        "hover:-translate-y-0.5 active:translate-y-0",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-base font-semibold text-fg", className)}
      {...props}
    />
  );
}

export function CardDesc({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-fg-muted", className)} {...props} />;
}
