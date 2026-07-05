"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* PLACEHOLDER: owner to supply description, dates, and media for each venture */
const VENTURES = [
  { name: "Polarvoid", type: "Photobooth Business", year: "2025", href: "/projects" },
  { name: "Aceterus", type: "EdTech Startup",       year: "2025", href: "/projects" },
] as const;

export function VenturesTeaser() {
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
    <section className="px-6 md:px-12 lg:px-20 py-28 lg:py-40 border-t border-faint/20">
      <div className="max-w-screen-xl mx-auto">
        {/* Violet accent rule */}
        <motion.div
          {...(reduce
            ? {}
            : {
                initial: { scaleX: 0, originX: 0 },
                whileInView: { scaleX: 1 },
                viewport: { once: true, margin: "-80px" },
                transition: { duration: 0.9, ease: EASE },
              })}
          className="h-px w-16 bg-accent-violet mb-12"
          aria-hidden
        />

        <motion.p {...reveal(0)} className="font-display italic text-muted text-base mb-16">
          Ventures founded
        </motion.p>

        <div className="flex flex-col">
          {VENTURES.map((v, i) => (
            <motion.article
              key={v.name}
              {...reveal(i * 0.14)}
              className="group flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 py-10 border-t border-faint/20 first:border-t-0"
            >
              <span className="font-sans text-xs text-faint tracking-[0.1em] uppercase shrink-0 md:w-20 pt-2">
                {v.year}
              </span>

              <div className="flex-1">
                <h3 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] text-ink group-hover:text-accent-violet transition-colors duration-300 mb-3">
                  {v.name}
                </h3>
                <p className="font-sans text-sm text-muted">{v.type}</p>
                {/* PLACEHOLDER — owner to replace */}
                <p className="font-sans text-sm text-faint italic mt-3">Details to follow.</p>
              </div>

              <Link
                href={v.href}
                className="font-sans text-xs text-accent-violet hover:text-ink transition-colors duration-200 tracking-wide inline-flex items-center gap-1.5 group/link shrink-0 md:self-center"
              >
                View project
                <span
                  className="inline-block transition-transform duration-300 ease-out group-hover/link:translate-x-1"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div {...reveal(0.28)} className="mt-12">
          <Link
            href="/projects"
            className="font-sans text-sm text-accent-violet hover:text-ink transition-colors duration-200 tracking-wide inline-flex items-center gap-2 group"
          >
            All projects
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
