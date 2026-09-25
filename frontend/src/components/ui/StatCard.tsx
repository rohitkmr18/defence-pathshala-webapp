interface Props {
  label: string;
  value: string | number;
  subtitle?: string;
}

export default function StatCard({
  label,
  value,
  subtitle,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-2 text-3xl font-bold">{value}</p>

      {subtitle && (
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}