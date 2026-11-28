const { test } = require('node:test');
const assert = require('node:assert/strict');
const createLoader = require('./test-support/load-ts.cjs');

// A hook harness drives production component events and retains state across
// rerenders. Browser layout/accessibility and real provider sessions remain manual.
function hooks() {
  let cursor = 0;
  const slots = [];
  return {
    begin() { cursor = 0; },
    react: {
      useState(initial) {
        const index = cursor++;
        if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
        return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }];
      },
      useRef(initial) { const index = cursor++; slots[index] ??= { current: initial }; return slots[index]; },
      useEffect() {}, useCallback: value => value,
    },
  };
}
function elements(tree, predicate) {
  const result = [];
  function visit(node) {
    if (Array.isArray(node)) { node.forEach(visit); return; }
    if (!node || typeof node !== 'object' || !node.props) return;
    if (predicate(node)) result.push(node);
    visit(node.props.children);
  }
  visit(tree); return result;
}

test('failed save keeps all visible inputs, supports retry and prevents rapid duplicate submits', async () => {
  const h = hooks(); const navigations = []; let attempts = 0; let release;
  const load = createLoader({ react: h.react, 'next/link': 'a' }, {
    window: { location: { replace: url => navigations.push(url) } },
    fetch: async () => {
      attempts++;
      await new Promise(resolve => { release = resolve; });
      return { ok: attempts > 1, json: async () => attempts > 1 ? { onboarding_completed: true } : { error: 'Save failed' } };
    },
  });
  const Form = load('frontend/src/app/onboarding/OnboardingForm.tsx').default;
  const props = { profile: { full_name: 'Available Name', target_year: null, target_exams: [] }, next: '/dashboard/practice/full-paper?exam=CDS&year=2024&cycle=II' };
  function render() { h.begin(); return Form(props); }
  let tree = render();
  assert.equal(elements(tree, n => n.props.id === 'full-name')[0].props.value, 'Available Name');
  elements(tree, n => n.props.id === 'full-name')[0].props.onChange({ target: { value: 'Edited Name' } });
  elements(tree, n => n.props.id === 'target-year')[0].props.onChange({ target: { value: '2028' } });
  for (const exam of ['CDS', 'AFCAT']) {
    elements(tree, n => n.props.name === 'target_exams' && n.props.value === exam)[0].props.onChange();
    tree = render();
  }
  tree = render();
  const submit = elements(tree, n => n.type === 'form')[0].props.onSubmit;
  const first = submit({ preventDefault() {} });
  await submit({ preventDefault() {} });
  assert.equal(attempts, 1);
  release(); await first;
  tree = render();
  assert.equal(elements(tree, n => n.props.id === 'full-name')[0].props.value, 'Edited Name');
  assert.equal(elements(tree, n => n.props.id === 'target-year')[0].props.value, '2028');
  for (const exam of ['CDS', 'AFCAT']) assert.equal(elements(tree, n => n.props.name === 'target_exams' && n.props.value === exam)[0].props.checked, true);
  assert.equal(elements(tree, n => n.props.role === 'alert').length, 1);
  assert.equal(elements(tree, n => n.props.type === 'submit')[0].props.disabled, false);
  assert.deepEqual(navigations, []);
  const retry = elements(tree, n => n.type === 'form')[0].props.onSubmit({ preventDefault() {} });
  release(); await retry;
  assert.deepEqual(navigations, [props.next]);
});

test('guest selecting a full paper uses the selected exam/year/cycle in login intent', (t) => {
  const h = hooks(); const pushed = [];
  let search = new URLSearchParams();
  const oldWindow = global.window;
  global.window = { location: { pathname: '/dashboard/practice', search: '' }, history: { replaceState(_state, _title, url) {
    search = new URL(url, 'https://local.test').searchParams;
  } } };
  t.after(() => { global.window = oldWindow; });
  const load = createLoader({
    react: h.react, 'next/link': 'a',
    'next/navigation': { useRouter: () => ({ push: url => pushed.push(url) }), useSearchParams: () => search },
    '@/lib/supabase/client': {},
    '@/components/practice/FullPaperHero': { __esModule: true, default: 'paper-hero' },
    '@/components/practice/QuestionDistributionChart': { __esModule: true, default: 'distribution' },
    './PracticeFilters': { __esModule: true, default: 'filters' },
    '@/components/mock/MockCatalogue': { __esModule: true, default: 'mock-catalogue' },
  }, { window: global.window, process: { env: {} } });
  const Page = load('frontend/src/app/dashboard/practice/components/PracticePageClient.tsx').default;
  function render() { h.begin(); return Page(); }
  let tree = render();
  const modeButton = elements(tree, n => n.type === 'button').find(n => elements(n, x => x.type === 'span' && x.props.children === 'Full Paper Mock').length);
  modeButton.props.onClick(); tree = render();
  const paper = { exam: 'CDS', year: 2024, cycle: 'II' };
  elements(tree, n => n.type === 'paper-hero')[0].props.onStart(paper);
  tree = render();
  const gate = elements(tree, n => typeof n.type === 'function' && n.props.nextUrl)[0];
  const banner = gate.type(gate.props);
  const login = elements(banner, n => n.type === 'a')[0].props.href;
  assert.equal(new URL(login, 'https://local.test').searchParams.get('next'), '/dashboard/practice/full-paper?exam=CDS&year=2024&cycle=II&origin=practice');
  assert.deepEqual(pushed, []);
});

