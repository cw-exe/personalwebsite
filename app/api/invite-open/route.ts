import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  if (!code) return NextResponse.json({ ok: false }, { status: 400 });

  const supabase = getSupabaseAdmin();

  const { data } = await supabase
    .from("invites")
    .select("code, opened_at")
    .eq("code", code)
    .maybeSingle();

  if (!data) return NextResponse.json({ ok: false });

  if (!data.opened_at) {
    await supabase
      .from("invites")
      .update({ opened_at: new Date().toISOString() })
      .eq("code", code);
  }
  return NextResponse.json({ ok: true });
}
