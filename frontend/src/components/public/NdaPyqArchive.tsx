import Link from "next/link";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import PyqEvidenceMatrix from "@/components/public/PyqEvidenceMatrix";
import type { ExamCoverage, NdaPaperStat, YearCoverage } from "@/lib/seo-data";
import { ArrowRight, Calendar, ChevronRight, FileText } from "lucide-react";

const base = "https://www.defencepathshala.in";

const PAPER_COPY: Record<NdaPaperStat["tab"], { name: string; detail: string }> = {
  "nda-maths": { name: "Mathematics", detail: "120 questions · 300 marks · 2½ hours" },
  "nda-gat": { name: "General Ability Test (GAT)", detail: "150 questions · 600 marks · 2½ hours (English 50, GK 100)" },
};

interface Props {
  coverage: ExamCoverage;
  papers: NdaPaperStat[];
  years: YearCoverage[];
}

function practiceHref(tab: string, subject?: string) {
  const s = subject ? `&subject=${encodeURIComponent(subject)}` : "";
  return `/dashboard/practice?exam=NDA&paper=${tab}${s}&origin=seo_nda_archive`;
}

export default function NdaPyqArchive({ coverage, papers, years }: Props) {
  const yearList = coverage.years.map((y) => y.year);
  const yearText = yearList.length === 1 ? `${yearList[0]}` : `${Math.min(...yearList)} to ${Math.max(...yearList)}`;

  const faqs = [
    {
      q: "Which NDA previous year papers are available on Defence Pathshala?",
      a: `Defence Pathshala currently has ${coverage.totalQuestions} NDA questions from ${yearText}, covering both written papers: Mathematics and the General Ability Test. Earlier NDA papers are being added year by year, back to 2020.`,
    },
    {
      q: "What does the NDA written exam contain?",
      a: "Two objective papers of 2½ hours each. Mathematics has 120 questions for 300 marks. The General Ability Test has 150 questions for 600 marks: 50 English questions (200 marks) and 100 General Knowledge questions (400 marks).",
    },
    {
      q: "Is there negative marking in NDA?",
      a: "Yes. One-third of the marks for a question is deducted for each wrong answer: 0.83 in Mathematics and 1.33 in the GAT. Unanswered questions carry no penalty.",
    },
    {
      q: "Are the answers official UPSC answer keys?",
      a: "No blanket official-key claim is made. Answers and explanations are prepared and checked by Defence Pathshala; questions whose printed data is inconsistent are withheld rather than given a guessed answer.",
    },
    {
      q: "Can I practise NDA PYQs topic-wise?",
      a: "Yes. Each NDA question is tagged to a subject and topic, such as Trigonometry, Probability, Vocabulary or Geography. Choose a subject below to browse its questions, or open practice with that subject selected.",
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage", "@id": `${base}/pyqs/nda#webpage`, url: `${base}/pyqs/nda`,
        name: "NDA PYQs: Previous Year Questions for Mathematics and GAT",
        about: { "@type": "Thing", name: "UPSC National Defence Academy and Naval Academy Examination" },
        isPartOf: { "@id": `${base}/#website` },
      },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: "NDA PYQs", item: `${base}/pyqs/nda` },
      ] },
      { "@type": "FAQPage", mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <Breadcrumbs items={[{ label: "NDA PYQs" }]} />

      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
          <FileText className="h-3.5 w-3.5" />
          UPSC previous year questions
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">NDA PYQs – Mathematics and GAT Previous Year Questions</h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Practise {coverage.totalQuestions} UPSC NDA previous year questions from {yearText}, tagged by subject and topic, with answers and explanations.
          Choose Mathematics or the General Ability Test, then browse by subject or start practice.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <a href="#choose-nda-paper" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">Choose NDA paper</a>
          <Link href="/exams/nda" className="text-sm font-semibold text-blue-700">Read the NDA exam guide</Link>
        </div>
      </div>

      <section id="choose-nda-paper" className="mb-10 scroll-mt-24" aria-labelledby="nda-paper-heading">
        <h2 id="nda-paper-heading" className="text-xl font-bold text-slate-900 sm:text-2xl">Choose your NDA paper</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {papers.map((paper) => {
            const copy = PAPER_COPY[paper.tab];
            return (
              <div key={paper.tab} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-slate-900">{copy.name}</h3>
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{paper.count} questions</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{copy.detail}</p>
                  {paper.subjects.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {paper.subjects.map((s) => (
                        <li key={s.slug}>
                          <Link href={`/pyqs/nda/${s.slug}`} className="inline-block rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50">
                            {s.subject} <span className="text-slate-500">({s.count})</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {paper.count > 0 ? (
                  <Link href={practiceHref(paper.tab)} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
                    Practise NDA {copy.name.split(" (")[0]} <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600">No eligible questions yet</span>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-slate-500">Counts reflect eligible questions in the Defence Pathshala library, not complete paper coverage.</p>
      </section>

      <section id="archive-years" className="mb-12 scroll-mt-24">
        <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-900 sm:text-2xl">
          <Calendar className="h-5 w-5 text-blue-600" />
          NDA PYQs by year
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {coverage.years.map((y) => (
            <Link key={y.year} href={`/pyqs/nda/${y.year}`} className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-500 hover:shadow-md">
              <span className="text-2xl font-black text-slate-900 group-hover:text-blue-600">{y.year}</span>
              <p className="mt-3 text-sm text-slate-600"><strong className="text-slate-900">{y.count}</strong> questions</p>
              <span className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-blue-600">
                View subjects <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <PyqEvidenceMatrix coverage={coverage} years={years} />

      <section className="mb-10 space-y-4" aria-labelledby="nda-archive-faq">
        <h2 id="nda-archive-faq" className="text-xl font-bold text-slate-900">NDA PYQ questions answered</h2>
        {faqs.map((f) => (
          <details key={f.q} className="rounded-xl border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer font-semibold">{f.q}</summary>
            <p className="mt-2 text-sm text-slate-600">{f.a}</p>
          </details>
        ))}
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          Built by Rohit Kumar, an IIT Kanpur alumnus, UPSC CAPF AC AIR 163 rank holder and four-time CDS written examination qualifier.
          Defence Pathshala is an independent learning platform, not affiliated with or endorsed by UPSC.
          {" "}<Link href="/about" className="font-semibold text-blue-700">About Defence Pathshala</Link>
        </p>
      </section>

      <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:flex-row sm:p-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900 sm:text-xl">Turn NDA PYQs into timed practice</h3>
          <p className="mt-1 text-sm text-slate-600">Practise by subject, or attempt a full NDA paper under exam conditions. Sign in when prompted to continue.</p>
        </div>
        <Link href={practiceHref("nda-maths")} className="shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500">
          Start NDA practice
        </Link>
      </div>
    </div>
  );
}
