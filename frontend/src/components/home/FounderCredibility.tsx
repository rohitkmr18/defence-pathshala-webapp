"use client";

import { Award, GraduationCap, Sparkles, ShieldCheck } from "lucide-react";

interface CredentialBadge {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
}

const BADGES: CredentialBadge[] = [
  {
    id: "capf",
    icon: Award,
    title: "UPSC CAPF AC AIR-163",
    subtitle: "BSF Assistant Commandant",
  },
  {
    id: "iitk",
    icon: GraduationCap,
    title: "IIT Kanpur Graduate",
    subtitle: "Mechanical Engineering",
  },
  {
    id: "ai-pyq",
    icon: Sparkles,
    title: "AI-Powered PYQ Intelligence",
    subtitle: "Deep Taxonomic Pattern Extraction",
  },
];

export default function FounderCredibility() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 text-slate-900 border-t border-slate-200/80">
      {/* Subtle radial accent */}
      <div className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-blue-500/5 blur-[100px]" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-2xs">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
          AUTHORITY & TRUST
        </div>

        {/* Heading */}
        <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl text-slate-900">
          Built from Real Field Experience
        </h2>

        {/* Body Paragraph */}
        <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
          Defence Pathshala is built by a BSF Assistant Commandant and IIT Kanpur alumnus after years of analysing competitive exam patterns and transforming Previous Year Questions into structured exam intelligence.
        </p>

        {/* 3 Outlined Credibility Badges */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className="group relative flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-xl shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 mb-4 group-hover:border-blue-500 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all shadow-2xs">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {badge.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {badge.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional credibility highlight */}
        <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-xs text-slate-600 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          <span>Proven approach: 4× CDS Qualified &bull; CAPF AC AIR 163 &bull; IIT Kanpur</span>
        </div>
      </div>
    </section>
  );
}
