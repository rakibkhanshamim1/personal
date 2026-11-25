"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const [year, setYear] = useState(2024);
  useEffect(() => { setYear(new Date().getFullYear()); }, []);

  return (
    <footer className="border-t border-border-base bg-surface theme-transition">
      <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-muted">
          &copy; {year} Md Shamim Mia. All rights reserved.
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:bg-muted-surface transition-colors"
        >
          Back to top <ArrowUp className="h-3 w-3" />
        </button>
      </div>
    </footer>
  );
}
