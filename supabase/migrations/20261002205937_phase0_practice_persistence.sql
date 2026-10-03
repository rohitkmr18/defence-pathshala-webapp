-- ==============================================================================
-- Migration: 010_create_practice_sessions_and_extend_attempts.sql
-- Create practice_sessions table and extend user_attempts for session persistence
-- ==============================================================================

-- 1. Create practice_sessions table
create table if not exists public.practice_sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null default 'Practice Session',
    mode text not null default 'instant', -- 'instant' | 'attempt' | 'full_paper'
    filters jsonb not null default '{}'::jsonb,
    question_ids jsonb not null default '[]'::jsonb,
    current_index integer not null default 0 check (current_index >= 0),
    answers jsonb not null default '{}'::jsonb,
    is_completed boolean not null default false,
    total_questions integer not null default 0,
    correct_count integer not null default 0,
    incorrect_count integer not null default 0,
    time_spent_seconds integer not null default 0,
    started_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    completed_at timestamptz
);

-- Indexes for practice_sessions
create index if not exists idx_practice_sessions_user
    on public.practice_sessions(user_id);

create index if not exists idx_practice_sessions_user_active
    on public.practice_sessions(user_id, is_completed, updated_at desc);

-- 2. Extend user_attempts table with session_id and mode if not present
alter table public.user_attempts 
    add column if not exists session_id uuid references public.practice_sessions(id) on delete set null;

alter table public.user_attempts 
    add column if not exists mode text default 'instant';

-- Indexes on user_attempts for session and performance tracking
create index if not exists idx_attempts_session
    on public.user_attempts(session_id);

create index if not exists idx_attempts_user_correct
    on public.user_attempts(user_id, is_correct);

-- Enable RLS
alter table public.practice_sessions enable row level security;

-- Authenticated ownership; guest sessions stay in browser storage.
revoke all on public.practice_sessions from anon, authenticated;
grant select, insert, update on public.practice_sessions to authenticated;
grant all on public.practice_sessions to service_role;
create policy "Users can view own practice sessions" on public.practice_sessions
for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can insert own practice sessions" on public.practice_sessions
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can update own practice sessions" on public.practice_sessions
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "Users can view own attempts" on public.user_attempts
for select to authenticated using ((select auth.uid()) = user_id);
-- Attempts are server-scored through the Next.js API, never browser-inserted.
revoke all on public.user_attempts from anon, authenticated;
grant select on public.user_attempts to authenticated;

-- Enforce session ownership even for the privileged server write path.
create or replace function public.validate_attempt_session_owner()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.session_id is not null and not exists (
    select 1 from public.practice_sessions s where s.id = new.session_id and s.user_id = new.user_id
  ) then
    raise exception 'Attempt session must belong to the attempt user' using errcode = '23514';
  end if;
  return new;
end;
$$;
revoke execute on function public.validate_attempt_session_owner() from public, anon, authenticated;
create trigger validate_attempt_session_owner before insert or update of session_id, user_id
on public.user_attempts for each row execute function public.validate_attempt_session_owner();

