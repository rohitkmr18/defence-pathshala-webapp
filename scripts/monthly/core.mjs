import { createHash, verify } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import createLoader from "../test-support/load-ts.cjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const { validateEditorialEdition } = createLoader()(path.join(root, "frontend/src/lib/current-affairs/editorial-validation.ts"));
export const GENERATOR_VERSION = "dp-monthly-2.0.0";
export const canonical = value => JSON.stringify(value, (_key, item) =>
  item && typeof item === "object" && !Array.isArray(item)
    ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);
export const sha256 = value => createHash("sha256").update(typeof value === "string" || Buffer.isBuffer(value) ? value : canonical(value)).digest("hex");
export const clone = value => JSON.parse(JSON.stringify(value));
export function calendar(month) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error("Invalid edition month");
  const start = month + "-01", next = new Date(start + "T00:00:00Z");
  next.setUTCMonth(next.getUTCMonth() + 1);
  const end = new Date(+next - 86400000).toISOString().slice(0, 10);
  return { start, end, days: Array.from({ length: Number(end.slice(-2)) }, (_, i) => month + "-" + String(i + 1).padStart(2, "0")) };
}
function isoDay(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value) || new Date(value).toISOString().slice(0, 10) !== value) throw new Error("Invalid coverage date");
  return value;
}
function approved(post) {
  if (!post.published) throw new Error("Unpublished source");
  if (!post.approved_editorial_source || !post.approved_editorial_sha256) throw new Error("Missing approved manuscript");
  if (sha256(post.approved_editorial_source) !== post.approved_editorial_sha256) throw new Error("Approved source hash mismatch");
  const document = JSON.parse(post.approved_editorial_source);
  if (document.date !== post.date) throw new Error("Source date mismatch");
  validateEditorialEdition({ ...document, approvedEditorial: { version: 1, source: post.approved_editorial_source, sha256: post.approved_editorial_sha256 } });
  return document;
}
function sourceStories(post) {
  const document = approved(post);
  const rows = [...post.story_rows].sort((a, b) => a.story_number - b.story_number);
  if (rows.length !== document.stories.length || rows.some((s,i) => s.story_number !== i+1)) throw new Error("Incomplete source story identity mapping");
  if (new Set(rows.map(s => s.id)).size !== rows.length) throw new Error("Duplicate source story identity");
  return rows.map(row => {
    const content = document.stories[row.story_number - 1];
    if (!content) throw new Error("Invalid story source ordinal");
    const mcqs = [...(row.mcqs ?? [])].sort((a, b) => a.question_number - b.question_number);
    if (mcqs.length !== content.mcqs.length || new Set(mcqs.map(q => q.id)).size !== mcqs.length) throw new Error("MCQ identity/provenance mismatch");
    return { source_id: row.id, source_edition_id: post.id, source_date: post.date,
      source_ordinal: row.story_number, approved_source_hash: post.approved_editorial_sha256,
      subject: content.subject, topic: content.topic, subtopic: content.subtopic ?? null,
      exam_tags: content.examTags, priority: content.dpScore,
      content: clone(content),
      mcqs: mcqs.map((q, i) => ({ source_id: q.id, source_number: q.question_number, content: clone(content.mcqs[i]) })),
    };
  });
}
export function duplicateCandidates(stories) {
  const candidates = [];
  const tokens = text => new Set(text.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, " ").split(/\s+/).filter(x => x.length > 3));
  for (let a = 0; a < stories.length; a++) for (let b = a + 1; b < stories.length; b++) {
    const one = stories[a], two = stories[b], x = tokens(one.content.headline), y = tokens(two.content.headline);
    const similarity = [...x].filter(t => y.has(t)).length / new Set([...x, ...y]).size;
    const identical = sha256(one.content) === sha256(two.content);
    const sameSource = one.content.sourceUrl === two.content.sourceUrl;
    if (!identical && !sameSource && similarity < 0.42) continue;
    const changedFacts = canonical(one.content.keyFacts) !== canonical(two.content.keyFacts);
    const kind = identical ? "identical-content" : changedFacts && one.source_date !== two.source_date
      ? "follow-up-candidate" : "same-development-review";
    const ids = [one.source_id, two.source_id].sort();
    candidates.push({ id: sha256(ids).slice(0, 20), story_ids: ids, kind,
      requires_editorial_decision: true, similarity: Number(similarity.toFixed(3)) });
  }
  return candidates.sort((a, b) => a.id.localeCompare(b.id));
}
export function audit(input, month) {
  const bounds = calendar(month), asOf = isoDay(input.as_of);
  const records = [], stories = [];
  for (const post of [...input.editions].filter(p => p.date.startsWith(month + "-")).sort((a, b) => a.date.localeCompare(b.date))) {
    let quality = post.published ? "MISSING_APPROVED_MANUSCRIPT" : "UNPUBLISHED", error = null, items = [];
    try { items = sourceStories(post); quality = post.date > asOf ? "FUTURE_PUBLICATION" : "APPROVED_SOURCE_AVAILABLE"; }
    catch (cause) { error = cause.message; if (post.approved_editorial_source) quality = "PROVENANCE_FAILURE"; }
    if (quality === "APPROVED_SOURCE_AVAILABLE") stories.push(...items);
    records.push({ edition_id: post.id, date: post.date, title: post.title, quality,
      source_hash: post.approved_editorial_sha256, approved_source_version: post.approved_editorial_source ? 1 : null,
      relational_story_count: post.story_rows.length, approved_story_count: items.length, error,
      stories: items.map(s => ({ id: s.source_id, ordinal: s.source_ordinal, headline: s.content.headline,
        subject: s.subject, topic: s.topic, subtopic: s.subtopic, exam_tags: s.exam_tags,
        source: { name: s.content.sourceName, url: s.content.sourceUrl, date: s.content.sourceDate },
        editorial_hash: sha256(s.content.editorialMarkdown), mcqs: s.mcqs.map(q => ({
          id: q.source_id, question_hash: sha256(q.content.question), options_hash: sha256(q.content.options),
          correct_option: q.content.correctOption, explanation_hash: sha256(q.content.explanation),
        })), linked_pyqs: s.content.linkedPyqIds.map(id => {
          const matches = input.pyqs.filter(q => q.question_id === id);
          return { id, eligible: matches.length === 1 && matches[0].content_eligible === true && matches[0].content_status !== "WITHHELD",
            content_status: matches.length === 1 ? matches[0].content_status : "MISSING_OR_AMBIGUOUS", checked_as_of: asOf };
        }) })),
    });
  }
  const publishedDates = new Set(records.filter(r => r.quality !== "UNPUBLISHED").map(r => r.date));
  return { schema_version: 1, edition_id: month, audited_as_of: asOf, coverage_window: bounds,
    month_closed: asOf > bounds.end, publication_dates: [...publishedDates].sort(),
    missing_publication_dates: bounds.days.filter(d => d <= asOf && !publishedDates.has(d)),
    future_dates_not_yet_due: bounds.days.filter(d => d > asOf),
    legacy_without_manuscript: records.filter(r => r.quality === "MISSING_APPROVED_MANUSCRIPT").map(r => r.edition_id),
    records, decision_queue: duplicateCandidates(stories), canonical_pyq_checks: clone(input.pyqs),
    release_blockers: ["Founder editorial approval required", ...(asOf <= bounds.end ? ["Coverage window is still open"] : []),
      ...records.filter(r => r.quality !== "APPROVED_SOURCE_AVAILABLE").map(r => r.date + ": " + r.quality)],
  };
}
const coreOf = snapshot => Object.fromEntries(Object.entries(snapshot).filter(([key]) =>
  !["content_hash", "status", "approval_metadata", "release_metadata", "generated_artifacts"].includes(key)));
