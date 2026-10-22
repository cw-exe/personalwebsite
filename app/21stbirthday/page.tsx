"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* ────────────────────────────────────────────────────────────────────────────
   /21stbirthday — invitation page
   Flow: sealed envelope → click to open → letter slides out → password gate
   → full invitation + RSVP → "you're tuned in" confirmation.

   PLACEHOLDERS (owner to fill before publishing):
   - Password: shared word, hardcoded below. Swap for per-guest codes once
     the invite list is finalized (schema already supports it: ?code=xxx).
   - Venue + dress code: TBD. Rendered as "to be revealed" blocks for now.
──────────────────────────────────────────────────────────────────────────── */

const PASSWORD = "finallylegal"; // TODO(owner): swap for per-guest codes later

type Stage = "sealed" | "opened" | "unlocked" | "submitting" | "rsvped";

export default function BirthdayPage() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>("sealed");
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [guestCode, setGuestCode] = useState<string | null>(null);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      setGuestCode(code);
      fetch("/api/invite-open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      }).catch(() => {});
    }
  }, []);

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (password.trim().toLowerCase() === PASSWORD) {
      setStage("unlocked");
      setPwError(false);
    } else {
      setPwError(true);
    }
  }

  async function handleRsvp(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || stage === "submitting") return;
    setStage("submitting");
    setSubmitError(null);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          code: guestCode,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "request failed");
      }
      setStage("rsvped");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "request failed";
      setSubmitError(
        msg === "invalid email" ? "That email looks off — try again." : "Something went wrong. Try again?"
      );
      setStage("unlocked");
    }
  }

  return (
    <main className="relative h-dvh w-dvw overflow-hidden bg-gradient-to-b from-[var(--sky-hi)] via-[var(--sky-lo)] to-[var(--bg-tinted)]">
      <Confetti reduce={!!reduce} active={stage === "rsvped"} />
      <StarsBackdrop />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait">
          {stage === "sealed" && (
            <SealedEnvelope key="sealed" onOpen={() => setStage("opened")} reduce={!!reduce} />
          )}

          {stage === "opened" && (
            <Letter
              key="letter"
              reduce={!!reduce}
              password={password}
              setPassword={setPassword}
              pwError={pwError}
              onSubmit={handleUnlock}
            />
          )}

          {(stage === "unlocked" || stage === "submitting") && (
            <Invitation
              key="invitation"
              reduce={!!reduce}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              onSubmit={handleRsvp}
              submitting={stage === "submitting"}
              error={submitError}
            />
          )}

          {stage === "rsvped" && <Confirmation key="done" name={name} reduce={!!reduce} />}
        </AnimatePresence>
      </div>
    </main>
  );
}

/* ────────────────────────── Sealed envelope ──────────────────────────────── */

function SealedEnvelope({ onOpen, reduce }: { onOpen: () => void; reduce: boolean }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -40, scale: 0.9, transition: { duration: 0.35 } }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
      whileHover={reduce ? {} : { y: -8, rotate: -1.5, scale: 1.03 }}
      whileTap={reduce ? {} : { scale: 0.97 }}
      aria-label="Open the envelope"
      className="group relative cursor-pointer focus:outline-none"
    >
      <EnvelopeBody>
        <WaxSeal />
        <motion.span
          animate={reduce ? {} : { y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-sm italic text-ink/70"
        >
          tap to open ✦
        </motion.span>
      </EnvelopeBody>
    </motion.button>
  );
}

function EnvelopeBody({ children }: { children?: React.ReactNode }) {
  return (
    <div
      className="relative"
      style={{
        width: "min(84vw, 440px)",
        aspectRatio: "1.55 / 1",
      }}
    >
      {/* Envelope back */}
      <div
        className="absolute inset-0 rounded-[14px] border-[2.5px] border-ink/85 bg-[#F7EAD1]"
        style={{
          boxShadow:
            "0 24px 48px -20px rgba(26,37,64,0.45), 0 10px 22px -10px rgba(26,37,64,0.28), inset 0 -8px 0 rgba(26,37,64,0.06)",
        }}
      />
      {/* Envelope flap (triangular) */}
      <svg
        viewBox="0 0 200 130"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <polygon points="0,0 200,0 100,78" fill="#F7EAD1" stroke="#1A2540" strokeWidth="2.2" strokeLinejoin="round" />
        <line x1="0" y1="0" x2="100" y2="78" stroke="#1A2540" strokeOpacity="0.18" strokeWidth="1.5" />
        <line x1="200" y1="0" x2="100" y2="78" stroke="#1A2540" strokeOpacity="0.18" strokeWidth="1.5" />
      </svg>
      {/* Side bevels */}
      <svg viewBox="0 0 200 130" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <line x1="0" y1="0" x2="60" y2="65" stroke="#1A2540" strokeOpacity="0.14" strokeWidth="1.5" />
        <line x1="200" y1="0" x2="140" y2="65" stroke="#1A2540" strokeOpacity="0.14" strokeWidth="1.5" />
        <line x1="0" y1="130" x2="60" y2="65" stroke="#1A2540" strokeOpacity="0.14" strokeWidth="1.5" />
        <line x1="200" y1="130" x2="140" y2="65" stroke="#1A2540" strokeOpacity="0.14" strokeWidth="1.5" />
      </svg>
      {children}
    </div>
  );
}

