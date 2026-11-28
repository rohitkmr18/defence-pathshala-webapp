-- CAPF (AC) Paper II answer evaluator: one row per evaluation request.
-- Writes happen only server-side with the service role; learners can read their own rows.
-- Independent of the earlier, unmerged capf_p2 B1 corpus tables.

create table public.capf_p2_evaluations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_year integer not null check (exam_year between 2000 and 2100),
  question smallint not null check (question in (1, 2)),
  part text not null check (part ~ '^[a-z]$'),
  input_mode text not null check (input_mode in ('typed', 'photo')),
  answer_text text check (answer_text is null or char_length(answer_text) <= 20000),
  word_count integer check (word_count is null or word_count >= 0),
  status text not null default 'PENDING' check (status in ('PENDING', 'COMPLETED', 'FAILED')),
  result jsonb check (result is null or jsonb_typeof(result) = 'object'),
  total_score numeric(4,1) check (total_score is null or total_score between 0 and 20),
  rubric_version text not null,
  model text,
  input_tokens integer,
  output_tokens integer,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  check (status <> 'COMPLETED' or (result is not null and total_score is not null and completed_at is not null))
);

create index capf_p2_evaluations_user_created on public.capf_p2_evaluations (user_id, created_at desc);

alter table public.capf_p2_evaluations enable row level security;
revoke all on public.capf_p2_evaluations from public, anon, authenticated;
grant select on public.capf_p2_evaluations to authenticated;
create policy capf_p2_own_evaluations on public.capf_p2_evaluations
  for select to authenticated using ((select auth.uid()) = user_id);

-- Atomically enforce the daily limit and reserve a slot. Failed evaluations do not count;
-- PENDING rows older than 10 minutes are treated as failed so a crash cannot burn a slot.
create function public.capf_p2_reserve_evaluation(
  p_user uuid, p_year integer, p_question smallint, p_part text, p_mode text,
  p_rubric text, p_limit integer, p_day_start timestamptz
) returns uuid
language plpgsql
set search_path = public
as $$
declare
  used integer;
  new_id uuid;
begin
  perform pg_advisory_xact_lock(hashtextextended('capf_p2_eval:' || p_user::text, 0));
  update public.capf_p2_evaluations set status = 'FAILED'
    where user_id = p_user and status = 'PENDING' and created_at < now() - interval '10 minutes';
  select count(*) into used from public.capf_p2_evaluations
    where user_id = p_user and status in ('PENDING', 'COMPLETED') and created_at >= p_day_start;
  if used >= p_limit then
    raise exception 'CAPF_P2_DAILY_LIMIT' using errcode = 'P0001';
  end if;
  insert into public.capf_p2_evaluations (user_id, exam_year, question, part, input_mode, rubric_version)
    values (p_user, p_year, p_question, p_part, p_mode, p_rubric)
    returning id into new_id;
  return new_id;
end;
$$;

revoke all on function public.capf_p2_reserve_evaluation(uuid, integer, smallint, text, text, text, integer, timestamptz)
  from public, anon, authenticated;
grant execute on function public.capf_p2_reserve_evaluation(uuid, integer, smallint, text, text, text, integer, timestamptz)
  to service_role;
