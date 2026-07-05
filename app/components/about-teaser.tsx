"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function AboutTeaser() {
  const reduce = useReducedMotion();

  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 60, filter: "blur(4px)" },
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.9, ease: EASE, delay },
        };

  return (
    <section
      id="about"
      className="px-6 md:px-12 lg:px-20 py-28 lg:py-40 border-t border-faint/20"
    >
      <div className="max-w-screen-xl mx-auto">
        {/* Warm accent rule */}
        <motion.div
          {...(reduce
            ? {}
            : {
                initial: { scaleX: 0, originX: 0 },
                whileInView: { scaleX: 1 },
                viewport: { once: true, margin: "-80px" },
                transition: { duration: 0.9, ease: EASE },
              })}
          className="h-px w-16 bg-accent-warm mb-12"
          aria-hidden
        />

        <div className="max-w-3xl">
          <motion.p
            {...reveal(0.08)}
            className="font-display text-[clamp(1.375rem,2.8vw,2rem)] leading-[1.5] text-ink"
            style={{ textWrap: "pretty" } as React.CSSProperties}
          >
            A compassionate undergraduate with a strong background in
            leadership and STEM — passionate, active, and always ready
            to lead or work as part of a team. Proficient in Malay,
            English, Mandarin, and Cantonese.
          </motion.p>

          <motion.div
            {...reveal(0.2)}
            className="mt-10 flex items-center gap-8"
          >
            <Link
              href="/about"
              className="font-sans text-sm text-accent-warm hover:text-ink transition-colors duration-200 tracking-wide inline-flex items-center gap-2 group"
            >
              Full bio
              <span
                className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </Link>
            <span className="text-faint/40 select-none" aria-hidden>·</span>
            <Link
              href="/experience"
              className="font-sans text-sm text-muted hover:text-ink transition-colors duration-200 tracking-wide"
            >
              Timeline
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
