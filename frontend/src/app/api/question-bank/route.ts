import { NextRequest, NextResponse } from "next/server";
import { backendGET } from "@/lib/backend";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://afhwegrxnvgsqbqadvwr.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request: NextRequest) {
  // 1. Try FastAPI backend first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const response = await backendGET(
      `/analytics/question-bank${request.nextUrl.search}`
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, {
        status: response.status,
      });
    }
  } catch {
    // Backend unreachable — fallback to direct Supabase query
  }

  // 2. Direct Supabase query fallback (bulletproof)
  try {
    const key = serviceRoleKey || anonKey;
    if (!key) {
      return NextResponse.json(
        {
          summary: { questions: 0, subjects: 0, exam: null, year: null, cycle: null },
          subjects: [],
          difficulty: [],
          questionPatterns: [],
          questionTypes: [],
          topics: [],
        },
        { status: 200 }
      );
    }

    const supabase = createClient(supabaseUrl, key);
    const searchParams = request.nextUrl.searchParams;

    const examParam = searchParams.get("exam");
    const yearParam = searchParams.get("year");
    const cycleParam = searchParams.get("cycle");

    let query = supabase
      .from("questions")
      .select("exam,year,cycle,subject,topic,q_type,q_pattern,difficulty_category");

    if (examParam) {
      const rawExams = examParam.split(",").map((s) => s.trim()).filter(Boolean);
      const expanded: string[] = [];
      for (const e of rawExams) {
        expanded.push(e);
        if (e.includes(" ")) expanded.push(e.replace(/ /g, "-"));
        if (e.includes("-")) expanded.push(e.replace(/-/g, " "));
      }
      query = query.in("exam", Array.from(new Set(expanded)));
    }

    if (yearParam) {
      const years = yearParam
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n));
      if (years.length > 0) {
        query = query.in("year", years);
      }
    }

    if (cycleParam) {
      const cycles = cycleParam.split(",").map((s) => s.trim()).filter(Boolean);
      if (cycles.length > 0) {
        query = query.in("cycle", cycles);
      }
    }

    const { data: rows, error } = await query;

    if (error || !rows) {
      return NextResponse.json(
        {
          summary: { questions: 0, subjects: 0, exam: examParam, year: yearParam, cycle: cycleParam },
          subjects: [],
          difficulty: [],
          questionPatterns: [],
          questionTypes: [],
          topics: [],
        },
        { status: 200 }
      );
    }

    const total = rows.length;
    const subjectCounts: Record<string, number> = {};
    const difficultyCounts: Record<string, number> = {};
    const patternCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};
    const topicCounts: Record<string, number> = {};

    for (const row of rows) {
      if (row.subject) {
        subjectCounts[row.subject] = (subjectCounts[row.subject] || 0) + 1;
      }
      if (row.difficulty_category) {
        difficultyCounts[row.difficulty_category] =
          (difficultyCounts[row.difficulty_category] || 0) + 1;
      }
      if (row.q_pattern) {
        patternCounts[row.q_pattern] = (patternCounts[row.q_pattern] || 0) + 1;
      }
      if (row.q_type) {
        typeCounts[row.q_type] = (typeCounts[row.q_type] || 0) + 1;
      }
      if (row.topic) {
        topicCounts[row.topic] = (topicCounts[row.topic] || 0) + 1;
      }
    }

    const toSortedArray = (counts: Record<string, number>, limit?: number) => {
      const arr = Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
      return limit ? arr.slice(0, limit) : arr;
    };

    return NextResponse.json({
      summary: {
        questions: total,
        subjects: Object.keys(subjectCounts).length,
        exam: examParam,
        year: yearParam,
        cycle: cycleParam,
      },
      subjects: toSortedArray(subjectCounts),
      difficulty: Object.entries(difficultyCounts).map(([name, value]) => ({ name, value })),
      questionPatterns: toSortedArray(patternCounts),
      questionTypes: toSortedArray(typeCounts),
      topics: toSortedArray(topicCounts, 20),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to load question bank data" },
      { status: 500 }
    );
  }
}