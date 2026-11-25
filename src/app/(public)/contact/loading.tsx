export default function ContactLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 animate-pulse">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="h-8 w-32 bg-muted-surface rounded-full mx-auto mb-4" />
        <div className="h-10 w-72 bg-muted-surface rounded mx-auto mb-4" />
        <div className="h-4 w-96 bg-muted-surface rounded mx-auto" />
      </div>
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border-base bg-surface p-6 space-y-5">
            <div className="h-5 w-40 bg-muted-surface rounded" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-muted-surface shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-12 bg-muted-surface rounded" />
                  <div className="h-4 w-40 bg-muted-surface rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-border-base bg-surface p-6 md:p-8 space-y-5">
            <div className="h-6 w-36 bg-muted-surface rounded" />
            <div className="h-4 w-64 bg-muted-surface rounded" />
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="h-10 bg-muted-surface rounded-lg" />
              <div className="h-10 bg-muted-surface rounded-lg" />
            </div>
            <div className="h-10 bg-muted-surface rounded-lg" />
            <div className="h-32 bg-muted-surface rounded-lg" />
            <div className="h-10 w-36 bg-muted-surface rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
