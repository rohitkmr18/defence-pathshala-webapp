import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  slugToExam,
  slugToSubject,
  getYearCoverage,
  getSubjectCoverage,
  getExamCoverage,
} from "@/lib/seo-data";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import { BookOpen, Calendar, ArrowRight, Layers, PieChart } from "lucide-react";

interface PageProps {
  params: Promise<{
    exam: string;
    year: string;
    subject: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { exam, year, subject } = await params;
  const yearNum = parseInt(year, 10);
  if (isNaN(yearNum)) return {};

  const examDb = slugToExam(exam);
  if (!examDb) return {};

  const yearCoverage = await getYearCoverage(examDb, yearNum);
  if (!yearCoverage) return {};

  const matchedSubject = slugToSubject(
    subject,
    yearCoverage.subjects.map((s) => s.subject)
  );
  if (!matchedSubject) return {};

  const subjectCoverage = await getSubjectCoverage(examDb, yearNum, matchedSubject);
  if (!subjectCoverage) return {};

  const canonicalUrl = `https://www.defencepathshala.in/pyqs/${subjectCoverage.examSlug}/${yearNum}/${subjectCoverage.subjectSlug}`;
  const title = `${examDb} ${yearNum} ${subjectCoverage.subject} PYQs - Questions & Solutions | Defence Pathshala`;
  const description = `Practice ${subjectCoverage.questionCount} verified ${subjectCoverage.subject} questions from UPSC ${examDb} ${yearNum}. Complete solutions, explanations, and pattern intelligence.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Defence Pathshala",
      type: "website",
    },
  };
}

export default async function ExamYearSubjectPyqPage({ params }: PageProps) {
  const { exam, year, subject } = await params;
  const yearNum = parseInt(year, 10);
  if (isNaN(yearNum)) {
    notFound();
  }

  const examDb = slugToExam(exam);
  if (!examDb) {
    notFound();
  }

  const examCoverage = await getExamCoverage(examDb);
  const yearCoverage = await getYearCoverage(examDb, yearNum);

  if (!examCoverage || !yearCoverage) {
    notFound();
  }

  const matchedSubject = slugToSubject(
    subject,
    yearCoverage.subjects.map((s) => s.subject)
  );

  if (!matchedSubject) {
    notFound();
  }

  const subjectCoverage = await getSubjectCoverage(examDb, yearNum, matchedSubject);
  if (!subjectCoverage) {
    notFound();
  }

  const weightagePercent = ((subjectCoverage.questionCount / yearCoverage.totalQuestions) * 100).toFixed(1);
  const otherYearsForSubject = subjectCoverage.otherYearsForSubject.filter((y) => y.year !== yearNum);
  const otherSubjectsInYear = subjectCoverage.otherSubjectsForYear.filter((s) => s.subject !== matchedSubject);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "PYQs", href: `/pyqs/${subjectCoverage.examSlug}` },
          { label: examCoverage.label, href: `/pyqs/${subjectCoverage.examSlug}` },
          { label: `${yearNum}`, href: `/pyqs/${subjectCoverage.examSlug}/${yearNum}` },
          { label: subjectCoverage.subject },
        ]}
      />

      {/* Main Hero Header */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10 mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-3">
          <BookOpen className="h-3.5 w-3.5" />
          {examDb} • {yearNum} • {subjectCoverage.subject}
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {examDb} {yearNum} {subjectCoverage.subject} Previous Year Questions
        </h1>
        <p className="mt-3 text-base text-slate-600 sm:text-lg max-w-3xl leading-relaxed">
          Detailed question breakdown and targeted practice for {subjectCoverage.subject} questions appearing in the UPSC {examDb} {yearNum} examination.
        </p>

        {/* Statistical Metrics */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Subject Questions
            </span>
            <div className="mt-1 text-2xl font-bold text-slate-900">
              {subjectCoverage.questionCount} Questions
            </div>
            <p className="text-xs text-slate-500 mt-0.5">In {yearNum} exam paper</p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Paper Weightage
            </span>
            <div className="mt-1 text-2xl font-bold text-blue-600">
              {weightagePercent}%
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Of {yearCoverage.totalQuestions} total questions
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Discipline Status
            </span>
            <div className="mt-1 text-2xl font-bold text-slate-900">
              {subjectCoverage.otherYearsForSubject.length} Years Active
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Tracked in question database</p>
          </div>
        </div>

        {/* Practice CTA */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`/dashboard/practice?exam=${encodeURIComponent(examDb)}&year=${yearNum}&subject=${encodeURIComponent(subjectCoverage.subject)}`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition active:scale-95"
          >
            Practice These {subjectCoverage.questionCount} Questions
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/pyqs/${subjectCoverage.examSlug}/${yearNum}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            All {yearNum} Subjects
          </Link>
        </div>
      </div>

      {/* Cross-Year Matrix for This Subject */}
      {otherYearsForSubject.length > 0 && (
        <section className="mb-10 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            {subjectCoverage.subject} Across Other {examDb} Years
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Compare question trends and practice {subjectCoverage.subject} from other examination years.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {otherYearsForSubject.map((other) => (
              <Link
                key={other.year}
                href={`/pyqs/${subjectCoverage.examSlug}/${other.year}/${subjectCoverage.subjectSlug}`}
                className="group rounded-xl border border-slate-200 bg-slate-50/70 p-4 hover:border-blue-500 hover:bg-blue-50/50 transition"
              >
                <div className="font-bold text-slate-900 group-hover:text-blue-600 text-base">
                  {other.year}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {other.count} Questions
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Other Subjects in this Same Year */}
      {otherSubjectsInYear.length > 0 && (
        <section className="mb-10 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl flex items-center gap-2 mb-2">
            <Layers className="h-5 w-5 text-blue-600" />
            Other Subjects in {examDb} {yearNum}
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Explore remaining subjects tested in the {yearNum} question paper.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {otherSubjectsInYear.map((otherSub) => (
              <Link
                key={otherSub.slug}
                href={`/pyqs/${subjectCoverage.examSlug}/${yearNum}/${otherSub.slug}`}
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 hover:border-blue-500 hover:bg-blue-50/30 transition"
              >
                <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition truncate mr-2">
                  {otherSub.subject}
                </span>
                <span className="shrink-0 rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                  {otherSub.count}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

