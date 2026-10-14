import "server-only";
import { createClient as createCanonicalClient } from "@supabase/supabase-js";
import { getCurrentAffairsByDate } from "@/lib/current-affairs";
import { createClient } from "@/lib/supabase/server";
import { isContentEligible } from "@/lib/content-quality";

// Public Phase 1 allowlist. Never accept source identities from URL parameters.
export const MONTHLY_EDITION = {
  id: "2026-10", label: "October 2026", price: 79,
  date: "2026-10-14",
  postId: "852e10da-5c7a-4c0f-b380-67f6312cbb48",
  storyId: "bcadb490-b39a-4f11-befd-fa8e15bf480b",
  approvedSourceHash: "9c543435b083a0d0be572eaef2bfe867b6ac16f77a4192cfe476bca0023ce112",
  headline: "First BIMSTEC Home Ministers’ Meeting Adopts Delhi Declaration",
  pyqIds: ["CDS_I_2026_GK_099", "CAPF_2022_P1_125"],
} as const;

export function isMonthlyEdition(id: string) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(id) && id === MONTHLY_EDITION.id;
}

export async function getMonthlySample() {
  const post = await getCurrentAffairsByDate(MONTHLY_EDITION.date);
  if (!post || post.id !== MONTHLY_EDITION.postId || post.approvedSourceHash !== MONTHLY_EDITION.approvedSourceHash) return null;
  const story = post.stories.find(item => item.id === MONTHLY_EDITION.storyId);
  if (!story || story.headline !== MONTHLY_EDITION.headline || story.subject !== "International Relations" || !story.editorialMarkdown) return null;
  // The read model marks MCQs backed by the preserved approved source.
  const questions = story.mcqs.filter(question => question.approved);
  const allowed = MONTHLY_EDITION.pyqIds.filter(id => story.linkedPyqIds.includes(id));
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return { story, questions, pyqs: [], approvedSourceHash: post.approvedSourceHash };
  // This view's underlying intelligence table is private. Match the existing
  // practice API's server-only privileged read without broadening database grants.
  const canonical = createCanonicalClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key,
    { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await canonical.from("v_dp_question_intelligence_v2")
    .select("question_id,exam,year,cycle,q_num,content_status,content_eligible,question,opt_a,opt_b,opt_c,opt_d,final_opt")
    .eq("content_eligible", true).in("question_id", allowed);
  // Never serialize answer keys or canonical PYQ prompts to the public page.
  const pyqs = error ? [] : allowed.flatMap(id => {
    const matches = (data ?? []).filter(row => row.question_id === id && isContentEligible(row));
    return matches.length === 1 ? [{ id, exam: String(matches[0].exam), year: Number(matches[0].year), number: Number(matches[0].q_num) }] : [];
  });
  return { story, questions, pyqs, approvedSourceHash: post.approvedSourceHash };
}

export async function monthlyEventContext(surface: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { edition_id: MONTHLY_EDITION.id, source_surface: surface,
    auth_state: user ? "authenticated" : "guest",
    deployment_environment: process.env.VERCEL_ENV ?? "development" };
}
