const { test } = require('node:test');
const assert = require('node:assert/strict');
const createLoader = require('./test-support/load-ts.cjs');

test('Explore → Practice → Auth → Practice retains every selection, mode and origin', () => {
  const load = createLoader();
  const { buildExploreUrl, buildPracticeUrl, buildPracticeSessionUrl, parseFiltersFromSearchParams } = load('frontend/src/lib/question-filters.ts');
  const { authUrl, resolveAuthDestination } = load('frontend/src/lib/auth-redirect.ts');
  const context = { exams: ['CDS', 'CAPF-AC'], years: [2025, 2024], cycles: ['II'], subjects: ['Indian Polity'], topics: ['Constitution'], subtopics: ['Rights & Duties'], mode: 'attempt', origin: 'explore' };
  const explore = buildExploreUrl(context);
  const restored = parseFiltersFromSearchParams(new URL(explore, 'https://local.test').searchParams);
  const practice = buildPracticeUrl({ ...restored, returnTo: explore });
  const next = new URL(authUrl('/auth/login', practice), 'https://local.test').searchParams.get('next');
  assert.equal(resolveAuthDestination('complete', next), practice);
  const filters = parseFiltersFromSearchParams(new URL(next, 'https://local.test').searchParams);
  for (const key of Object.keys(context)) assert.equal(JSON.stringify(filters[key]), JSON.stringify(context[key]));
  assert.equal(filters.returnTo, explore);
  const player = new URL(buildPracticeSessionUrl(filters), 'https://local.test');
  assert.equal(player.searchParams.get('subtopic'), 'Rights & Duties');
  assert.equal(player.searchParams.get('mode'), 'attempt');
  assert.equal(player.searchParams.get('returnTo'), explore);
});

test('contextual return keeps nested encodings intact and rejects unsafe or unrelated destinations', () => {
  const { safeLearningReturn, MOBILE_LEARNING_NAV } = createLoader()('frontend/src/lib/learning-navigation.ts');
  const valid = '/dashboard/question-bank?topic=Rights%26Duties&subtopic=100%25';
  assert.equal(safeLearningReturn(valid), valid);
  for (const value of ['https://evil.test', '//evil.test', '/%2f%2fevil.test', '/dashboard/%5cevil', '/auth/login', '/about', '/dashboard/practice/session?resume=true']) {
    assert.equal(safeLearningReturn(value, '/dashboard/practice?exam=CDS'), '/dashboard/practice?exam=CDS');
  }
  assert.equal(MOBILE_LEARNING_NAV[0].href, '/dashboard');
});

test('mobile navigation is Home, Explore, Practice with exact destinations and route-only active states', () => {
  const load = createLoader({ 'next/link': 'a' });
  const { MOBILE_LEARNING_NAV, isMobileLearningNavActive, showGlobalMobileNav } = load('frontend/src/lib/learning-navigation.ts');
  const Navigation = load('frontend/src/components/layout/MobileLearningNavigation.tsx').default;
  assert.deepEqual(Array.from(MOBILE_LEARNING_NAV, item => [item.name, item.href]), [
    ['Home', '/dashboard'], ['Explore', '/dashboard/question-bank'], ['Practice', '/dashboard/practice'],
  ]);
  for (const [path, expected] of [
    ['/dashboard', ['Home']], ['/dashboard#performance-coach', ['Home']],
    ['/dashboard/question-bank', ['Explore']], ['/dashboard/question-bank/topic', ['Explore']],
    ['/dashboard/practice', ['Practice']], ['/dashboard/practice/configure', ['Practice']],
    ['/dashboard/practice-other', []], ['/dashboard/other', []],
  ]) {
    assert.equal(showGlobalMobileNav(path), true);
    const tree = Navigation({ pathname: path });
    const links = elements(tree, n => n.type === 'a');
    assert.equal(links.length, 3);
    assert.deepEqual(links.filter(n => n.props['aria-current'] === 'page').map(n => n.props.children[1].props.children), expected);
    assert.deepEqual(Array.from(MOBILE_LEARNING_NAV).filter(item => isMobileLearningNavActive(item.href, path)).map(item => item.name), expected);
    for (const link of links) {
      assert.match(link.props.className, /min-h-14/);
      assert.equal(link.props.children[0].props['aria-hidden'], 'true');
    }
    assert.match(tree.props.className, /safe-area-inset-bottom/);
    assert.match(tree.props.children.props.className, /grid-cols-3/);
    for (const link of links) {
      assert.equal(link.props.className.includes('bg-blue-100'), link.props['aria-current'] === 'page');
      assert.equal(link.props.className.includes('text-blue-800'), link.props['aria-current'] === 'page');
    }
    assert.equal(links[0].props.href, '/dashboard');
    assert.equal(links[0].props.onNavigate, undefined);
  }
  for (const path of ['/dashboard/practice/session', '/dashboard/practice/session/review',
    '/dashboard/practice/full-paper', '/dashboard/practice/full-paper/review']) {
    assert.equal(isMobileLearningNavActive('/dashboard/practice', path), true);
    assert.equal(showGlobalMobileNav(path), false);
    assert.equal(Navigation({ pathname: path }), null);
  }
});

