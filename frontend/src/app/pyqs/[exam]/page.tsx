import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  slugToExam,
  getExamCoverage,
} from "@/lib/seo-data";
import { pageMetadata } from "@/lib/seo-metadata";
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

  const label = coverage.slug === "capf" ? "CAPF AC" : "CDS";
  return {
    ...pageMetadata({
      title: `${label} PYQs – Previous Year Questions & Practice`,
      description: coverage.slug === "cds"
        ? "Browse UPSC CDS GK previous year questions by year and subject, with available answers and explanations. Choose a topic and continue to PYQ practice."
        : "Browse UPSC CAPF AC Paper I previous year questions by year and subject, with available answers and explanations. Continue to targeted PYQ practice.",
      path: `/pyqs/${coverage.slug}`,
    }),
    robots: { index: true, follow: true },
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

  const label = coverage.slug === "capf" ? "CAPF AC" : "CDS";
  const paperScope = coverage.slug === "cds" ? "General Knowledge (GK)" : "Paper I";
  const practiceHref = `/dashboard/practice?exam=${encodeURIComponent(coverage.exam)}&paper=gs&origin=seo_${coverage.slug}_archive`;
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.defencepathshala.in/" },
      { "@type": "ListItem", position: 2, name: `${label} PYQs`, item: `https://www.defencepathshala.in/pyqs/${coverage.slug}` },
    ],
  };
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <Breadcrumbs
        items={[
          { label: `${label} PYQs` },
        ]}
      />

      {/* Header section */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-3">
          <FileText className="h-3.5 w-3.5" />
          UPSC previous year questions
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {label} PYQs – Previous Year Questions
        </h1>
        <p className="mt-3 text-base text-slate-600 sm:text-lg max-w-3xl leading-relaxed">
          Build your {label} PYQ practice around {paperScope}: browse by year or subject,
          read available answers and explanations, then work on a focused practice drill.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          {coverage.totalQuestions.toLocaleString()} questions across {coverage.years.length} available years
          ({coverage.years.map((y) => y.year).join(", ")}). Counts describe this archive, not complete paper coverage.
          {coverage.slug === "cds" && " English and Mathematics are separate practice papers and are not included in these archive counts."}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Link href={practiceHref} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">Start {label} PYQ practice</Link>
          <Link href={`/exams/${coverage.slug}`} className="text-sm font-semibold text-blue-700">Read the {label} exam guide</Link>
        </div>
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
                  <strong className="text-slate-900">{y.count.toLocaleString()}</strong> questions
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
            Browse the {paperScope} subjects currently available in this archive.
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
                  href={`${practiceHref}&subject=${encodeURIComponent(sub.subject)}`}
                  className="font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-0.5"
                >
                  Practice drill <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 space-y-4" aria-labelledby="archive-help">
        <h2 id="archive-help" className="text-xl font-bold text-slate-900">How to use these {label} PYQs</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          Use year-wise browsing for paper context and subject pages to compare questions on the same area.
          Read an answer after attempting the question yourself; explanations are shown where available.
          The archive links directly to practice with your exam and subject selected.
        </p>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          Built by Rohit Kumar, an IIT Kanpur alumnus and {coverage.slug === "cds" ? "four-time CDS written examination qualifier" : "UPSC CAPF AC AIR 163 rank holder"}.
          Defence Pathshala is an independent learning platform, not affiliated with or endorsed by UPSC or IIT Kanpur.
          {" "}<Link href="/about" className="font-semibold text-blue-700">About Defence Pathshala</Link>
        </p>
        <details className="rounded-xl border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer font-semibold">Which papers and years are included?</summary>
          <p className="mt-2 text-sm text-slate-600">This archive covers {paperScope}. The year and subject cards show current inventory; a listed year does not mean every paper or question is available.</p>
        </details>
        <details className="rounded-xl border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer font-semibold">Are all answers official UPSC answer keys?</summary>
          <p className="mt-2 text-sm text-slate-600">No blanket official-key claim is made. Check the answer, explanation and source information shown with each question; availability and verification status can vary.</p>
        </details>
        <details className="rounded-xl border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer font-semibold">Can I browse before signing in?</summary>
          <p className="mt-2 text-sm text-slate-600">Yes. Year and subject archives are public. Practice links take you into the application, which may ask you to sign in before continuing.</p>
        </details>
      </section>

      {/* Practice CTA */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
            Turn your {label} revision into practice
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Choose your exam and subject filters, then start a focused session. Sign in when prompted to continue.
          </p>
        </div>
        <Link
          href={practiceHref}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition active:scale-95 shrink-0"
        >
          Start Practice Drill
        </Link>
      </div>
    </div>
  );
}

