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
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-2 text-3xl font-bold text-gray-900">
        {title}
      </h2>

      {description && (
        <p className="mt-3 max-w-2xl text-gray-600">
          {description}
        </p>
      )}
    </div>
  );
}