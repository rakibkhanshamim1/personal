export default function BlogPostLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 animate-pulse">
      <div className="h-4 w-24 bg-muted-surface rounded mb-8" />
      <div className="h-10 w-full bg-muted-surface rounded mb-3" />
      <div className="h-10 w-2/3 bg-muted-surface rounded mb-4" />
      <div className="flex gap-3 mb-8">
        <div className="h-5 w-24 bg-muted-surface rounded" />
        <div className="h-5 w-20 bg-muted-surface rounded" />
      </div>
      <div className="aspect-video bg-muted-surface rounded-xl mb-10" />
      <div className="space-y-3">
        {[100, 95, 88, 100, 92, 85, 97, 90, 100, 93, 86, 78].map((w, i) => (
          <div key={i} className="h-4 bg-muted-surface rounded" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}
