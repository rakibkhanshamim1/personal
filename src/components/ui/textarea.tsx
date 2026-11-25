import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string };

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-24 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted transition-colors resize-y",
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
Textarea.displayName = "Textarea";
