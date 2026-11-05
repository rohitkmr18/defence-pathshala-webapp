import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { capsulePageSrc, type MonthlyCapsule } from "@/lib/monthly-capsules";

export default function MonthlyCapsuleCard({ capsule }: { capsule: MonthlyCapsule }) {
  return (
    <Link
      href={`/current-affairs/monthly/${capsule.edition}`}
      className="group flex flex-col gap-5 overflow-hidden rounded-3xl bg-slate-950 p-5 text-white shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:p-6"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- small static cover */}
      <img
        src={capsulePageSrc(capsule.edition, 1)}
        alt=""
        width={120}
        height={170}
        loading="lazy"
        draggable={false}
        className="hidden h-[170px] w-[120px] shrink-0 rounded-lg object-cover ring-1 ring-white/10 sm:block"
      />
      <div className="min-w-0 flex-1">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> Monthly Capsule · New
        </p>
        <h2 className="mt-2 text-xl font-black tracking-tight sm:text-2xl">{capsule.label} in one capsule</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          The whole month, subject-wise, with exam hooks and {capsule.highlights.find((h) => h.includes("MCQ")) ?? "practice MCQs"}.
        </p>
        <span className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white transition group-hover:bg-blue-500">
          Read online <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
