/** Build auth intent from the chosen paper, never from the practice listing URL. */
export function fullPaperDestination(paper: { exam: string; year: number; cycle?: string; paperTab?: string }): string {
  const params = new URLSearchParams({ exam: paper.exam, year: String(paper.year) });
  if (paper.cycle) params.set("cycle", paper.cycle);
  if (paper.paperTab) params.set("paper", paper.paperTab);
  return `/dashboard/practice/full-paper?${params}`;
}
