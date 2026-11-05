import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import MonthlyCapsuleReader from "@/components/current-affairs/MonthlyCapsuleReader";
import { MONTHLY_CAPSULES, capsulePageSrc, getMonthlyCapsule } from "@/lib/monthly-capsules";

export const dynamicParams = false;

export function generateStaticParams() {
  return MONTHLY_CAPSULES.map((c) => ({ edition: c.edition }));
}

export async function generateMetadata({ params }: { params: Promise<{ edition: string }> }): Promise<Metadata> {
  const { edition } = await params;
  const capsule = getMonthlyCapsule(edition);
  if (!capsule) return {};
  return {
    title: `${capsule.title}: Read Online for AFCAT, CDS, NDA, CAPF`,
    description: capsule.description,
    alternates: { canonical: `/current-affairs/monthly/${capsule.edition}` },
    openGraph: {
      type: "article",
      title: capsule.title,
      description: capsule.description,
      url: `https://www.defencepathshala.in/current-affairs/monthly/${capsule.edition}`,
      images: [{ url: capsulePageSrc(capsule.edition, 1), width: capsule.pageWidth, height: capsule.pageHeight, alt: capsule.title }],
    },
  };
}

export default async function MonthlyCapsulePage({ params }: { params: Promise<{ edition: string }> }) {
  const { edition } = await params;
  const capsule = getMonthlyCapsule(edition);
  if (!capsule) notFound();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <Link href="/current-affairs" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All Current Affairs
        </Link>

        <header className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Monthly Capsule</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{capsule.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{capsule.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {capsule.highlights.map((h) => (
              <li key={h} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{h}</li>
            ))}
          </ul>
          <p className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-slate-500">
            <BookOpen className="h-4 w-4" aria-hidden="true" /> Read online on Defence Pathshala. Use Contents to jump to any section.
          </p>
        </header>

        <div className="mt-6">
          <MonthlyCapsuleReader capsule={capsule} />
        </div>

        <nav aria-label="Sections in this capsule" className="mx-auto mt-10 max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-bold text-slate-950">In this capsule</h2>
          <ol className="mt-3 grid gap-x-6 gap-y-2 text-sm text-slate-700 sm:grid-cols-2">
            {capsule.sections.map((s) => (
              <li key={s.title} className="flex justify-between gap-3 border-b border-slate-100 py-1.5">
                <span>{s.title}</span>
                <span className="font-mono text-xs text-slate-500">p. {s.page}</span>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href={`/current-affairs/month/${capsule.edition}`} className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700">
              Daily editions for {capsule.label}
            </Link>
            <Link href="/current-affairs" className="inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700">
              Today&apos;s current affairs
            </Link>
          </div>
        </nav>
      </section>
    </main>
  );
}
