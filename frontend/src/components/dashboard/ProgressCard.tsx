import { Gauge } from "lucide-react";
import DashboardCard from "./DashboardCard";

type Props = {
  progress?: number;
};

export default function ProgressCard({ progress = 0 }: Props) {
  return (
    <DashboardCard>
      <div className="flex items-center gap-2 text-gray-500">
        <Gauge size={18} />
        <p className="text-sm">Preparation Progress</p>
      </div>

      <h2 className="mt-3 text-4xl font-bold">{progress}%</h2>

      <div className="mt-5 h-2 rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-black transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </DashboardCard>
  );
}