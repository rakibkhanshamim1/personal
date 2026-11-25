"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function SearchBar({ value, onChange, placeholder = "Search…", className }: Props) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-border-base bg-background pl-10 pr-3 text-sm text-foreground placeholder:text-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      />
    </div>
  );
}
