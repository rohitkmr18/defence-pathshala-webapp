-- ==========================================
-- Migration: create_questions
-- Defence Pathshala PYQ Intelligence
-- Canonical 29-column schema
-- ==========================================

create extension if not exists pgcrypto;

create table public.questions (

    -- Primary key (internal database ID)
    id uuid primary key default gen_random_uuid(),

    -- Canonical dataset columns (29)

    question_id text not null,

    exam text not null,
    year integer not null,
    cycle text,
    paper text,

    q_num integer not null,

    subject text not null,
    topic text not null,
    subtopic text,
    theme text,

    question text not null,

    opt_a text not null,
    opt_b text not null,
    opt_c text not null,
    opt_d text not null,

    q_type text,
    q_pattern text,

    llm_opt text,
    official_opt text,
    final_opt text,

    key_discrepancy boolean default false,

    explanation text,

    source text,

    is_negative boolean default true,

    tags text,

    verified_status text,

    static_current_link text,

    difficulty_score numeric(5,2),

    difficulty_category text,

    created_at timestamptz default now(),

    constraint questions_question_id_unique
        unique(question_id),

    constraint questions_exam_year_qnum_unique
        unique(exam, year, cycle, q_num)
);

-- =========================
-- Performance indexes
-- =========================

create index idx_questions_exam_year
    on public.questions(exam, year);

create index idx_questions_exam_cycle_year
    on public.questions(exam, cycle, year);

create index idx_questions_subject_topic
    on public.questions(subject, topic);

create index idx_questions_topic_subtopic
    on public.questions(topic, subtopic);

create index idx_questions_difficulty
    on public.questions(difficulty_score);

create index idx_questions_pattern
    on public.questions(q_pattern);

create index idx_questions_verified
    on public.questions(verified_status);

-- Enable RLS
alter table public.questions enable row level security;