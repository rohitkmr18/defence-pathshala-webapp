/** Derive post-submission insights from server-authorized review data only. */
export type AfcatSection = "ENGLISH" | "GENERAL_AWARENESS" | "NUMERICAL_ABILITY" | "REASONING_MILITARY_APTITUDE";
export const AFCAT_SECTIONS: readonly { key: AfcatSection; label: string; expected: number }[] = [
  { key: "ENGLISH", label: "English", expected: 30 },
  { key: "GENERAL_AWARENESS", label: "General Awareness", expected: 25 },
  { key: "NUMERICAL_ABILITY", label: "Numerical Ability", expected: 20 },
  { key: "REASONING_MILITARY_APTITUDE", label: "Reasoning & Military Aptitude", expected: 25 },
] as const;

export type AfcatReviewItem = {
  questionId: string;
  position: number;
  section: AfcatSection;
  selected: "A" | "B" | "C" | "D" | null;
  correct: "A" | "B" | "C" | "D";
  explanation: unknown;
};
export type AfcatSectionSummary = {
  section: AfcatSection;
  label: string;
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  attempted: number;
  marks: number;
  maximumMarks: number;
  accuracyPercent: number;
};
export function summarizeAfcatSections(review: readonly AfcatReviewItem[]): AfcatSectionSummary[] {
  return AFCAT_SECTIONS.map(section => {
    const rows = review.filter(item => item.section === section.key);
    let correct = 0, incorrect = 0, unanswered = 0;
    for (const item of rows) {
      if (item.selected === null) unanswered++;
      else if (item.selected === item.correct) correct++;
      else incorrect++;
    }
    const attempted = correct + incorrect;
    return {
      section: section.key, label: section.label, total: rows.length,
      correct, incorrect, unanswered, attempted,
      marks: correct * 3 - incorrect, maximumMarks: rows.length * 3,
      accuracyPercent: attempted ? Math.round(correct / attempted * 10000) / 100 : 0,
    };
  });
}
