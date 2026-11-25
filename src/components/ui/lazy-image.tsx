"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string;
};

export function LazyImage({ className, wrapperClassName, alt, onLoad, onError, ...props }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-muted-surface", wrapperClassName)}>
      {/* Skeleton pulse while loading */}
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-muted-surface flex items-center justify-center">
          <svg className="h-8 w-8 text-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
          </svg>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted-surface text-muted">
          <svg className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
          </svg>
          <span className="text-xs">Failed to load</span>
        </div>
      )}

      {/* Actual image */}
      <img
        {...props}
        alt={alt ?? ""}
        loading="lazy"
        className={cn(
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
        onLoad={(e) => { setLoaded(true); onLoad?.(e); }}
        onError={(e) => { setError(true); onError?.(e); }}
      />
    </div>
  );
}
