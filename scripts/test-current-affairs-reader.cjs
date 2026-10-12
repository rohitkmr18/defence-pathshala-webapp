const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { edition } = require('./test-support/editorial-fixture.cjs');
const same = (actual, expected) => assert.equal(JSON.stringify(actual), JSON.stringify(expected));
const load = require('./test-support/load-ts.cjs')();
const { readApprovedSource } = load('frontend/src/lib/current-affairs/read-approved-source.ts');
const { editorialHeadings } = load('frontend/src/lib/current-affairs/editorial-headings.ts');
const { readingMinutes, storyPreview } = load('frontend/src/lib/current-affairs/reading.ts');
const { storyDisplayMarkdown } = load('frontend/src/lib/current-affairs/story-display.ts');

test('all approved text, exact PYQs, options, keys and source bytes/hash survive read/presentation', () => {
  const p = edition(); const bytes = p.approvedEditorial.source;
  const { value, warning } = readApprovedSource(bytes);
  assert.equal(warning, false);
  value.stories.forEach((s, i) => {
    for (const field of ['headline','summary','whatHappened','whyItMatters','keyFacts','conceptualLinkage','staticLink','examRelevance','editorialMarkdown','futureAngle','linkedPyqIds','sourceName','sourceUrl','sourceDate']) same(s[field], p.stories[i][field]);
    for (const field of ['question','options','correctOption','explanation','examEdge','sourceUrl']) same(s.mcqs[0][field], p.stories[i].mcqs[0][field]);
    assert.equal(storyDisplayMarkdown(s.editorialMarkdown, s.linkedPyqIds), s.editorialMarkdown);
  });
  assert.equal(p.approvedEditorial.source, bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), p.approvedEditorial.sha256);
  assert.equal(p.approvedEditorial.version, 1);
});

test('heading AST promotion preserves every child and unknown node', () => {
  const labels = ['What Happened?', 'Why It Matters:', 'Key Exam Facts', 'Static–Current Linkage', 'Static – Current Affairs Linkage', 'Conceptual Linkage.', 'Exam Edge', 'Future Question Angles?'];
  for (const label of labels) for (const bold of [false, true]) {
    const children = bold ? [{ type: 'strong', children: [{ type: 'text', value: label }] }] : [{ type: 'text', value: label }];
    const tree = { type: 'root', children: [{ type: 'paragraph', children }] };
    editorialHeadings()(tree);
    assert.equal(tree.children[0].type, 'heading'); assert.equal(tree.children[0].depth, 3);
    same(tree.children[0].children, children);
  }
  for (const value of ['Why It Matters is explained in this sentence.', 'Unknown section', 'What Happened?\nNext paragraph']) {
    const tree = { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', value }] }] };
    const before = JSON.stringify(tree); editorialHeadings()(tree); assert.equal(JSON.stringify(tree), before);
  }
  const tree = { type: 'root', children: [{ type: 'heading', depth: 1, children: [{ type: 'text', value: 'Unknown heading' }] }, { type: 'html', value: '<b>Unknown HTML</b>' }] };
  editorialHeadings()(tree); assert.equal(tree.children[0].depth, 3); assert.equal(tree.children[1].value, '<b>Unknown HTML</b>');
});

test('malformed optional metadata keeps complete manuscript; invalid JSON falls back safely', () => {
  const p = edition(); const raw = JSON.parse(p.approvedEditorial.source);
  raw.stories[0].examTags = 'broken'; raw.stories[0].linkedPyqIds = null; raw.stories[0].keywords = [1, 'retained'];
  const { value, warning } = readApprovedSource(JSON.stringify(raw));
  assert.equal(warning, true); assert.equal(value.stories[0].editorialMarkdown, p.stories[0].editorialMarkdown);
  same(value.stories[0].keywords, ['retained']);
  for (const source of ['{malformed', 'null', '42']) same(readApprovedSource(source), { value: null, warning: true });
  same(readApprovedSource(null), { value: null, warning: false });
});

test('reading effort uses actual text and preview is a literal excerpt', () => {
  assert.equal(readingMinutes('word '.repeat(1000)), 5);
  assert.equal(readingMinutes('word '.repeat(2001)), 11);
  const text = 'Approved exact text '.repeat(30);
  const preview = storyPreview({ summary: null, whatHappened: text });
  assert.ok(preview.endsWith('…')); assert.ok(text.startsWith(preview.slice(0, -1)));
});

test('missing edition is null; failed fetch throws and malformed source retains legacy rows', async () => {
  let result = { data: null, error: null };
  const query = { select() { return this; }, eq() { return this; }, async maybeSingle() { return result; } };
  const reader = require('./test-support/load-ts.cjs')({ '@/lib/supabase/server': { createClient: async () => ({ from: () => query }) } })('frontend/src/lib/current-affairs.ts');
  assert.equal(await reader.getCurrentAffairsByDate('2030-01-01'), null);
  result = { data: null, error: { message: 'Backend detail must not reach learner' } };
  await assert.rejects(reader.getCurrentAffairsByDate('2030-01-01'), /temporarily unavailable/);
  result = { data: { id: 'legacy', date: '2030-01-01', title: 'Legacy edition', approved_editorial_source: '{bad', current_affairs_stories: [{ id: 's', story_number: 1, headline: 'Legacy headline', what_happened: 'Every legacy paragraph', key_facts: ['Legacy fact'], current_affairs_mcqs: [] }] } };
  const post = await reader.getCurrentAffairsByDate('2030-01-01');
  assert.equal(post.sourceWarning, true); assert.equal(post.stories[0].whatHappened, 'Every legacy paragraph');
  assert.equal(post.storyCount, 1); assert.equal(post.quizCount, 0);
});

test('12 October published snapshot keeps fixed SHA and every canonical field after normalization', async () => {
  const row = require('./test-support/published-editorial-2026-10-12.json');
  const bytes = row.approved_editorial_source;
  assert.equal(row.approved_editorial_sha256, '19cc262d86faa6f2b939fd70e0b94fa291a4c7ec20cd95b41ca225e49d4d9c82');
  assert.equal(createHash('sha256').update(bytes).digest('hex'), row.approved_editorial_sha256);
  const original = JSON.parse(bytes);
  const query = { select() { return this; }, eq() { return this; }, async maybeSingle() { return { data: row }; } };
  const reader = require('./test-support/load-ts.cjs')({ '@/lib/supabase/server': { createClient: async () => ({ from: () => query }) } })('frontend/src/lib/current-affairs.ts');
  const post = await reader.getCurrentAffairsByDate(row.date);
  assert.equal(post.storyCount, 3); assert.equal(post.quizCount, 4);
  assert.equal(post.approvedSourceHash, row.approved_editorial_sha256);
  original.stories.forEach((s, i) => {
    for (const field of ['headline','summary','whatHappened','whyItMatters','keyFacts','editorialMarkdown','staticLink','futureAngle','linkedPyqIds','sourceName','sourceUrl','sourceDate']) same(post.stories[i][field], s[field]);
    s.mcqs.forEach((q, n) => {
      for (const field of ['question','correctOption','explanation','examEdge']) same(post.stories[i].mcqs[n][field], q[field]);
      same(post.stories[i].mcqs[n].options, ['A','B','C','D'].map(key => ({ key, text: q.options[key] })));
    });
  });
  assert.equal(row.approved_editorial_source, bytes);
});
