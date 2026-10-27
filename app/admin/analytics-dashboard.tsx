"use client";
import { useEffect, useState } from "react";
import type { AnalyticsSummary } from "@/app/lib/analytics";

const duration = (seconds: number) => `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
type Report = AnalyticsSummary & {truncated: boolean; updatedAt: string};
export function AnalyticsDashboard() {
  const [days, setDays] = useState(7), [refresh, setRefresh] = useState(0);
  const [data, setData] = useState<Report | null>(null), [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/analytics?days=${days}`, {signal: controller.signal, cache: 'no-store'})
      .then(async response => { const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Unable to load analytics'); return result; })
      .then(result => {setData(result); setError('');})
      .catch(e => {if (e.name !== 'AbortError') setError(e.message);});
    return () => controller.abort();
  }, [days, refresh]);
  const panel = 'rounded-xl border-2 border-ink/20 bg-[var(--bg)] p-5';
  return <section className="mx-auto mt-10 max-w-5xl font-display text-ink" aria-label="Website analytics">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs uppercase tracking-[0.2em] text-ink/55">Audience overview</p><h2 className="mt-1 font-wordmark text-3xl font-bold">Website analytics</h2></div>
      <div className="flex items-center gap-3">
        <select aria-label="Analytics date range" className="rounded-lg border border-ink/30 bg-[var(--bg)] p-2" value={days} onChange={e => {setData(null); setError(''); setDays(Number(e.target.value));}}>
          {[7,30,90].map(n => <option key={n} value={n}>Last {n} days</option>)}
        </select>
        <button className="rounded-lg border border-ink/30 px-3 py-2" onClick={() => {setData(null); setError(''); setRefresh(n => n+1);}}>Refresh</button>
      </div>
    </div>
    <p className="mt-2 text-sm text-ink/60">Malaysia time · Admin visits excluded · Collection starts after setup</p>
    {error ? <p role="alert" className={`${panel} mt-5`}>{error}</p> : !data ? <p role="status" className="py-10">Loading analytics…</p> : <>
      {data.truncated && <p role="status" className="mt-4">Showing the latest 100,000 page views. Choose a shorter range for complete totals.</p>}
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
        {[
          ['Page views', data.views.toLocaleString()], ['Unique visitors', data.visitors.toLocaleString()], ['Sessions', data.sessions.toLocaleString()],
          ['Avg. active time / page', duration(data.averageTime)], ['Avg. active time / session', duration(data.averageSession)], ['Single-page sessions', `${data.bounceRate.toFixed(1)}%`],
        ].map(([label, value]) => <div className={panel} key={label}><p className="text-xs text-ink/60">{label}</p><p className="mt-2 text-2xl font-bold md:text-3xl">{value}</p></div>)}
      </div>
      {!data.views && <p className="mt-5 rounded-lg bg-[#78aaff]/15 p-4">No visits recorded in this period yet. Once configured, open a public page in a browser where you are not logged into admin.</p>}
      <div className={`${panel} mt-5`}><h3 className="font-bold">Daily page views</h3>
        <div className="mt-5 flex h-36 items-end gap-1" role="img" aria-label={data.daily.map(d => `${d.date}: ${d.views} views`).join(', ')}>
          {data.daily.map(d => <div key={d.date} title={`${d.date}: ${d.views} views`} className="min-w-0 flex-1 rounded-t bg-[#78aaff]" style={{height: `${Math.max(2, d.views / Math.max(1, ...data.daily.map(x => x.views)) * 100)}%`}} />)}
        </div><div className="mt-2 flex justify-between text-xs text-ink/60"><span>{data.daily[0]?.date}</span><span>{data.daily.at(-1)?.date}</span></div>
      </div>
      <div className={`${panel} mt-5 overflow-x-auto`}><h3 className="mb-4 font-bold">Pages</h3>
        <table className="w-full text-left text-sm"><thead><tr className="text-ink/60">{['Page path','Views','Visitors','Avg. active time'].map(t => <th key={t} className="p-2 font-normal">{t}</th>)}</tr></thead>
          <tbody>{data.pages.map(p => <tr key={p.path} className="border-t border-ink/10"><td className="p-2 break-all">{p.path}</td><td className="p-2">{p.views}</td><td className="p-2">{p.visitors}</td><td className="p-2 whitespace-nowrap">{duration(p.averageTime)}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">{[['Referring domains', data.referrers], ['Devices', data.devices]].map(([title, items]) => <div key={title as string} className={panel}><h3 className="mb-3 font-bold">{title as string}</h3>{(items as Report['devices']).slice(0, 15).map(item => <div key={item.name} className="flex justify-between gap-3 border-t border-ink/10 py-2 text-sm"><span className="break-all">{item.name}</span><span>{item.views.toLocaleString()}</span></div>)}</div>)}</div>
      <p className="mt-4 text-xs leading-relaxed text-ink/60">Visitors are estimated using a random browser ID. Sessions restart after 30 minutes of inactivity. Active time counts visible browsing, pauses after 60 seconds without interaction, and is sent every 15 seconds. Single-page sessions are calculated within the selected range. Blocking, privacy settings, or closing a browser can reduce recorded totals. Referrals and devices show page views.</p>
      <p className="mt-2 text-xs text-ink/60">Updated {new Date(data.updatedAt).toLocaleString('en-MY', {timeZone: 'Asia/Kuala_Lumpur'})}. FTSM Map requires the tracking script in its separate app.</p>
    </>}
  </section>;
}
