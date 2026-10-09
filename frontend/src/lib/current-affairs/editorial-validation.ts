import { validateApprovedSource, PYQ_ID } from "./approved-source";
type ObjectValue = Record<string, unknown>;
const object = (v: unknown): v is ObjectValue => !!v && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const strings = (v: unknown): v is string[] => Array.isArray(v) && v.every(text);
function knownFields(value: ObjectValue, allowed: string[]) {
  if (Object.keys(value).some(key => !allowed.includes(key))) throw new Error("Unsupported editorial field; move approved copy into editorialMarkdown");
}
const date = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)
  && !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;

export function officialSourceUrl(v: unknown) {
  if (!text(v)) return false;
  try {
    const u = new URL(v);
    const h = u.hostname.toLowerCase();
    const official = h.endsWith(".gov.in") || h.endsWith(".nic.in")
      || ["rbi.org.in", "nobelprize.org", "kva.se", "un.org", "who.int", "imf.org", "worldbank.org"].some(d => h === d || h.endsWith(`.${d}`));
    return u.protocol === "https:" && !u.username && !u.password && (!u.port || u.port === "443") && official;
  } catch { return false; }
}

// Structural checks do not claim that a source has been editorially verified.
// ChatGPT must verify claims and URLs before submitting an approved envelope.
export function validateEditorialEdition(payload: unknown): asserts payload is ObjectValue {
  if (!object(payload) || !date(payload.date) || !text(payload.title) || !text(payload.summary)
      || !Array.isArray(payload.stories) || payload.stories.length < 1 || payload.stories.length > 8) {
    throw new Error("Invalid editorial edition");
  }
  validateApprovedSource(payload);
  knownFields(payload, ["date", "title", "summary", "stories", "editorialMarkdown", "approvedEditorial"]);
  if (payload.editorialMarkdown !== undefined && !text(payload.editorialMarkdown)) throw new Error("Invalid edition Markdown");
  let count = 0;
  for (const s of payload.stories) {
    if (!object(s) || !text(s.headline) || !text(s.whatHappened) || !text(s.whyItMatters)
        || !strings(s.keyFacts) || s.keyFacts.length < 1 || !text(s.subject) || !text(s.topic)
        || !strings(s.examTags) || s.examTags.length < 1 || !text(s.sourceName)
        || !officialSourceUrl(s.sourceUrl) || !date(s.sourceDate) || s.sourceDate > payload.date
        || !Number.isInteger(s.dpScore) || Number(s.dpScore) < 0 || Number(s.dpScore) > 100
        || !Array.isArray(s.mcqs)) throw new Error("Invalid story metadata or source URL");
    if (!text(s.editorialMarkdown) || !strings(s.linkedPyqIds)
        || s.linkedPyqIds.some(id => !PYQ_ID.test(id))
        || new Set(s.linkedPyqIds).size !== s.linkedPyqIds.length) {
      throw new Error("Complete story Markdown and exact linked PYQ IDs required");
    }
    knownFields(s, ["headline", "summary", "category", "subject", "topic", "subtopic", "theme", "examRelevance", "futureAngle", "keywords", "whatHappened", "whyItMatters", "keyFacts", "conceptualLinkage", "staticLink", "examTags", "sourceName", "sourceUrl", "sourceDate", "dpScore", "mcqs", "linkedPyqIds", "editorialMarkdown"]);
    for (const key of ["summary", "category", "subtopic", "theme", "examRelevance", "futureAngle", "conceptualLinkage", "staticLink"]) {
      if (s[key] !== undefined && s[key] !== null && !text(s[key])) throw new Error(`Invalid story ${key}`);
    }
    if (s.keywords !== undefined && !strings(s.keywords)) throw new Error("Invalid story keywords");
    for (const q of s.mcqs) {
      count++;
      if (!object(q) || !text(q.question) || !text(q.explanation) || !text(q.examEdge)
          || q.contentStatus !== "VERIFIED" || !officialSourceUrl(q.sourceUrl)
          || !["Easy", "Moderate", "Hard"].includes(String(q.difficulty))
          || !["A", "B", "C", "D"].includes(String(q.correctOption)) || !object(q.options)
          || Object.keys(q.options).sort().join("") !== "ABCD"
          || !Object.values(q.options).every(text)
          || new Set(Object.values(q.options).map(v => String(v).trim().toLowerCase())).size !== 4) {
        throw new Error("Unverified or invalid MCQ/options/source URL");
      }
      knownFields(q, ["question", "options", "correctOption", "explanation", "difficulty", "subject", "topic", "subtopic", "concept", "examTags", "questionType", "examEdge", "mockEligible", "contentStatus", "sourceUrl"]);
      if (q.examTags !== undefined && !strings(q.examTags)) throw new Error("Invalid MCQ exam tags");
      if (q.mockEligible !== undefined && typeof q.mockEligible !== "boolean") throw new Error("Invalid mock eligibility");
      for (const key of ["subject", "topic", "subtopic", "concept", "questionType"]) {
        if (q[key] !== undefined && q[key] !== null && !text(q[key])) throw new Error(`Invalid MCQ ${key}`);
      }
    }
  }
  if (count < 3 || count > 5) throw new Error("Edition must have 3 to 5 verified MCQs");
}
