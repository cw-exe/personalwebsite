"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const MENUS = ["File", "Edit", "View", "Window", "Help"] as const;

function formatClock(d: Date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const h = d.getHours() % 12 || 12;
  const m = d.getMinutes().toString().padStart(2, "0");
  const ap = d.getHours() >= 12 ? "PM" : "AM";
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}  ${h}:${m} ${ap}`;
}

export function MenuBar({ activeApp }: { activeApp: string | null }) {
  const reduce = useReducedMotion();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.header
      initial={reduce ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 22 }}
      className="hidden md:flex absolute top-0 inset-x-0 z-40 h-8 md:h-9 px-3 md:px-5 items-center justify-between text-[13px] font-medium text-ink backdrop-blur-md bg-white/55 border-b border-ink/10"
    >
      {/* Left cluster — apple mark + active app + menus */}
      <div className="flex items-center gap-4 md:gap-5">
        <AppleMark />
        <span className="font-semibold hidden sm:inline">
          {activeApp ?? "Finder"}
        </span>
        <nav className="hidden md:flex items-center gap-4" aria-label="Menus (decorative)">
          {MENUS.map((m) => (
            <button
              key={m}
              type="button"
              className="hover:bg-ink/10 rounded px-1.5 py-0.5 transition-colors text-ink/85"
            >
              {m}
            </button>
          ))}
        </nav>
      </div>

      {/* Right cluster — status */}
      <div className="flex items-center gap-3 md:gap-4 text-ink/85">
        <BatteryIcon />
        <WifiIcon />
        <SearchIcon />
        <NightModeToggle />
        <span className="hidden sm:inline text-[12.5px] tabular-nums">
          {now ? formatClock(now) : "\u00A0"}
        </span>
      </div>
    </motion.header>
  );
}

/* ── Icons — small, hand-drawn feel ─────────────────────────────────────── */

function AppleMark() {
  return (
    <svg width="15" height="18" viewBox="0 0 15 18" aria-hidden>
      <path
        d="M10.8 9.2c0-2.4 2-3.5 2.1-3.6-1.1-1.6-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9s-1.9-.9-3.1-.9C1.1 3.8 0 5 0 7.4c0 2.5 1 5.1 2.3 6.7.7.8 1.5 1.7 2.6 1.7 1 0 1.4-.7 2.7-.7s1.6.7 2.7.7c1.1 0 1.8-.8 2.5-1.7.8-1 1.1-2 1.2-2 0 0-2.4-.9-2.4-3.6zM8.7 2.2c.5-.7.9-1.6.8-2.5-.8 0-1.7.5-2.2 1.1-.5.6-1 1.5-.8 2.5.9.1 1.7-.4 2.2-1.1z"
        fill="currentColor"
      />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="26" height="12" viewBox="0 0 26 12" fill="none" aria-hidden>
      <rect x="0.75" y="0.75" width="21.5" height="10.5" rx="2.5" stroke="currentColor" strokeWidth="1.25" opacity="0.7" />
      <rect x="23.5" y="4" width="1.5" height="4" rx="0.5" fill="currentColor" opacity="0.5" />
      <rect x="2" y="2" width="18" height="8" rx="1.25" fill="currentColor" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden>
      <path d="M1 5c4-4 10-4 14 0"      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
      <path d="M3.4 7.4c3-3 6.2-3 9.2 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
      <path d="M5.8 9.8c1.5-1.5 2.9-1.5 4.4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8" cy="12" r="0.9" fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.2 9.2 12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function NightModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? "Switch to day mode" : "Switch to night mode";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="flex items-center justify-center w-6 h-6 rounded hover:bg-ink/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
    >
      {isDark ? (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
          <circle cx="7.5" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3.2 3.2l1.06 1.06M10.74 10.74l1.06 1.06M3.2 11.8l1.06-1.06M10.74 4.26l1.06-1.06"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
          <path
            d="M12.8 9.6A6.2 6.2 0 0 1 5.4 2.2 6.2 6.2 0 1 0 12.8 9.6Z"
            stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
