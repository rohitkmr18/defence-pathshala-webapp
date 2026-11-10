"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Target, TrendingUp } from "lucide-react";
import type { AfcatPerformanceGroup, AfcatPerformanceV2 } from "@/lib/afcat/performance-v2";

type Tab = "overview" | "subjects" | "topics" | "trends" | "plan";
const tabs: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "subjects", label: "Subjects" },
  { key: "topics", label: "Topics" },
  { key: "trends", label: "Trends" },
  { key: "plan", label: "Study plan" },
];

const percent = (n: number | null) => n === null ? "No attempts" : `${n}%`;
const formatTime = (seconds: number | null) => {
  if (seconds === null) return "Not recorded";
  const minutes = Math.floor(seconds / 60);
  return minutes ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
};

function Progress({ value, kind = "blue" }: { value: number; kind?: "blue" | "green" }) {
  return <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, Math.max(0, value))} aria-label="Percentage">
    <div className={`h-full rounded-full ${kind === "green" ? "bg-emerald-500" : "bg-blue-600"}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>;
}

function Metric({ title, value, description }: { title: string; value: string; description: string }) {
  return <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
    <p className="mt-2 break-words text-2xl font-black tabular-nums text-slate-950 sm:text-3xl">{value}</p>
    <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
  </div>;
}

function SectionCard({ item }: { item: AfcatPerformanceGroup }) {
  return <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h3 className="font-bold text-slate-900">{item.label}</h3><p className="mt-1 text-xs text-slate-500">{item.total} questions seen across completed mocks</p></div>
      <p className="font-black tabular-nums text-slate-950">{item.marks} <span className="text-sm font-medium text-slate-500">/ {item.maximumMarks}</span></p>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-3">
      <div><p className="text-xs text-slate-500">Attempt accuracy</p><p className="text-lg font-black">{percent(item.accuracyPercent)}</p><Progress value={item.accuracyPercent ?? 0}/></div>
      <div><p className="text-xs text-slate-500">Attempt rate</p><p className="text-lg font-black">{percent(item.attemptRatePercent)}</p><Progress value={item.attemptRatePercent} kind="green"/></div>
    </div>
    <p className="mt-4 text-xs leading-5 text-slate-600">{item.correct} correct · {item.incorrect} wrong · {item.unanswered} skipped · −{item.negativePenalty} penalty</p>
    <p className="mt-1 text-xs text-slate-500">Recorded question time: {formatTime(item.questionTimeSeconds)}</p>
  </div>;
}

function TopicRow({ item, nested = false }: { item: AfcatPerformanceGroup; nested?: boolean }) {
  const insufficient = item.evidence === "LIMITED";
  return <div className={`min-w-0 rounded-2xl border p-4 ${insufficient ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-white"}`}>
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="break-words font-bold text-slate-900">{nested ? item.subtopic : item.topic}</p>
        <p className="mt-1 text-xs text-slate-500">{item.label}{nested ? ` · ${item.topic}` : ""} · {item.total} questions</p>
      </div>
      <div className="text-right">
        <p className="font-black tabular-nums text-slate-900">{percent(item.accuracyPercent)}</p>
        <p className="text-xs text-slate-500">Attempt accuracy</p>
      </div>
    </div>
    <Progress value={item.accuracyPercent ?? 0}/>
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
      <span>{item.correct} correct</span><span>{item.incorrect} wrong</span><span>{item.unanswered} skipped</span>
      <span>{item.attemptRatePercent}% attempted</span><span>{item.marksLost} theoretical marks lost</span>
    </div>
    {insufficient && <p className="mt-2 text-xs font-medium text-amber-800">Limited evidence — fewer than 5 questions. No mastery classification.</p>}
  </div>;
}

export default function AfcatPerformancePanel({ data, latestSessionId }: { data: AfcatPerformanceV2; latestSessionId: string | null }) {
  const [active, setActive] = useState<Tab>("overview");
  const [section, setSection] = useState("ALL");
  const [depth, setDepth] = useState<"topic" | "subtopic">("topic");
  const rows = (depth === "topic" ? data.topics : data.subtopics).filter((t) => section === "ALL" || t.section === section);
  const trend = data.trend;
  const n = data.overview.completedMocks;

  return <section aria-label="AFCAT performance intelligence" className="min-w-0 space-y-5">
    <div className="rounded-3xl bg-[#081b35] p-5 text-white sm:p-7">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-300">DP Performance Intelligence</p>
      <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Your performance, decoded.</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">Track how you answer, which topics need revision, and whether later mocks show progress. Every figure comes from your finalized attempts.</p>
      <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold">
        <CheckCircle2 className="h-4 w-4 text-blue-300" aria-hidden="true" /> {n} completed scored {n === 1 ? "attempt" : "attempts"} analysed
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Metric title="Latest score" value={data.overview.latestScore === null ? "—" : String(data.overview.latestScore)} description="Net marks in latest completed mock"/>
      <Metric title="Attempt accuracy" value={percent(data.overview.overallAccuracyPercent)} description="Correct ÷ answered questions"/>
      <Metric title="Attempt rate" value={percent(data.overview.overallAttemptRatePercent)} description="Answered ÷ assigned questions"/>
      <Metric title="Negative penalty" value={`−${data.overview.negativePenalty}`} description="One mark per incorrect answer"/>
    </div>

    <div className="flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5" role="tablist" aria-label="Performance analysis sections">
      {tabs.map((tab) => <button type="button" key={tab.key} role="tab" aria-selected={active === tab.key} aria-controls={`afcat-perf-${tab.key}`} id={`afcat-perf-tab-${tab.key}`} onClick={() => setActive(tab.key)}
        className={`min-h-11 shrink-0 rounded-xl px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${active === tab.key ? "bg-[#0b2444] text-white" : "text-slate-600 hover:bg-slate-100"}`}>{tab.label}</button>)}
    </div>

    {active === "overview" && <div role="tabpanel" id="afcat-perf-overview" aria-labelledby="afcat-perf-tab-overview" className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Metric title="Best mock score" value={data.overview.bestScore === null ? "—" : String(data.overview.bestScore)} description="Highest net score among completed attempts"/>
        <Metric title="Average mock score" value={data.overview.averageScore === null ? "—" : String(data.overview.averageScore)} description="Arithmetic mean of finalized scores"/>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="font-bold">Section performance snapshot</h3>
        <p className="mt-1 text-xs text-slate-500">Accuracy is calculated only on attempted questions. Attempt rate appears separately.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">{data.sections.filter((s) => s.total).map((item) => <SectionCard key={item.section} item={item}/>)}</div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="font-bold">What to work on next</h3>
        {data.priorities.length ? <div className="mt-3 space-y-3">{data.priorities.map((p) => <div key={p.section + p.topic} className="rounded-xl bg-blue-50 p-3"><p className="font-bold text-slate-900">{p.topic}</p><p className="mt-1 text-xs text-slate-700">{p.reason}</p></div>)}</div>
        : <p className="mt-2 text-sm text-slate-600">Not enough reliable topic-level evidence to rank your weaknesses. Complete more mocks and review individual answers.</p>}
      </div>
    </div>}

    {active === "subjects" && <div role="tabpanel" id="afcat-perf-subjects" aria-labelledby="afcat-perf-tab-subjects" className="grid gap-4 md:grid-cols-2">
      {data.sections.map((item) => <SectionCard key={item.section} item={item}/>)}
    </div>}

    {active === "topics" && <div role="tabpanel" id="afcat-perf-topics" aria-labelledby="afcat-perf-tab-topics" className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <label className="flex-1 text-xs font-bold text-slate-700" htmlFor="afcat-topic-section">Filter by subject
          <select id="afcat-topic-section" value={section} onChange={(e) => setSection(e.target.value)} className="mt-1 block min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium">
            <option value="ALL">All subjects</option>
            {data.sections.map((s) => <option key={s.section} value={s.section}>{s.label}</option>)}
          </select>
        </label>
        <div className="flex gap-2" aria-label="Taxonomy depth">
          <button type="button" onClick={() => setDepth("topic")} aria-pressed={depth === "topic"} className={`min-h-11 rounded-xl px-4 text-sm font-bold ${depth === "topic" ? "bg-blue-700 text-white" : "border border-slate-200 text-slate-700"}`}>Topics</button>
          <button type="button" onClick={() => setDepth("subtopic")} aria-pressed={depth === "subtopic"} className={`min-h-11 rounded-xl px-4 text-sm font-bold ${depth === "subtopic" ? "bg-blue-700 text-white" : "border border-slate-200 text-slate-700"}`}>Subtopics</button>
        </div>
      </div>
      <p className="text-xs text-slate-500">{rows.length} {depth === "topic" ? "topics" : "subtopics"} encountered · Fewer than five questions means limited evidence.</p>
      {rows.length ? <div className="grid gap-3 md:grid-cols-2">{rows.map((r) => <TopicRow key={r.section + r.topic + r.subtopic} item={r} nested={depth === "subtopic"}/>)}</div>
        : <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">No finalized question evidence for this filter.</p>}
    </div>}

    {active === "trends" && <div role="tabpanel" id="afcat-perf-trends" aria-labelledby="afcat-perf-tab-trends" className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="flex items-center gap-2 font-bold"><TrendingUp className="h-5 w-5 text-blue-700"/> Mock score trajectory</h3>
      {trend.length < 2 && <p className="mt-3 text-sm text-slate-600">At least two finalized mocks are needed to compare scores. One attempt cannot establish a performance trend.</p>}
      {trend.length >= 2 && <p className="mt-2 text-xs text-slate-500">Observed scores, not a percentile or a prediction of AFCAT readiness. Different mock difficulty may affect comparisons.</p>}
      {trend.length > 0 && <div className="mt-4 space-y-3">{trend.map((t, i) => <div key={t.sessionId} className="flex min-w-0 items-center gap-3">
        <span className="w-16 shrink-0 text-xs text-slate-500">Mock {i + 1}</span>
        <div className="min-w-0 flex-1"><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(100, Math.max(0, t.percentOfMax))}%` }}/></div></div>
        <span className="w-20 shrink-0 text-right text-sm font-bold tabular-nums">{t.score}/{t.maxMarks}</span>
      </div>)}</div>}
      <p className="mt-5 text-xs text-slate-500">Only recorded question time: {formatTime(data.overview.questionTimeSeconds)}. This does not measure the full examination wall-clock duration.</p>
    </div>}

    {active === "plan" && <div role="tabpanel" id="afcat-perf-plan" aria-labelledby="afcat-perf-tab-plan" className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="flex items-center gap-2 font-bold"><Target className="h-5 w-5 text-blue-700"/> Evidence-based next actions</h3>
      {data.priorities.length ? <ol className="mt-4 space-y-3">{data.priorities.map((p, i) => <li key={p.section + p.topic} className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="font-bold">{i + 1}. Revise {p.topic}</p>
        <p className="mt-1 text-sm text-slate-700">{p.reason}</p>
        <p className="mt-2 text-xs text-slate-500">{p.total} questions seen · {p.marksLost} theoretical marks lost. No prediction of recoverable marks.</p>
      </li>)}</ol> : <p className="mt-3 text-sm text-slate-600">No topic has sufficient evidence for a confident priority yet. Review your attempts and complete another mock.</p>}
      {latestSessionId && <Link href={`/afcat/lab?session=${encodeURIComponent(latestSessionId)}`} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800">Review latest completed mock <ArrowRight className="h-4 w-4"/></Link>}
      <p className="mt-3 text-xs text-slate-500">Recommendations are computed from your saved answers, not generated diagnoses or peer rankings.</p>
    </div>}
  </section>;
}
