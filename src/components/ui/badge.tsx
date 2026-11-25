import { cn } from "@/lib/utils/cn";

type Variant = "default" | "primary" | "success" | "warning" | "danger";

const styles: Record<Variant, string> = {
  default: "bg-muted-surface text-muted",
  primary: "bg-primary-soft text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

type Props = {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
};

export function Badge({ variant = "default", children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
