"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  IconAbout,
  IconExperience,
  IconVentures,
  IconWriting,
  IconContact,
  IconFinder,
} from "./app-icons";
import type { AppId } from "./apps";
import { hero, TINT_HIGHLIGHT_CLASS } from "../content/site";

/* iOS home-screen layout used below the md: breakpoint. Renders on top of
   the shared wallpaper. Six apps in a 3×2 grid, iOS-style status bar,
   greeting card, home indicator bar. */

const APPS: Array<{ id: AppId; label: string; Icon: React.FC<{ size?: number }> }> = [
  { id: "finder",     label: "Finder",     Icon: IconFinder },
  { id: "about",      label: "About",      Icon: IconAbout },
  { id: "experience", label: "Experience", Icon: IconExperience },
  { id: "ventures",   label: "Ventures",   Icon: IconVentures },
  { id: "writing",    label: "Writing",    Icon: IconWriting },
  { id: "contact",    label: "Contact",    Icon: IconContact },
];

export function PhoneHome({ onOpen }: { onOpen: (id: AppId) => void }) {
  const reduce = useReducedMotion();

  return (
    <div className="md:hidden absolute inset-0 z-20 flex flex-col pointer-events-none">
      <PhoneStatusBar />

      {/* Polaroid portrait */}
      <motion.figure
        initial={reduce ? false : { opacity: 0, y: 12, rotate: -6, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, rotate: -3, scale: 1 }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 20, delay: 0.08 }}
        className="pointer-events-auto self-center mt-3 relative bg-white p-3 pb-9 border-[2.5px] border-ink/85 rounded-md shadow-[0_14px_30px_-12px_rgba(26,37,64,0.45),0_6px_14px_-6px_rgba(26,37,64,0.25)]"
      >
        <span
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 rotate-[-5deg] w-20 h-4 bg-accent-butter/80 border border-ink/25"
          style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}
          aria-hidden
        />
        <div className="relative w-40 h-48 rounded-sm overflow-hidden bg-tinted">
          <Image
            src={hero.portraitSrc}
            alt={hero.name}
            fill
            sizes="160px"
            priority
            className="object-cover object-top"
          />
        </div>
        <figcaption className="absolute bottom-2 left-0 right-0 text-center font-display italic text-[11.5px] text-ink/70">
          {hero.polaroidCaption}
        </figcaption>
      </motion.figure>

      {/* Greeting */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : { delay: 0.2, duration: 0.4, ease: "easeOut" }}
        className="pointer-events-auto px-6 pt-4 pb-1 text-center"
      >
        <p className="font-display text-[12px] font-medium text-ink/70 dark:text-white/75 tracking-wide">
          {hero.greeting}
          <span className="inline-block ml-1" aria-hidden>{hero.greetingEmoji}</span>
        </p>
        <h1 className="font-wordmark font-semibold text-[2.4rem] leading-[0.95] tracking-[-0.01em] text-ink dark:text-white mt-1">
          {hero.name}
        </h1>
        <p className="font-display text-[13px] text-ink dark:text-white mt-2">
          {hero.taglineWords.map((w, i) => (
            <span key={w.text}>
              <span className="relative inline-block">
                <span className="relative z-10">{w.text}</span>
                <span
                  className={`absolute left-0 right-0 bottom-0 h-[6px] z-0 rounded-full ${TINT_HIGHLIGHT_CLASS[w.tint]}`}
                  aria-hidden
                />
              </span>
              {i < hero.taglineWords.length - 1 ? "  ·  " : ""}
            </span>
          ))}
        </p>
      </motion.div>

      {/* Icon grid */}
      <ul
        className="pointer-events-auto px-5 pt-4 grid grid-cols-3 auto-rows-min gap-y-5 gap-x-2 list-none m-0"
        aria-label="Apps"
      >
        {APPS.map((app, i) => (
          <motion.li
            key={app.id}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { delay: 0.2 + i * 0.05, duration: 0.35, ease: "easeOut" }}
          >
            <motion.button
              whileTap={reduce ? {} : { scale: 0.9 }}
              type="button"
              onClick={() => onOpen(app.id)}
              className="flex flex-col items-center gap-1.5 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/60 rounded-2xl p-1"
              aria-label={`Open ${app.label}`}
            >
              <app.Icon size={66} />
              <span className="font-sans text-[11.5px] font-medium text-ink bg-white/75 backdrop-blur-sm rounded px-1.5 py-0.5 border border-ink/15">
                {app.label}
              </span>
            </motion.button>
          </motion.li>
        ))}
      </ul>

      {/* Fills remaining height */}
      <div className="flex-1" aria-hidden />

      {/* Home indicator */}
      <div className="pb-2 pt-3 flex justify-center pointer-events-none">
        <div className="w-32 h-1 rounded-full bg-ink/70 dark:bg-white/70" aria-hidden />
      </div>
    </div>
  );
}

/* ── iOS-style status bar ────────────────────────────────────── */

function formatMobileTime(d: Date) {
  const h = d.getHours() % 12 || 12;
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

function PhoneStatusBar() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-auto relative px-6 pt-3 pb-1 flex items-center justify-between text-[13px] font-semibold text-ink dark:text-white z-40">
      <span className="tabular-nums">
        {now ? formatMobileTime(now) : "\u00A0"}
      </span>
      <div className="flex items-center gap-2 text-ink/85 dark:text-white/85">
        <MobileSignalIcon />
        <MobileWifiIcon />
        <MobileBatteryIcon />
        <NightModeToggle />
      </div>
    </div>
  );
}

function MobileSignalIcon() {
  return (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" aria-hidden>
      <rect x="0"  y="7" width="3" height="4" rx="0.5" />
      <rect x="5"  y="5" width="3" height="6" rx="0.5" />
      <rect x="10" y="3" width="3" height="8" rx="0.5" />
      <rect x="15" y="0" width="0" height="0" />
    </svg>
  );
}

function MobileWifiIcon() {
  return (
    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" aria-hidden>
      <path d="M1 4c3.5-3.3 9.5-3.3 13 0"  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      <path d="M3 6c2.5-2.4 6.5-2.4 9 0"    stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
      <path d="M5 8c1.5-1.4 3-1.4 4.5 0"   stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="7.5" cy="10" r="0.9" fill="currentColor" />
    </svg>
  );
}

function MobileBatteryIcon() {
  return (
    <svg width="26" height="11" viewBox="0 0 26 11" fill="none" aria-hidden>
      <rect x="0.5" y="0.5" width="22" height="10" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      <rect x="23"  y="3.5" width="1.5" height="4" rx="0.5" fill="currentColor" opacity="0.5" />
      <rect x="1.5" y="1.5" width="20" height="8" rx="1.5" fill="currentColor" />
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
      className="flex items-center justify-center w-6 h-6 rounded hover:bg-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
    >
      {isDark ? (
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden>
          <circle cx="7.5" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3.2 3.2l1.06 1.06M10.74 10.74l1.06 1.06M3.2 11.8l1.06-1.06M10.74 4.26l1.06-1.06"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden>
          <path
            d="M12.8 9.6A6.2 6.2 0 0 1 5.4 2.2 6.2 6.2 0 1 0 12.8 9.6Z"
            stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
