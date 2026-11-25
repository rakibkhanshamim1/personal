"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Theme } from "@/lib/theme/constants";

type ThemeCtx = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (t: Theme) => void;
};

const Ctx = createContext<ThemeCtx>({
  theme: "dark",
  resolvedTheme: "dark",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(Ctx);
}

function readCookie(): Theme {
  if (typeof document === "undefined") return "dark";
  const m = document.cookie.match(/(?:^|; )theme=([^;]*)/);
  return (m?.[1] as Theme) ?? "dark";
}

function resolve(t: Theme): "light" | "dark" {
  if (t === "system") {
    return typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return t;
}

function applyTheme(r: "light" | "dark") {
  document.documentElement.classList.toggle("dark", r === "dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => readCookie());
  const [resolved, setResolved] = useState<"light" | "dark">(() => resolve(readCookie()));

  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        const r = mq.matches ? "dark" : "light";
        setResolved(r);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    const r = resolve(t);
    setResolved(r);
    document.cookie = `theme=${t};path=/;max-age=${365 * 86400};SameSite=Lax`;
  }, []);

  return (
    <Ctx value={{ theme, resolvedTheme: resolved, setTheme }}>
      {children}
    </Ctx>
  );
}
