-- Migration: 001_create_waitlist
-- Description: Creates the waitlist table for Orqestra OS signups

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  company text,
  use_case text,
  source text not null default 'direct',
  created_at timestamptz not null default now()
);

-- Email must be unique
create unique index if not exists idx_waitlist_email on public.waitlist (lower(email));

-- Index for sorting by creation date
create index if not exists idx_waitlist_created_at on public.waitlist (created_at desc);

-- Index for source breakdown queries
create index if not exists idx_waitlist_source on public.waitlist (source);

-- Enable Row Level Security
alter table public.waitlist enable row level security;

-- Allow anonymous inserts only
create policy "Allow anonymous insert" on public.waitlist
  for insert
  to anon
  with check (true);

-- Only service_role key can read/update/delete
create policy "Allow service role read" on public.waitlist
  for select
  to service_role
  using (true);

create policy "Allow service role delete" on public.waitlist
  for delete
  to service_role
  using (true);
