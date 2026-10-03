-- Prerequisite: the existing profiles + user_exam_preferences schema and RLS.
-- Additive only: do not reset existing completion flags, preferences or roles.
begin;

create schema if not exists dp_onboarding_private;
revoke all on schema dp_onboarding_private from public, anon;
grant usage on schema dp_onboarding_private to authenticated;

-- A narrow definer is needed ONLY to create a missing profile: profiles has no
-- authenticated INSERT policy. No caller-supplied user ID/role, dynamic SQL,
-- metadata-based authorization, broad table grants or RLS changes are used.
-- The public API wrappers are invokers; this schema must stay unexposed.
create or replace function dp_onboarding_private.save_preparation_profile(
  p_full_name text, p_target_year integer, p_target_exams text[], p_setup boolean
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_profile public.profiles%rowtype;
  v_exams text[];
  v_name text;
  v_saved_exams text[];
begin
  if v_uid is null or p_setup is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  insert into public.profiles (id, role, onboarding_completed)
  values (v_uid, 'student', false)
  on conflict (id) do nothing;

  -- Serialize missing-profile creation, concurrent submits and target edits.
  select * into strict v_profile from public.profiles where id = v_uid for update;
  if p_setup and v_profile.onboarding_completed then
    -- An already completed user (including legacy exams/years) is never reset.
    select coalesce(array_agg(exam order by exam), '{}'::text[]) into v_saved_exams
    from public.user_exam_preferences where user_id = v_uid;
    return jsonb_build_object('id', v_uid, 'full_name', v_profile.full_name,
      'target_year', v_profile.target_year, 'onboarding_completed', true,
      'target_exams', v_saved_exams);
  end if;
  if not p_setup and not v_profile.onboarding_completed then
    raise exception 'Complete setup before editing targets' using errcode = '22023';
  end if;

  v_name := nullif(btrim(p_full_name), '');
  if length(v_name) > 200 or
     (p_target_year is not null and (p_target_year < 2026 or p_target_year > 2032)
       and (p_setup or p_target_year is distinct from v_profile.target_year)) or
     p_target_exams is null or cardinality(p_target_exams) = 0 or
     array_ndims(p_target_exams) <> 1 or array_position(p_target_exams, null) is not null or
     (p_setup and not p_target_exams <@ array['CDS', 'CAPF-AC']::text[]) or
     (not p_setup and not p_target_exams <@ array['CDS', 'CAPF-AC', 'NDA', 'AFCAT', 'UPSC-CSE']::text[]) then
    raise exception 'Invalid preparation preferences' using errcode = '22023';
  end if;
  select array_agg(distinct exam order by exam) into v_exams from unnest(p_target_exams) as exam;
  if p_setup then v_name := coalesce(v_name, v_profile.full_name); end if;

  delete from public.user_exam_preferences where user_id = v_uid;
  insert into public.user_exam_preferences (user_id, exam)
  select v_uid, exam from unnest(v_exams) as exam;
  update public.profiles set full_name = v_name, target_year = p_target_year,
    onboarding_completed = true where id = v_uid;

  -- Validate persisted rows inside the transaction. Any exception rolls back
  -- creation, deletes, inserts and completion together, including trigger effects.
  select * into strict v_profile from public.profiles where id = v_uid;
  select coalesce(array_agg(exam order by exam), '{}'::text[]) into v_saved_exams
  from public.user_exam_preferences where user_id = v_uid;
  if v_profile.onboarding_completed is distinct from true or
     v_profile.full_name is distinct from v_name or
     v_profile.target_year is distinct from p_target_year or v_saved_exams is distinct from v_exams then
    raise exception 'Setup persistence could not be verified';
  end if;
  return jsonb_build_object('id', v_uid, 'full_name', v_profile.full_name,
    'target_year', v_profile.target_year, 'onboarding_completed', true,
    'target_exams', v_saved_exams);
end;
$$;
revoke all on function dp_onboarding_private.save_preparation_profile(text, integer, text[], boolean)
  from public, anon, service_role;
grant execute on function dp_onboarding_private.save_preparation_profile(text, integer, text[], boolean)
  to authenticated;

create or replace function public.complete_onboarding(
  p_full_name text, p_target_year integer, p_target_exams text[]
) returns jsonb
language sql security invoker set search_path = ''
as $$ select dp_onboarding_private.save_preparation_profile(p_full_name, p_target_year, p_target_exams, true); $$;

-- Preserve the dashboard's existing Edit targets flow without repeating setup.
create or replace function public.update_preparation_profile(
  p_full_name text, p_target_year integer, p_target_exams text[]
) returns jsonb
language sql security invoker set search_path = ''
as $$ select dp_onboarding_private.save_preparation_profile(p_full_name, p_target_year, p_target_exams, false); $$;

revoke all on function public.complete_onboarding(text, integer, text[]) from public, anon, service_role;
revoke all on function public.update_preparation_profile(text, integer, text[]) from public, anon, service_role;
grant execute on function public.complete_onboarding(text, integer, text[]) to authenticated;
grant execute on function public.update_preparation_profile(text, integer, text[]) to authenticated;

notify pgrst, 'reload schema';
commit;
