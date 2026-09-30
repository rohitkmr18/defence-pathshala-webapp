import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  slugToExam,
  getExamCoverage,
  getYearCoverage,
} from "@/lib/seo-data";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import { Calendar, ChevronRight, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";

interface PageProps {
  params: Promise<{
    exam: string;
    year: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { exam, year } = await params;
  const yearNum = parseInt(year, 10);
  if (isNaN(yearNum)) return {};

  const examDb = slugToExam(exam);
  if (!examDb) return {};

  const examCoverage = await getExamCoverage(examDb);
  const yearCoverage = await getYearCoverage(examDb, yearNum);
  if (!examCoverage || !yearCoverage) return {};

  const canonicalUrl = `https://www.defencepathshala.in/pyqs/${examCoverage.slug}/${yearNum}`;
  const title = `${examCoverage.label} ${yearNum} PYQs - Question Paper & Subject Analysis`;
  const description = `Analyze and practice official UPSC ${examCoverage.label} ${yearNum} previous year questions. Contains ${yearCoverage.totalQuestions} questions across ${yearCoverage.subjects.length} subjects with instant solutions.`;

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
      images: ["/og-image.png"],
      type: "website",
    },
  };
}

export default async function ExamYearPyqPage({ params }: PageProps) {
  const { exam, year } = await params;
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

  const otherYears = yearCoverage.allYearsForExam.filter((y) => y !== yearNum);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "PYQs", href: `/pyqs/${examCoverage.slug}` },
          { label: examCoverage.label, href: `/pyqs/${examCoverage.slug}` },
          { label: `${yearNum}` },
        ]}
      />

      {/* Header card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10 mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-3">
          <Calendar className="h-3.5 w-3.5" />
          Examination Year {yearNum}
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {examCoverage.label} {yearNum} Previous Year Questions
        </h1>
        <p className="mt-3 text-base text-slate-600 sm:text-lg max-w-3xl leading-relaxed">
          Comprehensive subject-wise breakdown of official UPSC {examCoverage.fullTitle} {yearNum} examination questions with full answer keys and performance tracking.
        </p>

        {/* Stats */}
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-5 py-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Questions
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">
              {yearCoverage.totalQuestions}
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-5 py-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Subjects Tested
            </span>
            <div className="text-2xl font-bold text-blue-600 mt-0.5">
              {yearCoverage.subjects.length}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`/dashboard/practice?exam=${encodeURIComponent(examDb)}&year=${yearNum}`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition active:scale-95"
          >
            Attempt {yearNum} Exam Paper
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/exams/${examCoverage.slug}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Exam Syllabus & Guide
          </Link>
        </div>
      </div>

      {/* Subject list */}
      <section className="mb-12">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Subject Breakdown for {yearNum}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Choose a subject to examine dedicated year analysis and individual question sets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {yearCoverage.subjects.map((sub) => (
            <Link
              key={sub.slug}
              href={`/pyqs/${examCoverage.slug}/${yearNum}/${sub.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-500 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition">
                    {sub.subject}
                  </h3>
                  <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                    {sub.count} Qs
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {sub.count} questions asked in {examCoverage.label} {yearNum}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-blue-600">
                <span>View {sub.subject} PYQs</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Switch year */}
      {otherYears.length > 0 && (
        <section className="mb-10 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-3">
            Other {examCoverage.label} Examination Years
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {otherYears.map((otherYear) => (
              <Link
                key={otherYear}
                href={`/pyqs/${examCoverage.slug}/${otherYear}`}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition"
              >
                {examCoverage.label} {otherYear}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

