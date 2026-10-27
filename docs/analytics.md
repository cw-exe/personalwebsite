# Website analytics

## Enable collection

1. Run `supabase/migrations/202610270001_analytics.sql` in the existing Supabase project's SQL editor (or through your Supabase migration workflow).
2. Deploy this repository using its existing Vercel deployment. It uses the existing `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and admin session configuration; no new credentials are needed.
3. Open a public page in a browser that is not logged into admin. Visit another page, interact for at least 15 seconds, then inspect `/admin` and press Refresh.

The migration enables RLS with no public policies. Only the server's service role can read/write analytics. An unavailable database produces an actionable dashboard error; collection failures do not interrupt browsing. No historical analytics can be recovered.

## FTSM Map integration (separate repository)

Vercel rewrites `/ftsm-map` to `ftsmmap-app.vercel.app`; the portfolio layout does not run on those responses. Add this script once in that app's root layout / HTML:

```html
<script defer src="https://chinwei.my/analytics.js"></script>
```

For Next.js, use `next/script` with `src="https://chinwei.my/analytics.js"` and `strategy="afterInteractive"`.

Deploy that app, then test through **https://chinwei.my/ftsm-map**. It records the actual visible pathname (including subpages). Direct visits to the upstream Vercel domain are intentionally rejected by the same-origin collector. No rewrite changes are needed. Until the upstream script is installed, map visits and durations are not recorded.

## Definitions and limits

- Page views: a document load or pathname change, including History API navigation. Query strings and hash changes do not generate extra views. Reloads count as new views.
- Visitors: random browser IDs in localStorage, not identified people. Clearing storage or changing browsers creates another visitor. Storage-disabled browsers use a temporary ID.
- Sessions: tab-scoped sessionStorage ID, renewed after 30 minutes without interaction. Separate tabs may count as separate sessions. Duration is accumulated active time across views in the selected period.
- Active time: visible browsing with interaction in the last 60 seconds. Cumulative updates every 15 seconds and on hide/exit; the database uses the maximum value so duplicates and out-of-order beacons do not inflate time. Closing the browser abruptly can lose the last update.
- Single-page sessions: percentage of sessions with one recorded view within the selected range (not an engagement-based bounce rate).
- Dates: calendar days in Asia/Kuala_Lumpur, including today. Admin refresh is manual. Reports cap at 100,000 views and explicitly disclose truncation.
- Referrers: referring hostname only, per document; internal domains can appear. No full referrer URLs, query strings, IP addresses, or raw user agents are stored. Device categories are inferred from the request's user agent.
- Admin routes, authenticated admin traffic, common bots, DNT and Global Privacy Control requests are excluded. Ad blockers and missing JavaScript reduce coverage.
- This is first-party browser telemetry, not audited traffic. Same-origin validation and bounded payloads reduce accidental misuse, but clients can spoof events. For high-volume/public abuse, configure rate limiting in the hosting firewall.
- Data is retained until deleted. To enforce a retention period, schedule `delete from public.analytics_views where created_at < now() - interval '90 days';` in your database. Include the use of browser IDs and analytics in the site's privacy information.
