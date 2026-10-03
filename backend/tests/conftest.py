"""Offline tests: no credentials and no live Supabase requests.

Install the service boundary double before importing routes. Individual tests
may replace it with more specific mocks. Unknown methods fail, not network.
"""
import os
import sys
from types import ModuleType, SimpleNamespace

os.environ['SUPABASE_URL'] = 'http://127.0.0.1:54321'
os.environ['SUPABASE_JWT_SECRET'] = 'offline-test-only-secret-32-characters'
os.environ['SUPABASE_SERVICE_ROLE_KEY'] = 'offline-test-only-key'

ROW = dict(id='00000000-0000-0000-0000-000000000001', question_id='TEST_001',
           exam='CDS', year=2025, cycle='I', paper='GK', q_num=1,
           subject='Polity', topic='Constitution', subtopic='Rights',
           question='Test?', opt_a='A', opt_b='B', opt_c='C', opt_d='D',
           final_opt='B', official_opt='B', difficulty_category='Moderate',
           intelligence_eligible=True, production_eligible=True)

class Query:
    def __init__(self):
        self.rows = [ROW.copy()]
    def select(self, *args, **kwargs): return self
    def in_(self, key, values):
        self.rows = [r for r in self.rows if r.get(key) in values]
        return self
    def eq(self, key, value):
        self.rows = [r for r in self.rows if r.get(key) == value]
        return self
    def or_(self, value): return self
    def order(self, *args, **kwargs): return self
    def limit(self, value):
        self.rows = self.rows[:value]
        return self
    def range(self, start, end):
        self.rows = self.rows[start:end + 1]
        return self
    def execute(self): return SimpleNamespace(data=self.rows, count=len(self.rows))

boundary = ModuleType('app.core.supabase')
boundary.supabase = SimpleNamespace(table=lambda name: Query())
sys.modules['app.core.supabase'] = boundary
