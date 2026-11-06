insert into public.dp_pattern_dictionary (pattern_id, display_label, active) values
  ('PATTERN.DATA_SUFFICIENCY','Data Sufficiency',true),
  ('PATTERN.LINKED_SET','Linked Item Set',true)
on conflict (pattern_id) do nothing;

insert into public.question_passages (paper_id, title, body, source) values
  ('cds-maths','Questions 81–82',$P$For the next two items: $x^{4} + px^{3} + qx^{2} + x + 6$ is divisible by $x^{2} - x - 6$.$P$,'CDS I 2026 Elementary Mathematics, set A (set code KPRS-T-MTE – A)'),
  ('cds-maths','Questions 83–84',$P$For the next two items: $16(x^{4} + \frac{1}{x^{4}}) - 257 = 0$.$P$,'CDS I 2026 Elementary Mathematics, set A (set code KPRS-T-MTE – A)'),
  ('cds-maths','Questions 85–86',$P$For the next two items: $x = \frac{\sqrt{6}+\sqrt{5}}{\sqrt{6}-\sqrt{5}}$ and $y = \frac{\sqrt{6}-\sqrt{5}}{\sqrt{6}+\sqrt{5}}$.$P$,'CDS I 2026 Elementary Mathematics, set A (set code KPRS-T-MTE – A)'),
  ('cds-maths','Questions 87–88',$P$For the next two items: $X$ is an alloy of copper and zinc. $Y$ is an alloy containing 80\% of copper, 4\% of zinc and 16\% of tin. A fused mass of $X$ and $Y$ is found to contain 74\% copper, 16\% of zinc and 10\% of tin.$P$,'CDS I 2026 Elementary Mathematics, set A (set code KPRS-T-MTE – A)'),
  ('cds-maths','Questions 89–90',$P$At the beginning of a year, a person borrows Rs 16,000 on simple interest. After 4 months, Rs 24,000 more is borrowed at a rate of interest double the previous one. At the end of the year, the total interest on both the loans is Rs 4800.$P$,'CDS I 2026 Elementary Mathematics, set A (set code KPRS-T-MTE – A)'),
  ('cds-maths','Questions 91–92',$P$For the next two items: $12(\tan\theta + \cot\theta) = 25$, where $45^\circ < \theta < 90^\circ$.$P$,'CDS I 2026 Elementary Mathematics, set A (set code KPRS-T-MTE – A)'),
  ('cds-maths','Questions 93–94',$P$For the next two items: $\operatorname{cosec}\theta - \sin\theta = p^{3}$ and $\sec\theta - \cos\theta = q^{3}$.$P$,'CDS I 2026 Elementary Mathematics, set A (set code KPRS-T-MTE – A)'),
  ('cds-maths','Questions 95–96',$P$For the next two items: $p \sin^{2}\alpha + q \cos^{2}\alpha = m$ and $p \cos^{2}\beta + q \sin^{2}\beta = n$.$P$,'CDS I 2026 Elementary Mathematics, set A (set code KPRS-T-MTE – A)'),
  ('cds-maths','Questions 97–98',$P$For the next two items: $p + q \cot\theta = 3 \operatorname{cosec}\theta$ and $q - p \cot\theta = 2 \operatorname{cosec}\theta$.$P$,'CDS I 2026 Elementary Mathematics, set A (set code KPRS-T-MTE – A)'),
  ('cds-maths','Questions 99–100',$P$For the next two items: $p = \frac{\sin\theta}{1 + \cos\theta + \sin\theta}$ and $q = \frac{1 + \sin\theta}{1 + \sin\theta - \cos\theta}$.$P$,'CDS I 2026 Elementary Mathematics, set A (set code KPRS-T-MTE – A)');

alter table dp_ingest.batches
  add column if not exists key_policy text not null default 'PUBLISHED_KEY_REQUIRED'
    check (key_policy in ('PUBLISHED_KEY_REQUIRED','FOUNDER_APPROVED_SOLVED')),
  add column if not exists key_policy_approved_by text,
  add column if not exists key_policy_approved_at timestamptz,
  add column if not exists key_policy_note text;

do $do$
declare d text; n text;
begin
  d := pg_get_viewdef('dp_ingest.v_row_validation'::regclass, false);
  n := replace(d,
    'WHEN (r.key_authority <> ALL (ARRAY[''OFFICIAL''::text, ''TRUSTED_SECONDARY''::text])) THEN ''UNTRUSTED_KEY_AUTHORITY''::text',
    'WHEN (r.key_authority <> ALL (ARRAY[''OFFICIAL''::text, ''TRUSTED_SECONDARY''::text]) AND NOT (r.key_authority = ''MODEL_ONLY''::text AND b.key_policy = ''FOUNDER_APPROVED_SOLVED''::text AND b.key_policy_approved_at IS NOT NULL)) THEN ''UNTRUSTED_KEY_AUTHORITY''::text');
  if n = d then raise exception 'v_row_validation key-authority clause not found; view unchanged'; end if;
  execute 'create or replace view dp_ingest.v_row_validation as ' || rtrim(n, E';\n ');
end $do$;

update dp_ingest.batches set
  key_policy='FOUNDER_APPROVED_SOLVED',
  key_policy_approved_by='founder (rohiitk18@gmail.com)',
  key_policy_approved_at=now(),
  key_policy_note='Answer keys for CDS I 2026 Elementary Mathematics set A (KPRS-T-MTE – A) were solved by Claude, independently re-verified (computation + derivation) on 2026-11-06, and approved by the founder as source of truth. Not an official UPSC key.'
where batch_code='CDS_2026_I_MATHS_SET_A';
