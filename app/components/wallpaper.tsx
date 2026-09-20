"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <svg
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
          <circle cx="1360" cy="180" r="240" fill="url(#sunGlow)" />
          <motion.g
            animate={reduce ? undefined : { rotate: 360 }}
            transition={reduce ? undefined : { duration: 90, ease: "linear", repeat: Infinity }}
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
            <circle cx="1360" cy="180" r="76" fill="#FFDF80" stroke={NAVY} strokeWidth="5" />
            <path
              d="M1338 178 q0 -8 8 -8 M1374 178 q0 -8 8 -8 M1338 198 q22 22 44 0"
              stroke={NAVY} strokeWidth="4" strokeLinecap="round" fill="none"
            />
          </motion.g>
        </motion.g>

        {/* Moon — rises down from above, comes to rest at the sun's spot */}
        <motion.g
          initial={false}
          animate={{ y: isNight ? 0 : -560, opacity: isNight ? 1 : 0 }}
          transition={orbit}
        >
          <circle cx="1360" cy="180" r="240" fill="url(#moonGlow)" />
          <circle cx="1360" cy="180" r="76" fill="#F1E8CF" stroke={NIGHT_STROKE} strokeWidth="5" />
          {/* craters */}
          <circle cx="1332" cy="160" r="8"  fill="#D9CDA8" stroke={NIGHT_STROKE} strokeWidth="2" />
          <circle cx="1388" cy="200" r="6"  fill="#D9CDA8" stroke={NIGHT_STROKE} strokeWidth="2" />
          <circle cx="1370" cy="145" r="4"  fill="#D9CDA8" stroke={NIGHT_STROKE} strokeWidth="2" />
          {/* sleepy face */}
          <path
            d="M1338 182 q6 6 12 0 M1374 182 q6 6 12 0 M1348 208 q12 8 24 0"
            stroke={NIGHT_STROKE} strokeWidth="3.5" strokeLinecap="round" fill="none"
          />
        </motion.g>

        {/* Birds — fade out at night, fade in once day returns */}
        <motion.g
          stroke={NAVY} strokeWidth="4" strokeLinecap="round" fill="none"
          initial={false}
          animate={{ opacity: isNight ? 0 : 1 }}
          transition={birdOut}
        >
          <path d="M240 220 q10 -14 22 0 q10 -14 22 0" />
          <path d="M310 260 q8 -11 18 0 q8 -11 18 0" />
        </motion.g>

        {/* Clouds — cross-fade fill/stroke; still drift with their own loops */}
        <motion.g
          animate={reduce ? undefined : { x: [0, 30, 0] }}
          transition={reduce ? undefined : { duration: 24, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cloud cx={220} cy={340} scale={1.05} isNight={isNight} fade={fade} />
        </motion.g>
        <motion.g
          animate={reduce ? undefined : { x: [0, -22, 0] }}
          transition={reduce ? undefined : { duration: 28, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cloud cx={780} cy={200} scale={0.85} isNight={isNight} fade={fade} />
        </motion.g>
        <motion.g
          animate={reduce ? undefined : { x: [0, 18, 0] }}
          transition={reduce ? undefined : { duration: 32, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cloud cx={1080} cy={410} scale={0.95} isNight={isNight} fade={fade} />
        </motion.g>
        <motion.g
          animate={reduce ? undefined : { x: [0, -14, 0] }}
          transition={reduce ? undefined : { duration: 26, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cloud cx={500} cy={130} scale={0.7} isNight={isNight} fade={fade} />
        </motion.g>

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

        {/* Grass tufts */}
        <g stroke={NAVY} strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M180 802 v-14 M188 800 v-10 M172 800 v-8" />
          <path d="M540 786 v-14 M548 784 v-10 M532 784 v-8" />
          <path d="M960 776 v-14 M968 774 v-10 M952 774 v-8" />
          <path d="M1220 780 v-14 M1228 778 v-10 M1212 778 v-8" />
        </g>

        {/* Flowers */}
        <g transform="translate(400 792)">
          <circle cx="0" cy="0" r="6" fill="#FFB4A2" stroke={NAVY} strokeWidth="3" />
          <path d="M0 8 v18" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
        </g>
        <g transform="translate(1080 794)">
          <circle cx="0" cy="0" r="6" fill="#FFDF80" stroke={NAVY} strokeWidth="3" />
          <path d="M0 8 v14" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Fireflies — fade in over the hills at night */}
        <motion.g
          fill="#FFDF80"
          initial={false}
          animate={{ opacity: isNight ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 1.0, ease: "easeOut", delay: isNight ? 0.45 : 0 }}
        >
          {FIREFLIES.map((f, i) => (
            <motion.circle
              key={i}
              cx={f.x} cy={f.y} r="2.5"
              initial={{ opacity: 0.3 }}
              animate={reduce ? { opacity: 0.6 } : { opacity: [0.2, 0.95, 0.2], y: [0, -10, 0] }}
              transition={reduce ? { duration: 0 } : { duration: 2.6 + (i % 3) * 0.5, repeat: Infinity, ease: "easeInOut", delay: (i % 4) * 0.3 }}
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

/* Fireflies — hovering above the front hill */
const FIREFLIES = [
  { x: 280,  y: 760 },
  { x: 620,  y: 740 },
  { x: 820,  y: 770 },
  { x: 1180, y: 745 },
  { x: 1380, y: 765 },
] as const;

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
