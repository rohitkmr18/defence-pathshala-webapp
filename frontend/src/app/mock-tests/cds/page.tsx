import Link from "next/link";
import PublicNavbar from "@/components/public/PublicNavbar";
import { pageMetadata } from "@/lib/seo-metadata";
import { loadCdsPublicMocks } from "@/lib/public-mock-inventory";

export const dynamic = "force-dynamic";
export const metadata = {
  ...pageMetadata({
    title: "Free CDS Mock Test 2027 Online – CDS GK Full Mock",
    description: "Explore free CDS General Knowledge mock tests online, with 120 questions, 2 hours, UPSC-pattern scoring, explanations and subject-wise performance analysis.",
    path: "/mock-tests/cds",
    image: "/mock/cds-gk-banner.jpg",
    imageWidth: 1200,
    imageHeight: 675,
  }),
  robots: { index: process.env.VERCEL_ENV !== "preview", follow: true },
};

const faqs = [
  ["Where can I take a free CDS mock test online?", "Defence Pathshala provides free CDS GK full-length practice mocks. Check the published catalogue below and sign in to begin, resume or review an attempt."],
  ["What is the CDS GK mock test pattern?", "The CDS General Knowledge paper has 120 questions, 100 marks and a two-hour duration. The mock follows this paper format."],
  ["Is there negative marking in CDS GK?", "An incorrect answer costs one-third of the marks assigned to a question. Unanswered questions receive zero marks."],
  ["What can I review after a CDS mock?", "Review the score, subject-level performance, difficulty breakdown, answers and explanations to plan the next revision session."],
  ["Are English and Mathematics full mocks available here?", "This catalogue is for CDS General Knowledge. English and Mathematics PYQ practice is available separately; this page does not advertise unpublished full mocks."],
];

export default async function CdsMockSearchPage() {
  const tests = await loadCdsPublicMocks();
  return (
    <>
      <PublicNavbar />
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <section className="bg-slate-950 px-4 py-12 text-white sm:px-6 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <Link href="/mock-tests" className="text-sm font-semibold text-blue-300 hover:underline">All defence mock tests</Link>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Free CDS Mock Test 2027</h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-200">Attempt full-length CDS General Knowledge practice online. Simulate the UPSC paper pattern, review explanations and identify subjects that need revision.</p>
            <dl className="mt-6 grid max-w-xl grid-cols-3 gap-2 text-center">{[["120","Questions"],["120 min","Duration"],["100","Marks"]].map(([value,label]) => <div key={label} className="rounded-xl bg-white/10 p-3"><dt className="text-xs text-slate-300">{label}</dt><dd className="mt-1 text-xl font-black">{value}</dd></div>)}</dl>
            <a href="#cds-available-mocks" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-500">Explore free CDS GK mocks</a>
          </div>
        </section>
        <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6">
          <section id="cds-available-mocks" className="scroll-mt-24" aria-labelledby="cds-catalogue-title">
            <h2 id="cds-catalogue-title" className="text-2xl font-black">Available CDS GK full-length mock tests</h2>
            <p className="mt-2 text-sm text-slate-600">Published tests only. Sign in when you are ready to attempt a mock.</p>
            {tests === null ? <p className="mt-4 rounded-xl border bg-white p-4">The live catalogue is temporarily unavailable. Check the test player for availability.</p> : tests.length === 0 ? <p className="mt-4 rounded-xl border bg-white p-4">No CDS GK full mocks are currently published.</p> : <ul className="mt-5 grid gap-4 sm:grid-cols-2">{tests.map(test => <li key={test.id} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-bold text-emerald-700">Free published mock</p><h3 className="mt-2 text-xl font-bold">{test.title}</h3><p className="mt-3 text-sm text-slate-600">{test.expected_questions} questions · {Math.round(test.duration_seconds / 60)} min · {test.max_marks} marks</p><Link href="/mock/cds-gk" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-blue-700 px-4 py-2 font-bold text-white">Open CDS GK mock catalogue</Link></li>)}</ul>}
            {tests === null && <Link href="/mock/cds-gk" className="mt-3 inline-flex min-h-11 items-center font-bold text-blue-700 underline">Check live mock catalogue</Link>}
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-black">CDS GK mock test pattern and marking scheme</h2>
            <dl className="mt-4 divide-y divide-slate-100">{[["Paper","General Knowledge"],["Duration","2 hours"],["Questions","120"],["Maximum marks","100"],["Correct answer","100/120 marks"],["Incorrect answer","One-third of the marks assigned to the question deducted"],["Unanswered","0 marks"]].map(([label,value]) => <div key={label} className="grid grid-cols-2 gap-4 py-3 text-sm"><dt className="font-semibold">{label}</dt><dd>{value}</dd></div>)}</dl>
            <p className="mt-3 text-sm text-slate-600">Check the official <a href="https://upsc.gov.in/" className="font-semibold text-blue-700 underline">UPSC notification</a> for the applicable examination rules. DP mocks are independent practice, not official UPSC papers.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black">Attempt, analyse and revise</h2>
            <p className="mt-3 leading-7 text-slate-700">Take the timed mock without notes, examine incorrect answers and weak subjects, then revise using authentic previous-year questions before attempting again.</p>
            <div className="mt-4 flex flex-wrap gap-4"><Link href="/pyqs/cds" className="font-semibold text-blue-700 underline">CDS previous year questions</Link><Link href="/exams/cds" className="font-semibold text-blue-700 underline">CDS exam guide</Link><Link href="/about" className="font-semibold text-blue-700 underline">About our preparation methodology</Link></div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-black">Frequently asked questions</h2><dl className="mt-4 space-y-5">{faqs.map(([q,a]) => <div key={q}><dt className="font-bold">{q}</dt><dd className="mt-1 text-sm leading-6 text-slate-700">{a}</dd></div>)}</dl></section>
          <p className="text-sm text-slate-600">Defence Pathshala is an independent preparation initiative built by an IIT Kanpur alumnus, CAPF AC AIR 163 and four-time CDS written qualifier. <Link href="/about" className="font-semibold text-blue-700 underline">Meet the founder.</Link></p>
        </div>
      </main>
    </>
  );
}
