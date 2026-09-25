
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CurrentAffairsUploader from "@/components/CurrentAffairsUploader";

export default function CurrentAffairsAdminPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10 lg:py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Defence Pathshala
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Current Affairs Publisher
            </h1>
            <p className="mt-3 max-w-2xl text-slate-500">
              Internal admin panel for publishing daily current affairs.
            </p>
          </div>

          <Link
            href="/current-affairs"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>View Public Daily Briefs</span>
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="space-y-6">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Date</label>
              <input
                type="date"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Title</label>
              <input
                type="text"
                placeholder="Daily Current Affairs"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Summary</label>
              <textarea
                rows={4}
                placeholder="Today's overview..."
                className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100">
              Save Draft
            </button>

          </div>
        </div>

        <div className="mt-10 border-t pt-8">
          <h2 className="text-2xl font-bold">
            Upload Carousel Slides
          </h2>

          <p className="mt-2 text-slate-500">
            Upload today&apos;s 7–9 carousel images.
          </p>

          <div className="mt-6">
            <CurrentAffairsUploader />
          </div>
        </div>
      </div>
    </main>
  );
}