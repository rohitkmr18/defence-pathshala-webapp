import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import { ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Defence Exam Guides | CDS, NDA & CAPF AC | Defence Pathshala",
  description: "Explore Defence Pathshala's CDS, NDA and CAPF Assistant Commandants exam guides, and go directly to previous-year questions.",
  alternates: { canonical: "https://www.defencepathshala.in/exams" },
  robots: { index: true, follow: true },
};

const exams = [
  {
    slug: "cds",
    title: "Combined Defence Services (CDS)",
    description: "Understand academy eligibility, written exam pattern, syllabus, SSB selection and preparation resources.",
    hasDetailedGuide: true,
  },
  {
    slug: "nda",
    title: "National Defence Academy (NDA & NA)",
    description: "Understand NDA dates, age limit, Class 12 eligibility, the Mathematics and GAT papers, syllabus and SSB selection.",
    hasDetailedGuide: true,
  },
  {
    slug: "capf",
    title: "CAPF Assistant Commandants",
    description: "Understand CAPF eligibility, two written papers, syllabus, physical tests, selection and preparation resources.",
    hasDetailedGuide: true,
  },
] as const;

export default function ExaminationsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Examinations" }]} />
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Defence Examination Guides</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Choose an exam to see its available guide and previous-year question resources.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {exams.map((exam) => (
          <section key={exam.slug} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <BookOpen aria-hidden="true" className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{exam.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{exam.description}</p>
            {!exam.hasDetailedGuide && (
              <p className="mt-3 text-xs text-slate-500">Exam overview; comprehensive eligibility guide not yet available.</p>
            )}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold">
              <Link href={`/exams/${exam.slug}`} className="inline-flex items-center gap-2 text-blue-700 hover:underline">
                {exam.hasDetailedGuide ? "Read exam guide" : "View exam overview"} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={`/pyqs/${exam.slug}`} className="text-slate-700 hover:text-blue-700 hover:underline">
                Explore PYQs
              </Link>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
