import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditorialMarkdown from "@/components/current-affairs/EditorialMarkdown";
import CurrentAffairsQuiz from "@/components/current-affairs/CurrentAffairsQuiz";
import { MonthlyLink, MonthlyReadingProgress, MonthlyView } from "@/components/current-affairs/MonthlyInteractions";
import { getMonthlySample, isMonthlyEdition, MONTHLY_EDITION, monthlyEventContext } from "@/lib/monthly-current-affairs";
import { storyDisplayMarkdown } from "@/lib/current-affairs/story-display";

export async function generateMetadata({ params }: { params: Promise<{ edition: string }> }): Promise<Metadata> {
  if (!isMonthlyEdition((await params).edition)) return {};
  return { title: "Free BIMSTEC lesson · October Monthly Intelligence", description: "Read the approved BIMSTEC lesson and try its interactive practice MCQ.", alternates: { canonical: "/current-affairs/monthly/2026-10/sample" } };
}

export default async function MonthlySample({ params }: { params: Promise<{ edition: string }> }) {
  if (!isMonthlyEdition((await params).edition)) notFound();
  const [sample, baseContext] = await Promise.all([getMonthlySample(), monthlyEventContext("monthly_sample")]);
  const context = { ...baseContext, content_id: MONTHLY_EDITION.storyId, edition_date: MONTHLY_EDITION.date };
  if (!sample) return <div className="mx-auto max-w-3xl px-4 py-10"><Link href="/current-affairs/monthly/2026-10" className="text-blue-700">← October edition</Link><h1 className="mt-6 text-2xl font-bold">Sample temporarily unavailable</h1><p className="mt-3 text-slate-600">The approved lesson could not be loaded. Please try again shortly.</p></div>;
  const { story, questions, pyqs } = sample;
  return <div className="min-h-screen bg-white">
    <MonthlyView events={["monthly_ca_sample_opened", "monthly_ca_sample_story_viewed"]} context={context} />
    <MonthlyReadingProgress />
    <div className="mx-auto max-w-3xl px-4 py-7 sm:px-8">
      <Link href="/current-affairs/monthly/2026-10" className="text-sm font-semibold text-blue-700">← October Monthly Intelligence</Link>
      <header className="mt-6 border-b border-slate-200 pb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Free sample · Lesson 01</p>
        <p className="mt-3 text-sm font-semibold text-slate-600">{story.subject} · 14 October 2026</p>
        <h1 className="mt-3 text-2xl font-black leading-snug tracking-tight text-slate-950 sm:text-3xl">{story.headline}</h1>
        <p className="mt-3 text-xs leading-6 text-slate-500">{story.examTags.join(" · ")} · DP Score {story.dpScore ?? "—"}/100</p>
        <nav aria-label="Sample lesson navigation" className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-blue-700">
          <a href="#lesson" className="rounded-lg border border-slate-200 px-3 py-3">Read lesson</a>
          <a href="#practice" className="rounded-lg border border-blue-600 bg-blue-600 px-3 py-3 text-white">Try the MCQ</a>
          <a href="#linked-pyqs" className="rounded-lg border border-slate-200 px-3 py-3">Linked PYQs</a>
        </nav>
      </header>
      <article id="lesson" aria-label="Approved BIMSTEC lesson" className="scroll-mt-32 py-4" data-source-story={story.id}>
        <EditorialMarkdown source={storyDisplayMarkdown(story.editorialMarkdown!, pyqs.map(q => q.id))} />
      </article>
      <section id="practice" className="scroll-mt-32 border-t border-slate-200 pt-7">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Apply what you learned</p>
        <h2 className="mt-2 mb-3 text-2xl font-bold text-slate-950">Sample practice MCQ</h2>
        <p className="mb-5 text-sm leading-6 text-slate-600">{baseContext.auth_state === "guest" ? "Try it freely. Guest attempts are not saved to a learner account." : "Your checked answer uses the existing Current Affairs attempt service."}</p>
        {questions.length ? <CurrentAffairsQuiz questions={questions} editionDate={MONTHLY_EDITION.date} revisionTakeaways={[]} monthlyContext={context} /> : <p className="text-slate-600">The approved practice question is temporarily unavailable.</p>}
      </section>
      <section id="linked-pyqs" className="scroll-mt-32 mt-8 border-t border-slate-200 pt-7">
        <h2 className="text-xl font-bold text-slate-950">Practise the linked historical PYQs</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Login is required to save a PYQ attempt. Your chosen question is retained through login and onboarding.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {pyqs.map(pyq => <MonthlyLink key={pyq.id} href={`/pyq/${pyq.id}?edition=2026-10-14&monthly=2026-10`} event="monthly_ca_linked_pyq_clicked" context={{ ...context, question_id: pyq.id, exam: pyq.exam }} className="rounded-xl border border-slate-200 p-4 font-bold text-blue-700 hover:border-blue-500 focus-visible:outline-2 focus-visible:outline-blue-600"><span className="block">{pyq.exam} · {pyq.year} · Q{pyq.number} →</span><span className="mt-2 block break-all text-xs font-medium text-slate-500">{pyq.id}</span></MonthlyLink>)}
        </div>
        {pyqs.length < MONTHLY_EDITION.pyqIds.length && <p className="mt-3 text-sm text-slate-500">Some linked questions are currently unavailable for practice.</p>}
      </section>
      <footer className="mt-9 border-t border-slate-200 py-7">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Your next learning action</p>
        <Link href="/current-affairs/2026-10-14" className="mt-3 block font-bold text-blue-700">Read the full free 14 October edition →</Link>
        <div className="mt-6 rounded-xl bg-slate-950 p-5 text-white">
          <h2 className="font-bold">Build a month of exam-ready understanding.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Subject-wise learning, revision and an eBook are planned for the ₹79 full edition. October is not yet available for purchase.</p>
          <Link href="/current-affairs/monthly/2026-10" className="mt-4 inline-block font-bold text-blue-300">Explore the planned full edition →</Link>
        </div>
      </footer>
    </div>
  </div>;
}
