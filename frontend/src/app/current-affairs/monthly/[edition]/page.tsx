import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { isMonthlyEdition, monthlyEventContext } from "@/lib/monthly-current-affairs";
import { MonthlyAvailability, MonthlyView } from "@/components/current-affairs/MonthlyInteractions";

export async function generateMetadata({ params }: { params: Promise<{ edition: string }> }): Promise<Metadata> {
  const { edition } = await params;
  if (!isMonthlyEdition(edition)) return {};
  return { title: "October 2026 · Monthly Intelligence", description: "Preview Defence Pathshala’s ₹79 monthly current affairs learning experience. Full edition coming soon.", alternates: { canonical: "/current-affairs/monthly/2026-10" } };
}

export default async function MonthlyProduct({ params }: { params: Promise<{ edition: string }> }) {
  if (!isMonthlyEdition((await params).edition)) notFound();
  const context = await monthlyEventContext("monthly_product");
  return <div className="min-h-screen bg-white">
    <MonthlyView events={["monthly_ca_product_viewed"]} context={context} />
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-12">
      <Link href="/current-affairs/monthly" className="text-sm font-semibold text-blue-700">← Monthly editions</Link>
      <header className="mt-6 rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-yellow-300">October 2026 · Monthly Intelligence</p>
        <h1 className="mt-4 text-[28px] font-black leading-tight tracking-tight sm:text-4xl">Understand the news.<br />Recognise the exam question.</h1>
        <p className="mt-4 max-w-xl leading-7 text-slate-300">A focused monthly companion for CDS, CAPF-AC, NDA and AFCAT. Build concepts, test your understanding and connect developments to historical PYQs.</p>
        <Link href="/current-affairs/monthly/2026-10/sample" className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Try the free lesson <ArrowRight size={18} aria-hidden /></Link>
        <p className="mt-3 text-xs text-slate-300">No login needed for the lesson and sample MCQ.</p>
        <p className="mt-4 border-t border-slate-700 pt-3 text-sm font-semibold text-slate-200">₹79 / full edition · Coming soon</p>
      </header>
      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]">
        <div>
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Inside the free sample</p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">International Relations, in practice</h2>
            <p className="mt-3 leading-7 text-slate-600">Read the approved 14 October BIMSTEC lesson, work through an interactive MCQ with its explanation, then explore eligible linked CDS and CAPF PYQs.</p>
          </section>
          <section className="mt-8 border-t border-slate-200 pt-6">
            <h2 className="text-xl font-bold text-slate-950">Planned for the full edition</h2>
            <ul className="mt-4 space-y-4 text-sm leading-6 text-slate-700">
              {["Interactive monthly learning workspace", "Subject-wise lessons and practice MCQs", "Validated links to historical PYQs", "Bookmarks, revision and learning progress", "Downloadable monthly eBook"].map(feature => <li key={feature} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-blue-600" aria-hidden />{feature}</li>)}
            </ul>
            <p className="mt-4 text-sm leading-6 text-slate-500">These full-edition features are in preparation and are not included in this preview.</p>
          </section>
          <section className="mt-8 border-t border-slate-200 pt-6"><h2 className="font-bold text-slate-950">Sample PDF</h2><p className="mt-2 text-sm leading-6 text-slate-600">A validated sample PDF is not yet available. You can explore the interactive lesson now.</p></section>
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
