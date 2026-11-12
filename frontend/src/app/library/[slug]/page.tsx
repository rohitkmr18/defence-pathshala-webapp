import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, ClipboardCheck } from "lucide-react";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import EbookPageReader from "@/components/library/EbookPageReader";
import LibraryQuiz from "@/components/library/LibraryQuiz";
import { LIBRARY_BOOKS, LIBRARY_QUIZ_ANCHOR, getLibraryBook, libraryOgSrc, libraryPageBase } from "@/lib/library/books";
import { LIBRARY_HOTSPOTS } from "@/lib/library/hotspots";
import { getLibraryQuiz } from "@/lib/library/quizzes";
import { LIBRARY_AUTHOR, libraryBookJsonLd, libraryFaqs, listExams } from "@/lib/library/seo";
import { SITE_URL, pageMetadata } from "@/lib/seo-metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return LIBRARY_BOOKS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = getLibraryBook(slug);
  if (!book) return {};
  return pageMetadata({
    title: book.seoTitle,
    description: book.seoDescription,
    path: `/library/${book.slug}`,
    type: "article",
    image: `${SITE_URL}${libraryOgSrc(book.slug)}`,
    imageAlt: `${book.title} cover`,
    imageWidth: 1200,
    imageHeight: 630,
  });
}

export default async function LibraryBookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = getLibraryBook(slug);
  const quiz = getLibraryQuiz(slug);
  if (!book || !quiz) notFound();

  const chapters = book.sections.filter((s) => s.page > 0 && s.page !== book.contentsPage);
  const faqs = libraryFaqs(book);
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Free Library", item: `${SITE_URL}/library` },
      { "@type": "ListItem", position: 3, name: book.title, item: `${SITE_URL}/library/${book.slug}` },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbLd, ...libraryBookJsonLd(book)]) }} />
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <Breadcrumbs items={[{ label: "Free Library", href: "/library" }, { label: book.title }]} />

        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">{book.kicker} · Free</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{book.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{book.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {book.highlights.map((h) => (
              <li key={h} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{h}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs font-semibold text-slate-500">For {book.exams.join(" · ")} · {book.edition} · By {LIBRARY_AUTHOR}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href={`#page-1`} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-500">
              <BookOpen className="h-4 w-4" aria-hidden="true" /> Start reading
            </a>
            <a href={`#${LIBRARY_QUIZ_ANCHOR}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700">
              <ClipboardCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" /> Jump to {book.mcqCount} MCQs
            </a>
          </div>
        </header>

        <div className="mt-8">
          <EbookPageReader
            title={book.title}
            srcBase={libraryPageBase(book.slug)}
            pages={book.readerPages}
            pageWidth={book.pageWidth}
            pageHeight={book.pageHeight}
            sections={book.sections}
            hotspots={LIBRARY_HOTSPOTS[book.slug] ?? []}
            eventPrefix="library_book"
            eventKey="book"
            eventId={book.slug}
            anchorTarget={LIBRARY_QUIZ_ANCHOR}
            pageAnchors
          />
        </div>

        <LibraryQuiz
          quiz={quiz}
          bookTitle={book.title}
          pyqCount={book.pyqCount}
          practice={book.practice}
          anchorId={LIBRARY_QUIZ_ANCHOR}
        />

        <nav aria-label="Keep practising" className="mx-auto mt-10 max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-bold text-slate-950">Keep practising {book.subject}</h2>
          <p className="mt-1 text-sm text-slate-600">Real UPSC previous-year questions with explanations, topic by topic.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={book.practice.href} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-500">
              {book.practice.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            {book.archives.map((a) => (
              <Link key={a.href} href={a.href} className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700">
                {a.label}
              </Link>
            ))}
            <Link href="/library" className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700">
              All free eBooks
            </Link>
          </div>
        </nav>

        <section aria-labelledby="inside-title" className="mx-auto mt-10 max-w-3xl">
          <h2 id="inside-title" className="text-lg font-black tracking-tight text-slate-950">What&rsquo;s inside {book.title}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {`${book.subject} notes for ${listExams(book)} in ${book.pageCount} pages, ending with ${book.mcqCount} practice MCQs.`}
          </p>
          <ol className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
            {chapters.map((s) => (
              <li key={s.title}>
                <a href={`#page-${s.page}`} className="flex items-baseline justify-between gap-4 px-4 py-3 hover:bg-blue-50/40">
                  <span>
                    <span className="block text-sm font-bold text-slate-900">{s.title}</span>
                    {s.detail && <span className="block text-xs leading-5 text-slate-600">{s.detail}</span>}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-slate-400">p. {s.page}</span>
                </a>
              </li>
            ))}
            <li>
              <a href={`#${LIBRARY_QUIZ_ANCHOR}`} className="flex items-baseline justify-between gap-4 px-4 py-3 hover:bg-blue-50/40">
                <span className="block text-sm font-bold text-slate-900">{book.mcqCount} practice MCQs with score card</span>
                <span className="shrink-0 text-xs font-semibold text-slate-400">online</span>
              </a>
            </li>
          </ol>
        </section>

        <section aria-labelledby="faq-title" className="mx-auto mt-10 max-w-3xl">
          <h2 id="faq-title" className="text-lg font-black tracking-tight text-slate-950">Questions about {book.title}</h2>
          <div className="mt-4 space-y-2">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <summary className="cursor-pointer list-none text-sm font-bold text-slate-900">{f.q}</summary>
                <p className="mt-2 text-sm leading-6 text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
