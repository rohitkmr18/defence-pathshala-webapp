/** Saved question-response time, not wall-clock examination duration.
 * Missing historical timing stays unavailable; an explicitly saved zero stays zero.
 */
export function trackedQuestionSeconds(values: Array<number | null | undefined>): number | null {
  const known = values.filter((v): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0);
  return known.length ? known.reduce((sum, v) => sum + Math.round(v), 0) : null;
}

export function formatQuestionTime(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return "Question time unavailable";
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `Question time: ${minutes ? `${minutes} min${rest ? ` ${rest} sec` : ""}` : `${rest} sec`}`;
}
