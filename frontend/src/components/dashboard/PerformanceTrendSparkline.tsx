"use client";

interface PerformanceTrendSparklineProps {
  scores: number[];
  className?: string;
}

export default function PerformanceTrendSparkline({
  scores,
  className = "",
}: PerformanceTrendSparklineProps) {
  if (!scores || scores.length === 0) {
    return (
      <div className={`flex items-center text-xs text-slate-400 italic ${className}`}>
        Attempt 2+ mocks to unlock trend
      </div>
    );
  }

  if (scores.length === 1) {
    return (
      <div className={`flex items-center gap-2 text-xs font-semibold text-slate-600 ${className}`}>
        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        <span>1 Mock Completed ({scores[0]} pts)</span>
      </div>
    );
  }

  const width = 160;
  const height = 44;
  const padding = 6;

  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min === 0 ? 1 : max - min;

  const points = scores.map((val, idx) => {
    const x = padding + (idx / (scores.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val - min) / range) * (height - 2 * padding);
    return { x, y, val };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, "");

  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const isUp = lastPoint.val >= firstPoint.val;
  const strokeColor = isUp ? "#10b981" : "#f59e0b"; // emerald or amber

  // Area under path
  const areaD = `${pathD} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
        aria-label="Score trend sparkline"
      >
        <defs>
          <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Fill area */}
        <path d={areaD} fill="url(#sparklineGrad)" />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((pt, idx) => (
          <circle
            key={idx}
            cx={pt.x}
            cy={pt.y}
            r={idx === points.length - 1 ? 3.5 : 2}
            className={
              idx === points.length - 1
                ? isUp
                  ? "fill-emerald-600 stroke-white stroke-2"
                  : "fill-amber-600 stroke-white stroke-2"
                : "fill-slate-400"
            }
          />
        ))}
      </svg>
    </div>
  );
}
