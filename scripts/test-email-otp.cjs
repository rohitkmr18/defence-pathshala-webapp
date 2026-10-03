const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('../frontend/node_modules/typescript');
const source = fs.readFileSync('frontend/src/lib/email-otp.ts', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const context = { exports: {}, URL };
vm.runInNewContext(code, context);
const { safeAuthDestination, requestEmailCode, verifyEmailCode } = context.exports;
test('unsafe and auth-loop redirects fall back to dashboard', () => {
  for (const path of [null, '', '//evil.test', '/\\evil.test', 'https://evil.test', 'javascript:alert(1)', '/auth/login', '/auth/callback', '/foo/../auth/login']) assert.equal(safeAuthDestination(path), '/dashboard');
  assert.equal(safeAuthDestination('/dashboard/practice?exam=CDS'), '/dashboard/practice?exam=CDS');
});
test('email code request normalizes email and supports new and existing accounts', async () => {
  let args;
  const normalized = await requestEmailCode({ signInWithOtp: async (value) => { args = value; return { error: null }; } }, ' Test@Example.com ');
  assert.equal(normalized, 'test@example.com'); assert.equal(args.email, normalized); assert.equal(args.options.shouldCreateUser, true);
});
test('invalid email never calls auth', async () => {
  for (const email of ['', 'bad', 'a@b', 'a b@c.com']) await assert.rejects(requestEmailCode({ signInWithOtp: () => assert.fail('should not call') }, email));
});
test('delivery failures are returned to the form', async () => {
  await assert.rejects(requestEmailCode({ signInWithOtp: async () => ({ error: new Error('Rate limit') }) }, 'test@example.com'), /Rate limit/);
});
test('email verification accepts configured 6 or 8 digit codes and requires a session', async () => {
  for (const token of ['123456', '12345678']) {
    let args;
    await verifyEmailCode({ verifyOtp: async (value) => { args = value; return { data: { session: {} }, error: null }; } }, 'test@example.com', token);
    assert.equal(args.type, 'email'); assert.equal(args.token, token); assert.equal(args.email, 'test@example.com');
  }
});
test('malformed, rejected and sessionless verification cannot redirect', async () => {
  for (const token of ['123', 'abcdef', '12345678901']) await assert.rejects(verifyEmailCode({ verifyOtp: () => assert.fail('should not call') }, 'test@example.com', token));
  await assert.rejects(verifyEmailCode({ verifyOtp: async () => ({ data: {}, error: new Error('Expired') }) }, 'test@example.com', '123456'), /Expired/);
  await assert.rejects(verifyEmailCode({ verifyOtp: async () => ({ data: { session: null }, error: null }) }, 'test@example.com', '123456'), /Sign-in could not be completed/);
});
