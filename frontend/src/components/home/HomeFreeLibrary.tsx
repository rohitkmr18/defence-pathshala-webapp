import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LibraryBookCard from "@/components/library/LibraryBookCard";
import { LIBRARY_BOOKS } from "@/lib/library/books";

export default function HomeFreeLibrary() {
  return (
    <section aria-labelledby="home-free-library" className="border-b border-slate-200 bg-slate-50 px-4 py-7 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Free Library</p>
        <h2 id="home-free-library" className="mt-1 text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl">Revision eBooks, free to read.</h2>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">Built from UPSC previous-year questions. Read online, then attempt the MCQs for an instant score card. No sign-in needed.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {LIBRARY_BOOKS.map((b) => <LibraryBookCard key={b.slug} book={b} />)}
        </div>
        <Link href="/library" className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-600">
          Browse the Free Library <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
