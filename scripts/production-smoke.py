"""Non-destructive HTTP production baseline. No credentials or writes.
Run: python scripts/production-smoke.py [base URL]
"""
import json
import sys
import time
from html.parser import HTMLParser
from urllib.request import urlopen
from urllib.error import HTTPError

class Head(HTMLParser):
    def __init__(self): super().__init__(); self.canonical = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'link' and a.get('rel') == 'canonical': self.canonical = a.get('href')

base = (sys.argv[1] if len(sys.argv) > 1 else 'https://www.defencepathshala.in').rstrip('/')
paths = ['/', '/auth/login', '/pyqs/cds', '/pyqs/capf', '/dashboard/question-bank',
         '/dashboard/practice?exam=CDS', '/dashboard/practice/full-paper',
         '/api/question-bank/meta', '/api/practice/filters',
         '/api/practice/count?exam=CDS', '/api/practice/questions?exam=CDS&limit=1',
         '/auth/callback']
results = []
for path in paths:
    start = time.perf_counter()
    try:
        with urlopen(base + path, timeout=30) as response:
            body = response.read().decode(); status = response.status; final = response.url
        row = dict(path=path, status=status, seconds=round(time.perf_counter()-start,3), final_url=final)
        assert status == 200, status
        if path in ['/', '/pyqs/cds', '/pyqs/capf']:
            head = Head(); head.feed(body)
            row['canonical'] = head.canonical
            assert head.canonical and head.canonical.startswith(base), 'Missing/wrong canonical'
            assert '<title>' in body, 'Missing title'
        if path.startswith('/api/'):
            data = json.loads(body)
            assert 'error' not in data, data.get('error')
            if '/questions?' in path: assert len(data.get('questions', [])) == 1, 'No practice question'
            if '/count?' in path: assert data.get('count',0) > 0, 'Empty CDS corpus'
        row['passed'] = True
    except Exception as error:
        row = dict(path=path, passed=False, error=str(error),seconds=round(time.perf_counter()-start,3))
    results.append(row)
print(json.dumps(results, indent=2))
sys.exit(0 if all(r['passed'] for r in results) else 1)
