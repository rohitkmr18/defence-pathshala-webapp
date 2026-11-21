"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { LogIn, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  nextUrl: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  onSignInClick?: () => void;
};

/** Viewport-centered, dismissible authentication gate shared by full-paper entry points. */
export default function SignInRequiredDialog({
  open, onClose, nextUrl,
  title = "Sign in to continue",
  description = "Sign in to start or resume your mock test and save your progress and analysis.",
  actionLabel = "Sign in with Defence Pathshala",
  onSignInClick,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="sign-in-required-title"
      aria-describedby="sign-in-required-description"
      onClose={onClose}
      onCancel={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl border border-blue-100 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/65 backdrop:backdrop-blur-[3px]"
    >
      <div className="relative p-6 sm:p-8">
        <button
          ref={closeRef}
          type="button"
          aria-label="Close sign in prompt"
          onClick={() => dialogRef.current?.close()}
          className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <LogIn className="h-6 w-6" />
        </div>
        <h2 id="sign-in-required-title" className="pr-10 text-xl font-extrabold tracking-tight sm:text-2xl">{title}</h2>
        <p id="sign-in-required-description" className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
        <Link
          href={`/auth/login?next=${encodeURIComponent(nextUrl)}`}
          onClick={onSignInClick}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <LogIn className="h-4 w-4" />
          {actionLabel}
        </Link>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Not now
        </button>
      </div>
    </dialog>
  );
}
