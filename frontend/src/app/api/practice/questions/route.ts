import { NextRequest, NextResponse } from "next/server";
import { backendGET } from "@/lib/backend";
import { createClient } from "@supabase/supabase-js";
import { expandExamQuery } from "@/lib/exams";
import { normalizeQuestion } from "@/lib/question-intelligence";
import { parseFiltersFromSearchParams, parseListParam } from "@/lib/question-filters";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://afhwegrxnvgsqbqadvwr.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: NextRequest) {
  const specificIds = parseListParam(request.nextUrl.searchParams.get("ids") || request.nextUrl.searchParams.get("id"));
  // 1. Try FastAPI backend first
  // FastAPI does not implement ID selection; never send resume/review requests there.
  if (specificIds.length === 0) try {
    const response = await backendGET(
      `/practice/questions${request.nextUrl.search}`
    );

    if (response.ok) {
      const data = await response.json();
      if (data?.questions && Array.isArray(data.questions)) {
        const normalized = data.questions.map(normalizeQuestion);
        return NextResponse.json({ questions: normalized, total: normalized.length }, { status: 200 });
      }
    }
  } catch {
    // Backend unreachable, fallback to direct Supabase query
  }

  // 2. Direct Supabase query fallback (using canonical v2 read model)
  try {
    if (!serviceRoleKey) {
      return NextResponse.json({ error: "Service role key missing" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const searchParams = request.nextUrl.searchParams;
    const filters = parseFiltersFromSearchParams(searchParams);
    const limit = specificIds.length || filters.limit || 150;

    let query = supabase
      .from("v_dp_question_intelligence_v2")
      .select("*");

    if (specificIds.length > 0) {
      query = query.in("id", specificIds);
    } else {
      if (filters.exams.length > 0) {
        const expandedExams = Array.from(
          new Set(filters.exams.flatMap((ex) => expandExamQuery(ex)))
        );
        if (expandedExams.length > 0) {
          query = query.in("exam", expandedExams);
        }
      }

      if (filters.years.length > 0) {
        query = query.in("year", filters.years);
      }

      if (filters.cycles.length > 0) {
        if (filters.cycles.includes("I")) {
          query = query.or(`cycle.in.(${filters.cycles.join(",")}),cycle.is.null`);
        } else {
          query = query.in("cycle", filters.cycles);
        }
      }

      if (filters.subjects.length > 0) {
        query = query.in("subject", filters.subjects);
      }

      if (filters.topics.length > 0) {
        query = query.in("topic", filters.topics);
      }

      if (filters.subtopics.length > 0) {
        query = query.in("subtopic", filters.subtopics);
      }

      if (filters.difficulties.length > 0) {
        query = query.in("difficulty_category", filters.difficulties);
      }

      if (filters.intelligenceOnly) {
        query = query.eq("intelligence_eligible", true);
      }
    }

    query = query.order("q_num", { ascending: true }).limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error("Canonical v2 read-model query error:", error);
      return NextResponse.json({ error: "Failed to query canonical intelligence read-model" }, { status: 500 });
    }

    const rawRows = data || [];
    const normalizedQuestions = rawRows.map(normalizeQuestion);

    return NextResponse.json(
      { questions: normalizedQuestions, total: normalizedQuestions.length },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Failed to fetch questions:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal Server Error" }, { status: 500 });
  }
}
