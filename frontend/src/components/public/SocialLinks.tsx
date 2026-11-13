import { Camera, MessageCircle, Play } from "lucide-react";
import { SOCIAL_CHANNELS } from "@/lib/social-links";

const ICONS = [Camera, Play, MessageCircle] as const;

export default function SocialLinks({
  theme = "light",
}: {
  theme?: "light" | "dark";
}) {
  const dark = theme === "dark";

  return (
    <div aria-label="Defence Pathshala social channels" className="flex flex-wrap items-center gap-2">
      {SOCIAL_CHANNELS.map((channel, index) => {
        const Icon = ICONS[index];
        return (
          <a
            key={channel.name}
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit Defence Pathshala on ${channel.name} (opens in a new tab)`}
            title={channel.name}
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
              dark
                ? "border-slate-700 text-slate-200 hover:border-blue-400 hover:text-white"
                : "border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{channel.name}</span>
          </a>
        );
      })}
    </div>
  );
}
