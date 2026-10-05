"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, LogIn, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
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
  const [submissionPending, setSubmissionPending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);
  const questionTopRef = useRef<HTMLDivElement | null>(null);
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
            setSubmissionPending(Boolean(saved.submission_pending));
            setMarkedForReview(new Set(saved.marked_for_review_ids || []));
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

  // Update visited state on question navigation
  const navigateToQuestion = useCallback(
    (index: number) => {
      if (submitting.current || submissionPending || !questions || !questions[index]) return;
      setCurrentIndex(index);
      if (sessionId) updateSessionProgress(sessionId, { current_index: index });
      setVisited((prev) => new Set(prev).add(questions[index].id));
      window.requestAnimationFrame(() => {
        questionTopRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
      });
    },
    [questions, sessionId, submissionPending]
  );

  const activeQuestion = questions?.[currentIndex];
  const questionIds = questions ? questions.map((q) => q.id) : [];

  const handleSelectOption = useCallback(
    (key: OptionKey) => {
      if (!activeQuestion || isSubmitted || submissionPending || timeRemaining === 0 || submitting.current) return;
      const next = { ...answers, [activeQuestion.id]: key };
      setAnswers(next);
      if (sessionId) updateSessionProgress(sessionId, { answers: next });
    },
    [activeQuestion, isSubmitted, submissionPending, answers, sessionId, timeRemaining]
  );

  const handleClearResponse = useCallback(() => {
    if (!activeQuestion || isSubmitted || submissionPending || timeRemaining === 0 || submitting.current) return;
    const next = { ...answers };
    delete next[activeQuestion.id];
    setAnswers(next);
    if (sessionId) updateSessionProgress(sessionId, { answers: next });
  }, [activeQuestion, isSubmitted, submissionPending, answers, sessionId, timeRemaining]);

  const handleToggleMarkForReview = useCallback(() => {
    if (!activeQuestion || submissionPending || submitting.current) return;
    const next = new Set(markedForReview);
    if (next.has(activeQuestion.id)) {
      next.delete(activeQuestion.id);
    } else {
      next.add(activeQuestion.id);
    }
    setMarkedForReview(next);
    if (sessionId) {
      updateSessionProgress(sessionId, { marked_for_review_ids: Array.from(next) });
    }
  }, [activeQuestion, markedForReview, sessionId, submissionPending]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      navigateToQuestion(currentIndex - 1);
    }
  }, [currentIndex, navigateToQuestion]);

  const handleSaveAndNext = useCallback(() => {
    if (!questions || submissionPending || submitting.current) return;
    if (currentIndex < questions.length - 1) {
      navigateToQuestion(currentIndex + 1);
    } else {
      setIsSubmitModalOpen(true);
    }
  }, [currentIndex, questions, navigateToQuestion, submissionPending]);

  const handleSkip = useCallback(() => {
    if (!questions || submissionPending || submitting.current) return;
    if (currentIndex < questions.length - 1) {
      navigateToQuestion(currentIndex + 1);
    } else {
      setIsSubmitModalOpen(true);
    }
  }, [currentIndex, questions, navigateToQuestion, submissionPending]);

  const handleConfirmSubmit = useCallback(async () => {
    if (submitting.current || !sessionId || !questions || isAuthenticated !== true) return;
    submitting.current = true;
    setIsSubmitting(true);
    setSubmissionPending(true);
    setIsSubmitModalOpen(false);
    setSubmissionError(null);
    try {
      await completePracticeSession({ sessionId, questions, answers, mode: "full_paper",
        timeSpentSeconds: selectedPaper.durationSeconds - timeRemaining });
      setSubmissionPending(false);
      setIsSubmitted(true);
      trackLearningEvent("practice_complete", { mode: "full_paper" }, sessionId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setSubmissionError(
        /sign in|account|auth/i.test(message)
          ? "We could not confirm your account session. Your final answers are still safe on this device."
          : "We could not confirm cloud submission yet. Your final answers are safe on this device."
      );
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  }, [sessionId, questions, answers, selectedPaper.durationSeconds, timeRemaining, isAuthenticated]);

  // Authentication and session creation must finish before the timer starts.
  useEffect(() => {
    if (loading || isSubmitted || submissionPending || isSubmitting || !cloudReady || isAuthenticated !== true || !sessionId || !questions?.length || timeRemaining === 0) return;
    timerRef.current = setInterval(() => setTimeRemaining(prev => Math.max(0, prev - 1)), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [loading, isSubmitted, submissionPending, isSubmitting, cloudReady, isAuthenticated, sessionId, questions, timeRemaining]);
  useEffect(() => {
    if (timeRemaining !== 0 || isSubmitted || submissionPending) return;
    const timeout = setTimeout(() => { void handleConfirmSubmit(); }, 0);
    return () => clearTimeout(timeout);
  }, [timeRemaining, isSubmitted, submissionPending, handleConfirmSubmit]);

  // Submission recovery is automatic. The learner should not have to understand
  // persistence internals after spending two hours on a paper.
  useEffect(() => {
    if (!submissionPending || isSubmitted || isSubmitting) return;
    const retry = () => { void handleConfirmSubmit(); };
    window.addEventListener("online", retry);
    const retryTimer = window.setTimeout(() => {
      if (navigator.onLine) retry();
    }, 12000);
    return () => {
      window.removeEventListener("online", retry);
      window.clearTimeout(retryTimer);
    };
  }, [submissionPending, isSubmitted, isSubmitting, handleConfirmSubmit]);

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
    setSubmissionPending(false);
    setIsSubmitting(false);
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
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-lg">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">Preparing your full mock</h2>
          <p className="mt-1 text-sm text-slate-500">{selectedPaper.label}</p>
          <div className="mt-5 space-y-2 text-left text-xs text-slate-600">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Locking exam configuration</div>
            <div className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin text-blue-600" /> Loading authentic PYQs and saved progress</div>
            <div className="flex items-center gap-2 text-slate-400"><Sparkles className="h-4 w-4" /> Preparing exam workspace</div>
          </div>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-blue-600" />
          </div>
        </div>
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
        <PracticePersistenceStatus questions={questions || []} variant="exam" />
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
      <PracticePersistenceStatus questions={questions || []} variant="exam" />
      {submissionPending && (
        <div role={submissionError ? "alert" : "status"} className="mx-4 mt-3 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-3.5 py-3 text-sm text-slate-700 sm:mx-6">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900">
              {isSubmitting ? "Submitting your paper…" : "Your paper is safe on this device"}
            </p>
            <p className="mt-0.5 text-xs leading-5 text-slate-600">
              {isSubmitting
                ? "We are reconciling your final answers with your account."
                : "Submission is pending. We will retry automatically when the connection is available."}
            </p>
            {submissionError && <p className="mt-1 text-xs text-slate-600">{submissionError}</p>}
          </div>
          {!isSubmitting && (
            <button type="button" onClick={() => void handleConfirmSubmit()} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50">
              <RefreshCw className="h-3.5 w-3.5" />
              Retry now
            </button>
          )}
        </div>
      )}
      {/* Sticky exam identity, live timer & submit CTA */}
      <ExamHeader
        examTitle={selectedPaper.label}
        timeRemaining={timeRemaining}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        onSubmitClick={() => submissionPending ? void handleConfirmSubmit() : setIsSubmitModalOpen(true)}
        isSubmitting={isSubmitting}
        submissionPending={submissionPending}
      />

      {/* Main Examination Workspace */}
      <main className="mx-auto max-w-7xl px-4 py-6 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-6 lg:pb-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Active Question + Action Toolbar */}
          <div className="space-y-4 lg:col-span-8">
            <div ref={questionTopRef} className="scroll-mt-28" />
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
              onSkip={handleSkip}
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

      {submissionPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm" role="status" aria-live="polite">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                {submissionError ? <ShieldCheck className="h-5 w-5" /> : <Loader2 className="h-5 w-5 animate-spin" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {submissionError ? "Your paper is safe" : "Finishing your mock"}
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {submissionError
                    ? "Your final responses are secured on this device. Cloud submission will retry automatically."
                    : "You are done. We are safely closing the attempt and preparing your debrief."}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm">
              <div className="flex items-center gap-3 text-slate-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Final answers secured on this device</span>
              </div>
              <div className="flex items-center gap-3 text-slate-800">
                {submissionError ? <RefreshCw className="h-4 w-4 text-amber-600" /> : <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                <span>{submissionError ? "Waiting to confirm cloud submission" : "Saving attempts to your account"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Sparkles className="h-4 w-4" />
                <span>Preparing score, accuracy and weak-area analysis</span>
              </div>
            </div>

            {!submissionError && (
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-3/4 animate-pulse rounded-full bg-blue-600" />
              </div>
            )}

            {submissionError && (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => void handleConfirmSubmit()}
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                >
                  <RefreshCw className={`h-4 w-4 ${isSubmitting ? "animate-spin" : ""}`} />
                  {isSubmitting ? "Retrying…" : "Retry submission now"}
                </button>
                <p className="mt-2 text-center text-xs text-slate-500">You can safely keep this screen open; no answer needs to be re-entered.</p>
              </div>
            )}
          </div>
        </div>
      )}

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
