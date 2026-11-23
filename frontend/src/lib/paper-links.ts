// Hook-free helpers so plain components and tests can use them without React or Next.
import { parseSeparatePaperTab, type PaperTabId } from "./exam-registry";

export type PaperLinkChoice = PaperTabId;

/** Pages whose content is scoped by the paper tab (GS / Maths / English, or NDA Maths / GAT). */
export function isPaperAwarePath(pathname: string): boolean {
  return pathname === "/dashboard" || pathname === "/dashboard/practice" || pathname === "/dashboard/question-bank";
}

/** Add (any non-GS tab) or drop (GS) the paper param on a paper-aware link. Other links are untouched. */
export function withPaper(href: string, paper: PaperLinkChoice | null | undefined): string {
  const [pathAndQuery, hash = ""] = href.split("#");
  const [path, query = ""] = pathAndQuery.split("?");
  if (!isPaperAwarePath(path)) return href;
  const params = new URLSearchParams(query);
  const separate = parseSeparatePaperTab(paper);
  if (separate) params.set("paper", separate);
  else params.delete("paper");
  const qs = params.toString();
  return `${path}${qs ? `?${qs}` : ""}${hash ? `#${hash}` : ""}`;
}
