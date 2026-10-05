const { test } = require('node:test');
const assert = require('node:assert/strict');
const createLoader = require('./test-support/load-ts.cjs');

function harness({ next = '/dashboard', mode = 'login', verify = async () => ({ data: { session: {} }, error: null }), sendOtp = async () => ({ error: null }) } = {}) {
  let cursor = 0, sends = 0;
  const slots = [], navigations = [], timers = [];
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = initial;
      return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }];
    },
    useRef(initial) { const i = cursor++; slots[i] ??= { current: initial }; return slots[i]; },
    useEffect(effect) { effect(); },
  };
  const load = createLoader({ react, 'next/link': 'a',
    'next/navigation': { useSearchParams: () => new URLSearchParams({ next }) },
    '@/components/GoogleSignInButton': { __esModule: true, default: 'google-button' },
    '@/lib/supabase/client': { createClient: () => ({ auth: {
      signInWithOtp: async () => { sends++; return sendOtp(); }, verifyOtp: verify,
    } }) },
  }, { window: { location: { replace: url => navigations.push(url) },
    setTimeout: fn => { timers.push(fn); return timers.length; }, clearTimeout() {} } });
  const Form = load('frontend/src/components/auth/EmailOtpForm.tsx').default;
  function render() { cursor = 0; return Form({ mode }); }
  function nodes(predicate) {
    const found = [];
    function visit(n) {
      if (Array.isArray(n)) return n.forEach(visit);
      if (!n?.props) return;
      if (predicate(n)) found.push(n);
      visit(n.props.children);
    }
    visit(render()); return found;
  }
  const submit = () => nodes(n => n.type === 'form')[0].props.onSubmit({ preventDefault() {} });
  async function send() {
    nodes(n => n.props.id === 'email')[0].props.onChange({ target: { value: ' Test@Example.com ' } });
    await submit();
  }
  function code(value = '123456') { nodes(n => n.props.id === 'email-code')[0].props.onChange({ target: { value } }); }
  return { nodes, submit, send, code, navigations, load, get sends() { return sends; },
    tick() { const timer = timers.pop(); timers.length = 0; timer?.(); render(); } };
}

const intended = '/dashboard/practice/full-paper?exam=CDS&year=2024&cycle=II&returnTo=%2Fdashboard%2Fquestion-bank%3Fexam%3DCDS';
for (const [state, expected] of [
  ['incomplete', '/onboarding'], ['complete', intended], ['error', '/auth/recovery'],
]) {
  test(`OTP session feeds /auth/continue and the canonical ${state} state`, async () => {
    const h = harness({ next: intended }); await h.send(); h.code(); await h.submit();
    assert.equal(h.navigations.length, 1);
    const continuation = new URL(h.navigations[0], 'https://local.test');
    assert.equal(continuation.pathname, '/auth/continue');
    assert.equal(continuation.searchParams.get('next'), intended);
    let redirected;
    const load = createLoader({ 'next/navigation': { redirect: url => { redirected = url; } },
      '@/lib/supabase/server': { createClient: async () => ({}) },
      '@/lib/profile-store': { readAuthState: async () => state } });
    await load('frontend/src/app/auth/continue/page.tsx').default({ searchParams: Promise.resolve({ next: continuation.searchParams.get('next') }) });
    const destination = new URL(redirected, 'https://local.test');
    if (state === 'complete') assert.equal(redirected, expected);
    else { assert.equal(destination.pathname, expected); assert.equal(destination.searchParams.get('next'), intended); }
  });
}

test('email-only signup/login hides Google and uses canonical safe destinations', () => {
  for (const next of [intended, 'https://evil.test', '/onboarding?next=/auth/login', '/%61uth/login']) {
    for (const mode of ['login', 'signup']) {
      const h = harness({ next, mode });
      const safe = h.load('frontend/src/lib/auth-redirect.ts').safeAuthNext(next);
      assert.equal(h.nodes(n => n.type === 'google-button').length, 0);
      const link = new URL(h.nodes(n => n.type === 'a')[0].props.href, 'https://local.test');
      assert.equal(link.pathname, mode === 'login' ? '/auth/signup' : '/auth/login');
      assert.equal(link.searchParams.get('next'), safe);
    }
  }
});

test('expired and sessionless OTP keep code visible, preserve intent, and allow verification retry', async () => {
  let calls = 0;
  const h = harness({ next: intended, verify: async () => ++calls === 1
    ? { data: {}, error: new Error('Expired code') } : calls === 2
      ? { data: { session: null }, error: null } : { data: { session: {} }, error: null } });
  await h.send(); h.code();
  for (let i = 0; i < 2; i++) {
    await h.submit();
    assert.deepEqual(h.navigations, []);
    assert.equal(h.nodes(n => n.props.id === 'email-code')[0].props.value, '123456');
    assert.equal(h.nodes(n => n.props.role === 'alert').length, 1);
    assert.equal(h.nodes(n => n.props.type === 'submit')[0].props.disabled, false);
  }
  await h.submit();
  assert.equal(new URL(h.navigations[0], 'https://local.test').searchParams.get('next'), intended);
});

test('ambiguous network failure still exposes OTP entry without client lockout', async () => {
  const h = harness({ sendOtp: async () => { throw new TypeError('Load failed'); } });
  await h.send();
  const codeInput = h.nodes(n => n.props.id === 'email-code')[0];
  assert.ok(codeInput);
  assert.equal(h.nodes(n => n.props.role === 'alert')[0].props.children,
    'We couldn’t confirm the send response. If you received a code, enter it below.');
  const resend = h.nodes(n => n.props.type === 'button')[0];
  assert.equal(resend.props.disabled, false);
});

test('explicit rate limit keeps provider cooldown', async () => {
  const limited = Object.assign(new Error('Too many requests'), { status: 429, code: 'over_email_send_rate_limit' });
  const h = harness({ sendOtp: async () => ({ error: limited }) });
  await h.send();
  assert.equal(h.nodes(n => n.props.id === 'email-code').length, 0);
  const submitButton = h.nodes(n => n.props.type === 'submit')[0];
  assert.equal(submitButton.props.disabled, true);
});

test('resend cooldown and change-email preserve intent; rapid verification submits establish one navigation', async () => {
  let release, verifies = 0;
  const h = harness({ next: intended, verify: async () => { verifies++; await new Promise(r => { release = r; }); return { data: { session: {} }, error: null }; } });
  await h.send();
  const resend = () => h.nodes(n => n.props.type === 'button')[0];
  assert.equal(resend().props.disabled, true); await resend().props.onClick(); assert.equal(h.sends, 1);
  for (let i = 0; i < 60; i++) h.tick();
  assert.equal(resend().props.disabled, false); await resend().props.onClick(); assert.equal(h.sends, 2);
  h.nodes(n => n.props.type === 'button')[1].props.onClick();
  assert.equal(h.nodes(n => n.props.id === 'email')[0].props.value, ' Test@Example.com ');
  assert.equal(new URL(h.nodes(n => n.type === 'a')[0].props.href, 'https://local.test').searchParams.get('next'), intended);
  for (let i = 0; i < 60; i++) h.tick();
  await h.send(); h.code(); const first = h.submit(); await h.submit();
  assert.equal(verifies, 1); release(); await first; assert.equal(h.navigations.length, 1);
});
