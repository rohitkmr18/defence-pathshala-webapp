// ─────────────────────────────────────────────────────────────────────────────
// Exam Registry — single source of truth for exams, papers, sections and
// marking schemes (multi-exam master plan, step 2).
//
// Patterns: CDS 2 2026, NDA 2026 and AFCAT 2026 notifications as summarised in
// the master plan (sources there); CAPF-AC from the existing scoring contract.
// Re-verify against each new official notification before changing values.
//
// This module is additive: existing callers (examScoring.ts, exams.ts) keep
// working unchanged. Later slices migrate them onto this registry.
// ─────────────────────────────────────────────────────────────────────────────

export type RegistryStatus = "live" | "coming_soon";
export type ExamSlug = "cds" | "capf" | "afcat" | "nda";

export interface Marking {
  correct: number;
  wrong: number; // marks deducted per wrong answer (positive number)
  correctLabel: string;
  wrongLabel: string;
}

export interface ExamSection {
  id: string;
  label: string;
  questions?: number;
  /** Subject names as stored in `questions.subject` that belong to this section. */
  dbSubjects?: string[];
}

export interface ExamPaper {
  id: string; // globally unique, e.g. "cds-gk"
  label: string;
  format: "mcq" | "descriptive";
  questions: number | null;
  maxMarks: number;
  minutes: number;
  marking: Marking | null; // null for descriptive papers
  sections: ExamSection[];
  /** Values of `questions.paper` that map to this paper. */
  dbPaperValues: string[];
  status: RegistryStatus;
}

export interface ExamEntry {
  id: string;
  label: string;
  paperIds: string[];
}

export interface ExamDefinition {
  slug: ExamSlug;
  dbValue: string; // value in questions.exam / afcat tables
  label: string;
  fullName: string;
  conductingBody: "UPSC" | "IAF";
  status: RegistryStatus;
  entries?: ExamEntry[];
  papers: ExamPaper[];
}

const GS_SUBJECTS = [
  "History", "Geography", "Polity", "Economy", "Science & Technology", "Environment",
  "Current Affairs", "International Relations", "Security",
];

export const EXAM_REGISTRY: ExamDefinition[] = [
  {
    slug: "cds",
    dbValue: "CDS",
    label: "CDS",
    fullName: "Combined Defence Services",
    conductingBody: "UPSC",
    status: "live",
    entries: [
      { id: "ima", label: "IMA", paperIds: ["cds-english", "cds-gk", "cds-maths"] },
      { id: "ina", label: "INA", paperIds: ["cds-english", "cds-gk", "cds-maths"] },
      { id: "afa", label: "AFA", paperIds: ["cds-english", "cds-gk", "cds-maths"] },
      { id: "ota", label: "OTA", paperIds: ["cds-english", "cds-gk"] },
    ],
    papers: [
      {
        id: "cds-gk", label: "General Knowledge", format: "mcq", questions: 120, maxMarks: 100, minutes: 120,
        marking: { correct: 100 / 120, wrong: 100 / 360, correctLabel: "+0.83", wrongLabel: "-0.28" },
        sections: [{ id: "gk", label: "General Knowledge", questions: 120, dbSubjects: GS_SUBJECTS }],
        dbPaperValues: ["General Knowledge"], status: "live",
      },
      {
        id: "cds-english", label: "English", format: "mcq", questions: 120, maxMarks: 100, minutes: 120,
        marking: { correct: 100 / 120, wrong: 100 / 360, correctLabel: "+0.83", wrongLabel: "-0.28" },
        sections: [{ id: "english", label: "English", questions: 120 }],
        dbPaperValues: ["English"], status: "coming_soon",
      },
      {
        id: "cds-maths", label: "Elementary Mathematics", format: "mcq", questions: 100, maxMarks: 100, minutes: 120,
        marking: { correct: 1, wrong: 1 / 3, correctLabel: "+1.00", wrongLabel: "-0.33" },
        sections: [{ id: "maths", label: "Elementary Mathematics", questions: 100 }],
        dbPaperValues: ["Elementary Mathematics"], status: "coming_soon",
      },
    ],
  },
  {
    slug: "capf",
    dbValue: "CAPF-AC",
    label: "CAPF (AC)",
    fullName: "Central Armed Police Forces (Assistant Commandants)",
    conductingBody: "UPSC",
    status: "live",
    papers: [
      {
        id: "capf-p1", label: "Paper I · General Ability and Intelligence", format: "mcq", questions: 125, maxMarks: 250, minutes: 120,
        marking: { correct: 2, wrong: 0.67, correctLabel: "+2.00", wrongLabel: "-0.67" },
        sections: [
          { id: "general-ability", label: "General Ability", dbSubjects: GS_SUBJECTS },
          { id: "gma", label: "General Mental Ability", dbSubjects: ["General Mental Ability"] },
        ],
        dbPaperValues: ["Paper I"], status: "live",
      },
      {
        id: "capf-p2", label: "Paper II · Essay, Comprehension and Précis", format: "descriptive", questions: null, maxMarks: 200, minutes: 180,
        marking: null, sections: [], dbPaperValues: ["Paper II"], status: "coming_soon",
      },
    ],
  },
  {
    slug: "afcat",
    dbValue: "AFCAT",
    label: "AFCAT",
    fullName: "Air Force Common Admission Test",
    conductingBody: "IAF",
    status: "live",
    papers: [
      {
        id: "afcat-written", label: "Written Test", format: "mcq", questions: 100, maxMarks: 300, minutes: 120,
        marking: { correct: 3, wrong: 1, correctLabel: "+3.00", wrongLabel: "-1.00" },
        sections: [
          { id: "GENERAL_AWARENESS", label: "General Awareness", questions: 25 },
          { id: "ENGLISH", label: "Verbal Ability in English", questions: 30 },
          { id: "NUMERICAL", label: "Numerical Ability", questions: 20 },
          { id: "REASONING", label: "Reasoning & Military Aptitude", questions: 25 },
        ],
        dbPaperValues: [], status: "live",
      },
      {
        id: "afcat-ekt", label: "Engineering Knowledge Test", format: "mcq", questions: 50, maxMarks: 150, minutes: 45,
        marking: { correct: 3, wrong: 1, correctLabel: "+3.00", wrongLabel: "-1.00" },
        sections: [], dbPaperValues: [], status: "coming_soon",
      },
    ],
  },
  {
    slug: "nda",
    dbValue: "NDA",
    label: "NDA",
    fullName: "National Defence Academy & Naval Academy",
    conductingBody: "UPSC",
    status: "coming_soon",
    papers: [
      {
        id: "nda-maths", label: "Mathematics", format: "mcq", questions: 120, maxMarks: 300, minutes: 150,
        marking: { correct: 2.5, wrong: 0.83, correctLabel: "+2.50", wrongLabel: "-0.83" },
        sections: [{ id: "maths", label: "Mathematics", questions: 120 }],
        dbPaperValues: ["Mathematics"], status: "coming_soon",
      },
      {
        id: "nda-gat", label: "General Ability Test", format: "mcq", questions: 150, maxMarks: 600, minutes: 150,
        marking: { correct: 4, wrong: 1.33, correctLabel: "+4.00", wrongLabel: "-1.33" },
        sections: [
          { id: "english", label: "English", questions: 50 },
          { id: "gk", label: "General Knowledge", questions: 100, dbSubjects: GS_SUBJECTS },
        ],
        dbPaperValues: ["General Ability Test"], status: "coming_soon",
      },
    ],
  },
];

