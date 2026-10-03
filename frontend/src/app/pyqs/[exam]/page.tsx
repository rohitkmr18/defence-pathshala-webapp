import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  slugToExam,
  getExamCoverage,
} from "@/lib/seo-data";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import { Calendar, ChevronRight, FileText, ArrowRight, Layers } from "lucide-react";

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

  const minYear = Math.min(...coverage.years.map((y) => y.year));
  const maxYear = Math.max(...coverage.years.map((y) => y.year));
  const canonicalUrl = `https://www.defencepathshala.in/pyqs/${coverage.slug}`;
  const title = `${coverage.label} Previous Year Questions (${minYear}–${maxYear})`;
  const description = `Exhaustive archive of UPSC ${coverage.label} previous year questions with year-by-year and subject-wise breakdown. Practice ${coverage.totalQuestions.toLocaleString()}+ real questions.`;

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

export default async function ExamPyqArchivePage({ params }: PageProps) {
  const { exam } = await params;
  const examDb = slugToExam(exam);
  if (!examDb) {
    notFound();
  }

  const coverage = await getExamCoverage(examDb);
  if (!coverage) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "PYQs" },
          { label: coverage.label },
        ]}
      />

      {/* Header section */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-3">
          <FileText className="h-3.5 w-3.5" />
          Official UPSC Archive
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {coverage.label} Previous Year Questions Archive
        </h1>
        <p className="mt-3 text-base text-slate-600 sm:text-lg max-w-3xl leading-relaxed">
          Access verified {coverage.fullTitle} previous year questions structured chronologically by exam cycle and organized by syllabus discipline.
        </p>
      </div>

      {/* Years section */}
      <section className="mb-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Select Examination Year
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {coverage.years.length} Years Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {coverage.years.map((y) => (
            <Link
              key={y.year}
              href={`/pyqs/${coverage.slug}/${y.year}`}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-500 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition">
                    {y.year}
                  </span>
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    {coverage.label}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  <strong className="text-slate-900">{y.count.toLocaleString()}</strong> official questions
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-blue-600">
                <span>View Subjects</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Subject Distribution */}
      <section className="mb-12">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            Subject-Wise Question Overview
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Browse all subjects tested in {coverage.label} across the full archive.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coverage.subjects.map((sub) => (
            <div
              key={sub.slug}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-500 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      href={`/pyqs/${coverage.slug}/${sub.slug}`}
                      className="group"
                    >
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">
                        {sub.subject}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-500 mt-1">
                      {sub.count} questions documented across all years
                    </p>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                    {sub.count}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  href={`/pyqs/${coverage.slug}/${sub.slug}`}
                  className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  View All {sub.subject} PYQs <ChevronRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={`/dashboard/practice?exam=${encodeURIComponent(coverage.exam)}&subject=${encodeURIComponent(sub.subject)}`}
                  className="font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-0.5"
                >
                  Practice drill <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Practice CTA */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
            Want to simulate a real {coverage.label} examination?
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Launch our timed Full Paper Attempt mode or filter by custom subject combinations.
          </p>
        </div>
        <Link
          href={`/dashboard/practice?exam=${encodeURIComponent(coverage.exam)}`}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition active:scale-95 shrink-0"
        >
          Start Practice Drill
        </Link>
      </div>
    </div>
  );
}

