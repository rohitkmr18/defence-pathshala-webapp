import Link from "next/link";
import { CalendarDays, ChevronRight, FileText, ListChecks } from "lucide-react";
import { getDailyCurrentAffairsList } from "@/lib/current-affairs";

export const revalidate = 300;

export default async function CurrentAffairsPage() {
  const posts = await getDailyCurrentAffairsList();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Defence Pathshala</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Daily Current Affairs</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Exam-focused developments converted into concise knowledge objects and daily MCQs.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <FileText className="mx-auto h-8 w-8 text-slate-400" />
            <h2 className="mt-4 text-lg font-bold text-slate-900">No edition published yet</h2>
            <p className="mt-2 text-sm text-slate-500">The next structured Current Affairs edition will appear here automatically.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/current-affairs/${post.date}`}
                className="group flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md sm:p-6"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    {post.isLatest && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">Latest</span>}
                    <span className="inline-flex items-center gap-1 text-slate-500"><CalendarDays className="h-3.5 w-3.5" />{post.formattedDate}</span>
                  </div>
                  <h2 className="mt-2 truncate text-lg font-bold text-slate-950 sm:text-xl">{post.title}</h2>
                  {post.summary && <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.summary}</p>}
                  <div className="mt-3 flex gap-4 text-xs font-semibold text-slate-500">
                    <span>{post.storyCount} stories</span>
                    <span className="inline-flex items-center gap-1"><ListChecks className="h-3.5 w-3.5" />{post.quizCount} MCQs</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
