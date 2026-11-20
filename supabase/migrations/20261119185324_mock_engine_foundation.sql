-- Exported verbatim from STAGING (pxfstrzceyxnweeaydvz) supabase_migrations.schema_migrations
-- version 20261119185324 "mock_engine_foundation". Already applied on staging; do NOT re-apply there.
-- Generic mock engine (mock_* tables). Independent of afcat_*.

create table public.mock_questions (
 id uuid primary key default gen_random_uuid(),
 external_id text not null unique,
 paper_id text not null check (paper_id ~ '^[a-z0-9-]+$'),
 subject text not null, topic text not null, subtopic text,
 q_pattern text not null,
 stem jsonb not null check (jsonb_typeof(stem)='object'),
 options jsonb not null check (jsonb_typeof(options)='array' and jsonb_array_length(options)=4),
 correct_option text not null check (correct_option in ('A','B','C','D')),
 explanation jsonb not null check (jsonb_typeof(explanation)='object'),
 difficulty text not null check (difficulty in ('EASY','MODERATE','HARD')),
 derivation_type text not null check (derivation_type in ('ORIGINAL','VARIANT','FUSION')),
 parent_pyq_ids text[] not null default '{}',
 source_reference text,
 validation jsonb not null default '{}'::jsonb,
 fingerprint_sha256 text not null unique check (fingerprint_sha256 ~ '^[a-f0-9]{64}$'),
 content_version integer not null default 1 check (content_version>0),
 editorial_status text not null default 'DRAFT' check (editorial_status in ('DRAFT','REVIEW_REQUIRED','APPROVED','WITHHELD')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check (derivation_type='ORIGINAL' or cardinality(parent_pyq_ids)>=1),
 check (derivation_type<>'FUSION' or cardinality(parent_pyq_ids)>=2)
);
create table public.mock_tests (
 id uuid primary key default gen_random_uuid(),
 code text not null unique,
 paper_id text not null check (paper_id ~ '^[a-z0-9-]+$'),
 title text not null,
 duration_seconds integer not null check (duration_seconds>0),
 expected_questions integer not null check (expected_questions>0),
 correct_points integer not null check (correct_points>0),
 wrong_points integer not null check (wrong_points>=0),
 points_divisor integer not null check (points_divisor>0),
 max_marks numeric(8,2) not null,
 blueprint jsonb not null check (jsonb_typeof(blueprint)='object'),
 status text not null default 'DRAFT' check (status in ('DRAFT','READY','PUBLISHED','RETIRED')),
 release_version integer not null default 1 check (release_version>0),
 created_at timestamptz not null default now(),
 check (max_marks = round(expected_questions::numeric*correct_points/points_divisor,2))
);
create table public.mock_test_items (
 test_id uuid not null references public.mock_tests(id) on delete restrict,
 question_id uuid not null unique references public.mock_questions(id) on delete restrict,
 position integer not null check (position>0),
 question_content_version integer not null check (question_content_version>0),
 primary key (test_id,position)
);
create table public.mock_sessions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete restrict,
 test_id uuid not null references public.mock_tests(id) on delete restrict,
 test_release_version integer not null check (test_release_version>0),
 current_position integer not null default 1 check (current_position>0),
 status text not null default 'IN_PROGRESS' check (status in ('IN_PROGRESS','SUBMITTED','EXPIRED')),
 started_at timestamptz not null default now(), finished_at timestamptz,
 unique (id,user_id)
);
create table public.mock_responses (
 id uuid primary key default gen_random_uuid(),
 session_id uuid not null references public.mock_sessions(id) on delete restrict,
 user_id uuid not null references auth.users(id) on delete restrict,
 question_id uuid not null references public.mock_questions(id) on delete restrict,
 selected_option text check (selected_option in ('A','B','C','D')),
 marked_for_review boolean not null default false,
 time_spent_seconds integer not null default 0 check (time_spent_seconds>=0),
 answered_at timestamptz,
 unique (session_id,question_id),
 foreign key (session_id,user_id) references public.mock_sessions(id,user_id) on delete restrict
);
create table public.mock_session_results (
 session_id uuid primary key references public.mock_sessions(id) on delete restrict,
 user_id uuid not null references auth.users(id) on delete restrict,
 correct_count integer not null check (correct_count>=0),
 incorrect_count integer not null check (incorrect_count>=0),
 unanswered_count integer not null check (unanswered_count>=0),
 score numeric(8,2) not null,
 max_marks numeric(8,2) not null check (max_marks>0),
 completed_at timestamptz not null default clock_timestamp()
);
create index mock_questions_paper_idx on public.mock_questions(paper_id,subject,editorial_status);
create index mock_items_test_idx on public.mock_test_items(test_id,position);
create index mock_sessions_owner_idx on public.mock_sessions(user_id,started_at desc);
create index mock_responses_session_idx on public.mock_responses(session_id);
create index mock_results_owner_idx on public.mock_session_results(user_id);
create unique index mock_one_active_session_per_user_test on public.mock_sessions(user_id,test_id) where status='IN_PROGRESS';

