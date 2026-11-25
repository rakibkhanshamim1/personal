export default function AboutLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 animate-pulse">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <div className="w-48 h-48 shrink-0 rounded-2xl bg-muted-surface" />
        <div className="flex-1 space-y-3 w-full">
          <div className="h-8 w-56 bg-muted-surface rounded" />
          <div className="h-5 w-40 bg-muted-surface rounded" />
          <div className="h-4 w-24 bg-muted-surface rounded" />
          <div className="h-4 w-full bg-muted-surface rounded mt-4" />
          <div className="h-4 w-full bg-muted-surface rounded" />
          <div className="h-4 w-3/4 bg-muted-surface rounded" />
        </div>
      </div>
      <div className="mt-16 space-y-4">
        <div className="h-7 w-40 bg-muted-surface rounded" />
        <div className="space-y-6 border-l-2 border-muted-surface pl-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 w-48 bg-muted-surface rounded" />
              <div className="h-4 w-36 bg-muted-surface rounded" />
              <div className="h-3 w-24 bg-muted-surface rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
