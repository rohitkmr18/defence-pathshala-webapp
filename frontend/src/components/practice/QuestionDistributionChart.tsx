"use client";

import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";
import ChartTooltip from "./ChartTooltip";
import type { ActiveFilters } from "@/app/dashboard/practice/components/PracticePageClient";

export interface DistributionItem {
  key: string;
  label: string;
  count: number;
}

interface QuestionDistributionChartProps {
  activeFilters: ActiveFilters;
  allExamsSelected?: boolean;
  onBarClick: (type: "cycle" | "year" | "exam", value: string | number) => void;
}

export default function QuestionDistributionChart({
  activeFilters,
  allExamsSelected,
  onBarClick,
}: QuestionDistributionChartProps) {
  const [data, setData] = useState<DistributionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ── Dynamic Grouping Priority ─────────────────────────────────────────────
  // 1. All Exams Selected -> Year
  // 2. Cycle (if multiple cycles selected)
  // 3. Year (if multiple years selected)
  // 4. Exam (if multiple exams selected)
  const isAllExams = Boolean(allExamsSelected || activeFilters.allExamsSelected);

  const groupBy = useMemo<"cycle" | "year" | "exam" | null>(() => {
    if (isAllExams) {
      return "year";
    }
    if (activeFilters.cycles.length > 1) {
      return "cycle";
    }
    if (activeFilters.years.length > 1) {
      return "year";
    }
    if (activeFilters.exams.length > 1) {
      return "exam";
    }
    return null;
  }, [
    isAllExams,
    activeFilters.cycles.length,
    activeFilters.years.length,
    activeFilters.exams.length,
  ]);

  // ── Fetch distribution data ───────────────────────────────────────────────
  useEffect(() => {
    if (!groupBy) {
      setData([]);
      return;
    }

    let isCancelled = false;

    async function fetchDistribution() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("group_by", groupBy as string);
        if (activeFilters.exams.length)
          params.set("exam", activeFilters.exams.join(","));
        if (activeFilters.years.length)
          params.set("year", activeFilters.years.join(","));
        if (activeFilters.cycles.length)
          params.set("cycle", activeFilters.cycles.join(","));
        if (activeFilters.subjects.length)
          params.set("subject", activeFilters.subjects.join(","));
        if (activeFilters.topics.length)
          params.set("topic", activeFilters.topics.join(","));

        const res = await fetch(
          `/api/practice/distribution?${params.toString()}`,
          {
            cache: "no-store",
          }
        );

        if (!isCancelled && res.ok) {
          const json = await res.json();
          setData(json.distribution || []);
        }
      } catch {
        if (!isCancelled) {
          setData([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    void fetchDistribution();

    return () => {
      isCancelled = true;
    };
  }, [
    groupBy,
    activeFilters.exams,
    activeFilters.years,
    activeFilters.cycles,
    activeFilters.subjects,
    activeFilters.topics,
  ]);

  // If trigger condition is not met, hide completely without blank spacing
  if (!groupBy) {
    return null;
  }

  // Titles based on active grouping
  const title =
    groupBy === "cycle"
      ? "Question Distribution by Cycle"
      : groupBy === "year"
      ? "Question Distribution by Year"
      : "Question Distribution by Exam";

  const hint =
    groupBy === "cycle"
      ? "Click any cycle to narrow down practice."
      : groupBy === "year"
      ? "Click any year to focus on that specific year."
      : "Click any exam to narrow down practice.";

  const handleBarClick = (entry: any) => {
    const item = entry?.payload || entry;
    if (!item?.key) return;

    if (groupBy === "year") {
      const yearNum = parseInt(item.key, 10);
      if (!isNaN(yearNum)) {
        onBarClick("year", yearNum);
      }
    } else if (groupBy === "cycle") {
      onBarClick("cycle", item.key);
    } else if (groupBy === "exam") {
      onBarClick("exam", item.key);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
          </div>
        </div>
      </div>

      <div className="h-56 w-full sm:h-64">
        {!isMounted || loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-full w-full animate-pulse rounded-2xl bg-slate-50 dark:bg-slate-800/50" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            No questions found for the current selection.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
                className="dark:stroke-slate-800"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                interval={0}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip
                content={<ChartTooltip groupBy={groupBy} />}
                cursor={{ fill: "rgba(239, 246, 255, 0.6)", radius: 6 }}
              />
              <Bar
                dataKey="count"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
                className="cursor-pointer transition-all hover:opacity-85"
                onClick={handleBarClick}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
