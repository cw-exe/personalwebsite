"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Wrong password.");
        setBusy(false);
        return;
      }
      const from = params.get("from") || "/admin";
      router.push(from);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
      setBusy(false);
    }
  }

  return (
    <main className="relative grid h-dvh w-dvw place-items-center bg-gradient-to-b from-[var(--sky-hi)] via-[var(--sky-lo)] to-[var(--bg-tinted)] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-[14px] border-[2.5px] border-ink/85 bg-white p-8"
        style={{ boxShadow: "0 24px 48px -20px rgba(26,37,64,0.45)" }}
      >
        <p className="font-display text-xs uppercase tracking-[0.22em] text-ink/55">Private</p>
        <h1 className="mt-2 font-wordmark text-3xl font-bold text-ink">Admin</h1>
        <label htmlFor="pw" className="mt-6 block font-display text-xs uppercase tracking-[0.18em] text-ink/55">
          Password
        </label>
        <input
          id="pw"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-md border-[2px] border-ink/60 bg-tinted px-4 py-3 font-display text-ink focus:border-accent-deep focus:outline-none"
        />
        <button
          type="submit"
          disabled={!password || busy}
          className="mt-5 w-full rounded-md border-[2px] border-ink/85 bg-accent px-5 py-3 font-wordmark text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-50"
          style={{ boxShadow: "0 6px 0 rgba(26,37,64,0.85)" }}
        >
          {busy ? "Checking…" : "Enter"}
        </button>
        {error && <p className="mt-3 font-display text-sm text-tl-red">{error}</p>}
      </form>
    </main>
  );
}
