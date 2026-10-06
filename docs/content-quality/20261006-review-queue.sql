-- Execution record: populated after the source-repair batches.
-- Missing official-key provenance is a review task, not an incorrect-answer finding.
begin;
insert into dp_content_private.review_queue(question_id,severity,reason,state,evidence)
select question_id,'HIGH',
 'Official answer-key provenance is missing. Reconcile booklet and key; missing provenance does not establish an incorrect answer.',
 'OPEN',jsonb_build_object('exam',exam,'year',year,'cycle',cycle,'q_num',q_num,'stored_final_opt',final_opt,'review_phase','official_key_reconciliation')
from public.questions where official_opt is null or btrim(official_opt)=''
on conflict(question_id) do update set severity=excluded.severity,reason=excluded.reason,state=excluded.state,
 evidence=coalesce(dp_content_private.review_queue.evidence,'{}'::jsonb)||excluded.evidence,updated_at=now();
commit;
