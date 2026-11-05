-- ─────────────────────────────────────────────────────────────────────────────
-- Exam registry foundation (multi-exam master plan, step 2)
-- STATUS: PENDING — not applied to any environment. Apply to staging first,
-- verify, then production only with founder approval.
--
-- Additive only: new reference tables, nullable columns on public.questions,
-- and a deterministic backfill for today's two papers. No existing column is
-- changed or dropped; existing queries keep working.
-- Mirrors frontend/src/lib/exam-registry.ts (keep the two in sync; a test
-- should compare them once this is applied).
-- ─────────────────────────────────────────────────────────────────────────────

begin;

create table if not exists public.exam_papers (
  id            text primary key,                 -- e.g. 'cds-gk'
  exam          text not null,                    -- matches questions.exam ('CDS', 'CAPF-AC', 'NDA', 'AFCAT')
  label         text not null,
  format        text not null check (format in ('mcq', 'descriptive')),
  question_count integer,
  max_marks     numeric not null,
  minutes       integer not null,
  marks_correct numeric,
  marks_wrong   numeric,
  status        text not null default 'coming_soon' check (status in ('live', 'coming_soon')),
  created_at    timestamptz not null default now()
);

create table if not exists public.exam_sections (
  id            text primary key,                 -- '<paper_id>:<section>' e.g. 'capf-p1:gma'
  paper_id      text not null references public.exam_papers(id),
  label         text not null,
  question_count integer,
  sort_order    integer not null default 0
);

create table if not exists public.question_passages (
  id            uuid primary key default gen_random_uuid(),
  paper_id      text not null references public.exam_papers(id),
  title         text,
  body          text not null,                    -- comprehension passage / shared data set
  source        text,
  created_at    timestamptz not null default now()
);

alter table public.questions
  add column if not exists paper_id        text references public.exam_papers(id),
  add column if not exists section_id      text references public.exam_sections(id),
  add column if not exists passage_id      uuid references public.question_passages(id),
  add column if not exists media           jsonb,   -- figures: [{ "kind": "svg"|"image", "src": ..., "alt": ... }]
  add column if not exists question_format text not null default 'single_mcq';

create index if not exists questions_paper_id_idx   on public.questions (paper_id);
create index if not exists questions_section_id_idx on public.questions (section_id);

-- Reference data (values mirror exam-registry.ts)
insert into public.exam_papers (id, exam, label, format, question_count, max_marks, minutes, marks_correct, marks_wrong, status) values
  ('cds-gk',        'CDS',     'General Knowledge',                              'mcq',         120, 100, 120, 100.0/120, 100.0/360, 'live'),
  ('cds-english',   'CDS',     'English',                                        'mcq',         120, 100, 120, 100.0/120, 100.0/360, 'coming_soon'),
  ('cds-maths',     'CDS',     'Elementary Mathematics',                         'mcq',         100, 100, 120, 1,         1.0/3,     'coming_soon'),
  ('capf-p1',       'CAPF-AC', 'Paper I · General Ability and Intelligence',     'mcq',         125, 250, 120, 2,         0.67,      'live'),
  ('capf-p2',       'CAPF-AC', 'Paper II · Essay, Comprehension and Précis',     'descriptive', null, 200, 180, null,     null,      'coming_soon'),
  ('afcat-written', 'AFCAT',   'Written Test',                                   'mcq',         100, 300, 120, 3,         1,         'live'),
  ('afcat-ekt',     'AFCAT',   'Engineering Knowledge Test',                     'mcq',         50,  150, 45,  3,         1,         'coming_soon'),
  ('nda-maths',     'NDA',     'Mathematics',                                    'mcq',         120, 300, 150, 2.5,       0.83,      'coming_soon'),
  ('nda-gat',       'NDA',     'General Ability Test',                           'mcq',         150, 600, 150, 4,         1.33,      'coming_soon')
on conflict (id) do nothing;

insert into public.exam_sections (id, paper_id, label, question_count, sort_order) values
  ('cds-gk:gk',                  'cds-gk',      'General Knowledge',      120, 1),
  ('cds-english:english',        'cds-english', 'English',                120, 1),
  ('cds-maths:maths',            'cds-maths',   'Elementary Mathematics', 100, 1),
  ('capf-p1:general-ability',    'capf-p1',     'General Ability',        null, 1),
  ('capf-p1:gma',                'capf-p1',     'General Mental Ability', null, 2),
  ('nda-maths:maths',            'nda-maths',   'Mathematics',            120, 1),
  ('nda-gat:english',            'nda-gat',     'English',                50,  1),
  ('nda-gat:gk',                 'nda-gat',     'General Knowledge',      100, 2)
on conflict (id) do nothing;

-- One question number per paper, not per exam. The old key (exam, year, cycle,
-- q_num) would reject CDS English Q1 of 2024-I because GK Q1 of 2024-I exists.
-- No code depends on the old key (all upserts use question_id; checked 5 Nov 2026).
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'questions_exam_year_paper_qnum_unique'
                 and conrelid = 'public.questions'::regclass) then
    alter table public.questions
      add constraint questions_exam_year_paper_qnum_unique unique (exam, year, cycle, paper, q_num);
  end if;
end $$;
alter table public.questions drop constraint if exists questions_exam_year_qnum_unique;

-- Deterministic backfill for the existing corpus (verified 5 Nov 2026:
-- CDS rows all have paper = 'General Knowledge'; CAPF-AC rows all 'Paper I').
-- dp_content_revision fires per row; question content is untouched, so
-- content_version and content_status stay as they are. The audit rows it
-- writes carry this evidence label instead of a blank.
select set_config('dp.content_evidence', 'exam-registry backfill 20261105 (paper_id/section_id only)', true);
update public.questions set paper_id = 'cds-gk',  section_id = 'cds-gk:gk'
  where exam = 'CDS' and paper = 'General Knowledge' and paper_id is null;
update public.questions set paper_id = 'capf-p1',
       section_id = case when subject = 'General Mental Ability' then 'capf-p1:gma' else 'capf-p1:general-ability' end
  where exam = 'CAPF-AC' and paper = 'Paper I' and paper_id is null;
select set_config('dp.content_evidence', '', true);

-- Reference tables are public, read-only to clients.
alter table public.exam_papers       enable row level security;
alter table public.exam_sections     enable row level security;
alter table public.question_passages enable row level security;
drop policy if exists exam_papers_read on public.exam_papers;
create policy exam_papers_read on public.exam_papers for select using (true);
drop policy if exists exam_sections_read on public.exam_sections;
create policy exam_sections_read on public.exam_sections for select using (true);
drop policy if exists question_passages_read on public.question_passages;
create policy question_passages_read on public.question_passages for select using (true);

-- Post-apply checks (expected on production as of 5 Nov 2026):
--   select paper_id, count(*) from public.questions group by 1;  -- cds-gk 1678, capf-p1 873, null 0
--   select section_id, count(*) from public.questions group by 1; -- cds-gk:gk 1678, capf-p1:gma 112, capf-p1:general-ability 761
--   content_version / content_status unchanged; +2551 rows in dp_content_private.revisions with the evidence label
commit;
