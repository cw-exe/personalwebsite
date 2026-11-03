import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase-server";

export const runtime = "nodejs";

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  const read = body?.read === true;
  if (!id) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  const { error } = await getSupabaseAdmin()
    .from("feedbacks")
    .update({ read_at: read ? new Date().toISOString() : null })
    .eq("id", id);

  if (error) {
    console.error("feedback update failed", error);
    return NextResponse.json({ error: "could not update" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  const { error } = await getSupabaseAdmin().from("feedbacks").delete().eq("id", id);
  if (error) {
    console.error("feedback delete failed", error);
    return NextResponse.json({ error: "could not delete" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
