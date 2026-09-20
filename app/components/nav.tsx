"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const LINKS = [
  { href: "/about",      label: "about" },
  { href: "/experience", label: "experience" },
  { href: "/projects",   label: "ventures" },
  { href: "/blog",       label: "writing" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      {...(reduce
        ? {}
        : {
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
            transition: { type: "spring", stiffness: 220, damping: 22, delay: 0.05 },
          })}
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-bg/85 backdrop-blur-md border-b border-hairline/70"
          : "bg-transparent",
      ].join(" ")}
    >
      <nav
        className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-16 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Wordmark — logo as sticker */}
        <Link
          href="/"
          aria-label="Chin Wei Ling — home"
          className="inline-flex items-center gap-2 group"
        >
          <span className="w-9 h-9 rounded-2xl overflow-hidden border-2 border-ink/10 shadow-[0_2px_6px_-2px_rgba(26,37,64,0.18)] transition-transform duration-300 group-hover:-rotate-6">
            <Image
              src="/Logo.jpg"
              alt=""
              width={44}
              height={44}
              className="w-full h-full object-cover"
            />
          </span>
          <span className="hidden sm:inline font-display font-semibold text-[0.95rem] tracking-tight text-ink">
            chin wei ling
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1.5 list-none m-0 p-0">
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="font-sans text-sm text-muted hover:text-ink px-3 py-1.5 rounded-full hover:bg-elevated hover:shadow-[0_2px_6px_-2px_rgba(26,37,64,0.14)] transition-all duration-200"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Contact CTA */}
        <a
          href="mailto:lingchinwei0306@gmail.com"
          className="inline-flex items-center gap-1.5 font-sans text-sm font-medium px-3.5 py-1.5 rounded-full bg-ink text-bg hover:bg-accent-deep transition-colors duration-200"
        >
          say hi
          <span aria-hidden>→</span>
        </a>
      </nav>
    </motion.header>
  );
}
