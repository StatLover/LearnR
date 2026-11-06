-- R Academy – optional account sync.
-- Run this once in the Supabase SQL editor, then set NEXT_PUBLIC_SUPABASE_URL
-- and NEXT_PUBLIC_SUPABASE_ANON_KEY. Each learner can only read and write
-- their own row (row level security).

create table if not exists public.learner_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.learner_progress enable row level security;

drop policy if exists "read own progress" on public.learner_progress;
create policy "read own progress" on public.learner_progress
  for select using (auth.uid() = user_id);

drop policy if exists "insert own progress" on public.learner_progress;
create policy "insert own progress" on public.learner_progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "update own progress" on public.learner_progress;
create policy "update own progress" on public.learner_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "delete own progress" on public.learner_progress;
create policy "delete own progress" on public.learner_progress
  for delete using (auth.uid() = user_id);
