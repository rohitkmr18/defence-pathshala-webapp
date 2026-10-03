import test from 'node:test';
import assert from 'node:assert/strict';
import { getBackendUrl, requireBackendUrl } from '../lib/backend-config.ts';

test('production never silently uses localhost; optional backend is explicit', () => {
  const oldEnv = process.env.NODE_ENV, oldUrl = process.env.BACKEND_URL;
  try {
    process.env.NODE_ENV = 'production';
    delete process.env.BACKEND_URL;
    assert.equal(getBackendUrl(), null);
    assert.throws(requireBackendUrl, /not configured/);
    for (const url of ['http://127.0.0.1:8000','http://localhost:8000','http://[::1]:8000']) {
      process.env.BACKEND_URL = url;
      assert.throws(getBackendUrl, /must not use localhost/);
    }
    process.env.BACKEND_URL = 'https://api.example.com/';
    assert.equal(getBackendUrl(), 'https://api.example.com');
    process.env.NODE_ENV = 'development';
    delete process.env.BACKEND_URL;
    assert.equal(getBackendUrl(), 'http://127.0.0.1:8000');
  } finally {
    if (oldEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = oldEnv;
    if (oldUrl === undefined) delete process.env.BACKEND_URL; else process.env.BACKEND_URL = oldUrl;
  }
});
