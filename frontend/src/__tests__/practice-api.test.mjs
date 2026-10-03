import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Execute the real route handlers with only the external Auth/DB boundary replaced.
// No credentials, live database, OAuth requests or network calls are used.
const responseApi = {
  json: (data, init) => Response.json(data, init),
  redirect: (url) => Response.redirect(url, 307),
};
function loadRoute(path, dependencies, env = {}) {
  const file = new URL(path, import.meta.url);
  const source = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  const errors = [];
  const context = {
    exports, process: { env: {
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "offline-test-only",
      SUPABASE_SERVICE_ROLE_KEY: "offline-test-only", ...env,
    } },
    console: { error: (...args) => errors.push(args), warn: () => {} },
    Date, Math, Number, String, Set, URL, URLSearchParams, AbortSignal,
    fetch: dependencies.fetch || (() => { throw new Error("Unexpected offline network call"); }),
    require: (name) => {
      if (name === "next/server") return { NextResponse: responseApi };
      if (name === "@/lib/auth-navigation") return { safeAuthNext: value => value && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\") ? value : "/dashboard" };
      if (name === "@/lib/error-message") return {
        errorMessage: (err, fallback) => err?.message || fallback,
      };
      if (name in dependencies) return dependencies[name];
      throw new Error(`Unexpected dependency: ${name}`);
    },
  };
  vm.runInNewContext(source, context, { filename: file.pathname });
  return exports;
}
function request(body, path = "/api/practice/session") {
  const req = new Request(`https://preview.example${path}`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
  });
  req.nextUrl = new URL(req.url);
  return req;
}
function dbBoundary({ user = "learner-a", failure = null, answer = "B" } = {}) {
  const tables = {
    practice_sessions: [
      { id: "session-a", user_id: "learner-a", is_completed: false, answers: {} },
      { id: "session-b", user_id: "learner-b", is_completed: false, answers: {} },
    ],
    user_attempts: [],
    v_dp_question_intelligence_v2: [{ id: "question-1", final_opt: answer, official_opt: "A" }],
  };
  const calls = [];
  function from(table) {
    assert.ok(table in tables, `Unexpected table: ${table}`);
    const filters = [];
    let action = "select", payload, limit;
    const query = {
      select: () => query, order: () => query,
      eq: (column, value) => { filters.push([column, value]); return query; },
      limit: (value) => { limit = value; return query; },
      insert: (value) => { action = "insert"; payload = value; return query; },
      update: (value) => { action = "update"; payload = value; return query; },
      single: () => execute(true), maybeSingle: () => execute(true),
      then: (resolve, reject) => execute(false).then(resolve, reject),
    };
    async function execute(single) {
      calls.push({ table, action, payload, filters });
      if (failure) return { data: null, error: { message: failure } };
      let matches = tables[table].filter((row) => filters.every(([k, v]) => row[k] === v));
      if (action === "insert") {
        const row = { id: `${table}-${tables[table].length + 1}`, ...payload };
        tables[table].push(row); matches = [row];
      }
      if (action === "update") matches.forEach((row) => Object.assign(row, payload));
      if (limit) matches = matches.slice(0, limit);
      return { data: single ? matches[0] ?? null : matches,
        error: single && !matches.length ? { message: "No row" } : null };
    }
    return query;
  }
  const deps = {
    "@supabase/supabase-js": { createClient: () => ({ from }) },
    "@supabase/ssr": { createServerClient: () => ({ auth: {
      getUser: async () => ({ data: { user: user ? { id: user } : null } }),
    } }) },
    "next/headers": { cookies: async () => ({ getAll: () => [], set: () => {} }) },
  };
  return { tables, calls, deps };
}

