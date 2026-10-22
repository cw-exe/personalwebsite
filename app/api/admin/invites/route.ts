import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase-server";

export const runtime = "nodejs";

function slug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24) || "guest";
}

function randomSuffix(): string {
  // 6 hex chars — ~16M space, enough for a personal guest list
  return Array.from(crypto.getRandomValues(new Uint8Array(3)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const names: unknown = body?.names;
  if (!Array.isArray(names) || names.length === 0) {
    return NextResponse.json({ error: "no names" }, { status: 400 });
  }

  const rows = names
    .filter((n): n is string => typeof n === "string")
    .map((n) => n.trim())
    .filter((n) => n.length > 0 && n.length <= 120)
    .map((guest_name) => ({
      code: `${slug(guest_name)}-${randomSuffix()}`,
      guest_name,
    }));

  if (rows.length === 0) {
    return NextResponse.json({ error: "no valid names" }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("invites")
    .insert(rows)
    .select("code, guest_name, created_at");

  if (error) {
    console.error("invites insert failed", error);
    return NextResponse.json({ error: "could not create invites" }, { status: 500 });
  }

  return NextResponse.json({ created: data });
}
