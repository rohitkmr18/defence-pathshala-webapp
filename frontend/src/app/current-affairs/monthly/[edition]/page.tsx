import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getMonthlySample, isMonthlyEdition, monthlyEventContext } from "@/lib/monthly-current-affairs";
import { MonthlyAvailability, MonthlyView } from "@/components/current-affairs/MonthlyInteractions";
import MonthlySampleDownload from "@/components/current-affairs/MonthlySampleDownload";
import MonthlyWorkspacePreview from "@/components/current-affairs/MonthlyWorkspacePreview";

export async function generateMetadata({ params }: { params: Promise<{ edition: string }> }): Promise<Metadata> {
  const { edition } = await params;
  if (!isMonthlyEdition(edition)) return {};
  return { title: "October 2026 · Monthly Intelligence", description: "Preview Defence Pathshala’s ₹79 monthly current affairs learning experience. Full edition coming soon.", alternates: { canonical: "/current-affairs/monthly/2026-10" } };
}

export default async function MonthlyProduct({ params }: { params: Promise<{ edition: string }> }) {
  if (!isMonthlyEdition((await params).edition)) notFound();
  const [context, sample] = await Promise.all([monthlyEventContext("monthly_product"), getMonthlySample()]);
  return <div className="min-h-screen bg-white">
    <MonthlyView events={["monthly_ca_product_viewed"]} context={context} />
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-12">
      <Link href="/current-affairs/monthly" className="text-sm font-semibold text-blue-700">← Monthly editions</Link>
      <header className="mt-5 rounded-2xl bg-slate-950 p-5 text-white sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-yellow-300">October 2026 · Monthly Intelligence</p>
        <h1 className="mt-3 text-[28px] font-black leading-tight tracking-tight sm:text-4xl">One month.<br />Connected exam preparation.</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">Subject-wise chapters, consolidated revision and monthly practice. Progress tracking and an included downloadable eBook in the planned ₹79 edition.</p>
        <p className="mt-3 text-xs font-semibold text-blue-200">CDS · CAPF-AC · NDA · AFCAT</p>
        <Link href="/current-affairs/monthly/2026-10/sample" className="mt-5 inline-flex min-h-12 items-center gap-3 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Try the free lesson <ArrowRight size={18} aria-hidden /></Link>
        <p className="mt-3 text-xs text-slate-300">No login needed for the lesson and sample MCQ.</p>
        <p className="mt-4 border-t border-slate-700 pt-3 text-sm font-semibold text-slate-200">₹79 / full edition · Coming soon</p>
      </header>
      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]">
        <div>
          <section aria-label="Daily and monthly comparison" className="grid gap-5 sm:grid-cols-2">
            <div><h2 className="font-bold text-slate-950">Free Daily Current Affairs</h2><p className="mt-2 text-sm leading-6 text-slate-600">Individual daily stories and quizzes. Read each day&apos;s developments and practise for free.</p></div>
            <div><h2 className="font-bold text-slate-950">₹79 Monthly Intelligence · Planned</h2><p className="mt-2 text-sm leading-6 text-slate-600">Subject-wise organisation, consolidated revision, monthly practice, progress tracking and an included downloadable eBook.</p></div>
          </section>
          <MonthlyWorkspacePreview story={sample?.story} />
          <section className="mt-8 border-t border-slate-200 pt-6"><h2 className="font-bold text-slate-950">Sample PDF</h2><p className="mt-2 text-sm leading-6 text-slate-600">An eight-page free sample of the approved BIMSTEC lesson, original MCQ and explanation. This is not the complete October edition.</p><MonthlySampleDownload context={context} /></section>
        </div>
        <aside className="self-start rounded-2xl border border-slate-200 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Full October edition</p>
          <p className="mt-3 text-4xl font-black text-slate-950">₹79</p>
          <p className="mt-2 text-sm text-slate-600">Planned price per edition</p>
          <p className="mt-5 rounded-lg bg-yellow-50 px-3 py-2 text-sm font-bold text-yellow-900">Coming soon · Not yet available</p>
          <MonthlyAvailability context={context} />
          <Link href="/current-affairs" className="mt-5 block text-sm font-semibold text-blue-700">Continue with free Daily Current Affairs →</Link>
        </aside>
      </div>
    </div>
  </div>;
}
