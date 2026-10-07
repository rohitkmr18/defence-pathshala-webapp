import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CurrentAffairsUploader from "@/components/CurrentAffairsUploader";
import StructuredCurrentAffairsImporter from "@/components/current-affairs/StructuredCurrentAffairsImporter";

export default function CurrentAffairsAdminPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10 lg:py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Defence Pathshala</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">Current Affairs Publisher</h1>
            <p className="mt-3 max-w-2xl text-slate-500">
              Publish structured Current Affairs and keep the legacy image workflow available during transition.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Dashboard</span>
          </Link>
        </div>

        <StructuredCurrentAffairsImporter />

        <details className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <summary className="cursor-pointer text-lg font-black text-slate-900">Legacy carousel uploader</summary>
          <p className="mt-2 text-sm text-slate-500">
            Keep this only as a temporary fallback while the structured workflow is validated.
          </p>
          <div className="mt-6">
            <CurrentAffairsUploader />
          </div>
        </details>
      </div>
    </main>
  );
}
