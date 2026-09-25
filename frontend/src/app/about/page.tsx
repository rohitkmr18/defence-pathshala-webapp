import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Target,
  Sparkles,
  Database,
  CheckCircle2,
  Award,
  ArrowRight,
  ExternalLink,
  MessageSquareHeart,
  GraduationCap,
  Milestone,
  Check,
  Clock,
} from "lucide-react";
import { getAboutContent } from "@/lib/aboutContent";

export default async function AboutPage() {
  const content = await getAboutContent();
  const { hero, mission, vision, whyDifferent, founder, roadmap, feedback } =
    content;

  const iconMap: Record<string, typeof Database> = {
    Database,
    Sparkles,
    Award,
    Target,
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-24 text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:px-10 lg:py-12 space-y-16">
        {/* 1. Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-2xl sm:p-12">
          {/* Subtle military grid aura */}
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-emerald-600/10 blur-3xl" />

          <div className="relative max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold tracking-wider text-blue-300 backdrop-blur-md">
              <Shield className="h-3.5 w-3.5 text-blue-400" />
              <span>{hero.tagline}</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl sm:leading-[1.15]">
              {hero.title}
            </h1>

            <p className="text-base font-medium text-slate-300 sm:text-lg">
              {hero.subtitle}
            </p>

            <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
              {hero.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={hero.ctaPrimary.href}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{hero.ctaPrimary.text}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href={hero.ctaSecondary.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10 hover:border-white/30"
              >
                <span>{hero.ctaSecondary.text}</span>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </a>
            </div>
          </div>
        </section>

        {/* 2. Mission & Vision Grid */}
        <section className="grid gap-6 md:grid-cols-2">
          {/* Mission Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Target className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {mission.label}
                </span>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {mission.heading}
              </h2>

              <p className="text-sm font-semibold leading-relaxed text-blue-950 sm:text-base">
                &ldquo;{mission.statement}&rdquo;
              </p>

              <ul className="space-y-2.5 pt-2 text-xs text-slate-600 sm:text-sm">
                {mission.bulletPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Vision Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <Shield className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {vision.label}
                </span>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {vision.heading}
              </h2>

              <p className="text-sm font-semibold leading-relaxed text-emerald-950 sm:text-base">
                &ldquo;{vision.statement}&rdquo;
              </p>

              <ul className="space-y-2.5 pt-2 text-xs text-slate-600 sm:text-sm">
                {vision.bulletPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Why We're Different (Feature Cards) */}
        <section className="space-y-6">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Our Core Moat
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {whyDifferent.heading}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {whyDifferent.subtitle}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyDifferent.features.map((feat) => {
              const Icon = iconMap[feat.iconName] || Shield;

              return (
                <div
                  key={feat.id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-blue-300 hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      {feat.badge && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                          {feat.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {feat.title}
                    </h3>

                    <p className="text-xs leading-relaxed text-slate-600">
                      {feat.description}
                    </p>
                  </div>

                  {feat.metric && (
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <span className="text-xs font-extrabold text-blue-600">
                        {feat.metric}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Founder Section */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 p-8 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start lg:items-center">
            {/* Founder Circular Image */}
            <div className="flex flex-col items-center text-center shrink-0">
              <div className="relative h-44 w-44 sm:h-52 sm:w-52 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-xl ring-4 ring-blue-600/10">
                <Image
                  src={founder.image || "/images/rohit-kumar.jpg"}
                  alt={`${founder.name} - ${founder.title}`}
                  width={300}
                  height={300}
                  priority
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
              <span className="mt-3.5 inline-block rounded-full border border-blue-200/80 bg-blue-50 px-3.5 py-1 text-xs font-bold tracking-wide text-blue-700 shadow-2xs">
                BSF AC · AIR 163 · IIT Kanpur
              </span>
            </div>

            {/* Founder Bio & Credentials */}
            <div className="space-y-5 flex-1">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                  <Award className="h-3.5 w-3.5 text-blue-600" />
                  <span>Leadership & Vision</span>
                </div>
                <h2 className="mt-2.5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                  {founder.name}
                </h2>
                <p className="mt-0.5 text-sm font-semibold text-blue-600 sm:text-base">
                  {founder.title}
                </p>
              </div>

              {/* Credentials Chips */}
              <div className="flex flex-wrap gap-2">
                {founder.credentials.map((cred, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs"
                  >
                    <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                    <span>{cred}</span>
                  </span>
                ))}
              </div>

              <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                {founder.bio}
              </p>

              <blockquote className="border-l-4 border-blue-600 bg-white p-4.5 rounded-r-2xl border border-slate-100 text-xs sm:text-sm font-medium italic text-slate-800 shadow-2xs">
                &ldquo;{founder.quote}&rdquo;
              </blockquote>
            </div>
          </div>
        </section>

        {/* 5. Product Roadmap (Interactive Timeline) */}
        <section className="space-y-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-blue-600">
              <Milestone className="h-4 w-4" />
              <p className="text-xs font-bold uppercase tracking-wider">
                Trajectory
              </p>
            </div>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {roadmap.heading}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {roadmap.subtitle}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {roadmap.phases.map((ph, idx) => {
              const isCompleted = ph.status === "completed";
              const isCurrent = ph.status === "current";

              return (
                <div
                  key={ph.phase}
                  className={`relative flex flex-col justify-between rounded-3xl border p-6 transition shadow-xs ${
                    isCurrent
                      ? "border-blue-400 bg-blue-50/40 shadow-blue-500/10"
                      : isCompleted
                      ? "border-emerald-200 bg-white"
                      : "border-slate-200 bg-slate-50/50 opacity-90"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                        {ph.phase}
                      </span>
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          <Check className="h-3 w-3" />
                          <span>Shipped</span>
                        </span>
                      )}
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 animate-pulse">
                          <span>Active Release</span>
                        </span>
                      )}
                      {!isCompleted && !isCurrent && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          <Clock className="h-3 w-3" />
                          <span>Upcoming</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {ph.name}
                    </h3>

                    <ul className="space-y-2 text-xs text-slate-600">
                      {ph.highlights.map((hl, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. Feedback Section */}
        <section className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 p-8 text-center sm:p-10 shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
            <MessageSquareHeart className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {feedback.heading}
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
            {feedback.description}
          </p>

          <div className="mt-6">
            <a
              href={feedback.ctaUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-700 hover:scale-105 active:scale-95"
            >
              <span>{feedback.ctaText}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
