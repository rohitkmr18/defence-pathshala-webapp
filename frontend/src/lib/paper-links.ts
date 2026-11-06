// Hook-free helpers so plain components and tests can use them without React or Next.
export type PaperLinkChoice = "gs" | "maths" | "english";

/** Pages whose content is scoped by the GS / Maths / English tab. */
export function isPaperAwarePath(pathname: string): boolean {
  return pathname === "/dashboard" || pathname === "/dashboard/practice" || pathname === "/dashboard/question-bank";
}

/** Add (Maths/English) or drop (GS) the paper param on a paper-aware link. Other links are untouched. */
export function withPaper(href: string, paper: PaperLinkChoice | null | undefined): string {
  const [pathAndQuery, hash = ""] = href.split("#");
  const [path, query = ""] = pathAndQuery.split("?");
  if (!isPaperAwarePath(path)) return href;
  const params = new URLSearchParams(query);
  if (paper === "maths" || paper === "english") params.set("paper", paper);
  else params.delete("paper");
  const qs = params.toString();
  return `${path}${qs ? `?${qs}` : ""}${hash ? `#${hash}` : ""}`;
}

