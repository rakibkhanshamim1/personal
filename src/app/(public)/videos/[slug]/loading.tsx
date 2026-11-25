export default function VideoDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 animate-pulse">
      <div className="h-4 w-24 bg-muted-surface rounded mb-8" />
      <div className="h-10 w-3/4 bg-muted-surface rounded mb-4" />
      <div className="aspect-video bg-muted-surface rounded-xl mb-6" />
      <div className="space-y-3">
        {[100, 92, 85, 97].map((w, i) => (
          <div key={i} className="h-4 bg-muted-surface rounded" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}
