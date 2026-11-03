import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const rawName = typeof body?.name === "string" ? body.name.trim() : "";
  const anonymous = body?.anonymous === true;

  if (!message || message.length > 2000) {
    return NextResponse.json({ error: "invalid message" }, { status: 400 });
  }

  const sender_name = anonymous || !rawName ? null : rawName.slice(0, 80);

  const { error } = await getSupabaseAdmin().from("feedbacks").insert({
    sender_name,
    message,
  });

  if (error) {
    console.error("feedback insert failed", error);
    return NextResponse.json({ error: "could not save feedback" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
