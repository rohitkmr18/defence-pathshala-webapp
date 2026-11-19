-- Test body run by test_cds_gk_m01_staging.py. All writes are rolled back.
do $smoke$
declare
  paper uuid;
  learner uuid;
  attempt uuid;
  first_result record;
  repeat_result record;
  missing_item public.mock_test_items%rowtype;
  missing_blocked boolean := false;
begin
  if exists (select 1 from public.mock_tests where code = 'CDS-GK-M01-V1') then
    raise exception 'The staging smoke test requires the Mock 01 code to be unused';
  end if;
  begin
    execute convert_from(decode('@IMPORT@', 'hex'), 'UTF8');
    select id into strict paper from public.mock_tests where code = 'CDS-GK-M01-V1';
    execute convert_from(decode('@IMPORT@', 'hex'), 'UTF8');
    if (select id from public.mock_tests where code = 'CDS-GK-M01-V1') <> paper then
      raise exception 'Retry changed draft identity';
    end if;

    if has_table_privilege('anon', 'public.mock_questions', 'SELECT')
       or has_table_privilege('authenticated', 'public.mock_questions', 'SELECT')
       or has_any_column_privilege('anon', 'public.mock_questions', 'SELECT')
       or has_any_column_privilege('authenticated', 'public.mock_questions', 'SELECT')
       or has_function_privilege('anon', 'public.mock_finalize_session(uuid,uuid)', 'EXECUTE')
       or has_function_privilege('authenticated', 'public.mock_finalize_session(uuid,uuid)', 'EXECUTE')
    then
      raise exception 'Learner role can query private questions or execute scoring';
    end if;

    set local role anon;
    if exists(select 1 from public.mock_tests where id = paper) then
      raise exception 'Anonymous catalogue exposes draft';
    end if;
    reset role;

    delete from public.mock_test_items where test_id = paper and position = 120
      returning * into strict missing_item;
    begin
      update public.mock_tests set status = 'PUBLISHED' where id = paper;
    exception when raise_exception then
      if sqlerrm <> 'Cannot publish mock: incomplete or noncontiguous approved question set' then
        raise;
      end if;
      missing_blocked := true;
    end;
    if not missing_blocked then raise exception 'Publication allowed an incomplete paper'; end if;
    insert into public.mock_test_items values (missing_item.*);

    update public.mock_tests set status = 'PUBLISHED' where id = paper;
    -- Reuse a staging auth identity for the foreign key. No account or profile changes.
    select id into learner from auth.users order by id limit 1;
    if learner is null then raise exception 'No staging auth identity for scoring fixture'; end if;
    insert into public.mock_sessions(user_id, test_id, test_release_version, current_position)
    values (learner, paper, 1, 61) returning id into attempt;
    insert into public.mock_responses(session_id, user_id, question_id, selected_option)
    select attempt, learner, i.question_id,
           case when i.position <= 50 then q.correct_option
                when q.correct_option = 'A' then 'B' else 'A' end
    from public.mock_test_items i join public.mock_questions q on q.id = i.question_id
    where i.test_id = paper and i.position <= 60;

    select * into strict first_result from public.mock_finalize_session(attempt, learner);
    select * into strict repeat_result from public.mock_finalize_session(attempt, learner);
    if (first_result.status, first_result.correct_count, first_result.incorrect_count,
        first_result.unanswered_count, first_result.score, first_result.max_marks)
         is distinct from ('SUBMITTED'::text, 50, 10, 60, 38.89::numeric, 100::numeric)
       or first_result is distinct from repeat_result
    then
      raise exception 'Unexpected negative marking or finalize retry result';
    end if;
    raise sqlstate 'DP002';
  exception when sqlstate 'DP002' then
    null;
  end;
  if exists (select 1 from public.mock_tests where code = 'CDS-GK-M01-V1')
     or exists (select 1 from public.mock_questions where external_id like 'CDS-GK-M01-V1-Q%')
  then
    raise exception 'Staging smoke-test rollback did not leave a clean namespace';
  end if;
end;
$smoke$;
