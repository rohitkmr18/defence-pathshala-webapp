import Link from "next/link";
import { ArrowRight, CalendarDays, FileText, ListChecks } from "lucide-react";
import { getDailyCurrentAffairsList, type CurrentAffairsPost } from "@/lib/current-affairs";
import { indiaToday, relativeDayLabel, summariseMonths, weekdayName } from "@/lib/current-affairs-calendar";
import CurrentAffairsCalendar from "@/components/current-affairs/CurrentAffairsCalendar";
import MonthlyCapsuleCard from "@/components/current-affairs/MonthlyCapsuleCard";
import { latestMonthlyCapsule } from "@/lib/monthly-capsules";
import PublicExploreLinks from "@/components/public/PublicExploreLinks";

export const revalidate = 300;

const PINNED_EDITIONS = 3;

function EditionCard({ post, label, primary }: { post: CurrentAffairsPost; label: string; primary: boolean }) {
  const headlines = post.stories.slice(0, 3).map((s) => s.headline).filter(Boolean);
  const more = Math.max(0, post.storyCount - headlines.length);

  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${primary ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700"}`}>
          {label}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          {post.formattedDate}
        </span>
      </div>

      {headlines.length > 0 ? (
        <ul className="space-y-2.5">
          {headlines.map((headline) => (
            <li key={headline} className="flex gap-2.5 text-sm font-semibold leading-6 text-slate-900">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
              <span>{headline}</span>
            </li>
          ))}
        </ul>
      ) : (
        post.summary && <p className="line-clamp-3 text-sm leading-6 text-slate-600">{post.summary}</p>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
        <span>{post.storyCount} stories{more > 0 ? ` · ${more} more inside` : ""}</span>
        <span className="inline-flex items-center gap-1"><ListChecks className="h-3.5 w-3.5" aria-hidden="true" />{post.quizCount} MCQs</span>
      </div>

      <Link
        href={`/current-affairs/${post.date}`}
        className={`mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition ${
          primary
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "border border-slate-200 bg-white text-slate-900 hover:border-blue-300 hover:text-blue-700"
        }`}
      >
        Read edition &amp; quiz <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

export default async function CurrentAffairsPage() {
  const posts = await getDailyCurrentAffairsList();
  const today = indiaToday();
  const pinned = posts.slice(0, PINNED_EDITIONS);
  const months = summariseMonths(posts.map((p) => p.date));
  const capsule = latestMonthlyCapsule();
  const calendarEditions = posts.map((p) => ({ date: p.date, storyCount: p.storyCount, quizCount: p.quizCount }));

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Defence Pathshala</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Daily Current Affairs</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Exam-focused developments for CDS, CAPF, AFCAT and NDA, converted into concise knowledge objects and daily MCQs.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <FileText className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-bold text-slate-900">No edition published yet</h2>
            <p className="mt-2 text-sm text-slate-500">The next structured Current Affairs edition will appear here automatically.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <section aria-labelledby="ca-latest">
              <h2 id="ca-latest" className="sr-only">Latest editions</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pinned.map((post, i) => (
                  <EditionCard
                    key={post.id}
                    post={post}
                    primary={i === 0}
                    label={relativeDayLabel(post.date, today) ?? weekdayName(post.date) ?? (i === 0 ? "Latest" : "Earlier")}
                  />
                ))}
              </div>
            </section>

            {capsule && <MonthlyCapsuleCard capsule={capsule} />}

            <CurrentAffairsCalendar editions={calendarEditions} />

            {months.length > 0 && (
              <nav aria-labelledby="ca-archive" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 id="ca-archive" className="text-base font-bold text-slate-950">Monthly archive</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {months.map((m) => (
                    <li key={m.month}>
                      <Link
                        href={`/current-affairs/month/${m.month}`}
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      >
                        {m.label}
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{m.editionCount}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        )}
      </section>
      <PublicExploreLinks className="border-t border-slate-200" />
    </main>
  );
}
