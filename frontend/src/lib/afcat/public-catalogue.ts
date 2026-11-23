import { afcatStagingAdmin } from "@/lib/afcat/staging-server";
import { afcatMockLabel } from "@/lib/afcat/mock-labels";

/**
 * Public catalogue only: use the same publication and environment rules as
 * /api/afcat/tests. Never expose questions, answer keys, or private attempts.
 * This is intentionally uncached so withdrawn mocks stop appearing immediately.
 */
export async function getPublishedAfcatMocks() {
  const db = afcatStagingAdmin();
  const { data, error } = await db.from("afcat_tests")
    .select("id,code,kind,section,title,duration_seconds,expected_questions,max_marks,release_version")
    .eq("status", "PUBLISHED").eq("kind", "FULL_MOCK").like("code", "AFCAT-FM%").order("code");
  if (error) throw error;
  return (data ?? []).map((test) => ({
    ...test,
    title: afcatMockLabel(test.code, test.title),
  }));
}
