begin;
insert into dp_content_private.review_queue(question_id,severity,reason,state,evidence)
select question_id,case when content_status='WITHHELD' then 'CRITICAL' else 'HIGH' end,
'Official final answer-key provenance remains unresolved; source text repairs do not establish final-key provenance.',
'OPEN',jsonb_build_object('key_provenance_state','UNRESOLVED','observed_official_opt',official_opt)
from public.questions where is_active and official_opt is null
on conflict(question_id) do update set
state='OPEN',
severity=case when review_queue.severity='CRITICAL' then 'CRITICAL' else excluded.severity end,
reason=case when review_queue.severity='CRITICAL' then review_queue.reason else excluded.reason end,
evidence=review_queue.evidence || excluded.evidence,
updated_at=now();
commit;
