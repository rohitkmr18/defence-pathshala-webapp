// Optional operator-only READ export. Never used by CI, web routes or compilation.
import { writeFileSync } from "node:fs";
import { calendar, canonical } from "./core.mjs";
const [month, output] = process.argv.slice(2);
const bounds = calendar(month);
if (!output) throw new Error("Usage: node scripts/monthly/export-published.mjs YYYY-MM PRIVATE_OUTPUT.json");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Existing server-only read credentials required");
async function read(table, params) {
  const target = new URL("/rest/v1/" + table, url);
  Object.entries(params).forEach(([k, v]) => target.searchParams.set(k, v));
  const response = await fetch(target, { headers: { apikey: key, Authorization: "Bearer " + key }, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error("Published read failed: HTTP " + response.status);
  return response.json();
}
const editions = await read("current_affairs_posts", {
  select: "id,date,title,published,approved_editorial_source,approved_editorial_sha256,story_rows:current_affairs_stories(id,story_number,headline,subject,topic,subtopic,source_url,source_date,mcqs:current_affairs_mcqs(id,question_number))",
  published: "eq.true", and: "(date.gte." + bounds.start + ",date.lte." + bounds.end + ")", order: "date.asc", limit: "32",
});
if (editions.length > 31) throw new Error("Bounded source export exceeded month cardinality");
const ids = [...new Set(editions.flatMap(p => p.approved_editorial_source
  ? JSON.parse(p.approved_editorial_source).stories.flatMap(s => s.linkedPyqIds ?? []) : []))].sort();
if (ids.length > 500 || ids.some(id => !/^[A-Za-z0-9_-]{1,120}$/.test(id))) throw new Error("Invalid or unbounded PYQ identities");
const pyqs = ids.length ? await read("v_dp_question_intelligence_v2", {
  select: "question_id,exam,year,content_status,content_eligible", question_id: "in.(" + ids.join(",") + ")", limit: "501",
}) : [];
writeFileSync(output, canonical({ as_of: new Date().toISOString().slice(0, 10), editions, pyqs }) + "\n", { flag: "wx", mode: 0o600 });
console.log("Published source export saved privately. No writes to Supabase.");
