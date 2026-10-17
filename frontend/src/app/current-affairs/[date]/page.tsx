import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { getAdjacentDays, getCurrentAffairsByDate } from "@/lib/current-affairs";
import EditorialMarkdown from "@/components/current-affairs/EditorialMarkdown";
import { storyDisplayMarkdown } from "@/lib/current-affairs/story-display";
import StoryDisclosure from "@/components/current-affairs/StoryDisclosure";
import { readingMinutes, storyPreview, storyReadingText } from "@/lib/current-affairs/reading";
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
  const questions = post.stories.flatMap((story) => story.mcqs);
  const examTags = [...new Set(post.stories.flatMap(story => story.examTags))];
  const fullReading = readingMinutes([post.editorialMarkdown, ...post.stories.map(storyReadingText)].filter(Boolean).join(" "));
  const scanReading = readingMinutes(post.stories.map(story => `${story.headline} ${storyPreview(story)}`).join(" "));
  const revisionTakeaways = post.stories.slice(0, 5).map((story) => {
    const points = [
      ...story.keyFacts.slice(0, 3),
      story.examRelevance ? `Exam angle: ${story.examRelevance}` : null,
    ].filter((item): item is string => Boolean(item));

    return {
      title: story.headline,
      subject: story.subject,
      points: points.length > 0 ? points : [story.summary || "Revise the key development and its static linkage."],
    };
  });

  return (
    <div className="ca-edition min-h-screen bg-slate-50 [overflow-wrap:anywhere]">
      <article className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:py-8">
        <CurrentAffairsEditionTracker date={post.date} storyCount={post.stories.length} quizCount={questions.length} />
        <Link href="/current-affairs" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" /> All Current Affairs
        </Link>

        <header id="briefing" tabIndex={-1} className="mt-3 scroll-mt-24 rounded-2xl bg-slate-950 p-5 text-white sm:p-6">
          <p className="text-sm font-semibold text-blue-300">{post.formattedDate}</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Daily Current Affairs</h1>
          {examTags.length > 0 && <p className="mt-3 text-xs font-semibold text-blue-200">{examTags.join(" · ")}</p>}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-300">
            <span>{post.stories.length} stories</span><span>{questions.length} MCQs</span>
            <span>Briefing ~{scanReading} min · Full read ~{fullReading} min</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {post.stories.length > 0 && <Link href="#story-1" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"><BookOpen className="h-4 w-4" aria-hidden="true" />Start Reading</Link>}
            {questions.length > 0 && <Link href="#daily-quiz" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-600 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800">Daily Knowledge Check — {questions.length} MCQs</Link>}
          </div>
        </header>
        {post.sourceWarning && <p role="status" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">Some edition details are temporarily unavailable. The available story content is shown below.</p>}
        {post.stories.length === 0 && <p className="mt-6 rounded-xl bg-white p-5 text-slate-600">Story content is not available for this edition yet. Please check again later.</p>}

        <div className="mt-6 space-y-3" aria-label="Story briefing">
          {post.stories.map((story, index) => (
            <StoryDisclosure id={`story-${index + 1}`} key={story.id} preview={<>
                <div className="flex flex-wrap items-center gap-2">
                  {story.subject && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800">{story.subject}</span>}
                  {story.examTags.length > 0 && <span className="text-xs font-semibold text-slate-600">{story.examTags.join(" · ")}</span>}
                </div>
                <h2 className="mt-3 text-lg font-bold leading-snug text-slate-950 sm:text-xl">{story.headline}</h2>
                {storyPreview(story) && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{storyPreview(story)}</p>}
                {story.examRelevance && <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">Exam relevance: {story.examRelevance}</p>}
                <div className="mt-3 flex items-center justify-between gap-3 text-sm font-bold text-blue-700">
                  <span className="text-xs font-medium text-slate-500">Story {index + 1} of {post.stories.length}</span>
                  <span className="inline-flex items-center gap-1 group-open:hidden">Read story <ChevronDown className="h-4 w-4" aria-hidden="true" /></span>
                  <span className="hidden items-center gap-1 group-open:inline-flex">Close story <ChevronUp className="h-4 w-4" aria-hidden="true" /></span>
                </div>
              </>}>
              <div className="mx-auto min-w-0 max-w-[72ch] space-y-5 text-base leading-[1.75] text-slate-700">
                {story.editorialMarkdown && <EditorialMarkdown source={storyDisplayMarkdown(story.editorialMarkdown, story.linkedPyqIds)} anchorPrefix={`story-${index + 1}-`} />}
                {!story.editorialMarkdown && story.summary && <p className="whitespace-pre-wrap">{story.summary}</p>}
                {!story.editorialMarkdown && story.whatHappened && <section><h3 className="font-black text-slate-950">What happened?</h3><p className="mt-1 whitespace-pre-wrap">{story.whatHappened}</p></section>}
                {!story.editorialMarkdown && story.keyFacts.length > 0 && <section><h3 className="font-black text-slate-950">Key exam facts</h3><ul className="mt-2 space-y-2">{story.keyFacts.map((fact) => <li key={fact} className="flex gap-2"><span className="text-blue-600">•</span><span>{fact}</span></li>)}</ul></section>}
                {!story.editorialMarkdown && story.conceptualLinkage && <section><h3 className="font-black text-blue-950">Conceptual linkage</h3><p className="mt-1 whitespace-pre-wrap">{story.conceptualLinkage}</p></section>}
                {!story.editorialMarkdown && story.whyItMatters && <section><h3 className="font-black text-slate-950">Why it matters</h3><p className="mt-1 whitespace-pre-wrap">{story.whyItMatters}</p></section>}
                {!story.editorialMarkdown && story.examRelevance && <section><h3 className="font-black text-slate-950">Exam angle</h3><p className="mt-1 whitespace-pre-wrap">{story.examRelevance}</p></section>}
                {!story.editorialMarkdown && story.staticLink && <section><h3 className="font-black text-slate-950">Static link</h3><p className="mt-1 whitespace-pre-wrap">{story.staticLink}</p></section>}
                {!story.editorialMarkdown && story.futureAngle && <section><h3 className="font-black text-slate-950">Future question angles</h3><p className="whitespace-pre-wrap">{story.futureAngle}</p></section>}
                
                {story.linkedPyqIds.length > 0 && <section aria-label="Linked previous year questions" className="border-t border-slate-200 pt-5"><h3 className="font-black text-slate-950">Put this story into practice</h3><p className="mt-1 text-slate-500">Attempt the linked previous year questions.</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{story.linkedPyqIds.map(id => <Link key={id} href={`/pyq/${encodeURIComponent(id)}?edition=${post.date}`} className="flex min-h-16 items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 font-bold text-blue-900 hover:border-blue-300 focus-visible:outline-2 focus-visible:outline-blue-600"><span className="break-all">{id}<span className="mt-1 block text-xs font-medium text-blue-700">Attempt this PYQ</span></span><ArrowRight className="h-5 w-5 shrink-0" /></Link>)}</div></section>}
                {story.sourceDate && <p className="text-xs text-slate-500">Source date: {story.sourceDate}</p>}
                {story.sourceUrl && <a href={story.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 font-bold text-blue-700 underline underline-offset-4">{story.sourceName || "Primary source"} <ExternalLink className="h-3.5 w-3.5" /></a>}
                <nav aria-label={`After story ${index + 1}`} className="flex flex-wrap gap-3 border-t border-slate-100 pt-4 text-sm font-bold text-blue-700">
                  <Link href="#briefing" className="inline-flex min-h-11 items-center">Return to briefing</Link>
                  {questions.length > 0 && <Link href="#daily-quiz" className="inline-flex min-h-11 items-center">Take the daily quiz<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>}
                </nav>
              </div>
            </StoryDisclosure>
          ))}
        </div>

        {(post.title || post.summary || post.editorialMarkdown) && <details className="mt-4 rounded-2xl border border-slate-200 bg-white">
          <summary className="min-h-11 cursor-pointer px-4 py-3 text-sm font-bold text-slate-700"><h2 className="inline text-sm">Edition notes</h2></summary>
          <div className="border-t border-slate-100 p-4 sm:p-6">
            <p className="font-bold text-slate-950">{post.title}</p>
            {post.summary && <p className="mt-3 text-base leading-7 text-slate-700">{post.summary}</p>}
            {post.editorialMarkdown && <EditorialMarkdown source={post.editorialMarkdown} anchorPrefix="edition-notes-" />}
          </div>
        </details>}

        {questions.length > 0 && (
          <section id="daily-quiz" tabIndex={-1} aria-labelledby="quiz-heading" className="mt-8 scroll-mt-24">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h2 id="quiz-heading" className="text-xl font-bold text-slate-950">Daily Knowledge Check — {questions.length} MCQs</h2>
            </div>
            <CurrentAffairsQuiz
              questions={questions}
              editionDate={post.date}
              revisionTakeaways={revisionTakeaways}
            />
          </section>
        )}

        <nav aria-label="Edition navigation" className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
          {prevDate ? <Link href={`/current-affairs/${prevDate}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-slate-700"><ArrowLeft className="h-4 w-4" />Previous</Link> : <span />}
          <Link href="/current-affairs" className="inline-flex min-h-11 items-center text-sm font-bold text-blue-700">Archive</Link>
          {nextDate ? <Link href={`/current-affairs/${nextDate}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-slate-700">Next<ArrowRight className="h-4 w-4" /></Link> : <span />}
        </nav>
      </article>
    </div>
  );
}
