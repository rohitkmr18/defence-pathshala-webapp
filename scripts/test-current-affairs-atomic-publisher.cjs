const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const sql = fs.readFileSync("supabase/migrations/20261008050000_atomic_current_affairs_publish.sql", "utf8");
const route = fs.readFileSync("frontend/src/app/api/current-affairs/ingest/route.ts", "utf8");

test("publication is one atomic RPC, never a destructive REST sequence", () => {
  assert.match(route, /service\.rpc\(/);
  assert.match(route, /publish_current_affairs_edition_atomic/);
  assert.doesNotMatch(route, /\.delete\(|\.upsert\(/);
});
test("publisher is insert-only and publishes only after child assertions", () => {
  assert.doesNotMatch(sql, /delete\s+from\s+public\.current_affairs_/i);
  assert.doesNotMatch(sql, /on\s+conflict\s+do\s+update/i);
  assert.match(sql, /published\)\s*values[\s\S]*?false\)/i);
  assert.ok(sql.lastIndexOf("update public.current_affairs_posts set published=true") > sql.indexOf("Publication count mismatch"));
});
test("publisher enforces verified source-backed MCQs and service role", () => {
  assert.match(sql, /current_user <> 'service_role'/);
  assert.match(sql, /status is distinct from 'VERIFIED'/);
  assert.match(sql, /q->>'sourceUrl'/);
  assert.match(sql, /revoke all on function/);
  assert.match(sql, /grant execute on function[\s\S]*to service_role/);
});
test("publisher prevents duplicate dates and preserves all existing editions", () => {
  assert.match(sql, /insert into public\.current_affairs_posts/);
  assert.match(sql, /insert into public\.current_affairs_stories/);
  assert.match(sql, /insert into public\.current_affairs_mcqs/);
  assert.doesNotMatch(sql, /upsert|on conflict/i);
});