create function public.mock_validate_assignment() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare t record; q record;
begin
 select paper_id,status into t from public.mock_tests where id=new.test_id for update;
 select paper_id,editorial_status,content_version into q from public.mock_questions where id=new.question_id;
 if t is null or q is null then raise exception 'Mock test or question missing'; end if;
 if t.status not in ('DRAFT','READY') then raise exception 'Published mock is immutable'; end if;
 if q.editorial_status<>'APPROVED' or q.paper_id<>t.paper_id or q.content_version<>new.question_content_version
 then raise exception 'Mock question assignment violates content or paper contract'; end if;
 return new;
end; $$;
create trigger mock_assignment_gate before insert or update on public.mock_test_items
for each row execute function public.mock_validate_assignment();

create function public.mock_validate_publication() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare n integer; minpos integer; maxpos integer; actual jsonb; mismatch boolean;
begin
 if tg_op='UPDATE' and old.status in ('PUBLISHED','RETIRED') then
   if row(new.*) is distinct from row(old.*) then
     if old.status='PUBLISHED' and new.status='RETIRED' and
       (new.id,new.code,new.paper_id,new.title,new.duration_seconds,new.expected_questions,new.correct_points,new.wrong_points,new.points_divisor,new.max_marks,new.blueprint,new.release_version,new.created_at)
       is not distinct from
       (old.id,old.code,old.paper_id,old.title,old.duration_seconds,old.expected_questions,old.correct_points,old.wrong_points,old.points_divisor,old.max_marks,old.blueprint,old.release_version,old.created_at)
     then return new; end if;
     raise exception 'Published/retired mock cannot be edited';
   end if;
 end if;
 if new.status='PUBLISHED' and (tg_op='INSERT' or old.status is distinct from 'PUBLISHED') then
   select count(*),min(i.position),max(i.position) into n,minpos,maxpos
   from public.mock_test_items i join public.mock_questions q on q.id=i.question_id
   where i.test_id=new.id and q.editorial_status='APPROVED' and q.content_version=i.question_content_version and q.paper_id=new.paper_id;
   if n<>new.expected_questions or minpos<>1 or maxpos<>new.expected_questions then
     raise exception 'Cannot publish mock: incomplete or noncontiguous approved question set';
   end if;
   select coalesce(jsonb_object_agg(subject,c),'{}'::jsonb) into actual from (
     select q.subject,count(*) c from public.mock_test_items i join public.mock_questions q on q.id=i.question_id
     where i.test_id=new.id group by q.subject) s;
   select exists(select 1 from jsonb_each(new.blueprint) b where (actual->>b.key)::int is distinct from (b.value#>>'{}')::int)
       or exists(select 1 from jsonb_each(actual) a where (new.blueprint->>a.key) is null)
     into mismatch;
   if mismatch then raise exception 'Cannot publish mock: subject counts do not match blueprint'; end if;
 end if;
 return new;
end; $$;
create trigger mock_publication_gate before insert or update on public.mock_tests
for each row execute function public.mock_validate_publication();

create function public.mock_guard_published_question() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
 if exists(select 1 from public.mock_test_items i join public.mock_tests t on t.id=i.test_id
           where i.question_id=old.id and t.status in ('PUBLISHED','RETIRED')) then
   raise exception 'Cannot modify mock question associated with a published test';
 end if;
 return case when tg_op='DELETE' then old else new end;
end; $$;
create trigger mock_question_freeze before update or delete on public.mock_questions
for each row execute function public.mock_guard_published_question();

create function public.mock_guard_assignment_delete() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare s text;
begin
 select status into s from public.mock_tests where id=old.test_id for update;
 if s in ('PUBLISHED','RETIRED') then raise exception 'Published mock assignment is immutable'; end if;
 return old;
end; $$;
create trigger mock_assignment_delete_guard before delete on public.mock_test_items
for each row execute function public.mock_guard_assignment_delete();

create function public.mock_validate_session() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare v record;
begin
 if tg_op='INSERT' then
   select status,release_version into v from public.mock_tests where id=new.test_id;
   if v is null or v.status<>'PUBLISHED' or v.release_version<>new.test_release_version
   then raise exception 'Mock session requires current published test'; end if;
 elsif tg_op='UPDATE' then
   if (new.user_id,new.test_id,new.test_release_version,new.started_at)
      is distinct from (old.user_id,old.test_id,old.test_release_version,old.started_at)
   then raise exception 'Mock session identity and release are immutable'; end if;
   if old.status in ('SUBMITTED','EXPIRED') and row(new.*) is distinct from row(old.*)
   then raise exception 'Completed mock session is immutable'; end if;
 end if;
 return new;
end; $$;
create trigger mock_session_gate before insert or update on public.mock_sessions
for each row execute function public.mock_validate_session();

create function public.mock_validate_response() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare v_status text; v_test uuid; v_owner uuid; v_started timestamptz; v_duration integer;
begin
 select status,test_id,user_id,started_at into v_status,v_test,v_owner,v_started
 from public.mock_sessions where id=new.session_id for update;
 if v_status is distinct from 'IN_PROGRESS' or v_owner is distinct from new.user_id
    or not exists(select 1 from public.mock_test_items where test_id=v_test and question_id=new.question_id)
 then raise exception 'Invalid or closed mock response'; end if;
 select duration_seconds into v_duration from public.mock_tests where id=v_test;
 if v_duration is null or clock_timestamp()>=v_started+make_interval(secs=>v_duration)
 then raise exception 'Mock response deadline passed'; end if;
 if tg_op='UPDATE' and (old.session_id,old.user_id,old.question_id)
    is distinct from (new.session_id,new.user_id,new.question_id)
 then raise exception 'Mock response identity immutable'; end if;
 return new;
end; $$;
create trigger mock_response_gate before insert or update on public.mock_responses
for each row execute function public.mock_validate_response();

create function public.mock_finalize_session(p_session_id uuid, p_user_id uuid)
returns table (status text, correct_count integer, incorrect_count integer,
 unanswered_count integer, score numeric, max_marks numeric)
language plpgsql security invoker set search_path = '' as $$
declare s record; t record; v_c integer; v_w integer; v_u integer;
begin
 select * into s from public.mock_sessions where id=p_session_id and user_id=p_user_id for update;
 if not found then raise exception 'Mock session not found'; end if;
 if s.status in ('SUBMITTED','EXPIRED') then
   return query select s.status,r.correct_count,r.incorrect_count,r.unanswered_count,r.score,r.max_marks
     from public.mock_session_results r where r.session_id=s.id;
   if not found then raise exception 'Mock final result missing'; end if;
   return;
 end if;
 if s.status<>'IN_PROGRESS' then raise exception 'Invalid session state'; end if;
 select duration_seconds,expected_questions,correct_points,wrong_points,points_divisor,max_marks as mm
   into t from public.mock_tests where id=s.test_id;
 if not found then raise exception 'Mock test not found'; end if;
 if (select count(*) from public.mock_test_items where test_id=s.test_id)<>t.expected_questions
 then raise exception 'Mock test incomplete'; end if;
 select count(*) filter(where r.selected_option=q.correct_option),
        count(*) filter(where r.selected_option is not null and r.selected_option<>q.correct_option),
        count(*) filter(where r.selected_option is null)
   into v_c,v_w,v_u
 from public.mock_test_items i join public.mock_questions q on q.id=i.question_id
 left join public.mock_responses r on r.session_id=s.id and r.question_id=i.question_id
 where i.test_id=s.test_id;
 if v_c+v_w+v_u<>t.expected_questions then raise exception 'Mock answer aggregation mismatch'; end if;
 insert into public.mock_session_results(session_id,user_id,correct_count,incorrect_count,unanswered_count,score,max_marks)
 values(s.id,s.user_id,v_c,v_w,v_u,
   round((v_c*t.correct_points-v_w*t.wrong_points)::numeric/t.points_divisor,2),t.mm);
 update public.mock_sessions set status=case when clock_timestamp()>=s.started_at+t.duration_seconds*interval '1 second'
   then 'EXPIRED' else 'SUBMITTED' end, finished_at=clock_timestamp() where id=s.id;
 return query select x.status,r.correct_count,r.incorrect_count,r.unanswered_count,r.score,r.max_marks
 from public.mock_sessions x join public.mock_session_results r on r.session_id=x.id where x.id=s.id;
end; $$;

alter table public.mock_questions enable row level security;
alter table public.mock_tests enable row level security;
alter table public.mock_test_items enable row level security;
alter table public.mock_sessions enable row level security;
alter table public.mock_responses enable row level security;
alter table public.mock_session_results enable row level security;
revoke all on public.mock_questions,public.mock_tests,public.mock_test_items,public.mock_sessions,
  public.mock_responses,public.mock_session_results from anon,authenticated;
grant select on public.mock_tests to anon,authenticated;
grant select on public.mock_sessions,public.mock_responses,public.mock_session_results to authenticated;
create policy mock_published_catalogue on public.mock_tests for select to anon,authenticated using (status='PUBLISHED');
create policy mock_own_sessions on public.mock_sessions for select to authenticated using ((select auth.uid())=user_id);
create policy mock_own_responses on public.mock_responses for select to authenticated using ((select auth.uid())=user_id);
create policy mock_own_result on public.mock_session_results for select to authenticated using ((select auth.uid())=user_id);

revoke all on function public.mock_validate_assignment(),public.mock_validate_publication(),
 public.mock_guard_published_question(),public.mock_guard_assignment_delete(),public.mock_validate_session(),
 public.mock_validate_response() from public,anon,authenticated;
revoke all on function public.mock_finalize_session(uuid,uuid) from public,anon,authenticated;
grant execute on function public.mock_finalize_session(uuid,uuid) to service_role;