test('shell reserves the global bar space only on normal pages, leaving attempt scrolling to the document', () => {
  let path = '/dashboard';
  const react = { Suspense: 'suspense', useState: initial => [initial, () => {}], useEffect() {} };
  const load = createLoader({ react, 'next/link': 'a',
    'next/navigation': { usePathname: () => path, useSearchParams: () => new URLSearchParams() },
    './MobileLearningNavigation': 'mobile-nav', './DashboardSidebar': 'sidebar',
    '@/components/dashboard/EditTargetModal': 'edit-modal',
  });
  const Shell = load('frontend/src/components/layout/DashboardShell.tsx').default;
  for (const current of ['/dashboard', '/dashboard/question-bank', '/dashboard/practice',
    '/dashboard/practice/session', '/dashboard/practice/full-paper']) {
    path = current;
    const content = Shell({ children: 'page' }).props.children;
    const tree = content.type(content.props);
    const attempt = current.endsWith('/session') || current.endsWith('/full-paper');
    assert.equal(tree.props.className.includes('dp-active-attempt'), attempt);
    const main = elements(tree, n => n.type === 'main')[0];
    assert.equal(main.props.className.includes('5rem'), !attempt);
    assert.equal(elements(tree, n => n.type === 'mobile-nav')[0].props.pathname, current);
  }
});

function hooks() {
  const values = []; let index = 0;
  return { begin() { index = 0; }, react: {
    useState(initial) { const slot = index++; if (!(slot in values)) values[slot] = typeof initial === 'function' ? initial() : initial;
      return [values[slot], next => { values[slot] = typeof next === 'function' ? next(values[slot]) : next; }]; },
    useRef(initial) { const slot = index++; values[slot] ??= { current: initial }; return values[slot]; },
    useEffect() {}, useCallback: value => value,
  } };
}
function elements(tree, predicate) {
  const found = [];
  function visit(node) { if (Array.isArray(node)) return node.forEach(visit);
    if (!node?.props) return; if (predicate(node)) found.push(node); visit(node.props.children); }
  visit(tree); return found;
}

