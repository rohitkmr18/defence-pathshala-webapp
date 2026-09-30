import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://afhwegrxnvgsqbqadvwr.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ─── Canonical Exam Slugs ─────────────────────────────────────────────────────

export const EXAM_SLUG_TO_DB: Record<string, string> = {
  cds: "CDS",
  capf: "CAPF-AC",
};

export const EXAM_DB_TO_SLUG: Record<string, string> = {
  CDS: "cds",
  "CAPF-AC": "capf",
  "CAPF AC": "capf",
  CAPF: "capf",
};

export const EXAM_NAMES: Record<string, { label: string; fullTitle: string; description: string }> = {
  CDS: {
    label: "CDS",
    fullTitle: "Combined Defence Services (CDS)",
    description:
      "UPSC Combined Defence Services Examination for recruitment into the Indian Military Academy, Officers Training Academy, Indian Naval Academy, and Indian Air Force Academy.",
  },
  "CAPF-AC": {
    label: "CAPF",
    fullTitle: "Central Armed Police Forces (Assistant Commandants)",
    description:
      "UPSC Central Armed Police Forces (AC) Examination for recruitment of Assistant Commandants into BSF, CRPF, CISF, ITBP, and SSB.",
  },
};

export function slugToExam(slug: string): string | null {
  const cleaned = slug.toLowerCase().trim();
  return EXAM_SLUG_TO_DB[cleaned] || null;
}

export function examToSlug(exam: string): string {
  const upper = exam.toUpperCase().trim();
  return EXAM_DB_TO_SLUG[upper] || exam.toLowerCase();
}

// ─── Subject Slugs ────────────────────────────────────────────────────────────

export function subjectToSlug(subject: string): string {
  return subject
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugToSubject(slug: string, availableSubjects: string[]): string | null {
  const target = slug.toLowerCase().trim();
  return availableSubjects.find((s) => subjectToSlug(s) === target) || null;
}

// ─── Cached Raw Metadata Access ───────────────────────────────────────────────

interface QuestionMetaRow {
  exam: string;
  year: number;
  subject: string;
}

/**
 * Fetches all question rows (exam, year, subject) server-side using service-role access.
 * Cached via Next.js unstable_cache for high performance without repeated full table scans.
 */
export const getCachedQuestionsMeta = unstable_cache(
  async (): Promise<QuestionMetaRow[]> => {
    const key = serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!key) {
      console.error("[SEO] No Supabase key available for server-side queries.");
      return [];
    }

    const client = createClient(supabaseUrl, key);
    const rows: QuestionMetaRow[] = [];
    const pageSize = 1000;
    let start = 0;

    while (true) {
      const { data, error } = await client
        .from("questions")
        .select("exam,year,subject")
        .range(start, start + pageSize - 1);

      if (error) {
        console.error("[SEO] Supabase query error:", error);
        break;
      }
      if (!data || data.length === 0) break;

      for (const row of data) {
        if (row.exam && row.year && row.subject) {
          rows.push({
            exam: String(row.exam).trim(),
            year: Number(row.year),
            subject: String(row.subject).trim(),
          });
        }
      }

      if (data.length < pageSize) break;
      start += pageSize;
    }

    return rows;
  },
  ["seo-questions-metadata-v1"],
  { revalidate: 3600 }
);

// ─── Public SEO Data-Access API ───────────────────────────────────────────────

export interface SubjectStat {
  subject: string;
  slug: string;
  count: number;
}

export interface YearStat {
  year: number;
  count: number;
}

export interface ExamCoverage {
  exam: string;
  slug: string;
  label: string;
  fullTitle: string;
  description: string;
  totalQuestions: number;
  years: YearStat[];
  subjects: SubjectStat[];
}

export interface YearCoverage {
  exam: string;
  examSlug: string;
  year: number;
  totalQuestions: number;
  subjects: SubjectStat[];
  allYearsForExam: number[];
}

export interface SubjectCoverage {
  exam: string;
  examSlug: string;
  year: number;
  subject: string;
  subjectSlug: string;
  questionCount: number;
  otherYearsForSubject: YearStat[];
  otherSubjectsForYear: SubjectStat[];
}

/**
 * Returns overall coverage statistics for an exam. Returns null if exam not found or has 0 questions.
 */
