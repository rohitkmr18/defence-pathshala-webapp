interface SubjectAnalytics {
  subject: string;
  questions: number;
}

interface SubjectAnalyticsCardProps {
  data: SubjectAnalytics[];
}

const icons: Record<string, string> = {
  Science: "⚛️",
  History: "🏛️",
  Geography: "🌍",
  Economy: "📈",
  Polity: "⚖️",
  "Current Affairs": "📰",
  "General Mental Ability": "🧠",
  "Computer Science": "💻",
  Environment: "🌿",
  Security: "🛡️",
  "International Relations": "🤝",
};

export default function SubjectAnalyticsCard({
  data,
}: SubjectAnalyticsCardProps) {
  const totalQuestions = data.reduce((sum, item) => sum + item.questions, 0);

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
          Question Intelligence
        </p>
        <h2 className="mt-2 text-2xl font-bold">Subject Distribution</h2>
        <p className="mt-2 text-gray-600">
          Percentage share of each subject in the current question bank.
        </p>
      </div>

      <div className="space-y-5">
        {data.map((item) => {
          const percentage = (item.questions / totalQuestions) * 100;

          return (
            <div key={item.subject}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{icons[item.subject] ?? "📚"}</span>

                  <div>
                    <p className="font-medium">{item.subject}</p>
                    <p className="text-xs text-gray-500">
                      {item.questions} questions
                    </p>
                  </div>
                </div>

                <span className="font-semibold">
                  {percentage.toFixed(1)}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-black transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}