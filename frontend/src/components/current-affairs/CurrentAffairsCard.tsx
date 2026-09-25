"use client";

import Link from "next/link";
import { Calendar, Clock, Layers, Sparkles, ArrowRight } from "lucide-react";
import type { CurrentAffairsPost } from "@/lib/current-affairs";

interface CurrentAffairsCardProps {
  post: CurrentAffairsPost;
}

export default function CurrentAffairsCard({ post }: CurrentAffairsCardProps) {
  return (
    <Link
      href={`/current-affairs/${post.date}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-[0_20px_40px_rgba(37,99,235,0.08)] sm:p-7"
    >
      <div>
        {/* Header row: Date & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {post.formattedDate}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {post.isLatest && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800 animate-pulse">
                <Sparkles className="h-3 w-3 text-emerald-600" />
                <span>Latest Update</span>
              </span>
            )}
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              {post.date}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-4 text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600 sm:text-xl">
          {post.title}
        </h3>

        {/* Summary */}
        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-600">
          {post.summary}
        </p>
      </div>

      {/* Footer stats strip */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            <Layers className="h-4 w-4 text-slate-400" />
            <span>{post.slideCount} Slides</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="h-4 w-4 text-slate-400" />
            <span>~{post.readingTimeMinutes} min read</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1 font-bold text-blue-600 group-hover:text-blue-700">
          <span>Read Brief</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
