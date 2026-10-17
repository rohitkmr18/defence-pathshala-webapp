import type { CurrentAffairsStory, CurrentAffairsMcq } from "../current-affairs";

type ApprovedMcq = Omit<Partial<CurrentAffairsMcq>, "options"> & {
  question: string; options: Record<"A" | "B" | "C" | "D", string>;
  correctOption: "A" | "B" | "C" | "D"; subtopic?: string; concept?: string; questionType?: string;
};
type ApprovedStory = Omit<Partial<CurrentAffairsStory>, "mcqs"> & { mcqs: ApprovedMcq[] };
type Approved = { title?: string; summary?: string; editorialMarkdown?: string; stories: ApprovedStory[] };
const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

/** Read-only boundary: preserve every valid text string, isolate invalid optional metadata. */
export function readApprovedSource(source: string | null): { value: Approved | null; warning: boolean } {
  if (!source) return { value: null, warning: false };
  let warning = false;
  const text = (v: unknown) => {
    if (v == null) return undefined;
    if (typeof v === "string") return v;
    warning = true; return undefined;
  };
  const strings = (v: unknown) => {
    if (v == null) return undefined;
    if (!Array.isArray(v)) { warning = true; return undefined; }
    if (v.some(item => typeof item !== "string")) warning = true;
    return v.filter((item): item is string => typeof item === "string");
  };
  try {
    const raw: unknown = JSON.parse(source);
    if (!isObject(raw)) return { value: null, warning: true };
    if (!Array.isArray(raw.stories)) warning = true;
    const stories = (Array.isArray(raw.stories) ? raw.stories : []).map((s): ApprovedStory => {
      if (!isObject(s)) { warning = true; return { mcqs: [] }; }
      const story: ApprovedStory = { mcqs: [] };
      for (const key of ["headline", "summary", "whatHappened", "whyItMatters", "conceptualLinkage", "staticLink", "examRelevance", "subject", "topic", "subtopic", "theme", "editorialMarkdown", "futureAngle", "category", "sourceName", "sourceUrl", "sourceDate"] as const) {
        story[key] = text(s[key]);
      }
      for (const key of ["keyFacts", "examTags", "linkedPyqIds", "keywords"] as const) story[key] = strings(s[key]);
      if (typeof s.dpScore === "number" && Number.isFinite(s.dpScore)) story.dpScore = s.dpScore;
      if (s.mcqs != null && !Array.isArray(s.mcqs)) warning = true;
      // Preserve positions so malformed metadata never shifts canonical questions.
      story.mcqs = (Array.isArray(s.mcqs) ? s.mcqs : []).map((q): ApprovedMcq => {
        if (!isObject(q) || typeof q.question !== "string" || !isObject(q.options)
            || !["A", "B", "C", "D"].every(key => typeof q.options === "object" && q.options !== null && typeof (q.options as Record<string, unknown>)[key] === "string")
            || !["A", "B", "C", "D"].includes(String(q.correctOption))) {
          // A malformed question must fail honestly rather than display a different derived answer.
          throw new Error("Question content unavailable");
        }
        return { question: q.question, options: q.options as ApprovedMcq["options"], correctOption: q.correctOption as ApprovedMcq["correctOption"],
          explanation: text(q.explanation), examEdge: text(q.examEdge), difficulty: text(q.difficulty),
          sourceUrl: text(q.sourceUrl), subject: text(q.subject), topic: text(q.topic),
          subtopic: text(q.subtopic), concept: text(q.concept), questionType: text(q.questionType), examTags: strings(q.examTags) };
      });
      return story;
    });
    const value = { title: text(raw.title), summary: text(raw.summary), editorialMarkdown: text(raw.editorialMarkdown), stories };
    return { value, warning };
  } catch (error) {
    if (error instanceof SyntaxError) return { value: null, warning: true };
    throw new Error("This edition is temporarily unavailable");
  }
}
