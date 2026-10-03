import type { Profile } from "@/lib/profile/types";

export type SetupInput = { full_name: string; target_year: string; target_exams: string[] };

/** Single-flight saves: rapid duplicate submits share one request, failures allow retry. */
export function createSetupSaver(fetcher: typeof fetch = fetch) {
  let pending: Promise<Profile> | null = null;
  return (input: SetupInput): Promise<Profile> => {
    if (pending) return pending;
    pending = (async () => {
      const response = await fetcher("/api/onboarding", {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = await response.json();
      if (!response.ok || result.onboarding_completed !== true) {
        throw new Error(result.error || "Your setup was not saved. Please retry.");
      }
      return result as Profile;
    })().finally(() => { pending = null; });
    return pending;
  };
}
