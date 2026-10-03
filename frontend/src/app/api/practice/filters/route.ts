import { NextResponse } from "next/server";
import { backendGET } from "@/lib/backend";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://afhwegrxnvgsqbqadvwr.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET() {
  // 1. Try FastAPI backend first
  try {
    const response = await backendGET("/practice/filters");

    if (response.ok) {
      const data = await response.json();
      if (data?.exams && Array.isArray(data.exams) && data.exams.length > 0) {
        return NextResponse.json(data, { status: 200 });
      }
    }
  } catch {
    // Backend unreachable — fallback to direct Supabase query
  }

  // 2. Direct Supabase query fallback (bulletproof)
  try {
    const key = serviceRoleKey;
    if (!key) return NextResponse.json({ error: "Practice data service unavailable" }, { status: 503 });

    const supabase = createClient(supabaseUrl, key);
    const query = supabase
      .from("v_dp_question_intelligence_v2")
      .select("exam,year,cycle,subject,topic,subtopic");

    const pageSize = 1000;
    const rows: Record<string, unknown>[] = [];
    let start = 0;
    while (true) {
      const { data: pageData, error: pageErr } = await query.range(
        start,
        start + pageSize - 1
      );
      if (pageErr) {
        throw new Error("Practice filters query failed");
      }
      if (!pageData || pageData.length === 0) break;
      rows.push(...pageData);
      if (pageData.length < pageSize) break;
      start += pageSize;
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { exams: [], years: {}, cycles: {}, subjects: {}, subtopics: {}, difficulties: ["Easy", "Moderate", "Hard"] },
        { status: 200 }
      );
    }

    const examsSet = new Set<string>();
    const yearsMap: Record<string, Set<number>> = {};
    const cyclesMap: Record<string, Set<string>> = {};
    const subjectsMap: Record<string, Record<string, Set<string>>> = {};
    const subtopicsMap: Record<string, Record<string, Set<string>>> = {};

    for (const row of rows) {
      const exam = row.exam ? String(row.exam).trim() : null;
      if (!exam) continue;

      examsSet.add(exam);

      if (row.year) {
        const y = Number(row.year);
        if (!isNaN(y)) {
          if (!yearsMap[exam]) yearsMap[exam] = new Set();
          yearsMap[exam].add(y);
        }
      }

      if (row.cycle) {
        const c = String(row.cycle).trim();
        if (c) {
          if (!cyclesMap[exam]) cyclesMap[exam] = new Set();
          cyclesMap[exam].add(c);
        }
      }

      const subject = row.subject ? String(row.subject).trim() : null;
      const topic = row.topic ? String(row.topic).trim() : null;
      const subtopic = row.subtopic ? String(row.subtopic).trim() : null;

      if (subject && topic) {
        if (!subjectsMap[exam]) subjectsMap[exam] = {};
        if (!subjectsMap[exam][subject]) subjectsMap[exam][subject] = new Set();
        subjectsMap[exam][subject].add(topic);

        if (subtopic) {
          if (!subtopicsMap[subject]) subtopicsMap[subject] = {};
          if (!subtopicsMap[subject][topic]) subtopicsMap[subject][topic] = new Set();
          subtopicsMap[subject][topic].add(subtopic);
        }
      }
    }

    const sortedExams = Array.from(examsSet).sort();

    const formattedYears: Record<string, number[]> = {};
    for (const [exam, yrs] of Object.entries(yearsMap)) {
      formattedYears[exam] = Array.from(yrs).sort((a, b) => b - a);
    }

    const formattedCycles: Record<string, string[]> = {};
    for (const [exam, cycs] of Object.entries(cyclesMap)) {
      formattedCycles[exam] = Array.from(cycs).sort();
    }

    const formattedSubjects: Record<string, Record<string, string[]>> = {};
    for (const [exam, subs] of Object.entries(subjectsMap)) {
      formattedSubjects[exam] = {};
      for (const [sub, tops] of Object.entries(subs)) {
        formattedSubjects[exam][sub] = Array.from(tops).sort();
      }
    }

    const formattedSubtopics: Record<string, Record<string, string[]>> = {};
    for (const [sub, topMap] of Object.entries(subtopicsMap)) {
      formattedSubtopics[sub] = {};
      for (const [top, subtops] of Object.entries(topMap)) {
        formattedSubtopics[sub][top] = Array.from(subtops).sort();
      }
    }

    return NextResponse.json({
      exams: sortedExams,
      years: formattedYears,
      cycles: formattedCycles,
      subjects: formattedSubjects,
      subtopics: formattedSubtopics,
      difficulties: ["Easy", "Moderate", "Hard"],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load practice filters";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
