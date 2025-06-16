import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "destructive";
}

function Badge({ className, variant = "primary", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "badge",
        {
          "badge-primary": variant === "primary",
          "badge-secondary": variant === "secondary",
          "badge-success": variant === "success",
          "badge-warning": variant === "warning",
          "badge-destructive": variant === "destructive",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
