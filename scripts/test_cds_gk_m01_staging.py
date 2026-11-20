"""Run a transactional staging smoke test with synthetic content only."""
from pathlib import Path

from import_cds_gk_m01 import audit, sql, stage
from test_cds_gk_m01_import import fixture


def smoke_query():
    questions, _ = audit(fixture())
    insert = sql(questions, rehearsal=False).encode("utf-8").hex()
    template = Path(__file__).with_suffix(".sql").read_text(encoding="utf-8")
    return template.replace("@IMPORT@", insert)


if __name__ == "__main__":
    stage(smoke_query())
    print("Staging import, retry, permissions, publication gate and scoring passed and rolled back.")
