import { NextRequest, NextResponse } from "next/server";
import { backendGET } from "@/lib/backend";
import { createClient } from "@supabase/supabase-js";
import { expandExamQuery } from "@/lib/exams";
import { normalizeQuestion } from "@/lib/question-intelligence";
import { parseFiltersFromSearchParams, parseListParam } from "@/lib/question-filters";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://afhwegrxnvgsqbqadvwr.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: NextRequest) {
  // 1. Try FastAPI backend first
  try {
    const response = await backendGET(
      `/practice/questions${request.nextUrl.search}`
    );

    if (response.ok) {
      const data = await response.json();
      if (data?.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        const normalized = data.questions.map(normalizeQuestion);
        return NextResponse.json({ questions: normalized, total: normalized.length }, { status: 200 });
      }
    }
  } catch {
    // Backend unreachable, fallback to direct Supabase query
  }

  // 2. Direct Supabase query fallback (bulletproof)
  try {
    if (!serviceRoleKey) {
      return NextResponse.json({ questions: [], total: 0 }, { status: 200 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const searchParams = request.nextUrl.searchParams;
    const filters = parseFiltersFromSearchParams(searchParams);
    const specificIds = parseListParam(searchParams.get("ids") || searchParams.get("id"));
    const limit = filters.limit || 150;

    // Use canonical intelligence view v2
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

    let { data, error } = await query;

    // Fallback to questions table if view is not accessible
    if (error) {
      let fallbackQuery = supabase
        .from("questions")
        .select("*")
        .eq("is_active", true);

      if (specificIds.length > 0) {
        fallbackQuery = fallbackQuery.in("id", specificIds);
      } else {
        if (filters.exams.length > 0) {
          const expandedExams = Array.from(
            new Set(filters.exams.flatMap((ex) => expandExamQuery(ex)))
          );
          if (expandedExams.length > 0) {
            fallbackQuery = fallbackQuery.in("exam", expandedExams);
          }
        }
        if (filters.years.length > 0) {
          fallbackQuery = fallbackQuery.in("year", filters.years);
        }
        if (filters.cycles.length > 0) {
          if (filters.cycles.includes("I")) {
            fallbackQuery = fallbackQuery.or(`cycle.in.(${filters.cycles.join(",")}),cycle.is.null`);
          } else {
            fallbackQuery = fallbackQuery.in("cycle", filters.cycles);
          }
        }
        if (filters.subjects.length > 0) {
          fallbackQuery = fallbackQuery.in("subject", filters.subjects);
        }
        if (filters.topics.length > 0) {
          fallbackQuery = fallbackQuery.in("topic", filters.topics);
        }
        if (filters.subtopics.length > 0) {
          fallbackQuery = fallbackQuery.in("subtopic", filters.subtopics);
        }
        if (filters.difficulties.length > 0) {
          fallbackQuery = fallbackQuery.in("difficulty_category", filters.difficulties);
        }
      }

      fallbackQuery = fallbackQuery.order("q_num", { ascending: true }).limit(limit);
      const res = await fallbackQuery;
      data = res.data;
      error = res.error;
    }

    if (error) {
      console.error("Supabase questions query error:", error);
      return NextResponse.json({ questions: [], total: 0 }, { status: 200 });
    }

    const rawRows = data || [];
    const normalizedQuestions = rawRows.map(normalizeQuestion);

    return NextResponse.json(
      { questions: normalizedQuestions, total: normalizedQuestions.length },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to fetch questions:", err);
    return NextResponse.json({ questions: [], total: 0 }, { status: 200 });
  }
}
