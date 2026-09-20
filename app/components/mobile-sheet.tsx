"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

type Props = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  background?: string;
};

/* Full-screen iOS-style sheet used on mobile in place of the desktop Window.
   Slides up from the bottom, closes via the back button or the swipe/tap
   backdrop area. Kept as a separate component from Window because the
   interaction pattern is different enough to warrant its own animation. */
export function MobileSheet({ title, onClose, children, background }: Props) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      initial={reduce ? { opacity: 0 } : { y: "100%" }}
      animate={reduce ? { opacity: 1 } : { y: 0 }}
      exit={reduce ? { opacity: 0 } : { y: "100%" }}
      transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}
      className="md:hidden absolute inset-0 z-50 flex flex-col"
      style={{ background: background ?? "var(--bg-elevated)" }}
    >
      {/* Header — iOS nav bar */}
      <div className="relative flex items-center px-3 pt-3 pb-2 border-b-[2px] border-ink/85 bg-white">
        <button
          type="button"
          onClick={onClose}
          className="font-sans text-[15px] font-medium text-accent-deep pl-1 pr-3 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 flex items-center gap-1"
          aria-label="Close"
        >
          <span aria-hidden className="text-[17px] leading-none">‹</span>
          <span>Home</span>
        </button>
        <p className="absolute left-1/2 -translate-x-1/2 font-sans text-[14px] font-semibold text-ink truncate max-w-[55%]">
          {title}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {children}
      </div>

      {/* Home indicator */}
      <div className="pb-2 pt-2 flex justify-center bg-white/70 backdrop-blur-sm border-t border-ink/10">
        <div className="w-32 h-1 rounded-full bg-ink/70" aria-hidden />
      </div>
    </motion.div>
  );
}