function practiceWithFlag(flag, initialSearch = '') {
  const h = hooks();
  let search = new URLSearchParams(initialSearch);
  const oldWindow = global.window;
  global.window = { location: { href: 'https://local.test/dashboard/practice?mode=full_paper', pathname: '/dashboard/practice', search: '' }, history: { replaceState(_s, _t, url) {
    search = new URL(url, 'https://local.test').searchParams;
  } } };
  const load = createLoader({
    react: h.react, 'next/link': 'a',
    'next/navigation': { useRouter: () => ({ push() {} }), useSearchParams: () => search },
    '@/lib/supabase/client': {},
    '@/components/practice/FullPaperHero': { __esModule: true, default: 'paper-hero' },
    '@/components/practice/QuestionDistributionChart': { __esModule: true, default: 'distribution' },
    './PracticeFilters': { __esModule: true, default: 'filters' },
    '@/components/mock/MockCatalogue': { __esModule: true, default: 'mock-catalogue' },
  }, { window: global.window, process: { env: { NEXT_PUBLIC_MOCK_CDS_ENABLED: flag } } });
  const Page = load('frontend/src/app/dashboard/practice/components/PracticePageClient.tsx').default;
  const render = () => { h.begin(); return Page(); };
  let tree = render();
  const modeButton = elements(tree, n => n.type === 'button').find(n => elements(n, x => x.type === 'span' && x.props.children === 'Full Paper Mock').length);
  modeButton.props.onClick(); tree = render();
  return { render, tree: () => tree, setTree: t => { tree = t; }, getSearch: () => search, restore: () => { global.window = oldWindow; } };
}

test('DP Mock Tests tab is hidden unless the release flag is exactly "true"', t => {
  for (const flag of [undefined, 'false', '1', 'TRUE']) {
    const p = practiceWithFlag(flag); t.after(p.restore);
    assert.equal(elements(p.tree(), n => n.props.role === 'tablist').length, 0, `flag=${flag}`);
    assert.equal(elements(p.tree(), n => n.type === 'paper-hero').length, 1);
  }
});

test('with the flag on, switching tabs swaps hero/catalogue and persists fp=dp', t => {
  const p = practiceWithFlag('true'); t.after(p.restore);
  let tree = p.tree();
  assert.equal(elements(tree, n => n.props.role === 'tablist').length, 1);
  assert.equal(elements(tree, n => n.type === 'paper-hero').length, 1);
  const tab = label => elements(tree, n => n.props.role === 'tab' && elements(n, x => x.type === 'span' && x.props.children === label).length)[0];
  tab('DP Mock Tests').props.onClick(); tree = p.render();
  assert.equal(elements(tree, n => n.type === 'mock-catalogue').length, 1);
  assert.equal(elements(tree, n => n.type === 'paper-hero').length, 0);
  assert.equal(p.getSearch().get('fp'), 'dp');
  tab('Past UPSC Papers').props.onClick(); tree = p.render();
  assert.equal(elements(tree, n => n.type === 'paper-hero').length, 1);
  assert.equal(p.getSearch().get('fp'), null);
});

test('?fp=dp opens the DP Mock Tests tab on load', t => {
  const p = practiceWithFlag('true', 'fp=dp'); t.after(p.restore);
  assert.equal(elements(p.tree(), n => n.type === 'mock-catalogue').length, 1);
});

test('onboarding NDA selection clears other targets and locks them until deselected', () => {
  const h = hooks();
  const Form = createLoader({ react: h.react, 'next/link': 'a' })('frontend/src/app/onboarding/OnboardingForm.tsx').default;
  const props = { profile: { full_name: null, target_year: null, target_exams: [] }, next: '/dashboard' };
  const render = () => { h.begin(); return Form(props); };
  let tree = render();
  const choice = id => elements(tree, n => n.props.name === 'target_exams' && n.props.value === id)[0];
  choice('CDS').props.onChange(); tree = render();
  choice('AFCAT').props.onChange(); tree = render();
  choice('NDA').props.onChange(); tree = render();
  assert.equal(choice('NDA').props.checked, true);
  for (const id of ['CDS','AFCAT','CAPF-AC']) { assert.equal(choice(id).props.checked, false); assert.equal(choice(id).props.disabled, true); }
  choice('CDS').props.onChange(); tree = render(); assert.equal(choice('CDS').props.checked, false);
  choice('NDA').props.onChange(); tree = render(); assert.equal(choice('CDS').props.disabled, false);
  choice('CDS').props.onChange(); tree = render(); choice('AFCAT').props.onChange(); tree = render();
  assert.equal(choice('CDS').props.checked, true); assert.equal(choice('AFCAT').props.checked, true);
});
