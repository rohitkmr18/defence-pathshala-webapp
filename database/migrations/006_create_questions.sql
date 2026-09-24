-- ==========================================
-- Migration: 006_create_questions.sql
-- Defence Pathshala PYQ Intelligence
-- ==========================================

create extension if not exists pgcrypto;

create table if not exists public.questions (
    id uuid primary key default gen_random_uuid(),

    question_number integer not null,

    exam text not null,
    year integer not null,
    paper text,

    subject text not null,
    topic text not null,
    subtopic text,

    competency text,
    bloom_level text,

    expected_correctness numeric(5,2),
    difficulty_score numeric(5,2),
    difficulty_category text,

    e_score integer,
    s_score integer,
    a_score integer,
    c_score integer,

    question_text text not null,

    option_a text not null,
    option_b text not null,
    option_c text not null,
    option_d text not null,

    official_answer text not null,
    llm_answer text,
    explanation text,

    created_at timestamptz default now(),

    -- Prevent duplicate questions
    constraint questions_exam_year_number_unique
        unique (exam, year, question_number)
);

create index if not exists idx_questions_exam_year
    on public.questions(exam, year);

create index if not exists idx_questions_subject_topic
    on public.questions(subject, topic);

create index if not exists idx_questions_difficulty
    on public.questions(difficulty_score);

alter table public.questions enable row level security;