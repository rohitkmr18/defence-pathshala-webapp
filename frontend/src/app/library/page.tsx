import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Library } from "lucide-react";
import LibraryShelf from "@/components/library/LibraryShelf";
import { booksForExam } from "@/lib/library/books";
import { MONTHLY_CAPSULES, capsulePageSrc } from "@/lib/monthly-capsules";
import { SITE_URL, pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Free Revision eBooks for CDS, CAPF, NDA & AFCAT",
  description:
    "Free subject-wise revision eBooks for CDS, CAPF (AC), NDA and AFCAT — Polity and Biology mapped to UPSC previous-year questions, with practice MCQs and an instant score card. Read online, no sign-in.",
  path: "/library",
});

export default function LibraryPage() {
  const books = booksForExam(null);
  const capsules = [...MONTHLY_CAPSULES].sort((a, b) => (a.edition < b.edition ? 1 : -1));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Defence Pathshala Free Library",
    url: `${SITE_URL}/library`,
    isAccessibleForFree: true,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: books.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/library/${b.slug}`,
        name: b.title,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        <header>
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            <Library className="h-4 w-4" aria-hidden="true" /> Free Library
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Revision eBooks, free to read</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Subject-wise eBooks built from UPSC previous-year questions for CDS, CAPF (AC), NDA and AFCAT. Read online, then
            attempt the practice MCQs at the end for an instant score card and topic-wise analysis. No sign-in needed.
          </p>
        </header>

        <div className="mt-8">
          <h2 className="sr-only">Subject eBooks</h2>
          <LibraryShelf books={books} />
        </div>

        {capsules.length > 0 && (
          <section aria-labelledby="capsules-title" className="mt-12">
            <h2 id="capsules-title" className="text-lg font-black tracking-tight text-slate-950">Monthly current affairs capsules</h2>
            <p className="mt-1 text-sm text-slate-600">The whole month, subject-wise, with exam hooks and practice MCQs.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {capsules.map((c) => (
                <Link
                  key={c.edition}
                  href={`/current-affairs/monthly/${c.edition}`}
                  className="group flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- small static cover */}
                  <img src={capsulePageSrc(c.edition, 1)} alt="" width={72} height={102} loading="lazy" draggable={false}
                    className="h-[102px] w-[72px] shrink-0 rounded-md object-cover ring-1 ring-slate-200" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600">Monthly capsule</p>
                    <p className="mt-1 font-black text-slate-950">{c.label}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-blue-700">
                      Read online <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="mt-12 inline-flex items-center gap-2 text-xs font-medium text-slate-500">
          <BookOpen className="h-4 w-4" aria-hidden="true" /> eBooks are read online on Defence Pathshala and are for personal study.
        </p>
      </section>
    </main>
  );
}
