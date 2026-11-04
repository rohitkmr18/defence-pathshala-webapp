"use client";
import { useState } from "react";
import { Share2 } from "lucide-react";
import { trackAfcatFunnel } from "@/lib/afcat/funnel";

const SHARE_URL = "https://www.defencepathshala.in/afcat?utm_source=share&utm_medium=result&utm_campaign=afcat_fm01";

/** User-initiated share of the free mock. The score is included only in text the user can edit before sending. */
export default function AfcatShareButton({ score, maxMarks }: { score: number; maxMarks: number }) {
  const [note, setNote] = useState("");
  async function share() {
    trackAfcatFunnel("afcat_share_click", { method: typeof navigator.share === "function" ? "native" : "copy" });
    const text = `I scored ${score}/${maxMarks} on the free AFCAT Full Mock 01 from Defence Pathshala. Try it:`;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: "AFCAT Full Mock 01 — free", text, url: SHARE_URL });
      } else {
        await navigator.clipboard.writeText(`${text} ${SHARE_URL}`);
        setNote("Link copied");
      }
    } catch { /* Cancelled or blocked share is not an error. */ }
  }
  return (
    <div className="mb-4 flex items-center gap-3">
      <button onClick={() => void share()}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:border-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
        <Share2 className="h-4 w-4" aria-hidden="true" /> Challenge a friend
      </button>
      <span role="status" className="text-sm text-slate-600">{note}</span>
    </div>
  );
}
