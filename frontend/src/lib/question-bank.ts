import { backendGET } from "@/lib/backend";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getExamLabel, getExamDbValue } from "@/lib/exams";

export { getExamLabel, getExamDbValue };

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://afhwegrxnvgsqbqadvwr.supabase.co";
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
  // 1. Try FastAPI backend first (handles both authenticated & guest requests)
  try {
    const response = await backendGET("/analytics/question-bank/meta");
    if (response.ok) {
      const data = (await response.json()) as QuestionBankMeta;
      if (data?.exams && data.exams.length > 0) {
        return data;
      }
    } else {
      console.warn(
        `[QuestionBank] Backend /analytics/question-bank/meta returned HTTP ${response.status}`
      );
    }
  } catch (backendErr: any) {
    if (backendErr?.digest === "DYNAMIC_SERVER_USAGE") {
      throw backendErr;
    }
    console.warn(
      "[QuestionBank] Backend unreachable or failed, falling back to direct server-side Supabase query:",
      backendErr instanceof Error ? backendErr.message : backendErr
    );
  }

  // 2. Direct Supabase query fallback (server-side privileged read)
  try {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const key = serviceRoleKey || anonKey;
    if (!key) {
      console.error(
        "[QuestionBank] Neither SUPABASE_SERVICE_ROLE_KEY nor NEXT_PUBLIC_SUPABASE_ANON_KEY is configured"
      );
      return { exams: [] };
    }

    const supabase = createSupabaseClient(supabaseUrl, key);
    const query = supabase
      .from("v_dp_question_intelligence_v2")
      .select("exam,year,cycle");

    const pageSize = 1000;
    const rows: any[] = [];
    let start = 0;
    while (true) {
      const { data: pageData, error: pageErr } = await query.range(
        start,
        start + pageSize - 1
      );
      if (pageErr) {
        console.error("[QuestionBank] Supabase question bank meta page query error:", pageErr);
        break;
      }
      if (!pageData || pageData.length === 0) break;
      rows.push(...pageData);
      if (pageData.length < pageSize) break;
      start += pageSize;
    }

    if (rows.length === 0) {
      console.warn("[QuestionBank] Supabase query returned 0 rows for question bank metadata");
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
          label: getExamLabel(exam),
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
  } catch (fallbackErr) {
    console.error(
      "[QuestionBank] Direct Supabase fallback failed:",
      fallbackErr instanceof Error ? fallbackErr.message : fallbackErr
    );
    return { exams: [] };
  }
}