from datetime import datetime
from io import StringIO
import pandas as pd
import pytest
from app.services.content_quality import content_issues, require_content_integrity


def valid():
    return dict(question_id='SOURCE_001',question='Which?',opt_a='A car',opt_b='None',opt_c='0101',opt_d='2/3',final_opt='B')


def test_csv_preserves_none_leading_zero_and_fraction():
    df = pd.read_csv(StringIO('question_id,question,opt_a,opt_b,opt_c,opt_d\nSOURCE_001,Which?,A car,None,0101,2/3\n'),dtype=str,keep_default_na=False)
    require_content_integrity(df)
    assert df.iloc[0].opt_b == 'None'
    assert df.iloc[0].opt_c == '0101'
    assert df.iloc[0].opt_d == '2/3'


@pytest.mark.parametrize('field,value',[('opt_a',datetime(2026,3,2)),('opt_d',''),('opt_c','#ERROR!'),('question','Which? [cite: 3]'),('opt_d','None')])
def test_raw_corruption_blocks_import(field,value):
    row=valid();row[field]=value
    assert content_issues(row)
    with pytest.raises(ValueError): require_content_integrity(pd.DataFrame([row]))


def test_date_text_is_not_guessed_or_converted():
    row=valid();row['opt_d']='2026-03-02'
    assert content_issues(row)==[]


def test_bulk_import_cannot_undo_source_matched_repair():
    from types import SimpleNamespace
    from app.services.content_quality import require_reviewed_content_preserved
    existing={**valid(),'content_status':'SOURCE_MATCHED'}
    class Query:
        def table(self,*args):return self
        def select(self,*args):return self
        def in_(self,*args):return self
        def or_(self,*args):return self
        def execute(self):return SimpleNamespace(data=[existing])
    require_reviewed_content_preserved(Query(),[valid()])
    stale={**valid(),'opt_c':'101'}
    with pytest.raises(ValueError,match='reviewed content would change'):
        require_reviewed_content_preserved(Query(),[stale])
