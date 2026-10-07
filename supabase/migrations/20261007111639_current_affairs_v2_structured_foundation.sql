alter table public.current_affairs_posts
  add column if not exists content_version integer not null default 1,
  add column if not exists updated_at timestamptz not null default now();

alter table public.current_affairs_stories
  add column if not exists what_happened text,
  add column if not exists why_it_matters text,
  add column if not exists key_facts jsonb not null default '[]'::jsonb,
  add column if not exists conceptual_linkage text,
  add column if not exists static_link text,
  add column if not exists exam_tags text[] not null default '{}'::text[],
  add column if not exists source_name text,
  add column if not exists source_url text,
  add column if not exists source_date date,
  add column if not exists content_hash text,
  add column if not exists updated_at timestamptz not null default now();

alter table public.current_affairs_mcqs
  add column if not exists question_number integer,
  add column if not exists subject text,
  add column if not exists topic text,
  add column if not exists subtopic text,
  add column if not exists concept text,
  add column if not exists exam_tags text[] not null default '{}'::text[],
  add column if not exists question_type text,
  add column if not exists exam_edge text,
  add column if not exists mock_eligible boolean not null default true,
  add column if not exists content_status text not null default 'GENERATED',
  add column if not exists source_url text,
  add column if not exists updated_at timestamptz not null default now();

alter table public.current_affairs_mcqs
  alter column correct_option set not null;

alter table public.current_affairs_mcqs
  add constraint current_affairs_mcqs_correct_option_check check (correct_option in ('A','B','C','D')),
  add constraint current_affairs_mcqs_content_status_check check (content_status in ('GENERATED','VALIDATED','REVIEW_REQUIRED','VERIFIED')),
  add constraint current_affairs_mcqs_difficulty_check check (difficulty is null or difficulty in ('Easy','Moderate','Hard'));

alter table public.current_affairs_stories
  add constraint current_affairs_stories_key_facts_array_check check (jsonb_typeof(key_facts) = 'array');

create unique index if not exists current_affairs_stories_post_story_number_uidx
  on public.current_affairs_stories(post_id, story_number);
create unique index if not exists current_affairs_stories_content_hash_uidx
  on public.current_affairs_stories(content_hash) where content_hash is not null;
create unique index if not exists current_affairs_mcqs_story_question_number_uidx
  on public.current_affairs_mcqs(story_id, question_number) where question_number is not null;
create index if not exists current_affairs_posts_published_date_idx
  on public.current_affairs_posts(published, date desc);
create index if not exists current_affairs_stories_subject_topic_idx
  on public.current_affairs_stories(subject, topic);
create index if not exists current_affairs_mcqs_mock_pool_idx
  on public.current_affairs_mcqs(mock_eligible, content_status, subject, topic);

alter table public.current_affairs_mcqs enable row level security;

create policy "Read published mcqs"
on public.current_affairs_mcqs
for select to public
using (
  exists (
    select 1
    from public.current_affairs_stories s
    join public.current_affairs_posts p on p.id = s.post_id
    where s.id = current_affairs_mcqs.story_id
      and p.published = true
  )
);

create table public.current_affairs_quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mcq_id uuid not null references public.current_affairs_mcqs(id) on delete cascade,
  selected_option text not null check (selected_option in ('A','B','C','D')),
  is_correct boolean not null,
  time_taken integer check (time_taken is null or time_taken >= 0),
  attempted_at timestamptz not null default now()
);

alter table public.current_affairs_quiz_attempts enable row level security;

create policy "Users can read own current affairs attempts"
on public.current_affairs_quiz_attempts
for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own current affairs attempts"
on public.current_affairs_quiz_attempts
for insert to authenticated
with check ((select auth.uid()) = user_id);

create index current_affairs_quiz_attempts_user_date_idx
  on public.current_affairs_quiz_attempts(user_id, attempted_at desc);
create index current_affairs_quiz_attempts_mcq_idx
  on public.current_affairs_quiz_attempts(mcq_id);
