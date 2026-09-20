"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

export type ToastData = {
  id: number;
  app: string;
  title: string;
  message: string;
  emoji?: string;
};

/* macOS-style notification banner — slides in from top-right, auto-dismisses.
   Multiple toasts stack vertically. */
export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastData[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="fixed top-10 md:top-11 right-3 md:right-4 z-[60] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.id} data={t} onDismiss={() => onDismiss(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Toast({ data, onDismiss }: { data: ToastData; onDismiss: () => void }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = setTimeout(onDismiss, 3500);
    return () => clearTimeout(id);
  }, [onDismiss]);

  return (
    <motion.button
      type="button"
      onClick={onDismiss}
      layout
      initial={reduce ? { opacity: 0 } : { x: 380, opacity: 0 }}
      animate={reduce ? { opacity: 1 } : { x: 0, opacity: 1 }}
      exit={reduce ? { opacity: 0 } : { x: 380, opacity: 0 }}
      transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 320, damping: 28, mass: 0.7 }}
      className="pointer-events-auto w-[300px] md:w-[320px] text-left flex items-start gap-3 px-3.5 py-3 rounded-2xl bg-white/95 backdrop-blur-md border-[2px] border-ink/85 shadow-[0_18px_40px_-14px_rgba(26,37,64,0.4),0_6px_14px_-6px_rgba(26,37,64,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
      aria-live="polite"
    >
      <span
        className="shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-accent-butter/80 border-[1.5px] border-ink/70 text-lg"
        aria-hidden
      >
        {data.emoji ?? "⚠️"}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p className="font-sans text-[12px] font-semibold text-ink truncate">
            {data.app}
          </p>
          <span className="text-[10.5px] text-ink/55 tabular-nums">now</span>
        </div>
        <p className="font-sans text-[13.5px] font-semibold text-ink leading-tight mt-0.5">
          {data.title}
        </p>
        <p className="font-sans text-[12.5px] text-ink/75 leading-snug mt-0.5">
          {data.message}
        </p>
      </div>
    </motion.button>
  );
}
