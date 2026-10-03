#!/usr/bin/env python3
"""Two-connection SQL test in a reconstructed local Docker database; no remote URLs."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import json
import os
from pathlib import Path
import re
import subprocess
from threading import Barrier

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--container', required=True)
parser.add_argument('--database', required=True)
parser.add_argument('--report', type=Path, required=True)
args = parser.parse_args()
if not re.fullmatch(r'dp-auth-reconcile-[a-z0-9-]+', args.container):
    parser.error('Only a task-owned dp-auth-reconcile- container is permitted')
if not re.fullmatch(r'dp_phase0_[a-z0-9_]+', args.database):
    parser.error('Only a freshly reconstructed dp_phase0_ database is permitted')
environment = {key: value for key, value in os.environ.items()
               if key not in {'DOCKER_HOST', 'DOCKER_CONTEXT', 'DOCKER_TLS', 'DOCKER_TLS_VERIFY', 'DOCKER_CERT_PATH'}}


def sql(statement):
    result = subprocess.run(['docker', '--host=unix:///var/run/docker.sock', 'exec', '-i',
                             args.container, 'psql', '-U', 'postgres', '-d', args.database,
                             '-v', 'ON_ERROR_STOP=1', '-X', '-qAt'], input=statement,
                            text=True, capture_output=True, check=True, env=environment)
    return [json.loads(line) for line in result.stdout.splitlines() if line.startswith('{')]


# Synthetic user is inserted into this empty test fixture, never deleted/reset.
uid = '99999999-1111-4111-8111-111111111111'
sql(f"insert into auth.users(id) values ('{uid}');")
barrier = Barrier(2)


def save(name):
    barrier.wait(timeout=10)
    return sql(f"""begin;
      set request.jwt.claim.sub = '{uid}'; set role authenticated;
      select public.complete_onboarding('{name}',2028,array['CDS','CAPF-AC']);
      select pg_sleep(0.15); commit;""")[0]


with ThreadPoolExecutor(max_workers=2) as pool:
    first = pool.submit(save, 'First')
    second = pool.submit(save, 'Second')
    results = [first.result(), second.result()]
assert results[0] == results[1], results
assert results[0]['onboarding_completed'] is True
assert sorted(results[0]['target_exams']) == ['CAPF-AC', 'CDS']
persisted = sql(f"""select json_build_object('profiles',count(*),'completed',bool_and(onboarding_completed))
  from public.profiles where id='{uid}';
  select json_build_object('preferences',count(*),'unique_exams',count(distinct exam))
  from public.user_exam_preferences where user_id='{uid}';""")
assert persisted == [{'profiles': 1, 'completed': True}, {'preferences': 2, 'unique_exams': 2}]
args.report.write_text(json.dumps({'passed': True, 'connections': 2, 'environment':
    'local Docker PostgreSQL with synthetic Auth/Storage stubs; not live Supabase acceptance',
    'production_writes': False, 'results': results, 'persisted': persisted}, indent=2) + '\n')
print('PASS: two independent SQL connections converge on one completed profile and unique preferences')
