interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
}: Props) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <span className="inline-block rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-2xs">
          {eyebrow}
        </span>
      )}

      <h2 className={`text-2xl font-black tracking-tight text-slate-900 sm:text-3xl ${eyebrow ? "mt-2.5" : ""}`}>
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}