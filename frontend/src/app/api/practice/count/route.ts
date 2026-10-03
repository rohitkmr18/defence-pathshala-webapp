import { NextRequest, NextResponse } from "next/server";
import { backendGET } from "@/lib/backend";
import { createClient } from "@supabase/supabase-js";
import { expandExamQuery } from "@/lib/exams";
import { parseFiltersFromSearchParams, parseListParam } from "@/lib/question-filters";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://afhwegrxnvgsqbqadvwr.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: NextRequest) {
  // 1. Try FastAPI backend first
  try {
    const response = await backendGET(
      `/practice/count${request.nextUrl.search}`
    );

    if (response.ok) {
      const data = await response.json();
      if (typeof data?.count === "number") {
        return NextResponse.json(data, { status: 200 });
      }
    }
  } catch {
    // Backend unreachable, fallback to direct Supabase query
  }

  // 2. Direct Supabase query fallback
  try {
    if (!serviceRoleKey) {
      return NextResponse.json({ error: "Practice data service unavailable" }, { status: 503 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const searchParams = request.nextUrl.searchParams;
    const filters = parseFiltersFromSearchParams(searchParams);
    const specificIds = parseListParam(searchParams.get("ids") || searchParams.get("id"));

    let query = supabase
      .from("v_dp_question_intelligence_v2")
      .select("id", { count: "exact", head: true });

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

    const { count, error } = await query;
    if (error) return NextResponse.json({ error: "Canonical practice count failed" }, { status: 503 });

    return NextResponse.json({ count: count || 0 }, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch count:", err);
    return NextResponse.json({ error: "Practice count failed" }, { status: 503 });
  }
}
