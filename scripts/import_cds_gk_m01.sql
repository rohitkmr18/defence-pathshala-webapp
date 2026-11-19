-- Template for import_cds_gk_m01.py. The CLI pins the staging project.
do $import$
declare
  payload jsonb := convert_from(decode('@QUESTIONS@', 'hex'), 'UTF8')::jsonb;
  expected_blueprint jsonb := convert_from(decode('@BLUEPRINT@', 'hex'), 'UTF8')::jsonb;
  rehearsal constant boolean := @REHEARSAL@;
  paper_id_value constant text := 'cds-gk';
  test_code constant text := 'CDS-GK-M01-V1';
  test_title constant text := 'CDS GK Full Mock 01';
  target public.mock_tests%rowtype;
  existing boolean;
  stored_payload jsonb;
begin
  perform set_config('lock_timeout', '5s', true);
  -- The savepoint created by this exception block contains every rehearsal write.
  begin
    lock table public.mock_tests, public.mock_questions, public.mock_test_items
      in share row exclusive mode;
    select * into target from public.mock_tests where code = test_code;
    existing := found;

    if not existing then
      insert into public.mock_tests (
        code, paper_id, title, duration_seconds, expected_questions, correct_points,
        wrong_points, points_divisor, max_marks, blueprint, status, release_version
      ) values (
        test_code, paper_id_value, test_title, 7200, 120, 15, 5, 18, 100,
        expected_blueprint, 'DRAFT', 1
      ) returning * into target;

      insert into public.mock_questions (
        external_id, paper_id, subject, topic, subtopic, q_pattern, stem, options,
        correct_option, explanation, difficulty, derivation_type, parent_pyq_ids,
        source_reference, validation, fingerprint_sha256, content_version, editorial_status
      )
      select external_id, paper_id, subject, topic, subtopic, q_pattern, stem, options,
        correct_option, explanation, difficulty, derivation_type, parent_pyq_ids,
        source_reference, validation, fingerprint_sha256, content_version, editorial_status
      from jsonb_populate_recordset(null::public.mock_questions, payload);

      insert into public.mock_test_items (
        test_id, question_id, position, question_content_version
      )
      select target.id, q.id, source.position::integer, q.content_version
      from jsonb_array_elements(payload) with ordinality as source(question, position)
      join public.mock_questions q on q.external_id = source.question->>'external_id';
    end if;

    if (target.paper_id, target.title, target.duration_seconds, target.expected_questions,
        target.correct_points, target.wrong_points, target.points_divisor, target.max_marks,
        target.blueprint, target.status, target.release_version)
      is distinct from
       (paper_id_value, test_title, 7200, 120, 15, 5, 18, 100::numeric,
        expected_blueprint, 'DRAFT'::text, 1)
    then
      raise exception 'Existing mock has incompatible test metadata or is not a draft';
    end if;

    select jsonb_agg(to_jsonb(q) - array['id', 'created_at', 'updated_at'] order by i.position)
      into stored_payload
    from public.mock_test_items i join public.mock_questions q on q.id = i.question_id
    where i.test_id = target.id and i.position = (q.validation->>'position')::integer
      and i.question_content_version = q.content_version;

    if stored_payload is distinct from payload
       or (select count(*) from public.mock_test_items where test_id = target.id) <> 120
    then
      raise exception 'Stored draft differs from the validated ordered workbook';
    end if;

    if rehearsal then
      raise sqlstate 'DP001';
    end if;
  exception when sqlstate 'DP001' then
    if not rehearsal then raise; end if;
  end;
end;
$import$;
