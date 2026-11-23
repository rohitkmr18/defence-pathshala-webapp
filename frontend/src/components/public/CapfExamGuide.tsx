import Link from "next/link";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import { ArrowRight } from "lucide-react";

const notice = "https://upsc.gov.in/uploads/2026/07/ExamNotifi_CAPF_AC_Exam_2026_Eng_20022026.pdf";
const calendar = "https://www.upsc.gov.in/examination-calendar/";
const sections = [
  ["overview", "Overview"], ["eligibility", "Eligibility"], ["pattern", "Exam pattern"],
  ["syllabus", "Syllabus"], ["physical", "PST & PET"], ["selection", "Selection"],
  ["preparation", "Preparation"], ["faq", "FAQs"], ["sources", "Official sources"],
] as const;
const forces = [
  { name: "BSF", long: "Border Security Force" },
  { name: "CRPF", long: "Central Reserve Police Force" },
  { name: "CISF", long: "Central Industrial Security Force" },
  { name: "ITBP", long: "Indo-Tibetan Border Police" },
  { name: "SSB", long: "Sashastra Seema Bal" },
];
const paperOne = [
  ["General Mental Ability", "Reasoning, quantitative aptitude, numerical ability and data interpretation"],
  ["General Science", "Scientific awareness, everyday phenomena, technology and environmental science"],
  ["Current Events", "National and international developments across governance, society, culture, economy and more"],
  ["Indian Polity & Economy", "Constitution, public administration, economic development, security and human rights"],
  ["History of India", "Social, economic and political history, nationalism and the freedom movement"],
  ["Indian & World Geography", "Physical, social and economic geography"],
];
const pet = [
  ["100 m race", "16 seconds", "18 seconds"],
  ["800 m race", "3 min 45 sec", "4 min 45 sec"],
  ["Long jump", "3.5 m (3 attempts)", "3.0 m (3 attempts)"],
  ["Shot put (7.26 kg)", "4.5 m (3 attempts)", "Not applicable"],
];
const faqs = [
  { q: "Who can apply for CAPF Assistant Commandants?", a: "Both men and women can apply, subject to the notification's age, nationality, degree, physical and medical eligibility requirements." },
  { q: "What is the CAPF AC age limit?", a: "For CAPF AC 2026, the general age requirement was 20 to below 25 years on 1 August 2026 (born from 2 August 2001 through 1 August 2006). Relaxations apply to specified categories. This is not a 2027 eligibility range." },
  { q: "Is Paper II written entirely in English?", a: "No. Part A essays may be written in Hindi or English. Part B comprehension, précis, communication and language skills must be attempted in English." },
  { q: "Is a fitness test part of CAPF AC recruitment?", a: "Yes. Candidates qualifying the written examination must meet the applicable Physical Standards Tests and Physical Efficiency Tests requirements, followed by interview and medical assessment under the notified sequence." },
  { q: "Does an NCC certificate guarantee selection?", a: "No. NCC B or C certification is a desirable qualification considered at the interview stage, not a substitute for meeting recruitment requirements." },
];
const faqSchema = faqs.map(({ q, a }) => ({
  "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a },
}));
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebPage", "@id": "https://www.defencepathshala.in/exams/capf#webpage",
      url: "https://www.defencepathshala.in/exams/capf",
      name: "CAPF AC Exam Guide: Eligibility, Syllabus, Pattern & PET",
      description: "UPSC CAPF Assistant Commandants exam guide based on the official 2026 notice, covering eligibility, papers, syllabus, PET and selection.",
      citation: [notice, calendar],
      about: { "@type": "Thing", name: "UPSC Central Armed Police Forces (Assistant Commandants) Examination" } },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.defencepathshala.in/" },
      { "@type": "ListItem", position: 2, name: "Examinations", item: "https://www.defencepathshala.in/exams" },
      { "@type": "ListItem", position: 3, name: "CAPF AC", item: "https://www.defencepathshala.in/exams/capf" },
    ] },
    { "@type": "FAQPage", mainEntity: faqSchema },
  ],
};

