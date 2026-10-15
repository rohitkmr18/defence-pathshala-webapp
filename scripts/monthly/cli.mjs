import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { audit, compile, transition, canonical, writeImmutable } from "./core.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const json = file => JSON.parse(readFileSync(file, "utf8"));
export function sampleInput() {
  const post = json(path.join(root, "scripts/test-support/monthly-public-fixture.json"));
  return { as_of: "2026-10-15", editions: [{ id: post.id, date: post.date, title: post.title, published: true,
    approved_editorial_source: post.approved_editorial_source, approved_editorial_sha256: post.approved_editorial_sha256,
    story_rows: json(path.join(root, "scripts/monthly/fixtures/source-identities-2026-10-14.json")) }],
    pyqs: json(path.join(root, "scripts/monthly/fixtures/sample-pyq-validation.json")) };
}
export function sampleManifest(input = sampleInput()) {
  const post = input.editions[0], id = "bcadb490-b39a-4f11-befd-fa8e15bf480b";
  return { edition_id: "2026-10", edition_version: 1, kind: "SAMPLE",
    title: "October 2026 · Free BIMSTEC sample", coverage_start: "2026-10-14", coverage_end: "2026-10-14",
    sources: [{ edition_id: post.id, approved_source_version: 1, source_hash: post.approved_editorial_sha256 }],
    taxonomy: ["International Relations"], exams: ["CDS", "CAPF-AC", "NDA", "AFCAT"],
    include_story_ids: [id], exclusions: Object.fromEntries(post.story_rows.filter(s => s.id !== id)
      .map(s => [s.id, "Outside the explicit Phase 1 free-sample allowlist"])),
    ordering: { rule: "subject-date-source-ordinal", subjects: ["International Relations"] }, editorial_decisions: [] };
}
function save(file, value) { mkdirSync(path.dirname(file), { recursive: true }); writeFileSync(file, canonical(value) + "\n"); }
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [command, ...args] = process.argv.slice(2);
  const get = (name, fallback) => { const i = args.indexOf("--" + name); return i < 0 ? fallback : args[i + 1]; };
  try {
    if (command === "sample") {
      const input = sampleInput(), snapshot = transition(compile(input, sampleManifest(input)), "VALIDATED");
      const file = writeImmutable(get("out", path.join(root, ".monthly-build/snapshots")), snapshot);
      console.log(file);
    } else if (command === "audit") {
      const input = json(get("input")), report = audit(input, get("month"));
      save(get("out"), report); console.log("Source audit written; no editorial approval or release performed.");
    } else if (command === "compile") {
      const snapshot = compile(json(get("input")), json(get("manifest")));
      console.log(writeImmutable(get("out", path.join(root, ".monthly-build/snapshots")), snapshot));
    } else if (command === "validate") {
      const snapshot = transition(json(get("input")), "VALIDATED");
      console.log(writeImmutable(get("out", path.join(root, ".monthly-build/snapshots")), snapshot));
    } else throw new Error("Commands: sample [--out DIR]; audit --input FILE --month YYYY-MM --out FILE; compile --input FILE --manifest FILE [--out DIR]; validate --input FILE [--out DIR]");
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
