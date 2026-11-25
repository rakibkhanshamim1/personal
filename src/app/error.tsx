"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="rounded-full bg-danger/10 p-5 mb-6">
        <svg className="h-12 w-12 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-2">Something Went Wrong</h1>
      <p className="text-muted max-w-md mb-8">
        An unexpected error occurred. Don&apos;t worry, your data is safe. Try refreshing the page or click below.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-contrast hover:bg-primary-hover transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
          Try Again
        </button>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-border-base px-6 py-3 text-sm font-medium text-foreground hover:bg-muted-surface transition-colors"
        >
          Back to Home
        </a>
      </div>
      {error.digest && (
        <p className="mt-6 text-xs text-muted">Error ID: {error.digest}</p>
      )}
    </div>
  );
}