export default function CapfExamGuide() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Examinations", href: "/exams" }, { label: "CAPF AC" }]} />
      <div className="mb-8 max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">UPSC examination guide</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">CAPF Assistant Commandants Exam Guide</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">Eligibility, written papers, syllabus, physical tests and selection process — based on the UPSC CAPF AC 2026 notification.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/pyqs/capf" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">Explore CAPF PYQs <ArrowRight className="h-4 w-4" /></Link>
          <Link href="/dashboard/practice?exam=CAPF-AC" className="rounded-xl border border-blue-200 px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50">Start practice</Link>
        </div>
      </div>
      <nav aria-label="CAPF guide sections" className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="mb-3 text-sm font-bold text-slate-900">On this page</p>
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-blue-700">
          {sections.map(([id, label]) => <a key={id} href={`#${id}`} className="rounded py-1 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">{label}</a>)}
        </div>
      </nav>
      <div className="space-y-10">
        <section id="overview" aria-labelledby="capf-overview" className="scroll-mt-24">
          <h2 id="capf-overview" className="text-2xl font-bold text-slate-900">What is UPSC CAPF AC?</h2>
          <p className="mt-3 max-w-4xl leading-7 text-slate-700">UPSC conducts the Central Armed Police Forces (Assistant Commandants) examination for Group A Assistant Commandant recruitment in five participating forces.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {forces.map(f => <div key={f.name} className="rounded-xl border border-slate-200 bg-white p-4"><h3 className="font-bold text-blue-700">{f.name}</h3><p className="mt-1 text-sm text-slate-600">{f.long}</p></div>)}
          </div>
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>Important:</strong> The age cutoff, eligibility examples and examination rules on this page refer to CAPF AC 2026 (notice dated 20 February 2026). The next-cycle notification supersedes them. This is not an active application notice.</p>
        </section>
        <section id="eligibility" aria-labelledby="capf-eligibility" className="scroll-mt-24">
          <h2 id="capf-eligibility" className="text-2xl font-bold text-slate-900">CAPF AC eligibility</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">CAPF AC 2026 basic eligibility conditions</caption>
              <thead className="bg-slate-100"><tr><th scope="col" className="p-4">Condition</th><th scope="col" className="p-4">UPSC CAPF AC 2026 rule</th></tr></thead>
              <tbody className="text-slate-700">
                {[
                  ["Gender", "Both men and women may apply"],
                  ["Age", "20 years attained, but not 25 years attained, on 1 August 2026"],
                  ["Date of birth", "2 August 2001 to 1 August 2006 inclusive (general range, 2026 only)"],
                  ["Education", "Bachelor’s degree from a recognised university or equivalent qualification"],
                  ["Final-year students", "Permitted subject to production of degree/passing proof within the notification's deadlines"],
                  ["Nationality", "Refer to the special conditions under Section 4(I) of the official notice"],
                ].map(([k,v])=><tr key={k} className="border-t border-slate-200 align-top"><th scope="row" className="p-4 font-semibold text-slate-900">{k}</th><td className="p-4">{v}</td></tr>)}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-700">2026 upper-age relaxations included up to five years for SC/ST, three years for eligible OBC, and specified concessions for civilian Central Government servants and ex-servicemen. Cumulative and documentary conditions apply; see the official notice. Candidates selected earlier as Assistant Commandants in a participating CAPF face a reappearance restriction.</p>
        </section>
        <section id="pattern" aria-labelledby="capf-pattern" className="scroll-mt-24">
          <h2 id="capf-pattern" className="text-2xl font-bold text-slate-900">Written examination pattern</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-5"><h3 className="text-lg font-bold text-slate-900">Paper I — General Ability & Intelligence</h3><p className="mt-2 text-2xl font-bold text-blue-700">250 marks · 2 hours</p><p className="mt-2 text-sm leading-6 text-slate-600">Objective questions set in English and Hindi. Penalty for wrong answers as stated in UPSC's instructions.</p></div>
            <div className="rounded-xl border border-slate-200 p-5"><h3 className="text-lg font-bold text-slate-900">Paper II — General Studies, Essay & Comprehension</h3><p className="mt-2 text-2xl font-bold text-blue-700">200 marks · 3 hours</p><p className="mt-2 text-sm leading-6 text-slate-600">Part A: essay, 80 marks (Hindi or English). Part B: comprehension, précis and language skills, 120 marks (English only).</p></div>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">UPSC fixes separate qualifying marks for each paper. Paper II is evaluated only for candidates who clear the qualifying threshold in Paper I. The written total is 450 marks and the interview carries 150 marks.</p>
        </section>
        <section id="syllabus" aria-labelledby="capf-syllabus" className="scroll-mt-24">
          <h2 id="capf-syllabus" className="text-2xl font-bold text-slate-900">CAPF AC syllabus</h2>
          <h3 className="mt-4 text-lg font-bold text-slate-900">Paper I</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">{paperOne.map(([name,desc])=><div key={name} className="rounded-xl border border-slate-200 p-4"><h4 className="font-bold text-slate-900">{name}</h4><p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p></div>)}</div>
          <h3 className="mt-5 text-lg font-bold text-slate-900">Paper II</h3>
          <p className="mt-2 text-sm leading-7 text-slate-700"><strong>Part A (80 marks):</strong> Essays on modern Indian history, freedom struggle, geography, polity, economy, security, human rights and analytical issues. <strong>Part B (120 marks):</strong> English comprehension, précis writing, counterarguments, grammar and communication skills. Refer to Appendix I of the notice for the exact syllabus wording.</p>
        </section>
        <section id="physical" aria-labelledby="capf-physical" className="scroll-mt-24">
          <h2 id="capf-physical" className="text-2xl font-bold text-slate-900">Physical standards and PET</h2>
          <h3 className="mt-4 font-bold text-slate-900">Minimum physical measurements (2026)</h3>
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[460px] text-left text-sm"><caption className="sr-only">CAPF 2026 physical standards</caption><thead className="bg-slate-100"><tr>{["Standard","Men","Women"].map(x=><th key={x} scope="col" className="p-4">{x}</th>)}</tr></thead>
            <tbody>{[["Height","165 cm","157 cm"],["Chest","81 cm unexpanded; 5 cm expansion","Not applicable"],["Weight","50 kg minimum","46 kg minimum"]].map(r=><tr key={r[0]} className="border-t border-slate-200">{r.map((v,i)=>i===0?<th key={i} scope="row" className="p-4 font-semibold">{v}</th>:<td key={i} className="p-4">{v}</td>)}</tr>)}</tbody></table>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-600">Weight must additionally comply with height-and-age standards; these basic minimums do not by themselves establish fitness.</p>
          <h3 className="mt-6 font-bold text-slate-900">Physical Efficiency Test (2026)</h3>
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[480px] text-left text-sm"><caption className="sr-only">CAPF 2026 physical efficiency tests</caption><thead className="bg-slate-100"><tr>{["Event","Men","Women"].map(x=><th key={x} scope="col" className="p-4">{x}</th>)}</tr></thead><tbody>{pet.map(r=><tr key={r[0]} className="border-t border-slate-200">{r.map((v,i)=>i===0?<th key={i} scope="row" className="p-4 font-semibold">{v}</th>:<td key={i} className="p-4">{v}</td>)}</tr>)}</tbody></table></div>
          <p className="mt-3 text-sm leading-6 text-slate-700">Physical and medical fitness are governed by the full Appendix V, including eyesight and other medical requirements. The figures above are for informational preparation, not personal medical clearance.</p>
        </section>
        <section id="selection" aria-labelledby="capf-selection" className="scroll-mt-24">
          <h2 id="capf-selection" className="text-2xl font-bold text-slate-900">Selection process</h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{[
            "Written examination (450 marks)",
            "Physical Standards Test and Physical Efficiency Test",
            "Interview / Personality Test (150 marks)",
            "Medical Standards Test",
            "Final merit from written + interview marks, subject to fitness and eligibility",
          ].map((v,i)=><li key={v} className="rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-700"><span className="mb-2 block text-lg font-extrabold text-blue-700">{String(i+1).padStart(2,"0")}</span>{v}</li>)}</ol>
          <p className="mt-3 text-sm leading-6 text-slate-600">In the 2026 scheme, medical standards tests are conducted for candidates who appeared in the interview. Meeting written cutoffs alone does not guarantee appointment.</p>
        </section>
        <section id="preparation" aria-labelledby="capf-preparation" className="scroll-mt-24">
          <h2 id="capf-preparation" className="text-2xl font-bold text-slate-900">How to prepare</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-700">Prepare Paper I through syllabus-based study and authentic PYQ analysis. Give Paper II equal attention: practise timed essays, structured arguments, précis and comprehension. Build fitness gradually and assess the physical and medical requirements before committing to the process.</p>
          <div className="mt-4 flex flex-wrap gap-3"><Link href="/pyqs/capf" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">Explore CAPF PYQs</Link><Link href="/dashboard/practice?exam=CAPF-AC" className="rounded-xl border border-blue-200 px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50">Practice questions</Link></div>
        </section>
        <section id="faq" aria-labelledby="capf-faq" className="scroll-mt-24">
          <h2 id="capf-faq" className="text-2xl font-bold text-slate-900">Frequently asked questions</h2>
          <div className="mt-4 space-y-3">{faqs.map(f=><details key={f.q} className="rounded-xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer font-semibold text-slate-900">{f.q}</summary><p className="mt-3 text-sm leading-6 text-slate-700">{f.a}</p></details>)}</div>
        </section>
        <section id="sources" aria-labelledby="capf-sources" className="scroll-mt-24 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h2 id="capf-sources" className="text-xl font-bold text-slate-900">Official UPSC sources</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-blue-700">
            <li><a href={notice} target="_blank" rel="noopener noreferrer" className="underline">CAPF AC Examination 2026 official notification (20 February 2026)</a></li>
            <li><a href={calendar} target="_blank" rel="noopener noreferrer" className="underline">UPSC examination calendar</a></li>
            <li><a href="https://www.upsc.gov.in/examinations/previous-question-papers" target="_blank" rel="noopener noreferrer" className="underline">UPSC previous question papers</a></li>
          </ul>
          <p className="mt-3 text-xs leading-5 text-slate-600">Prepared with reference to the official 2026 UPSC notification on 23 November 2026. Recheck the latest notification before applying.</p>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    </main>
  );
}
