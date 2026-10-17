import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MONTHLY_EDITION, monthlyEventContext } from "@/lib/monthly-current-affairs";
import { MonthlyView } from "@/components/current-affairs/MonthlyInteractions";

export const metadata: Metadata = { title: "Monthly Current Affairs Intelligence", description: "Exam-oriented monthly learning for CDS, CAPF-AC, NDA and AFCAT. Explore the free interactive sample.", alternates: { canonical: "/current-affairs/monthly" } };

export default async function MonthlyCatalogue() {
  const context = await monthlyEventContext("monthly_catalogue");
  return <div className="min-h-screen bg-white">
    <MonthlyView events={["monthly_ca_product_viewed"]} context={context} />
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-12">
      <Link href="/current-affairs" className="text-sm font-semibold text-blue-700">← Free Daily Current Affairs</Link>
      <header className="mt-7 border-b border-slate-200 pb-7">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Defence Pathshala · Monthly Intelligence</p>
        <h1 className="mt-3 max-w-xl text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">A month of developments.<br />An exam-ready perspective.</h1>
        <p className="mt-4 max-w-xl leading-7 text-slate-600">Connect current events to static concepts, practise what matters and learn from real previous year questions.</p>
      </header>
      <article className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
        <div className="bg-slate-950 px-6 py-6 text-white sm:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-yellow-300">Free sample available</p>
          <h2 className="mt-3 text-2xl font-bold">{MONTHLY_EDITION.label}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">CDS · CAPF-AC · NDA · AFCAT</p>
        </div>
        <div className="p-6 sm:p-8">
          <p className="leading-7 text-slate-600">Preview an International Relations lesson on BIMSTEC, try its approved MCQ and follow linked historical PYQs.</p>
          <p className="mt-4 text-sm text-slate-600"><strong className="text-xl text-slate-950">₹79</strong> / full edition · Coming soon</p>
          <Link href="/current-affairs/monthly/2026-10" className="mt-5 inline-flex min-h-12 items-center gap-3 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">Explore October edition <ArrowRight size={18} aria-hidden /></Link>
        </div>
      </article>
      <p className="mt-6 text-sm leading-6 text-slate-500">Daily Current Affairs remains free. The monthly edition adds a planned learning and revision workspace.</p>
    </div>
  </div>;
}
