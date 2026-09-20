"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

type Props = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  accent?: string;
  background?: string;
};

/* Cartoon window shell — traffic lights, title bar, internal-scroll content. */
export function Window({ title, onClose, children, accent, background }: Props) {
  const reduce = useReducedMotion();

  // Close on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="hidden md:flex absolute inset-0 z-30 items-center justify-center p-3 sm:p-6 md:p-10">
      {/* Backdrop — transparent, click-to-close (wallpaper stays visible) */}
      <motion.button
        aria-label="Close window"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="absolute inset-0 bg-transparent"
      />

      {/* Window */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={reduce ? { opacity: 0 } : { scale: 0.7, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { scale: 0.85, opacity: 0, y: 30 }}
        transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 260, damping: 22, mass: 0.7 }}
        className="relative w-full max-w-3xl h-full max-h-[86vh] rounded-[22px] overflow-hidden border-[2.5px] border-ink/85 shadow-[0_30px_60px_-20px_rgba(26,37,64,0.45),0_10px_20px_-10px_rgba(26,37,64,0.25)]"
        style={{
          background: background ?? "var(--bg-elevated)",
          ...(accent
            ? { boxShadow: `0 30px 60px -20px rgba(26,37,64,0.45), 0 0 0 4px ${accent}22 inset` }
            : {}),
        }}
      >
        {/* Title bar */}
        <div className="relative h-11 border-b-[2.5px] border-ink/85 bg-white flex items-center px-4">
          {/* Traffic lights */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="group w-3.5 h-3.5 rounded-full bg-tl-red border-[1.5px] border-ink/70 hover:brightness-110 flex items-center justify-center"
            >
              <svg viewBox="0 0 8 8" className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden>
                <path d="M2 2l4 4M6 2l-4 4" stroke="#3b0000" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
            <span className="w-3.5 h-3.5 rounded-full bg-tl-yellow border-[1.5px] border-ink/70" aria-hidden />
            <span className="w-3.5 h-3.5 rounded-full bg-tl-green border-[1.5px] border-ink/70" aria-hidden />
          </div>

          {/* Title */}
          <p className="absolute left-1/2 -translate-x-1/2 font-sans text-[13px] font-semibold text-ink tracking-tight">
            {title}
          </p>
        </div>

        {/* Content */}
        <div className="window-scroll h-[calc(100%-2.75rem)]">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
