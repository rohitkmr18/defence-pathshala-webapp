"use client";

import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts";

interface DonutChartProps {
  title: string;
  subtitle: string;
  centerLabel?: string;
  centerValue?: string | number;
  data: {
    name: string;
    value: number;
  }[];
}

const COLORS = [
  "#111111",
  "#2F2F2F",
  "#555555",
  "#777777",
  "#999999",
  "#B5B5B5",
  "#C9C9C9",
  "#D7D7D7",
  "#E3E3E3",
  "#ECECEC",
  "#F3F3F3",
];

export default function DonutChart({
  title,
  subtitle,
  centerLabel,
  centerValue,
  data,
}: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  const processed = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        percentage: (item.value / total) * 100,
      })),
    [data, total]
  );

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
          {subtitle}
        </p>

        <h2 className="mt-2 text-2xl font-bold">{title}</h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:items-center">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={processed}
                dataKey="value"
                nameKey="name"
                innerRadius={78}
                outerRadius={112}
                paddingAngle={2}
                activeIndex={activeIndex}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onClick={(_, index) => setActiveIndex(index)}
                activeShape={(props: any) => (
                  <Sector
                    {...props}
                    outerRadius={(props.outerRadius ?? 112) + 8}
                  />
                )}
              >
                {processed.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value: number, name: string) => [
                  `${Number(value)} questions (${(
                    (Number(value) / total) *
                    100
                  ).toFixed(1)}%)`,
                  name,
                ]}
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid #E5E7EB",
                  background: "#fff",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.08)",
                }}
              />

              <text
                x="50%"
                y="47%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-black text-3xl font-bold"
              >
                {centerValue ?? total}
              </text>

              <text
                x="50%"
                y="57%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-500 text-sm"
              >
                {centerLabel ?? "Questions"}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          {processed.map((item, index) => (
            <button
              key={item.name}
              onClick={() => setActiveIndex(index)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                activeIndex === index
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor:
                        COLORS[index % COLORS.length],
                    }}
                  />

                  <div>
                    <p className="font-medium">{item.name}</p>

                    <p className="text-sm text-gray-500">
                      {item.value} questions
                    </p>
                  </div>
                </div>

                <span className="font-semibold">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}