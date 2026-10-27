import { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/app/lib/admin-session";
import { getSupabaseAdmin } from "@/app/lib/supabase-server";
import { summarizeAnalytics, type AnalyticsView } from "@/app/lib/analytics";

export async function GET(req: NextRequest) {
  if (!await verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) return Response.json({error: 'Unauthorized'}, {status: 401});
  const days = Number(req.nextUrl.searchParams.get('days') || 7);
  if (![7, 30, 90].includes(days)) return Response.json({error: 'Invalid date range'}, {status: 400});
  const now = new Date();
  // Malaysia midnight, including today and the preceding days.
  const localDate = now.toLocaleDateString('en-CA', {timeZone: 'Asia/Kuala_Lumpur'});
  const start = new Date(new Date(`${localDate}T00:00:00+08:00`).getTime() - (days - 1) * 86400000).toISOString();
  try {
    const rows: AnalyticsView[] = [];
    let truncated = false;
    for (let offset = 0; offset <= 100000; offset += 1000) {
      const {data, error} = await getSupabaseAdmin().from('analytics_views')
        .select('id,visitor_id,session_id,path,referrer,device,created_at,active_seconds')
        .gte('created_at', start).lte('created_at', now.toISOString())
        .order('created_at', {ascending: false}).order('id').range(offset, offset + 999);
      if (error) throw error;
      if (offset === 100000) { truncated = !!data?.length; break; }
      rows.push(...(data || []));
      if (!data || data.length < 1000) break;
    }
    return Response.json({...summarizeAnalytics(rows, days, now), truncated, updatedAt: now.toISOString()}, {headers: {'Cache-Control': 'no-store'}});
  } catch {
    return Response.json({error: 'Analytics unavailable. Check the Supabase connection and apply supabase/migrations/202610270001_analytics.sql.'}, {status: 503});
  }
}
