import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase-server";
import { ADMIN_COOKIE, verifySessionToken } from "@/app/lib/admin-session";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin || origin !== req.nextUrl.origin) return new Response(null, {status: 403});
  const agent = req.headers.get("user-agent") || "";
  if (/bot|crawler|spider|headless/i.test(agent) || req.headers.get("dnt") === "1" || req.headers.get("sec-gpc") === "1") return new Response(null, {status: 204});
  if (await verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) return new Response(null, {status: 204});
  // Bound streamed input, including requests without a Content-Length header.
  const reader = req.body?.getReader();
  if (!reader) return new Response(null, {status: 400});
  let raw = "", size = 0;
  const decoder = new TextDecoder();
  while (true) {
    const {value, done} = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 2048) { await reader.cancel(); return new Response(null, {status: 413}); }
    raw += decoder.decode(value, {stream: true});
  }
  let body;
  try { body = JSON.parse(raw + decoder.decode()); } catch { return new Response(null, {status: 400}); }
  if (!body || ![body.id, body.visitor, body.session].every(v => typeof v === "string" && uuid.test(v)) ||
      typeof body.path !== "string" || body.path.length > 300 || !/^\/(?!\/)[^?#\s]*$/.test(body.path) ||
      /^\/(admin|api)(\/|$)/.test(body.path) || !Number.isInteger(body.seconds) || body.seconds < 0 || body.seconds > 86400) {
    return new Response(null, {status: 400});
  }
  const referrer = typeof body.referrer === "string" && /^[a-z0-9.-]{1,253}$/i.test(body.referrer) ? body.referrer : "Direct";
  const host = typeof body.host === "string" && /^[a-z0-9.-]{1,253}$/i.test(body.host) ? body.host : null;
  const device = /ipad|tablet/i.test(agent) ? "Tablet" : /mobile|android/i.test(agent) ? "Mobile" : "Desktop";
  try {
    const {error} = await getSupabaseAdmin().rpc("record_analytics_view_v2", {
      p_id: body.id, p_visitor: body.visitor, p_session: body.session, p_path: body.path,
      p_referrer: referrer, p_device: device, p_seconds: body.seconds, p_host: host,
    });
    if (error) throw error;
    return new Response(null, {status: 204});
  } catch { return new Response(null, {status: 503}); }
}