// ── Lookups ────────────────────────────────────────────────────────────────

const norm = (v: string) => v.trim().toUpperCase().replace(/[\s_]+/g, "-");

const EXAM_ALIASES: Record<string, ExamSlug> = {
  CDS: "cds", CAPF: "capf", "CAPF-AC": "capf", "CAPF-(AC)": "capf", AFCAT: "afcat", NDA: "nda",
};

export function getExam(value: string | null | undefined): ExamDefinition | null {
  if (!value) return null;
  const slug = EXAM_ALIASES[norm(value)] ?? (value.toLowerCase() as ExamSlug);
  return EXAM_REGISTRY.find((e) => e.slug === slug) ?? null;
}

export function getPaper(paperId: string): ExamPaper | null {
  for (const exam of EXAM_REGISTRY) {
    const paper = exam.papers.find((p) => p.id === paperId);
    if (paper) return paper;
  }
  return null;
}

/** Resolve a stored question's (exam, paper) pair to a registry paper. */
export function resolvePaper(exam: string | null | undefined, dbPaper?: string | null): ExamPaper | null {
  const def = getExam(exam);
  if (!def) return null;
  if (dbPaper) {
    const match = def.papers.find((p) => p.dbPaperValues.some((v) => v.toLowerCase() === dbPaper.trim().toLowerCase()));
    if (match) return match;
  }
  // Default to the exam's first live MCQ paper (today's corpus has one paper per exam).
  return def.papers.find((p) => p.status === "live" && p.format === "mcq") ?? null;
}

/**
 * `questions.paper` values whose registry paper is live. Learner-facing question
 * reads must stay inside this set so a staged or coming-soon paper (for example
 * Elementary Mathematics) can never surface in another paper's practice.
 */
export function liveDbPaperValues(): string[] {
  return Array.from(new Set(
    EXAM_REGISTRY.flatMap((def) => def.papers.filter((p) => p.status === "live").flatMap((p) => p.dbPaperValues)),
  ));
}

export function liveExams(): ExamDefinition[] {
  return EXAM_REGISTRY.filter((e) => e.status === "live");
}

/** Score a set of answers against a paper's marking scheme. */
export function scorePaper(paper: ExamPaper, correct: number, wrong: number): number {
  if (!paper.marking) throw new Error(`${paper.id} is not an objective paper`);
  return correct * paper.marking.correct - wrong * paper.marking.wrong;
}