function WaxSeal() {
  return (
    <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2">
      <div
        className="relative grid h-20 w-20 place-items-center rounded-full border-[2.5px] border-ink/85"
        style={{
          background:
            "radial-gradient(circle at 32% 28%, #A9C8FF 0%, #78AAFF 48%, #3D6FE0 100%)",
          boxShadow:
            "0 10px 22px -10px rgba(61,111,224,0.65), inset 0 -4px 0 rgba(26,37,64,0.22), inset 0 3px 0 rgba(255,255,255,0.35)",
        }}
      >
        <span className="font-wordmark text-2xl font-bold text-white drop-shadow-[0_1px_0_rgba(26,37,64,0.35)]">
          cw
        </span>
      </div>
    </div>
  );
}

/* ────────────────────────── Letter + password gate ───────────────────────── */

function Letter({
  reduce,
  password,
  setPassword,
  pwError,
  onSubmit,
}: {
  reduce: boolean;
  password: string;
  setPassword: (v: string) => void;
  pwError: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -40, scale: 0.95, transition: { duration: 0.35 } }}
      transition={{ type: "spring", stiffness: 160, damping: 22 }}
      className="relative mx-auto flex w-full max-w-[520px] flex-col items-center"
    >
      {/* Letter paper */}
      <div
        className="relative w-full rounded-[10px] border-[2.5px] border-ink/85 bg-white p-7 md:p-10"
        style={{
          boxShadow:
            "0 24px 48px -20px rgba(26,37,64,0.45), 0 10px 22px -10px rgba(26,37,64,0.25)",
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0 30px, rgba(26,37,64,0.045) 30px 31px)",
        }}
      >
        <p className="font-display text-xs uppercase tracking-[0.22em] text-ink/50">
          A letter for you
        </p>
        <h1 className="mt-4 font-wordmark text-3xl font-bold leading-tight text-ink md:text-4xl">
          You&apos;re invited.
        </h1>
        <p className="mt-5 font-display text-[15px] leading-relaxed text-ink/80 md:text-base">
          I&apos;m turning twenty-one, and i&apos;d really love for u to be in the room to celebrate
          it with me hihi! legal age finally, but i guess adulting is scary as well. The details
          are sealed behind the password — the one i sent together with the message to you!
        </p>

        <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-3">
          <label htmlFor="pw" className="font-display text-xs uppercase tracking-[0.18em] text-ink/55">
            The word
          </label>
          <div className="flex gap-2">
            <input
              id="pw"
              type="password"
              autoFocus
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="shhh…"
              className={`flex-1 rounded-md border-[2px] bg-tinted px-4 py-3 font-display text-ink placeholder:text-ink/35 focus:outline-none ${
                pwError ? "border-tl-red" : "border-ink/60 focus:border-accent-deep"
              }`}
            />
            <button
              type="submit"
              className="rounded-md border-[2px] border-ink/85 bg-accent px-5 py-3 font-wordmark text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-accent-deep active:translate-y-0"
              style={{ boxShadow: "0 6px 0 rgba(26,37,64,0.85)" }}
            >
              Open
            </button>
          </div>
          <AnimatePresence>
            {pwError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-display text-sm text-tl-red"
              >
                Not quite — check the message I sent you.
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </div>
      <p className="mt-5 font-display text-xs italic text-ink/55">— cw</p>
    </motion.div>
  );
}

/* ────────────────────────── Invitation + RSVP ────────────────────────────── */

