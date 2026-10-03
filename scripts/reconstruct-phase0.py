#!/usr/bin/env python3
"""Reconstruct the application schema in a NEW local Docker PostgreSQL database.

This deliberately never accepts a connection URL or production project ref.
Platform stubs test PostgreSQL policies; they do not prove Supabase Auth/Storage.
No learner data or production question payload is copied.
"""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--container", required=True, help="Existing disposable PostgreSQL Docker container")
parser.add_argument("--database", required=True, help="New database name; existing names are rejected")
parser.add_argument("--report", type=Path, required=True)
args = parser.parse_args()
if not re.fullmatch(r"dp_phase0_[a-z0-9_]+", args.database):
    parser.error("Database must begin dp_phase0_ and contain only lowercase letters, digits and underscores")
if not re.fullmatch(r"[a-zA-Z0-9_.-]+", args.container):
    parser.error("Invalid container name")


def sql(statement, database):
    result = subprocess.run(
        ["docker", "exec", "-i", args.container, "psql", "-U", "postgres", "-d", database,
         "-v", "ON_ERROR_STOP=1", "-X"],
        input=statement, text=True, capture_output=True, check=True,
    )
    return result.stdout


# CREATE DATABASE fails if the name exists. This script never resets anything.
sql(f"create database {args.database};", "postgres")
paths = [
    ROOT / "supabase/reconstruction/platform-test-stubs.sql",
    *sorted((ROOT / "supabase/migrations").glob("202609*.sql")),
    ROOT / "supabase/reconstruction/legacy-prerequisites.sql",
    *sorted((ROOT / "supabase/migrations").glob("202610*.sql")),
    ROOT / "supabase/reconstruction/observed-grants.sql",
    ROOT / "supabase/reconstruction/synthetic-lineage-check.sql",
]
report = {"timestamp": datetime.now(timezone.utc).isoformat(), "database": args.database,
          "container": args.container, "environment": "local PostgreSQL with platform test stubs",
          "production_writes": False, "frozen_release_import": "BLOCKED: approved payload unavailable",
          "files": []}
for path in paths:
    source = path.read_text()
    output = sql(source, args.database)
    report["files"].append({"path": str(path.relative_to(ROOT)),
                            "sha256": hashlib.sha256(source.encode()).hexdigest(),
                            "passed": True, "output": output})
report["passed"] = True
args.report.parent.mkdir(parents=True, exist_ok=True)
args.report.write_text(json.dumps(report, indent=2) + "\n")
print(f"PASS: {len(paths)} files; fresh schema and rolled-back synthetic policy/lineage checks")
