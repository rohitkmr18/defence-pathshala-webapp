import type { AfcatDisplayQuestion } from "@/lib/afcat/visual-types";
const KEYS = ["A", "B", "C", "D"] as const;

/** Untrusted stored JSON is projected into an allowlisted learner payload. */
export function sanitizeAfcatQuestion(
  id: string, number: number, stem: unknown, options: unknown,
): AfcatDisplayQuestion {
  if (!stem || typeof stem !== "object" || Array.isArray(stem)) throw new Error("Invalid stem");
  const text = (stem as Record<string, unknown>).text;
  if (typeof text !== "string" || !text.trim()) throw new Error("Invalid stem text");
  if (!Array.isArray(options) || options.length !== 4) throw new Error("Invalid option count");
  const sanitized = KEYS.map((key, index) => {
    const raw = options[index] as unknown;
    const rawText = typeof raw === "string" ? raw :
      raw && typeof raw === "object" && !Array.isArray(raw) ?
      (raw as Record<string, unknown>).text : undefined;
    if (typeof rawText !== "string" || !rawText.trim()) throw new Error("Invalid option");
    return { key, content: { text: rawText } };
  }) as AfcatDisplayQuestion["options"];
  // Diagram references must be materialized separately from trusted reviewed
  // afcat_question_assets through a signed URL service, never raw JSON markup.
  return { id, number, stem: { text }, options: sanitized };
}
