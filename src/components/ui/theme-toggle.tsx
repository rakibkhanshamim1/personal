"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const next = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };

  return (
    <button
      type="button"
      onClick={next}
      className={cn(
        "rounded-lg p-2 text-muted hover:text-foreground hover:bg-muted-surface transition-colors",
        className,
      )}
      aria-label="Toggle theme"
    >
      {!mounted ? <Moon className="h-5 w-5" /> :
        theme === "dark" ? <Moon className="h-5 w-5" /> :
        theme === "light" ? <Sun className="h-5 w-5" /> :
        <Monitor className="h-5 w-5" />}
    </button>
  );
}
