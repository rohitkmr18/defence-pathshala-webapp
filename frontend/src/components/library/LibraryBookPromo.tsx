import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { bookForArchivePath, libraryPageSrc } from "@/lib/library/books";

/** Links a PYQ archive page to the free revision eBook for the same subject, when one exists. */
export default function LibraryBookPromo({ archivePath }: { archivePath: string }) {
  const book = bookForArchivePath(archivePath);
  if (!book) return null;
  return (
    <aside aria-label={`Free ${book.subject} revision eBook`} className="mb-10">
      <Link
        href={`/library/${book.slug}`}
        className="group flex items-center gap-4 rounded-2xl border border-blue-200 bg-blue-50/60 p-4 transition hover:border-blue-400 hover:bg-blue-50 sm:gap-5 sm:p-5"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- small static cover */}
        <img
          src={libraryPageSrc(book.slug, 1)}
          alt=""
          width={64}
          height={91}
          loading="lazy"
          draggable={false}
          className="h-[91px] w-[64px] shrink-0 rounded-md object-cover ring-1 ring-slate-200"
        />
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> Free revision eBook
          </p>
          <p className="mt-1 font-black text-slate-950">
            {book.title}: {book.subject} notes built from these PYQs
          </p>
          <p className="mt-0.5 text-sm text-slate-600">
            Read online, no sign-in · {book.mcqCount} practice MCQs with a score card
          </p>
          <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-blue-700">
            Read {book.title} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </aside>
  );
}
