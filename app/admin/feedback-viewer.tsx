"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Feedback = {
  id: string;
  sender_name: string | null;
  message: string;
  created_at: string;
  read_at: string | null;
};

type Filter = "all" | "unread" | "named" | "anonymous";

export function FeedbackViewer({ feedbacks }: { feedbacks: Feedback[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return feedbacks.filter((f) => {
      if (filter === "unread" && f.read_at) return false;
      if (filter === "named" && !f.sender_name) return false;
      if (filter === "anonymous" && f.sender_name) return false;
      if (q) {
        const hay = `${f.sender_name ?? ""} ${f.message}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [feedbacks, filter, query]);

  const stats = useMemo(() => {
    const unread = feedbacks.filter((f) => !f.read_at).length;
    const named = feedbacks.filter((f) => f.sender_name).length;
    return { total: feedbacks.length, unread, named, anon: feedbacks.length - named };
  }, [feedbacks]);

  async function toggleRead(f: Feedback) {
    if (busy) return;
    setBusy(f.id);
    try {
      await fetch("/api/admin/feedbacks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: f.id, read: !f.read_at }),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function remove(f: Feedback) {
    if (busy) return;
    if (!confirm("Delete this message?")) return;
    setBusy(f.id);
    try {
      await fetch(`/api/admin/feedbacks?id=${encodeURIComponent(f.id)}`, {
        method: "DELETE",
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  const chips: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: stats.total },
    { key: "unread", label: "Unread", count: stats.unread },
    { key: "named", label: "Named", count: stats.named },
    { key: "anonymous", label: "Anonymous", count: stats.anon },
  ];

  return (
    <section className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.22em] text-ink/55">
            /tellmesmtg inbox
          </p>
          <h2 className="mt-1 font-wordmark text-3xl font-bold text-ink">
            Feedback
          </h2>
          <p className="mt-1 font-display text-sm text-ink/60">
            {stats.unread} unread · {stats.total} total
          </p>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search messages"
          className="w-full max-w-xs rounded-md border-[2px] border-ink/60 bg-white px-3 py-2 font-display text-sm text-ink placeholder:text-ink/40 focus:border-accent-deep focus:outline-none"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {chips.map((c) => {
          const active = filter === c.key;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setFilter(c.key)}
              className={`rounded-full border-[1.5px] px-3 py-1.5 font-display text-sm transition ${
                active
                  ? "border-ink/85 bg-ink text-[var(--bg)]"
                  : "border-ink/40 bg-tinted text-ink/70 hover:border-ink/70"
              }`}
            >
              {c.label}
              <span className={`ml-2 ${active ? "text-[var(--bg)]/70" : "text-ink/50"}`}>
                {c.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border-[2px] border-dashed border-ink/30 bg-white/40 p-10 text-center font-display text-ink/50">
            No messages {filter === "all" ? "yet" : "match this filter"}.
          </div>
        )}
        <AnimatePresence initial={false}>
          {filtered.map((f) => {
            const unread = !f.read_at;
            return (
              <motion.article
                key={f.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`rounded-xl border-[2px] ${
                  unread ? "border-accent" : "border-ink/20"
                } bg-white p-5 transition`}
              >
                <header className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {f.sender_name ? (
                      <>
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-mint/60 font-wordmark text-xs text-ink">
                          {f.sender_name.slice(0, 1).toUpperCase()}
                        </span>
                        <span className="font-wordmark text-ink">{f.sender_name}</span>
                      </>
                    ) : (
                      <>
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-tinted font-wordmark text-xs text-ink/60">
                          👻
                        </span>
                        <span className="font-wordmark text-ink/60">anonymous</span>
                      </>
                    )}
                    {unread && (
                      <span className="rounded-full bg-accent px-2 py-0.5 font-display text-[10px] uppercase tracking-widest text-white">
                        new
                      </span>
                    )}
                  </div>
                  <time className="shrink-0 font-display text-xs text-ink/50">
                    {new Date(f.created_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                </header>
                <p className="mt-3 whitespace-pre-wrap font-display text-ink/90">
                  {f.message}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={busy === f.id}
                    onClick={() => toggleRead(f)}
                    className="rounded-md border-[1.5px] border-ink/60 bg-white px-3 py-1.5 font-display text-xs text-ink/80 transition hover:border-ink/85 hover:text-ink disabled:opacity-50"
                  >
                    {unread ? "Mark as read" : "Mark as unread"}
                  </button>
                  <button
                    type="button"
                    disabled={busy === f.id}
                    onClick={() => remove(f)}
                    className="rounded-md border-[1.5px] border-tl-red/40 bg-white px-3 py-1.5 font-display text-xs text-tl-red transition hover:border-tl-red disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
