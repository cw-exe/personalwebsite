import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase-server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const code = typeof body?.code === "string" ? body.code.trim() : null;

  if (!name || name.length > 120) {
    return NextResponse.json({ error: "invalid name" }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin().from("rsvps").insert({
    name,
    email,
    code: code || null,
  });

  if (error) {
    console.error("rsvp insert failed", error);
    return NextResponse.json({ error: "could not save rsvp" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
