"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, LogIn } from "lucide-react";
import type { PracticeQuestion, OptionKey } from "@/lib/practice-types";
import { createClient } from "@/lib/supabase/client";
import { authUrl } from "@/lib/auth-redirect";
import { fullPaperDestination } from "@/lib/full-paper-intent";
import { safeLearningReturn } from "@/lib/learning-navigation";
import { trackLearningEvent } from "@/lib/learning-events";
import { initializeSession, completePracticeSession, updateSessionProgress, loadResumeSession, restoreQuestionOrder, saveLocalSession, getLocalSession, PRACTICE_SESSION_UPDATED_EVENT } from "@/lib/practice-session-client";
import PracticePersistenceStatus from "@/components/practice/PracticePersistenceStatus";
import QuestionCard from "@/components/practice/player/QuestionCard";
import ExamHeader from "@/components/practice/full-paper/ExamHeader";
import QuestionPalette from "@/components/practice/full-paper/QuestionPalette";
import ExamActionToolbar from "@/components/practice/full-paper/ExamActionToolbar";
import SubmitModal from "@/components/practice/full-paper/SubmitModal";
import FullPaperDebrief from "@/components/practice/analysis/FullPaperDebrief";
import { AVAILABLE_FULL_PAPERS, FullPaperDefinition } from "@/components/practice/FullPaperHero";

interface FullPaperClientProps {
  initialExam?: string;
  initialYear?: string;
  initialCycle?: string;
  returnTo?: string;
  origin?: string;
}

