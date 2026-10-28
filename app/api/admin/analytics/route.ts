import { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/app/lib/admin-session";
import { getSupabaseAdmin } from "@/app/lib/supabase-server";
import { summarizeAnalytics, type AnalyticsView } from "@/app/lib/analytics";

// Hosts allowed by the shared analytics table. "legacy" surfaces pre-host-column
// rows written by the earlier beacon; "all" merges every row regardless of host.
const HOSTS = ['all', 'chinwei.my', 'knowyourmpp.site', 'knowyourmppukm.chinwei.my', 'legacy'] as const;
type HostFilter = (typeof HOSTS)[number];

export async function GET(req: NextRequest) {
  if (!await verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) return Response.json({error: 'Unauthorized'}, {status: 401});
  const days = Number(req.nextUrl.searchParams.get('days') || 7);
  if (![7, 30, 90].includes(days)) return Response.json({error: 'Invalid date range'}, {status: 400});
  const hostParam = (req.nextUrl.searchParams.get('host') || 'all') as HostFilter;
  if (!HOSTS.includes(hostParam)) return Response.json({error: 'Invalid host filter'}, {status: 400});
  const now = new Date();
  // Malaysia midnight, including today and the preceding days.
  const localDate = now.toLocaleDateString('en-CA', {timeZone: 'Asia/Kuala_Lumpur'});
  const start = new Date(new Date(`${localDate}T00:00:00+08:00`).getTime() - (days - 1) * 86400000).toISOString();
  try {
    const rows: AnalyticsView[] = [];
    let truncated = false;
    for (let offset = 0; offset <= 100000; offset += 1000) {
      let query = getSupabaseAdmin().from('analytics_views')
        .select('id,visitor_id,session_id,path,referrer,device,created_at,active_seconds,host')
        .gte('created_at', start).lte('created_at', now.toISOString())
        .order('created_at', {ascending: false}).order('id').range(offset, offset + 999);
      if (hostParam === 'legacy') query = query.is('host', null);
      else if (hostParam !== 'all') query = query.eq('host', hostParam);
      const {data, error} = await query;
      if (error) throw error;
      if (offset === 100000) { truncated = !!data?.length; break; }
      rows.push(...(data || []));
      if (!data || data.length < 1000) break;
    }
    return Response.json({...summarizeAnalytics(rows, days, now), truncated, host: hostParam, updatedAt: now.toISOString()}, {headers: {'Cache-Control': 'no-store'}});
  } catch {
    return Response.json({error: 'Analytics unavailable. Apply the host-column migration (knowyourmpp repo: supabase/migrations/0013_analytics_host_tracking.sql) on the shared Supabase project.'}, {status: 503});
  }
}
