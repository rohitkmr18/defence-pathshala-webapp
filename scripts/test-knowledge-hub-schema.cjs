const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { PGlite } = require('../frontend/node_modules/@electric-sql/pglite');

const pendingPath = 'supabase/pending/knowledge-hub/20261117170636_knowledge_hub_foundation.sql';

test('Knowledge Hub migration stays outside the immutable production migration ledger', () => {
  assert.ok(fs.existsSync(pendingPath));
  assert.ok(!fs.existsSync('supabase/migrations/20261117170636_knowledge_hub_foundation.sql'));
  const sql = fs.readFileSync(pendingPath, 'utf8');
  assert.match(sql, /alter table public\.knowledge_articles enable row level security/i);
  assert.match(sql, /grant select on public\.knowledge_articles to anon, authenticated/i);
});

test('isolated Knowledge Hub migration enforces published-only anonymous reads and denies writes', async () => {
  const db = new PGlite();
  const sql = fs.readFileSync(pendingPath, 'utf8');
  try {
    await db.exec(fs.readFileSync('supabase/reconstruction/platform-test-stubs.sql', 'utf8'));
    await db.exec(sql);
    await db.exec(`INSERT INTO public.knowledge_articles
      (slug,title,description,category,author_name,status,published_at)
      VALUES
      ('qa-visible','Published sample article','Published description for the Knowledge Hub staging schema check.','Testing','QA','published',now()-interval '1 day'),
      ('qa-draft','Private sample article','Private description for the Knowledge Hub staging schema check.','Testing','QA','draft',null),
      ('qa-future','Scheduled sample article','Scheduled description for the Knowledge Hub staging schema check.','Testing','QA','published',now()+interval '1 day')`);

    for (const role of ['anon', 'authenticated']) {
      await db.exec(`SET ROLE ${role}`);
      const visible = await db.query('SELECT slug FROM public.knowledge_articles ORDER BY slug');
      assert.deepEqual(visible.rows.map(x => x.slug), ['qa-visible'], `${role} must see only current published articles`);
      await assert.rejects(
        db.exec("INSERT INTO public.knowledge_articles(slug,title,description,category,author_name) VALUES ('qa-insert','Forbidden sample article','This description should be rejected by privilege checks.','Testing','QA')"),
        /permission denied|insufficient privilege|row-level security/i
      );
      // A failed statement outside an explicit transaction does not taint later checks.
      await assert.rejects(
        db.exec("DELETE FROM public.knowledge_articles WHERE slug='qa-visible'"),
        /permission denied|insufficient privilege|row-level security/i
      );
      await db.exec('RESET ROLE');
    }

    const { rows: policies } = await db.query(`SELECT policyname FROM pg_policies
      WHERE schemaname='public' AND tablename='knowledge_articles'`);
    assert.equal(policies.length, 1, 'exactly one public read policy is expected');
    const { rows: rls } = await db.query(`SELECT relrowsecurity FROM pg_class
      WHERE oid = 'public.knowledge_articles'::regclass`);
    assert.equal(rls[0].relrowsecurity, true);
  } finally {
    await db.close();
  }
});
