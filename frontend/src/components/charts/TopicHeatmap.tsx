"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Flame,
  Search,
  ArrowUpRight,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";

interface TopicHeatmapProps {
  topics: {
    name: string;
    value: number;
  }[];
  totalQuestions: number;
}

export default function TopicHeatmap({
  topics,
  totalQuestions,
}: TopicHeatmapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState<"all" | "high" | "medium">("all");

  const maxQuestions = useMemo(() => {
    return Math.max(...topics.map((t) => t.value), 1);
  }, [topics]);

  const filteredTopics = useMemo(() => {
    let result = [...topics];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q));
    }

    if (filterTier === "high") {
      result = result.filter((t) => t.value >= maxQuestions * 0.6);
    } else if (filterTier === "medium") {
      result = result.filter(
        (t) => t.value >= maxQuestions * 0.3 && t.value < maxQuestions * 0.6
      );
    }

    return result;
  }, [topics, searchQuery, filterTier, maxQuestions]);

  const getHeatmapStyling = (value: number) => {
    const ratio = value / maxQuestions;

    if (ratio >= 0.75) {
      return {
        bg: "bg-blue-600 text-white shadow-md shadow-blue-600/15 border-blue-600",
        badge: "bg-white/20 text-white border-white/25",
        textMuted: "text-blue-100",
        tag: "High Recurrence",
        tagClass: "bg-blue-500/80 text-white",
        iconClass: "text-blue-200",
      };
    }
    if (ratio >= 0.5) {
      return {
        bg: "bg-blue-50 border-blue-200/90 text-blue-950 hover:bg-blue-100/70",
        badge: "bg-blue-600 text-white",
        textMuted: "text-blue-700 font-medium",
        tag: "Frequent Yield",
        tagClass: "bg-blue-100 text-blue-800 border border-blue-200",
        iconClass: "text-blue-600",
      };
    }
    if (ratio >= 0.25) {
      return {
        bg: "bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100/80",
        badge: "bg-slate-200 text-slate-800",
        textMuted: "text-slate-500",
        tag: "Regularly Tested",
        tagClass: "bg-slate-100 text-slate-700",
        iconClass: "text-slate-400",
      };
    }
    return {
      bg: "bg-white border-slate-200/80 text-slate-700 hover:border-slate-300",
      badge: "bg-slate-100 text-slate-600",
      textMuted: "text-slate-400",
      tag: "Targeted Scope",
      tagClass: "bg-slate-50 text-slate-500",
      iconClass: "text-slate-400",
    };
  };

  return (
    <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
      {/* ── Section Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 shadow-2xs">
            <Flame className="h-3.5 w-3.5 text-blue-600" />
            <span>TOPIC RECURRENCE HEATMAP</span>
          </div>
          <h2 className="mt-2.5 text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Syllabus Density & Yield Distribution
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Visual weight of topics showing where UPSC questions cluster most heavily
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Yield Density:
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-2xs">
            High (Top 25%)
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-800 border border-blue-200">
            Medium
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            Standard
          </span>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-slate-100">
        {/* Tier filters */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setFilterTier("all")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              filterTier === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Topics ({topics.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTier("high")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              filterTier === "high"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            High Yield Only
          </button>
          <button
            type="button"
            onClick={() => setFilterTier("medium")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              filterTier === "medium"
                ? "bg-blue-50 text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Medium Yield
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* ── Heatmap Cards Grid ──────────────────────────────────────────── */}
      {filteredTopics.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
          <Layers className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          <p className="text-sm font-bold text-slate-700">No topics match your filter</p>
          <p className="text-xs text-slate-400 mt-1">Try clearing your search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredTopics.map((topic) => {
            const style = getHeatmapStyling(topic.value);
            const percent = ((topic.value / (totalQuestions || 1)) * 100).toFixed(1);

            return (
              <div
                key={topic.name}
                className={`group relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${style.bg}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${style.tagClass}`}
                    >
                      {style.tag}
                    </span>
                    <span
                      className={`flex h-6 px-2 items-center justify-center rounded-lg text-xs font-black shrink-0 ${style.badge}`}
                    >
                      {topic.value} Qs
                    </span>
                  </div>

                  <h3 className="text-sm font-bold tracking-tight line-clamp-2">
                    {topic.name}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                  <span className={`${style.textMuted} text-[11px]`}>
                    {percent}% of examined paper
                  </span>

                  <Link
                    href={`/dashboard/practice`}
                    className="inline-flex items-center gap-1 font-bold text-[11px] underline-offset-2 hover:underline group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Practice</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

