import Link from "next/link";
import { EXAM_SLUG_TO_DB, getExamCoverage, type ExamCoverage } from "@/lib/seo-data";

interface PublicExploreLinksProps {
  /** Heading level wrapper copy. */
  heading?: string;
  /** Show the per-subject PYQ links (requires a database read, cached by seo-data). */
  showSubjects?: boolean;
  className?: string;
}

async function loadCoverages(): Promise<ExamCoverage[]> {
  try {
    const results = await Promise.all(
      Object.values(EXAM_SLUG_TO_DB).map((examDb) => getExamCoverage(examDb))
    );
    return results.filter((c): c is ExamCoverage => c !== null);
  } catch (err) {
    console.error("[PublicExploreLinks] Failed to load exam coverage:", err);
    return [];
  }
}

/**
 * Plain, crawlable links to the public hubs and to every subject archive that has questions.
 * Subject links come from the same data that builds the sitemap, so they never point at an
 * empty or missing page. Renders only the static links if the database read fails.
 */
export default async function PublicExploreLinks({
  heading = "Explore previous year questions, mocks and current affairs",
  showSubjects = true,
  className = "",
}: PublicExploreLinksProps) {
  const coverages = showSubjects ? await loadCoverages() : [];

  return (
    <section aria-labelledby="explore-links-heading" className={className}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 id="explore-links-heading" className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
          {heading}
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coverages.map((coverage) => (
            <div key={coverage.slug} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900">
                <Link href={`/pyqs/${coverage.slug}`} className="hover:text-blue-700">
                  {coverage.label} previous year questions
                </Link>
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {coverage.totalQuestions.toLocaleString("en-IN")} questions, {coverage.years.length} exam cycles
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {coverage.subjects.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/pyqs/${coverage.slug}/${s.slug}`}
                      className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                    >
                      {coverage.label} {s.subject} PYQs
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs">
                <Link href={`/exams/${coverage.slug}`} className="font-semibold text-blue-700 hover:underline">
                  {coverage.label} exam pattern and analysis
                </Link>
              </p>
            </div>
          ))}

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-bold text-slate-900">Mocks and daily practice</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/afcat" className="font-semibold text-blue-700 hover:underline">
                  Free AFCAT full mock test with analysis
                </Link>
              </li>
              <li>
                <Link href="/current-affairs" className="font-semibold text-blue-700 hover:underline">
                  Daily current affairs for defence exams
                </Link>
              </li>
              <li>
                <Link href="/about" className="font-semibold text-blue-700 hover:underline">
                  About Defence Pathshala
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
