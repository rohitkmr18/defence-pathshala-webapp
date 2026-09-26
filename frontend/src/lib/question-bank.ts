import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const BACKEND_URL =
  process.env.BACKEND_URL || "http://127.0.0.1:8000";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://afhwegrxnvgsqbqadvwr.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

export async function getQuestionBankMeta(): Promise<QuestionBankMeta> {
  // 1. Try backend if available and authenticated
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const response = await fetch(
        `${BACKEND_URL}/analytics/question-bank/meta`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          cache: "no-store",
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = (await response.json()) as QuestionBankMeta;
        if (data?.exams && data.exams.length > 0) {
          return data;
        }
      }
    }
  } catch {
    // Backend offline / unauthenticated — fall through to direct Supabase query
  }

  // 2. Direct Supabase query fallback (works for both guests and authenticated users)
  try {
    const key = serviceRoleKey || anonKey;
    if (!key) {
      return { exams: [] };
    }

    const supabase = createSupabaseClient(supabaseUrl, key);
    const { data: rows, error } = await supabase
      .from("questions")
      .select("exam,year,cycle");

    if (error || !rows) {
      return { exams: [] };
    }

    const examsMap: Record<
      string,
      {
        value: string;
        label: string;
        years: Set<number>;
        cycles: Set<string>;
      }
    > = {};

    for (const row of rows) {
      const exam = row.exam ? String(row.exam).trim() : null;
      if (!exam) continue;

      if (!examsMap[exam]) {
        examsMap[exam] = {
          value: exam,
          label: exam.replace("-AC", " AC").replace("-", " "),
          years: new Set<number>(),
          cycles: new Set<string>(),
        };
      }

      if (row.year) {
        const y = Number(row.year);
        if (!isNaN(y)) examsMap[exam].years.add(y);
      }

      if (row.cycle) {
        const c = String(row.cycle).trim();
        if (c) examsMap[exam].cycles.add(c);
      }
    }

    const result: ExamMeta[] = Object.keys(examsMap)
      .sort()
      .map((examKey) => ({
        value: examsMap[examKey].value,
        label: examsMap[examKey].label,
        years: Array.from(examsMap[examKey].years).sort((a, b) => b - a),
        cycles: Array.from(examsMap[examKey].cycles).sort(),
      }));

    return { exams: result };
  } catch {
    return { exams: [] };
  }
}