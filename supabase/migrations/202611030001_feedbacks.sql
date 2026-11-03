create table public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  sender_name text,
  message text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index feedbacks_created_at_idx on public.feedbacks(created_at desc);
alter table public.feedbacks enable row level security;
revoke all on public.feedbacks from anon, authenticated;
