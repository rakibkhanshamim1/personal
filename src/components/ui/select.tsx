import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string };

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ className, error, children, ...props }, ref) => (
    <div className="w-full">
      <select
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground transition-colors appearance-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary",
          error ? "border-danger" : "border-border-base",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  ),
);
Select.displayName = "Select";
