import type { SubjectArchive } from "@/lib/seo-data";

type ArchiveCounts = Pick<SubjectArchive, "exam" | "subject" | "totalQuestions" | "years" | "topics">;

/**
 * One factual paragraph about a subject archive, computed only from the stored counts
 * (no estimates, trends or exam predictions). Returns null when there is too little data
 * to say anything useful, so thin pages do not get filler text.
 */
export function buildSubjectAnalysis(archive: ArchiveCounts, yearSpanText: string): string | null {
  const { exam, subject, totalQuestions, years, topics } = archive;
  if (totalQuestions <= 0 || years.length === 0) return null;

  const parts: string[] = [];

  const avg = totalQuestions / years.length;
  const avgText = Number.isInteger(avg) ? String(avg) : avg.toFixed(1);
  parts.push(
    `This archive holds ${totalQuestions} ${exam} ${subject} questions across ${years.length} ${years.length === 1 ? "year" : "years"} (${yearSpanText}), an average of ${avgText} per year.`,
  );

  const busiest = years.reduce((a, b) => (b.count > a.count ? b : a));
  if (years.length > 1) {
    parts.push(`${busiest.year} has the most, with ${busiest.count} questions.`);
  }

  const ranked = [...topics].sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
  if (ranked.length >= 2) {
    const top = ranked.slice(0, 3);
    const list = top.map((t) => `${t.topic} (${t.count})`).join(", ");
    const topTotal = top.reduce((sum, t) => sum + t.count, 0);
    const share = Math.round((topTotal / totalQuestions) * 100);
    parts.push(
      `The most-asked ${subject} topics in this dataset are ${list}, together about ${share}% of the questions.`,
    );
  }

  return parts.join(" ");
}
