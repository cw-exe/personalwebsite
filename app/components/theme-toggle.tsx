"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  /* Avoid hydration mismatch — render placeholder until mounted */
  if (!mounted) return <div className="w-8 h-8" aria-hidden />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-8 h-8 flex items-center justify-center text-muted hover:text-accent transition-colors duration-200 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {isDark ? (
        /* Sun icon */
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.06 1.06M11.54 11.54l1.06 1.06M3.4 12.6l1.06-1.06M11.54 4.46l1.06-1.06"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        /* Moon icon */
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M13.5 10.5A7 7 0 0 1 5.5 2.5a7 7 0 1 0 8 8Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
