import Link from "next/link";
import { FileText, PenLine, Scale } from "lucide-react";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import CapfPaper2Browser from "@/components/public/CapfPaper2Browser";
import { CAPF_P2_PATH, CAPF_P2_SOURCE_URL, CAPF_P2_YEARS, capfP2Stats, capfP2ThemeCounts } from "@/lib/capf-paper2-pyqs";

const base = "https://www.defencepathshala.in";

export default function CapfPaper2Archive() {
  const stats = capfP2Stats();
  const themeCounts = capfP2ThemeCounts();
  const range = `${stats.firstYear}–${stats.lastYear}`;

  const faqs = [
    {
      q: "What is asked in Q1 and Q2 of CAPF AC Paper II?",
      a: "Q1 asks for essays on any four of six topics in about 300 words each (20 marks each, 80 marks). Q2 asks for arguments for and against each of two statements (20 marks each, 40 marks). Together they carry 120 of Paper II's 200 marks.",
    },
    {
      q: "Can I write the CAPF essay in Hindi?",
      a: "Yes. Q1 is printed in Hindi and English and may be answered in either, in the medium you chose in the application. All other questions, including Q2, are printed in English and must be answered in English.",
    },
    {
      q: "Is there a word limit for the Q2 arguments?",
      a: `No. In every paper from ${range}, UPSC states about 300 words for each Q1 essay but gives no word limit for Q2. Plan to cover both sides of each statement within your time.`,
    },
    {
      q: "Where are these questions taken from?",
      a: `From the official UPSC question papers for the CAPF (ACs) Examination ${range}, published under Previous Exam Details on upsc.gov.in. The wording is reproduced as printed. The theme tags are Defence Pathshala's own classification.`,
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage", "@id": `${base}${CAPF_P2_PATH}#webpage`, url: `${base}${CAPF_P2_PATH}`,
        name: `CAPF AC Paper II Essay and Argument PYQs (${range})`,
        about: { "@type": "Thing", name: "UPSC Central Armed Police Forces (Assistant Commandants) Examination, Paper II" },
        isPartOf: { "@id": `${base}/#website` },
      },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: "CAPF AC PYQs", item: `${base}/pyqs/capf` },
        { "@type": "ListItem", position: 3, name: "Paper II Essays & Arguments", item: `${base}${CAPF_P2_PATH}` },
      ] },
      { "@type": "FAQPage", mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <Breadcrumbs items={[{ label: "CAPF AC PYQs", href: "/pyqs/capf" }, { label: "Paper II · Essays & Arguments" }]} />

      <header className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
          <FileText className="h-3.5 w-3.5" /> Official UPSC papers · {range}
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">CAPF AC Paper II – Essay & Argument PYQs</h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
          Every Q1 essay topic and Q2 for-and-against statement from CAPF (AC) Paper II, {range}, exactly as UPSC printed them.
          Filter by question or theme, switch on Hindi for the essays, or pick a random topic to practise with.
        </p>
      </header>

      <section aria-label="Paper II at a glance" className="mb-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-3xl font-black text-slate-900">{stats.total}</p>
          <p className="mt-1 text-sm text-slate-600">{stats.essays} essay topics + {stats.arguments} argument statements from {stats.years} papers</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-bold text-blue-700"><PenLine className="h-4 w-4" /> Q1 · Essay · 80 marks</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Any 4 of 6 topics, about 300 words each, 20 marks each. Hindi or English.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-bold text-amber-800"><Scale className="h-4 w-4" /> Q2 · Arguments · 40 marks</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">For and against both statements, 20 marks each. English only; no word limit stated.</p>
        </div>
      </section>

      <section aria-labelledby="capf-p2-themes" className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 id="capf-p2-themes" className="text-lg font-bold text-slate-900">What UPSC keeps coming back to</h2>
        <p className="mt-1 text-xs text-slate-500">Topics per theme across Q1 and Q2, {range}. Themes are Defence Pathshala&apos;s classification.</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {themeCounts.map((t) => (
            <li key={t.theme} className="flex items-center gap-3">
              <span className="w-44 shrink-0 text-sm text-slate-700">{t.theme}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                <span className="block h-full rounded-full bg-blue-600" style={{ width: `${(t.total / themeCounts[0].total) * 100}%` }} />
              </span>
              <span className="w-8 text-right text-sm font-bold text-slate-900">{t.total}</span>
            </li>
          ))}
        </ul>
      </section>

      <nav aria-label="Jump to year" className="mb-6 flex flex-wrap gap-2">
        {CAPF_P2_YEARS.map((y) => (
          <a key={y.year} href={`#year-${y.year}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">{y.year}</a>
        ))}
      </nav>

      <CapfPaper2Browser years={CAPF_P2_YEARS} themes={themeCounts.map((t) => t.theme)} />

      <section aria-labelledby="capf-p2-faq" className="mt-12">
        <h2 id="capf-p2-faq" className="text-xl font-bold text-slate-900">Frequently asked questions</h2>
        <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group p-5">
              <summary className="cursor-pointer list-none font-semibold text-slate-900">{q}</summary>
              <p className="mt-2 text-sm leading-6 text-slate-600">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="mt-8 space-y-2 text-xs leading-5 text-slate-500">
        <p>
          Source: UPSC question papers, General Studies, Essay and Comprehension, Central Armed Police Forces (ACs) Examination {range},{" "}
          <a href={CAPF_P2_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="underline">upsc.gov.in · Previous Exam Details</a>.
          Q3–Q6 (reports, précis, comprehension and language) are not included yet.
        </p>
        <p>
          Preparing Paper I? <Link href="/pyqs/capf" className="font-semibold text-blue-700">Browse CAPF AC Paper I PYQs</Link> ·{" "}
          <Link href="/exams/capf" className="font-semibold text-blue-700">Read the CAPF AC exam guide</Link>
        </p>
      </footer>
    </div>
  );
}
