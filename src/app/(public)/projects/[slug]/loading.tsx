export default function ProjectDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 animate-pulse">
      <div className="h-4 w-24 bg-muted-surface rounded mb-8" />
      <div className="h-10 w-3/4 bg-muted-surface rounded mb-3" />
      <div className="h-5 w-1/2 bg-muted-surface rounded mb-4" />
      <div className="flex gap-3 mb-8">
        <div className="h-8 w-24 bg-muted-surface rounded-lg" />
        <div className="h-8 w-28 bg-muted-surface rounded-lg" />
      </div>
      <div className="aspect-video bg-muted-surface rounded-xl mb-6" />
      <div className="flex gap-2 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-6 w-20 bg-muted-surface rounded-full" />
        ))}
      </div>
      <div className="space-y-3">
        {[100, 95, 88, 100, 92, 85, 97, 90].map((w, i) => (
          <div key={i} className="h-4 bg-muted-surface rounded" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}
