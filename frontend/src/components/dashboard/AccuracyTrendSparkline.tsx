"use client";

interface AccuracyTrendSparklineProps {
  values: number[];
  className?: string;
}

export default function AccuracyTrendSparkline({
  values,
  className = "",
}: AccuracyTrendSparklineProps) {
  if (!values?.length) {
    return (
      <div className={`flex items-center text-xs italic text-slate-400 ${className}`}>
        Answer questions to unlock trend
      </div>
    );
  }

  if (values.length === 1) {
    return (
      <div className={`flex items-center gap-2 text-xs font-semibold text-slate-600 ${className}`}>
        <span className="flex h-2 w-2 rounded-full bg-blue-500" />
        <span>{values[0]}% accuracy</span>
      </div>
    );
  }

  const width = 180;
  const height = 54;
  const padding = 6;

  const points = values.map((value, index) => {
    const x = padding + (index / (values.length - 1)) * (width - 2 * padding);
    const y = height - padding - (Math.max(0, Math.min(100, value)) / 100) * (height - 2 * padding);
    return { x, y, value };
  });

  const pathD = points
    .map((point, index) =>
      index === 0 ? `M ${point.x},${point.y}` : `L ${point.x},${point.y}`
    )
    .join(" ");

  const areaD = `${pathD} L ${points.at(-1)!.x},${height} L ${points[0].x},${height} Z`;

  return (
    <div className={`relative flex min-w-0 items-center ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="min-w-0 flex-1"
        role="img"
        aria-label="Accuracy percentage trend over recent attempts"
      >
        <defs>
          <linearGradient id="accuracyTrendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#accuracyTrendGradient)" />
        <path
          d={pathD}
          fill="none"
          stroke="#2563eb"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={index === points.length - 1 ? 3.5 : 2}
            className={index === points.length - 1 ? "fill-blue-600 stroke-white stroke-2" : "fill-slate-400"}
          />
        ))}
      </svg>
      <span className="ml-2 shrink-0 text-xs font-black text-slate-700">
        {values.at(-1)}%
      </span>
    </div>
  );
}
