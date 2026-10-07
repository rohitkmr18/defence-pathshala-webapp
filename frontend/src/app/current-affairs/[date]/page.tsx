import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { getAdjacentDays, getCurrentAffairsByDate } from "@/lib/current-affairs";
import CurrentAffairsQuiz from "@/components/current-affairs/CurrentAffairsQuiz";
import CurrentAffairsEditionTracker from "@/components/current-affairs/CurrentAffairsEditionTracker";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> {
  const { date } = await params;
  const post = await getCurrentAffairsByDate(date);
  if (!post) return {};

  return {
    title: `${post.title} | Defence Pathshala`,
    description: post.summary || `Exam-focused current affairs for ${post.formattedDate} with structured key facts and daily MCQs.`,
    alternates: {
      canonical: `/current-affairs/${date}`,
    },
  };
}

export default async function CurrentAffairsDayPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const post = await getCurrentAffairsByDate(date);
  if (!post) notFound();

  const { prevDate, nextDate } = await getAdjacentDays(date);
  const questions = post.stories.flatMap((story) => story.mcqs).slice(0, 5);

  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <CurrentAffairsEditionTracker date={post.date} storyCount={post.storyCount} quizCount={questions.length} />
        <Link href="/current-affairs" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" /> All Current Affairs
        </Link>

        <header className="mt-6 rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-sm font-semibold text-blue-300">{post.formattedDate}</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">{post.title}</h1>
          {post.summary && <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{post.summary}</p>}
          <div className="mt-5 flex gap-3 text-xs font-semibold text-slate-300">
            <span>{post.storyCount} exam-worthy stories</span>
            <span>•</span>
            <span>{questions.length} daily MCQs</span>
          </div>
        </header>

        <div className="mt-8 space-y-5">
          {post.stories.map((story) => (
            <details key={story.id} className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm open:shadow-md sm:p-6">
              <summary className="cursor-pointer list-none">
                <div className="flex items-center justify-between gap-3">
                  {story.subject ? (
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">{story.subject}</span>
                  ) : <span />}
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                    DP Score {story.dpScore ?? "—"}/100
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-black leading-snug text-slate-950">{story.storyNumber}. {story.headline}</h2>
                {story.summary && <p className="mt-2 text-sm leading-6 text-slate-600">{story.summary}</p>}
                <div className="mt-4 flex justify-end border-t border-slate-100 pt-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 group-open:hidden">
                    Read more <ChevronDown className="h-3.5 w-3.5" />
                  </span>
                  <span className="hidden items-center gap-1 text-[11px] font-bold text-slate-500 group-open:inline-flex">
                    Read less <ChevronUp className="h-3.5 w-3.5" />
                  </span>
                </div>
              </summary>

              <div className="mt-4 space-y-5 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-700">
                {story.whatHappened && <section><h3 className="font-black text-slate-950">What happened?</h3><p className="mt-1">{story.whatHappened}</p></section>}
                {story.keyFacts.length > 0 && <section><h3 className="font-black text-slate-950">Key exam facts</h3><ul className="mt-2 space-y-2">{story.keyFacts.map((fact) => <li key={fact} className="flex gap-2"><span className="text-blue-600">•</span><span>{fact}</span></li>)}</ul></section>}
                {story.conceptualLinkage && <section className="rounded-2xl bg-blue-50 p-4"><h3 className="font-black text-blue-950">Conceptual linkage</h3><p className="mt-1 text-blue-900">{story.conceptualLinkage}</p></section>}
                {story.whyItMatters && <section><h3 className="font-black text-slate-950">Why it matters</h3><p className="mt-1">{story.whyItMatters}</p></section>}
                {story.examRelevance && <section><h3 className="font-black text-slate-950">Exam angle</h3><p className="mt-1">{story.examRelevance}</p></section>}
                {story.staticLink && <section><h3 className="font-black text-slate-950">Static link</h3><p className="mt-1">{story.staticLink}</p></section>}
                {story.sourceUrl && <a href={story.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-700 hover:underline">{story.sourceName || "Primary source"} <ExternalLink className="h-3.5 w-3.5" /></a>}
              </div>
            </details>
          ))}
        </div>

        {questions.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h2 className="text-2xl font-black text-slate-950">Test today’s Current Affairs</h2>
            </div>
            <CurrentAffairsQuiz questions={questions} editionDate={post.date} />
          </section>
        )}

        <nav className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
          {prevDate ? <Link href={`/current-affairs/${prevDate}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-700"><ArrowLeft className="h-4 w-4" />Previous</Link> : <span />}
          {nextDate ? <Link href={`/current-affairs/${nextDate}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">Next<ArrowRight className="h-4 w-4" /></Link> : <span />}
        </nav>
      </article>
    </main>
  );
}