export default function FullPaperClient({
  initialExam,
  initialYear,
  initialCycle,
  returnTo,
  origin,
}: FullPaperClientProps) {
  const router = useRouter();
  // Resolve initial paper based on query params or default to most recent exam (CDS II 2026)
  const initialPaper =
    AVAILABLE_FULL_PAPERS.find((p) => {
      const examMatches =
        !initialExam ||
        p.exam.toLowerCase() === initialExam.toLowerCase() ||
        p.label.toLowerCase().includes(initialExam.toLowerCase()) ||
        p.exam.replace(/-/g, " ").toLowerCase() === initialExam.replace(/-/g, " ").toLowerCase();
      const yearMatches = !initialYear || p.year === parseInt(initialYear, 10);
      const cycleMatches = !initialCycle || p.cycle === initialCycle;
      return examMatches && yearMatches && cycleMatches;
    }) || AVAILABLE_FULL_PAPERS[0]!;

  const [selectedPaper, setSelectedPaper] = useState<FullPaperDefinition>(initialPaper);
  const [questions, setQuestions] = useState<PracticeQuestion[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Exam session states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, OptionKey>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState<string>();
  useEffect(() => {
    if (!sessionId) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("session_id") === sessionId && url.searchParams.get("resume") === "true") return;
    url.searchParams.set("resume", "true"); url.searchParams.set("session_id", sessionId);
    router.replace(`${url.pathname}${url.search}`, { scroll: false });
  }, [sessionId, router]);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const submitting = useRef(false);
  const [cloudReady, setCloudReady] = useState(false);
  useEffect(() => {
    const refresh = () => {
      const local = getLocalSession();
      setCloudReady(!!local && local.id === sessionId && !!(local.server_id || !local.id.startsWith("sess_")));
    };
    const start = window.setTimeout(refresh, 0);
    window.addEventListener(PRACTICE_SESSION_UPDATED_EVENT, refresh);
    return () => { window.clearTimeout(start); window.removeEventListener(PRACTICE_SESSION_UPDATED_EVENT, refresh); };
  }, [sessionId]);

  // Auth check
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(!!data.user);
    }).catch(() => setIsAuthenticated(false));
  }, []);

  // Time remaining countdown
  const [timeRemaining, setTimeRemaining] = useState(selectedPaper.durationSeconds);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cancel stale paper requests so a slower previous selection cannot win.
  useEffect(() => {
    if (isAuthenticated !== true) return;
    const controller = new AbortController();
    const signal = controller.signal;
    const paper = selectedPaper;
    async function loadPaperQuestions() {
      try {
        const url = new URL(window.location.href);
        const saved = url.searchParams.get("resume") === "true"
          ? await loadResumeSession(url.searchParams.get("session_id") || undefined) : null;
        if (signal.aborted) return;
        if (saved && saved.mode !== "full_paper") throw new Error("This is not a full paper session.");
        const params = new URLSearchParams();
        params.set("exam", paper.exam);
        params.set("year", paper.year.toString());
        if (paper.cycle) {
          params.set("cycle", paper.cycle);
        }
        params.set("limit", saved ? String(saved.question_ids.length) : "150");
        if (saved) params.set("ids", saved.question_ids.join(","));

        const res = await fetch(`/api/practice/questions?${params.toString()}`, {
          cache: "no-store",
          signal,
        });

        if (signal.aborted) return;
        if (res.ok) {
          const data = (await res.json()) as { questions: PracticeQuestion[] };
          if (signal.aborted) return;
          const fetchedQuestions = saved ? restoreQuestionOrder(saved.question_ids, data.questions || []) : data.questions || [];
          const session = saved || await initializeSession({ title: paper.label, mode: "full_paper",
            filters: { exams: [paper.exam], years: [paper.year], cycles: paper.cycle ? [paper.cycle] : [], returnTo, origin }, questions: fetchedQuestions });
          if (saved) {
            saveLocalSession(saved);
            setAnswers(saved.answers);
            setCurrentIndex(saved.current_index);
            setTimeRemaining(Math.max(0, paper.durationSeconds - saved.time_spent_seconds));
            trackLearningEvent("practice_resume", { mode: "full_paper", position: saved.current_index }, `${saved.id}:${saved.updated_at}`);
          } else trackLearningEvent("practice_start", { mode: "full_paper", origin }, session.id);
          if (signal.aborted) return;
          setSessionId(session.id);
          setQuestions(fetchedQuestions);
          if (fetchedQuestions.length > 0 && fetchedQuestions[0]) {
            setVisited(new Set([fetchedQuestions[0].id]));
          }
        } else {
          setQuestions([]);
        }
      } catch (err) {
        if (!signal.aborted) { setSubmissionError(err instanceof Error ? err.message : "Could not load this paper."); setQuestions([]); }
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    }
    const start = window.setTimeout(() => { void loadPaperQuestions(); }, 0);
    return () => { window.clearTimeout(start); controller.abort(); };
  }, [selectedPaper, isAuthenticated, returnTo, origin]);

  // Paper switcher handler
  const handleSelectPaperById = useCallback((paperId: string) => {
    const nextPaper = AVAILABLE_FULL_PAPERS.find((p) => p.id === paperId);
    if (!submitting.current && nextPaper && nextPaper.id !== selectedPaper.id) {
      setLoading(true);
      setSessionId(undefined);
      setSubmissionError(null);
      setAnswers({});
      setMarkedForReview(new Set());
      setVisited(new Set());
      setCurrentIndex(0);
      setTimeRemaining(nextPaper.durationSeconds);
      setIsSubmitted(false);

      setQuestions(null);
      window.history.replaceState(null, "", fullPaperDestination(nextPaper));
      setSelectedPaper(nextPaper);
    }
  }, [selectedPaper.id]);

  // Update visited state on question navigation
  const navigateToQuestion = useCallback(
    (index: number) => {
      if (submitting.current || !questions || !questions[index]) return;
      setCurrentIndex(index);
      if (sessionId) updateSessionProgress(sessionId, { current_index: index });
      setVisited((prev) => new Set(prev).add(questions[index].id));
    },
    [questions, sessionId]
  );

  const activeQuestion = questions?.[currentIndex];
  const questionIds = questions ? questions.map((q) => q.id) : [];

  const handleSelectOption = useCallback(
    (key: OptionKey) => {
      if (!activeQuestion || isSubmitted || timeRemaining === 0 || submitting.current) return;
      const next = { ...answers, [activeQuestion.id]: key };
      setAnswers(next);
      if (sessionId) updateSessionProgress(sessionId, { answers: next });
    },
    [activeQuestion, isSubmitted, answers, sessionId, timeRemaining]
  );

  const handleClearResponse = useCallback(() => {
    if (!activeQuestion || isSubmitted || timeRemaining === 0 || submitting.current) return;
    const next = { ...answers };
    delete next[activeQuestion.id];
    setAnswers(next);
    if (sessionId) updateSessionProgress(sessionId, { answers: next });
  }, [activeQuestion, isSubmitted, answers, sessionId, timeRemaining]);

  const handleToggleMarkForReview = useCallback(() => {
    if (!activeQuestion) return;
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(activeQuestion.id)) {
        next.delete(activeQuestion.id);
      } else {
        next.add(activeQuestion.id);
      }
      return next;
    });
  }, [activeQuestion]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      navigateToQuestion(currentIndex - 1);
    }
  }, [currentIndex, navigateToQuestion]);

  const handleSaveAndNext = useCallback(() => {
    if (!questions) return;
    if (currentIndex < questions.length - 1) {
      navigateToQuestion(currentIndex + 1);
    } else {
      setIsSubmitModalOpen(true);
    }
  }, [currentIndex, questions, navigateToQuestion]);

  const handleConfirmSubmit = useCallback(async () => {
    if (submitting.current || !sessionId || !questions || isAuthenticated !== true) return;
    submitting.current = true;
    setIsSubmitModalOpen(false);
    setSubmissionError(null);
    try {
      await completePracticeSession({ sessionId, questions, answers, mode: "full_paper",
        timeSpentSeconds: selectedPaper.durationSeconds - timeRemaining });
      setIsSubmitted(true);
      trackLearningEvent("practice_complete", { mode: "full_paper" }, sessionId);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "Submission could not be saved.");
    } finally { submitting.current = false; }
  }, [sessionId, questions, answers, selectedPaper.durationSeconds, timeRemaining, isAuthenticated]);

  // Authentication and session creation must finish before the timer starts.
  useEffect(() => {
    if (loading || isSubmitted || !cloudReady || isAuthenticated !== true || !sessionId || !questions?.length || timeRemaining === 0) return;
    timerRef.current = setInterval(() => setTimeRemaining(prev => Math.max(0, prev - 1)), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [loading, isSubmitted, cloudReady, isAuthenticated, sessionId, questions, timeRemaining]);
  useEffect(() => {
    if (timeRemaining !== 0 || isSubmitted || submissionError) return;
    const timeout = setTimeout(() => { void handleConfirmSubmit(); }, 0);
    return () => clearTimeout(timeout);
  }, [timeRemaining, isSubmitted, submissionError, handleConfirmSubmit]);

  useEffect(() => {
    if (!sessionId || isSubmitted) return;
    updateSessionProgress(sessionId, { time_spent_seconds: selectedPaper.durationSeconds - timeRemaining });
  }, [sessionId, timeRemaining, selectedPaper.durationSeconds, isSubmitted]);

  const handleRetake = useCallback(() => {
    if (!questions) return;
    void initializeSession({ title: selectedPaper.label, mode: "full_paper",
      filters: { exams: [selectedPaper.exam], years: [selectedPaper.year], cycles: selectedPaper.cycle ? [selectedPaper.cycle] : [], returnTo, origin },
      questions }).then(session => {
        setSessionId(session.id);
      });
    setSubmissionError(null);
    setAnswers({});
    setMarkedForReview(new Set());
    setVisited(new Set(questions?.[0] ? [questions[0].id] : []));
    setCurrentIndex(0);
    setTimeRemaining(selectedPaper.durationSeconds);
    setIsSubmitted(false);
  }, [questions, selectedPaper, returnTo, origin]);

  // Loading view
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-5 border border-blue-100 shadow-sm">
            <LogIn className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Sign In Required
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Full-length paper simulation requires an account to record your answers, apply official negative marking, and generate comprehensive post-mock analytics.
          </p>
          <div className="mt-6 space-y-3">
            <Link
              href={authUrl("/auth/login", typeof window !== "undefined" ? window.location.pathname + window.location.search : fullPaperDestination(selectedPaper))}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition"
            >
              <LogIn className="h-4 w-4" />
              Sign in to Attempt Full Paper
            </Link>
            <Link
              href={safeLearningReturn(returnTo)}
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Back to Free Targeted Practice
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading || isAuthenticated === null) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-semibold text-slate-700">
          Loading {selectedPaper.label} Examination Questions from Database...
        </p>
      </div>
    );
  }

  // Empty state
  if (!questions || questions.length === 0) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <div className="mb-4 text-5xl">📄</div>
        <h2 className="text-xl font-bold text-slate-900">Paper Not Available</h2>
        <p className="mt-2 text-sm text-slate-500">
          No questions were found for {selectedPaper.label}. Please try selecting a different exam.
        </p>
        <Link
          href={safeLearningReturn(returnTo)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Targeted Practice
        </Link>
      </div>
    );
  }

  // Post-submission Debrief view
  if (isSubmitted) {
    return (
      <div className="px-4 py-6 sm:px-6">
        <PracticePersistenceStatus questions={questions || []} />
        <FullPaperDebrief
          questions={questions}
          answers={answers}
          examTitle={selectedPaper.label}
          totalTimeSpentSeconds={selectedPaper.durationSeconds - timeRemaining}
          onRetake={handleRetake}
        />
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const markedCount = markedForReview.size;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PracticePersistenceStatus questions={questions || []} />
      {submissionError && <p role="alert" className="p-4 text-sm text-amber-900">{submissionError} Retry submission after restoring your connection.</p>}
      {/* Sticky Header with Exam Switcher, Live Timer & Submit CTA */}
      <ExamHeader
        examTitle={selectedPaper.label}
        timeRemaining={timeRemaining}
        totalTime={selectedPaper.durationSeconds}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        onSubmitClick={() => setIsSubmitModalOpen(true)}
        availablePapers={AVAILABLE_FULL_PAPERS}
        selectedPaperId={selectedPaper.id}
        onSelectPaper={handleSelectPaperById}
      />

      {/* Main Examination Workspace */}
      <main className="mx-auto max-w-7xl px-4 py-6 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-6 lg:pb-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Active Question + Action Toolbar */}
          <div className="space-y-4 lg:col-span-8">
            {activeQuestion && (
              <QuestionCard
                question={activeQuestion}
                questionNumber={currentIndex + 1}
                selectedOption={answers[activeQuestion.id] ?? null}
                revealed={false}
                onSelect={handleSelectOption}
              />
            )}

            <ExamActionToolbar
              isFirst={currentIndex === 0}
              isLast={currentIndex === questions.length - 1}
              hasAnswer={Boolean(activeQuestion && answers[activeQuestion.id])}
              isMarked={Boolean(activeQuestion && markedForReview.has(activeQuestion.id))}
              onPrevious={handlePrevious}
              onClearResponse={handleClearResponse}
              onToggleMarkForReview={handleToggleMarkForReview}
              onSaveAndNext={handleSaveAndNext}
            />
          </div>

          {/* Right Column: Question Palette (Sticky) */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-20">
              <QuestionPalette
                total={questions.length}
                questionIds={questionIds}
                currentIndex={currentIndex}
                answers={answers}
                markedForReview={markedForReview}
                visited={visited}
                onSelect={navigateToQuestion}
              />
            </div>
          </aside>
        </div>
      </main>

      {/* Submission Audit Confirmation Modal */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        total={questions.length}
        answered={answeredCount}
        unanswered={unansweredCount}
        marked={markedCount}
        timeRemaining={timeRemaining}
      />
    </div>
  );
}
