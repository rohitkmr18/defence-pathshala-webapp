const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const createLoader = require('./test-support/load-ts.cjs');
const tick = () => new Promise(resolve => setImmediate(resolve));
const uuid = () => randomUUID();
const learner = uuid();
const question = { id: 'q1', question_id: 'q1', final_opt: 'B', exam: 'CDS', year: 2025,
  subject: 'History', topic: 'Ancient History', concept: 'Mauryan administration' };
const filters = { exams: ['CDS'], years: [2025], cycles: ['II'], subjects: ['History'],
  topics: ['Ancient History'], mode: 'instant', origin: 'explore' };
function storage() {
  const data = new Map();
  return { get length() { return data.size; }, key: i => [...data.keys()][i],
    getItem: k => data.get(k) ?? null, setItem: (k, v) => data.set(k, v), removeItem: k => data.delete(k) };
}
function elements(tree, predicate) {
  const result = [];
  function visit(n) {
    if (Array.isArray(n)) return n.forEach(visit);
    if (!n?.props) return;
    if (predicate(n)) result.push(n);
    visit(n.props.children);
  }
  visit(tree); return result;
}
function hooks() {
  const slots = []; let index = 0; const effects = [];
  return { begin() { index = 0; }, replayEffects() {
    for (const slot of slots) if (slot?.effect) { slot.cleanup?.(); slot.cleanup = slot.effect(); }
  }, async flush() {
    for (const effect of effects.splice(0)) effect();
    await new Promise(resolve => setTimeout(resolve, 10));
    for (let i = 0; i < 20; i++) await tick();
  }, react: {
    useState(initial) { const i = index++; if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial;
      return [slots[i], v => { slots[i] = typeof v === 'function' ? v(slots[i]) : v; }]; },
    useRef(initial) { const i = index++; return slots[i] ||= { current: initial }; },
    useMemo(fn, deps) { const i = index++; if (!slots[i] || deps.some((d, j) => d !== slots[i].deps[j])) slots[i] = { value: fn(), deps }; return slots[i].value; },
    useEffect(fn, deps) { const i = index++; if (!slots[i] || !deps || deps.some((d, j) => d !== slots[i].deps[j])) {
      slots[i]?.cleanup?.(); const state = slots[i] = { deps, effect: fn }; effects.push(() => { state.cleanup = fn(); });
    } },
    useCallback(fn) { index++; return fn; },
  } };
}
function fixture({ authenticated = true, react = { useEffect: fn => fn() } } = {}) {
  let userId = authenticated ? learner : null;
  let clock = 0;
  const tables = { practice_sessions: new Map(), user_attempts: new Map(), v_dp_question_intelligence_v2: new Map([[question.id, question]]) };
  const client = { from(table) {
    const conditions = []; const sorts = []; let maximum; let payload; let opts; let update = false;
    const query = {
      select() { return query; }, eq(k, v) { conditions.push([k, v]); return query; },
      upsert(v, o) { payload = v; opts = o; return query; }, update(v) { payload = v; update = true; return query; },
      order(k, o) { sorts.push([k, o]); return query; }, limit(v) { maximum = v; return query; },
      then(resolve, reject) { return execute(false).then(resolve, reject); },
      single: () => execute(true), maybeSingle: () => execute(true),
    };
    async function execute(single) {
      const rows = tables[table];
      const ignored = payload && !update && opts?.ignoreDuplicates && rows.has(payload.id);
      if (payload && !update && !ignored) {
        const id = payload.id || uuid();
        rows.set(id, { ...payload, id, attempted_at: new Date(1700000000000 + ++clock).toISOString() });
      }
      let matches = [...rows.values()].filter(row => conditions.every(([k, v]) => row[k] === v));
      if (payload && !update && payload.id) matches = matches.filter(row => row.id === payload.id);
      if (update) for (const row of matches) { Object.assign(row, payload); rows.set(row.id, row); }
      matches.sort((a, b) => { for (const [k, o] of sorts) { const result = String(a[k]).localeCompare(String(b[k])); if (result) return o.ascending ? result : -result; } return 0; });
      if (maximum) matches = matches.slice(0, maximum);
      if (single) return { data: ignored ? null : matches[0] || null, error: null };
      return { data: matches, error: null };
    }
    return query;
  } };
  const localStorage = storage(), sessionStorage = storage();
  const listeners = new Map();
  const window = { localStorage, innerWidth: 800,
    location: { href: 'https://preview.test/dashboard/practice/session?exam=CDS&subject=History&topic=Ancient%20History&origin=explore', origin: 'https://preview.test', pathname: '/dashboard/practice/session', search: '' },
    history: { replaceState(_s, _t, href) { window.location.href = new URL(href, window.location.origin).href; },
      pushState(_s, _t, href) { window.location.href = new URL(href, window.location.origin).href; } },
    dispatchEvent(event) { for (const fn of listeners.get(event.type) || []) fn(event); },
    addEventListener(type, fn) { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(fn); },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
    setTimeout, clearTimeout, setInterval: () => 1, clearInterval() {}, scrollTo() {},
  };
  let routes;
  const globals = { window, localStorage, sessionStorage, crypto: { randomUUID }, AbortSignal, setTimeout, clearTimeout,
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } },
    process: { env: { NEXT_PUBLIC_SUPABASE_URL: 'https://offline.test', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'offline', SUPABASE_SERVICE_ROLE_KEY: 'offline', NEXT_PUBLIC_DP_DEPLOYMENT_ENV: 'test' } },
    fetch: async (href, options = {}) => {
      if (href.startsWith('/api/practice/count')) return { ok: true, json: async () => ({ count: 2 }) };
      if (href.startsWith('/api/practice/questions')) return { ok: true, json: async () => ({ questions: [question, { ...question, id: 'q2' }] }) };
      const route = href.startsWith('/api/practice/attempt') ? routes.attempt : routes.session;
      const request = { json: async () => JSON.parse(options.body || '{}'), nextUrl: new URL(href, 'https://offline.test') };
      const result = await route[options.method || 'GET'](request);
      return { ok: result.status < 400, json: async () => result.body };
    },
  };
  const load = createLoader({ react, 'next/link': 'a',
    'posthog-js': {},
    'next/server': { NextResponse: { json: (body, options = {}) => ({ body, status: options.status || 200 }) } },
    'next/headers': { cookies: async () => ({ getAll: () => [], set() {} }) },
    '@supabase/ssr': { createServerClient: () => ({ auth: { getUser: async () => ({ data: { user: userId ? { id: userId } : null } }) } }) },
    '@supabase/supabase-js': { createClient: () => client },
    '@/lib/supabase/client': { createClient: () => ({ auth: { getUser: async () => ({ data: { user: userId ? { id: userId } : null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) } }) },
    'next/navigation': { useRouter: () => ({ replace() {}, push(href) { window.location.href = new URL(href, window.location.origin).href; } }),
      useSearchParams: () => new URL(window.location.href).searchParams },
    '@/lib/question-bank-client': { getQuestionBank: async () => ({ subjects: [{ name: 'History', value: 2 }], summary: { questions: 2 }, subjectAnalytics: {}, subjectTopics: {}, topics: [], difficulty: [], questionPatterns: [], questionTypes: [] }) },
    '@/components/charts/TopicHeatmap': 'heatmap', '@/components/charts/DifficultyVisualizer': 'difficulty', '@/components/charts/QuestionPatternMatrix': 'patterns',
    '@/components/practice/FullPaperHero': { __esModule: true, default: 'paper-hero' },
    '@/components/practice/QuestionDistributionChart': 'distribution', './PracticeFilters': 'filters',
    '@/components/practice/PracticePersistenceStatus': 'status', '@/components/practice/player/QuestionPlayer': 'player',
    '@/components/practice/analysis/FilteredAttemptDebrief': 'debrief',
    './ProgressHeader': 'progress', './QuestionCard': 'question', './AnswerReveal': 'reveal',
  }, globals);
  routes = { session: load('frontend/src/app/api/practice/session/route.ts'), attempt: load('frontend/src/app/api/practice/attempt/route.ts') };
  const sessions = load('frontend/src/lib/practice-session-client.ts');
  const track = load('frontend/src/lib/analytics/track.ts');
  const context = load('frontend/src/lib/analytics/context.ts');
  return { load, tables, sessions, track, context, globals, window, authenticate() { userId = learner; },
    events(name) { return (window.dataLayer || []).filter(event => event[1] === name).map(event => event[2]); } };
}

test('server session UUID is canonical in browser, player, attempts and every learning event', async () => {
  const h = hooks(), f = fixture({ react: h.react });
  const Page = f.load('frontend/src/app/dashboard/practice/session/SessionPageClient.tsx').default;
  const props = { mode: 'instant', exam: 'CDS', year: '2025', cycle: 'II', subject: 'History', topic: 'Ancient History', origin: 'explore' };
  h.begin(); Page(props); await h.flush(); h.begin(); const tree = Page(props); await h.flush();
  const playerProps = elements(tree, n => n.type === 'player')[0].props;
  const id = playerProps.sessionId;
  assert.match(id, /^[0-9a-f-]{36}$/i);
  assert.equal(f.sessions.getLocalSession().id, id);
  assert.equal(f.tables.practice_sessions.get(id).user_id, learner);
  assert.equal(new URL(f.window.location.href).searchParams.get('session_id'), id);
  assert.equal(f.events('practice_started').length, 1);
  assert.equal(f.events('practice_resumed').length, 0);
  assert.equal(f.events('practice_started')[0].practice_session_id, id);
  // Run the actual player and canonical provider, retaining state across interactions.
  const playerHooks = hooks();
  // Use a separate loader for player hook slots, sharing the production session and analytics modules.
  const loadPlayer = createLoader({ react: playerHooks.react, './ProgressHeader': 'progress', './QuestionCard': 'question', './AnswerReveal': 'reveal',
    '@/lib/practice-session-client': f.sessions, '@/lib/learning-events': f.load('frontend/src/lib/learning-events.ts'),
  }, f.globals);
  const ActualPlayer = loadPlayer('frontend/src/components/practice/player/QuestionPlayer.tsx').default;
  function render() { playerHooks.begin(); return ActualPlayer(playerProps); }
  let player = render(); elements(player, n => n.type === 'question')[0].props.onSelect('B'); player = render();
  const button = label => elements(player, n => n.type === 'button' && elements(n, s => s.type === 'span' && s.props.children === label).length)[0];
  const check = button('Check Answer'); check.props.onClick(); check.props.onClick(); player = render();
  const next = button('Next Question'); next.props.onClick(); next.props.onClick();
  for (const name of ['question_answered', 'answer_checked', 'next_question_clicked']) {
    assert.equal(f.events(name).length, 1);
    const event = f.events(name)[0];
    assert.equal(event.practice_session_id, id);
    assert.equal(event.question_id, 'q1');
    assert.equal(event.exam, 'CDS'); assert.equal(event.subject, 'History'); assert.equal(event.topic, 'Ancient History');
    assert.equal(event.source_surface, 'explore'); assert.equal(event.practice_mode, 'instant');
  }
  for (let i = 0; i < 20; i++) await tick();
  assert.equal([...f.tables.user_attempts.values()][0].session_id, id);
  // A URL rewrite / repeated render cannot turn this creation into a resume.
  h.begin(); Page({ ...props, resume: true, resumeSessionId: id }); await h.flush();
  assert.equal(f.events('practice_started').length, 1); assert.equal(f.events('practice_resumed').length, 0);
});

test('guest checks survive authentication, durable claim, attempt replay and reload', async () => {
  const h = hooks(), f = fixture({ authenticated: false, react: h.react });
  const guest = await f.sessions.initializeSession({ title: 'History', mode: 'instant', filters, questions: [question] });
  await tick(); await tick();
  f.sessions.updateSessionProgress(guest.id, { answers: { q1: 'B' }, checked_ids: ['q1'] });
  await f.sessions.recordQuestionAttempt({ question, selectedOption: 'B', isCorrect: false, sessionId: guest.id });
  assert.equal(f.tables.user_attempts.size, 0);
  assert.equal(f.sessions.getLocalSession().pending_attempts.q1.selectedOption, 'B');
  assert.equal(f.context.practiceContext(f.sessions.getLocalSession()).practice_session_id, undefined);
  f.authenticate();
  f.window.location.href = `https://preview.test/dashboard/practice/session?resume=true&session_id=${guest.id}&claim=1&origin=explore`;
  const Page = f.load('frontend/src/app/dashboard/practice/session/SessionPageClient.tsx').default;
  const props = { mode: 'instant', resume: true, resumeSessionId: guest.id, origin: 'explore' };
  h.begin(); Page(props); await h.flush(); h.begin(); const tree = Page(props); await h.flush();
  const claimed = f.sessions.getLocalSession();
  assert.equal(elements(tree, n => n.type === 'player')[0].props.sessionId, claimed.id);
  assert.equal(f.events('practice_started').length, 1);
  assert.equal(f.events('practice_resumed').length, 0);
  assert.equal(f.tables.practice_sessions.get(claimed.id).user_id, learner);
  assert.equal(claimed.id, claimed.server_id);
  assert.equal([...f.tables.user_attempts.values()][0].session_id, claimed.id);
  assert.equal([...f.tables.user_attempts.values()][0].is_correct, true); // server scoring
  assert.deepEqual(JSON.parse(JSON.stringify(claimed.pending_attempts)), {});
  const reloaded = await f.sessions.loadResumeSession(claimed.id);
  assert.equal(reloaded.id, claimed.id); assert.equal(reloaded.answers.q1, 'B');
  assert.equal(reloaded.filters.origin, 'explore');
});

test('real interrupted resume emits once and fresh addressable zero-progress restore emits no resume', async () => {
  for (const progress of [false, true]) {
    const h = hooks(), f = fixture({ react: h.react });
    const session = await f.sessions.settledPracticeSession(await f.sessions.initializeSession({ title: 'History', mode: 'instant', filters, questions: [question] }));
    if (progress) f.sessions.updateSessionProgress(session.id, { answers: { q1: 'A' }, checked_ids: ['q1'], current_index: 1 });
    for (let i = 0; i < 5; i++) await tick();
    f.window.location.href = `https://preview.test/dashboard/practice/session?resume=true&session_id=${session.id}&origin=dashboard_resume`;
    const Page = f.load('frontend/src/app/dashboard/practice/session/SessionPageClient.tsx').default;
    const props = { mode: 'instant', resume: true, resumeSessionId: session.id, origin: 'dashboard_resume' };
    h.begin(); Page(props); await h.flush(); h.begin(); Page(props); await h.flush();
    assert.equal(f.events('practice_started').length, 0);
    assert.equal(f.events('practice_resumed').length, progress ? 1 : 0);
    if (progress) assert.equal(f.events('practice_resumed')[0].source_surface, 'dashboard_resume');
  }
});

test('verified incorrect-to-correct transition emits once; retries and further correct/incorrect attempts do not resolve', async () => {
  const f = fixture();
  f.load('frontend/src/components/analytics/AnalyticsIdentity.tsx').default();
  async function attempt(option) {
    const session = await f.sessions.settledPracticeSession(await f.sessions.initializeSession({ title: 'History', mode: 'instant', filters, questions: [question] }));
    await f.sessions.recordQuestionAttempt({ question, selectedOption: option, isCorrect: option === 'B', sessionId: session.id });
    return session;
  }
  await attempt('A'); assert.equal(f.events('mistake_resolved').length, 0);
  await attempt('A'); assert.equal(f.events('mistake_resolved').length, 0);
  const correct = await attempt('B'); assert.equal(f.events('mistake_resolved').length, 1);
  const event = f.events('mistake_resolved')[0];
  assert.equal(event.practice_session_id, correct.id); assert.equal(event.question_id, question.id);
  assert.equal(event.exam, 'CDS'); assert.equal(event.source_surface, 'explore');
  await f.sessions.recordQuestionAttempt({ question, selectedOption: 'B', isCorrect: true, sessionId: correct.id });
  await attempt('B'); assert.equal(f.events('mistake_resolved').length, 1);
  await attempt('A'); await attempt('B'); assert.equal(f.events('mistake_resolved').length, 2);
});

test('NBA target and durable resume ID come from structured recommendation URL and travel in entry origin', () => {
  const f = fixture();
  const id = uuid();
  const href = `/dashboard/practice/session?resume=true&session_id=${id}&exam=CDS&subject=History&topic=Ancient%20History&origin=dashboard_resume`;
  const context = f.context.recommendationContext({ type: 'resume_session', href });
  assert.equal(context.recommendation_type, 'resume_session'); assert.equal(context.target_session_id, id);
  assert.equal(context.target_exam, 'CDS'); assert.equal(context.target_subject, 'History'); assert.equal(context.target_topic, 'Ancient History');
  assert.equal(new URL(context.target_href, 'https://local.test').searchParams.get('origin'), 'dashboard_next_best_move');
  assert.equal(f.context.recommendationContext({ type: 'explore', href: '/dashboard/question-bank' }).target_exam, undefined);
});


test('Explore exposure survives filters/rerenders/Strict Mode while selections and CTA retain the same destination context', async () => {
  const h = hooks(), f = fixture({ react: h.react });
  f.window.location.href = 'https://preview.test/dashboard/question-bank';
  f.window.location.pathname = '/dashboard/question-bank';
  const Explorer = f.load('frontend/src/components/question-bank/QuestionBankExplorer.tsx').default;
  const props = { meta: { exams: [{ value: 'CDS', label: 'CDS', years: [2025], cycles: ['II'] }] } };
  function render() { h.begin(); return Explorer(props); }
  let tree = render(); await h.flush(); tree = render(); await h.flush();
  assert.equal(f.events('explore_viewed').length, 1);
  h.replayEffects(); await h.flush();
  assert.equal(f.events('explore_viewed').length, 1);
  elements(tree, n => n.type === 'input' && n.props.type === 'checkbox')[0].props.onChange();
  tree = render(); await h.flush(); tree = render();
  assert.equal(f.events('explore_viewed').length, 1);
  assert.equal(f.events('exam_selected').at(-1).exam, 'CDS');
  elements(tree, n => n.type === 'heatmap')[0].props.onSelectSubject('History');
  tree = render(); await h.flush(); tree = render();
  assert.equal(f.events('explore_viewed').length, 1);
  assert.equal(f.events('subject_selected').at(-1).exam, 'CDS');
  assert.equal(f.events('subject_selected').at(-1).subject, 'History');
  const cta = elements(tree, n => n.type === 'a' && n.props.href?.startsWith('/dashboard/practice'))[0];
  cta.props.onClick();
  const event = f.events('practice_cta_clicked').at(-1);
  assert.equal(event.exam, new URL(cta.props.href, 'https://local.test').searchParams.get('exam'));
  assert.equal(event.subject, 'History');
  const track = f.load('frontend/src/lib/learning-events.ts');
  // A genuinely new component visit has a new key and is not suppressed all session long.
  const anotherHooks = hooks();
  const another = createLoader({ react: anotherHooks.react, 'next/link': 'a',
    'next/navigation': { useSearchParams: () => new URL(f.window.location.href).searchParams },
    '@/lib/question-bank-client': { getQuestionBank: async () => ({ subjects: [], summary: { questions: 0 }, subjectAnalytics: {} }) },
    '@/components/charts/TopicHeatmap': 'heatmap', '@/components/charts/DifficultyVisualizer': 'difficulty', '@/components/charts/QuestionPatternMatrix': 'patterns',
    '@/lib/learning-events': track,
  }, f.globals)('frontend/src/components/question-bank/QuestionBankExplorer.tsx').default;
  anotherHooks.begin(); another(props); await anotherHooks.flush();
  assert.equal(f.events('explore_viewed').length, 2);
});

test('practice configuration CTA event matches the destination used for launch', async () => {
  const h = hooks(), f = fixture({ react: h.react });
  f.window.location.href = 'https://preview.test/dashboard/practice?exam=CDS&year=2025&cycle=II&subject=History&topic=Ancient%20History&origin=explore';
  const Page = f.load('frontend/src/app/dashboard/practice/components/PracticePageClient.tsx').default;
  h.begin(); Page(); await h.flush(); h.begin(); const tree = Page(); await h.flush();
  const start = elements(tree, n => n.type === 'button' && elements(n, c => c.type === 'span' && c.props.children === 'Start Practice Session').length)[0];
  start.props.onClick();
  const event = f.events('practice_cta_clicked').at(-1);
  const destination = new URL(f.window.location.href);
  for (const key of ['exam', 'year', 'cycle', 'subject', 'topic']) assert.equal(event[key], destination.searchParams.get(key));
  assert.equal(event.source_surface, 'explore');
});


test('topic selection and topic practice CTA use the exact exam/subject/topic destination context', () => {
  const h = hooks(), f = fixture();
  const load = createLoader({ react: h.react, 'next/link': 'a',
    '@/lib/learning-events': f.load('frontend/src/lib/learning-events.ts'),
  }, f.globals);
  const Heatmap = load('frontend/src/components/charts/TopicHeatmap.tsx').default;
  h.begin(); const tree = Heatmap({ subjects: [{ name: 'History', value: 2 }], totalQuestions: 2,
    subjectTopics: { History: [{ name: 'Ancient History', value: 2 }] },
    selectedSubject: 'History', selectedExams: ['CDS'], selectedYears: [2025], selectedCycles: ['II'] });
  const cta = elements(tree, n => n.type === 'a' && n.props.href?.startsWith('/dashboard/practice'))[0];
  cta.props.onClick();
  const destination = new URL(cta.props.href, 'https://local.test');
  for (const name of ['topic_selected', 'practice_cta_clicked']) {
    const event = f.events(name).at(-1);
    for (const key of ['exam', 'year', 'cycle', 'subject', 'topic']) assert.equal(event[key], destination.searchParams.get(key));
    assert.equal(event.source_surface, 'explore');
  }
});

test('legacy guest snapshots falsely marked saved reconcile checked answers into durable attempts', async () => {
  const f = fixture({ authenticated: false });
  const guest = await f.sessions.settledPracticeSession(await f.sessions.initializeSession({ title: 'History', mode: 'instant', filters, questions: [question] }));
  f.sessions.saveLocalSession({ ...guest, id: 'sess_legacy_guest', answers: { q1: 'B' }, checked_ids: ['q1'], saved_attempts: { q1: 'B' }, pending_attempts: {} });
  f.authenticate();
  const claimed = await f.sessions.claimPracticeSession(f.sessions.getLocalSession(), [question]);
  assert.equal(claimed.id, guest.creation_id);
  assert.equal(claimed.server_id, claimed.id);
  assert.equal(f.tables.practice_sessions.get(claimed.id).user_id, learner);
  assert.equal([...f.tables.user_attempts.values()][0].session_id, claimed.id);
  assert.equal([...f.tables.user_attempts.values()][0].is_correct, true);
  assert.deepEqual(JSON.parse(JSON.stringify(claimed.pending_attempts)), {});
});
