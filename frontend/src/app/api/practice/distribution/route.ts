import { NextRequest, NextResponse } from "next/server";
import { backendGET } from "@/lib/backend";
import { createClient } from "@supabase/supabase-js";
import { expandExamQuery, getExamLabel } from "@/lib/exams";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://afhwegrxnvgsqbqadvwr.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: NextRequest) {
  // 1. Try FastAPI backend first
  try {
    const response = await backendGET(
      `/practice/distribution${request.nextUrl.search}`
    );

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data?.distribution)) {
        return NextResponse.json(data, { status: 200 });
      }
    }
  } catch {
    // Backend unreachable, fallback to direct Supabase query
  }

  // 2. Direct Supabase query fallback
  try {
    if (!serviceRoleKey) {
      return NextResponse.json(
        { distribution: [], group_by: "year" },
        { status: 200 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const searchParams = request.nextUrl.searchParams;

    const groupBy = (searchParams.get("group_by") ||
      searchParams.get("groupBy") ||
      "year") as "cycle" | "year" | "exam";
    const exam = searchParams.get("exam");
    const year = searchParams.get("year");
    const cycle = searchParams.get("cycle");
    const subject = searchParams.get("subject");
    const topic = searchParams.get("topic");

    let query = supabase
      .from("questions")
      .select("id, question_id, exam, year, cycle");

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

    if (subject) {
      const subjects = subject
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (subjects.length > 0) {
        query = query.in("subject", subjects);
      }
    }

    if (topic) {
      const topics = topic
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (topics.length > 0) {
        query = query.in("topic", topics);
      }
    }

    // Paginate to fetch all matching rows (handling PostgREST 1000-row limit)
    const pageSize = 1000;
    const allRawRows: any[] = [];
    let start = 0;
    while (true) {
      const { data: pageData, error: pageErr } = await query.range(
        start,
        start + pageSize - 1
      );
      if (pageErr) {
        console.error("Supabase distribution page query error:", pageErr);
        break;
      }
      const batch = pageData || [];
      allRawRows.push(...batch);
      if (batch.length < pageSize) {
        break;
      }
      start += pageSize;
    }

    // Deduplicate rows by question_id / id to prevent double counting
    const seenQuestionIds = new Set<string>();
    const dedupedRows: any[] = [];
    for (const r of allRawRows) {
      const qid = String(r.question_id || r.id || "");
      if (qid) {
        if (seenQuestionIds.has(qid)) continue;
        seenQuestionIds.add(qid);
      }
      dedupedRows.push(r);
    }

    // Precise cycle attribution
    const filterCycles = cycle
      ? cycle
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

    const getEffectiveCycle = (r: any): string => {
      if (r.cycle) return String(r.cycle).trim();
      const examName = String(r.exam || "").toUpperCase();
      if (examName.includes("CAPF")) return "I";
      return "I";
    };

    const rows =
      filterCycles.length > 0
        ? dedupedRows.filter((r) => filterCycles.includes(getEffectiveCycle(r)))
        : dedupedRows;

    const distribution: Array<{ key: string; label: string; count: number }> = [];

    if (groupBy === "cycle") {
      const targetCycles =
        filterCycles.length > 0 ? filterCycles : ["I", "II"];
      for (const c of targetCycles) {
        const count = dedupedRows.filter(
          (r) => getEffectiveCycle(r) === c
        ).length;
        distribution.push({
          key: c,
          label: `Cycle ${c}`,
          count,
        });
      }
    } else if (groupBy === "exam") {
      const targetExams = exam
        ? exam.split(",").map((e) => e.trim()).filter(Boolean)
        : Array.from(new Set(rows.map((r) => r.exam).filter(Boolean))).sort();

      for (const e of targetExams) {
        const expandedE = expandExamQuery(e);
        const count = rows.filter((r) =>
          expandedE.length > 0 ? expandedE.includes(r.exam) : r.exam === e
        ).length;
        distribution.push({
          key: e,
          label: getExamLabel(e),
          count,
        });
      }
    } else {
      // "year"
      const targetYears = year
        ? year
            .split(",")
            .map((y) => parseInt(y.trim(), 10))
            .filter((y) => !isNaN(y))
            .sort((a, b) => b - a)
        : Array.from(new Set(rows.map((r) => r.year).filter((y) => y != null)))
            .map(Number)
            .sort((a, b) => b - a);

      for (const y of targetYears) {
        const count = rows.filter((r) => r.year === y).length;
        distribution.push({
          key: String(y),
          label: String(y),
          count,
        });
      }
    }

    return NextResponse.json(
      { distribution, group_by: groupBy },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to fetch distribution:", err);
    return NextResponse.json(
      { distribution: [], group_by: "year" },
      { status: 200 }
    );
  }
}

