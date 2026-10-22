"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Invite = {
  code: string;
  guest_name: string;
  opened_at: string | null;
  created_at: string;
};

export function InviteManager({
  invites,
  rsvpedCodes,
}: {
  invites: Invite[];
  rsvpedCodes: string[];
}) {
  const router = useRouter();
  const [names, setNames] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const rsvpedSet = useMemo(() => new Set(rsvpedCodes), [rsvpedCodes]);
  const origin = typeof window === "undefined" ? "" : window.location.origin;

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return invites;
    return invites.filter(
      (i) => i.guest_name.toLowerCase().includes(f) || i.code.includes(f)
    );
  }, [invites, filter]);

  const stats = useMemo(() => {
    const opened = invites.filter((i) => i.opened_at).length;
    const rsvped = invites.filter((i) => rsvpedSet.has(i.code)).length;
    return { total: invites.length, opened, rsvped };
  }, [invites, rsvpedSet]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const list = names
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean);
    if (!list.length || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names: list }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "failed");
      }
      setNames("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed");
    } finally {
      setBusy(false);
    }
  }

  function linkFor(code: string) {
    return `${origin}/21stbirthday?code=${code}`;
  }

  async function copyLink(code: string) {
    try {
      await navigator.clipboard.writeText(linkFor(code));
      setCopied(code);
      setTimeout(() => setCopied((c) => (c === code ? null : c)), 1400);
    } catch {
      /* noop */
    }
  }

  function exportCsv() {
    const header = "guest_name,code,link,opened_at,rsvp\n";
    const rows = invites
      .map((i) =>
        [
          `"${i.guest_name.replace(/"/g, '""')}"`,
          i.code,
          linkFor(i.code),
          i.opened_at ?? "",
          rsvpedSet.has(i.code) ? "yes" : "",
        ].join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invites-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Add guests */}
      <form
        onSubmit={onCreate}
        className="rounded-xl border-[2px] border-ink/85 bg-white p-5"
      >
        <label htmlFor="names" className="font-display text-xs uppercase tracking-[0.18em] text-ink/55">
          Add guests
        </label>
        <textarea
          id="names"
          value={names}
          onChange={(e) => setNames(e.target.value)}
          rows={5}
          placeholder={"Aaryan Khanna\nAlia Rahman\nJia Wen"}
          className="mt-2 w-full rounded-md border-[2px] border-ink/60 bg-tinted px-4 py-3 font-display text-ink placeholder:text-ink/35 focus:border-accent-deep focus:outline-none"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="font-display text-xs text-ink/55">
            One name per line. Codes are generated automatically.
          </p>
          <button
            type="submit"
            disabled={busy || !names.trim()}
            className="rounded-md border-[2px] border-ink/85 bg-accent px-5 py-2.5 font-wordmark text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-50"
            style={{ boxShadow: "0 4px 0 rgba(26,37,64,0.85)" }}
          >
            {busy ? "Creating…" : "Generate links"}
          </button>
        </div>
        {error && <p className="mt-3 font-display text-sm text-tl-red">{error}</p>}
      </form>

      {/* Stats + filter + export */}
      <div className="flex flex-wrap items-center gap-3">
        <StatPill label="Invited" value={stats.total} />
        <StatPill label="Opened" value={stats.opened} tone="butter" />
        <StatPill label="RSVP’d" value={stats.rsvped} tone="mint" />
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search names or codes"
          className="ml-auto w-full max-w-xs rounded-md border-[2px] border-ink/60 bg-white px-3 py-2 font-display text-sm text-ink placeholder:text-ink/40 focus:border-accent-deep focus:outline-none"
        />
        <button
          type="button"
          onClick={exportCsv}
          disabled={invites.length === 0}
          className="rounded-md border-[2px] border-ink/60 bg-white px-3 py-2 font-display text-sm text-ink/80 transition hover:border-ink/85 hover:text-ink disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>

      {/* Invite list */}
      <div className="overflow-hidden rounded-xl border-[2px] border-ink/85 bg-white">
        <table className="w-full border-collapse font-display text-sm">
          <thead className="bg-tinted">
            <tr className="text-left text-ink/60">
              <th className="px-4 py-3 font-medium">Guest</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Link</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-ink/50">
                  {invites.length === 0 ? "No invites yet." : "No matches."}
                </td>
              </tr>
            )}
            {filtered.map((i) => {
              const hasRsvped = rsvpedSet.has(i.code);
              const status = hasRsvped
                ? { label: "RSVP’d", tone: "mint" as const }
                : i.opened_at
                ? { label: "Opened", tone: "butter" as const }
                : { label: "Sent", tone: "muted" as const };
              return (
                <tr key={i.code} className="border-t border-ink/10 align-middle">
                  <td className="px-4 py-3">
                    <div className="font-wordmark text-ink">{i.guest_name}</div>
                    <div className="mt-0.5 font-mono text-[11px] text-ink/50">{i.code}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip tone={status.tone}>{status.label}</StatusChip>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="truncate rounded bg-tinted px-2 py-1 text-[11px] text-ink/70">
                        /21stbirthday?code={i.code}
                      </code>
                      <button
                        type="button"
                        onClick={() => copyLink(i.code)}
                        className="shrink-0 rounded-md border-[1.5px] border-ink/60 bg-white px-2.5 py-1 font-display text-xs text-ink/80 transition hover:border-ink/85 hover:text-ink"
                      >
                        {copied === i.code ? "Copied ✓" : "Copy"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatPill({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: number;
  tone?: "ink" | "butter" | "mint";
}) {
  const bg =
    tone === "butter" ? "bg-accent-butter/40" : tone === "mint" ? "bg-accent-mint/40" : "bg-tinted";
  return (
    <div className={`rounded-full border-[1.5px] border-ink/40 ${bg} px-3 py-1.5 font-display text-sm text-ink/80`}>
      <span className="font-wordmark text-ink">{value}</span>
      <span className="ml-1 text-ink/60">{label}</span>
    </div>
  );
}

function StatusChip({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "mint" | "butter" | "muted";
}) {
  const classes =
    tone === "mint"
      ? "bg-accent-mint/50 text-ink"
      : tone === "butter"
      ? "bg-accent-butter/50 text-ink"
      : "bg-tinted text-ink/60";
  return (
    <span className={`inline-flex rounded-full border border-ink/25 px-2.5 py-0.5 font-display text-xs ${classes}`}>
      {children}
    </span>
  );
}
