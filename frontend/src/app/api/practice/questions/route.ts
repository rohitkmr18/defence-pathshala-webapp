import { NextRequest, NextResponse } from "next/server";
import { backendGET } from "@/lib/backend";
import { createClient } from "@supabase/supabase-js";
import { expandExamQuery } from "@/lib/exams";
import { normalizeQuestion } from "@/lib/question-intelligence";

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

    const exam = searchParams.get("exam");
    const year = searchParams.get("year");
    const cycle = searchParams.get("cycle");
    const subject = searchParams.get("subject");
    const topic = searchParams.get("topic");
    const subtopic = searchParams.get("subtopic");
    const difficulty = searchParams.get("difficulty");
    const intelligenceOnly = searchParams.get("intelligence_only") === "true";
    const limit = parseInt(searchParams.get("limit") || "150", 10);

    let query = supabase
      .from("questions")
      .select("*")
      .eq("is_active", true);

    if (exam) {
      const expanded = expandExamQuery(exam);
      if (expanded.length > 0) {
        query = query.in("exam", expanded);
      }
    }

    if (year) {
      const years = year
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n));
      if (years.length > 0) {
        query = query.in("year", years);
      }
    }

    if (cycle) {
      const cycles = cycle.split(",").map((s) => s.trim()).filter(Boolean);
      if (cycles.length > 0) {
        if (cycles.includes("I")) {
          query = query.or(`cycle.in.(${cycles.join(",")}),cycle.is.null`);
        } else {
          query = query.in("cycle", cycles);
        }
      }
    }

    if (subject) {
      const subjects = subject.split(",").map((s) => s.trim()).filter(Boolean);
      if (subjects.length > 0) {
        query = query.in("subject", subjects);
      }
    }

    if (topic) {
      const topics = topic.split(",").map((s) => s.trim()).filter(Boolean);
      if (topics.length > 0) {
        query = query.in("topic", topics);
      }
    }

    if (subtopic) {
      const subtopics = subtopic.split(",").map((s) => s.trim()).filter(Boolean);
      if (subtopics.length > 0) {
        query = query.in("subtopic", subtopics);
      }
    }

    if (difficulty) {
      const difficulties = difficulty.split(",").map((s) => s.trim()).filter(Boolean);
      if (difficulties.length > 0) {
        query = query.in("difficulty_category", difficulties);
      }
    }

    if (intelligenceOnly) {
      query = query.eq("verified_status", "Verified");
    }

    query = query.order("q_num", { ascending: true }).limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error("Supabase direct query error:", error);
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