test("authenticated learning loop: create, server-score, persist, complete, read dashboard", async () => {
  const db = dbBoundary();
  const session = loadRoute("../app/api/practice/session/route.ts", db.deps);
  const attempt = loadRoute("../app/api/practice/attempt/route.ts", db.deps);
  const created = await session.POST(request({ title: "CDS Polity", question_ids: ["question-1"] }));
  assert.equal(created.status, 200);
  const { session: row } = await created.json();
  assert.equal(row.user_id, "learner-a");
  const scored = await attempt.POST(request({ question_id: "question-1", selected_option: "B",
    is_correct: false, session_id: row.id, mode: "instant", time_taken: 9 }, "/api/practice/attempt"));
  assert.equal(scored.status, 200);
  const result = await scored.json();
  assert.equal(result.persisted, true);
  assert.equal(result.attempt.is_correct, true, "client correctness and conflicting official option cannot override final_opt");
  assert.equal(result.attempt.session_id, row.id);
  const complete = await session.PATCH(request({ session_id: row.id, is_completed: true,
    answers: { "question-1": "B" }, correct_count: 1 }));
  assert.equal(complete.status, 200);
  assert.ok((await complete.json()).session.completed_at);
  const summary = await (await session.GET(request({}))).json();
  assert.equal(summary.totalAttempts, 1);
  assert.equal(summary.accuracy, 100);
  assert.ok(summary.recentSessions.every((s) => s.user_id === "learner-a"));
});

test("another learner cannot link an attempt or modify a session", async () => {
  const db = dbBoundary();
  const attempt = loadRoute("../app/api/practice/attempt/route.ts", db.deps);
  const response = await attempt.POST(request({ question_id: "question-1", selected_option: "B",
    is_correct: true, session_id: "session-b" }));
  assert.equal(response.status, 404);
  assert.equal(db.tables.user_attempts.length, 0);
  const session = loadRoute("../app/api/practice/session/route.ts", db.deps);
  const patch = await session.PATCH(request({ session_id: "session-b", is_completed: true }));
  assert.equal(patch.status, 503);
  assert.equal(db.tables.practice_sessions[1].is_completed, false);
});

test("missing migration is an error, never retried without session lineage", async () => {
  const db = dbBoundary();
  const original = db.deps["@supabase/supabase-js"].createClient;
  db.deps["@supabase/supabase-js"].createClient = () => {
    const client = original();
    return { from: (table) => {
      if (table !== "user_attempts") return client.from(table);
      return { insert: () => { db.calls.push({ table, action: "insert" }); return {
        select: () => ({ single: async () => ({ data: null, error: { message: "session_id column missing" } }) }),
      }; } };
    } };
  };
  const attempt = loadRoute("../app/api/practice/attempt/route.ts", db.deps);
  const res = await attempt.POST(request({ question_id: "question-1", selected_option: "B",
    is_correct: true, session_id: "session-a" }));
  assert.equal(res.status, 500);
  assert.equal(db.calls.filter((c) => c.table === "user_attempts").length, 1);
});

test("guest practice creates no cloud rows", async () => {
  const db = dbBoundary({ user: null });
  const route = loadRoute("../app/api/practice/session/route.ts", db.deps);
  const body = await (await route.POST(request({ question_ids: ["question-1"] }))).json();
  assert.equal(body.guest, true);
  assert.equal(db.calls.length, 0);
});

test("session write failure is visible instead of fabricated success", async () => {
  const db = dbBoundary({ failure: "database unavailable" });
  const route = loadRoute("../app/api/practice/session/route.ts", db.deps);
  const res = await route.POST(request({ question_ids: ["question-1"] }));
  assert.equal(res.status, 503);
  assert.equal((await res.json()).success, false);
});

test("unreleased questions, invalid options and unavailable canonical answers fail closed", async () => {
  const db = dbBoundary();
  const route = loadRoute("../app/api/practice/attempt/route.ts", db.deps);
  for (const body of [
    { question_id: "unreleased", selected_option: "B", is_correct: true },
    { question_id: "question-1", selected_option: "X", is_correct: true },
  ]) assert.equal((await route.POST(request(body))).status, 400);
  const missing = dbBoundary({ answer: null });
  const missingRoute = loadRoute("../app/api/practice/attempt/route.ts", missing.deps);
  assert.equal((await missingRoute.POST(request({ question_id: "question-1",
    selected_option: "A", is_correct: true }))).status, 409);
});

test("missing service configuration cannot claim attempt persistence", async () => {
  const db = dbBoundary();
  const route = loadRoute("../app/api/practice/attempt/route.ts", db.deps, { SUPABASE_SERVICE_ROLE_KEY: undefined });
  assert.equal((await route.POST(request({ question_id: "question-1", selected_option: "B", is_correct: true }))).status, 503);
  assert.equal(db.calls.length, 0);
});

