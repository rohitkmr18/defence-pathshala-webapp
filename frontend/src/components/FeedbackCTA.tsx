import { MessageSquareHeart, ExternalLink } from "lucide-react";
import { FEEDBACK_FORM_URL } from "@/lib/constants";

interface FeedbackCTAProps {
  heading?: string;
  description?: string;
  buttonText?: string;
  className?: string;
}

export default function FeedbackCTA({
  heading = "Help Us Build Better",
  description = "Your feedback directly shapes Defence Pathshala. Report bugs, suggest features, or tell us what slowed your preparation down.",
  buttonText = "Open Feedback Form",
  className = "",
}: FeedbackCTAProps) {
  return (
    <div
      className={`rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 p-8 text-center sm:p-10 shadow-xs ${className}`}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
        <MessageSquareHeart className="h-6 w-6" />
      </div>

      <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
        {heading}
      </h2>

      <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
        {description}
      </p>

      <div className="mt-6">
        <a
          href={FEEDBACK_FORM_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-700 hover:scale-105 active:scale-95"
        >
          <span>{buttonText}</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
