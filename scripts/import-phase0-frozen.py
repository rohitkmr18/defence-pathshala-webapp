#!/usr/bin/env python3
"""Import an explicitly approved frozen snapshot into an empty LOCAL reconstruction.

No remote URL, credentials, learner data or production writes are accepted.
Payload files remain outside Git; the report contains counts and digests only.
"""
import argparse
import base64
import hashlib
import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

TABLES = {"questions": "question_id", "dp_pyq_v1_production_release": "question_id",
          "dp_question_intelligence_v1": "question_id", "dp_pattern_dictionary": "pattern_id"}
p = argparse.ArgumentParser(description=__doc__)
p.add_argument("--container", required=True)
p.add_argument("--database", required=True)
p.add_argument("--snapshot", type=Path, required=True)
p.add_argument("--expected", type=Path, required=True, help="Approved source count/digest manifest")
p.add_argument("--report", type=Path, required=True)
a = p.parse_args()
if not re.fullmatch(r"dp_phase0_[a-z0-9_]+", a.database) or not re.fullmatch(r"[a-zA-Z0-9_.-]+", a.container):
    p.error("Only local reconstruction container/database names are accepted")

def sql(source):
    r = subprocess.run(["docker", "exec", "-i", a.container, "psql", "-U", "postgres", "-d", a.database,
                        "-X", "-q", "-t", "-A", "-v", "ON_ERROR_STOP=1", "-v", "VERBOSITY=sqlstate"],
                       input=source, text=True, capture_output=True)
    if r.returncode:
        # Do not print SQL errors: they can include payload values.
        codes = re.findall(r"ERROR:\s*([0-9A-Z]{5})", r.stderr)
        stages = re.findall(r"STAGE:[a-z0-9_]+", r.stdout)
        raise RuntimeError("Local SQL failed; SQLSTATE=" + ",".join(codes) + "; " + ",".join(stages[-1:]))
    return r.stdout.strip()

report = {"timestamp": datetime.now(timezone.utc).isoformat(), "database": a.database,
          "environment": "local PostgreSQL with platform test stubs", "production_writes": False,
          "learner_data_copied": False, "tables": {}}
statements = ["begin;"]
expected = json.loads(a.expected.read_text())
if {r["relation"] for r in expected} != set(TABLES) | {"v_dp_question_intelligence_v2"}:
    raise RuntimeError("Unexpected source manifest relations")
for table, key in TABLES.items():
    files = sorted(a.snapshot.glob(table + "-*.b64"))
    if not files:
        raise RuntimeError("Missing approved snapshot table: " + table)
    records = []
    chunks = []
    hashes = []
    for path in files:
        raw = base64.b64decode(path.read_bytes(), validate=False)
        records.extend(json.loads(raw))
        # Keep original JSON numeric precision/scale and Unicode bytes.
        chunk = raw.decode("utf-8").strip()[1:-1].strip()
        if chunk:
            chunks.append(chunk)
        hashes.append({"file": path.name, "sha256": hashlib.sha256(raw).hexdigest()})
    ids = [row[key] for row in records]
    if len(ids) != len(set(ids)) or (table != "dp_pattern_dictionary" and len(ids) != 1821):
        raise RuntimeError("Snapshot completeness/identity check failed: " + table)
    if table != "dp_pattern_dictionary" and sql(f"select count(*) from public.{table};") != "0":
        raise RuntimeError("Refusing to overwrite a nonempty local table: " + table)
    payload = base64.b64encode(("[" + ",".join(chunks) + "]").encode()).decode()
    if table == "dp_pattern_dictionary":
        # The migrations seed a dictionary. Replace it only in this local transaction.
        statements.append("delete from public.dp_pattern_dictionary;")
    statements.append(f"select 'STAGE:{table}';")
    statements.append(f"insert into public.{table} select * from jsonb_populate_recordset(null::public.{table}, convert_from(decode('{payload}','base64'),'UTF8')::jsonb);")
    report["tables"][table] = {"expected_count": len(records), "files": hashes}
for row in expected:
    table = row["relation"]
    key = TABLES.get(table, "question_id")
    if not re.fullmatch(r"[0-9a-f]{32}", row["md5"]) or not isinstance(row["count"], int):
        raise RuntimeError("Invalid source digest manifest")
    statements.append(f"select 'STAGE:verify_{table}';")
    statements.append(f"do $$ begin if (select count(*) from public.{table}) <> {row['count']} or (select md5(string_agg(to_jsonb(t)::text,E'\\n' order by {key} collate \"C\")) from public.{table} t) <> '{row['md5']}' then raise exception 'Frozen source digest mismatch'; end if; end $$;")
statements.append("commit;")
sql("\n".join(statements))
for table, key in TABLES.items():
    result = json.loads(sql(f"select json_build_object('count',count(*),'md5',md5(string_agg(to_jsonb(t)::text,E'\\n' order by {key} collate \"C\"))) from public.{table} t;"))
    if result["count"] != report["tables"][table]["expected_count"]:
        raise RuntimeError("Restored row count mismatch: " + table)
    report["tables"][table].update(result)
report["canonical"] = json.loads(sql("select json_build_object('count',count(*),'md5',md5(string_agg(to_jsonb(t)::text,E'\\n' order by question_id collate \"C\"))) from public.v_dp_question_intelligence_v2 t;"))
if report["canonical"]["count"] != 1821:
    raise RuntimeError("Canonical frozen count mismatch")
report["passed"] = True
report["source_digest_match"] = True
a.report.parent.mkdir(parents=True, exist_ok=True)
a.report.write_text(json.dumps(report, indent=2) + "\n")
print("PASS: approved frozen tables imported; 1,821 canonical rows; source table and canonical digests match")
