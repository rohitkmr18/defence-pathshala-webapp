import { createClient } from "@/lib/supabase/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

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

  const response = await fetch(`${BACKEND_URL}/analytics/dashboard`, {
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
    `${BACKEND_URL}/analytics/subjects`,
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