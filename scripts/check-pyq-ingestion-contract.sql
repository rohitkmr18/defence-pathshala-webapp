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
        or included_rows + dropped_rows <> expected_question_count
        or release_eligible_rows <> included_rows
        or blocked_rows <> 0
      )
  ) then
    raise exception 'invalid batch marked release-ready';
  end if;

  if exists (
    select 1
    from dp_ingest.v_row_validation
    where release_disposition='INCLUDE'
      and release_eligible
      and (
        coalesce(trim(explanation),'')=''
        or coalesce(trim(source),'')=''
        or coalesce(trim(taxonomy_concept),'')=''
        or coalesce(trim(competency_id),'')=''
        or coalesce(trim(source_id),'')=''
        or coalesce(trim(temporal_context_id),'')=''
        or esac_score is null
        or abs(esac_score + difficulty_score - 100) > 0.02
        or relation_degree is null
        or relation_degree <> same_concept_degree + cross_exam_variant_degree + conceptual_variant_degree
      )
  ) then
    raise exception 'release-eligible row missing complete intelligence';
  end if;

  if exists (
    select 1
    from dp_ingest.rows
    where release_disposition='DROP'
      and coalesce(trim(drop_reason),'')=''
  ) then
    raise exception 'dropped row missing auditable reason';
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
