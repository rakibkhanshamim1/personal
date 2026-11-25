import { CardSkeleton } from "@/components/ui/loading";

export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      <div className="h-8 w-32 bg-muted-surface rounded animate-pulse mb-2" />
      <div className="h-4 w-64 bg-muted-surface rounded animate-pulse mb-10" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}
