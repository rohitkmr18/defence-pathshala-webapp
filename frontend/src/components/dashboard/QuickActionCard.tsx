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
      className="group block rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
          <Icon className="h-6 w-6" />
        </div>

        {badge && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
            {badge}
          </span>
        )}
      </div>

      <h3 className="mt-5 text-xl font-semibold">{title}</h3>

      <p className="mt-2 text-gray-600">{description}</p>

      <div className="mt-6 flex items-center text-sm font-semibold">
        Open
        <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}