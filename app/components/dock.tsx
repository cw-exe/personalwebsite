"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import {
  IconAbout,
  IconExperience,
  IconVentures,
  IconWriting,
  IconContact,
  IconFinder,
  IconTrash,
} from "./app-icons";
import type { AppId } from "./apps";

/* Config of everything in the dock. Some entries open an app, some are decor. */
export const DOCK_ITEMS: Array<
  | { kind: "app"; id: AppId; label: string; Icon: React.FC<{ size?: number }> }
  | { kind: "sep" }
  | { kind: "action"; id: string; label: string; onClick: () => void; Icon: React.FC<{ size?: number }> }
> = [
  { kind: "app",    id: "finder",     label: "Finder",     Icon: IconFinder },
  { kind: "app",    id: "about",      label: "About Me",   Icon: IconAbout },
  { kind: "app",    id: "experience", label: "Experience", Icon: IconExperience },
  { kind: "app",    id: "ventures",   label: "Ventures",   Icon: IconVentures },
  { kind: "app",    id: "writing",    label: "Writing",    Icon: IconWriting },
  { kind: "app",    id: "contact",    label: "Contact",    Icon: IconContact },
  { kind: "sep" },
  { kind: "action", id: "trash",      label: "Trash",      Icon: IconTrash, onClick: () => {} },
];

export function Dock({
  activeApp,
  onOpen,
}: {
  activeApp: AppId | null;
  onOpen: (id: AppId) => void;
}) {
  const reduce = useReducedMotion();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={reduce ? false : { y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 22, delay: 0.15 }}
      className="hidden md:block absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-30"
    >
      <ul
        onMouseLeave={() => setHoverIndex(null)}
        className="flex items-end gap-1 md:gap-1.5 px-3 md:px-4 py-2 md:py-2.5 rounded-3xl bg-white/60 backdrop-blur-lg border-[2.5px] border-ink/12 shadow-[0_18px_40px_-14px_rgba(26,37,64,0.35),0_4px_10px_-4px_rgba(26,37,64,0.18)] list-none m-0"
        aria-label="Dock"
      >
        {DOCK_ITEMS.map((item, i) => {
          if (item.kind === "sep") {
            return (
              <li key={`sep-${i}`} className="self-center px-1">
                <span className="block w-px h-8 md:h-10 bg-ink/20 rounded-full" aria-hidden />
              </li>
            );
          }

          const isActive = item.kind === "app" && activeApp === item.id;

          // Magnification distance from hovered icon
          const dist =
            hoverIndex === null ? 3 : Math.abs(i - hoverIndex);
          const scale =
            reduce ? 1
            : dist === 0 ? 1.28
            : dist === 1 ? 1.14
            : dist === 2 ? 1.04
            : 1;
          const lift =
            reduce ? 0
            : dist === 0 ? -14
            : dist === 1 ? -6
            : dist === 2 ? -2
            : 0;

          const { Icon, label } = item;
          const handleClick =
            item.kind === "app"
              ? () => onOpen(item.id)
              : item.onClick;

          return (
            <li key={item.kind === "app" ? item.id : `action-${item.id}`} className="relative">
              <button
                type="button"
                onMouseEnter={() => setHoverIndex(i)}
                onFocus={() => setHoverIndex(i)}
                onBlur={() => setHoverIndex(null)}
                onClick={handleClick}
                aria-label={label}
                className="relative block focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-accent-deep/70 rounded-2xl"
              >
                <motion.div
                  animate={{ scale, y: lift }}
                  transition={{ type: "spring", stiffness: 380, damping: 24, mass: 0.6 }}
                  className="origin-bottom"
                >
                  <Icon size={54} />
                </motion.div>

                {/* Tooltip label on hover */}
                {hoverIndex === i && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-sans text-[11px] font-medium text-ink bg-white/95 border border-ink/15 px-2 py-0.5 rounded-md shadow-sm"
                  >
                    {label}
                  </motion.span>
                )}
              </button>

              {/* Active indicator dot */}
              {isActive && (
                <motion.span
                  layoutId="dock-active-dot"
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-ink"
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
