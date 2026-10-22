import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  SESSION_COOKIE_OPTIONS,
  createSessionToken,
  timingSafeEqualString,
} from "@/app/lib/admin-session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json({ error: "admin not configured" }, { status: 500 });
  }
  if (!timingSafeEqualString(password, expected)) {
    return NextResponse.json({ error: "wrong password" }, { status: 401 });
  }
  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, SESSION_COOKIE_OPTIONS);
  return res;
}
