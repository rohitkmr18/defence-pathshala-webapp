import type { PracticeQuestion } from "./practice-types";

export const EXACT_PYQ_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$/;

/** Allowlist the prompt; intelligence/source fields can contain answer hints. */
export function questionBeforeAttempt(q: PracticeQuestion): PracticeQuestion {
  return { id: q.id, question_id: q.question_id, content_version: q.content_version,
    content_status: q.content_status, exam: q.exam, year: q.year, cycle: q.cycle,
    paper: q.paper, q_num: q.q_num, subject: q.subject, topic: q.topic,
    question: q.question, opt_a: q.opt_a, opt_b: q.opt_b, opt_c: q.opt_c, opt_d: q.opt_d };
}
