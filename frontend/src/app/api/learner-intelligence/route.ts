import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  deriveLearnerIntelligence,
  type LearnerAttempt,
  type LearnerQuestionMeta,
  type LearnerSession,
} from "@/lib/learner-intelligence";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://afhwegrxnvgsqbqadvwr.supabase.co";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PAGE_SIZE = 1000;

async function getAuthenticatedUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const client = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component / read-only cookie context.
        }
      },
    },
  });

  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error && error.name !== "AuthSessionMissingError") throw error;
  return user?.id || null;
}

async function paged<T>(
  fetchPage: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>
): Promise<T[]> {
  const all: T[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await fetchPage(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    const rows = data || [];
    all.push(...rows);
    if (rows.length < PAGE_SIZE) return all;
    if (all.length > 20000) throw new Error("Learner history exceeds the safe read window");
  }
}

let corpusCache:
  | { expiresAt: number; rows: LearnerQuestionMeta[] }
  | undefined;

async function getCorpus(supabase: SupabaseClient): Promise<LearnerQuestionMeta[]> {
  if (corpusCache && corpusCache.expiresAt > Date.now()) return corpusCache.rows;

  const rows = await paged<LearnerQuestionMeta>((from, to) =>
    supabase
      .from("v_dp_question_intelligence_v2")
      .select(
        "id,question_id,exam,question,final_opt,subject,topic,taxonomy_subject,taxonomy_topic,taxonomy_concept,production_eligible,intelligence_eligible,student_release_status"
      )
      .eq("production_eligible", true)
      .range(from, to)
  );

  corpusCache = { rows, expiresAt: Date.now() + 5 * 60 * 1000 };
  return rows;
}

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "Learner intelligence unavailable" },
        { status: 503 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const [attempts, sessions, corpus, preferenceResult] = await Promise.all([
      paged<LearnerAttempt>((from, to) =>
        supabase
          .from("user_attempts")
          .select(
            "id,question_id,selected_option,is_correct,time_taken,attempted_at,session_id,mode"
          )
          .eq("user_id", userId)
          .order("attempted_at", { ascending: false })
          .range(from, to)
      ),
      paged<LearnerSession>((from, to) =>
        supabase
          .from("practice_sessions")
          .select(
            "id,title,mode,filters,question_ids,current_index,is_completed,total_questions,correct_count,incorrect_count,time_spent_seconds,started_at,updated_at,completed_at"
          )
          .eq("user_id", userId)
          .order("updated_at", { ascending: false })
          .range(from, to)
      ),
      getCorpus(supabase),
      supabase
        .from("user_exam_preferences")
        .select("exam")
        .eq("user_id", userId),
    ]);

    if (preferenceResult.error) throw new Error(preferenceResult.error.message);

    const targetExams = (preferenceResult.data || []).map((row) => row.exam);
    const intelligence = deriveLearnerIntelligence({
      attempts,
      sessions,
      corpus,
      targetExams,
    });

    return NextResponse.json(intelligence, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Learner intelligence GET error:", error);
    return NextResponse.json(
      { error: "Learner intelligence unavailable" },
      { status: 500 }
    );
  }
}
