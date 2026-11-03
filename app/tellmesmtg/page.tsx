"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Stage = "compose" | "sending" | "sent";

export default function TellMeSmtgPage() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>("compose");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    const msg = message.trim();
    if (!msg || stage === "sending") return;
    setStage("sending");
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          name: anonymous ? "" : name.trim(),
          anonymous,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "failed");
      }
      setStage("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed");
      setStage("compose");
    }
  }

  function sendAnother() {
    setMessage("");
    setName("");
    setAnonymous(true);
    setError(null);
    setStage("compose");
  }

  const chars = message.length;
  const max = 2000;
  const transition = reduce ? { duration: 0 } : { duration: 0.4, ease: [0.22, 0.9, 0.33, 1] as const };

  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-[var(--bg)] px-4 py-14 md:py-20">
      {/* Ambient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-accent-butter/35 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-accent-mint/30 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-xl flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="font-display text-xs uppercase tracking-[0.3em] text-ink/55"
        >
          anonymous · honest · one-way
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.05 }}
          className="mt-3 text-center font-wordmark text-5xl font-bold text-ink md:text-6xl"
        >
          tell me <span className="text-accent">something</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transition, delay: 0.1 }}
          className="mt-3 text-center font-display text-ink/70"
        >
          Say anything — a thought, a confession, a question, feedback. I&apos;ll read every one.
        </motion.p>

        <AnimatePresence mode="wait">
          {stage !== "sent" ? (
            <motion.form
              key="form"
              onSubmit={onSend}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={transition}
              className="mt-10 w-full"
            >
              <div
                className="relative rounded-2xl border-[2px] border-ink/85 bg-white p-5 shadow-[0_8px_0_rgba(26,37,64,0.85)] transition-shadow focus-within:shadow-[0_10px_0_rgba(26,37,64,0.9)]"
              >
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, max))}
                  rows={7}
                  autoFocus
                  placeholder="type something to Chin Wei…"
                  className="w-full resize-none bg-transparent font-display text-lg text-ink placeholder:text-ink/35 focus:outline-none"
                />
                <div className="mt-3 flex items-center justify-between font-display text-xs text-ink/55">
                  <span>{chars} / {max}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                    sent securely
                  </span>
                </div>
              </div>

              {/* Identity toggle */}
              <div className="mt-5 rounded-2xl border-[1.5px] border-ink/30 bg-tinted p-1">
                <div className="relative grid grid-cols-2">
                  <motion.span
                    aria-hidden
                    layout
                    className="absolute inset-y-1 w-[calc(50%-4px)] rounded-xl bg-white shadow-[0_2px_0_rgba(26,37,64,0.6)]"
                    animate={{ left: anonymous ? 2 : "calc(50% + 2px)" }}
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 32 }}
                  />
                  <button
                    type="button"
                    onClick={() => setAnonymous(true)}
                    className={`relative z-10 rounded-xl py-2.5 font-wordmark text-sm transition ${
                      anonymous ? "text-ink" : "text-ink/55 hover:text-ink/80"
                    }`}
                  >
                    👻 anonymous
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnonymous(false)}
                    className={`relative z-10 rounded-xl py-2.5 font-wordmark text-sm transition ${
                      !anonymous ? "text-ink" : "text-ink/55 hover:text-ink/80"
                    }`}
                  >
                    ✨ include my name
                  </button>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {!anonymous && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={transition}
                  >
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value.slice(0, 80))}
                      placeholder="your name"
                      maxLength={80}
                      className="w-full rounded-xl border-[2px] border-ink/60 bg-white px-4 py-3 font-display text-ink placeholder:text-ink/35 focus:border-accent-deep focus:outline-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <p className="mt-4 text-center font-display text-sm text-tl-red">
                  Couldn&apos;t send — {error}. Try again?
                </p>
              )}

              <motion.button
                type="submit"
                whileHover={reduce ? undefined : { y: -2 }}
                whileTap={reduce ? undefined : { y: 1 }}
                disabled={!message.trim() || stage === "sending"}
                className="mt-6 w-full rounded-2xl border-[2px] border-ink/85 bg-accent px-6 py-4 font-wordmark text-lg font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                style={{ boxShadow: "0 6px 0 rgba(26,37,64,0.85)" }}
              >
                {stage === "sending" ? "sending…" : "send →"}
              </motion.button>

              <p className="mt-4 text-center font-display text-xs text-ink/50">
                {anonymous
                  ? "You’re anonymous. I won’t see any name, email, or trace back to you."
                  : "Your name will be shown with your message."}
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
              className="mt-14 w-full text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-[2.5px] border-ink/85 bg-accent-mint/60 text-5xl shadow-[0_6px_0_rgba(26,37,64,0.85)]"
              >
                ✓
              </motion.div>
              <h2 className="mt-6 font-wordmark text-3xl font-bold text-ink">sent!</h2>
              <p className="mt-2 font-display text-ink/70">
                Thanks for taking the time. I&apos;ll read it soon.
              </p>
              <button
                type="button"
                onClick={sendAnother}
                className="mt-8 rounded-2xl border-[2px] border-ink/85 bg-white px-6 py-3 font-wordmark text-sm font-bold text-ink transition hover:-translate-y-0.5"
                style={{ boxShadow: "0 4px 0 rgba(26,37,64,0.85)" }}
              >
                send another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
