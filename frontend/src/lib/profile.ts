import type { Profile } from "@/lib/profile/types";

export type { Profile };

export async function getProfile(): Promise<Profile> {
  const res = await fetch("/api/profile", {
    credentials: "include",
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to load profile")
  }

  return res.json()
}

export async function updateProfile(
  payload: Partial<Profile>
): Promise<Profile> {
  const res = await fetch("/api/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error("Failed to update profile")
  }

  return res.json()
}