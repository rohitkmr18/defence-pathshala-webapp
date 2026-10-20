import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  slugToExam,
  slugToSubject,
  getYearCoverage,
  getSubjectCoverage,
  getExamCoverage,
  getSubjectArchive,
  getTopicArchive,
  slugToTopic,
  MIN_INDEXABLE_TOPIC_QUESTIONS,
} from "@/lib/seo-data";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import SeoTopicLandingTracker from "@/components/seo/SeoTopicLandingTracker";
import { BookOpen, Calendar, ArrowRight, Layers } from "lucide-react";

interface PageProps {
  params: Promise<{
    exam: string;
    dimension: string;
    subject: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { exam, dimension, subject } = await params;
  const yearNum = parseInt(dimension, 10);
  const examDb = slugToExam(exam);
  if (!examDb) return {};

  if (isNaN(yearNum)) {
    const examCoverage = await getExamCoverage(examDb);
    if (!examCoverage) return {};

    const matchedSubject = slugToSubject(
      dimension,
      examCoverage.subjects.map((s) => s.subject)
    );
    if (!matchedSubject) return {};

    const subjectArchive = await getSubjectArchive(examDb, matchedSubject);
    if (!subjectArchive) return {};

    const matchedTopic = slugToTopic(
      subject,
      subjectArchive.topics.map((t) => t.topic)
    );
    if (!matchedTopic) return {};

    const topicArchive = await getTopicArchive(examDb, matchedSubject, matchedTopic);
    if (!topicArchive || topicArchive.totalQuestions < MIN_INDEXABLE_TOPIC_QUESTIONS) {
      return {
        robots: { index: false, follow: true },
      };
    }

    const years = topicArchive.years.map((y) => y.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const yearText = minYear === maxYear ? String(minYear) : `${minYear}–${maxYear}`;
    const canonicalUrl = `https://www.defencepathshala.in/pyqs/${topicArchive.examSlug}/${topicArchive.subjectSlug}/${topicArchive.topicSlug}`;
    const title = `${examCoverage.label} ${topicArchive.topic} PYQs - ${topicArchive.totalQuestions} Previous Year Questions`;
    const description = `Practice ${topicArchive.totalQuestions} ${examCoverage.label} ${topicArchive.topic} previous year questions from ${yearText}, with official-paper context, answers and topic-focused practice.`;

    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      robots: { index: true, follow: true },
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
  const title = `${examDb} ${yearNum} ${subjectCoverage.subject} PYQs - Questions & Solutions`;
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
      images: ["/og-image.png"],
      type: "website",
    },
  };
}

export default async function ExamYearSubjectPyqPage({ params }: PageProps) {
  const { exam, dimension, subject } = await params;
  const yearNum = parseInt(dimension, 10);

  const examDb = slugToExam(exam);
  if (!examDb) {
    notFound();
  }

  if (isNaN(yearNum)) {
    return <ExamSubjectTopicPyqPage examDb={examDb} subjectSlug={dimension} topicSlug={subject} />;
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



async function ExamSubjectTopicPyqPage({
  examDb,
  subjectSlug,
  topicSlug,
}: {
  examDb: string;
  subjectSlug: string;
  topicSlug: string;
}) {
  const examCoverage = await getExamCoverage(examDb);
  if (!examCoverage) notFound();

  const matchedSubject = slugToSubject(
    subjectSlug,
    examCoverage.subjects.map((s) => s.subject)
  );
  if (!matchedSubject) notFound();

  const subjectArchive = await getSubjectArchive(examDb, matchedSubject);
  if (!subjectArchive) notFound();

  const matchedTopic = slugToTopic(
    topicSlug,
    subjectArchive.topics.map((t) => t.topic)
  );
  if (!matchedTopic) notFound();

  const archive = await getTopicArchive(examDb, matchedSubject, matchedTopic);
  if (!archive || archive.totalQuestions < MIN_INDEXABLE_TOPIC_QUESTIONS) notFound();

  const minYear = Math.min(...archive.years.map((y) => y.year));
  const maxYear = Math.max(...archive.years.map((y) => y.year));
  const yearText = minYear === maxYear ? String(minYear) : `${minYear}–${maxYear}`;
  const subjectTotal = subjectArchive.totalQuestions;
  const share = subjectTotal > 0 ? ((archive.totalQuestions / subjectTotal) * 100).toFixed(1) : "0.0";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.defencepathshala.in" },
      { "@type": "ListItem", position: 2, name: "PYQs", item: `https://www.defencepathshala.in/pyqs/${archive.examSlug}` },
      { "@type": "ListItem", position: 3, name: archive.subject, item: `https://www.defencepathshala.in/pyqs/${archive.examSlug}/${archive.subjectSlug}` },
      { "@type": "ListItem", position: 4, name: archive.topic, item: `https://www.defencepathshala.in/pyqs/${archive.examSlug}/${archive.subjectSlug}/${archive.topicSlug}` },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SeoTopicLandingTracker
        exam={examCoverage.label}
        subject={archive.subject}
        topic={archive.topic}
        questionCount={archive.totalQuestions}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "PYQs", href: `/pyqs/${archive.examSlug}` },
          { label: archive.subject, href: `/pyqs/${archive.examSlug}/${archive.subjectSlug}` },
          { label: archive.topic },
        ]}
      />

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10 mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-3">
          <BookOpen className="h-3.5 w-3.5" />
          {examCoverage.label} • {archive.subject} • Topic PYQ Intelligence
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {examCoverage.label} {archive.topic} Previous Year Questions
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Practice {archive.totalQuestions} verified {examCoverage.label} questions tagged to {archive.topic} within {archive.subject}, covering {yearText}. The statistics and question set below are generated from Defence Pathshala&apos;s canonical PYQ intelligence corpus.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Topic Questions</span>
            <div className="mt-1 text-2xl font-bold text-slate-900">{archive.totalQuestions}</div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Years Covered</span>
            <div className="mt-1 text-2xl font-bold text-blue-600">{archive.years.length}</div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Subject Share</span>
            <div className="mt-1 text-2xl font-bold text-slate-900">{share}%</div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Coverage</span>
            <div className="mt-1 text-lg font-bold text-slate-900">{yearText}</div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`/dashboard/practice?exam=${encodeURIComponent(examDb)}&subject=${encodeURIComponent(archive.subject)}&topic=${encodeURIComponent(archive.topic)}&origin=seo_topic`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95"
          >
            Practice {archive.topic} PYQs
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/pyqs/${archive.examSlug}/${archive.subjectSlug}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            All {archive.subject} PYQs
          </Link>
        </div>
      </div>

