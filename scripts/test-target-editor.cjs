const { test } = require('node:test');
const assert = require('node:assert/strict');
const createLoader = require('./test-support/load-ts.cjs');

function harness(profilePromise) {
  let cursor = 0, reads = 0;
  const slots = [], effects = [], saves = [];
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial;
      return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }];
    },
    useEffect(effect, deps) {
      const i = cursor++, old = slots[i];
      if (!old || deps.some((d, n) => !Object.is(d, old.deps[n]))) {
        effects.push(() => { old?.cleanup?.(); slots[i] = { deps, cleanup: effect() }; });
      }
    },
  };
  const load = createLoader({ react,
    'next/navigation': { useRouter: () => ({ refresh() {} }) },
    '@/lib/profile': { getProfile: () => { reads++; return profilePromise; }, updateProfile: async p => { saves.push(p); return p; } },
  });
  const Modal = load('frontend/src/components/dashboard/EditTargetModal.tsx').default;
  const props = { isOpen: true, onClose() {} };
  function render() {
    cursor = 0;
    let tree = Modal(props);
    if (typeof tree?.type === 'function') tree = tree.type(tree.props);
    while (effects.length) effects.shift()();
    return tree;
  }
  return { render, saves, reads: () => reads };
}
function nodes(tree, predicate) {
  const found = [];
  function visit(n) {
    if (Array.isArray(n)) return n.forEach(visit);
    if (!n?.props) return;
    if (predicate(n)) found.push(n);
    visit(n.props.children);
  }
  visit(tree); return found;
}
const flush = () => new Promise(resolve => setImmediate(resolve));
const choice = (tree, key) => nodes(tree, n => n.type === 'button' && String(n.key) === String(key))[0];
const save = tree => nodes(tree, n => n.type === 'button' && n.props.className?.includes('inline-flex items-center gap-2'))[0];

test('target editor loads once and saves edited AFCAT choices without stale profile resets', async () => {
  let resolve;
  const h = harness(new Promise(r => { resolve = r; }));
  let tree = h.render();
  assert.equal(choice(tree, 'AFCAT').props.disabled, true);
  assert.equal(save(tree).props.disabled, true);
  tree = h.render();
  assert.equal(h.reads(), 1);
  resolve({ target_exams: ['CDS', 'CAPF-AC'], target_year: 2028 });
  await flush(); tree = h.render();
  choice(tree, 'CAPF-AC').props.onClick(); tree = h.render();
  choice(tree, 'AFCAT').props.onClick(); tree = h.render();
  choice(tree, 2027).props.onClick(); tree = h.render();
  await flush(); tree = h.render();
  assert.equal(h.reads(), 1);
  assert.equal(choice(tree, 'AFCAT').props['aria-pressed'], true);
  assert.equal(choice(tree, 'CAPF-AC').props['aria-pressed'], false);
  await save(tree).props.onClick();
  assert.deepEqual(JSON.parse(JSON.stringify(h.saves)), [{ target_exams: ['CDS', 'AFCAT'], target_year: 2027 }]);
});

test('failed initial load keeps target editing disabled and exposes recovery message', async () => {
  const h = harness(Promise.reject(new Error('offline')));
  h.render(); await flush();
  const tree = h.render();
  assert.equal(nodes(tree, n => n.props.role === 'alert').length, 1);
  assert.equal(save(tree).props.disabled, true);
  await save(tree).props.onClick();
  assert.equal(h.saves.length, 0);
});