function feedbackPlayer(initial = {}) {
  const h = hooks();
  const Reveal = createLoader({ react: { useState: initial => [initial, () => {}] }, 'next/link': 'a',
    '@/components/common/MathText': 'math-text', '@/lib/learning-events': { trackLearningEvent() {} } })('frontend/src/components/practice/player/AnswerReveal.tsx').default;
  const load = createLoader({ react: h.react, './ProgressHeader': 'progress', './QuestionCard': 'question', './AnswerReveal': Reveal,
    '@/lib/learning-events': { trackLearningEvent() {} },
    '@/lib/practice-session-client': { getLocalSession: () => ({ id: 'resume', question_times: {} }),
      updateSessionProgress() {}, recordQuestionAttempt: () => Promise.resolve() },
  });
  const Player = load('frontend/src/components/practice/player/QuestionPlayer.tsx').default;
  const props = { sessionId: 'resume', mode: 'instant', questions: [
    { id: 'q2', final_opt: 'B', explanation: 'Explanation for q2', intelligence_eligible: true, student_release_status: 'RELEASED', intelligence_confidence: 'MODEL_DERIVED', topic: 'Topic 2', subject: 'Subject' },
    { id: 'q1', final_opt: 'A', explanation: 'Explanation for q1', intelligence_eligible: true, student_release_status: 'RELEASED', intelligence_confidence: 'MODEL_DERIVED', topic: 'Topic 1', subject: 'Subject' },
  ], ...initial };
  return {
    render() { h.begin(); return Player(props); },
    feedback(tree) { return Reveal(elements(tree, n => n.type === Reveal)[0].props); },
  };
}

test('feedback is absent for fresh/selected unchecked questions, appears on Check, and is absent on Next', () => {
  const player = feedbackPlayer();
  let tree = player.render();
  assert.equal(player.feedback(tree), null);
  elements(tree, n => n.type === 'question')[0].props.onSelect('B');
  tree = player.render();
  assert.equal(player.feedback(tree), null);
  const check = elements(tree, n => n.type === 'button' && elements(n, s => s.type === 'span' && s.props.children === 'Check Answer').length)[0];
  check.props.onClick(); tree = player.render();
  const feedback = player.feedback(tree);
  assert.ok(feedback);
  assert.match(JSON.stringify(feedback), /Correct|Your answer/);
  assert.match(JSON.stringify(feedback), /Explanation for q2/);
  assert.match(JSON.stringify(feedback), /PYQ Intelligence|What to do next/);
  const next = elements(tree, n => n.type === 'button' && elements(n, s => s.type === 'span' && s.props.children === 'Next Question').length)[0];
  next.props.onClick(); tree = player.render();
  assert.equal(elements(tree, n => n.type === 'question')[0].props.question.id, 'q1');
  assert.equal(player.feedback(tree), null);
});

test('withheld intelligence never exposes Exam Edge, PYQ Intelligence or concept metadata', () => {
  const Reveal = createLoader({ react: { useState: initial => [initial, () => {}] }, 'next/link': 'a',
    '@/components/common/MathText': 'math-text', '@/lib/learning-events': { trackLearningEvent() {} } })('frontend/src/components/practice/player/AnswerReveal.tsx').default;
  const tree = Reveal({
    visible: true,
    selectedOption: 'A',
    timeSpentSeconds: 30,
    question: {
      id: 'withheld', final_opt: 'A', explanation: 'Safe explanation',
      exam: 'CDS', year: 2025, subject: 'Polity', topic: 'Parliament',
      concept: 'Money Bill', q_pattern: 'Single MCQ',
      intelligence_eligible: false, student_release_status: 'WITHHELD',
      intelligence_trust_tier: 'NOT_ELIGIBLE',
    },
  });
  const rendered = JSON.stringify(tree);
  assert.match(rendered, /Safe explanation/);
  assert.match(rendered, /Attempt Intelligence/);
  assert.doesNotMatch(rendered, /Exam Edge/);
  assert.doesNotMatch(rendered, /PYQ Intelligence/);
  assert.doesNotMatch(rendered, /Money Bill/);
});

test('model-derived eligible intelligence shows Exam Edge without exposing provenance wording', () => {
  const Reveal = createLoader({ react: { useState: initial => [initial, () => {}] }, 'next/link': 'a',
    '@/components/common/MathText': 'math-text', '@/lib/learning-events': { trackLearningEvent() {} } })('frontend/src/components/practice/player/AnswerReveal.tsx').default;
  const tree = Reveal({
    visible: true,
    selectedOption: 'A',
    question: {
      id: 'model-edge', final_opt: 'A', explanation: 'Explanation',
      exam: 'CDS', year: 2025, subject: 'Polity', topic: 'Parliament',
      q_pattern: 'Statement based',
      intelligence_eligible: true, student_release_status: 'WITHHELD',
      intelligence_trust_tier: 'MODEL_READY', intelligence_confidence: 'MODEL_DERIVED',
    },
  });
  const rendered = JSON.stringify(tree);
  assert.match(rendered, /Exam Edge/);
  assert.doesNotMatch(rendered, /Model derived|Model ready|Verified|Under review/);
  assert.doesNotMatch(rendered, /PYQ Intelligence/);
});

