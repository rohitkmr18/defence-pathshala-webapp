-- P1.2 AFCAT isolated foundation. Review/staging-test before applying to production.
-- No existing CDS/CAPF/UPSC tables are modified.
begin;

create table public.afcat_questions (
 id uuid primary key default gen_random_uuid(),
 external_id text not null unique,
 pool_type text not null check (pool_type in ('SECTIONAL','FULL_MOCK')),
 section text not null check (section in ('ENGLISH','GENERAL_AWARENESS','NUMERICAL_ABILITY','REASONING_MILITARY_APTITUDE')),
 topic text not null, subtopic text,
 stem jsonb not null check (jsonb_typeof(stem)='object'),
 options jsonb not null check (jsonb_typeof(options)='array' and jsonb_array_length(options)=4),
 correct_option text not null check (correct_option in ('A','B','C','D')),
 explanation jsonb not null check (jsonb_typeof(explanation)='object'),
 difficulty text not null check (difficulty in ('EASY','MODERATE','HARD')),
 source_kind text not null check (source_kind in ('OFFICIAL_MODEL','MEMORY_RECONSTRUCTED','ORIGINAL')),
 source_reference text, source_rights_status text not null default 'REVIEW_REQUIRED',
 fingerprint_sha256 text not null unique check (fingerprint_sha256 ~ '^[a-f0-9]{64}$'),
 content_version integer not null default 1 check (content_version>0),
 editorial_status text not null default 'DRAFT' check (editorial_status in ('DRAFT','REVIEW_REQUIRED','APPROVED','WITHHELD')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.afcat_question_assets (
 id uuid primary key default gen_random_uuid(),
 question_id uuid not null references public.afcat_questions(id) on delete restrict,
 placement text not null check (placement in ('STEM','OPTION_A','OPTION_B','OPTION_C','OPTION_D','EXPLANATION')),
 storage_path text not null unique,
 mime_type text not null check (mime_type in ('image/svg+xml','image/png','image/webp')),
 alt_text text not null,
 sha256 text not null check (sha256 ~ '^[a-f0-9]{64}$'),
 reviewed boolean not null default false,
 created_at timestamptz not null default now()
);
create table public.afcat_tests (
 id uuid primary key default gen_random_uuid(),
 code text not null unique,
 kind text not null check (kind in ('SECTIONAL','FULL_MOCK')),
 section text check (section in ('ENGLISH','GENERAL_AWARENESS','NUMERICAL_ABILITY','REASONING_MILITARY_APTITUDE')),
 title text not null,
 duration_seconds integer not null check (duration_seconds>0),
 expected_questions integer not null check (expected_questions between 1 and 100),
 max_marks integer not null check (max_marks=expected_questions*3),
 status text not null default 'DRAFT' check (status in ('DRAFT','READY','PUBLISHED','RETIRED')),
 release_version integer not null default 1 check (release_version>0),
 created_at timestamptz not null default now(),
 check ((kind='FULL_MOCK' and section is null and expected_questions=100 and duration_seconds=7200)
 or (kind='SECTIONAL' and section is not null))
);
create table public.afcat_test_items (
 test_id uuid not null references public.afcat_tests(id) on delete restrict,
 question_id uuid not null unique references public.afcat_questions(id) on delete restrict,
 position integer not null check (position>0),
 question_content_version integer not null check (question_content_version>0),
 primary key (test_id,position)
);
create table public.afcat_sessions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete restrict,
 test_id uuid not null references public.afcat_tests(id) on delete restrict,
 test_release_version integer not null check (test_release_version>0),
 current_position integer not null default 1 check (current_position>0),
 status text not null default 'IN_PROGRESS' check (status in ('IN_PROGRESS','SUBMITTED','EXPIRED')),
 elapsed_seconds integer not null default 0 check (elapsed_seconds>=0),
 started_at timestamptz not null default now(), finished_at timestamptz,
 unique (id,user_id)
);
create table public.afcat_responses (
 id uuid primary key default gen_random_uuid(),
 session_id uuid not null references public.afcat_sessions(id) on delete restrict,
 user_id uuid not null references auth.users(id) on delete restrict,
 question_id uuid not null references public.afcat_questions(id) on delete restrict,
 selected_option text check (selected_option in ('A','B','C','D')),
 marked_for_review boolean not null default false,
 time_spent_seconds integer not null default 0 check (time_spent_seconds>=0),
 answered_at timestamptz,
 unique (session_id,question_id),
 foreign key (session_id,user_id) references public.afcat_sessions(id,user_id) on delete restrict
);

create index afcat_questions_section_pool_idx on public.afcat_questions(pool_type,section,editorial_status);
create index afcat_items_test_idx on public.afcat_test_items(test_id,position);
create index afcat_assets_question_idx on public.afcat_question_assets(question_id);
create index afcat_sessions_owner_idx on public.afcat_sessions(user_id,started_at desc);
create index afcat_responses_session_idx on public.afcat_responses(session_id);

-- Independently enforce the assigned pool, section, approved content and version.
create function public.afcat_validate_assignment() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare
 t record; q record;
begin
 select kind,section,status into t from public.afcat_tests where id=new.test_id for update;
 select pool_type,section,editorial_status,content_version into q from public.afcat_questions where id=new.question_id;
 if t is null or q is null then raise exception 'AFCAT test or question missing'; end if;
 if t.status not in ('DRAFT','READY') then raise exception 'AFCAT published test is immutable'; end if;
 if q.editorial_status <> 'APPROVED' or q.pool_type <> t.kind or
    (t.kind='SECTIONAL' and q.section <> t.section) or
    q.content_version <> new.question_content_version
 then raise exception 'AFCAT question assignment violates content or pool contract'; end if;
 return new;
end; $$;
create trigger afcat_assignment_gate before insert or update on public.afcat_test_items
for each row execute function public.afcat_validate_assignment();

-- Test publication must be a transactionally checked transition, never a status flip.
create function public.afcat_validate_publication() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare
 n integer; minpos integer; maxpos integer; sections integer;
begin
 if tg_op='UPDATE' and old.status in ('PUBLISHED','RETIRED') then
   if row(new.*) is distinct from row(old.*) then
     if old.status='PUBLISHED' and new.status='RETIRED' and
       (new.id,new.code,new.kind,new.section,new.title,new.duration_seconds,new.expected_questions,new.max_marks,new.release_version,new.created_at)
       is not distinct from
       (old.id,old.code,old.kind,old.section,old.title,old.duration_seconds,old.expected_questions,old.max_marks,old.release_version,old.created_at)
     then return new; end if;
     raise exception 'Published/retired AFCAT test cannot be edited';
   end if;
 end if;
 if new.status='PUBLISHED' and (tg_op='INSERT' or old.status is distinct from 'PUBLISHED') then
   select count(*),min(position),max(position),count(distinct q.section)
     into n,minpos,maxpos,sections
   from public.afcat_test_items i join public.afcat_questions q on q.id=i.question_id
   where i.test_id=new.id and q.editorial_status='APPROVED' and q.content_version=i.question_content_version
     and q.pool_type=new.kind and (new.kind='FULL_MOCK' or q.section=new.section);
   if n<>new.expected_questions or minpos<>1 or maxpos<>new.expected_questions then
     raise exception 'Cannot publish AFCAT test: incomplete or noncontiguous approved question set';
   end if;
   if new.kind='FULL_MOCK' and sections<>4 then
     raise exception 'Cannot publish AFCAT full mock without all four sections';
   end if;
 end if;
 return new;
end; $$;
create trigger afcat_publication_gate before insert or update on public.afcat_tests
for each row execute function public.afcat_validate_publication();

-- Prevent modifications to the content or assets of any published assigned question.
create function public.afcat_guard_published_question() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
 if exists(select 1 from public.afcat_test_items i join public.afcat_tests t on t.id=i.test_id
           where i.question_id=old.id and t.status in ('PUBLISHED','RETIRED')) then
   raise exception 'Cannot modify AFCAT question associated with a published test';
 end if;
 return new;
end; $$;
create trigger afcat_question_freeze before update or delete on public.afcat_questions
for each row execute function public.afcat_guard_published_question();

alter table public.afcat_questions enable row level security;
alter table public.afcat_question_assets enable row level security;
alter table public.afcat_tests enable row level security;
alter table public.afcat_test_items enable row level security;
alter table public.afcat_sessions enable row level security;
alter table public.afcat_responses enable row level security;

revoke all on public.afcat_questions,public.afcat_question_assets,public.afcat_tests,
  public.afcat_test_items,public.afcat_sessions,public.afcat_responses from anon,authenticated;
grant select on public.afcat_tests to anon,authenticated;
grant select on public.afcat_sessions,public.afcat_responses to authenticated;

create policy afcat_published_catalogue on public.afcat_tests for select
to anon,authenticated using (status='PUBLISHED');
create policy afcat_own_sessions on public.afcat_sessions for select
to authenticated using ((select auth.uid())=user_id);
create policy afcat_own_responses on public.afcat_responses for select
to authenticated using ((select auth.uid())=user_id);


-- Freeze DELETE operations on assignments, and edits to images after publication.
create function public.afcat_guard_assignment_delete() returns trigger
language plpgsql security invoker set search_path = '' as $
declare s text;
begin
 select status into s from public.afcat_tests where id=old.test_id for update;
 if s in ('PUBLISHED','RETIRED') then raise exception 'Published AFCAT assignment is immutable'; end if;
 return old;
end; $;
create trigger afcat_assignment_delete_guard before delete on public.afcat_test_items
for each row execute function public.afcat_guard_assignment_delete();

create function public.afcat_guard_assets() returns trigger
language plpgsql security invoker set search_path = '' as $
declare qid uuid;
begin
 qid := case when tg_op='DELETE' then old.question_id else new.question_id end;
 if tg_op='UPDATE' and new.question_id is distinct from old.question_id then
   if exists (select 1 from public.afcat_test_items i join public.afcat_tests t on t.id=i.test_id
              where i.question_id=old.question_id and t.status in ('PUBLISHED','RETIRED')) then
     raise exception 'Cannot reassign published AFCAT asset';
   end if;
 end if;
 if exists (select 1 from public.afcat_test_items i join public.afcat_tests t on t.id=i.test_id
            where i.question_id=qid and t.status in ('PUBLISHED','RETIRED')) then
   raise exception 'Published AFCAT artwork is immutable';
 end if;
 return case when tg_op='DELETE' then old else new end;
end; $;
create trigger afcat_asset_freeze before insert or update or delete on public.afcat_question_assets
for each row execute function public.afcat_guard_assets();

-- Every saved response must refer to a question in the user's assigned test.
create function public.afcat_validate_response() returns trigger
language plpgsql security invoker set search_path = '' as $
declare assigned boolean;
begin
 select exists(
   select 1 from public.afcat_sessions s
   join public.afcat_test_items i on i.test_id=s.test_id and i.question_id=new.question_id
   where s.id=new.session_id and s.user_id=new.user_id and s.status='IN_PROGRESS'
 ) into assigned;
 if not assigned then raise exception 'Question not assigned to an active AFCAT session'; end if;
 return new;
end; $;
create trigger afcat_response_gate before insert or update on public.afcat_responses
for each row execute function public.afcat_validate_response();

-- Prevent tests from changing the scoring blueprint after publication.
-- The release process separately checks the global product quotas and exact counts.
create function public.afcat_validate_full_mock_sections() returns trigger
language plpgsql security invoker set search_path = '' as $
declare english_count integer; ga_count integer; numerical_count integer; reasoning_count integer;
begin
 if new.status='PUBLISHED' and (tg_op='INSERT' or old.status is distinct from 'PUBLISHED')
     and new.kind='FULL_MOCK' then
   select count(*) filter(where q.section='ENGLISH'),
          count(*) filter(where q.section='GENERAL_AWARENESS'),
          count(*) filter(where q.section='NUMERICAL_ABILITY'),
          count(*) filter(where q.section='REASONING_MILITARY_APTITUDE')
   into english_count,ga_count,numerical_count,reasoning_count
   from public.afcat_test_items i join public.afcat_questions q on q.id=i.question_id
   where i.test_id=new.id;
   if (english_count,ga_count,numerical_count,reasoning_count) is distinct from (30,25,20,25) then
     raise exception 'Full mock must have exactly 30/25/20/25 questions by section';
   end if;
 end if;
 return new;
end; $;
create trigger afcat_mock_blueprint_gate before insert or update on public.afcat_tests
for each row execute function public.afcat_validate_full_mock_sections();


-- Session creation requires a published test and pinned current release.
-- Terminal sessions cannot be silently reopened or re-scored.
create function public.afcat_validate_session() returns trigger
language plpgsql security invoker set search_path = '' as $
declare v record;
begin
 if tg_op='INSERT' then
   select status,release_version into v from public.afcat_tests where id=new.test_id;
   if v is null or v.status <> 'PUBLISHED' or v.release_version<>new.test_release_version
   then raise exception 'AFCAT session requires current published test'; end if;
 elsif tg_op='UPDATE' then
   if (new.user_id,new.test_id,new.test_release_version,new.started_at)
      is distinct from (old.user_id,old.test_id,old.test_release_version,old.started_at)
   then raise exception 'AFCAT session identity and release are immutable'; end if;
   if old.status in ('SUBMITTED','EXPIRED') and row(new.*) is distinct from row(old.*)
   then raise exception 'Completed AFCAT session is immutable'; end if;
 end if;
 return new;
end; $;
create trigger afcat_session_gate before insert or update on public.afcat_sessions
for each row execute function public.afcat_validate_session();

revoke all on function public.afcat_validate_session() from public,anon,authenticated;
revoke all on function public.afcat_guard_assignment_delete(), public.afcat_guard_assets(),
 public.afcat_validate_response(), public.afcat_validate_full_mock_sections() from public,anon,authenticated;

revoke all on function public.afcat_validate_assignment(),
 public.afcat_validate_publication(),public.afcat_guard_published_question() from public,anon,authenticated;
commit;
