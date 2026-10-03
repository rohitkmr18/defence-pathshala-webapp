import { requireBackendUrl } from "@/lib/backend-config";
import { createClient } from "@/lib/supabase/server";



export interface DashboardSnapshot {
  question_bank: number;
  subjects: number;
  exams: number;
  years: number;
  questions_attempted: number;
  accuracy: number;
  current_streak: number;
  avoidable_marks: number;
}

export async function getAnalytics(): Promise<DashboardSnapshot> {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(`${requireBackendUrl()}/analytics/dashboard`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load analytics");
  }

  return response.json();
}

export interface SubjectAnalytics {
  subject: string;
  questions: number;
}

export async function getSubjectAnalytics(): Promise<SubjectAnalytics[]> {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(
    `${requireBackendUrl()}/analytics/subjects`,
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load subject analytics");
  }

  return response.json();
}