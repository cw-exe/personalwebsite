"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const NAV = [
  { href: "/about",      label: "about" },
  { href: "/experience", label: "experience" },
  { href: "/projects",   label: "ventures" },
  { href: "/blog",       label: "writing" },
] as const;

export function Footer() {
  const reduce = useReducedMotion();

  return (
    <motion.footer
      {...(reduce
        ? {}
        : {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-40px" },
            transition: { type: "spring", stiffness: 200, damping: 22 },
          })}
      className="relative px-6 md:px-10 lg:px-16 pt-16 pb-10"
    >
      <div className="max-w-screen-2xl mx-auto">
        {/* Sticker card */}
        <div className="relative bg-elevated rounded-[32px] border-2 border-ink/10 shadow-[0_10px_30px_-14px_rgba(26,37,64,0.20)] px-6 md:px-10 py-10 md:py-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">

          {/* Left — sign-off */}
          <div className="max-w-md">
            <p className="font-display text-2xl md:text-3xl font-semibold text-ink leading-tight">
              thanks for stopping by
              <span className="inline-block ml-1" aria-hidden>✨</span>
            </p>
            <p className="font-sans text-sm text-muted mt-3">
              got a question, an idea, or just want to chat? my inbox is open.
            </p>
            <a
              href="mailto:lingchinwei0306@gmail.com"
              className="mt-4 inline-flex items-center gap-2 font-sans text-sm font-medium px-4 py-2 rounded-full bg-ink text-bg hover:bg-accent-deep transition-colors duration-200"
            >
              lingchinwei0306@gmail.com
              <span aria-hidden>→</span>
            </a>
          </div>

          {/* Right — mini nav */}
          <ul className="flex flex-wrap gap-x-5 gap-y-2 list-none m-0 p-0 md:justify-end">
            {NAV.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-sans text-sm text-muted hover:text-ink transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom line */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Link
            href="/"
            className="font-wordmark text-lg tracking-[0.08em] text-ink/70 hover:text-ink transition-colors"
            aria-label="Chin Wei Ling — home"
          >
            CWL
          </Link>
          <p className="font-sans text-xs text-faint">
            © {new Date().getFullYear()} chin wei ling · made with too much coffee ☕
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
