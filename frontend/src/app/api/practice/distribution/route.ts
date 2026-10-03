import { NextRequest, NextResponse } from "next/server";
import { backendGET } from "@/lib/backend";
import { createClient } from "@supabase/supabase-js";
import { expandExamQuery, getExamLabel } from "@/lib/exams";

type DistributionRow = { id: string; question_id: string | null; exam: string; year: number | null; cycle: string | null };

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
        { error: "Practice data service unavailable" },
        { status: 503 }
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
      .from("v_dp_question_intelligence_v2")
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
    const allRawRows: DistributionRow[] = [];
    let start = 0;
    while (true) {
      const { data: pageData, error: pageErr } = await query.range(
        start,
        start + pageSize - 1
      );
      if (pageErr) {
        throw new Error("Practice distribution query failed");
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
    const dedupedRows: DistributionRow[] = [];
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

    const getEffectiveCycle = (r: DistributionRow): string => {
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
      const rawExams = exam
        ? exam.split(",").map((e) => e.trim()).filter(Boolean)
        : Array.from(new Set(rows.map((r) => r.exam).filter(Boolean)));

      // Deduplicate by clean UI label (e.g. 'CAPF-AC' and 'CAPF' map to 'CAPF')
      const examLabelsSeen = new Set<string>();
      const uniqueExams: Array<{ canonical: string; label: string }> = [];

      for (const e of rawExams) {
        const label = getExamLabel(e);
        if (!examLabelsSeen.has(label)) {
          examLabelsSeen.add(label);
          uniqueExams.push({ canonical: e, label });
        }
      }

      for (const { canonical, label } of uniqueExams) {
        const expandedE = expandExamQuery(canonical);
        const examRows = rows.filter((r) =>
          expandedE.length > 0 ? expandedE.includes(r.exam) : r.exam === canonical
        );

        // Check if this exam has cycles (e.g. CDS with cycle I and II)
        const cyclesInExam = Array.from(
          new Set(
            examRows
              .map((r) => (r.cycle ? String(r.cycle).trim() : ""))
              .filter(Boolean)
          )
        ).sort();

        // If exam is CDS, show CDS I and CDS II separately
        if (canonical.toUpperCase().includes("CDS")) {
          const targetExamCycles =
            filterCycles.length > 0 ? filterCycles : ["I", "II"];

          for (const cycleVal of targetExamCycles) {
            const count = examRows.filter(
              (r) => String(r.cycle || "").trim() === cycleVal
            ).length;
            distribution.push({
              key: `${canonical}:${cycleVal}`,
              label: `${label} ${cycleVal}`,
              count,
            });
          }
        } else {
          distribution.push({
            key: canonical,
            label,
            count: examRows.length,
          });
        }
      }

      // Desired presentation order: CDS I, CDS II, CAPF (or NDA I, NDA II, etc.)
      const getSortRank = (itemLabel: string): number => {
        if (itemLabel.startsWith("CDS I") && !itemLabel.startsWith("CDS II")) return 1;
        if (itemLabel.startsWith("CDS II")) return 2;
        if (itemLabel.startsWith("CAPF")) return 3;
        if (itemLabel.startsWith("NDA I") && !itemLabel.startsWith("NDA II")) return 4;
        if (itemLabel.startsWith("NDA II")) return 5;
        if (itemLabel.startsWith("AFCAT")) return 6;
        return 10;
      };

      distribution.sort(
        (a, b) =>
          getSortRank(a.label) - getSortRank(b.label) ||
          a.label.localeCompare(b.label)
      );
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
      { error: "Practice distribution query failed" },
      { status: 503 }
    );
  }
}

