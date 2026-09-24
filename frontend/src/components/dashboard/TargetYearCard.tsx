import { Calendar } from "lucide-react";
import DashboardCard from "./DashboardCard";

type Props = {
  targetYear: number | null;
};

export default function TargetYearCard({ targetYear }: Props) {
  return (
    <DashboardCard>
      <div className="flex items-center gap-2 text-gray-500">
        <Calendar size={18} />
        <p className="text-sm">Target Year</p>
      </div>

      <h2 className="mt-3 text-4xl font-bold">
        {targetYear ?? "—"}
      </h2>
    </DashboardCard>
  );
}