export async function getExamCoverage(examDb: string): Promise<ExamCoverage | null> {
  const rows = await getCachedQuestionsMeta();
  const examRows = rows.filter((r) => r.exam === examDb);

  if (examRows.length === 0) return null;

  const yearMap = new Map<number, number>();
  const subjectMap = new Map<string, number>();

  for (const r of examRows) {
    yearMap.set(r.year, (yearMap.get(r.year) || 0) + 1);
    subjectMap.set(r.subject, (subjectMap.get(r.subject) || 0) + 1);
  }

  const years: YearStat[] = Array.from(yearMap.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year - a.year);

  const subjects: SubjectStat[] = Array.from(subjectMap.entries())
    .map(([subject, count]) => ({
      subject,
      slug: subjectToSlug(subject),
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const info = EXAM_NAMES[examDb] || {
    label: examDb,
    fullTitle: examDb,
    description: `Official UPSC ${examDb} previous year questions and pattern intelligence.`,
  };

  return {
    exam: examDb,
    slug: examToSlug(examDb),
    label: info.label,
    fullTitle: info.fullTitle,
    description: info.description,
    totalQuestions: examRows.length,
    years,
    subjects,
  };
}

/**
 * Returns the list of years for an exam with question counts.
 */
export async function getExamYears(examDb: string): Promise<YearStat[]> {
  const coverage = await getExamCoverage(examDb);
  return coverage ? coverage.years : [];
}

/**
 * Returns coverage for a specific exam and year. Returns null if no questions exist.
 */
export async function getYearCoverage(examDb: string, year: number): Promise<YearCoverage | null> {
  const rows = await getCachedQuestionsMeta();
  const examRows = rows.filter((r) => r.exam === examDb);
  const yearRows = examRows.filter((r) => r.year === year);

  if (yearRows.length === 0) return null;

  const subjectMap = new Map<string, number>();
  for (const r of yearRows) {
    subjectMap.set(r.subject, (subjectMap.get(r.subject) || 0) + 1);
  }

  const subjects: SubjectStat[] = Array.from(subjectMap.entries())
    .map(([subject, count]) => ({
      subject,
      slug: subjectToSlug(subject),
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const allYears = Array.from(new Set(examRows.map((r) => r.year))).sort((a, b) => b - a);

  return {
    exam: examDb,
    examSlug: examToSlug(examDb),
    year,
    totalQuestions: yearRows.length,
    subjects,
    allYearsForExam: allYears,
  };
}

/**
 * Returns coverage for an exact exam, year, and subject. Returns null if 0 questions.
 */
export async function getSubjectCoverage(
  examDb: string,
  year: number,
  subjectName: string
): Promise<SubjectCoverage | null> {
  const rows = await getCachedQuestionsMeta();
  const examRows = rows.filter((r) => r.exam === examDb);
  const matchingRows = examRows.filter(
    (r) => r.year === year && r.subject.toLowerCase() === subjectName.toLowerCase()
  );

  if (matchingRows.length === 0) return null;

  // Other years for this same subject in this exam
  const otherYearsMap = new Map<number, number>();
  for (const r of examRows) {
    if (r.subject.toLowerCase() === subjectName.toLowerCase()) {
      otherYearsMap.set(r.year, (otherYearsMap.get(r.year) || 0) + 1);
    }
  }

  const otherYearsForSubject: YearStat[] = Array.from(otherYearsMap.entries())
    .map(([y, count]) => ({ year: y, count }))
    .sort((a, b) => b.year - a.year);

  // Other subjects in this year
  const otherSubjectsMap = new Map<string, number>();
  for (const r of examRows) {
    if (r.year === year) {
      otherSubjectsMap.set(r.subject, (otherSubjectsMap.get(r.subject) || 0) + 1);
    }
  }

  const otherSubjectsForYear: SubjectStat[] = Array.from(otherSubjectsMap.entries())
    .map(([s, count]) => ({
      subject: s,
      slug: subjectToSlug(s),
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    exam: examDb,
    examSlug: examToSlug(examDb),
    year,
    subject: subjectName,
    subjectSlug: subjectToSlug(subjectName),
    questionCount: matchingRows.length,
    otherYearsForSubject,
    otherSubjectsForYear,
  };
}

/**
 * Returns years and question counts for a subject across all years of an exam.
 */
export async function getSubjectCoverageForExam(
  examDb: string,
  subjectName: string
): Promise<YearStat[]> {
  const rows = await getCachedQuestionsMeta();
  const yearMap = new Map<number, number>();

  for (const r of rows) {
    if (r.exam === examDb && r.subject.toLowerCase() === subjectName.toLowerCase()) {
      yearMap.set(r.year, (yearMap.get(r.year) || 0) + 1);
    }
  }

  return Array.from(yearMap.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year - a.year);
}

// ─── Sitemap Generator Helper ─────────────────────────────────────────────────

export interface EligibleRoute {
  path: string;
  priority: number;
}

/**
 * Calculates the exact set of eligible public SEO routes from real database data.
 * Guarantees zero 404s or empty combinations in the sitemap.
 */
export async function getAllEligibleSeoRoutes(): Promise<EligibleRoute[]> {
  const rows = await getCachedQuestionsMeta();
  const routes: EligibleRoute[] = [];

  // 1. Group rows by exam
  const examMap = new Map<string, QuestionMetaRow[]>();
  for (const r of rows) {
    if (!examMap.has(r.exam)) examMap.set(r.exam, []);
    examMap.get(r.exam)!.push(r);
  }

  for (const [examDb, eRows] of examMap.entries()) {
    const examSlug = examToSlug(examDb);

    // /exams/{exam} (priority 0.9)
    routes.push({
      path: `/exams/${examSlug}`,
      priority: 0.9,
    });

    // /pyqs/{exam} (priority 0.9)
    routes.push({
      path: `/pyqs/${examSlug}`,
      priority: 0.9,
    });

    // Group by year
    const yearMap = new Map<number, QuestionMetaRow[]>();
    for (const r of eRows) {
      if (!yearMap.has(r.year)) yearMap.set(r.year, []);
      yearMap.get(r.year)!.push(r);
    }

    for (const [year, yRows] of yearMap.entries()) {
      // /pyqs/{exam}/{year} (priority 0.8)
      routes.push({
        path: `/pyqs/${examSlug}/${year}`,
        priority: 0.8,
      });

      // Group by subject in this year
      const subjectMap = new Map<string, number>();
      for (const r of yRows) {
        subjectMap.set(r.subject, (subjectMap.get(r.subject) || 0) + 1);
      }

      for (const [subject, count] of subjectMap.entries()) {
        if (count > 0) {
          const subSlug = subjectToSlug(subject);
          // /pyqs/{exam}/{year}/{subject} (priority 0.7)
          routes.push({
            path: `/pyqs/${examSlug}/${year}/${subSlug}`,
            priority: 0.7,
          });
        }
      }
    }
  }

  return routes;
}
