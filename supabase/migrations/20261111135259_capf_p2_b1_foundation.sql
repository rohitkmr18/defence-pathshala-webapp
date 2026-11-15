-- B1 only. Apply to isolated local PostgreSQL; no hosted migration is authorized.
begin;
create schema capf_p2_private;
revoke all on schema capf_p2_private from public, anon, authenticated;

create table capf_p2_private.import_batches (
  id uuid primary key default gen_random_uuid(),
  manifest_hash text not null unique check (manifest_hash ~ '^[0-9a-f]{64}$'),
  mapping_version text not null,
  files jsonb not null,
  validation jsonb not null,
  created_at timestamptz not null default now()
);
create table capf_p2_private.sources (
  id uuid primary key default gen_random_uuid(),
  year integer not null unique check (year between 2020 and 2026),
  official_url text not null check (official_url ~ '^https://(www\.)?upsc\.gov\.in/'),
  raw jsonb not null,
  pdf_sha256 text check (pdf_sha256 ~ '^[0-9a-f]{64}$'),
  retrieved_at timestamptz,
  verified boolean not null default false,
  check (not verified or (pdf_sha256 is not null and retrieved_at is not null))
);
create table public.capf_p2_taxonomy_versions (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  ontology jsonb not null,
  approved boolean not null default false,
  approved_by text,
  approved_at timestamptz,
  check (not approved or (length(trim(approved_by)) > 0 and approved_by is not null and approved_at is not null))
);
create table public.capf_p2_rubric_versions (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  rubric jsonb not null,
  anchors jsonb not null,
  status text not null default 'PROVISIONAL_NOT_CALIBRATED'
    check (status = 'PROVISIONAL_NOT_CALIBRATED')
);
create table public.capf_p2_questions (
  id uuid primary key default gen_random_uuid(),
  record_id text not null unique,
  paper_id text not null default 'capf-p2' check (paper_id = 'capf-p2'),
  year integer not null check (year between 2020 and 2026),
  section text not null check (section in ('Q1_ESSAY','Q2_ARGUMENT')),
  original_label text not null,
  active_revision_id uuid,
  unique (year, section, original_label)
);
create table public.capf_p2_question_revisions (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.capf_p2_questions(id),
  revision integer not null check (revision > 0),
  source_id uuid not null references capf_p2_private.sources(id),
  taxonomy_id uuid not null references public.capf_p2_taxonomy_versions(id),
  prompt text not null check (length(trim(prompt)) > 0),
  printed_directions text,
  marks integer not null check (marks = 20),
  selection_rule text not null,
  word_limit integer,
  word_limit_status text not null check (word_limit_status in ('REPORTED_APPROXIMATE','NOT_SPECIFIED_IN_RESEARCH')),
  language_rule text,
  primary_domain text not null check (length(trim(primary_domain)) > 0),
  secondary_tags jsonb not null check (jsonb_typeof(secondary_tags) = 'array'),
  demand_tags jsonb not null check (jsonb_typeof(demand_tags) = 'array' and jsonb_array_length(demand_tags) > 0),
  demand_card jsonb not null check (jsonb_typeof(demand_card) = 'object' and demand_card <> '{}'::jsonb),
  source_url text not null,
  source_page_reported text,
  printed_page text,
  pdf_page_index integer check (pdf_page_index >= 0),
  pdf_sha256 text check (pdf_sha256 ~ '^[0-9a-f]{64}$'),
  state text not null default 'DRAFT'
    check (state in ('DRAFT','SOURCE_MATCHED','ACADEMIC_REVIEWED','PUBLISH_APPROVED')),
  content_hash text not null check (content_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  unique(question_id, revision),
  unique(question_id, id),
  check ((word_limit_status = 'REPORTED_APPROXIMATE' and word_limit = 300)
    or (word_limit_status = 'NOT_SPECIFIED_IN_RESEARCH' and word_limit is null))
);
alter table public.capf_p2_questions add constraint capf_p2_active_revision_owner
  foreign key (id, active_revision_id) references public.capf_p2_question_revisions(question_id, id);
create table capf_p2_private.raw_records (
  batch_id uuid not null references capf_p2_private.import_batches(id),
  record_id text not null,
  revision_id uuid not null references public.capf_p2_question_revisions(id),
  raw_record jsonb not null,
  primary key(batch_id, record_id)
);
create table capf_p2_private.academic_reviews (
  id uuid primary key default gen_random_uuid(),
  revision_id uuid not null references public.capf_p2_question_revisions(id),
  content_hash text not null check (content_hash ~ '^[0-9a-f]{64}$'),
  reviewer text not null check (length(trim(reviewer)) > 0),
  stage text not null check (stage in ('SOURCE_MATCHED','ACADEMIC_REVIEWED','PUBLISH_APPROVED')),
  decision text not null check (decision in ('APPROVE','REJECT')),
  notes text not null check (length(trim(notes)) > 0),
  reviewed_at timestamptz not null default now(),
  unique(revision_id, content_hash, stage)
);

-- A state flag alone cannot publish. Every transition locks its dependencies,
-- checks signed evidence for the exact content and disallows skipping stages.
create function capf_p2_private.guard_revision() returns trigger
language plpgsql set search_path = pg_catalog as $$
declare src capf_p2_private.sources; tax public.capf_p2_taxonomy_versions;
  question public.capf_p2_questions;
begin
  if TG_OP = 'DELETE' then
    if OLD.state <> 'DRAFT' then raise exception 'CAPF_IMMUTABLE_REVISION'; end if;
    return OLD;
  end if;
  if TG_OP = 'INSERT' and NEW.state <> 'DRAFT' then raise exception 'CAPF_DRAFT_REQUIRED'; end if;
  if TG_OP = 'UPDATE' then
    if OLD.state = 'PUBLISH_APPROVED' then raise exception 'CAPF_IMMUTABLE_REVISION'; end if;
    if (to_jsonb(NEW) - 'state') <> (to_jsonb(OLD) - 'state') then
      raise exception 'CAPF_NEW_REVISION_REQUIRED';
    end if;
    if NEW.state = OLD.state then return NEW; end if;
    if not ((OLD.state='DRAFT' and NEW.state='SOURCE_MATCHED')
      or (OLD.state='SOURCE_MATCHED' and NEW.state='ACADEMIC_REVIEWED')
      or (OLD.state='ACADEMIC_REVIEWED' and NEW.state='PUBLISH_APPROVED')) then
      raise exception 'CAPF_INVALID_TRANSITION';
    end if;
    perform 1 from capf_p2_private.academic_reviews
      where revision_id=NEW.id and content_hash=NEW.content_hash
        and stage=NEW.state and decision='APPROVE' for share;
    if not found then raise exception 'CAPF_REVIEW_REQUIRED'; end if;
    select * into src from capf_p2_private.sources where id=NEW.source_id for share;
    select * into question from public.capf_p2_questions where id=NEW.question_id for share;
    if src.year <> question.year or
      (question.section='Q1_ESSAY' and NEW.word_limit_status <> 'REPORTED_APPROXIMATE') or
      (question.section='Q2_ARGUMENT' and NEW.word_limit_status <> 'NOT_SPECIFIED_IN_RESEARCH') then
      raise exception 'CAPF_METADATA_MISMATCH';
    end if;
    if not src.verified or NEW.pdf_sha256 is distinct from src.pdf_sha256
      or NEW.source_url <> src.official_url or nullif(trim(NEW.printed_page),'') is null
      or NEW.pdf_page_index is null or nullif(trim(NEW.printed_directions),'') is null
      or nullif(trim(NEW.language_rule),'') is null then raise exception 'CAPF_SOURCE_REQUIRED'; end if;
    if NEW.state in ('ACADEMIC_REVIEWED','PUBLISH_APPROVED') then
      select * into tax from public.capf_p2_taxonomy_versions where id=NEW.taxonomy_id for share;
      if not tax.approved or not (tax.ontology->'domains' ? NEW.primary_domain) then
        raise exception 'CAPF_TAXONOMY_REQUIRED';
      end if;
      if exists (select 1 from jsonb_array_elements_text(NEW.demand_tags) tag
        where not (tax.ontology->'demand_tags' ? tag)) then raise exception 'CAPF_DEMAND_TAG_INVALID'; end if;
      if (select count(distinct reviewer) from capf_p2_private.academic_reviews
        where revision_id=NEW.id and content_hash=NEW.content_hash and decision='APPROVE'
          and stage in ('SOURCE_MATCHED','ACADEMIC_REVIEWED')) < 2 then
        raise exception 'CAPF_INDEPENDENT_REVIEW_REQUIRED';
      end if;
    end if;
  end if;
  return NEW;
end $$;
revoke all on function capf_p2_private.guard_revision() from public, anon, authenticated;
create trigger capf_p2_revision_guard before insert or update or delete
  on public.capf_p2_question_revisions for each row execute function capf_p2_private.guard_revision();

create function capf_p2_private.guard_active() returns trigger
language plpgsql set search_path = pg_catalog as $$
begin
  if TG_OP='UPDATE' and (to_jsonb(NEW)-'active_revision_id') <> (to_jsonb(OLD)-'active_revision_id') then
    raise exception 'CAPF_IMMUTABLE_IDENTITY';
  end if;
  if NEW.active_revision_id is not null then
    perform 1 from public.capf_p2_question_revisions where id=NEW.active_revision_id
      and question_id=NEW.id and state='PUBLISH_APPROVED' for share;
    if not found then raise exception 'CAPF_PUBLICATION_REQUIRED'; end if;
  end if;
  return NEW;
end $$;
revoke all on function capf_p2_private.guard_active() from public, anon, authenticated;
create trigger capf_p2_active_guard before insert or update on public.capf_p2_questions
  for each row execute function capf_p2_private.guard_active();

-- Academic evidence is append-only; corrections need new versions/reviews.
create function capf_p2_private.immutable() returns trigger
language plpgsql set search_path = pg_catalog as $$
begin raise exception 'CAPF_APPEND_ONLY'; end $$;
revoke all on function capf_p2_private.immutable() from public, anon, authenticated;
create trigger capf_p2_taxonomy_immutable before update or delete on public.capf_p2_taxonomy_versions
  for each row execute function capf_p2_private.immutable();
create trigger capf_p2_rubric_immutable before update or delete on public.capf_p2_rubric_versions
  for each row execute function capf_p2_private.immutable();
create trigger capf_p2_review_immutable before update or delete on capf_p2_private.academic_reviews
  for each row execute function capf_p2_private.immutable();

alter table capf_p2_private.import_batches enable row level security;
alter table capf_p2_private.sources enable row level security;
alter table capf_p2_private.raw_records enable row level security;
alter table capf_p2_private.academic_reviews enable row level security;
alter table public.capf_p2_questions enable row level security;
alter table public.capf_p2_question_revisions enable row level security;
alter table public.capf_p2_taxonomy_versions enable row level security;
alter table public.capf_p2_rubric_versions enable row level security;
revoke all on all tables in schema capf_p2_private from public, anon, authenticated;
revoke all on public.capf_p2_questions, public.capf_p2_question_revisions,
  public.capf_p2_taxonomy_versions, public.capf_p2_rubric_versions from public, anon, authenticated;
grant select on public.capf_p2_questions, public.capf_p2_question_revisions to anon, authenticated;
create policy capf_p2_read_revision on public.capf_p2_question_revisions for select
  to anon, authenticated using (state='PUBLISH_APPROVED');
create policy capf_p2_read_question on public.capf_p2_questions for select
  to anon, authenticated using (active_revision_id is not null and exists (
    select 1 from public.capf_p2_question_revisions r where r.id=active_revision_id and r.state='PUBLISH_APPROVED'));
create index capf_p2_published_lookup on public.capf_p2_questions(section,year,record_id)
  where active_revision_id is not null;
create view public.capf_p2_published_questions with (security_invoker=true) as
  select q.record_id, q.paper_id, q.year, q.section, q.original_label,
    r.id as revision_id, r.revision, r.prompt, r.printed_directions, r.marks,
    r.selection_rule, r.word_limit, r.word_limit_status, r.language_rule,
    r.primary_domain, r.secondary_tags, r.demand_tags, r.demand_card,
    r.source_url, r.pdf_sha256, r.printed_page, r.pdf_page_index
  from public.capf_p2_questions q join public.capf_p2_question_revisions r
    on r.id=q.active_revision_id and r.question_id=q.id
  where r.state='PUBLISH_APPROVED';
revoke all on public.capf_p2_published_questions from public, anon, authenticated;
grant select on public.capf_p2_published_questions to anon, authenticated;
commit;
