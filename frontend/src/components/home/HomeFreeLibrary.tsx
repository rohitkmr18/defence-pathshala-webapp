import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardCheck } from "lucide-react";
import { LIBRARY_BOOKS, libraryPageSrc } from "@/lib/library/books";

export default function HomeFreeLibrary() {
  const covers = LIBRARY_BOOKS.slice(0, 3);

  return (
    <section aria-labelledby="home-free-library" className="border-b border-slate-200 bg-slate-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-sm sm:px-7 sm:py-6">
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-blue-600">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> Free resources
            </p>
            <h2 id="home-free-library" className="mt-1.5 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
              Free eBook Library
            </h2>
            <p className="mt-2 max-w-md text-sm leading-5 text-slate-600">
              {LIBRARY_BOOKS.length} exam-focused revision eBooks with interactive MCQs and instant scorecards.
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <ClipboardCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              Read online · No sign-in needed
            </p>
            <Link
              href="/library"
              className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Browse Free Library <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="relative h-36 w-24 shrink-0 sm:h-44 sm:w-32" aria-hidden="true">
            {covers.map((book, index) => (
              // eslint-disable-next-line @next/next/no-img-element -- existing static library cover assets
              <img
                key={book.slug}
                src={libraryPageSrc(book.slug, 1)}
                alt=""
                width={100}
                height={142}
                loading="lazy"
                draggable={false}
                className="absolute left-1/2 top-1/2 h-28 w-20 rounded-md border border-white/70 object-cover shadow-lg ring-1 ring-slate-200 sm:h-36 sm:w-24"
                style={{
                  transform: `translate(-50%, -50%) translateX(${(index - 1) * 10}px) rotate(${(index - 1) * 10}deg)`,
                  zIndex: 3 - Math.abs(index - 1),
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
