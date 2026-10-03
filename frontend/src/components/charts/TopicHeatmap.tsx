"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Search,
  ArrowUpRight,
  Layers,
  ArrowLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";

import { buildExploreUrl, buildPracticeUrl, parseFiltersFromSearchParams } from "@/lib/question-filters";
import { trackLearningEvent } from "@/lib/learning-events";

interface SubjectItem {
  name: string;
  value: number;
}

interface TopicItem {
  name: string;
  value: number;
}

interface TopicHeatmapProps {
  subjects?: SubjectItem[];
  subjectTopics?: Record<string, TopicItem[]>;
  topics?: TopicItem[];
  totalQuestions: number;
  selectedSubject?: string | null;
  selectedExams?: string[];
  selectedYears?: number[];
  selectedCycles?: string[];
  returnTo?: string;
  onSelectSubject?: (subject: string | null) => void;
}

export default function TopicHeatmap({
  subjects = [],
  subjectTopics = {},
  topics = [],
  totalQuestions,
  selectedSubject: propSelectedSubject,
  selectedExams = [],
  selectedYears = [],
  selectedCycles = [],
  returnTo,
  onSelectSubject,
}: TopicHeatmapProps) {
  // Support both controlled and uncontrolled selectedSubject
  const [internalSubject, setInternalSubject] = useState<string | null>(null);
  const selectedSubject =
    propSelectedSubject !== undefined ? propSelectedSubject : internalSubject;

  // Search and Tier filters for both levels
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState<"all" | "high" | "medium">("all");

  // Derive subjects list
  const activeSubjects = useMemo(() => {
    if (subjects.length > 0) {
      return [...subjects].sort((a, b) => b.value - a.value);
    }
    // Fallback if subjects not provided
    const keys = Object.keys(subjectTopics);
    if (keys.length > 0) {
      return keys
        .map((name) => ({
          name,
          value: subjectTopics[name].reduce((acc, curr) => acc + curr.value, 0),
        }))
        .sort((a, b) => b.value - a.value);
    }
    return [];
  }, [subjects, subjectTopics]);

  // Max questions among subjects for Level 1 scaling
  const maxSubjectQuestions = useMemo(() => {
    return Math.max(...activeSubjects.map((s) => s.value), 1);
  }, [activeSubjects]);

  // Topics for selected subject (Level 2)
  const currentSubjectTopics = useMemo<TopicItem[]>(() => {
    if (!selectedSubject) return [];
    if (subjectTopics[selectedSubject]?.length) {
      return [...subjectTopics[selectedSubject]].sort((a, b) => b.value - a.value);
    }
    // Fallback: match general topics if matching prefix or name
    return topics.filter(
      (t) =>
        t.name.toLowerCase().includes(selectedSubject.toLowerCase()) ||
        selectedSubject.toLowerCase().includes(t.name.toLowerCase())
    );
  }, [selectedSubject, subjectTopics, topics]);

  // Current subject stats
  const currentSubjectObj = useMemo(() => {
    if (!selectedSubject) return null;
    return activeSubjects.find((s) => s.name === selectedSubject) ?? null;
  }, [selectedSubject, activeSubjects]);

  const currentSubjectTotal = useMemo(() => {
    if (currentSubjectObj) return currentSubjectObj.value;
    return currentSubjectTopics.reduce((acc, t) => acc + t.value, 0) || 1;
  }, [currentSubjectObj, currentSubjectTopics]);

  const maxTopicQuestions = useMemo(() => {
    return Math.max(...currentSubjectTopics.map((t) => t.value), 1);
  }, [currentSubjectTopics]);

  // Filtered subjects for Level 1
  const filteredSubjects = useMemo(() => {
    let result = [...activeSubjects];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q));
    }
    if (filterTier === "high") {
      result = result.filter((s) => s.value >= maxSubjectQuestions * 0.6);
    } else if (filterTier === "medium") {
      result = result.filter(
        (s) =>
          s.value >= maxSubjectQuestions * 0.3 &&
          s.value < maxSubjectQuestions * 0.6
      );
    }
    return result;
  }, [activeSubjects, searchQuery, filterTier, maxSubjectQuestions]);

  // Filtered topics for Level 2
  const filteredTopics = useMemo(() => {
    let result = [...currentSubjectTopics];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q));
    }
    if (filterTier === "high") {
      result = result.filter((t) => t.value >= maxTopicQuestions * 0.6);
    } else if (filterTier === "medium") {
      result = result.filter(
        (t) =>
          t.value >= maxTopicQuestions * 0.3 && t.value < maxTopicQuestions * 0.6
      );
    }
    return result;
  }, [currentSubjectTopics, searchQuery, filterTier, maxTopicQuestions]);

  // Three-intensity Heatmap Styling System (DP Brand Guidelines & WCAG AA)
  const getIntensityStyling = (value: number, maxVal: number) => {
    const ratio = value / (maxVal || 1);

    if (ratio >= 0.6) {
      // High: DP Dark Accent (strong branded blue)
      return {
        bg: "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/15",
        badge: "bg-white/20 text-white border-white/25",
        textMuted: "text-blue-100",
        tag: "High Yield",
        tagClass: "bg-blue-500/80 text-white",
        iconClass: "text-blue-200",
        chevronClass: "text-white/80 group-hover:text-white",
      };
    }
    if (ratio >= 0.3) {
      // Medium: DP Primary
      return {
        bg: "bg-blue-50/90 border-blue-200/90 text-blue-950 hover:bg-blue-100/70",
        badge: "bg-blue-600 text-white shadow-2xs",
        textMuted: "text-blue-700 font-medium",
        tag: "Medium Yield",
        tagClass: "bg-blue-100 text-blue-800 border border-blue-200",
        iconClass: "text-blue-600",
        chevronClass: "text-blue-600 group-hover:text-blue-800",
      };
    }
    // Low: DP Light (muted blue/grey)
    return {
      bg: "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100/80",
      badge: "bg-slate-200 text-slate-800",
      textMuted: "text-slate-500",
      tag: "Standard Yield",
      tagClass: "bg-slate-100 text-slate-600 border border-slate-200/60",
      iconClass: "text-slate-400",
      chevronClass: "text-slate-400 group-hover:text-slate-700",
    };
  };

  const handleSelectSubject = (subjectName: string) => {
    if (onSelectSubject) {
      onSelectSubject(subjectName);
    } else {
      setInternalSubject(subjectName);
    }
    setSearchQuery("");
    setFilterTier("all");
  };

  const handleBackToSubjects = () => {
    if (onSelectSubject) {
      onSelectSubject(null);
    } else {
      setInternalSubject(null);
    }
    setSearchQuery("");
    setFilterTier("all");
  };

  return (
    <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
      <AnimatePresence mode="wait" initial={false}>
        {!selectedSubject ? (
          /* ══════════════════════════════════════════════════════════════════
             LEVEL 1: SUBJECT HEATMAP
             ══════════════════════════════════════════════════════════════════ */
          <motion.div
            key="level-1-subjects"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 shadow-2xs">
                  <Flame className="h-3.5 w-3.5 text-blue-600" />
                  <span>SUBJECT RECURRENCE HEATMAP</span>
                </div>
                <h2 className="mt-2.5 text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  Syllabus Density & Yield Distribution
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                  Tap any subject to drill down into its high-yield topics and topic recurrence
                </p>
              </div>

              {/* Three-intensity Legend */}
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Yield Intensity:
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-2xs">
                  High (Top Tier)
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-800 border border-blue-200">
                  Medium
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  Standard
                </span>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setFilterTier("all")}
                  className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    filterTier === "all"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All Subjects ({activeSubjects.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTier("high")}
                  className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
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
                  className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    filterTier === "medium"
                      ? "bg-blue-50 text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Medium Yield
                </button>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subject..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Subject Heatmap Grid */}
            {filteredSubjects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                <Layers className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-700">No subjects match your filter</p>
                <p className="text-xs text-slate-400 mt-1">Try clearing your search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {filteredSubjects.map((subject) => {
                  const style = getIntensityStyling(subject.value, maxSubjectQuestions);
                  const percent = (
                    (subject.value / (totalQuestions || 1)) *
                    100
                  ).toFixed(1);
                  const topicCount = subjectTopics[subject.name]?.length || 0;

                  return (
                    <div
                      key={subject.name}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectSubject(subject.name)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelectSubject(subject.name);
                        }
                      }}
                      className={`group relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:shadow-md active:scale-[0.98] min-h-[140px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${style.bg}`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${style.tagClass}`}
                          >
                            {style.tag}
                          </span>
                          <span
                            className={`flex h-6 px-2 items-center justify-center rounded-lg text-xs font-black shrink-0 ${style.badge}`}
                          >
                            {subject.value} Qs
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-black tracking-tight line-clamp-1">
                          {subject.name}
                        </h3>

                        {topicCount > 0 && (
                          <p className={`mt-1 text-[11px] font-semibold ${style.textMuted}`}>
                            {topicCount} topics analyzed
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                        <span className={`${style.textMuted} text-[11px] font-semibold`}>
                          {percent}% of paper
                        </span>

                        <span className={`inline-flex items-center gap-1 font-bold text-xs ${style.chevronClass} transition-transform group-hover:translate-x-0.5`}>
                          <span>Explore Topics</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          /* ══════════════════════════════════════════════════════════════════
             LEVEL 2: TOPIC HEATMAP FOR SELECTED SUBJECT
             ══════════════════════════════════════════════════════════════════ */
          <motion.div
            key={`level-2-${selectedSubject}`}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {/* Back Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
              <button
                type="button"
                onClick={handleBackToSubjects}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 hover:text-blue-700 transition active:scale-95 cursor-pointer min-h-[44px]"
                aria-label="Back to Subjects"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>← Back to Subjects</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="text-slate-400">Subjects</span>
                <span className="text-slate-300">/</span>
                <span className="font-bold text-blue-600">{selectedSubject}</span>
              </div>
            </div>

            {/* Subject Banner / Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 shadow-2xs">
                  <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                  <span>{selectedSubject.toUpperCase()} TOPIC DRILL-DOWN</span>
                </div>
                <h2 className="mt-2.5 text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  {selectedSubject} — Topic Yield Heatmap
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                  {currentSubjectTotal} questions across {currentSubjectTopics.length} topics in {selectedSubject}
                </p>
              </div>

              {/* Intensity Legend */}
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Topic Density:
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-2xs">
                  High Yield
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-800 border border-blue-200">
                  Medium
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  Standard
                </span>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setFilterTier("all")}
                  className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    filterTier === "all"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All Topics ({currentSubjectTopics.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTier("high")}
                  className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
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
                  className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    filterTier === "medium"
                      ? "bg-blue-50 text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Medium Yield
                </button>
              </div>

              {/* Search in Topic */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${selectedSubject} topics...`}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Topic Heatmap Cards Grid */}
            {filteredTopics.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                <Layers className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-700">No topics match your filter</p>
                <p className="text-xs text-slate-400 mt-1">Try clearing your search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {filteredTopics.map((topic) => {
                  const style = getIntensityStyling(topic.value, maxTopicQuestions);
                  const pctOfSubject = (
                    (topic.value / (currentSubjectTotal || 1)) *
                    100
                  ).toFixed(1);

                  return (
                    <div
                      key={topic.name}
                      className={`group relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] min-h-[140px] ${style.bg}`}
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

                        <h3 className="text-sm sm:text-base font-bold tracking-tight line-clamp-2">
                          {topic.name}
                        </h3>
                      </div>

                      <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                        <span className={`${style.textMuted} text-[11px]`}>
                          {pctOfSubject}% of {selectedSubject}
                        </span>

                        <Link
                          onClick={() => trackLearningEvent("explore_practice", { subject: selectedSubject || undefined, topic: topic.name, origin: "explore" })}
                          href={buildPracticeUrl(
                            {
                              ...parseFiltersFromSearchParams(new URLSearchParams(returnTo?.split("?")[1] || "")),
                              exams: selectedExams,
                              years: selectedYears,
                              cycles: selectedCycles,
                              subjects: selectedSubject ? [selectedSubject] : [],
                              topics: [topic.name],
                              subtopics: [],
                              origin: "explore",
                            },
                            { returnTo: buildExploreUrl({ ...parseFiltersFromSearchParams(new URLSearchParams(returnTo?.split("?")[1] || "")),
                              subjects: selectedSubject ? [selectedSubject] : [], topics: [topic.name], subtopics: [], origin: "explore" }) }
                          )}
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
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
