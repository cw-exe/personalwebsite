"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";

const LINKS = [
  { href: "/about",      label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects",   label: "Projects" },
  { href: "/blog",       label: "Blog" },
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
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.6, delay: 0.05 },
          })}
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-bg/90 backdrop-blur-md border-b border-faint/30"
          : "bg-transparent",
      ].join(" ")}
    >
      <nav
        className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-20 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Wordmark */}
        <Link href="/" aria-label="Chin Wei Ling — home">
          <Image
            src="/Logo.jpg"
            alt="Chin Wei Ling"
            width={40}
            height={40}
            className="rounded-sm object-cover transition-opacity duration-300 hover:opacity-80"
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="font-sans text-sm text-muted hover:text-ink transition-colors duration-200 tracking-wide"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Theme toggle */}
        <ThemeToggle />
      </nav>
    </motion.header>
  );
}
