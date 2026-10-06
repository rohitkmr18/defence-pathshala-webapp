"""Content import checks. Detect corruption; never reconstruct official wording."""
from datetime import date, datetime, time
import re
from typing import Any

CONTENT_FIELDS = ('question', 'opt_a', 'opt_b', 'opt_c', 'opt_d')
OPTIONS = CONTENT_FIELDS[1:]
ERROR_TOKEN = re.compile(r'#(?:ERROR!|REF!|VALUE!|DIV/0!|N/A\b|NAME\?|NUM!|NULL!)', re.I)
DATE_LITERAL = re.compile(r'^\d{4}-\d{2}-\d{2}(?:[ T].*)?$|^\d{1,2}[-/](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(?:[-/]\d{2,4})?$', re.I)


def content_issues(row: dict[str, Any]) -> list[str]:
    issues = []
    for field in CONTENT_FIELDS:
        value = row.get(field)
        if isinstance(value, (datetime, date, time)):
            issues.append(f'{field}: spreadsheet date/time cell; restore original text')
        elif value is None or not str(value).strip() or str(value).lower() in ('nan', 'nat', '<na>'):
            issues.append(f'{field}: blank content')
        elif ERROR_TOKEN.search(str(value)):
            issues.append(f'{field}: spreadsheet error token')
        elif re.search(r'\[cite:\s*\d+\]', str(value), re.I):
            issues.append(f'{field}: extraction citation artifact')
    options = [str(row.get(field, '')).strip().casefold() for field in OPTIONS]
    if all(options) and len(set(options)) != 4:
        issues.append('options: duplicate choices require source review')
    return issues


def dataframe_content_issues(df) -> list[str]:
    # Called on raw values BEFORE normalization/serialization.
    return [f"{row.get('question_id', index)}: {issue}"
            for index, row in df.to_dict(orient='index').items()
            for issue in content_issues(row)]


def require_content_integrity(df) -> None:
    issues = dataframe_content_issues(df)
    if issues:
        raise ValueError('Question content failed validation: ' + '; '.join(issues[:20]))


def content_warnings(df) -> list[str]:
    warnings = []
    for row in df.to_dict(orient='records'):
        for field in CONTENT_FIELDS:
            value = str(row.get(field, ''))
            if DATE_LITERAL.match(value.strip()):
                warnings.append(f"{row.get('question_id')}: {field}: date-like text needs source comparison")
            if '[cite:' in value:
                warnings.append(f"{row.get('question_id')}: {field}: citation artifact")
    return warnings


def require_reviewed_content_preserved(client, records: list[dict[str, Any]]) -> None:
    """Preflight all rows before any write; stale datasets cannot undo sourced repairs."""
    incoming = {row['question_id']: row for row in records}
    fields = (*CONTENT_FIELDS, 'final_opt', 'official_opt', 'explanation')
    for start in range(0, len(incoming), 100):
        ids = list(incoming)[start:start + 100]
        response = client.table('questions').select(','.join(('question_id', 'content_status', 'content_version', *fields))).in_('question_id', ids).or_('content_status.in.(SOURCE_MATCHED,WITHHELD),content_version.gt.1').execute()
        for existing in response.data or []:
            changed = [field for field in fields if field in incoming[existing['question_id']] and incoming[existing['question_id']][field] != existing.get(field)]
            if changed:
                raise ValueError(f"{existing['question_id']}: reviewed content would change ({', '.join(changed)}). Submit a source-backed repair with revision evidence instead of a bulk import.")
