-- ==========================================
-- Migration: create_user_attempts
-- Student Attempt History
-- ==========================================

create table public.user_attempts (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    question_id uuid not null
        references public.questions(id)
        on delete cascade,

    selected_option text not null,

    is_correct boolean not null,

    time_taken integer
        check (time_taken is null or time_taken >= 0),

    attempt_number integer not null default 1
        check (attempt_number >= 1),

    attempted_at timestamptz default now()
);

create index idx_attempts_user
    on public.user_attempts(user_id);

create index idx_attempts_user_time
    on public.user_attempts(user_id, attempted_at);

create index idx_attempts_question
    on public.user_attempts(question_id);

alter table public.user_attempts enable row level security;