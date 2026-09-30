import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  slugToExam,
  getExamCoverage,
  examToSlug,
} from "@/lib/seo-data";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import { BookOpen, Calendar, ChevronRight, CheckCircle2, Award, ArrowRight } from "lucide-react";

interface PageProps {
  params: Promise<{
    exam: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { exam } = await params;
  const examDb = slugToExam(exam);
  if (!examDb) return {};

  const coverage = await getExamCoverage(examDb);
  if (!coverage) return {};

  const canonicalUrl = `https://www.defencepathshala.in/exams/${coverage.slug}`;
  const title = `${coverage.fullTitle} PYQs & Exam Analysis`;
  const description = `${coverage.description} Access ${coverage.totalQuestions.toLocaleString()} verified previous year questions across ${coverage.years.length} exam cycles with topic-wise breakdown.`;

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

export default async function ExamPublicPage({ params }: PageProps) {
  const { exam } = await params;
  const examDb = slugToExam(exam);
  if (!examDb) {
    notFound();
  }

  const coverage = await getExamCoverage(examDb);
  if (!coverage) {
    notFound();
  }

  const minYear = Math.min(...coverage.years.map((y) => y.year));
  const maxYear = Math.max(...coverage.years.map((y) => y.year));
  const yearSpanText = minYear === maxYear ? `${minYear}` : `${minYear} – ${maxYear}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Examinations" },
          { label: coverage.label },
        ]}
      />

      {/* Hero section */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10 mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-4">
          <Award className="h-3.5 w-3.5" />
          UPSC Defence Examination Portal
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {coverage.fullTitle}
        </h1>
        <p className="mt-4 text-base text-slate-600 leading-relaxed sm:text-lg max-w-3xl">
          {coverage.description}
        </p>

        {/* Quick stat cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-5">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Verified PYQ Pool
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {coverage.totalQuestions.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">Questions</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Exhaustive real exam papers</p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-5">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Coverage Timeline
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-600">
                {yearSpanText}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {coverage.years.length} active examination cycles
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-5">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Syllabus Breadth
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {coverage.subjects.length}
              </span>
              <span className="text-xs text-slate-500">Key Subjects</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Categorized by subject and topic</p>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`/dashboard/practice?exam=${encodeURIComponent(coverage.exam)}`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition active:scale-95"
          >
            Practice {coverage.label} Questions Now
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/pyqs/${coverage.slug}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Explore PYQ Archive
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Year-by-Year Archive Grid */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {coverage.label} Previous Year Questions by Year
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select a year to review subject-level breakdown and question distribution.
            </p>
          </div>
          <Link
            href={`/pyqs/${coverage.slug}`}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {coverage.years.map((y) => (
            <Link
              key={y.year}
              href={`/pyqs/${coverage.slug}/${y.year}`}
              className="group relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-500 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition">
                  {y.year}
                </span>
                <Calendar className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition" />
              </div>
              <div className="mt-3 text-xs font-semibold text-slate-500">
                {y.count.toLocaleString()} Questions
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                Explore Year <ChevronRight className="h-3 w-3 ml-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Subject Coverage Grid */}
      <section className="mb-12">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Subject-Wise Question Distribution
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real questions analyzed across {coverage.label} examination syllabus disciplines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {coverage.subjects.map((sub) => (
            <div
              key={sub.slug}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-slate-900 text-sm">
                  {sub.subject}
                </h3>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                  {sub.count}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Covered across all {coverage.years.length} active test years
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Practice CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Ready to test your knowledge on {coverage.label}?
          </h2>
          <p className="mt-2 text-sm text-blue-200 max-w-xl">
            Take timed mocks or instant-feedback topic drills with official questions, performance analytics, and precision accuracy tracking.
          </p>
        </div>
        <Link
          href={`/dashboard/practice?exam=${encodeURIComponent(coverage.exam)}`}
          className="shrink-0 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-900 shadow-lg hover:bg-blue-50 transition active:scale-95"
        >
          Launch Practice Mode
        </Link>
      </div>
    </div>
  );
}

