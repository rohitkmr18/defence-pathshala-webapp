import { Play } from "lucide-react";
import DashboardCard from "./DashboardCard";

export default function ContinueSessionCard() {
  return (
    <DashboardCard className="h-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Continue Last Session</p>
          <h2 className="mt-1 text-xl font-semibold">
            Resume where you left off
          </h2>
        </div>

        <Play size={20} className="text-gray-400" />
      </div>

      <div className="mt-8 space-y-2">
        <p className="text-base font-medium">No previous activity yet.</p>

        <p className="text-sm text-gray-500">
          Your first mock or PYQ session will appear here.
        </p>
      </div>

      <button className="mt-8 rounded-xl bg-black px-5 py-3 text-white transition hover:bg-gray-800">
        Start Practicing
      </button>
    </DashboardCard>
  );
}