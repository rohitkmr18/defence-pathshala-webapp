import Link from "next/link";
import { ArrowRight, Calendar, Layers, Newspaper, PlusCircle, Sparkles } from "lucide-react";
import { getDailyCurrentAffairsList } from "@/lib/current-affairs";
import CurrentAffairsCard from "@/components/current-affairs/CurrentAffairsCard";

export const revalidate = 60; // Revalidate every minute
export const dynamic = "force-dynamic";

export default async function CurrentAffairsPage() {
  const posts = await getDailyCurrentAffairsList();
  const latestPost = posts[0];
  const archivePosts = posts.slice(1);

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      <div className="mx-auto max-w-5xl px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* Top Header Section */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200/80 pb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <Newspaper className="h-4 w-4" />
              </span>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Defence Pathshala Intelligence
              </p>
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Daily Current Affairs
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Authentic exam-focused updates for CDS, CAPF, NDA, UPSC and AFCAT.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2.5 sm:items-end">
            {latestPost && (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-spin" />
                <span>Latest Update: {latestPost.formattedDate}</span>
              </div>
            )}

            <Link
              href="/admin/current-affairs"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-2xs transition hover:bg-slate-50"
            >
              <PlusCircle className="h-3.5 w-3.5 text-slate-400" />
              <span>Publisher Portal</span>
            </Link>
          </div>
        </div>

        {latestPost && (
          <section className="mt-8 overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-[0_16px_40px_rgba(37,99,235,0.08)]">
            <div className="border-b border-blue-100 bg-blue-50/70 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-700 sm:px-8">
              Latest Brief
            </div>
            <div className="px-6 py-7 sm:px-8 sm:py-8">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  {latestPost.formattedDate}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-slate-400" />
                  {latestPost.slideCount} Slides
                </span>
              </div>
              <h2 className="mt-3 max-w-3xl text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {latestPost.title}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
                {latestPost.summary}
              </p>
              <Link
                href={`/current-affairs/${latestPost.date}`}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                Read Latest Brief
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        {/* Date List Section */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Daily Briefs Archive (Newest First)
            </h2>
            <span className="text-xs font-semibold text-slate-400">
              {posts.length} {posts.length === 1 ? "Edition" : "Editions"} Available
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {archivePosts.map((post) => (
              <CurrentAffairsCard key={post.date} post={post} />
            ))}
          </div>

          {posts.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <Newspaper className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-base font-bold text-slate-800">
                No current affairs editions uploaded yet
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Visit the Publisher Portal to upload today&apos;s slide carousel.
              </p>
              <Link
                href="/admin/current-affairs"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
              >
                Go to Publisher Portal
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
