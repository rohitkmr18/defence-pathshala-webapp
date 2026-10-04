export type AttemptExecutionState =
  | "strong_execution"
  | "correct_slow"
  | "incorrect_fast"
  | "incorrect_slow";

export interface AttemptInterpretation {
  state: AttemptExecutionState;
  label: string;
  message: string;
  targetSeconds: number;
  paceLabel: "On pace" | "Slow";
}

export function getPaceTargetSeconds(difficulty?: string | null): number {
  switch (difficulty?.trim().toLowerCase()) {
    case "easy":
      return 35;
    case "hard":
      return 60;
    case "moderate":
    case "medium":
    default:
      return 45;
  }
}

/**
 * First-generation deterministic attempt interpretation.
 * This is a DP product benchmark, not an official UPSC time standard.
 */
export function classifyAttempt(
  isCorrect: boolean,
  timeSpentSeconds: number,
  difficulty?: string | null
): AttemptInterpretation {
  const targetSeconds = getPaceTargetSeconds(difficulty);
  const isFast = timeSpentSeconds <= targetSeconds;

  if (isCorrect && isFast) {
    return {
      state: "strong_execution",
      label: "Strong execution",
      message: "Correct and within the DP pace benchmark. Continue.",
      targetSeconds,
      paceLabel: "On pace",
    };
  }

  if (isCorrect) {
    return {
      state: "correct_slow",
      label: "Correct, but slow",
      message: "The concept appears understood, but recall speed needs work.",
      targetSeconds,
      paceLabel: "Slow",
    };
  }

  if (isFast) {
    return {
      state: "incorrect_fast",
      label: "Fast miss",
      message: "Possible guessing or premature elimination. Re-check the concept before moving on.",
      targetSeconds,
      paceLabel: "On pace",
    };
  }

  return {
    state: "incorrect_slow",
    label: "High-cost miss",
    message: "You spent significant time and still missed it. Review this concept before continuing.",
    targetSeconds,
    paceLabel: "Slow",
  };
}
