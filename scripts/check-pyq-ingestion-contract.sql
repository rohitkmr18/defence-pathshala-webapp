-- Read-only assertions for DP PYQ Ingestion v1.
do $$
begin
  if has_schema_privilege('anon','dp_ingest','USAGE')
     or has_schema_privilege('authenticated','dp_ingest','USAGE') then
    raise exception 'dp_ingest schema exposed to client roles';
  end if;

  if has_table_privilege('anon','dp_ingest.batches','SELECT')
     or has_table_privilege('authenticated','dp_ingest.batches','SELECT')
     or has_table_privilege('anon','dp_ingest.rows','SELECT')
     or has_table_privilege('authenticated','dp_ingest.rows','SELECT') then
    raise exception 'ingestion tables exposed to client roles';
  end if;

  if exists (
    select 1
    from dp_ingest.rows
    where difficulty_score is not null
      and difficulty_category is distinct from
        case
          when difficulty_score <= 20 then 'Easy'
          when difficulty_score <= 50 then 'Moderate'
          else 'Hard'
        end
  ) then
    raise exception 'difficulty category mismatch';
  end if;

  if exists (
    select 1
    from dp_ingest.v_batch_validation
    where release_ready
      and (
        extracted_rows <> expected_question_count
        or release_eligible_rows <> expected_question_count
        or blocked_rows <> 0
      )
  ) then
    raise exception 'invalid batch marked release-ready';
  end if;

  if exists (
    select question_id
    from dp_ingest.rows
    where question_id is not null
    group by question_id
    having count(*) > 1
  ) then
    raise exception 'duplicate candidate question_id';
  end if;

  if exists (
    select content_hash
    from dp_ingest.rows
    where content_hash is not null
    group by content_hash
    having count(*) > 1
  ) then
    raise exception 'duplicate candidate content_hash';
  end if;
end $$;
