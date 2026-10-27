export type AnalyticsView = { id: string; visitor_id: string; session_id: string; path: string; referrer: string; device: string; created_at: string; active_seconds: number };
export function summarizeAnalytics(rows: AnalyticsView[], days: number, now = new Date()) {
  const sessions = new Map<string, number>();
  const daily = new Map<string, number>();
  const day = (date: Date) => date.toLocaleDateString('en-CA', {timeZone: 'Asia/Kuala_Lumpur'});
  for (let i = days - 1; i >= 0; i--) daily.set(day(new Date(now.getTime() - i * 86400000)), 0);
  const pages = new Map<string, {path: string; views: number; seconds: number; visitors: Set<string>}>();
  const referrers = new Map<string, number>(), devices = new Map<string, number>();
  let seconds = 0;
  for (const row of rows) {
    sessions.set(row.session_id, (sessions.get(row.session_id) || 0) + 1);
    const date = day(new Date(row.created_at));
    daily.set(date, (daily.get(date) || 0) + 1);
    const page = pages.get(row.path) || {path: row.path, views: 0, seconds: 0, visitors: new Set<string>()};
    page.views++; page.seconds += row.active_seconds; page.visitors.add(row.visitor_id); pages.set(row.path, page);
    referrers.set(row.referrer, (referrers.get(row.referrer) || 0) + 1);
    devices.set(row.device, (devices.get(row.device) || 0) + 1);
    seconds += row.active_seconds;
  }
  const ranked = (map: Map<string, number>) => Array.from(map, ([name, views]) => ({name, views})).sort((a,b) => b.views-a.views);
  return {
    views: rows.length, visitors: new Set(rows.map(r => r.visitor_id)).size, sessions: sessions.size,
    averageTime: rows.length ? seconds / rows.length : 0,
    averageSession: sessions.size ? seconds / sessions.size : 0,
    bounceRate: sessions.size ? Array.from(sessions.values()).filter(n => n === 1).length / sessions.size * 100 : 0,
    daily: Array.from(daily, ([date, views]) => ({date, views})),
    pages: Array.from(pages.values(), p => ({path: p.path, views: p.views, visitors: p.visitors.size, averageTime: p.seconds / p.views})).sort((a,b) => b.views-a.views),
    referrers: ranked(referrers), devices: ranked(devices),
  };
}
export type AnalyticsSummary = ReturnType<typeof summarizeAnalytics>;
