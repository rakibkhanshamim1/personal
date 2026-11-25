import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & { error?: string };

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground placeholder:text-muted transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary",
          error ? "border-danger" : "border-border-base",
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  ),
);
Input.displayName = "Input";
