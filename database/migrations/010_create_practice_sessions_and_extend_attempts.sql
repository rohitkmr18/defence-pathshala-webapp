-- ==============================================================================
-- Migration: 010_create_practice_sessions_and_extend_attempts.sql
-- Create practice_sessions table and extend user_attempts for session persistence
-- ==============================================================================

-- 1. Create practice_sessions table
create table if not exists public.practice_sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
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

-- Policies for practice_sessions
create policy "Users can view own practice sessions"
    on public.practice_sessions for select
    using (auth.uid() = user_id);

create policy "Users can insert own practice sessions"
    on public.practice_sessions for insert
    with check (auth.uid() = user_id or user_id is null);

create policy "Users can update own practice sessions"
    on public.practice_sessions for update
    using (auth.uid() = user_id or user_id is null);

-- Policies for user_attempts
create policy "Users can view own attempts"
    on public.user_attempts for select
    using (auth.uid() = user_id);

create policy "Users can insert own attempts"
    on public.user_attempts for insert
    with check (auth.uid() = user_id or user_id is null);
