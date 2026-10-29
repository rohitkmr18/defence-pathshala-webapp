/** Resource catalogue foundation. Static, approved examples only; move to database behind access checks before enabling campaigns. */
export type ResourceVisibility = "public" | "unlisted" | "token_gated";
export type ResourceType = "quiz" | "ebook" | "flashcards";
export type ResourceSummary = {
  slug: string;
  title: string;
  description: string;
  type: ResourceType;
  visibility: ResourceVisibility;
  exams: string[];
  status: "draft" | "published";
};
export const resources: readonly ResourceSummary[] = [
  {
    slug: "cyclone-geography",
    title: "Cyclone Geography — 5 MCQs",
    description: "Exam-oriented practice on tropical cyclone formation and storm surge.",
    type: "quiz",
    visibility: "unlisted",
    exams: ["NDA", "CDS", "CAPF-AC"],
    status: "published",
  },
];
/** Public listings must NEVER contain unlisted or token-gated records. */
export function publicResources(): ResourceSummary[] {
  return resources.filter((r) => r.status === "published" && r.visibility === "public");
}
