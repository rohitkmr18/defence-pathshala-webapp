import { NextResponse } from "next/server";
import { backendGET } from "@/lib/backend";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://afhwegrxnvgsqbqadvwr.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET() {
  // 1. Try FastAPI backend first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const response = await backendGET("/practice/filters");
    clearTimeout(timeoutId);

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
    const key = serviceRoleKey || anonKey;
    if (!key) {
      return NextResponse.json(
        { exams: [], years: {}, cycles: {}, subjects: {} },
        { status: 200 }
      );
    }

    const supabase = createClient(supabaseUrl, key);
    const { data: rows, error } = await supabase
      .from("questions")
      .select("exam,year,cycle,subject,topic");

    if (error || !rows) {
      return NextResponse.json(
        { exams: [], years: {}, cycles: {}, subjects: {} },
        { status: 200 }
      );
    }

    const examsSet = new Set<string>();
    const yearsMap: Record<string, Set<number>> = {};
    const cyclesMap: Record<string, Set<string>> = {};
    const subjectsMap: Record<string, Record<string, Set<string>>> = {};

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

      if (subject && topic) {
        if (!subjectsMap[exam]) subjectsMap[exam] = {};
        if (!subjectsMap[exam][subject]) subjectsMap[exam][subject] = new Set();
        subjectsMap[exam][subject].add(topic);
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

    return NextResponse.json({
      exams: sortedExams,
      years: formattedYears,
      cycles: formattedCycles,
      subjects: formattedSubjects,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to load practice filters" },
      { status: 500 }
    );
  }
}