function Invitation({
  reduce,
  name,
  setName,
  email,
  setEmail,
  onSubmit,
  submitting,
  error,
}: {
  reduce: boolean;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  error: string | null;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 32, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -24, transition: { duration: 0.35 } }}
      transition={{ type: "spring", stiffness: 160, damping: 22 }}
      className="relative mx-auto w-full max-w-[560px]"
    >
      <div
        className="relative rounded-[14px] border-[2.5px] border-ink/85 bg-white p-7 md:p-10"
        style={{
          boxShadow:
            "0 24px 48px -20px rgba(26,37,64,0.45), 0 10px 22px -10px rgba(26,37,64,0.25)",
        }}
      >
        {/* Butter sticker tab */}
        <span
          className="absolute -top-3 left-10 rotate-[-4deg] rounded-sm border border-ink/25 bg-accent-butter/85 px-3 py-1 font-display text-[11px] uppercase tracking-[0.18em] text-ink/80"
          style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }}
        >
          You&apos;re on the list
        </span>

        <p className="mt-2 font-display text-xs uppercase tracking-[0.22em] text-ink/55">
          Chin Wei&apos;s 21st Birthday
        </p>
        <h1 className="mt-3 font-wordmark text-4xl font-bold leading-tight text-ink md:text-5xl">
          A fun night incoming!
          <br />
          <span className="text-accent-deep">with all of you who shaped it.</span>
        </h1>
        <p className="mt-3 font-display text-sm italic text-ink/55">
          ps* it won&apos;t be a normal party!
        </p>

        {/* Details grid */}
        <dl className="mt-7 grid grid-cols-1 gap-5 border-t-[1.5px] border-dashed border-ink/20 pt-6 sm:grid-cols-3">
          <Detail label="When" value="Saturday" sub="6 March 2027" />
          <Detail label="Where" value="To be revealed" sub="(saving the surprise)" muted />
          <Detail label="Dress code" value="To be revealed" sub="(watch this space)" muted />
        </dl>

        <div className="mt-4 flex justify-end">
          <AddToCalendar tone="subtle" />
        </div>

        {/* RSVP form */}
        <form onSubmit={onSubmit} className="mt-8 space-y-4 border-t-[1.5px] border-dashed border-ink/20 pt-6">
          <div>
            <label htmlFor="name" className="font-display text-xs uppercase tracking-[0.18em] text-ink/55">
              Your name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aaryan"
              className="mt-2 w-full rounded-md border-[2px] border-ink/60 bg-tinted px-4 py-3 font-display text-ink placeholder:text-ink/35 focus:border-accent-deep focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="font-display text-xs uppercase tracking-[0.18em] text-ink/55">
              Your email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="so I can send the venue + dress code"
              className="mt-2 w-full rounded-md border-[2px] border-ink/60 bg-tinted px-4 py-3 font-display text-ink placeholder:text-ink/35 focus:border-accent-deep focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md border-[2px] border-ink/85 bg-accent px-6 py-3 font-wordmark text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-accent-deep active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ boxShadow: "0 6px 0 rgba(26,37,64,0.85)" }}
            disabled={!name.trim() || !email.trim() || submitting}
          >
            {submitting ? "Saving…" : "I\u2019m tuned in! ✦"}
          </button>
          {error ? (
            <p className="font-display text-sm text-tl-red">{error}</p>
          ) : (
            <p className="font-display text-xs italic text-ink/50">
              I&apos;ll send the venue + dress code closer to the date.
            </p>
          )}
        </form>
      </div>
    </motion.div>
  );
}

function Detail({
  label,
  value,
  sub,
  muted = false,
}: {
  label: string;
  value: string;
  sub?: string;
  muted?: boolean;
}) {
  return (
    <div>
      <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-ink/50">{label}</dt>
      <dd
        className={`mt-1 font-wordmark text-xl font-semibold leading-tight ${
          muted ? "text-ink/55" : "text-ink"
        }`}
      >
        {value}
      </dd>
      {sub && <p className="mt-0.5 font-display text-xs text-ink/50">{sub}</p>}
    </div>
  );
}

/* ────────────────────────── Confirmation ─────────────────────────────────── */

function Confirmation({ name, reduce }: { name: string; reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 20 }}
      className="relative mx-auto w-full max-w-[460px] text-center"
    >
      <div
        className="rounded-[14px] border-[2.5px] border-ink/85 bg-white px-7 py-10 md:px-10"
        style={{
          boxShadow:
            "0 24px 48px -20px rgba(26,37,64,0.45), 0 10px 22px -10px rgba(26,37,64,0.25)",
        }}
      >
        <div
          className="mx-auto grid h-16 w-16 place-items-center rounded-full border-[2.5px] border-ink/85"
          style={{
            background: "radial-gradient(circle at 30% 28%, #A9C8FF 0%, #78AAFF 50%, #3D6FE0 100%)",
            boxShadow: "0 8px 16px -8px rgba(61,111,224,0.6), inset 0 -3px 0 rgba(26,37,64,0.22)",
          }}
          aria-hidden
        >
          <span className="font-wordmark text-xl font-bold text-white">✦</span>
        </div>
        <h2 className="mt-5 font-wordmark text-3xl font-bold text-ink">
          See you there, {name.split(" ")[0]}.
        </h2>
        <p className="mt-3 font-display text-[15px] leading-relaxed text-ink/70">
          You&apos;re tuned in. I&apos;ll send the venue and dress code closer to the date — keep
          an eye on your inbox.
        </p>
        <div className="mt-6">
          <AddToCalendar tone="primary" />
        </div>
        <p className="mt-6 font-display text-xs italic text-ink/50">— cw</p>
      </div>
    </motion.div>
  );
}

