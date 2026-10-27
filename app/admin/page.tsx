import { getSupabaseAdmin } from "@/app/lib/supabase-server";
import { InviteManager } from "./invite-manager";
import { AnalyticsDashboard } from "./analytics-dashboard";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

type Invite = {
  code: string;
  guest_name: string;
  opened_at: string | null;
  created_at: string;
};

type Rsvp = {
  id: string;
  name: string;
  email: string | null;
  code: string | null;
  submitted_at: string;
};

export default async function AdminPage() {
  const supabase = getSupabaseAdmin();
  const [{ data: invites }, { data: rsvps }] = await Promise.all([
    supabase
      .from("invites")
      .select("code, guest_name, opened_at, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("rsvps")
      .select("id, name, email, code, submitted_at")
      .order("submitted_at", { ascending: false }),
  ]);

  const invitesList: Invite[] = invites ?? [];
  const rsvpsList: Rsvp[] = rsvps ?? [];

  const rsvpedCodes = new Set(rsvpsList.map((r) => r.code).filter(Boolean) as string[]);

  return (
    <main className="window-scroll h-dvh w-full bg-[var(--bg)] px-4 py-10 md:px-10">
      <header className="mx-auto flex max-w-5xl items-end justify-between gap-4 border-b-[1.5px] border-dashed border-ink/20 pb-6">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.22em] text-ink/55">Private</p>
          <h1 className="mt-1 font-wordmark text-4xl font-bold text-ink">Admin</h1>
          <p className="mt-2 font-display text-sm text-ink/60">
            {invitesList.length} invited · {rsvpsList.length} RSVP&apos;d
          </p>
        </div>
        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="rounded-md border-[2px] border-ink/60 bg-tinted px-4 py-2 font-display text-sm text-ink/80 transition hover:border-ink/85 hover:text-ink"
          >
            Log out
          </button>
        </form>
      </header>
      <AnalyticsDashboard />

      <section className="mx-auto mt-10 max-w-5xl">
        <h2 className="font-wordmark text-2xl font-bold text-ink">Invites</h2>
        <p className="mt-1 font-display text-sm text-ink/60">
          Paste names, one per line. You&apos;ll get back a personal link for each guest to share.
        </p>
        <div className="mt-5">
          <InviteManager invites={invitesList} rsvpedCodes={Array.from(rsvpedCodes)} />
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-5xl">
        <h2 className="font-wordmark text-2xl font-bold text-ink">RSVPs</h2>
        <div className="mt-5 overflow-hidden rounded-xl border-[2px] border-ink/85 bg-white">
          <table className="w-full border-collapse font-display text-sm">
            <thead className="bg-tinted">
              <tr className="text-left text-ink/60">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {rsvpsList.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-ink/50">
                    No RSVPs yet.
                  </td>
                </tr>
              )}
              {rsvpsList.map((r) => (
                <tr key={r.id} className="border-t border-ink/10">
                  <td className="px-4 py-3 text-ink">{r.name}</td>
                  <td className="px-4 py-3 text-ink/70">{r.email ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ink/60">{r.code ?? "—"}</td>
                  <td className="px-4 py-3 text-ink/60">
                    {new Date(r.submitted_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
