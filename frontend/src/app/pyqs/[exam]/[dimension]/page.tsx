import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  slugToExam,
  practicePaperParam,
  slugToSubject,
  getExamCoverage,
  getYearCoverage,
  getSubjectArchive,
  MIN_INDEXABLE_TOPIC_QUESTIONS,
  topicToSlug,
} from "@/lib/seo-data";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import CapfPaper2Archive from "@/components/public/CapfPaper2Archive";
import { CAPF_P2_PATH, capfP2Stats } from "@/lib/capf-paper2-pyqs";
import { pageMetadata } from "@/lib/seo-metadata";
import {
  Calendar,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Layers,
  Award,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    exam: string;
    dimension: string;
  }>;
}

// ─── Metadata Generation ──────────────────────────────────────────────────────

/** CAPF Paper II (descriptive) has its own static archive, separate from the MCQ question bank. */
function isCapfPaper2(exam: string, dimension: string): boolean {
  return exam.toLowerCase().trim() === "capf" && dimension.toLowerCase().trim() === "paper-2";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { exam, dimension } = await params;
  if (isCapfPaper2(exam, dimension)) {
    const s = capfP2Stats();
    return {
      ...pageMetadata({
        title: `CAPF AC Paper II Essay Topics & Arguments PYQs (${s.firstYear}–${s.lastYear})`,
        description: `All ${s.essays} essay topics (Q1) and ${s.arguments} for-and-against statements (Q2) from UPSC CAPF AC Paper II, ${s.firstYear}–${s.lastYear}, as printed in the official papers, with Hindi essay topics and theme-wise trends.`,
        path: CAPF_P2_PATH,
      }),
      robots: { index: true, follow: true },
    };
  }
  const examDb = slugToExam(exam);
  if (!examDb) return {};

  const trimmed = dimension.trim();
  const yearNum = parseInt(trimmed, 10);
  const isYear = !isNaN(yearNum) && String(yearNum) === trimmed;

  if (isYear) {
    // Case A: Year metadata
    const examCoverage = await getExamCoverage(examDb);
    const yearCoverage = await getYearCoverage(examDb, yearNum);
    if (!examCoverage || !yearCoverage) return {};

    const canonicalUrl = `https://www.defencepathshala.in/pyqs/${examCoverage.slug}/${yearNum}`;
    const title = `${examCoverage.label} ${yearNum} PYQs - Available Questions by Subject`;
    const description = `Explore ${yearCoverage.totalQuestions} available ${examCoverage.label} ${yearNum} previous year questions across ${yearCoverage.subjects.length} subjects. Browse subject-wise coverage and practise eligible questions.`;

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
  } else {
    // Case B: Subject metadata
    const examCoverage = await getExamCoverage(examDb);
    if (!examCoverage) return {};

    const matchedSubject = slugToSubject(
      trimmed,
      examCoverage.subjects.map((s) => s.subject)
    );
    if (!matchedSubject) return {};

    const archive = await getSubjectArchive(examDb, matchedSubject);
    if (!archive || archive.totalQuestions === 0) return {};

    const minYear = Math.min(...archive.years.map((y) => y.year));
    const maxYear = Math.max(...archive.years.map((y) => y.year));
    const yearSpanText = minYear === maxYear ? `${minYear}` : `${minYear}–${maxYear}`;

    const canonicalUrl = `https://www.defencepathshala.in/pyqs/${archive.examSlug}/${archive.subjectSlug}`;
    const isHistoryPilot = archive.examSlug === "cds" && archive.subjectSlug === "history";
  const isCdsScience = archive.examSlug === "cds" && archive.subjectSlug === "science-technology";
  const isCdsPolity = archive.examSlug === "cds" && archive.subjectSlug === "polity";
  const isCapfPilot = archive.examSlug === "capf" && ["general-mental-ability", "science-technology"].includes(archive.subjectSlug);
  const capfSubjectLabel = archive.subjectSlug === "general-mental-ability" ? "Mental Ability" : "Science & Technology";
    const title = isHistoryPilot
      ? `CDS History PYQs (${yearSpanText}) with Answers`
      : isCdsScience ? `CDS Science & Technology PYQs (${yearSpanText}) with Answers`
      : isCdsPolity ? `CDS Polity PYQs (${yearSpanText}) with Answers`
      : isCapfPilot ? `CAPF AC ${capfSubjectLabel} PYQs (${yearSpanText}) with Answers`
      : `${archive.exam} ${archive.subject} Previous Year Questions (${yearSpanText})`;
    const description = isHistoryPilot
      ? `Practise ${archive.totalQuestions} CDS History PYQs from ${yearSpanText} for free. Browse by year and topic, with answers and explanations where available.`
      : isCdsScience ? `Practise ${archive.totalQuestions} CDS Science PYQs from ${yearSpanText}. Browse Science & Technology (S&T) questions by topic and year, with answers where available.`
      : isCdsPolity ? `Practise ${archive.totalQuestions} CDS Polity PYQs from ${yearSpanText}. Browse by topic and year, with answers and explanations where available.`
      : isCapfPilot ? `Practise ${archive.totalQuestions} CAPF AC ${capfSubjectLabel} Paper I PYQs from ${yearSpanText}. Browse by year and topic, with answers and explanations where available.`
      : `Browse ${archive.totalQuestions} available ${archive.exam} ${archive.subject} PYQs from ${yearSpanText}, with year-wise question counts, topic breakdown and practice links. Answers vary by question.`;

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
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default async function DimensionPyqPage({ params }: PageProps) {
  const { exam, dimension } = await params;
  if (isCapfPaper2(exam, dimension)) {
    return <CapfPaper2Archive />;
  }
  const examDb = slugToExam(exam);
  if (!examDb) {
    notFound();
  }

  const trimmed = dimension.trim();
  const yearNum = parseInt(trimmed, 10);
  const isYear = !isNaN(yearNum) && String(yearNum) === trimmed;

  if (isYear) {
    return <YearPageView examDb={examDb} yearNum={yearNum} />;
  } else {
    return <SubjectPageView examDb={examDb} subjectSlug={trimmed} />;
  }
}

// ─── Case A: Year Page View ───────────────────────────────────────────────────

async function YearPageView({
  examDb,
  yearNum,
}: {
  examDb: string;
  yearNum: number;
}) {
  const examCoverage = await getExamCoverage(examDb);
  const yearCoverage = await getYearCoverage(examDb, yearNum);

  if (!examCoverage || !yearCoverage) {
    notFound();
  }
  const paperParam = await practicePaperParam(examDb);

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
          Browse the available {examCoverage.label} {yearNum} previous year questions by subject. Counts reflect the eligible Defence Pathshala question inventory, not necessarily the complete official paper or answer key.
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
            href={`/dashboard/practice?exam=${encodeURIComponent(examDb)}&year=${yearNum}${paperParam}`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition active:scale-95"
          >
            Practise Available {yearNum} Questions
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
                  {sub.count} eligible questions available for {examCoverage.label} {yearNum}
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

// ─── Case B: Subject Page View ─────────────────────────────────────────────────

async function SubjectPageView({
  examDb,
  subjectSlug,
}: {
  examDb: string;
  subjectSlug: string;
}) {
  const examCoverage = await getExamCoverage(examDb);
  if (!examCoverage) {
    notFound();
  }

  const matchedSubject = slugToSubject(
    subjectSlug,
    examCoverage.subjects.map((s) => s.subject)
  );
  if (!matchedSubject) {
    notFound();
  }

  const archive = await getSubjectArchive(examDb, matchedSubject);
  if (!archive || archive.totalQuestions === 0) {
    notFound();
  }
  const paperParam = await practicePaperParam(examDb, archive.subject);
  const isHistoryPilot = archive.examSlug === "cds" && archive.subjectSlug === "history";
  const isCdsScience = archive.examSlug === "cds" && archive.subjectSlug === "science-technology";
  const isCdsPolity = archive.examSlug === "cds" && archive.subjectSlug === "polity";
  const isCapfPilot = archive.examSlug === "capf" && ["general-mental-ability", "science-technology"].includes(archive.subjectSlug);
  const capfSubjectLabel = archive.subjectSlug === "general-mental-ability" ? "Mental Ability" : "Science & Technology";

  const minYear = Math.min(...archive.years.map((y) => y.year));
  const maxYear = Math.max(...archive.years.map((y) => y.year));
  const yearSpanText = minYear === maxYear ? `${minYear}` : `${minYear}–${maxYear}`;

  const otherSubjects = examCoverage.subjects.filter(
    (s) => s.subject.toLowerCase() !== archive.subject.toLowerCase()
  );

  // Structured Data (BreadcrumbList)
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.defencepathshala.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "PYQs",
        item: `https://www.defencepathshala.in/pyqs/${archive.examSlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: archive.exam,
        item: `https://www.defencepathshala.in/pyqs/${archive.examSlug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: archive.subject,
        item: `https://www.defencepathshala.in/pyqs/${archive.examSlug}/${archive.subjectSlug}`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb JSON-LD schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Semantic UI Breadcrumb */}
      <Breadcrumbs
        items={[
          { label: "PYQs", href: `/pyqs/${archive.examSlug}` },
          { label: archive.exam, href: `/pyqs/${archive.examSlug}` },
          { label: archive.subject },
        ]}
      />

      {/* Hero section */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10 mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-3">
          <Award className="h-3.5 w-3.5" />
          UPSC {archive.exam} • {isHistoryPilot ? "GK History Practice" : "Subject Question Archive"}
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {isCapfPilot ? `CAPF AC ${capfSubjectLabel} Previous Year Questions (PYQs)` : `${archive.exam} ${archive.subject} Previous Year Questions${isHistoryPilot || isCdsScience || isCdsPolity ? " (PYQs)" : ""}`}
        </h1>
        <p className="mt-3 text-base text-slate-600 sm:text-lg max-w-3xl leading-relaxed">
          {isHistoryPilot
            ? `Prepare for CDS GK with ${archive.totalQuestions} History PYQs from ${yearSpanText}. Practise by year or topic, and review recorded answers and explanations where available.`
            : isCdsScience ? `Prepare for CDS GK with ${archive.totalQuestions} Science & Technology (S&T) PYQs from ${yearSpanText}. Browse previous year Science questions by topic and year, with recorded answers and explanations where available.`
            : isCdsPolity ? `Prepare for CDS GK with ${archive.totalQuestions} Polity PYQs from ${yearSpanText}. Practise by topic and year, with recorded answers and explanations where available.`
            : isCapfPilot ? `Prepare for CAPF AC Paper I with ${archive.totalQuestions} ${capfSubjectLabel} PYQs from ${yearSpanText}. Practise by year and topic, and review recorded answers and explanations where available.`
            : `Browse ${archive.totalQuestions} eligible ${archive.exam} ${archive.subject} previous year questions from ${yearSpanText}. Compare available questions by year and topic, then practise with answers and explanations where provided.`}
        </p>

        {/* Coverage Summary Metrics */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Total Questions
            </span>
            <div className="mt-1 text-2xl font-bold text-slate-900">
              {archive.totalQuestions}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{isHistoryPilot || isCapfPilot || isCdsScience || isCdsPolity ? "Available PYQs" : "Eligible archived questions"}</p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Years Covered
            </span>
            <div className="mt-1 text-2xl font-bold text-blue-600">
              {archive.years.length} Years
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{yearSpanText}</p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Latest Paper
            </span>
            <div className="mt-1 text-2xl font-bold text-slate-900">
              {maxYear}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Most recent cycle</p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Oldest Paper
            </span>
            <div className="mt-1 text-2xl font-bold text-slate-900">
              {minYear}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{isHistoryPilot || isCapfPilot || isCdsScience || isCdsPolity ? "Earliest available year" : "Baseline archive"}</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`/dashboard/practice?exam=${encodeURIComponent(archive.exam)}&subject=${encodeURIComponent(archive.subject)}${paperParam}`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition active:scale-95"
          >
            {isHistoryPilot ? "Start Free History Practice" : isCdsScience || isCdsPolity ? `Start Free ${archive.subject} Practice` : isCapfPilot ? `Start Free ${capfSubjectLabel} Practice` : `Practice ${archive.subject} Drills Free`}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/exams/${archive.examSlug}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            {archive.exam} Exam Guide
          </Link>
        </div>
      </div>

      {/* Year-Wise Subject Matrix Section (Reverse Internal Link Path) */}
      <section className="mb-10">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            {archive.exam} {archive.subject} PYQs by Year
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Explore {archive.subject} questions filtered by individual examination years.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {archive.years.map((y) => (
            <Link
              key={y.year}
              href={`/pyqs/${archive.examSlug}/${y.year}/${archive.subjectSlug}`}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-500 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition">
                  {y.year}
                </span>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  {y.count} Questions
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                <span>View {y.year} Paper</span>
                <ChevronRight className="h-3 w-3 ml-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Topic Distribution */}
      <section className="mb-10 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            {isHistoryPilot ? "CDS History PYQs by Topic" : isCdsScience || isCdsPolity ? `CDS ${archive.subject} PYQs by Topic` : isCapfPilot ? `CAPF AC ${capfSubjectLabel} PYQs by Topic` : `${archive.subject} Topic Counts in the Available Dataset`}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Distribution among eligible questions currently in the Defence Pathshala dataset; not a claim about complete exam-paper weightage.
          </p>
        </div>

        {archive.topics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {archive.topics.map((t) => {
              const eligible = t.count >= MIN_INDEXABLE_TOPIC_QUESTIONS;
              const content = (
                <>
                  <span className="text-xs font-medium text-slate-800 truncate mr-2">
                    {t.topic}
                  </span>
                  <span className="shrink-0 rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                    {t.count} Qs
                  </span>
                </>
              );

              return eligible ? (
                <Link
                  key={t.topic}
                  href={`/pyqs/${archive.examSlug}/${archive.subjectSlug}/${topicToSlug(t.topic)}`}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-3 transition hover:border-blue-400 hover:bg-blue-50/50"
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={t.topic}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-3"
                  title="Included in the subject archive; not yet published as a standalone SEO page."
                >
                  {content}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            Topic analysis is being expanded as the PYQ taxonomy is verified.
          </p>
        )}
      </section>

      {isHistoryPilot && (
        <section aria-labelledby="history-preparation-heading" className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <h2 id="history-preparation-heading" className="text-xl font-bold text-slate-900">How to prepare History for CDS GK using PYQs</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">Start with the topic groups above to identify gaps in your preparation. Attempt questions before revealing their answers, review explanations where available, then revisit missed concepts. Use the year-wise sets to practise across examination years. Topic counts describe the available archive, not predicted exam weightage.</p>
          <Link href="#subject-questions" className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:underline">Browse History questions and recorded answers</Link>
          <Link href={`/pyqs/${archive.examSlug}`} className="ml-4 mt-4 inline-flex text-sm font-semibold text-blue-700 hover:underline">Explore all CDS PYQs</Link>
        </section>
      )}

      {(isCdsScience || isCdsPolity) && (
        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7" aria-labelledby="cds-subject-guide">
          <h2 id="cds-subject-guide" className="text-xl font-bold text-slate-900">{isCdsScience ? "CDS Science PYQs: Science & Technology (S&T)" : "How to prepare Polity for CDS GK using PYQs"}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">{isCdsScience ? "Looking for CDS Science PYQ, S&T PYQ or SnT PYQ practice? This is the comprehensive Science & Technology subject archive for the available CDS GK questions. Select a topic or examination year, attempt questions and review the recorded explanations where available." : "Use topic-wise Polity questions to identify gaps in your understanding of constitutional provisions and institutions. Attempt the questions first, review the recorded answers and revisit missed concepts."} The archive covers available questions, not necessarily every question asked by UPSC.</p>
          <Link href="#subject-questions" className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:underline">Browse all available questions and recorded answers</Link>
        </section>
      )}
      {isCapfPilot && (
        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7" aria-labelledby="capf-preparation-heading">
          <h2 id="capf-preparation-heading" className="text-xl font-bold text-slate-900">How to prepare {capfSubjectLabel} for CAPF AC Paper I</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">{archive.subjectSlug === "general-mental-ability" ? "Attempt reasoning and quantitative questions before checking the recorded answer. Review the method behind each mistake, then practise related questions under a time limit." : "Attempt science and technology questions before checking the recorded answer. Review the underlying scientific concept, then practise related questions across years."} Use the topic counts above to choose revision sets, not to predict future exam weightage.</p>
          <Link href="#subject-questions" className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:underline">Browse questions and recorded answers</Link>
        </section>
      )}
      {(archive.examSlug === "cds" || archive.examSlug === "capf") && !isHistoryPilot && (
        <p className="mb-8 text-sm text-slate-700">Continue with the full <Link href={`/pyqs/${archive.examSlug}`} className="font-semibold text-blue-700 underline">{archive.examSlug === "cds" ? "CDS PYQ archive" : "CAPF AC PYQ archive"}</Link> to browse other subjects and examination years.</p>
      )}
      <section id="subject-evidence-answers" aria-labelledby="subject-evidence-heading" className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <h2 id="subject-evidence-heading" className="text-xl font-bold text-slate-900">
          {archive.exam} {archive.subject} PYQs — answers from the available dataset
        </h2>
        <div className="mt-4 space-y-5 text-sm leading-6 text-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900">How many {archive.subject} PYQs are available for {archive.exam}?</h3>
            <p>{archive.totalQuestions} eligible questions are currently indexed in this subject archive. This is the Defence Pathshala dataset count, not a claim about the total questions UPSC has asked.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Which examination years are covered?</h3>
            <p>Available questions cover {yearSpanText} across {archive.years.length} examination years in the dataset. Browse the year-wise links above to see each recorded count.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Are all answers independently verified?</h3>
            <p>No blanket verification claim is made. Each archived question displays its recorded answer where available, plus an explanation, source reference and verification status only when those fields are present. A missing source or verification record must not be interpreted as official-key confirmation.</p>
          </div>
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-600">
          Source of these totals: eligible records in Defence Pathshala&apos;s PYQ intelligence archive.
          Counts can change after editorial reconciliation. See the individual questions below for recorded answer provenance.
        </p>
      </section>

      {/* Actual PYQs Section (Core Server-Rendered Content) */}
      <section id="subject-questions" className="mb-12">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl flex items-center gap-2.5">
              <BookOpen className="h-6 w-6 text-blue-600" />
              All {archive.totalQuestions} {archive.exam} {archive.subject} Questions ({yearSpanText})
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              These are eligible archived questions with recorded exam context. Answers, explanations, verification status and source references vary by question; consult the details shown for each item.
            </p>
          </div>
          <span className="self-start sm:self-auto shrink-0 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-slate-700">
            {archive.totalQuestions} Questions Documented
          </span>
        </div>

        {/* Question Corpus List */}
        <div className="space-y-6">
          {archive.questions.map((q, idx) => (
            <article
              key={q.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300"
            >
              {/* Question Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-blue-600 px-2 py-0.5 font-bold text-white">
                    #{idx + 1}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2.5 py-0.5 font-semibold text-slate-700">
                    {q.exam} {q.year}
                    {q.cycle ? ` • Cycle ${q.cycle}` : ""}
                    {q.paper ? ` • ${q.paper}` : ""}
                    {q.qNum ? ` • Q.${q.qNum}` : ""}
                  </span>
                  {q.topic && (
                    <span className="rounded-md bg-slate-50 border border-slate-200 px-2 py-0.5 text-slate-600">
                      {q.topic}
                    </span>
                  )}
                </div>

                {q.difficultyCategory && (
                  <span
                    className={`rounded-md px-2 py-0.5 font-semibold text-xs ${
                      q.difficultyCategory.toLowerCase() === "hard"
                        ? "bg-rose-50 text-rose-700"
                        : q.difficultyCategory.toLowerCase() === "medium"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {q.difficultyCategory}
                  </span>
                )}
              </div>

              {/* Question Body */}
              <div className="mt-4">
                <h3 className="text-slate-900 font-semibold text-base sm:text-lg leading-relaxed whitespace-pre-line">
                  {q.question}
                </h3>
              </div>

              {/* Options Grid */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.optA && (
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 text-sm text-slate-800">
                    <strong className="mr-2 text-slate-600 font-semibold">(A)</strong> {q.optA}
                  </div>
                )}
                {q.optB && (
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 text-sm text-slate-800">
                    <strong className="mr-2 text-slate-600 font-semibold">(B)</strong> {q.optB}
                  </div>
                )}
                {q.optC && (
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 text-sm text-slate-800">
                    <strong className="mr-2 text-slate-600 font-semibold">(C)</strong> {q.optC}
                  </div>
                )}
                {q.optD && (
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 text-sm text-slate-800">
                    <strong className="mr-2 text-slate-600 font-semibold">(D)</strong> {q.optD}
                  </div>
                )}
              </div>

              {/* Expandable Answer & Detailed Explanation */}
              <details className="group mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition">
                <summary className="cursor-pointer font-semibold text-blue-700 hover:text-blue-800 flex items-center justify-between text-sm select-none">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    View Recorded Answer & Evidence
                  </span>
                  <span className="text-xs font-normal text-slate-500 group-open:hidden">
                    Click to reveal
                  </span>
                </summary>
                <div className="mt-3 pt-3 border-t border-slate-200 text-sm text-slate-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      Recorded Answer:
                    </span>
                    <span className="rounded bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 text-xs">
                      {q.finalOpt ? "Option " + q.finalOpt.toUpperCase() : "Not recorded"}
                    </span>
                  </div>

                  {q.explanation && (
                    <div className="mt-2 text-sm text-slate-700 leading-relaxed bg-white rounded-lg p-3 border border-slate-200">
                      <strong className="text-slate-900 block mb-1">Explanation:</strong>
                      {q.explanation}
                    </div>
                  )}

                  {q.source ? (
                    <div className="text-xs text-slate-500 pt-1">
                      <span className="font-semibold text-slate-600">Recorded source:</span> {q.source}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No source reference recorded for this question.</p>
                  )}
                  <p className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-600">Database verification status:</span>{" "}
                    {q.verifiedStatus || "Not recorded"}
                  </p>
                </div>
              </details>
            </article>
          ))}
        </div>
      </section>

      {/* Other Subjects for this Exam */}
      {otherSubjects.length > 0 && (
        <section className="mb-10 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl flex items-center gap-2 mb-2">
            <Layers className="h-5 w-5 text-blue-600" />
            Other {archive.exam} Subjects
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Explore remaining subjects tested across the {archive.exam} question archive.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {otherSubjects.map((otherSub) => (
              <Link
                key={otherSub.slug}
                href={`/pyqs/${archive.examSlug}/${otherSub.slug}`}
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

      {/* Practice CTA Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Ready to test your {archive.subject} proficiency?
          </h2>
          <p className="mt-2 text-sm text-blue-200 max-w-xl">
            Take timed mocks or instant drills for {archive.exam} {archive.subject} with negative marking simulation and performance insights.
          </p>
        </div>
        <Link
          href={`/dashboard/practice?exam=${encodeURIComponent(archive.exam)}&subject=${encodeURIComponent(archive.subject)}${paperParam}`}
          className="shrink-0 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-900 shadow-lg hover:bg-blue-50 transition active:scale-95"
        >
          Launch {archive.subject} Drill
        </Link>
      </div>
    </div>
  );
}

