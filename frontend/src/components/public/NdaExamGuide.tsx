import Link from "next/link";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import { ArrowRight } from "lucide-react";

// NDA guide facts: UPSC NDA & NA (II) 2026 (Notice 10/2026-NDA-II, 20 May 2026) and the UPSC
// annual calendar for 2027. The NDA & NA (I) 2027 notice is scheduled for 2 December 2026:
// revalidate the eligibility window, vacancies and dates against it once released.
const examPage = "https://www.upsc.gov.in/examinations/National%20Defence%20Academy%20and%20Naval%20Academy%20Examination%20(II),%202026";
const calendar = "https://www.upsc.gov.in/examination-calendar/";
const papers = "https://www.upsc.gov.in/examinations/previous-question-papers";
const base = "https://www.defencepathshala.in";

const sections = [
  ["overview", "Overview"], ["dates", "Dates"], ["eligibility", "Eligibility"], ["pattern", "Exam pattern"],
  ["syllabus", "Syllabus"], ["selection", "Selection"], ["preparation", "Preparation"], ["faq", "FAQs"], ["sources", "Official sources"],
] as const;

const dates = [
  ["NDA & NA (II) 2026", "Notified 20 May 2026 (Notice 10/2026-NDA-II)", "Held 13 September 2026", "394 vacancies; 158th NDA Course and 120th INAC, starting July 2027"],
  ["NDA & NA (I) 2027", "Notification 2 December 2026; apply by 22 December 2026", "11 April 2027", "Scheduled in the UPSC calendar"],
  ["NDA & NA (II) 2027", "Notification 12 May 2027; apply by 1 June 2027", "19 September 2027", "Scheduled in the UPSC calendar"],
];

const maths = [
  ["Algebra", "Sets, relations, complex numbers, quadratic equations, progressions, permutations and combinations, binomial theorem, logarithms"],
  ["Matrices and Determinants", "Types of matrices, operations, determinants, adjoint and inverse, solving linear equations"],
  ["Trigonometry", "Angles, identities, multiple and sub-multiple angles, inverse functions, heights and distances, properties of triangles"],
  ["Analytical Geometry (2D and 3D)", "Straight lines, circles, conic sections, direction cosines, planes and lines in space, spheres"],
  ["Differential Calculus", "Functions, limits, continuity, derivatives and their applications, maxima and minima"],
  ["Integral Calculus and Differential Equations", "Integration methods, definite integrals and areas, order and degree, first-order equations"],
  ["Vector Algebra", "Vectors in two and three dimensions, dot and cross products, applications"],
  ["Statistics and Probability", "Data representation, measures of central tendency and dispersion, correlation, regression, probability, binomial distribution"],
];

const faqs = [
  { q: "What is the NDA exam pattern?", a: "The UPSC NDA written examination has two objective papers of 2½ hours each: Mathematics (120 questions, 300 marks) and the General Ability Test (150 questions, 600 marks). Candidates who qualify are called for the SSB interview, which carries 900 marks, for a total of 1,800 marks." },
  { q: "Is there negative marking in NDA?", a: "Yes. One-third of the marks for a question is deducted for each wrong answer: 0.83 marks in Mathematics (2.5 marks per question) and 1.33 marks in the General Ability Test (4 marks per question). Unanswered questions carry no penalty." },
  { q: "What is the NDA age limit?", a: "Each UPSC notice fixes a date-of-birth window that works out to roughly 16½ to 19½ years at the start of the course. For NDA & NA (II) 2026 the window ended on 1 January 2011. Always check the exact dates in the notice for your cycle." },
  { q: "Can girls apply for NDA?", a: "Yes. Unmarried women can apply for NDA. In NDA & NA (II) 2026, 24 of the 394 vacancies were for women candidates." },
  { q: "Is PCM compulsory for NDA?", a: "Physics, Chemistry and Mathematics in Class 12 are required for the Air Force and Navy wings of NDA and for the Indian Naval Academy. The Army wing accepts Class 12 passed in any stream. Candidates who are appearing in Class 12 may also apply." },
  { q: "When is the NDA 1 2027 exam?", a: "The UPSC calendar schedules the NDA & NA (I) 2027 notification for 2 December 2026, the last date to apply as 22 December 2026, and the written exam for 11 April 2027. UPSC can change these dates." },
  { q: "How many times a year is NDA held?", a: "Twice. NDA I is held in April and NDA II in September." },
];

const faqSchema = faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }));
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage", "@id": `${base}/exams/nda#webpage`, url: `${base}/exams/nda`,
      name: "NDA Exam Guide: Eligibility, Age Limit, Pattern & Syllabus",
      description: "UPSC NDA & NA exam guide covering dates, eligibility, the Mathematics and GAT papers, syllabus, negative marking and SSB selection.",
      citation: [examPage, calendar],
      about: { "@type": "Thing", name: "UPSC National Defence Academy and Naval Academy Examination" },
      dateModified: "2026-11-24",
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Examinations", item: `${base}/exams` },
      { "@type": "ListItem", position: 3, name: "NDA", item: `${base}/exams/nda` },
    ] },
    { "@type": "FAQPage", mainEntity: faqSchema },
  ],
};

