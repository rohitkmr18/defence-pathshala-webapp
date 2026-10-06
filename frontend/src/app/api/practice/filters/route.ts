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
        { exams: [], years: {}, cycles: {}, subjects: {}, subtopics: {}, subject_weights: {}, topic_weights: {}, subtopic_weights: {}, difficulties: ["Easy", "Moderate", "Hard"] },
        { status: 200 }
      );
    }

    const supabase = createClient(supabaseUrl, key);
    const query = supabase
      .from("v_dp_question_intelligence_v2")
      .select("exam,year,cycle,subject,topic,subtopic")
      .eq("content_eligible", true)
      ;

    const pageSize = 1000;
    const rows: Record<string, unknown>[] = [];
    let start = 0;
    while (true) {
      const { data: pageData, error: pageErr } = await query.range(
        start,
        start + pageSize - 1
      );
      if (pageErr) {
        console.error("Supabase practice filters page query error:", pageErr);
        break;
      }
      if (!pageData || pageData.length === 0) break;
      rows.push(...pageData);
      if (pageData.length < pageSize) break;
      start += pageSize;
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { exams: [], years: {}, cycles: {}, subjects: {}, subtopics: {}, subject_weights: {}, topic_weights: {}, subtopic_weights: {}, difficulties: ["Easy", "Moderate", "Hard"] },
        { status: 200 }
      );
    }

    const examsSet = new Set<string>();
    const yearsMap: Record<string, Set<number>> = {};
    const cyclesMap: Record<string, Set<string>> = {};
    const subjectsMap: Record<string, Record<string, Set<string>>> = {};
    const subtopicsMap: Record<string, Record<string, Set<string>>> = {};
    const subjectWeights: Record<string, Record<string, number>> = {};
    const topicWeights: Record<string, Record<string, Record<string, number>>> = {};
    const subtopicWeights: Record<string, Record<string, Record<string, number>>> = {};

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

        if (!subjectWeights[exam]) subjectWeights[exam] = {};
        subjectWeights[exam][subject] = (subjectWeights[exam][subject] ?? 0) + 1;
        if (!topicWeights[exam]) topicWeights[exam] = {};
        if (!topicWeights[exam][subject]) topicWeights[exam][subject] = {};
        topicWeights[exam][subject][topic] = (topicWeights[exam][subject][topic] ?? 0) + 1;

        if (subtopic) {
          if (!subtopicsMap[subject]) subtopicsMap[subject] = {};
          if (!subtopicsMap[subject][topic]) subtopicsMap[subject][topic] = new Set();
          subtopicsMap[subject][topic].add(subtopic);
          if (!subtopicWeights[subject]) subtopicWeights[subject] = {};
          if (!subtopicWeights[subject][topic]) subtopicWeights[subject][topic] = {};
          subtopicWeights[subject][topic][subtopic] = (subtopicWeights[subject][topic][subtopic] ?? 0) + 1;
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
      subject_weights: subjectWeights,
      topic_weights: topicWeights,
      subtopic_weights: subtopicWeights,
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
