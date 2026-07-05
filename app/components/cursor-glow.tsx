"use client";

import { useEffect } from "react";

/**
 * Tracks cursor position and updates CSS custom properties on <body>:
 *   --glow-x, --glow-y  — lerped position (smooth follow)
 *   --glow-hue          — hue derived from X position (blue → violet → amber)
 *
 * The body's background-image consumes these to create a cursor-reactive
 * colour bloom in the background layer — no overlay, no z-index stacking.
 */
export function CursorGlow() {
  useEffect(() => {
    /* Only on pointer-fine devices (mouse, trackpad) */
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targetX = -600;
    let targetY = -600;
    let currentX = -600;
    let currentY = -600;
    let rafId: number;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const tick = () => {
      currentX = lerp(currentX, targetX, 0.07);
      currentY = lerp(currentY, targetY, 0.07);

      /* Hue shifts across X: blue (255) → violet (295) → warm amber (55 ÷ 360 via 395) */
      const xRatio = Math.max(0, Math.min(1, currentX / window.innerWidth));
      const hue = Math.round(255 + xRatio * 60); // 255 → 315

      document.body.style.setProperty("--glow-x", `${currentX}px`);
      document.body.style.setProperty("--glow-y", `${currentY}px`);
      document.body.style.setProperty("--glow-hue", `${hue}`);

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      /* Reset so it doesn't linger when effect cleans up */
      document.body.style.removeProperty("--glow-x");
      document.body.style.removeProperty("--glow-y");
      document.body.style.removeProperty("--glow-hue");
    };
  }, []);

  return null;
}
