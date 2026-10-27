create table public.analytics_views (
  id uuid primary key,
  visitor_id uuid not null,
  session_id uuid not null,
  path text not null,
  referrer text not null default 'Direct',
  device text not null,
  created_at timestamptz not null default now(),
  active_seconds integer not null default 0 check (active_seconds between 0 and 86400)
);
create index analytics_views_created_at_idx on public.analytics_views(created_at);
alter table public.analytics_views enable row level security;
revoke all on public.analytics_views from anon, authenticated;

-- Cumulative updates are idempotent and safe when beacons arrive out of order.
create function public.record_analytics_view(
  p_id uuid, p_visitor uuid, p_session uuid, p_path text,
  p_referrer text, p_device text, p_seconds integer
) returns void language sql security invoker set search_path = public as $$
  insert into analytics_views(id, visitor_id, session_id, path, referrer, device, active_seconds)
  values(p_id, p_visitor, p_session, p_path, p_referrer, p_device, p_seconds)
  on conflict(id) do update set active_seconds = greatest(analytics_views.active_seconds, excluded.active_seconds)
  where analytics_views.session_id = excluded.session_id;
$$;
revoke all on function public.record_analytics_view(uuid,uuid,uuid,text,text,text,integer) from public, anon, authenticated;
grant execute on function public.record_analytics_view(uuid,uuid,uuid,text,text,text,integer) to service_role;
