import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get JWT session for backend authentication
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Fetch onboarding profile from FastAPI
  const response = await fetch("http://127.0.0.1:8000/profile", {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  });

  // If backend auth fails, force re-login
  if (response.status === 401) {
    redirect("/auth/login");
  }

  if (!response.ok) {
  const errorText = await response.text();
  throw new Error(
    `Profile API failed (${response.status}): ${errorText}`
  );
  }

  const profile = await response.json();

  // First-time users must complete onboarding
  if (!profile.onboarding_completed) {
    redirect("/onboarding");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Welcome, {profile.full_name || user.email}
        </h1>

        <p className="text-gray-600">{user.email}</p>

        <div className="mt-6 rounded-xl border p-4">
          <p>
            <strong>Target Year:</strong> {profile.target_year}
          </p>

          <p className="mt-2">
            <strong>Target Exams:</strong>{" "}
            {profile.target_exams.length
              ? profile.target_exams.join(", ")
              : "Not selected"}
          </p>
        </div>
      </div>
    </main>
  );
}