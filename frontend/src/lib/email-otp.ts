import type { SupabaseClient } from "@supabase/supabase-js";

type EmailAuth = Pick<SupabaseClient["auth"], "signInWithOtp" | "verifyOtp">;

export async function requestEmailCode(auth: EmailAuth, email: string) {
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new Error("Enter a valid email address.");
  const { error } = await auth.signInWithOtp({ email: normalized, options: { shouldCreateUser: true } });
  if (error) throw error;
  return normalized;
}

export async function verifyEmailCode(auth: EmailAuth, email: string, code: string) {
  const token = code.trim();
  if (!/^\d{6,10}$/.test(token)) throw new Error("Enter the verification code from your email.");
  const { data, error } = await auth.verifyOtp({ email, token, type: "email" });
  if (error) throw error;
  if (!data.session) throw new Error("Sign-in could not be completed. Please request a new code.");
}
