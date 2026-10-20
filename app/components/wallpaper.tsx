"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type Transition,
} from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

/* Cartoon wallpaper — day sky by default; starry night when dark theme.
   Sun & moon share a vertical orbit: the sun sinks below the horizon while
   the moon drops in from above, cross-fading sky, hills, clouds, and
   nocturnal details (stars + fireflies swap in for birds). */

const NAVY = "#1A2540";
const NIGHT_STROKE = "#0A1128";

/* Shared timing so every element crosses at the same moment */
const ORBIT_DUR = 1.4;
const ORBIT_EASE = [0.6, 0, 0.4, 1] as const;

export function Wallpaper() {
  const reduce = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isNight = mounted && resolvedTheme === "dark";

  const orbit = reduce
    ? { duration: 0 }
    : { duration: ORBIT_DUR, ease: ORBIT_EASE };
  const fade = reduce
    ? { duration: 0 }
    : { duration: ORBIT_DUR, ease: "easeInOut" as const };
  const nocturnalIn = reduce
    ? { duration: 0 }
    : { duration: 1.0, ease: "easeOut" as const, delay: isNight ? 0.35 : 0 };
  const birdOut = reduce
    ? { duration: 0 }
    : { duration: 0.7, ease: "easeOut" as const, delay: isNight ? 0 : 0.5 };

  /* Track cursor in the SVG's viewBox coordinate space so decorative critters
     (birds, fireflies) can react no matter what overlays sit above them. */
  const svgRef = useRef<SVGSVGElement>(null);
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  useEffect(() => {
    if (reduce) return;
    const handleMove = (e: MouseEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      /* preserveAspectRatio="xMidYMid slice" → scale = max(w/1600, h/900),
         then the viewBox is centered and clipped. */
      const scale = Math.max(rect.width / 1600, rect.height / 900);
      const offsetX = (rect.width  - 1600 * scale) / 2;
      const offsetY = (rect.height -  900 * scale) / 2;
      mouseX.set((e.clientX - rect.left - offsetX) / scale);
      mouseY.set((e.clientY - rect.top  - offsetY) / scale);
    };
    const handleLeave = () => {
      mouseX.set(-9999);
      mouseY.set(-9999);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, [reduce, mouseX, mouseY]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <svg
        ref={svgRef}
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="sky-day" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8FC0FF" />
            <stop offset="55%"  stopColor="#BFDBFF" />
            <stop offset="100%" stopColor="#E8F2FF" />
          </linearGradient>
          <linearGradient id="sky-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0A0F26" />
            <stop offset="55%"  stopColor="#1B2350" />
            <stop offset="100%" stopColor="#3A4A82" />
          </linearGradient>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#FFE7A8" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FFE7A8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFE7A8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#E8F2FF" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#E8F2FF" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#E8F2FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky — day base + night crossfade on top */}
        <rect width="1600" height="900" fill="url(#sky-day)" />
        <motion.rect
          width="1600" height="900" fill="url(#sky-night)"
          initial={false}
          animate={{ opacity: isNight ? 1 : 0 }}
          transition={fade}
        />

        {/* Stars — always mounted, fade in once night settles */}
        <motion.g
          fill="#F5F9FF"
          initial={false}
          animate={{ opacity: isNight ? 1 : 0 }}
          transition={nocturnalIn}
        >
          {STARS.map((s, i) => (
            <motion.circle
              key={i}
              cx={s.x} cy={s.y} r={s.r}
              initial={{ opacity: s.o }}
              animate={reduce ? { opacity: s.o } : { opacity: [s.o, s.o * 0.35, s.o] }}
              transition={reduce ? { duration: 0 } : { duration: 3 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: (i % 5) * 0.4 }}
            />
          ))}
          <g stroke="#F5F9FF" strokeWidth="1.5" strokeLinecap="round">
            <path d="M180 140 v10 M175 145 h10" opacity="0.85" />
            <path d="M1120 90 v8 M1116 94 h8" opacity="0.7" />
            <path d="M700 60 v10 M695 65 h10" opacity="0.9" />
          </g>
        </motion.g>

        {/* Sun — orbits down below the horizon when night falls */}
        <motion.g
          initial={false}
          animate={{ y: isNight ? 820 : 0, opacity: isNight ? 0 : 1 }}
          transition={orbit}
        >
          {/* Glow gently pulses */}
          <motion.circle
            cx="1360" cy="180" r="240" fill="url(#sunGlow)"
            animate={reduce ? undefined : { scale: [1, 1.06, 1], opacity: [1, 0.85, 1] }}
            transition={reduce ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "1360px 180px" }}
          />
          {/* Rays sway gently back and forth instead of spinning */}
          <motion.g
            animate={reduce ? undefined : { rotate: [-4, 4, -4] }}
            transition={reduce ? undefined : { duration: 12, ease: "easeInOut", repeat: Infinity }}
            style={{ transformOrigin: "1360px 180px" }}
          >
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const r1 = 92, r2 = 128;
              const x1 = 1360 + Math.cos(angle) * r1;
              const y1 = 180  + Math.sin(angle) * r1;
              const x2 = 1360 + Math.cos(angle) * r2;
              const y2 = 180  + Math.sin(angle) * r2;
              return (
                <line
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={NAVY} strokeWidth="6" strokeLinecap="round"
                />
              );
            })}
          </motion.g>
          {/* Face — static, symmetric dot eyes + smile */}
          <g>
            <circle cx="1360" cy="180" r="76" fill="#FFDF80" stroke={NAVY} strokeWidth="5" />
            {/* Eyes blink together every few seconds */}
            <motion.g
              animate={reduce ? undefined : { scaleY: [1, 1, 0.1, 1, 1] }}
              transition={reduce ? undefined : { duration: 4.5, times: [0, 0.94, 0.97, 1, 1], repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "1360px 168px" }}
            >
              <circle cx="1342" cy="168" r="4" fill={NAVY} />
              <circle cx="1378" cy="168" r="4" fill={NAVY} />
            </motion.g>
            {/* Cheeks */}
            <circle cx="1330" cy="196" r="6" fill="#FFB4A2" opacity="0.75" />
            <circle cx="1390" cy="196" r="6" fill="#FFB4A2" opacity="0.75" />
            {/* Symmetric smile */}
            <path
              d="M1344 200 q16 14 32 0"
              stroke={NAVY} strokeWidth="4" strokeLinecap="round" fill="none"
            />
          </g>
        </motion.g>

        {/* Moon — rises down from above, comes to rest at the sun's spot */}
        <motion.g
          initial={false}
          animate={{ y: isNight ? 0 : -560, opacity: isNight ? 1 : 0 }}
          transition={orbit}
        >
          <motion.circle
            cx="1360" cy="180" r="240" fill="url(#moonGlow)"
            animate={reduce ? undefined : { scale: [1, 1.05, 1], opacity: [1, 0.8, 1] }}
            transition={reduce ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "1360px 180px" }}
          />
          <circle cx="1360" cy="180" r="76" fill="#F1E8CF" stroke={NIGHT_STROKE} strokeWidth="5" />
          {/* craters — kept subtle */}
          <circle cx="1326" cy="152" r="7" fill="#D9CDA8" stroke={NIGHT_STROKE} strokeWidth="2" />
          <circle cx="1392" cy="212" r="5" fill="#D9CDA8" stroke={NIGHT_STROKE} strokeWidth="2" />
          <circle cx="1400" cy="158" r="3" fill="#D9CDA8" stroke={NIGHT_STROKE} strokeWidth="2" />
          {/* sleepy closed eyes — symmetric arcs */}
          <path
            d="M1336 176 q6 6 12 0 M1372 176 q6 6 12 0"
            stroke={NIGHT_STROKE} strokeWidth="3.5" strokeLinecap="round" fill="none"
          />
          {/* Cheeks */}
          <circle cx="1330" cy="196" r="5.5" fill="#FFB4A2" opacity="0.55" />
          <circle cx="1390" cy="196" r="5.5" fill="#FFB4A2" opacity="0.55" />
          {/* Little "o" mouth — asleep */}
          <ellipse cx="1360" cy="208" rx="5" ry="4" fill={NIGHT_STROKE} opacity="0.75" />
        </motion.g>

        {/* Birds — perched in the sky during day; startle & dart away when the
            cursor gets close (see Bird component). */}
        <motion.g
          initial={false}
          animate={{ opacity: isNight ? 0 : 1 }}
          transition={birdOut}
        >
          {BIRDS.map((b, i) => (
            <Bird
              key={i}
              anchorX={b.x}
              anchorY={b.y}
              width={b.w}
              mouseX={mouseX}
              mouseY={mouseY}
              reduce={!!reduce}
              flapPhase={i * 0.12}
            />
          ))}
        </motion.g>

        {/* Shooting star — night only, streaks across occasionally */}
        <motion.g
          initial={false}
          animate={{ opacity: isNight ? 1 : 0 }}
          transition={nocturnalIn}
        >
          <motion.g
            animate={reduce ? undefined : { x: [0, 900], y: [0, 260], opacity: [0, 1, 1, 0] }}
            transition={reduce ? undefined : {
              duration: 1.8,
              times: [0, 0.15, 0.85, 1],
              repeat: Infinity,
              repeatDelay: 9,
              ease: "easeOut",
            }}
          >
            <g transform="translate(120 90)">
              <line x1="0" y1="0" x2="-70" y2="-20" stroke="#F5F9FF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
              <line x1="0" y1="0" x2="-40" y2="-12" stroke="#FFE7A8" strokeWidth="3" strokeLinecap="round" />
              <circle cx="0" cy="0" r="3" fill="#FFE7A8" />
            </g>
          </motion.g>
        </motion.g>

        {/* Clouds — cursor acts like a gust of wind pushing each cloud away.
            Idle drift is kept as the inner layer. */}
        {CLOUDS.map((c, i) => (
          <ReactiveCloud
            key={i}
            cx={c.cx}
            cy={c.cy}
            scale={c.scale}
            driftAmp={c.driftAmp}
            driftDur={c.driftDur}
            isNight={isNight}
            fade={fade}
            mouseX={mouseX}
            mouseY={mouseY}
            reduce={!!reduce}
          />
        ))}

        {/* Back hill — colors interpolate through dusk */}
        <motion.path
          d="M-40 720 Q 260 560 620 660 T 1240 640 T 1640 700 L 1640 940 L -40 940 Z"
          initial={false}
          animate={{
            fill: isNight ? "#3E6553" : "#8FCFB0",
            stroke: isNight ? NIGHT_STROKE : NAVY,
          }}
          transition={fade}
          strokeWidth="4" strokeLinejoin="round"
        />

        {/* Front hill */}
        <motion.path
          d="M-40 820 Q 320 700 700 780 T 1300 760 T 1640 810 L 1640 940 L -40 940 Z"
          initial={false}
          animate={{
            fill: isNight ? "#4E7C68" : "#A8E0C7",
            stroke: isNight ? NIGHT_STROKE : NAVY,
          }}
          transition={fade}
          strokeWidth="4" strokeLinejoin="round"
        />

        {/* Grass tufts — idle sway + bend away from the cursor when it sweeps
            overhead (see GrassTuft). */}
        <g stroke={NAVY} strokeWidth="3" strokeLinecap="round" fill="none">
          {GRASS_TUFTS.map((tuft, i) => (
            <GrassTuft
              key={i}
              d={tuft.d}
              originX={tuft.originX}
              originY={tuft.originY}
              phase={i}
              mouseX={mouseX}
              mouseY={mouseY}
              reduce={!!reduce}
            />
          ))}
        </g>

        {/* Flowers — heads bob in the breeze */}
        <motion.g
          animate={reduce ? undefined : { rotate: [-6, 6, -6] }}
          transition={reduce ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "400px 810px" }}
        >
          <g transform="translate(400 792)">
            <circle cx="0" cy="0" r="6" fill="#FFB4A2" stroke={NAVY} strokeWidth="3" />
            <path d="M0 8 v18" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
          </g>
        </motion.g>
        <motion.g
          animate={reduce ? undefined : { rotate: [5, -5, 5] }}
          transition={reduce ? undefined : { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          style={{ transformOrigin: "1080px 810px" }}
        >
          <g transform="translate(1080 794)">
            <circle cx="0" cy="0" r="6" fill="#FFDF80" stroke={NAVY} strokeWidth="3" />
            <path d="M0 8 v14" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
          </g>
        </motion.g>
        {/* Extra flower for a little more life */}
        <motion.g
          animate={reduce ? undefined : { rotate: [-7, 7, -7] }}
          transition={reduce ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          style={{ transformOrigin: "760px 802px" }}
        >
          <g transform="translate(760 784)">
            <circle cx="0" cy="0" r="5" fill="#C8B3FF" stroke={NAVY} strokeWidth="3" />
            <path d="M0 7 v14" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
          </g>
        </motion.g>

        {/* Fireflies — fade in over the hills at night */}
        <motion.g
          fill="#FFDF80"
          initial={false}
          animate={{ opacity: isNight ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 1.0, ease: "easeOut", delay: isNight ? 0.45 : 0 }}
        >
          {FIREFLIES.map((f, i) => (
            <Firefly
              key={i}
              anchorX={f.x}
              anchorY={f.y}
              mouseX={mouseX}
              mouseY={mouseY}
              phase={i}
              reduce={!!reduce}
            />
          ))}
        </motion.g>
      </svg>
    </div>
  );
}

/* Star field — scattered across the upper sky */
const STARS = [
  { x: 60,   y: 80,  r: 1.6, o: 0.85 },
  { x: 140,  y: 200, r: 1.2, o: 0.7  },
  { x: 260,  y: 100, r: 1.8, o: 0.9  },
  { x: 360,  y: 180, r: 1.4, o: 0.75 },
  { x: 460,  y: 260, r: 1.2, o: 0.65 },
  { x: 560,  y: 40,  r: 1.5, o: 0.8  },
  { x: 640,  y: 220, r: 1.3, o: 0.7  },
  { x: 760,  y: 100, r: 1.7, o: 0.85 },
  { x: 860,  y: 260, r: 1.2, o: 0.7  },
  { x: 940,  y: 60,  r: 1.4, o: 0.8  },
  { x: 1020, y: 320, r: 1.3, o: 0.65 },
  { x: 1120, y: 150, r: 1.5, o: 0.75 },
  { x: 1200, y: 260, r: 1.2, o: 0.7  },
  { x: 1260, y: 60,  r: 1.6, o: 0.85 },
  { x: 1440, y: 320, r: 1.4, o: 0.75 },
  { x: 1520, y: 80,  r: 1.5, o: 0.8  },
  { x: 80,   y: 380, r: 1.2, o: 0.55 },
  { x: 400,  y: 380, r: 1.2, o: 0.55 },
  { x: 880,  y: 420, r: 1.2, o: 0.55 },
  { x: 1180, y: 400, r: 1.2, o: 0.55 },
] as const;

/* Grass tufts — d is the 3-blade path, origin is the base for sway rotation */
const GRASS_TUFTS = [
  { d: "M180 802 v-14 M188 800 v-10 M172 800 v-8",     originX: 180,  originY: 802 },
  { d: "M540 786 v-14 M548 784 v-10 M532 784 v-8",     originX: 540,  originY: 786 },
  { d: "M960 776 v-14 M968 774 v-10 M952 774 v-8",     originX: 960,  originY: 776 },
  { d: "M1220 780 v-14 M1228 778 v-10 M1212 778 v-8",  originX: 1220, originY: 780 },
] as const;

/* Fireflies — hovering above the front hill */
const FIREFLIES = [
  { x: 280,  y: 760 },
  { x: 620,  y: 740 },
  { x: 820,  y: 770 },
  { x: 1180, y: 745 },
  { x: 1380, y: 765 },
] as const;

/* Birds — anchor point + wingspan; startle away from the cursor when close. */
const BIRDS = [
  { x: 240, y: 220, w: 22 },
  { x: 310, y: 260, w: 18 },
  { x: 180, y: 250, w: 16 },
] as const;

/* Clouds — center, scale, and idle-drift parameters */
const CLOUDS = [
  { cx: 220,  cy: 340, scale: 1.05, driftAmp:  30, driftDur: 24 },
  { cx: 780,  cy: 200, scale: 0.85, driftAmp: -22, driftDur: 28 },
  { cx: 1080, cy: 410, scale: 0.95, driftAmp:  18, driftDur: 32 },
  { cx: 500,  cy: 130, scale: 0.70, driftAmp: -14, driftDur: 26 },
] as const;

/* Reactive bird — dodges away from the cursor within its "scare radius",
   flaps faster while spooked. Uses useTransform so nothing re-renders. */
function Bird({
  anchorX,
  anchorY,
  width,
  mouseX,
  mouseY,
  reduce,
  flapPhase,
}: {
  anchorX: number;
  anchorY: number;
  width: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  reduce: boolean;
  flapPhase: number;
}) {
  const SCARE_R = 220;
  /* Displacement away from cursor, easing out beyond SCARE_R. */
  const dx = useTransform([mouseX, mouseY], (v) => {
    const [mx, my] = v as [number, number];
    const ddx = anchorX - mx;
    const ddy = anchorY - my;
    const dist = Math.hypot(ddx, ddy);
    if (dist > SCARE_R || dist === 0) return 0;
    const power = 1 - dist / SCARE_R;
    return (ddx / dist) * power * 80;
  });
  const dy = useTransform([mouseX, mouseY], (v) => {
    const [mx, my] = v as [number, number];
    const ddx = anchorX - mx;
    const ddy = anchorY - my;
    const dist = Math.hypot(ddx, ddy);
    if (dist > SCARE_R || dist === 0) return 0;
    const power = 1 - dist / SCARE_R;
    /* Lift extra so it looks like the bird startles upward */
    return (ddy / dist) * power * 50 - power * 25;
  });
  /* Slight tilt toward the flight direction */
  const rotate = useTransform([mouseX, mouseY], (v) => {
    const [mx, my] = v as [number, number];
    const ddx = anchorX - mx;
    const ddy = anchorY - my;
    const dist = Math.hypot(ddx, ddy);
    if (dist > SCARE_R || dist === 0) return 0;
    const power = 1 - dist / SCARE_R;
    return (ddx / dist) * power * 14;
  });

  const w = width;
  const openPath  = `M0 0 q${w * 0.45} -${w * 0.7} ${w} 0 q${w * 0.45} -${w * 0.7} ${w} 0`;
  const closePath = `M0 0 q${w * 0.45} -${w * 0.2} ${w} 0 q${w * 0.45} -${w * 0.2} ${w} 0`;

  return (
    <motion.g
      style={{ x: dx, y: dy, rotate }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      <motion.path
        d={openPath}
        transform={`translate(${anchorX} ${anchorY})`}
        stroke={NAVY}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
        animate={reduce ? undefined : { d: [openPath, closePath, openPath] }}
        transition={reduce ? undefined : {
          duration: 0.55,
          repeat: Infinity,
          ease: "easeInOut",
          delay: flapPhase,
        }}
      />
    </motion.g>
  );
}

/* Firefly — bobs on its own; scatters slightly if the cursor gets close. */
function Firefly({
  anchorX,
  anchorY,
  mouseX,
  mouseY,
  phase,
  reduce,
}: {
  anchorX: number;
  anchorY: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  phase: number;
  reduce: boolean;
}) {
  const SCARE_R = 140;
  const dx = useTransform([mouseX, mouseY], (v) => {
    const [mx, my] = v as [number, number];
    const ddx = anchorX - mx;
    const ddy = anchorY - my;
    const dist = Math.hypot(ddx, ddy);
    if (dist > SCARE_R || dist === 0) return 0;
    const power = 1 - dist / SCARE_R;
    return (ddx / dist) * power * 50;
  });
  const dy = useTransform([mouseX, mouseY], (v) => {
    const [mx, my] = v as [number, number];
    const ddx = anchorX - mx;
    const ddy = anchorY - my;
    const dist = Math.hypot(ddx, ddy);
    if (dist > SCARE_R || dist === 0) return 0;
    const power = 1 - dist / SCARE_R;
    return (ddy / dist) * power * 40 - power * 15;
  });

  return (
    <motion.g
      style={{ x: dx, y: dy }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.circle
        cx={anchorX}
        cy={anchorY}
        r="2.5"
        initial={{ opacity: 0.3 }}
        animate={reduce ? { opacity: 0.6 } : { opacity: [0.2, 0.95, 0.2], y: [0, -10, 0] }}
        transition={reduce ? { duration: 0 } : {
          duration: 2.6 + (phase % 3) * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: (phase % 4) * 0.3,
        }}
      />
    </motion.g>
  );
}

/* Cloud — 3-lobe blob outline; fill/stroke cross-fade with theme */
function Cloud({
  cx,
  cy,
  scale = 1,
  isNight,
  fade,
}: {
  cx: number;
  cy: number;
  scale?: number;
  isNight: boolean;
  fade: Transition;
}) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <motion.g
        initial={false}
        animate={{ opacity: isNight ? 0.55 : 1 }}
        transition={fade}
      >
        <motion.path
          d="M-70 10
             q-4 -30 26 -32
             q4 -22 30 -22
             q10 -18 34 -14
             q22 -12 40 8
             q26 -6 30 22
             q22 4 20 24
             q-2 20 -26 22
             l-124 0
             q-28 0 -30 -8 Z"
          initial={false}
          animate={{
            fill: isNight ? "#4A5A85" : "#FFFFFF",
            stroke: isNight ? NIGHT_STROKE : NAVY,
          }}
          transition={fade}
          strokeWidth={4}
          strokeLinejoin="round"
        />
      </motion.g>
    </g>
  );
}

/* ReactiveCloud — wraps Cloud with two layers:
   - outer: cursor-reactive push (like wind), plus a soft squish scaleX
   - inner: continuous horizontal drift loop (unchanged idle motion)      */
function ReactiveCloud({
  cx,
  cy,
  scale,
  driftAmp,
  driftDur,
  isNight,
  fade,
  mouseX,
  mouseY,
  reduce,
}: {
  cx: number;
  cy: number;
  scale: number;
  driftAmp: number;
  driftDur: number;
  isNight: boolean;
  fade: Transition;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  reduce: boolean;
}) {
  const PUSH_R = 320;
  const pushX = useTransform([mouseX, mouseY], (v) => {
    const [mx, my] = v as [number, number];
    const ddx = cx - mx;
    const ddy = cy - my;
    const dist = Math.hypot(ddx, ddy);
    if (dist > PUSH_R || dist === 0) return 0;
    const power = 1 - dist / PUSH_R;
    /* Soft horizontal drift — clouds ease away in a gentle breeze */
    return (ddx / dist) * power * 40;
  });
  const pushY = useTransform([mouseX, mouseY], (v) => {
    const [mx, my] = v as [number, number];
    const ddx = cx - mx;
    const ddy = cy - my;
    const dist = Math.hypot(ddx, ddy);
    if (dist > PUSH_R || dist === 0) return 0;
    const power = 1 - dist / PUSH_R;
    return (ddy / dist) * power * 12;
  });
  /* Barely-there squish — feels puffy without wobbling */
  const squish = useTransform([mouseX, mouseY], (v) => {
    const [mx, my] = v as [number, number];
    const dist = Math.hypot(cx - mx, cy - my);
    if (dist > PUSH_R) return 1;
    const power = 1 - dist / PUSH_R;
    return 1 + power * 0.035;
  });

  return (
    <motion.g
      style={{ x: pushX, y: pushY, scaleX: squish }}
      transition={{ type: "spring", stiffness: 35, damping: 24, mass: 2.4 }}
    >
      <motion.g
        animate={reduce ? undefined : { x: [0, driftAmp, 0] }}
        transition={reduce ? undefined : { duration: driftDur, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cloud cx={cx} cy={cy} scale={scale} isNight={isNight} fade={fade} />
      </motion.g>
    </motion.g>
  );
}

/* GrassTuft — idle sway + reactive bend AWAY from the cursor. Two nested
   motion.g layers so the two rotations compose cleanly. */
function GrassTuft({
  d,
  originX,
  originY,
  phase,
  mouseX,
  mouseY,
  reduce,
}: {
  d: string;
  originX: number;
  originY: number;
  phase: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  reduce: boolean;
}) {
  const BEND_R = 180;
  /* Bend AWAY from the cursor horizontally — grass leans in the "wind". */
  const bend = useTransform([mouseX, mouseY], (v) => {
    const [mx, my] = v as [number, number];
    const ddx = originX - mx;
    const ddy = originY - my;
    const dist = Math.hypot(ddx, ddy);
    if (dist > BEND_R || dist === 0) return 0;
    const power = 1 - dist / BEND_R;
    /* Sign of ddx: cursor left → ddx > 0 → tuft bends right (+rotate).
       Gentle max ±10° at closest approach. */
    return Math.sign(ddx) * power * 10;
  });

  return (
    <motion.g
      style={{ rotate: bend, transformOrigin: `${originX}px ${originY}px` }}
      transition={{ type: "spring", stiffness: 90, damping: 26, mass: 1.2 }}
    >
      <motion.g
        animate={reduce ? undefined : { rotate: [-2, 2, -2] }}
        transition={reduce ? undefined : {
          duration: 6 + (phase % 3) * 0.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: (phase * 0.4) % 2,
        }}
        style={{ transformOrigin: `${originX}px ${originY}px` }}
      >
        <path d={d} />
      </motion.g>
    </motion.g>
  );
}
