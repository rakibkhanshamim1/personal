import Link from "next/link";

export default function VideoNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="rounded-full bg-primary-soft p-5 mb-6">
        <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-2">Video Not Found</h1>
      <p className="text-muted max-w-sm mb-6">This video doesn&apos;t exist or may have been removed.</p>
      <Link href="/videos" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-contrast hover:bg-primary-hover transition-colors">
        Browse All Videos
      </Link>
    </div>
  );
}