/* ────────────────────────── Add to calendar ─────────────────────────────── */

/* Saturday 6 March 2027 — all-day for now since venue + time are still TBD.
   When you lock a time, update DATE_START/DATE_END and switch to DTSTART with
   a local time + timezone instead of VALUE=DATE. */
const EVENT_TITLE = "Chin Wei's 21st Birthday";
const EVENT_DETAILS =
  "A fun night incoming! I'll send the venue and dress code closer to the date.";
const DATE_START = "20270306";
const DATE_END = "20270307"; // ICS all-day DTEND is exclusive

function googleCalUrl() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: EVENT_TITLE,
    dates: `${DATE_START}/${DATE_END}`,
    details: EVENT_DETAILS,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadIcs() {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//chinwei//21st//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:chinwei-21st-${DATE_START}@chinwei.my`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${DATE_START}`,
    `DTEND;VALUE=DATE:${DATE_END}`,
    `SUMMARY:${EVENT_TITLE}`,
    `DESCRIPTION:${EVENT_DETAILS}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "chinwei-21st.ics";
  a.click();
  URL.revokeObjectURL(url);
}

function AddToCalendar({ tone = "primary" }: { tone?: "primary" | "subtle" }) {
  const [open, setOpen] = useState(false);
  const trigger =
    tone === "primary"
      ? "w-full rounded-md border-[2px] border-ink/85 bg-white px-5 py-3 font-wordmark text-sm font-bold text-ink transition hover:-translate-y-0.5"
      : "rounded-md border-[2px] border-ink/60 bg-tinted px-4 py-2.5 font-display text-sm text-ink/80 transition hover:border-ink/85 hover:text-ink";
  const triggerStyle =
    tone === "primary" ? { boxShadow: "0 6px 0 rgba(26,37,64,0.85)" } : undefined;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={trigger}
        style={triggerStyle}
      >
        {open ? "Pick where ↑" : "Save the date ✦"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute left-1/2 top-full z-30 mt-2 w-64 -translate-x-1/2 rounded-[10px] border-[2px] border-ink/85 bg-white p-2"
            style={{ boxShadow: "0 14px 28px -14px rgba(26,37,64,0.45)" }}
          >
            <a
              href={googleCalUrl()}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-md px-3 py-2.5 font-display text-sm text-ink hover:bg-tinted"
            >
              <span>Google Calendar</span>
              <span className="text-ink/40">↗</span>
            </a>
            <button
              type="button"
              onClick={() => {
                downloadIcs();
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left font-display text-sm text-ink hover:bg-tinted"
            >
              <span>Apple / Outlook (.ics)</span>
              <span className="text-ink/40">↓</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────────────────────── Backdrop + confetti ──────────────────────────── */

function StarsBackdrop() {
  const [stars, setStars] = useState<
    Array<{ id: number; x: number; y: number; s: number; delay: number }>
  >([]);
  useEffect(() => {
    setStars(
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: 0.5 + Math.random() * 1.4,
        delay: Math.random() * 4,
      }))
    );
  }, []);
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      {stars.map((s) => (
        <motion.span
          key={s.id}
          className="absolute block"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.s * 4}px`,
            height: `${s.s * 4}px`,
          }}
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 3.6, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 10 10" className="h-full w-full">
            <path
              d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z"
              fill="#78AAFF"
              fillOpacity="0.75"
            />
          </svg>
        </motion.span>
      ))}
    </div>
  );
}

function Confetti({ active, reduce }: { active: boolean; reduce: boolean }) {
  const bits = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.6,
        rot: Math.random() * 360,
        color: ["#78AAFF", "#FFDF80", "#FFB4A2", "#A8E0C7", "#FF7B6B"][i % 5],
        size: 6 + Math.random() * 8,
      })),
    []
  );
  if (!active || reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
      {bits.map((b) => (
        <motion.span
          key={b.id}
          className="absolute block rounded-sm"
          style={{
            left: `${b.x}%`,
            top: "-5%",
            width: b.size,
            height: b.size * 0.4,
            background: b.color,
            border: "1px solid rgba(26,37,64,0.35)",
          }}
          initial={{ y: 0, rotate: b.rot, opacity: 1 }}
          animate={{ y: "110vh", rotate: b.rot + 540, opacity: [1, 1, 0.7, 0] }}
          transition={{ duration: 2.6 + Math.random() * 1.4, delay: b.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}
