import { mockAdmin } from "@/lib/mock/server";
import { MOCK_PAPER_CDS_GK } from "@/lib/mock/engine";
import { afcatStagingAdmin } from "@/lib/afcat/staging-server";
import { afcatMockLabel } from "@/lib/afcat/mock-labels";

export type PublicMock = {
  id: string;
  code: string;
  title: string;
  expected_questions: number;
  duration_seconds: number;
  max_marks: number;
};
export type PublicAfcatMock = PublicMock & { kind: string };

export async function loadCdsPublicMocks(): Promise<PublicMock[] | null> {
  try {
    const { data, error } = await mockAdmin().from("mock_tests")
      .select("id,code,title,expected_questions,duration_seconds,max_marks")
      .eq("status", "PUBLISHED").eq("paper_id", MOCK_PAPER_CDS_GK).order("code");
    if (error) throw error;
    return data ?? [];
  } catch {
    return null;
  }
}

export async function loadAfcatPublicMocks(): Promise<PublicAfcatMock[] | null> {
  try {
    const { data, error } = await afcatStagingAdmin().from("afcat_tests")
      .select("id,code,title,kind,expected_questions,duration_seconds,max_marks")
      .eq("status", "PUBLISHED").eq("kind", "FULL_MOCK").like("code", "AFCAT-FM%").order("code");
    if (error) throw error;
    return (data ?? []).map(t => ({ ...t, title: afcatMockLabel(t.code, t.title) }));
  } catch {
    return null;
  }
}
