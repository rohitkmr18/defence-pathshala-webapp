-- Add the exam cycle used by question-bank analytics and imports.

alter table public.questions
add column if not exists cycle text;