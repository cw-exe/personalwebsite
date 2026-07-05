"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Ambient colour orbs ────────────────────────────────────────────────── */
function Orbs() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none -z-10"
      aria-hidden
    >
      {/* Blue — top-left */}
      <motion.div
        animate={{ scale: [1, 1.06, 1], x: [0, 18, 0], y: [0, -12, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[700px] h-[700px] rounded-full bg-accent/[0.09] blur-[130px] -top-48 -left-36"
      />
      {/* Amber — mid-right */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], x: [0, -18, 0], y: [0, 25, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[550px] h-[550px] rounded-full bg-accent-warm/[0.10] blur-[110px] top-1/3 -right-32"
      />
      {/* Violet — bottom-centre */}
      <motion.div
        animate={{ scale: [1.04, 1, 1.04], y: [0, 20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[480px] h-[480px] rounded-full bg-accent-violet/[0.08] blur-[110px] -bottom-32 left-1/3"
      />
    </div>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────── */
export function Hero() {
  const reduce = useReducedMotion();

  const nameWords = ["CHIN", "WEI", "LING"];

  return (
    <section className="relative min-h-svh overflow-hidden">
      <Orbs />

      {/* Two-column grid — single col on mobile, split on desktop */}
      <div className="min-h-svh grid grid-cols-1 lg:grid-cols-[55%_45%]">

        {/* ── Left: text content ── */}
        <div className="flex flex-col justify-center px-6 md:px-12 lg:pl-20 lg:pr-8 pt-28 pb-24 z-10">

          {/* Name */}
          <h1 className="font-wordmark text-[clamp(3.5rem,10vw,6rem)] leading-[0.88] tracking-[-0.02em] text-ink mb-10 lg:mb-12">
            {nameWords.map((word, i) => (
              <span
                key={word}
                className="block sm:inline-block overflow-hidden sm:mr-[0.15em] align-bottom"
              >
                <motion.span
                  className="block sm:inline-block"
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { delay: 0.05 + i * 0.11, duration: 0.85, ease: EASE }
                  }
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Tagline */}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 50, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={
              reduce ? { duration: 0 } : { delay: 0.42, duration: 0.9, ease: EASE }
            }
            className="font-display italic text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.1] text-ink"
          >
            Leader, Builder, Founder.
          </motion.p>

          {/* Subtitle */}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduce ? { duration: 0 } : { delay: 0.6, duration: 0.7, ease: EASE }
            }
            className="font-sans text-xs tracking-[0.1em] uppercase text-muted mt-5"
          >
            Student · Universiti Kebangsaan Malaysia
          </motion.p>

          {/* Divider drawn in */}
          <motion.div
            initial={reduce ? false : { scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={
              reduce ? { duration: 0 } : { delay: 0.65, duration: 0.8, ease: EASE }
            }
            className="h-px w-24 bg-accent/50 mt-6"
            aria-hidden
          />

          {/* CTA */}
          <motion.a
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduce ? { duration: 0 } : { delay: 0.75, duration: 0.7, ease: EASE }
            }
            href="#about"
            className="font-sans text-sm text-accent tracking-wide mt-6 inline-flex items-center gap-2 group w-fit"
          >
            Explore my work
            <span
              className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-2"
              aria-hidden
            >
              →
            </span>
          </motion.a>
        </div>

        {/* ── Right: portrait (desktop only) ── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={
            reduce ? { duration: 0 } : { delay: 0.25, duration: 1.2, ease: EASE }
          }
          className="hidden lg:flex items-end justify-center"
          style={{ perspective: "1200px" }}
        >
          {/* Floating wrapper */}
          <motion.div
            animate={reduce ? {} : { y: [0, -18, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ rotateY: -2 }}
          >
            <Image
              src="/HeroPic.png"
              alt="Portrait of Chin Wei Ling"
              width={1080}
              height={1350}
              priority
              style={{
                height: "88svh",
                width: "auto",
                display: "block",
                filter: [
                  "drop-shadow(0 80px 120px oklch(72% 0.118 255 / 0.50))",
                  "drop-shadow(0 20px 60px oklch(72% 0.118 255 / 0.28))",
                  "drop-shadow(0 0 100px oklch(64% 0.22 295 / 0.18))",
                ].join(" "),
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll cue ── */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduce ? { duration: 0 } : { delay: 1.3, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        aria-hidden
      >
        <span className="font-sans text-[0.6rem] tracking-[0.14em] uppercase text-faint">
          Scroll
        </span>
        <motion.div
          animate={{ scaleY: [1, 0.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-accent/50 origin-top"
        />
      </motion.div>
    </section>
  );
}
