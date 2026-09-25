import { createClient } from "@/lib/supabase/server";

const BACKEND_URL =
  process.env.BACKEND_URL || "http://127.0.0.1:8000";

export interface ExamMeta {
  value: string;
  label: string;
  years: number[];
  cycles: string[];
}

export interface QuestionBankMeta {
  exams: ExamMeta[];
}

export interface QuestionBankPayload {
  summary: {
    questions: number;
    subjects: number;
    exam: string | null;
    year: number | null;
    cycle: string | null;
  };
  subjects: { name: string; value: number }[];
  difficulty: { name: string; value: number }[];
  topics: { name: string; value: number }[];
}

async function backendFetch(path: string) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`);
  }

  return response.json();
}

export async function getQuestionBankMeta(): Promise<QuestionBankMeta> {
  return backendFetch("/analytics/question-bank/meta");
}