      <section className="mb-10 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Year-wise {archive.topic} frequency</h2>
        <p className="mt-1 text-sm text-slate-500">Observed question counts in the currently verified corpus; this is historical evidence, not a future-paper prediction.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {archive.years.map((y) => (
            <div key={y.year} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-lg font-bold text-slate-900">{y.year}</div>
              <div className="mt-1 text-xs font-semibold text-slate-500">{y.count} questions</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">
            {archive.totalQuestions} {examCoverage.label} {archive.topic} PYQs
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Server-rendered question text from the eligible PYQ corpus. Use Practice mode for answer tracking and personalised analytics.
          </p>
        </div>

        <div className="space-y-5">
          {archive.questions.map((q, idx) => (
            <article key={q.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3 text-xs">
                <span className="rounded-md bg-blue-600 px-2 py-0.5 font-bold text-white">#{idx + 1}</span>
                <span className="rounded-md bg-slate-100 px-2.5 py-0.5 font-semibold text-slate-700">
                  {q.exam} {q.year}{q.cycle ? ` • Cycle ${q.cycle}` : ""}{q.qNum ? ` • Q.${q.qNum}` : ""}
                </span>
                {q.difficultyCategory && (
                  <span className="rounded-md bg-slate-50 px-2 py-0.5 font-semibold text-slate-600">
                    {q.difficultyCategory}
                  </span>
                )}
              </div>
              <p className="mt-4 whitespace-pre-line text-base font-medium leading-relaxed text-slate-900 sm:text-lg">
                {q.question}
              </p>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {q.optA && <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"><strong>(A)</strong> {q.optA}</div>}
                {q.optB && <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"><strong>(B)</strong> {q.optB}</div>}
                {q.optC && <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"><strong>(C)</strong> {q.optC}</div>}
                {q.optD && <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"><strong>(D)</strong> {q.optD}</div>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
