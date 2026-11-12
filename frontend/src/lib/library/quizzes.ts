import type { LibraryQuiz } from "./quiz";
import { BIOLOGY_DECODED_QUIZ } from "./quiz-biology-decoded";
import { CHEMISTRY_DECODED_QUIZ } from "./quiz-chemistry-decoded";
import { VOCAB_DECODED_QUIZ } from "./quiz-vocab-decoded";
import { POLITY_DECODED_QUIZ } from "./quiz-polity-decoded";

export const LIBRARY_QUIZZES: Record<string, LibraryQuiz> = {
  [BIOLOGY_DECODED_QUIZ.slug]: BIOLOGY_DECODED_QUIZ,
  [POLITY_DECODED_QUIZ.slug]: POLITY_DECODED_QUIZ,
  [CHEMISTRY_DECODED_QUIZ.slug]: CHEMISTRY_DECODED_QUIZ,
  [VOCAB_DECODED_QUIZ.slug]: VOCAB_DECODED_QUIZ,
};

export function getLibraryQuiz(slug: string): LibraryQuiz | null {
  return LIBRARY_QUIZZES[slug] ?? null;
}
