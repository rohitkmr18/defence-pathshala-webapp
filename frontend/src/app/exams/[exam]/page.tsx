import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  slugToExam,
  getExamCoverage,
  examToSlug,
} from "@/lib/seo-data";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import CapfExamGuide from "@/components/public/CapfExamGuide";
import { BookOpen, Calendar, ChevronRight, CheckCircle2, Award, ArrowRight } from "lucide-react";


// CDS guide facts below are based on UPSC CDS-II 2026 Notice 11/2026-CDS-II.
// Age/date-of-birth rules are cycle-specific. Revalidate against CDS-I 2027 once released.
const CDS_NOTICE = "https://www.upsc.gov.in/uploads/2026/06/Notif-CDS-II-2026-Engl-200526-1.pdf";
const CDS_CALENDAR = "https://cms.upsc.gov.in/examination-calendar/";
const CDS_FAQS = [
  { question: "Is Mathematics compulsory for CDS?", answer: "Elementary Mathematics is a written paper for IMA, INA and AFA, but not for the Officers' Training Academy (OTA) written examination." },
  { question: "Can final-year graduates apply for CDS?", answer: "Yes, eligible candidates in their final year or semester may apply, subject to the certificate and degree-proof deadlines in the specific UPSC notification." },
  { question: "Does CDS have negative marking?", answer: "Yes. For an incorrect objective answer, UPSC deducts one-third of the marks assigned to that question. Unanswered questions have no penalty." },
  { question: "What is the selection process after the CDS written exam?", answer: "Candidates who qualify the written examination are considered for the Services Selection Board (SSB) interview, followed by medical fitness assessment and merit-based admission subject to eligibility and vacancies." },
];
const CDS_ACADEMIES = [
  { name: "Indian Military Academy (IMA)", age: "19–24 years", dob: "1 Jul 2003 – 1 Jul 2008", eligibility: "Unmarried men", qualification: "Recognised university degree or equivalent" },
  { name: "Indian Naval Academy (INA)", age: "19–24 years", dob: "1 Jul 2003 – 1 Jul 2008", eligibility: "Unmarried men", qualification: "Engineering degree, OR BSc with Physics as core/elective and Physics + Mathematics at 10+2" },
  { name: "Air Force Academy (AFA)", age: "20–24 years (CPL relaxation may apply)", dob: "1 Jul 2003 – 1 Jul 2007; CPL: 1 Jul 2001 – 1 Jul 2007", eligibility: "Below age 25: unmarried; see notice for married candidates aged 25+", qualification: "Recognised degree with Physics + Mathematics at 10+2, OR Bachelor of Engineering" },
  { name: "Officers' Training Academy (OTA), Men", age: "19–25 years", dob: "1 Jul 2002 – 1 Jul 2008", eligibility: "Unmarried men", qualification: "Recognised university degree or equivalent" },
  { name: "Officers' Training Academy (OTA), Women", age: "19–25 years", dob: "1 Jul 2002 – 1 Jul 2008", eligibility: "Unmarried women and specified issueless widows/divorcees who have not remarried", qualification: "Recognised university degree or equivalent" },
];

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
  const title = coverage.slug === "cds" ? "CDS Exam Guide: Eligibility, Age, Syllabus & Pattern | Defence Pathshala" : coverage.slug === "capf" ? "CAPF AC Exam Guide: Eligibility, Syllabus, Pattern & PET | Defence Pathshala" : `${coverage.fullTitle} | Exam Overview & Preparation Resources`;
  const description = coverage.slug === "cds" ? "Explore UPSC CDS eligibility by academy, age limits, educational qualifications, written exam pattern, syllabus, SSB selection and official sources. Includes CDS PYQs and video." : coverage.slug === "capf" ? "Complete UPSC CAPF AC exam guide: 2026 age and degree eligibility, Paper I and II pattern, syllabus, PET, physical standards, interview and official links." : `${coverage.description} Understand the available year and subject coverage, explore the separate PYQ archive, or start focused practice on Defence Pathshala.`;

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

  if (coverage.slug === "capf") return <CapfExamGuide />;

  const minYear = Math.min(...coverage.years.map((y) => y.year));
  const maxYear = Math.max(...coverage.years.map((y) => y.year));
  const yearSpanText = minYear === maxYear ? `${minYear}` : `${minYear} – ${maxYear}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Examinations", href: "/exams" },
          { label: coverage.label },
        ]}
      />

      {coverage.slug === "cds" && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": "https://www.defencepathshala.in/exams/cds#webpage",
              url: "https://www.defencepathshala.in/exams/cds",
              name: "CDS Exam Guide: Eligibility, Age, Syllabus & Pattern",
              description: "UPSC CDS eligibility, exam pattern, syllabus, selection process and official sources",
              isPartOf: { "@id": "https://www.defencepathshala.in/#website" },
              about: { "@type": "Thing", name: "Combined Defence Services Examination" },
              citation: [CDS_NOTICE, CDS_CALENDAR],
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.defencepathshala.in/" },
                { "@type": "ListItem", position: 2, name: "CDS Exam Guide", item: "https://www.defencepathshala.in/exams/cds" },
              ],
            },
            { "@type": "FAQPage", mainEntity: CDS_FAQS.map(({ question, answer }) => ({
              "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer },
            })) },
          ],
        }).replace(/</g, "\\u003c") }} />
      )}

      {coverage.slug === "cds" && (
        <section aria-labelledby="cds-guide-heading" className="mb-5">
          <a
            href="https://www.youtube.com/watch?v=DiBQTWLReGg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Watch the Defence Pathshala CDS video on YouTube (opens in a new tab)"
            className="group relative block aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-sm focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-600"
          >
            <Image
              src="https://i.ytimg.com/vi/DiBQTWLReGg/hqdefault.jpg"
              alt="Defence Pathshala CDS video thumbnail"
              fill
              unoptimized
              priority
              sizes="(max-width: 768px) 100vw, 1152px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-black/10">
              <span className="flex h-14 w-20 items-center justify-center rounded-xl bg-red-600 text-white shadow-md transition group-hover:bg-red-700">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true"><path d="M8 5.5v13l10-6.5z" /></svg>
              </span>
            </span>
          </a>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <h1 id="cds-guide-heading" className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">CDS Exam Guide</h1>
            <a href="https://www.youtube.com/watch?v=DiBQTWLReGg" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline">
              Watch on YouTube <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      )}

      {coverage.slug !== "cds" && (
        <>
      {/* Shared archive-first hero, retained for other exams only */}
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

        </>
      )}

      {coverage.slug === "cds" && (
        <div className="mb-10 space-y-10">
          <nav aria-label="CDS guide sections" className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="mb-3 text-sm font-bold text-slate-900">On this page</p>
            <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-blue-700">
              {[["overview","Overview"],["eligibility","Eligibility"],["pattern","Exam pattern"],["syllabus","Syllabus"],["selection","Selection"],["preparation","Preparation"],["cds-faq","FAQs"],["official-sources","Official sources"]].map(([id,label]) => (
                <a key={id} href={`#${id}`} className="rounded py-1 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">{label}</a>
              ))}
            </div>
          </nav>
          <section id="overview" aria-labelledby="cds-overview-title" className="scroll-mt-24">
            <h2 id="cds-overview-title" className="text-2xl font-bold text-slate-900">What is the CDS examination?</h2>
            <p className="mt-3 max-w-4xl leading-7 text-slate-700">
              The Union Public Service Commission (UPSC) conducts the Combined Defence Services (CDS) examination for entry to the Indian Military Academy (IMA), Indian Naval Academy (INA), Air Force Academy (AFA) and Officers' Training Academy (OTA). The selection process combines an objective written examination with an SSB interview and medical assessment.
            </p>
            <p className="mt-3 max-w-4xl rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              <strong>Cycle-specific information:</strong> The eligibility table below quotes the CDS-II 2026 notification (for courses starting in 2027). These date-of-birth windows must <strong>not</strong> be reused for CDS-I 2027. UPSC's published calendar schedules CDS-I 2027 notification for <strong>2 December 2026</strong> and examination for <strong>11 April 2027</strong>; dates can change.
            </p>
          </section>
          <section id="eligibility" aria-labelledby="cds-eligibility-title" className="scroll-mt-24">
            <h2 id="cds-eligibility-title" className="text-2xl font-bold text-slate-900">CDS eligibility: academy-wise comparison</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Age, date-of-birth and marital-status details below apply <strong>only to UPSC CDS-II 2026</strong>. Both endpoints of the stated date-of-birth ranges are inclusive. Check the notification for nationality, special categories and full eligibility requirements.</p>
            <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-[820px] w-full border-collapse text-left text-sm">
                <caption className="sr-only">CDS-II 2026 academy eligibility and qualifications</caption>
                <thead className="bg-slate-100 text-slate-900"><tr>{["Academy","Age / date of birth","Who can apply","Educational qualification"].map(x=><th key={x} scope="col" className="border-b border-slate-200 p-4 font-bold">{x}</th>)}</tr></thead>
                <tbody>{CDS_ACADEMIES.map((a)=><tr key={a.name} className="align-top even:bg-slate-50"><th scope="row" className="border-b border-slate-100 p-4 font-semibold text-slate-900">{a.name}</th><td className="border-b border-slate-100 p-4 text-slate-700">{a.age}<span className="mt-1 block text-xs">{a.dob}</span></td><td className="border-b border-slate-100 p-4 text-slate-700">{a.eligibility}</td><td className="border-b border-slate-100 p-4 text-slate-700">{a.qualification}</td></tr>)}</tbody>
              </table>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">Final-year/semester candidates can apply subject to UPSC proof-of-passing deadlines. Air Force CPL relaxation and marital-status exceptions require checking the notification in full. Medical fitness is assessed under the relevant armed-forces standards.</p>
            <a href={CDS_NOTICE} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-blue-700 underline">Verify all conditions in the CDS-II 2026 official notification</a>
          </section>
          <section id="pattern" aria-labelledby="cds-pattern-title" className="scroll-mt-24">
            <h2 id="cds-pattern-title" className="text-2xl font-bold text-slate-900">CDS written exam pattern</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[{heading:"IMA / INA / AFA",papers:["English — 100 marks, 2 hours","General Knowledge — 100 marks, 2 hours","Elementary Mathematics — 100 marks, 2 hours"],total:"300 written marks + 300 SSB marks"},{heading:"OTA",papers:["English — 100 marks, 2 hours","General Knowledge — 100 marks, 2 hours"],total:"200 written marks + 200 SSB marks"}].map(p=><div key={p.heading} className="rounded-xl border border-slate-200 bg-white p-5"><h3 className="text-lg font-bold text-slate-900">{p.heading}</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">{p.papers.map(q=><li key={q}>{q}</li>)}</ul><p className="mt-4 text-sm font-bold text-blue-700">{p.total}</p></div>)}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700"><strong>Marking:</strong> Objective-type questions. Incorrect answers incur a penalty of one-third of the question's marks; unanswered questions have no penalty. GK and Mathematics papers are bilingual (English/Hindi); calculators are not permitted. UPSC may prescribe paper-wise qualifying marks.</p>
          </section>
          <section id="syllabus" aria-labelledby="cds-syllabus-title" className="scroll-mt-24">
            <h2 id="cds-syllabus-title" className="text-2xl font-bold text-slate-900">CDS syllabus at a glance</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[{name:"English",content:"Comprehension of English and effective use of words; UPSC tests understanding and workmanlike usage."},{name:"General Knowledge",content:"Current events, everyday science, Indian history and geography. Practice across polity, economy and other GK areas as supporting preparation, not as a claim of separately fixed UPSC syllabus weightage."},{name:"Elementary Mathematics",content:"Matriculation-level arithmetic, number systems, algebra, trigonometry, geometry, mensuration and statistics."}].map(s=><div key={s.name} className="rounded-xl border border-slate-200 p-5"><h3 className="font-bold text-slate-900">{s.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{s.content}</p></div>)}
            </div>
            <p className="mt-3 text-sm text-slate-600">The detailed UPSC Mathematics subtopics are in Appendix I of the official notification. OTA candidates do not take the Mathematics written paper.</p>
          </section>
          <section id="selection" aria-labelledby="cds-selection-title" className="scroll-mt-24">
            <h2 id="cds-selection-title" className="text-2xl font-bold text-slate-900">Selection process</h2>
            <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{["Apply to UPSC and satisfy academy eligibility","Clear the objective written examination","Attend SSB intelligence and personality assessment","Meet medical standards and final merit / vacancy requirements"].map((s,i)=><li key={s} className="rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-700"><span className="mb-2 block text-lg font-extrabold text-blue-700">{String(i+1).padStart(2,"0")}</span>{s}</li>)}</ol>
            <p className="mt-3 text-sm text-slate-600">SSB and medical guidelines must be consulted in the current UPSC notice and service-specific instructions; written qualification alone does not secure admission.</p>
          </section>
          <section id="preparation" aria-labelledby="cds-preparation-title" className="scroll-mt-24">
            <h2 id="cds-preparation-title" className="text-2xl font-bold text-slate-900">How to prepare with Defence Pathshala</h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-700">First identify your intended academy and written papers. Read the official syllabus, solve authentic previous-year questions by paper and topic, analyse errors and practise under timed conditions. OTA aspirants should prioritize English and GK, while IMA/INA/AFA aspirants must also prepare Mathematics.</p>
            <div className="mt-4 flex flex-wrap gap-3"><Link href="/pyqs/cds" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">Explore CDS PYQs</Link><Link href="/dashboard/practice?exam=CDS" className="rounded-xl border border-blue-200 px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50">Start CDS practice</Link></div>
          </section>
          <section id="cds-faq" aria-labelledby="cds-faq-title" className="scroll-mt-24">
            <h2 id="cds-faq-title" className="text-2xl font-bold text-slate-900">Frequently asked questions</h2>
            <div className="mt-4 space-y-3">{CDS_FAQS.map(f=><details key={f.question} className="group rounded-xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">{f.question}</summary><p className="mt-3 text-sm leading-6 text-slate-700">{f.answer}</p></details>)}</div>
          </section>
          <section id="official-sources" aria-labelledby="cds-sources-title" className="scroll-mt-24 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 id="cds-sources-title" className="text-xl font-bold text-slate-900">Official UPSC sources</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-blue-700"><li><a className="underline" href={CDS_NOTICE} target="_blank" rel="noopener noreferrer">CDS-II 2026 notification — eligibility, pattern, syllabus and medical standards</a></li><li><a className="underline" href={CDS_CALENDAR} target="_blank" rel="noopener noreferrer">UPSC examination calendar — forthcoming CDS dates</a></li><li><a className="underline" href="https://www.upsc.gov.in/examinations/previous-question-papers" target="_blank" rel="noopener noreferrer">Official UPSC previous question papers</a></li></ul>
            <p className="mt-3 text-xs leading-5 text-slate-600">Guide reviewed against UPSC sources on 23 November 2026. For an application, the current cycle's UPSC notification overrides this educational summary.</p>
          </section>
        </div>
      )}

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

      {coverage.slug !== "cds" && (<>
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

      </>)}

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

