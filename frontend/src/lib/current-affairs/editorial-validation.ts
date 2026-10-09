type ObjectValue = Record<string, unknown>;
const object = (v: unknown): v is ObjectValue => !!v && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const strings = (v: unknown): v is string[] => Array.isArray(v) && v.every(text);
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
  let count = 0;
  for (const s of payload.stories) {
    if (!object(s) || !text(s.headline) || !text(s.whatHappened) || !text(s.whyItMatters)
        || !strings(s.keyFacts) || s.keyFacts.length < 1 || !text(s.subject) || !text(s.topic)
        || !strings(s.examTags) || s.examTags.length < 1 || !text(s.sourceName)
        || !officialSourceUrl(s.sourceUrl) || !date(s.sourceDate) || s.sourceDate > payload.date
        || !Number.isInteger(s.dpScore) || Number(s.dpScore) < 0 || Number(s.dpScore) > 100
        || !Array.isArray(s.mcqs)) throw new Error("Invalid story metadata or source URL");
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
    }
  }
  if (count < 3 || count > 5) throw new Error("Edition must have 3 to 5 verified MCQs");
}