const th = "p-4 font-semibold text-slate-900";
const td = "p-4 text-slate-700";

export default function NdaExamGuide() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Examinations", href: "/exams" }, { label: "NDA" }]} />
      <div className="mb-8 max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">UPSC examination guide</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">NDA Exam Guide: Eligibility, Pattern and Syllabus</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          The UPSC NDA & NA exam takes candidates after Class 12 into the Army, Navy and Air Force wings of the National Defence Academy and the Indian Naval Academy.
          The written exam has two papers, Mathematics (300 marks) and the General Ability Test (600 marks), followed by a 900-mark SSB interview.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/pyqs/nda" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">Explore NDA PYQs <ArrowRight className="h-4 w-4" /></Link>
          <Link href="/dashboard/practice?exam=NDA&paper=nda-maths&origin=seo_nda_guide" className="rounded-xl border border-blue-200 px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50">Start practice</Link>
        </div>
      </div>

      <nav aria-label="NDA guide sections" className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="mb-3 text-sm font-bold text-slate-900">On this page</p>
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-blue-700">
          {sections.map(([id, label]) => <a key={id} href={`#${id}`} className="rounded py-1 underline-offset-4 hover:underline">{label}</a>)}
        </div>
      </nav>

      <div className="space-y-10">
        <section id="overview" aria-labelledby="nda-overview" className="scroll-mt-24">
          <h2 id="nda-overview" className="text-2xl font-bold text-slate-900">What is the NDA exam?</h2>
          <p className="mt-3 max-w-4xl leading-7 text-slate-700">
            The Union Public Service Commission (UPSC) holds the National Defence Academy and Naval Academy (NDA & NA) examination twice a year.
            Successful candidates train at the National Defence Academy, Khadakwasla (Army, Navy and Air Force wings) or join the Indian Naval Academy Course (10+2 Cadet Entry Scheme) at Ezhimala.
            NDA I is held in April and NDA II in September.
          </p>
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            <strong>Cycle-specific information:</strong> eligibility details on this page come from the NDA & NA (II) 2026 notice. The NDA & NA (I) 2027 notice, scheduled for 2 December 2026, will set the rules for the next cycle. This page is not an application notice.
          </p>
        </section>

        <section id="dates" aria-labelledby="nda-dates" className="scroll-mt-24">
          <h2 id="nda-dates" className="text-2xl font-bold text-slate-900">NDA exam dates</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">NDA exam cycles, notification and exam dates</caption>
              <thead className="bg-slate-100"><tr>{["Cycle", "Notification", "Written exam", "Notes"].map((x) => <th key={x} scope="col" className="p-4">{x}</th>)}</tr></thead>
              <tbody>{dates.map(([cycle, notice, exam, note]) => (
                <tr key={cycle} className="border-t border-slate-200 align-top"><th scope="row" className={th}>{cycle}</th><td className={td}>{notice}</td><td className={td}>{exam}</td><td className={td}>{note}</td></tr>
              ))}</tbody>
            </table>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-600">Future dates come from the UPSC examination calendar and can change.</p>
        </section>

        <section id="eligibility" aria-labelledby="nda-eligibility" className="scroll-mt-24">
          <h2 id="nda-eligibility" className="text-2xl font-bold text-slate-900">NDA eligibility</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">NDA basic eligibility conditions</caption>
              <thead className="bg-slate-100"><tr><th scope="col" className="p-4">Condition</th><th scope="col" className="p-4">Rule</th></tr></thead>
              <tbody>{[
                ["Gender and marital status", "Unmarried men and women"],
                ["Age", "A date-of-birth window in each notice, roughly 16½ to 19½ years at the start of the course. NDA & NA (II) 2026: born between early January 2008 and 1 January 2011 (confirm the exact first date in the notice)."],
                ["Army wing of NDA", "Class 12 (10+2) passed, or equivalent, in any stream"],
                ["Air Force and Navy wings of NDA, and Indian Naval Academy", "Class 12 (10+2) with Physics, Chemistry and Mathematics, or equivalent"],
                ["Class 12 students", "May apply while appearing, subject to the proof deadlines in the notice"],
                ["Age relaxation", "None by category; the same date-of-birth window applies to every candidate"],
              ].map(([k, v]) => <tr key={k} className="border-t border-slate-200 align-top"><th scope="row" className={th}>{k}</th><td className={td}>{v}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">Physical and medical standards, nationality conditions and the full rules are in the official notice.</p>
        </section>

        <section id="pattern" aria-labelledby="nda-pattern" className="scroll-mt-24">
          <h2 id="nda-pattern" className="text-2xl font-bold text-slate-900">NDA exam pattern</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">NDA written exam and SSB marks</caption>
              <thead className="bg-slate-100"><tr>{["Stage", "Questions", "Marks", "Time", "Wrong answer"].map((x) => <th key={x} scope="col" className="p-4">{x}</th>)}</tr></thead>
              <tbody>{[
                ["Mathematics (Paper 1)", "120", "300 (2.5 per question)", "2½ hours", "−0.83"],
                ["General Ability Test (Paper 2)", "150: English 50, General Knowledge 100", "600: English 200, General Knowledge 400", "2½ hours", "−1.33"],
                ["SSB interview", "—", "900", "Over several days", "—"],
                ["Total", "—", "1,800", "—", "—"],
              ].map(([k, ...v]) => <tr key={k} className="border-t border-slate-200 align-top"><th scope="row" className={th}>{k}</th>{v.map((x, i) => <td key={i} className={td}>{x}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">Both written papers are objective. One-third of a question&apos;s marks is deducted for a wrong answer, and unanswered questions carry no penalty. UPSC sets minimum qualifying marks for the written exam.</p>
        </section>

        <section id="syllabus" aria-labelledby="nda-syllabus" className="scroll-mt-24">
          <h2 id="nda-syllabus" className="text-2xl font-bold text-slate-900">NDA syllabus</h2>
          <h3 className="mt-4 text-lg font-bold text-slate-900">Mathematics</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">{maths.map(([name, desc]) => <div key={name} className="rounded-xl border border-slate-200 p-4"><h4 className="font-bold text-slate-900">{name}</h4><p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p></div>)}</div>
          <h3 className="mt-6 text-lg font-bold text-slate-900">General Ability Test</h3>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            <strong>Part A, English (200 marks):</strong> grammar and usage, vocabulary, comprehension and cohesion in extended text.
            {" "}<strong>Part B, General Knowledge (400 marks):</strong> Physics, Chemistry, General Science, History and the Freedom Movement, Geography and Current Events.
            The notice&apos;s appendix has the exact syllabus wording.
          </p>
        </section>

        <section id="selection" aria-labelledby="nda-selection" className="scroll-mt-24">
          <h2 id="nda-selection" className="text-2xl font-bold text-slate-900">Selection process</h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[
            "UPSC written exam: Mathematics and GAT (900 marks)",
            "SSB interview: intelligence and personality tests (900 marks); Air Force candidates also take the Computerised Pilot Selection System",
            "Medical examination",
            "Final merit from written and SSB marks, subject to eligibility, fitness and vacancies",
          ].map((v, i) => <li key={v} className="rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-700"><span className="mb-2 block text-lg font-extrabold text-blue-700">{String(i + 1).padStart(2, "0")}</span>{v}</li>)}</ol>
        </section>

        <section id="preparation" aria-labelledby="nda-preparation" className="scroll-mt-24">
          <h2 id="nda-preparation" className="text-2xl font-bold text-slate-900">How to prepare with previous year questions</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-700">
            Start with the Class 11 and 12 Mathematics topics that appear most often in previous papers, then practise full papers under the 2½-hour limit to manage negative marking.
            For the GAT, practise English grammar and vocabulary daily and cover the science and current-events portions of General Knowledge, which carry most of the GK marks.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/pyqs/nda" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">Explore NDA PYQs</Link>
            <Link href="/dashboard/practice?exam=NDA&paper=nda-maths&origin=seo_nda_guide" className="rounded-xl border border-blue-200 px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50">Practise Mathematics</Link>
            <Link href="/dashboard/practice?exam=NDA&paper=nda-gat&origin=seo_nda_guide" className="rounded-xl border border-blue-200 px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50">Practise GAT</Link>
          </div>
        </section>

        <section id="faq" aria-labelledby="nda-faq" className="scroll-mt-24">
          <h2 id="nda-faq" className="text-2xl font-bold text-slate-900">Frequently asked questions</h2>
          <div className="mt-4 space-y-3">{faqs.map((f) => <details key={f.q} className="rounded-xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer font-semibold text-slate-900">{f.q}</summary><p className="mt-3 text-sm leading-6 text-slate-700">{f.a}</p></details>)}</div>
        </section>

        <section id="sources" aria-labelledby="nda-sources" className="scroll-mt-24 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h2 id="nda-sources" className="text-xl font-bold text-slate-900">Official UPSC sources</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-blue-700">
            <li><a href={examPage} target="_blank" rel="noopener noreferrer" className="underline">NDA & NA Examination (II) 2026: notice, question papers and results</a></li>
            <li><a href={calendar} target="_blank" rel="noopener noreferrer" className="underline">UPSC examination calendar</a></li>
            <li><a href={papers} target="_blank" rel="noopener noreferrer" className="underline">UPSC previous question papers</a></li>
          </ul>
          <p className="mt-3 text-xs leading-5 text-slate-600">Prepared with reference to UPSC&apos;s NDA & NA (II) 2026 notice and 2027 calendar on 24 November 2026. Check the latest notice before applying.</p>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    </main>
  );
}
