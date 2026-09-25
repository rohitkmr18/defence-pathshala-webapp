"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { PracticeQuestion, OptionKey } from "@/lib/practice-types";
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
}

export default function FullPaperClient({
  initialExam,
  initialYear,
  initialCycle,
}: FullPaperClientProps) {
  // Resolve initial paper based on query params or default to CAPF AC 2025
  const initialPaper =
    AVAILABLE_FULL_PAPERS.find((p) => {
      const examMatches =
        initialExam &&
        (p.exam === initialExam ||
          p.label.toLowerCase().includes(initialExam.toLowerCase()) ||
          p.exam.replace(/-/g, " ").toLowerCase() === initialExam.replace(/-/g, " ").toLowerCase());
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

  // Time remaining countdown
  const [timeRemaining, setTimeRemaining] = useState(selectedPaper.durationSeconds);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch questions for the selected exam paper from Supabase
  const loadPaperQuestions = useCallback(async (paper: FullPaperDefinition) => {
    setLoading(true);
    setAnswers({});
    setMarkedForReview(new Set());
    setVisited(new Set());
    setCurrentIndex(0);
    setTimeRemaining(paper.durationSeconds);
    setIsSubmitted(false);

    try {
      const params = new URLSearchParams();
      params.set("exam", paper.exam);
      params.set("year", paper.year.toString());
      if (paper.cycle) {
        params.set("cycle", paper.cycle);
      }
      params.set("limit", "150"); // Full paper capacity

      const res = await fetch(`/api/practice/questions?${params.toString()}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const data = (await res.json()) as { questions: PracticeQuestion[] };
        const fetchedQuestions = data.questions || [];
        setQuestions(fetchedQuestions);
        if (fetchedQuestions.length > 0 && fetchedQuestions[0]) {
          setVisited(new Set([fetchedQuestions[0].id]));
        }
      } else {
        setQuestions([]);
      }
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load questions when selected paper changes
  useEffect(() => {
    void loadPaperQuestions(selectedPaper);
  }, [selectedPaper, loadPaperQuestions]);

  // Paper switcher handler
  const handleSelectPaperById = useCallback((paperId: string) => {
    const nextPaper = AVAILABLE_FULL_PAPERS.find((p) => p.id === paperId);
    if (nextPaper) {
      setSelectedPaper(nextPaper);
    }
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (loading || isSubmitted || !questions || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, isSubmitted, questions]);

  // Update visited state on question navigation
  const navigateToQuestion = useCallback(
    (index: number) => {
      if (!questions || !questions[index]) return;
      setCurrentIndex(index);
      setVisited((prev) => new Set(prev).add(questions[index].id));
    },
    [questions]
  );

  const activeQuestion = questions?.[currentIndex];
  const questionIds = questions ? questions.map((q) => q.id) : [];

  const handleSelectOption = useCallback(
    (key: OptionKey) => {
      if (!activeQuestion || isSubmitted) return;
      setAnswers((prev) => ({ ...prev, [activeQuestion.id]: key }));
    },
    [activeQuestion, isSubmitted]
  );

  const handleClearResponse = useCallback(() => {
    if (!activeQuestion || isSubmitted) return;
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[activeQuestion.id];
      return next;
    });
  }, [activeQuestion, isSubmitted]);

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

  const handleConfirmSubmit = useCallback(() => {
    setIsSubmitModalOpen(false);
    setIsSubmitted(true);
  }, []);

  const handleRetake = useCallback(() => {
    setAnswers({});
    setMarkedForReview(new Set());
    setVisited(new Set(questions?.[0] ? [questions[0].id] : []));
    setCurrentIndex(0);
    setTimeRemaining(selectedPaper.durationSeconds);
    setIsSubmitted(false);
  }, [questions, selectedPaper]);

  // Loading view
  if (loading) {
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
          href="/dashboard/practice"
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
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
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
