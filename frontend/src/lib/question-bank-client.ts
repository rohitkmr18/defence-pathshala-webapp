export interface QuestionBankPayload {
  summary: {
    questions: number;
    subjects: number;
    exam: string | null;
    year: string | null;
    cycle: string | null;
  };
  subjects: { name: string; value: number }[];
  difficulty: { name: string; value: number }[];
  questionPatterns: { name: string; value: number }[];
  questionTypes: { name: string; value: number }[];
  topics: { name: string; value: number }[];
}

export async function getQuestionBank(params?: {
  exams?: string[];
  years?: number[];
  cycles?: string[];
}): Promise<QuestionBankPayload> {
  const search = new URLSearchParams();

  if (params?.exams?.length) search.set("exam", params.exams.join(","));
  if (params?.years?.length) search.set("year", params.years.join(","));
  if (params?.cycles?.length) search.set("cycle", params.cycles.join(","));

  const res = await fetch(
    `/api/question-bank${search.toString() ? `?${search}` : ""}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    let detail = "Failed to load question bank";

    try {
      const error = (await res.json()) as { detail?: string; error?: string };
      detail = error.detail ?? error.error ?? detail;
    } catch {
      // Keep the status when the upstream response is not JSON.
    }

    throw new Error(`${detail} (HTTP ${res.status})`);
  }

  return res.json();
}