import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";

interface Props {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
}

export default function QuickActionCard({
  href,
  title,
  description,
  icon: Icon,
  badge,
}: Props) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl sm:p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:scale-105">
          <Icon className="h-5 w-5" />
        </div>

        {badge && (
          <span className="rounded-full border border-blue-200/80 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 shadow-2xs">
            {badge}
          </span>
        )}
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900 transition-colors group-hover:text-blue-900 sm:mt-5 sm:text-lg">
        {title}
      </h3>

      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-700 sm:mt-5">
        Open
        <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}