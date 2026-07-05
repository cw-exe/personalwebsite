"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const ROLES = [
  { title: "Lead Organizer",      org: "TEDxUKM",                           year: "2025–26" },
  { title: "Head of Secretariat", org: "Faculty Student Association, FTSM", year: "2024–26" },
  { title: "Founder",             org: "Aceterus EdTech",                   year: "2025"    },
  { title: "Chair",               org: "ASEAN Council, Sunway Model UN",     year: "2025"    },
  { title: "Vice President",      org: "ARVIS Robotics Club",                year: "2025–26" },
  { title: "Founder",             org: "Polarvoid Photobooth",               year: "2025"    },
] as const;

export function RolesStrip() {
  const reduce = useReducedMotion();

  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 50, filter: "blur(3px)" },
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.8, ease: EASE, delay },
        };

  return (
    <section className="px-6 md:px-12 lg:px-20 py-28 lg:py-40 border-t border-faint/20">
      <div className="max-w-screen-xl mx-auto">
        {/* Teal accent rule */}
        <motion.div
          {...(reduce
            ? {}
            : {
                initial: { scaleX: 0, originX: 0 },
                whileInView: { scaleX: 1 },
                viewport: { once: true, margin: "-80px" },
                transition: { duration: 0.9, ease: EASE },
              })}
          className="h-px w-16 bg-accent-teal mb-12"
          aria-hidden
        />

        <motion.p {...reveal(0)} className="font-display italic text-muted text-base mb-16">
          Current roles
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
          {ROLES.map((role, i) => (
            <motion.div key={`${role.title}-${role.org}`} {...reveal(0.06 + i * 0.08)}>
              <p className="font-sans text-[0.65rem] text-accent-teal tracking-[0.12em] uppercase mb-3">
                {role.year}
              </p>
              <h3 className="font-display text-[clamp(1.25rem,2.2vw,1.75rem)] text-ink leading-snug mb-2">
                {role.title}
              </h3>
              <p className="font-sans text-sm text-muted leading-snug">{role.org}</p>
            </motion.div>
          ))}
        </div>

        <motion.div {...reveal(0.4)} className="mt-16">
          <Link
            href="/experience"
            className="font-sans text-sm text-accent-teal hover:text-ink transition-colors duration-200 tracking-wide inline-flex items-center gap-2 group"
          >
            Full timeline
            <span
              className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1"
              aria-hidden
            >
              →
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