test('Check Answer keeps provenance metadata internal and never renders provenance labels', () => {
  const Reveal = createLoader({ react: { useState: initial => [initial, () => {}] }, 'next/link': 'a',
    '@/components/common/MathText': 'math-text', '@/lib/learning-events': { trackLearningEvent() {} } })('frontend/src/components/practice/player/AnswerReveal.tsx').default;
  for (const trust of ['HUMAN_VERIFIED', 'MODEL_READY', 'REVIEW_REQUIRED']) {
    const tree = Reveal({
      visible: true,
      selectedOption: 'A',
      question: {
        id: 'provenance', final_opt: 'A', explanation: 'Explanation',
        exam: 'CDS', year: 2025, subject: 'Polity', topic: 'Parliament',
        intelligence_eligible: true, student_release_status: 'RELEASED',
        intelligence_trust_tier: trust,
      },
    });
    const rendered = JSON.stringify(tree);
    assert.doesNotMatch(rendered, /Human verified|Verified|Model derived|Model ready|Under review/);
  }
});

test('resume mounts feedback only for the current checked question ID, independently of selected answers', () => {
  for (const [index, checked, visible] of [[0, [], false], [1, [], false], [0, ['q2'], true], [1, ['q2'], false], [1, ['q1'], true]]) {
    const player = feedbackPlayer({ initialIndex: index, initialAnswers: { q2: 'B', q1: 'A' }, initialCheckedIds: checked });
    const feedback = player.feedback(player.render());
    assert.equal(feedback !== null, visible, `index ${index}, checked ${checked}`);
    if (visible) assert.match(JSON.stringify(feedback), new RegExp(`Explanation for ${index === 0 ? 'q2' : 'q1'}`));
  }
});

test('Dashboard resume restores checked separately from selected; Check and Next are single interactions', async () => {
  const h = hooks(); const writes = []; const attempts = []; const events = [];
  const load = createLoader({ react: h.react,
    '@/components/practice/player/ProgressHeader': 'progress', './ProgressHeader': 'progress',
    './QuestionCard': 'question', './AnswerReveal': 'reveal',
    '@/lib/learning-events': { trackLearningEvent: (...args) => events.push(args) },
    '@/lib/practice-session-client': { getLocalSession: () => ({ id: 'resume', question_times: {} }),
      updateSessionProgress: (_id, update) => writes.push(update), recordQuestionAttempt: params => { attempts.push(params); return Promise.resolve(); } },
  });
  const Player = load('frontend/src/components/practice/player/QuestionPlayer.tsx').default;
  const props = { sessionId: 'resume', mode: 'instant', questions: [{ id: 'q2', final_opt: 'B' }, { id: 'q1', final_opt: 'A' }], initialAnswers: { q2: 'B' }, initialCheckedIds: [], initialIndex: 0 };
  function render() { h.begin(); return Player(props); }
  let tree = render();
  assert.equal(elements(tree, n => n.type === 'question')[0].props.revealed, false);
  const check = elements(tree, n => n.type === 'button' && elements(n, s => s.type === 'span' && s.props.children === 'Check Answer').length)[0];
  check.props.onClick(); check.props.onClick(); tree = render();
  assert.equal(attempts.length, 1); assert.equal(events.filter(e => e[0] === 'practice_check').length, 1);
  assert.deepEqual(Array.from(writes.at(-1).checked_ids), ['q2']);
  const next = elements(tree, n => n.type === 'button' && elements(n, s => s.type === 'span' && s.props.children === 'Next Question').length)[0];
  next.props.onClick(); next.props.onClick(); tree = render();
  assert.equal(elements(tree, n => n.type === 'question')[0].props.question.id, 'q1');
  assert.equal(writes.at(-1).current_index, 1);
  assert.equal(events.filter(e => e[0] === 'practice_next').length, 1);
});

