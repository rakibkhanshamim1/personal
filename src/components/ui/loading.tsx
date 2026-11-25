import { cn } from "@/lib/utils/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-5 w-5 animate-spin rounded-full border-2 border-muted border-t-primary", className)}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <Spinner className="h-8 w-8" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border-base bg-surface animate-pulse">
      <div className="aspect-video bg-muted-surface rounded-t-xl" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 bg-muted-surface rounded" />
        <div className="h-3 w-full bg-muted-surface rounded" />
        <div className="h-3 w-1/2 bg-muted-surface rounded" />
      </div>
    </div>
  );
}
