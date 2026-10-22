import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  if (!code) return NextResponse.json({ ok: false }, { status: 400 });

  // Only stamp the first open — don't overwrite existing opened_at
  const { data } = await supabaseAdmin
    .from("invites")
    .select("code, opened_at")
    .eq("code", code)
    .maybeSingle();

  if (!data) return NextResponse.json({ ok: false });

  if (!data.opened_at) {
    await supabaseAdmin
      .from("invites")
      .update({ opened_at: new Date().toISOString() })
      .eq("code", code);
  }
  return NextResponse.json({ ok: true });
}
