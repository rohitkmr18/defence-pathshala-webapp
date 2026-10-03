import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Execute the real component with a deterministic offline hook/event harness.
// Supabase Auth and persistence are doubles; this does not prove real login.
function harness() {
  const slots = [], effects = [], timers = new Map(), calls = [];
  let cursor = 0, resolveAuth, resolveSubmit, tree;
  const auth = new Promise(resolve => { resolveAuth = resolve; });
  const paper = { id: 'offline-paper', exam: 'CDS', year: 2025, cycle: 'I',
    label: 'Offline CDS Paper', durationSeconds: 2 };
  const questions = [{ id: 'q1', final_opt: 'B' }];
  const changed = (a, b) => !a || !b || a.length !== b.length || a.some((v, i) => !Object.is(v, b[i]));
  const react = {
    useState(initial) {
      const index = cursor++;
      slots[index] ||= { value: typeof initial === 'function' ? initial() : initial };
      return [slots[index].value, next => { slots[index].value = typeof next === 'function' ? next(slots[index].value) : next; }];
    },
    useRef(initial) { const index = cursor++; slots[index] ||= { current: initial }; return slots[index]; },
    useCallback(fn, deps) {
      const index = cursor++;
      if (!slots[index] || changed(slots[index].deps, deps)) slots[index] = { fn, deps };
      return slots[index].fn;
    },
    useEffect(fn, deps) {
      const index = cursor++;
      if (!slots[index] || changed(slots[index].deps, deps)) {
        slots[index]?.cleanup?.();
        slots[index] = { deps };
        effects.push(() => { slots[index].cleanup = fn(); });
      }
    },
  };
  const jsx = (type, props) => ({ type, props });
  const dependencies = {
    react,
    'react/jsx-runtime': { jsx, jsxs: jsx },
    '@/lib/supabase/client': { createClient: () => ({ auth: { getUser: () => auth } }) },
    '@/components/practice/FullPaperHero': { AVAILABLE_FULL_PAPERS: [paper] },
    '@/lib/practice-session-client': {
      initializeSession: async params => { calls.push(['create', params]); return { id: 'local-paper' }; },
      updateSessionProgress: (...params) => calls.push(['progress', ...params]),
      completePracticeSession: params => { calls.push(['complete', params]); return new Promise(resolve => { resolveSubmit = resolve; }); },
    },
  };
  const exports = {};
  const source = ts.transpileModule(readFileSync(new URL('../app/dashboard/practice/full-paper/FullPaperClient.tsx', import.meta.url), 'utf8'),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(source, {
    exports, URLSearchParams, Set, Date, AbortController, console,
    fetch: async () => { calls.push(['questions']); return { ok: true, json: async () => ({ questions }) }; },
    setInterval: fn => { const id = Symbol(); timers.set(id, fn); return id; },
    clearInterval: id => timers.delete(id),
    setTimeout: fn => { const id = Symbol(); timers.set(id, fn); return id; },
    clearTimeout: id => timers.delete(id),
    require: name => dependencies[name] || { default: name, ...Object.fromEntries(['ArrowLeft', 'Loader2', 'LogIn'].map(n => [n, n])) },
  });
  function render() { cursor = 0; tree = exports.default({}); while (effects.length) effects.shift()(); return tree; }
  function find(type, node = tree) {
    if (!node || typeof node !== 'object') return null;
    if (node.type === type) return node;
    for (const child of [node.props?.children].flat(Infinity).filter(value => value != null)) { const found = find(type, child); if (found) return found; }
    return null;
  }
  return { render, find, calls, timers, resolveAuth, submit: () => resolveSubmit(),
    tick: () => [...timers.values()].forEach(fn => fn()) };
}
const settle = () => new Promise(resolve => setImmediate(resolve));

test('Full Paper waits for authentication; a guest never loads questions, creates a session or starts a timer', async () => {
  const ui = harness(); ui.render();
  assert.deepEqual(ui.calls, []); assert.equal(ui.timers.size, 0);
  ui.resolveAuth({ data: { user: null } }); await settle(); ui.render();
  assert.deepEqual(ui.calls, []); assert.equal(ui.timers.size, 0);
});

test('Full Paper starts a session after auth, saves answers, and waits for persistence before showing debrief', async () => {
  const ui = harness(); ui.render();
  ui.resolveAuth({ data: { user: { id: 'offline-learner' } } }); await settle(); ui.render();
  await settle(); ui.render();
  assert.deepEqual(ui.calls.slice(0, 2).map(c => c[0]), ['questions', 'create']);
  assert.equal(ui.calls[1][1].mode, 'full_paper'); assert.equal(ui.timers.size, 1);
  ui.find('@/components/practice/player/QuestionCard').props.onSelect('B'); ui.render();
  assert.equal(ui.calls.at(-1)[0], 'progress');
  assert.equal(ui.calls.at(-1)[2].answers.q1, 'B');
  ui.find('@/components/practice/full-paper/ExamHeader').props.onSubmitClick(); ui.render();
  const pending = ui.find('@/components/practice/full-paper/SubmitModal').props.onConfirm();
  ui.render();
  assert.equal(ui.find('@/components/practice/analysis/FullPaperDebrief'), null);
  assert.equal(ui.calls.at(-1)[0], 'complete');
  assert.equal(ui.calls.at(-1)[1].sessionId, 'local-paper');
  ui.submit(); await pending; ui.render();
  assert.ok(ui.find('@/components/practice/analysis/FullPaperDebrief'));
  assert.equal(ui.timers.size, 0);
});


test('timer expiry submits through persistence and cannot show an unsaved scorecard', async () => {
  const ui = harness(); ui.render(); ui.resolveAuth({ data: { user: { id: 'offline-learner' } } });
  await settle(); ui.render(); await settle(); ui.render();
  ui.tick(); ui.render(); ui.tick(); ui.render(); ui.tick(); ui.render();
  assert.equal(ui.calls.at(-1)[0], 'complete');
  assert.equal(ui.find('@/components/practice/analysis/FullPaperDebrief'), null);
  ui.submit(); await settle(); ui.render();
  assert.ok(ui.find('@/components/practice/analysis/FullPaperDebrief'));
});
