import { NextRequest, NextResponse } from "next/server";
import { backendGET } from "@/lib/backend";
import { createClient } from "@supabase/supabase-js";
import { expandExamQuery } from "@/lib/exams";

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
      const expanded = expandExamQuery(examParam);
      if (expanded.length > 0) {
        query = query.in("exam", expanded);
      }
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
        if (cycles.includes("I")) {
          query = query.or(`cycle.in.(${cycles.join(",")}),cycle.is.null`);
        } else {
          query = query.in("cycle", cycles);
        }
      }
    }

    // Paginate to fetch all matching rows (handling PostgREST 1000-row limit)
    const pageSize = 1000;
    const rows: any[] = [];
    let start = 0;
    while (true) {
      const { data: pageData, error: pageErr } = await query.range(
        start,
        start + pageSize - 1
      );
      if (pageErr) {
        console.error("Supabase question bank page query error:", pageErr);
        break;
      }
      if (!pageData || pageData.length === 0) break;
      rows.push(...pageData);
      if (pageData.length < pageSize) break;
      start += pageSize;
    }

    if (rows.length === 0) {
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

    interface SubjectAnalyticsEntry {
      questions: number;
      difficulty: Record<string, number>;
      patterns: Record<string, number>;
      types: Record<string, number>;
      topics: Record<string, number>;
    }
    const subjectAnalyticsMap: Record<string, SubjectAnalyticsEntry> = {};

    for (const row of rows) {
      if (row.subject) {
        subjectCounts[row.subject] = (subjectCounts[row.subject] || 0) + 1;
        if (!subjectAnalyticsMap[row.subject]) {
          subjectAnalyticsMap[row.subject] = {
            questions: 0,
            difficulty: {},
            patterns: {},
            types: {},
            topics: {},
          };
        }
        const sEntry = subjectAnalyticsMap[row.subject];
        sEntry.questions += 1;
        if (row.difficulty_category) {
          sEntry.difficulty[row.difficulty_category] =
            (sEntry.difficulty[row.difficulty_category] || 0) + 1;
        }
        if (row.q_pattern) {
          sEntry.patterns[row.q_pattern] =
            (sEntry.patterns[row.q_pattern] || 0) + 1;
        }
        if (row.q_type) {
          sEntry.types[row.q_type] =
            (sEntry.types[row.q_type] || 0) + 1;
        }
        if (row.topic) {
          sEntry.topics[row.topic] =
            (sEntry.topics[row.topic] || 0) + 1;
        }
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

    const subjectAnalytics: Record<
      string,
      {
        totalQuestions: number;
        difficulty: { name: string; value: number }[];
        questionPatterns: { name: string; value: number }[];
        questionTypes: { name: string; value: number }[];
        topics: { name: string; value: number }[];
      }
    > = {};

    const subjectTopics: Record<string, { name: string; value: number }[]> = {};

    for (const [sub, sData] of Object.entries(subjectAnalyticsMap)) {
      const sTopics = toSortedArray(sData.topics);
      subjectTopics[sub] = sTopics;
      subjectAnalytics[sub] = {
        totalQuestions: sData.questions,
        difficulty: Object.entries(sData.difficulty).map(([name, value]) => ({ name, value })),
        questionPatterns: toSortedArray(sData.patterns),
        questionTypes: toSortedArray(sData.types),
        topics: sTopics,
      };
    }

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
      subjectTopics,
      subjectAnalytics,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to load question bank data" },
      { status: 500 }
    );
  }
}