export function verifySnapshot(snapshot) {
  calendar(snapshot.edition_id);
  isoDay(snapshot.coverage_start); isoDay(snapshot.coverage_end);
  if (!["SAMPLE", "MONTHLY"].includes(snapshot.kind)) throw new Error("Invalid snapshot kind");
  if (snapshot.schema_version !== 1 || snapshot.content_hash !== sha256(coreOf(snapshot))) throw new Error("Snapshot content digest mismatch");
  if (!["DRAFT", "VALIDATED", "APPROVED", "RELEASED"].includes(snapshot.status)) throw new Error("Invalid snapshot state");
  if (!Number.isSafeInteger(snapshot.edition_version) || snapshot.edition_version < 1) throw new Error("Invalid edition version");
  return snapshot;
}
export function compile(input, manifest) {
  const report = audit(input, manifest.edition_id), bounds = calendar(manifest.edition_id);
  if (!Number.isSafeInteger(manifest.edition_version) || manifest.edition_version < 1) throw new Error("Invalid edition version");
  if (!["SAMPLE", "MONTHLY"].includes(manifest.kind)) throw new Error("Invalid compilation kind");
  isoDay(manifest.coverage_start); isoDay(manifest.coverage_end);
  if (manifest.coverage_start < bounds.start || manifest.coverage_end > bounds.end || manifest.coverage_end > input.as_of || manifest.coverage_start > manifest.coverage_end) throw new Error("Invalid or future coverage");
  if (!manifest.sources.length || !manifest.taxonomy.length || new Set(manifest.taxonomy).size !== manifest.taxonomy.length) throw new Error("Explicit source set and taxonomy required");
  if (new Set(manifest.sources.map(s => s.edition_id)).size !== manifest.sources.length) throw new Error("Duplicate source edition");
  let all = [];
  for (const source of manifest.sources) {
    const posts = input.editions.filter(p => p.id === source.edition_id);
    if (posts.length !== 1) throw new Error("Missing or ambiguous daily edition");
    const post = posts[0];
    if (post.date < manifest.coverage_start || post.date > manifest.coverage_end || source.approved_source_version !== 1
      || source.source_hash !== post.approved_editorial_sha256) throw new Error("Source version/hash/coverage mismatch");
    all.push(...sourceStories(post));
  }
  if (new Set(all.flatMap(s => s.mcqs.map(q => q.source_id))).size !== all.flatMap(s => s.mcqs).length) throw new Error("MCQ identity reused across stories");
  if (new Set(all.map(s => s.source_id)).size !== all.length) throw new Error("Story identity reused across editions");
  const inclusion = new Set(manifest.include_story_ids);
  if (inclusion.size !== manifest.include_story_ids.length || !inclusion.size || [...inclusion].some(id => !all.some(s => s.source_id === id))) throw new Error("Invalid explicit inclusion manifest");
  const excluded = all.filter(s => !inclusion.has(s.source_id)).map(s => {
    const reason = manifest.exclusions?.[s.source_id];
    if (typeof reason !== "string" || !reason.trim()) throw new Error("Unexplained story exclusion");
    return { source_id: s.source_id, reason };
  });
  const stories = all.filter(s => inclusion.has(s.source_id));
  for (const s of stories) {
    if (!manifest.taxonomy.includes(s.subject)) throw new Error("Unknown subject taxonomy");
    if (!s.exam_tags.some(tag => manifest.exams.includes(tag))) throw new Error("Story outside explicit exam inclusion rules");
    s.linked_pyqs = s.content.linkedPyqIds.map(id => {
      const matches = input.pyqs.filter(q => q.question_id === id);
      if (matches.length !== 1 || matches[0].content_eligible !== true || matches[0].content_status === "WITHHELD") throw new Error("Invalid linked PYQ: " + id);
      return { id, eligible: true, content_status: matches[0].content_status, checked_as_of: input.as_of };
    });
  }
  const candidates = duplicateCandidates(stories);
  const decisions = manifest.editorial_decisions ?? [];
  const unresolved = candidates.filter(c => !decisions.some(d => d.candidate_id === c.id
    && ["retain-separate", "retain-follow-up"].includes(d.action) && d.reason?.trim() && d.reviewed_by?.trim()));
  const order = manifest.ordering;
  if (!order || order.rule !== "subject-date-source-ordinal" || canonical(order.subjects) !== canonical(manifest.taxonomy)) throw new Error("Explicit approved ordering rule required");
  stories.sort((a, b) => order.subjects.indexOf(a.subject) - order.subjects.indexOf(b.subject)
    || a.source_date.localeCompare(b.source_date) || a.source_edition_id.localeCompare(b.source_edition_id) || a.source_ordinal - b.source_ordinal);
  const snapshot = { schema_version: 1, generator_version: GENERATOR_VERSION, edition_id: manifest.edition_id,
    edition_version: manifest.edition_version, kind: manifest.kind, status: "DRAFT", title: manifest.title,
    coverage_start: manifest.coverage_start, coverage_end: manifest.coverage_end, source_as_of: input.as_of,
    coverage_complete: manifest.coverage_start === bounds.start && manifest.coverage_end === bounds.end
      && report.missing_publication_dates.length === 0 && report.records.every(r => r.quality === "APPROVED_SOURCE_AVAILABLE" && manifest.sources.some(s => s.edition_id === r.edition_id)),
    source_edition_ids: manifest.sources.map(s => s.edition_id).sort(),
    source_hashes: [...manifest.sources].sort((a, b) => a.edition_id.localeCompare(b.edition_id)),
    taxonomy: clone(manifest.taxonomy), exam_inclusion: clone(manifest.exams), ordering: clone(order),
    stories, mcq_ids: stories.flatMap(s => s.mcqs.map(q => q.source_id)),
    editorial_decision_manifest: clone(manifest), decision_queue: unresolved,
    coverage_manifest: { included: stories.map(s => s.source_id), excluded,
      missing_publication_dates: report.missing_publication_dates, legacy_without_manuscript: report.legacy_without_manuscript },
    correction_lineage: manifest.correction_lineage ?? null, approval_metadata: null, release_metadata: null, generated_artifacts: [],
  };
  snapshot.content_hash = sha256(coreOf(snapshot));
  return snapshot;
}
function verifyReview(snapshot, review, trust) {
  if (!review?.approved_at || !Number.isFinite(Date.parse(review.approved_at))) throw new Error("Valid approval timestamp required");
  const key = trust.approvers?.[review?.actor];
  const payload = { edition_id: snapshot.edition_id, edition_version: snapshot.edition_version,
    content_hash: snapshot.content_hash, actor: review?.actor, decision: review?.decision, approved_at: review?.approved_at };
  if (!key || review.decision !== "APPROVE" || !verify(null, Buffer.from(canonical(payload)), key, Buffer.from(review.signature ?? "", "base64"))) throw new Error("Trusted signed founder approval required");
  return clone(review);
}
export function transition(snapshot, target, { review, trust = {}, now = new Date().toISOString(), artifacts = [] } = {}) {
  verifySnapshot(snapshot);
  if (!Number.isFinite(Date.parse(now))) throw new Error("Valid transition timestamp required");
  const copy = clone(snapshot), states = ["DRAFT", "VALIDATED", "APPROVED", "RELEASED"];
  if (states.indexOf(target) !== states.indexOf(copy.status) + 1) throw new Error("Invalid state transition");
  if (target === "VALIDATED" && copy.decision_queue.length) throw new Error("Unresolved editorial decision queue");
  if (target === "APPROVED") {
    if (copy.kind === "MONTHLY" && (now.slice(0, 10) <= calendar(copy.edition_id).end || !copy.coverage_complete)) throw new Error("Complete monthly coverage window must close before approval");
    copy.approval_metadata = verifyReview(copy, review, trust);
  }
  if (target === "RELEASED") {
    verifyReview(copy, copy.approval_metadata, trust);
    if (copy.kind === "MONTHLY" && (now.slice(0,10) <= calendar(copy.edition_id).end || !copy.coverage_complete)) throw new Error("Incomplete monthly release");
    if (!artifacts.length || artifacts.some(a => a.content_hash !== copy.content_hash || a.qa_status !== "PASSED" || !/^[a-f0-9]{64}$/.test(a.sha256))) throw new Error("Validated artifact references required");
    copy.generated_artifacts = clone(artifacts);
    copy.release_metadata = { released_at: now, approved_content_hash: copy.content_hash };
  }
  copy.status = target;
  return copy;
}
export function correction(previous, input, manifest) {
  verifySnapshot(previous);
  if (!["APPROVED", "RELEASED"].includes(previous.status) || manifest.edition_id !== previous.edition_id
    || manifest.edition_version !== previous.edition_version + 1 || !manifest.correction_lineage?.reason
    || manifest.correction_lineage.previous_content_hash !== previous.content_hash) throw new Error("Versioned correction with explicit lineage required");
  return compile(input, manifest);
}
export function writeImmutable(directory, snapshot) {
  verifySnapshot(snapshot);
  const file = path.join(directory, snapshot.edition_id, "v" + snapshot.edition_version, snapshot.status + ".json");
  mkdirSync(path.dirname(file), { recursive: true });
  for (const sibling of readdirSync(path.dirname(file)).filter(name => name.endsWith(".json"))) {
    const existing = JSON.parse(readFileSync(path.join(path.dirname(file),sibling),"utf8"));
    if (existing.content_hash !== snapshot.content_hash) throw new Error("Snapshot version already binds different content; create a new version");
  }
  const bytes = canonical(snapshot) + "\n";
  if (existsSync(file)) { if (readFileSync(file, "utf8") !== bytes) throw new Error("Immutable snapshot cannot be overwritten"); }
  else writeFileSync(file, bytes, { flag: "wx" });
  return file;
}
export function projection(snapshot) {
  verifySnapshot(snapshot);
  return { edition_id: snapshot.edition_id, edition_version: snapshot.edition_version, content_hash: snapshot.content_hash,
    stories: snapshot.stories.map(s => ({ id: s.source_id, editorial: s.content.editorialMarkdown,
      mcqs: s.mcqs.map(q => ({ id: q.source_id, question: q.content.question, options: q.content.options,
        correct_option: q.content.correctOption, explanation: q.content.explanation, exam_edge: q.content.examEdge })),
      linked_pyqs: s.linked_pyqs.map(q => q.id), source_url: s.content.sourceUrl, source_date: s.content.sourceDate })),
  };
}
