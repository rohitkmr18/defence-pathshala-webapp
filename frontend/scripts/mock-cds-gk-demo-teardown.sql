-- STAGING ONLY (project pxfstrzceyxnweeaydvz). Hard-removes the DUMMY demo mock and its sessions.
-- The engine's immutability triggers block normal deletes, so this bypasses triggers for the session.
-- Run manually in the staging SQL editor as the postgres role. NEVER run on production.
begin;
set local session_replication_role = replica;
delete from public.mock_session_results where session_id in (select s.id from public.mock_sessions s join public.mock_tests t on t.id=s.test_id where t.code='CDS-GK-M00-DEMO');
delete from public.mock_responses where session_id in (select s.id from public.mock_sessions s join public.mock_tests t on t.id=s.test_id where t.code='CDS-GK-M00-DEMO');
delete from public.mock_sessions where test_id in (select id from public.mock_tests where code='CDS-GK-M00-DEMO');
delete from public.mock_test_items where test_id in (select id from public.mock_tests where code='CDS-GK-M00-DEMO');
delete from public.mock_tests where code='CDS-GK-M00-DEMO';
delete from public.mock_questions where external_id like 'DUMMY-CDS-GK-M00-%';
commit;
