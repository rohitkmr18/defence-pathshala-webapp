begin;

create table if not exists dp_ingest.promotions (
  id uuid primary key default gen_random_uuid(),
  release_version text not null unique,
  batch_codes text[] not null,
  included_rows integer not null check (included_rows >= 0),
  dropped_rows integer not null check (dropped_rows >= 0),
  pre_active_count integer not null check (pre_active_count >= 0),
  post_active_count integer not null check (post_active_count >= 0),
  manifest jsonb not null default '{}'::jsonb,
  promoted_at timestamptz not null default now()
);

alter table dp_ingest.promotions enable row level security;
revoke all on dp_ingest.promotions from public,anon,authenticated;
grant select,insert on dp_ingest.promotions to service_role;

create or replace function dp_ingest.promote_batches(
  p_batch_codes text[],
  p_release_version text
) returns jsonb
language plpgsql
security definer
set search_path=''
as $$
declare
  v_requested integer;
  v_found integer;
  v_not_ready integer;
  v_included integer;
  v_dropped integer;
  v_pre integer;
  v_post integer;
  v_inserted_questions integer;
  v_inserted_intelligence integer;
begin
  if p_batch_codes is null or cardinality(p_batch_codes)=0 then
    raise exception 'At least one batch code is required';
  end if;
  if coalesce(btrim(p_release_version),'')='' then
    raise exception 'Release version is required';
  end if;
  if p_release_version !~ '^DP_PYQ_[A-Z0-9_]+_v[0-9]+$' then
    raise exception 'Invalid release version format: %',p_release_version;
  end if;

  perform pg_advisory_xact_lock(hashtext('dp_pyq_ingestion_promotion'));

  if exists(select 1 from dp_ingest.promotions where release_version=p_release_version) then
    raise exception 'Release version % has already been promoted',p_release_version;
  end if;

  select count(distinct x) into v_requested from unnest(p_batch_codes) x;
  select count(*) into v_found
  from dp_ingest.batches b
  where b.batch_code=any(p_batch_codes);
  if v_found<>v_requested then
    raise exception 'Requested % distinct batches but found %',v_requested,v_found;
  end if;

  select count(*) into v_not_ready
  from dp_ingest.v_batch_validation v
  join dp_ingest.batches b on b.id=v.batch_id
  where b.batch_code=any(p_batch_codes)
    and v.release_ready is distinct from true;
  if v_not_ready<>0 then
    raise exception '% requested batch(es) are not release-ready',v_not_ready;
  end if;

  if exists(
    select 1
    from dp_ingest.rows r
    join dp_ingest.batches b on b.id=r.batch_id
    where b.batch_code=any(p_batch_codes)
      and r.release_disposition='INCLUDE'
      and (
        exists(select 1 from public.questions q where q.question_id=r.question_id)
        or exists(select 1 from public.questions q where q.content_hash=r.content_hash)
      )
  ) then
    raise exception 'Production duplicate detected before promotion';
  end if;

  select count(*) into v_included
  from dp_ingest.rows r join dp_ingest.batches b on b.id=r.batch_id
  where b.batch_code=any(p_batch_codes) and r.release_disposition='INCLUDE';

  select count(*) into v_dropped
  from dp_ingest.rows r join dp_ingest.batches b on b.id=r.batch_id
  where b.batch_code=any(p_batch_codes) and r.release_disposition='DROP';

  select count(*) into v_pre from public.questions where is_active;

  insert into public.questions(
    question_id,exam,year,cycle,paper,q_num,
    subject,topic,subtopic,theme,
    question,opt_a,opt_b,opt_c,opt_d,
    q_type,q_pattern,llm_opt,official_opt,final_opt,key_discrepancy,
    explanation,source,is_negative,tags,verified_status,static_current_link,
    difficulty_score,difficulty_category,content_hash,is_active,
    dataset_version,source_version,content_status,content_version
  )
  select
    r.question_id,b.exam,b.year,b.cycle,
    case when b.exam='CAPF-AC' then 'Paper I' else b.paper end,
    r.q_num,
    r.subject,r.topic,r.subtopic,r.theme,
    r.question,r.opt_a,r.opt_b,r.opt_c,r.opt_d,
    r.q_type,r.q_pattern,r.llm_opt,
    case when r.key_authority='OFFICIAL' then r.source_key_opt else null end,
    r.final_opt,false,
    r.explanation,r.source,r.is_negative,r.tags,
    'Draft',r.static_current_link,
    r.difficulty_score,r.difficulty_category,r.content_hash,true,
    p_release_version,b.source_version,'SOURCE_MATCHED',1
  from dp_ingest.rows r
  join dp_ingest.batches b on b.id=r.batch_id
  join dp_ingest.v_row_validation v on v.id=r.id
  where b.batch_code=any(p_batch_codes)
    and r.release_disposition='INCLUDE'
    and v.release_eligible=true
  order by b.batch_code,r.q_num;

  get diagnostics v_inserted_questions = row_count;
  if v_inserted_questions<>v_included then
    raise exception 'Question insert count mismatch: expected %, inserted %',v_included,v_inserted_questions;
  end if;

  insert into public.dp_question_intelligence_v1(
    question_id,
    taxonomy_subject,taxonomy_topic,taxonomy_subtopic,taxonomy_concept,
    competency_id,pattern_id,source_id,temporal_context_id,
    expected_knowledge,source_accessibility,preparation_accessibility,cognitive_complexity,
    esac_score,difficulty_score,difficulty_category,
    relation_degree,same_concept_degree,cross_exam_variant_degree,conceptual_variant_degree,
    intelligence_readiness,requires_content_review,release_eligible,
    production_eligible,intelligence_eligible,human_review_required,
    release_version,intelligence_confidence,intelligence_verified
  )
  select
    r.question_id,
    r.subject,r.topic,r.subtopic,r.taxonomy_concept,
    r.competency_id,r.pattern_id,r.source_id,r.temporal_context_id,
    r.expected_knowledge,r.source_accessibility,r.preparation_accessibility,r.cognitive_complexity,
    r.esac_score,r.difficulty_score,r.difficulty_category,
    r.relation_degree,r.same_concept_degree,r.cross_exam_variant_degree,r.conceptual_variant_degree,
    'READY',false,true,
    true,true,false,
    p_release_version,'MODEL_DERIVED',false
  from dp_ingest.rows r
  join dp_ingest.batches b on b.id=r.batch_id
  where b.batch_code=any(p_batch_codes)
    and r.release_disposition='INCLUDE'
  order by b.batch_code,r.q_num;

  get diagnostics v_inserted_intelligence = row_count;
  if v_inserted_intelligence<>v_included then
    raise exception 'Intelligence insert count mismatch: expected %, inserted %',v_included,v_inserted_intelligence;
  end if;

  insert into dp_content_private.snapshots(batch_id,question_id,row_data)
  select p_release_version,q.question_id,to_jsonb(q)
  from public.questions q
  where q.dataset_version=p_release_version;

  update dp_ingest.rows r
  set row_status='PROMOTED',
      review_required=false,
      updated_at=now()
  from dp_ingest.batches b
  where r.batch_id=b.id and b.batch_code=any(p_batch_codes);

  update dp_ingest.batches
  set status='PROMOTED',updated_at=now()
  where batch_code=any(p_batch_codes);

  select count(*) into v_post from public.questions where is_active;
  if v_post<>v_pre+v_included then
    raise exception 'Active corpus count mismatch: pre %, included %, post %',v_pre,v_included,v_post;
  end if;

  insert into dp_ingest.promotions(
    release_version,batch_codes,included_rows,dropped_rows,
    pre_active_count,post_active_count,manifest
  ) values (
    p_release_version,p_batch_codes,v_included,v_dropped,v_pre,v_post,
    jsonb_build_object(
      'source_rows',v_included+v_dropped,
      'included_rows',v_included,
      'dropped_rows',v_dropped,
      'question_inserted',v_inserted_questions,
      'intelligence_inserted',v_inserted_intelligence,
      'batch_codes',to_jsonb(p_batch_codes)
    )
  );

  return jsonb_build_object(
    'release_version',p_release_version,
    'included_rows',v_included,
    'dropped_rows',v_dropped,
    'pre_active_count',v_pre,
    'post_active_count',v_post
  );
end
$$;

revoke all on function dp_ingest.promote_batches(text[],text) from public,anon,authenticated;
grant execute on function dp_ingest.promote_batches(text[],text) to service_role;

comment on function dp_ingest.promote_batches(text[],text) is
'Atomic private PYQ promotion gate. Promotes only release-ready INCLUDE rows into questions + intelligence, snapshots content, preserves DROP rows for audit, and rolls back on any count/duplicate mismatch.';

commit;