test("auth callback handles missing code, failed exchange and successful exchange", async () => {
  for (const [query, failure, destination] of [
    ["", false, "/auth/login?error=missing_auth_code"],
    ["?code=test-code", true, "/auth/login?error=auth_callback_failed"],
    ["?code=test-code", false, "/dashboard"],
  ]) {
    let exchanges = 0;
    const route = loadRoute("../app/auth/callback/route.ts", { "@/lib/supabase/server": {
      createClient: async () => ({ auth: { exchangeCodeForSession: async () => {
        exchanges++; return { error: failure ? { message: "expired" } : null };
      } } }),
    } });
    const res = await route.GET(new Request(`https://preview.example/auth/callback${query}`));
    assert.equal(res.headers.get("location"), `https://preview.example${destination}`);
    assert.equal(exchanges, query ? 1 : 0);
  }
});

test("canonical count failure cannot fall back to master eligibility", async () => {
  const db = dbBoundary({ failure: "view unavailable" });
  const route = loadRoute("../app/api/practice/count/route.ts", {
    ...db.deps,
    "@/lib/backend": { backendGET: async () => { throw new Error("optional backend absent"); } },
    "@/lib/exams": { expandExamQuery: (value) => [value] },
    "@/lib/question-filters": {
      parseFiltersFromSearchParams: () => ({ exams: [], years: [], cycles: [], subjects: [],
        topics: [], subtopics: [], difficulties: [], intelligenceOnly: false }),
      parseListParam: () => [],
    },
  });
  const res = await route.GET(request({}, "/api/practice/count"));
  assert.equal(res.status, 503);
  assert.deepEqual(db.calls.map((c) => c.table), ["v_dp_question_intelligence_v2"]);
});


test('admin proxies forward the authenticated administrator bearer and never shared keys', async () => {
  const calls = [];
  const deps = {
    '@/lib/admin': { checkIsAdmin: async () => ({ isAdmin: true }) },
    '@/lib/supabase/server': { createClient: async () => ({ auth: { getSession: async () => ({ data: { session: { access_token: 'offline-admin-session' } } }) } }) },
    '@/lib/backend-config': { requireBackendUrl: () => 'https://offline-backend.invalid' },
    fetch: async (url, options) => { calls.push({ url, options }); return { ok: true, json: async () => ({ success: true }) }; },
  };
  const stats = loadRoute('../app/api/admin/sync-stats/route.ts', deps, { ADMIN_API_KEY: 'offline-legacy-key' });
  const sync = loadRoute('../app/api/admin/sync-dataset/route.ts', deps, { ADMIN_API_KEY: 'offline-legacy-key' });
  assert.equal((await stats.GET(new Request('https://preview.example/api/admin/sync-stats'))).status, 200);
  assert.equal((await sync.POST(new Request('https://preview.example/api/admin/sync-dataset?dry_run=true'))).status, 200);
  for (const call of calls) {
    assert.equal(call.options.headers.Authorization, 'Bearer offline-admin-session');
    assert.equal(call.options.headers['X-Admin-Key'], undefined);
  }
  assert.ok(calls[1].url.includes('dry_run=true'));
});

test('admin proxies deny learners and expired sessions before contacting the backend', async () => {
  let isAdmin = false;
  const deps = {
    '@/lib/admin': { checkIsAdmin: async () => ({ isAdmin }) },
    '@/lib/supabase/server': { createClient: async () => ({ auth: { getSession: async () => ({ data: { session: null } }) } }) },
    '@/lib/backend-config': { requireBackendUrl: () => { throw new Error('Backend must not be contacted'); } },
  };
  const routes = [['sync-stats', 'GET'], ['sync-dataset', 'POST']].map(([name, method]) => [loadRoute('../app/api/admin/'+name+'/route.ts', deps), method]);
  for (const [route, method] of routes) assert.equal((await route[method](new Request('https://preview.example/api/admin/test'))).status, 403);
  isAdmin = true;
  for (const [route, method] of routes) assert.equal((await route[method](new Request('https://preview.example/api/admin/test'))).status, 401);
});
