"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { hero, TINT_HIGHLIGHT_CLASS } from "../content/site";

/* Hero on the desktop wallpaper — polaroid portrait + name/description card.
   Sits above the SVG wallpaper, below dock/windows. */
export function HeroPanel() {
  const reduce = useReducedMotion();

  return (
    <div
      className="hidden md:flex absolute inset-0 z-10 pointer-events-none items-center justify-center px-4 md:px-8"
      aria-hidden={false}
    >
      <div className="pointer-events-auto flex flex-col md:flex-row items-center gap-6 md:gap-10 max-w-4xl w-full md:pl-24 lg:pl-32">

        {/* ── Polaroid portrait ── */}
        <motion.figure
          initial={reduce ? false : { opacity: 0, y: 20, rotate: -8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, rotate: -4, scale: 1 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 20, delay: 0.15 }}
          className="relative shrink-0 bg-white p-3 pb-10 border-[2.5px] border-ink/85 rounded-md shadow-[0_18px_40px_-16px_rgba(26,37,64,0.45),0_6px_14px_-6px_rgba(26,37,64,0.25)]"
          style={{ transformOrigin: "center" }}
        >
          <span
            className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-[-6deg] w-20 h-5 bg-accent-butter/80 border border-ink/25"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}
            aria-hidden
          />

          <div className="relative w-44 h-56 md:w-52 md:h-64 rounded-sm overflow-hidden bg-tinted">
            <Image
              src={hero.portraitSrc}
              alt={hero.name}
              fill
              sizes="(min-width: 768px) 208px, 176px"
              priority
              className="object-cover object-top"
            />
          </div>
          <figcaption className="absolute bottom-2 left-0 right-0 text-center font-display italic text-[12.5px] text-ink/70">
            {hero.polaroidCaption}
          </figcaption>
        </motion.figure>

        {/* ── Text block ── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 22, delay: 0.28 }}
          className="text-center md:text-left max-w-md"
        >
          <p className="font-display text-[13px] font-medium text-ink/70 dark:text-white/75 tracking-wide">
            {hero.greeting}
            <span className="inline-block ml-1" aria-hidden>{hero.greetingEmoji}</span>
          </p>

          <h1 className="font-wordmark font-semibold text-[clamp(2.75rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.01em] text-ink dark:text-white mt-1">
            {hero.name}
          </h1>

          <p className="font-display text-[clamp(1.05rem,1.6vw,1.4rem)] text-ink dark:text-white mt-3">
            {hero.taglineWords.map((word, i) => (
              <span key={word.text}>
                <span className="relative inline-block">
                  <span className="relative z-10">{word.text}</span>
                  <span
                    className={`absolute left-0 right-0 bottom-0.5 h-2 z-0 rounded-full ${TINT_HIGHLIGHT_CLASS[word.tint]}`}
                    aria-hidden
                  />
                </span>
                {i < hero.taglineWords.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>

          <p className="font-sans text-[14px] md:text-[15px] text-ink/85 dark:text-white/80 mt-3 leading-relaxed">
            {hero.bio}
          </p>

          <p className="font-sans text-[12.5px] text-ink/60 dark:text-white/65 mt-4 inline-flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-deep dark:bg-accent-butter animate-pulse" aria-hidden />
            {hero.ctaHint}
            <span aria-hidden>↓</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