function apiFixture() {
  const tables = { practice_sessions: new Map(), user_attempts: new Map(), v_dp_question_intelligence_v2: new Map([['q1', { id: 'q1', final_opt: 'B' }]]) };
  const identity = { id: 'learner' };
  const client = { from(table) {
    const conditions = []; let payload; let writeOptions = {}; let updating = false;
    const query = {
      select() { return query; }, eq(key, value) { conditions.push([key, value]); return query; },
      upsert(value, options) { payload = value; writeOptions = options; return query; },
      update(value) { payload = value; updating = true; return query; },
      then(resolve, reject) { return execute().then(resolve, reject); },
      single: execute, maybeSingle: execute,
    };
    async function execute() {
      const rows = tables[table];
      if (payload && !updating && !(writeOptions.ignoreDuplicates && rows.has(payload.id))) rows.set(payload.id, { ...rows.get(payload.id), ...payload });
      let row = [...rows.values()].find(r => conditions.every(([k, v]) => r[k] === v));
      if (updating && row) { row = { ...row, ...payload }; rows.set(row.id, row); }
      return { data: row || null, error: null };
    }
    return query;
  } };
  const load = createLoader({
    'next/server': { NextResponse: { json: (body, options = {}) => ({ body, status: options.status || 200 }) } },
    'next/headers': { cookies: async () => ({ getAll: () => [], set() {} }) },
    '@supabase/ssr': { createServerClient: () => ({ auth: { getUser: async () => ({ data: { user: identity.id ? identity : null } }) } }) },
    '@supabase/supabase-js': { createClient: () => client },
  }, { process: { env: { NEXT_PUBLIC_SUPABASE_URL: 'https://offline.test', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'offline', SUPABASE_SERVICE_ROLE_KEY: 'offline' } } });
  return { tables, identity, load, request: body => ({ json: async () => body }) };
}

test('lost creation response/retry returns one cloud identity without resetting progress or crossing accounts', async () => {
  const f = apiFixture(); const { POST, PATCH } = f.load('frontend/src/app/api/practice/session/route.ts');
  const input = { creation_id: '11111111-1111-4111-8111-111111111111', mode: 'instant', question_ids: ['q1'], filters: { origin: 'explore' } };
  const first = await POST(f.request(input)); assert.equal(first.status, 200);
  await PATCH(f.request({ session_id: input.creation_id, current_index: 1, answers: { q1: 'B' }, filters: { progress: { checked_ids: ['q1'], question_times: { q1: 12 } } } }));
  const retry = await POST(f.request(input)); assert.equal(retry.body.session.current_index, 1);
  assert.equal(f.tables.practice_sessions.size, 1);
  assert.equal(retry.body.session.filters.progress.question_times.q1, 12);
  f.identity.id = 'other';
  const denied = await POST(f.request(input)); assert.equal(denied.body.session, undefined);
});

test('attempt replay is idempotent, cloud-linked and server-scored; another account cannot attach an attempt', async () => {
  const f = apiFixture(); const sessionId = '11111111-1111-4111-8111-111111111111';
  f.tables.practice_sessions.set(sessionId, { id: sessionId, user_id: 'learner', question_ids: ['q1'] });
  const { POST } = f.load('frontend/src/app/api/practice/attempt/route.ts');
  const body = { question_id: 'q1', session_id: sessionId, selected_option: 'B', is_correct: false, time_taken: 12 };
  assert.equal((await POST(f.request(body))).body.persisted, true);
  assert.equal((await POST(f.request(body))).body.persisted, true);
  assert.equal(f.tables.user_attempts.size, 1);
  const saved = [...f.tables.user_attempts.values()][0];
  assert.equal(saved.session_id, sessionId); assert.equal(saved.is_correct, true); assert.equal(saved.time_taken, 12);
  f.identity.id = 'other'; assert.equal((await POST(f.request(body))).status, 404);
});
