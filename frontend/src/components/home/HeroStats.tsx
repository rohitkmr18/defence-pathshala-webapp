"use client";

import { Database, Layers, BookOpen } from "lucide-react";

interface StatItem {
  id: string;
  value: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

const STATS: StatItem[] = [
  {
    id: "pyqs",
    value: "730+",
    label: "PYQs Analyzed",
    sublabel: "Across CDS, CAPF AC & NDA",
    icon: Database,
  },
  {
    id: "datapoints",
    value: "29",
    label: "Data Points per Question",
    sublabel: "Deep taxonomic exam tagging",
    icon: Layers,
  },
  {
    id: "subjects",
    value: "9",
    label: "Subjects Covered",
    sublabel: "Polity, History, Geo, GS & more",
    icon: BookOpen,
  },
];

export default function HeroStats() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 sm:mt-16">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              style={{ animationDelay: `${idx * 150}ms` }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400/50 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-blue-500/10 text-left"
            >
              {/* Blue gradient highlight on top edge on hover */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400/0 to-transparent transition-all duration-300 group-hover:via-blue-400/80" />

              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  {stat.value}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-blue-400 shadow-inner group-hover:border-blue-400/40 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                {stat.label}
              </h4>
              <p className="mt-1 text-xs text-slate-400">
                {stat.sublabel}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
