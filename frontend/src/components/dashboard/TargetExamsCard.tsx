import { GraduationCap } from "lucide-react";
import DashboardCard from "./DashboardCard";

type Props = {
  exams: string[];
};

export default function TargetExamsCard({ exams }: Props) {
  return (
    <DashboardCard>
      <div className="flex items-center gap-2 text-gray-500">
        <GraduationCap size={18} />
        <p className="text-sm">Target Exams</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {exams.length ? (
          exams.map((exam) => (
            <span
              key={exam}
              className="rounded-full border border-gray-300 px-3 py-1 text-sm font-medium"
            >
              {exam}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-400">No exams selected</span>
        )}
      </div>
    </DashboardCard>
  );
}