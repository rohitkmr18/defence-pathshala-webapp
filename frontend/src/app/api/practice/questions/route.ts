import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createUserClient } from "@/lib/supabase/server";
import { EXACT_PYQ_ID, questionBeforeAttempt } from "@/lib/exact-pyq";
import { expandExamQuery } from "@/lib/exams";
import { normalizeQuestion } from "@/lib/question-intelligence";
import { parseFiltersFromSearchParams, parseListParam } from "@/lib/question-filters";

import { isContentEligible, isCompletePaper, CONTENT_UNAVAILABLE_MESSAGE, PAPER_UNAVAILABLE_MESSAGE } from "@/lib/content-quality";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://afhwegrxnvgsqbqadvwr.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: NextRequest) {
  const externalId = request.nextUrl.searchParams.get("question_id");
  const specificIds = parseListParam(request.nextUrl.searchParams.get("ids") || request.nextUrl.searchParams.get("id"));
  const fullPaper = request.nextUrl.searchParams.get("mode") === "full_paper";
  // Read canonical content directly so an older backend cannot bypass holds or omit versions.
  try {
    if (!serviceRoleKey) {
      return NextResponse.json({ error: "Service role key missing" }, { status: 500 });
    }

    if (externalId !== null) {
      if (!EXACT_PYQ_ID.test(externalId)) return NextResponse.json({ error: "Invalid PYQ ID" }, { status: 400 });
      const userClient = await createUserClient();
      const { data: { user }, error } = await userClient.auth.getUser();
      if (error || !user) return NextResponse.json({ error: "Sign in to attempt this PYQ" }, { status: 401 });
    }
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const searchParams = request.nextUrl.searchParams;
    const filters = parseFiltersFromSearchParams(searchParams);
    const limit = specificIds.length || filters.limit || 150;

    let query = supabase
      .from("v_dp_question_intelligence_v2")
      .select("*")
      .eq("content_eligible", true);

    if (externalId !== null) {
      query = query.eq("question_id", externalId);
    } else if (specificIds.length > 0) {
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
    const eligibleRows = rawRows.filter(isContentEligible);
    if (externalId !== null && (eligibleRows.length !== 1 || eligibleRows[0].question_id !== externalId)) {
      return NextResponse.json({ error: CONTENT_UNAVAILABLE_MESSAGE, code: "CONTENT_WITHHELD" }, { status: 409, headers: { "Cache-Control": "no-store" } });
    }
    if (specificIds.length > 0 && eligibleRows.length !== new Set(specificIds).size) {
      return NextResponse.json({ error: CONTENT_UNAVAILABLE_MESSAGE, code: "CONTENT_WITHHELD" }, { status: 409 });
    }
    if (fullPaper) {
      if (!isCompletePaper(eligibleRows)) {
        return NextResponse.json({ error: PAPER_UNAVAILABLE_MESSAGE, code: "PAPER_CONTENT_INCOMPLETE" }, { status: 409 });
      }
    }
    const normalizedQuestions = eligibleRows.map(normalizeQuestion);

    return NextResponse.json(
      { questions: externalId !== null ? normalizedQuestions.map(questionBeforeAttempt) : normalizedQuestions, total: normalizedQuestions.length },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: unknown) {
    console.error("Failed to fetch questions:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal Server Error" }, { status: 500 });
  }
}
