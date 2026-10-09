begin;

alter table dp_ingest.rows
  add column if not exists taxonomy_concept text,
  add column if not exists competency_id text,
  add column if not exists source_id text,
  add column if not exists temporal_context_id text,
  add column if not exists expected_knowledge numeric,
  add column if not exists source_accessibility numeric,
  add column if not exists preparation_accessibility numeric,
  add column if not exists cognitive_complexity numeric,
  add column if not exists esac_score numeric,
  add column if not exists relation_degree bigint,
  add column if not exists same_concept_degree bigint,
  add column if not exists cross_exam_variant_degree bigint,
  add column if not exists conceptual_variant_degree bigint;

comment on column dp_ingest.rows.taxonomy_concept is 'Canonical concept label for production intelligence.';
comment on column dp_ingest.rows.competency_id is 'Canonical competency ID inherited from the closest existing DP intelligence node.';
comment on column dp_ingest.rows.source_id is 'Canonical educational reference-source class, separate from ingestion provenance/key source.';
comment on column dp_ingest.rows.temporal_context_id is 'Canonical static/current temporal context used by production intelligence.';
comment on column dp_ingest.rows.esac_score is 'Expected success/accessibility composite corresponding to 100 - difficulty_score.';

commit;