import { SOCIAL_CHANNELS } from "@/lib/social-links";

function InstagramLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id="dp-instagram-gradient" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="30%" stopColor="#F77737" />
          <stop offset="60%" stopColor="#E1306C" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="22" height="22" rx="6" fill="url(#dp-instagram-gradient)" />
      <rect x="5.5" y="5.5" width="13" height="13" rx="4" fill="none" stroke="white" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="white" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.9" r="1.15" fill="white" />
    </svg>
  );
}

function YouTubeLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
      <rect x="0.5" y="4" width="23" height="16" rx="5" fill="#FF0033" />
      <path d="M10 8.3 16.1 12 10 15.7Z" fill="white" />
    </svg>
  );
}

function WhatsAppLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
      <path fill="#25D366" d="M12 1a11 11 0 0 0-9.5 16.5L1 23l6.1-1.6A11 11 0 1 0 12 1Z" />
      <path fill="#fff" d="M12 3.2a8.8 8.8 0 0 0-7.55 13.33l.3.47-.87 3.2 3.29-.86.46.27A8.8 8.8 0 1 0 12 3.2Zm0 1.75a7.05 7.05 0 1 1-3.58 13.12l-.6-.36-1.54.4.42-1.5-.39-.62A7.05 7.05 0 0 1 12 4.95Z" />
      <path fill="#fff" d="M8.2 7.7c-.2 0-.42.05-.65.3-.23.24-.88.85-.88 2.05 0 1.2.9 2.35 1.03 2.52.12.16 1.73 2.74 4.25 3.83 2.09.9 2.52.72 2.98.67.47-.07 1.45-.59 1.65-1.16.21-.56.21-1.05.14-1.15-.06-.1-.23-.16-.48-.29l-1.66-.79c-.23-.08-.39-.12-.55.12-.16.25-.63.79-.78.95-.14.17-.28.19-.52.07-.25-.12-1.03-.38-1.96-1.2-.73-.65-1.22-1.45-1.37-1.69-.14-.24-.01-.37.11-.49l.37-.43c.12-.15.16-.24.24-.41.08-.16.04-.3-.02-.42l-.75-1.82c-.18-.42-.36-.42-.5-.43h-.43Z" />
    </svg>
  );
}

const LOGOS = [InstagramLogo, YouTubeLogo, WhatsAppLogo] as const;

export default function SocialLinks({
  theme = "light",
}: {
  theme?: "light" | "dark";
}) {
  const dark = theme === "dark";

  return (
    <div aria-label="Defence Pathshala social channels" className="flex flex-wrap items-center gap-2">
      {SOCIAL_CHANNELS.map((channel, index) => {
        const Logo = LOGOS[index];
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
            <Logo />
            <span>{channel.name}</span>
          </a>
        );
      })}
    </div>
  );
}
