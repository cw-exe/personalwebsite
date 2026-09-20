"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Wallpaper } from "./wallpaper";
import { HeroPanel } from "./hero-panel";
import { MenuBar } from "./menu-bar";
import { Dock } from "./dock";
import { Window } from "./window";
import { PhoneHome } from "./phone-home";
import { MobileSheet } from "./mobile-sheet";
import { ToastStack, type ToastData } from "./toast";
import {
  APP_COMPONENTS,
  APP_TITLES,
  APP_ACCENTS,
  APP_WINDOW_BG,
  type AppId,
} from "./apps";
import { desktopShortcuts } from "../content/site";

/* URL ↔ app mapping. Finder has no shareable URL (welcome dialog). */
const PATH_BY_APP: Partial<Record<AppId, string>> = {
  about:      "/about",
  experience: "/experience",
  ventures:   "/projects",
  writing:    "/blog",
  contact:    "/contact",
};
const APP_BY_PATH: Record<string, AppId | null> = {
  "/":            null,
  "/about":       "about",
  "/experience":  "experience",
  "/projects":    "ventures",
  "/blog":        "writing",
  "/contact":     "contact",
};


export function Desktop({ initialApp = null }: { initialApp?: AppId | null }) {
  const reduce = useReducedMotion();
  const [openApp, setOpenApp] = useState<AppId | null>(initialApp);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const pushToast = (t: Omit<ToastData, "id">) => {
    setToasts((prev) => [...prev, { ...t, id: Date.now() + Math.random() }]);
  };
  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const AppComponent = openApp ? APP_COMPONENTS[openApp] : null;
  const activeTitle = openApp ? APP_TITLES[openApp] : null;
  const activeAccent = openApp ? APP_ACCENTS[openApp] : undefined;
  const activeBg = openApp ? APP_WINDOW_BG[openApp] : undefined;

  /* Keep the URL in sync with the open app, so /about, /experience, etc. are
     shareable deep-links. Uses history API directly to avoid triggering a
     Next.js re-render — this is a pure cosmetic URL update. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const path =
      openApp && openApp !== "finder" ? PATH_BY_APP[openApp] ?? "/" : "/";
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
  }, [openApp]);

  /* Listen for browser back/forward and re-open the matching app. */
  useEffect(() => {
    const onPop = () => {
      setOpenApp(APP_BY_PATH[window.location.pathname] ?? null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const handleShortcut = (target: string) => {
    if (target === "resume") {
      pushToast({
        app: "Finder",
        title: "resume.pdf",
        message: "coming soon — not published yet.",
        emoji: "📃",
      });
      return;
    }
    setOpenApp(target as AppId);
  };

  const closeApp = () => setOpenApp(null);

  return (
    <div className="fixed inset-0 overflow-hidden select-none">
      <Wallpaper />

      {/* Desktop-only chrome (hidden below md via each component) */}
      <HeroPanel />
      <MenuBar activeApp={activeTitle} />

      {/* Desktop shortcuts */}
      <ul className="hidden md:block absolute inset-0 pointer-events-none list-none m-0 p-0" aria-label="Desktop shortcuts">
        {desktopShortcuts.map((s, i) => (
          <li
            key={s.label}
            className="absolute"
            style={{ top: s.y, left: s.x, transform: `rotate(${s.rotate}deg)` }}
          >
            <motion.button
              type="button"
              onDoubleClick={() => handleShortcut(s.target)}
              onClick={() => handleShortcut(s.target)}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0 } : { delay: 0.25 + i * 0.06, duration: 0.4, ease: "easeOut" }}
              whileHover={reduce ? {} : { y: -3 }}
              whileTap={reduce ? {} : { scale: 0.95 }}
              className="pointer-events-auto flex flex-col items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/60 rounded-lg p-1"
              aria-label={`Open ${s.label}`}
            >
              <span className="text-3xl md:text-4xl drop-shadow-sm" aria-hidden>{s.emoji}</span>
              <span className="font-sans text-[11.5px] font-medium text-ink bg-white/70 backdrop-blur-sm rounded px-1.5 py-0.5 border border-ink/15">
                {s.label}
              </span>
            </motion.button>
          </li>
        ))}
      </ul>

      {/* Mobile home screen (hidden md+ via its root class) */}
      <PhoneHome onOpen={setOpenApp} />

      {/* Desktop window overlay */}
      <AnimatePresence mode="wait">
        {openApp && AppComponent && activeTitle && (
          <Window
            key={`win-${openApp}`}
            title={activeTitle}
            onClose={closeApp}
            accent={activeAccent}
            background={activeBg}
          >
            <AppComponent />
          </Window>
        )}
      </AnimatePresence>

      {/* Mobile full-screen sheet (hidden md+ via its root class) */}
      <AnimatePresence mode="wait">
        {openApp && AppComponent && activeTitle && (
          <MobileSheet
            key={`sheet-${openApp}`}
            title={activeTitle}
            onClose={closeApp}
            background={activeBg}
          >
            <AppComponent />
          </MobileSheet>
        )}
      </AnimatePresence>

      {/* Dock */}
      <Dock activeApp={openApp} onOpen={setOpenApp} />

      {/* Notification toasts */}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
