import Link from "next/link";
import type { ExamCoverage, YearCoverage } from "@/lib/seo-data";

interface Props {
  coverage: ExamCoverage;
  years: YearCoverage[];
}

export default function PyqEvidenceMatrix({ coverage, years }: Props) {
  // Ranked by observed eligible inventory, never by predicted future exam weightage.
  const leadingSubjects = coverage.subjects.slice(0, 5);
  if (leadingSubjects.length === 0 || years.length === 0) return null;

  const yearCounts = new Map(years.map((year) => [
    year.year,
    new Map(year.subjects.map((subject) => [subject.slug, subject.count])),
  ]));

  return (
    <section id="pyq-evidence" aria-labelledby="pyq-evidence-heading" className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      <h2 id="pyq-evidence-heading" className="text-xl font-bold text-slate-900 sm:text-2xl">
        {coverage.label} PYQ inventory by year and subject
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
        This table counts {coverage.totalQuestions.toLocaleString("en-IN")} currently eligible questions
        across {coverage.years.length} available examination years in Defence Pathshala&apos;s
        {coverage.slug === "cds" ? " General Knowledge" : " Paper I"} archive.
        It is a description of the available dataset, not a frequency prediction or a claim
        about complete UPSC paper coverage.
      </p>
      <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full border-collapse text-left text-sm">
          <caption className="sr-only">Counts of eligible {coverage.label} questions by subject and examination year</caption>
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">Subject</th>
              {years.map((year) => (
                <th key={year.year} scope="col" className="px-3 py-3 text-right font-semibold">
                  <Link href={`/pyqs/${coverage.slug}/${year.year}`} className="text-blue-700 hover:underline">
                    {year.year}
                  </Link>
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-right font-semibold">Available total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leadingSubjects.map((subject) => (
              <tr key={subject.slug}>
                <th scope="row" className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">
                  <Link href={`/pyqs/${coverage.slug}/${subject.slug}`} className="text-blue-700 hover:underline">
                    {subject.subject}
                  </Link>
                </th>
                {years.map((year) => (
                  <td key={year.year} className="px-3 py-3 text-right tabular-nums text-slate-700">
                    {yearCounts.get(year.year)?.get(subject.slug) ?? 0}
                  </td>
                ))}
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-900">{subject.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {coverage.subjects.length > leadingSubjects.length && (
        <p className="mt-3 text-sm text-slate-600">
          Showing the five subjects with the most eligible questions. Browse the full subject archive above for other subjects.
        </p>
      )}
      <p className="mt-3 text-xs leading-5 text-slate-600">
        Method: count each eligible database question under its recorded examination year and subject.
        Zero means no eligible question for that combination in this dataset, not that the topic was absent
        from the official paper. Totals may change when questions are added or their eligibility changes.
        Source: Defence Pathshala&apos;s eligible question archive;{" "}
        <Link href="/about" className="font-semibold text-blue-700 hover:underline">
          editorial and platform information
        </Link>.
      </p>
    </section>
  );
}
