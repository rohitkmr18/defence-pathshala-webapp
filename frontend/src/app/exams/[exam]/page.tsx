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
  const title = `${coverage.fullTitle} | Exam Overview & Preparation Resources`;
  const description = `${coverage.description} Understand the available year and subject coverage, explore the separate PYQ archive, or start focused practice on Defence Pathshala.`;

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
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
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
              Available PYQ Inventory
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {coverage.totalQuestions.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">Questions</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Eligible questions in the current archive; not complete paper coverage</p>
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
              {coverage.years.length} years with available questions
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

      <section aria-labelledby="exam-overview-vs-pyq" className="mb-8 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-7">
        <h2 id="exam-overview-vs-pyq" className="text-xl font-bold text-slate-900">
          Exam overview or previous year questions?
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
          This page summarises the {coverage.label} preparation resources and currently available question coverage.
          To browse individual papers, years, subjects and questions, visit the dedicated {" "}
          <Link href={`/pyqs/${coverage.slug}`} className="font-semibold text-blue-800 underline underline-offset-2">
            {coverage.label} previous year question (PYQ) archive
          </Link>.
          A listed year does not imply that a complete official paper or answer key is available.
        </p>
      </section>

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
            Subjects represented in the currently available {coverage.label} question archive.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {coverage.subjects.map((sub) => (
            <Link
              key={sub.slug}
              href={`/pyqs/${coverage.slug}/${sub.slug}`}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-500 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">
                    {sub.subject}
                  </h3>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    {sub.count}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Question availability varies by year and subject
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                Explore {sub.subject} PYQs <ChevronRight className="h-3 w-3 ml-0.5" />
              </div>
            </Link>
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
            Browse the available previous-year questions, choose a topic drill and review your performance. Answer and explanation verification may vary by question.
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

