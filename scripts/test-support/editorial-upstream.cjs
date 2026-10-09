// Isolated Supabase HTTP contract double. Never connects to a real project.
const http = require('node:http');
const { edition } = require('./editorial-fixture.cjs');
const p = edition();
const userId = '22222222-2222-4222-a222-222222222222';
const question = { id: '11111111-1111-4111-a111-111111111111', question_id: 'CDS_II_2026_GK_011',
  question: 'Synthetic exact linked question: which option is two?', exam: 'CDS', year: 2026, cycle: 'II',
  q_num: 11, subject: 'Economy', topic: 'Synthetic', opt_a: 'One', opt_b: 'Two', opt_c: 'Three', opt_d: 'Four',
  final_opt: 'B', official_opt: 'B', llm_opt: 'B', explanation: 'Synthetic answer explanation: two is B.',
  content_version: 1, content_status: 'VERIFIED', content_eligible: true };
const sessions = new Map(); const attempts = new Map();
let complete = true; let eligible = true;
const post = { id: '33333333-3333-4333-a333-333333333333', date: p.date, title: p.title, summary: p.summary,
  total_stories: 3, published: true, approved_editorial_source: p.approvedEditorial.source,
  approved_editorial_sha256: p.approvedEditorial.sha256,
  current_affairs_stories: p.stories.map((s, i) => ({ id: `story-${i}`, story_number: i + 1,
    headline: s.headline, summary: s.summary, what_happened: s.whatHappened, why_it_matters: s.whyItMatters,
    key_facts: s.keyFacts, conceptual_linkage: s.conceptualLinkage, static_link: s.staticLink,
    exam_relevance: s.examRelevance, subject: s.subject, topic: s.topic, subtopic: s.subtopic, theme: s.theme,
    exam_tags: s.examTags, dp_score: s.dpScore, source_name: s.sourceName, source_url: s.sourceUrl, source_date: s.sourceDate,
    current_affairs_mcqs: s.mcqs.map((q, n) => ({ id: `mcq-${i}`, question_number: i + n + 1,
      question: q.question, option_a: q.options.A, option_b: q.options.B, option_c: q.options.C, option_d: q.options.D,
      correct_option: q.correctOption, explanation: q.explanation, exam_edge: q.examEdge, difficulty: q.difficulty,
      subject: s.subject, topic: s.topic, exam_tags: q.examTags })) })) };
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1:4547');
  const chunks = []; for await (const c of req) chunks.push(c);
  const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {};
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  if (req.method === 'OPTIONS') return res.end();
  const send = data => res.end(JSON.stringify(data));
  if (url.pathname === '/__qa') {
    if (req.method === 'POST') { complete = body.complete ?? true; eligible = body.eligible ?? true; sessions.clear(); attempts.clear(); }
    return send({ complete, eligible, attempts: [...attempts.values()], sessions: [...sessions.values()] });
  }
  if (url.pathname === '/auth/v1/user') return send({ id: userId, aud: 'authenticated', role: 'authenticated',
    email: 'synthetic@example.invalid', app_metadata: {}, user_metadata: { full_name: 'Synthetic Learner' } });
  const table = url.pathname.split('/').pop();
  let rows = [];
  if (table === 'current_affairs_posts') rows = [post];
  if (table === 'profiles') rows = [{ id: userId, full_name: 'Synthetic Learner', target_year: 2030, onboarding_completed: complete }];
  if (table === 'user_exam_preferences') rows = [{ user_id: userId, exam: 'CDS' }];
  if (table === 'v_dp_question_intelligence_v2') rows = eligible ? [question] : [];
  const store = table === 'practice_sessions' ? sessions : table === 'user_attempts' ? attempts : null;
  if (store) {
    if (req.method === 'POST') {
      for (const record of Array.isArray(body) ? body : [body]) store.set(record.id, { ...store.get(record.id), ...record });
    }
    rows = [...store.values()];
  }
  for (const [key, condition] of url.searchParams) {
    if (['select', 'order', 'limit', 'on_conflict'].includes(key)) continue;
    if (condition.startsWith('eq.')) rows = rows.filter(row => String(row[key]) === condition.slice(3));
    if (condition.startsWith('in.')) rows = rows.filter(row => condition.slice(4, -1).split(',').includes(String(row[key])));
    if (condition.startsWith('lt.')) rows = rows.filter(row => String(row[key]) < condition.slice(3));
    if (condition.startsWith('gt.')) rows = rows.filter(row => String(row[key]) > condition.slice(3));
  }
  if (store && req.method === 'PATCH') rows = rows.map(row => { const next = { ...row, ...body }; store.set(row.id, next); return next; });
  if (url.searchParams.get('select') === 'date') rows = rows.map(row => ({ date: row.date }));
  if (req.headers.accept?.includes('vnd.pgrst.object')) return send(rows[0] ?? null);
  send(rows);
}).listen(4547, '127.0.0.1');
