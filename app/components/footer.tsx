"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const NAV = [
  { href: "/about",      label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects",   label: "Projects" },
  { href: "/blog",       label: "Blog" },
] as const;

export function Footer() {
  const reduce = useReducedMotion();

  return (
    <motion.footer
      {...(reduce
        ? {}
        : {
            initial: { opacity: 0 },
            whileInView: { opacity: 1 },
            viewport: { once: true },
            transition: { duration: 0.6 },
          })}
      className="border-t border-faint/20 px-6 md:px-12 lg:px-20 py-12"
    >
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-wordmark text-base tracking-[0.12em] text-ink hover:text-accent transition-colors duration-300 w-fit"
          aria-label="Chin Wei Ling — home"
        >
          CWL
        </Link>

        {/* Nav links */}
        <ul className="flex flex-wrap gap-6 list-none m-0 p-0">
          {NAV.map(({ href, label }) => (
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

        {/* Contact + copyright */}
        <div className="flex flex-col gap-1 md:items-end">
          <a
            href="mailto:lingchinwei0306@gmail.com"
            className="font-sans text-sm text-accent hover:text-ink transition-colors duration-200 tracking-wide"
          >
            lingchinwei0306@gmail.com
          </a>
          <p className="font-sans text-xs text-faint">
            © {new Date().getFullYear()} Chin Wei Ling
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
