"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* Tiny synthesized-sound system. No audio files — everything is a couple of
   oscillators through a gain envelope, so the whole SFX subsystem adds ~2 KB
   and no network requests. Muted by default until the user opts in via the
   speaker toggle; state is remembered across visits. */

export type SoundName =
  | "click"     // opening an app / general confirm
  | "pop"      // window/panel appearing
  | "close"    // closing a window (traffic-light red)
  | "toggle"   // theme toggle — day/night swoosh
  | "tick"     // subtle hover blip
  | "chime";   // light celebratory ping

type Ctx = {
  muted: boolean;
  toggleMute: () => void;
  play: (name: SoundName) => void;
};

const SfxContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "cw-sfx-muted";

export function SfxProvider({ children }: { children: React.ReactNode }) {
  /* Default muted so the site doesn't blast sound on first paint. Read the
     stored preference in a useEffect to avoid SSR/localStorage mismatches. */
  const [muted, setMuted] = useState(true);
  const acRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "false") setMuted(false);
    } catch {
      /* localStorage unavailable — stay muted */
    }
  }, []);

  const ensureContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!acRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      acRef.current = new AC();
    }
    /* Browsers suspend the context until a user gesture — resume on demand. */
    if (acRef.current.state === "suspended") {
      void acRef.current.resume();
    }
    return acRef.current;
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (muted) return;
      const ac = ensureContext();
      if (!ac) return;
      SOUND_RECIPES[name](ac);
    },
    [muted, ensureContext],
  );

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* ignore */
      }
      /* If unmuting, play a small confirmation blip so the user knows it's on. */
      if (!next) {
        const ac = ensureContext();
        if (ac) SOUND_RECIPES.chime(ac);
      }
      return next;
    });
  }, [ensureContext]);

  const value = useMemo(() => ({ muted, toggleMute, play }), [muted, toggleMute, play]);

  return <SfxContext.Provider value={value}>{children}</SfxContext.Provider>;
}

export function useSfx(): Ctx {
  const ctx = useContext(SfxContext);
  if (!ctx) throw new Error("useSfx must be used inside SfxProvider");
  return ctx;
}

/* ── Sound recipes ─────────────────────────────────────────────
   Every recipe schedules a single oscillator + gain envelope on the shared
   AudioContext and lets it garbage-collect after it stops. Frequencies picked
   from a soft pentatonic palette so nothing sounds harsh even if triggered
   rapidly. */

type Recipe = (ac: AudioContext) => void;

function blip(
  ac: AudioContext,
  {
    freq,
    endFreq,
    dur = 0.09,
    type = "sine",
    peak = 0.15,
  }: {
    freq: number;
    endFreq?: number;
    dur?: number;
    type?: OscillatorType;
    peak?: number;
  },
) {
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (endFreq !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 1), now + dur);
  }
  /* Fast attack, quick decay — feels like a tap, not a note. */
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}

const SOUND_RECIPES: Record<SoundName, Recipe> = {
  click: (ac) => blip(ac, { freq: 880, endFreq: 660, dur: 0.08, type: "triangle", peak: 0.14 }),
  pop:   (ac) => blip(ac, { freq: 520, endFreq: 780, dur: 0.11, type: "sine",     peak: 0.13 }),
  close: (ac) => blip(ac, { freq: 520, endFreq: 220, dur: 0.14, type: "triangle", peak: 0.12 }),
  toggle:(ac) => {
    /* Two-note swoop — up for day, down for night doesn't matter here; the
       caller picks direction via `chime` if needed. Keep it neutral. */
    blip(ac, { freq: 440, endFreq: 660, dur: 0.13, type: "sine",     peak: 0.11 });
    setTimeout(() => blip(ac, { freq: 660, endFreq: 990, dur: 0.11, type: "sine", peak: 0.09 }), 60);
  },
  tick:  (ac) => blip(ac, { freq: 1400, endFreq: 1200, dur: 0.04, type: "sine",   peak: 0.045 }),
  chime: (ac) => {
    blip(ac, { freq: 784, dur: 0.13, type: "sine", peak: 0.11 });
    setTimeout(() => blip(ac, { freq: 1046, dur: 0.15, type: "sine", peak: 0.09 }), 70);
  },
};
