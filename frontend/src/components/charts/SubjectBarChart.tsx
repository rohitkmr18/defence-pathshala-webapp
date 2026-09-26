"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BookOpen, ArrowUpRight, TrendingUp } from "lucide-react";

interface SubjectBarChartProps {
  title?: string;
  subtitle?: string;
  data: {
    name: string;
    value: number;
  }[];
  totalQuestions: number;
}

const BLUE_PALETTE = [
  "#2563EB",
  "#3B82F6",
  "#1D4ED8",
  "#60A5FA",
  "#1E40AF",
  "#93C5FD",
  "#0284C7",
  "#0EA5E9",
];

function CustomTooltip({ active, payload, totalQuestions }: any) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const percent = ((item.value / (totalQuestions || 1)) * 100).toFixed(1);
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/95 p-3.5 shadow-xl backdrop-blur-md">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Subject Weightage
        </p>
        <p className="mt-1 text-base font-black text-slate-900">
          {item.name}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-blue-600">{item.value}</span>
          <span className="text-xs font-semibold text-slate-500">
            questions ({percent}%)
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export default function SubjectBarChart({
  title = "Subject Weightage Breakdown",
  subtitle = "QUESTION INTELLIGENCE",
  data,
  totalQuestions,
}: SubjectBarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.value - a.value);
  }, [data]);

  const topSubject = sortedData[0];
  const topPercent = topSubject
    ? ((topSubject.value / (totalQuestions || 1)) * 100).toFixed(1)
    : "0";

  return (
    <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 shadow-2xs">
            <BookOpen className="h-3.5 w-3.5 text-blue-600" />
            <span>{subtitle}</span>
          </div>
          <h2 className="mt-2.5 text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Distribution of questions across tested syllabus areas
          </p>
        </div>

        {topSubject && (
          <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-3 sm:px-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                Highest Yield Subject
              </p>
              <p className="text-sm font-black text-slate-900">
                {topSubject.name}{" "}
                <span className="text-blue-600 font-bold">({topPercent}%)</span>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <div className="h-[320px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedData}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                onMouseMove={(state: any) => {
                  if (state && state.activeTooltipIndex !== undefined) {
                    setHoveredIndex(state.activeTooltipIndex);
                  }
                }}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={{ stroke: "#E2E8F0" }}
                  interval={0}
                  tick={({ x, y, payload }: any) => {
                    const label = payload.value.length > 10 ? `${payload.value.substring(0, 9)}…` : payload.value;
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text
                          x={0}
                          y={0}
                          dy={14}
                          textAnchor="end"
                          fill="#64748B"
                          fontSize={11}
                          fontWeight={600}
                          transform="rotate(-25)"
                        >
                          {label}
                        </text>
                      </g>
                    );
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 600 }}
                  tickFormatter={(val: number) => `${val}`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(37, 99, 235, 0.05)", radius: 8 }}
                  content={<CustomTooltip totalQuestions={totalQuestions} />}
                />
                <Bar
                  dataKey="value"
                  radius={[8, 8, 2, 2]}
                  animationDuration={800}
                >
                  {sortedData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        hoveredIndex === null
                          ? BLUE_PALETTE[index % BLUE_PALETTE.length]
                          : hoveredIndex === index
                          ? "#1D4ED8"
                          : "#93C5FD"
                      }
                      className="transition-colors duration-200"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Detailed Subject Breakdown
          </p>

          <div className="space-y-2 max-h-[310px] overflow-y-auto pr-1">
            {sortedData.map((item, idx) => {
              const pct = ((item.value / (totalQuestions || 1)) * 100).toFixed(1);
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={item.name}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`group flex items-center justify-between gap-3 rounded-2xl border p-3 transition-all duration-200 ${
                    isHovered
                      ? "border-blue-300 bg-blue-50/70 shadow-xs translate-x-1"
                      : "border-slate-100 bg-slate-50/60 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-black transition-colors ${
                        idx === 0
                          ? "bg-blue-600 text-white shadow-2xs"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {idx + 1}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {item.name}
                      </p>
                      <div className="mt-1 h-1.5 w-24 sm:w-32 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs sm:text-sm font-black text-slate-900">
                      {item.value}{" "}
                      <span className="text-[11px] font-normal text-slate-500">
                        Qs
                      </span>
                    </p>
                    <p className="text-[11px] font-semibold text-blue-600">
                      {pct}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard/practice"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100 hover:text-blue-800"
            >
              <span>Practice Questions by Subject</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
