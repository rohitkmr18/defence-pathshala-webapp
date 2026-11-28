import Link from "next/link";
import PublicNavbar from "@/components/public/PublicNavbar";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = {
  ...pageMetadata({ title: "Free Defence Exam Mock Tests – CDS and AFCAT", description: "Explore free CDS GK and AFCAT full-length mock tests with timed practice and performance analysis. Find the right mock for your defence exam.", path: "/mock-tests" }),
  robots: { index: process.env.VERCEL_ENV !== "preview", follow: true },
};

export default function MockTestsHub() {
  return <><PublicNavbar /><main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 sm:px-6"><div className="mx-auto max-w-5xl">
    <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Free defence exam mock tests</h1>
    <p className="mt-4 max-w-2xl leading-7 text-slate-700">Choose your exam, explore currently published full-length mocks and use the post-test analysis to plan your revision.</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      <article className="rounded-2xl border bg-white p-6"><h2 className="text-2xl font-bold">CDS Mock Test</h2><p className="mt-3 text-slate-600">CDS General Knowledge: 120 questions, 100 marks, 2 hours.</p><Link href="/mock-tests/cds" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-blue-700 px-4 py-2 font-bold text-white">Explore CDS GK mocks</Link></article>
      <article className="rounded-2xl border bg-white p-6"><h2 className="text-2xl font-bold">AFCAT Mock Test</h2><p className="mt-3 text-slate-600">Full-length practice across English, General Awareness, Numerical Ability, and Reasoning &amp; Military Aptitude.</p><Link href="/afcat" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-blue-700 px-4 py-2 font-bold text-white">Explore AFCAT mocks</Link></article>
    </div>
    <section className="mt-10"><h2 className="text-xl font-black">Practice with previous year papers</h2><p className="mt-2 text-slate-700">For CDS and CAPF previous-year paper practice, explore the authentic PYQ archives or the existing full-paper practice mode.</p><div className="mt-3 flex flex-wrap gap-4"><Link href="/pyqs/cds" className="font-semibold text-blue-700 underline">CDS PYQs</Link><Link href="/pyqs/capf" className="font-semibold text-blue-700 underline">CAPF PYQs</Link><Link href="/dashboard/practice?paper=gs&amp;mode=full_paper" className="font-semibold text-blue-700 underline">Previous year full-paper practice</Link></div></section>
  </div></main></>;
}
