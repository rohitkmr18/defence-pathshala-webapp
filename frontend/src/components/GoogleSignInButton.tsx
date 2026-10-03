"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { safeAuthNext } from "@/lib/auth-redirect";

export default function GoogleSignInButton({
  next = "/dashboard", disabled, onBusyChange, onError,
}: {
  next?: string;
  disabled: boolean;
  onBusyChange: (busy: boolean) => void;
  onError: (error: string | null) => void;
}) {
  const [pending, setPending] = useState(false);

  async function signIn() {
    if (disabled || pending) return;
    setPending(true);
    onBusyChange(true);
    onError(null);
    try {
      const callback = new URL("/auth/callback", window.location.origin);
      callback.searchParams.set("next", safeAuthNext(next));
      const { data, error } = await createClient().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callback.toString(), skipBrowserRedirect: true },
      });
      if (error || !data.url) throw new Error("Google sign-in could not start. Please try again.");
      window.location.assign(data.url);
    } catch {
      onError("Google sign-in could not start. Please try again.");
      setPending(false);
      onBusyChange(false);
    }
  }

  return (
    <>
      <button type="button" onClick={signIn} disabled={disabled || pending}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 48 48">
          <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.9h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.9 6.1-15.1Z" />
          <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2A20 20 0 0 0 24 44Z" />
          <path fill="#FBBC05" d="M12.6 27.5a12 12 0 0 1 0-7.6v-5.2H5.8a20 20 0 0 0 0 18l6.8-5.2Z" />
          <path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3l5.8-5.8A19.5 19.5 0 0 0 24 4 20 20 0 0 0 5.8 14.7l6.8 5.2C14.2 15.1 18.7 12 24 12Z" />
        </svg>
        {pending ? "Connecting to Google…" : "Continue with Google"}
      </button>
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />or use email<span className="h-px flex-1 bg-slate-200" />
      </div>
    </>
  );
}
