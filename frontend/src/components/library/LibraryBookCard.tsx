import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { libraryPageSrc, type LibraryBook } from "@/lib/library/books";

export default function LibraryBookCard({ book }: { book: LibraryBook }) {
  return (
    <Link
      href={`/library/${book.slug}`}
      className="group flex gap-4 overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md sm:gap-5 sm:p-5"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- small static cover */}
      <img
        src={libraryPageSrc(book.slug, 1)}
        alt=""
        width={108}
        height={153}
        loading="lazy"
        draggable={false}
        className="h-[153px] w-[108px] shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600">{book.subject} · Free eBook</p>
        <h3 className="mt-1 text-lg font-black tracking-tight text-slate-950 sm:text-xl">{book.title}</h3>
        <p className="mt-1.5 line-clamp-3 text-sm leading-6 text-slate-600">{book.description}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <ClipboardCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
          {book.mcqCount} MCQs with score card · For {book.exams.join(", ")}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-bold text-blue-700 group-hover:text-blue-600">
          Read free <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
