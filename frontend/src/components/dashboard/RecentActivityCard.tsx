import { CheckCircle, CircleUser } from "lucide-react";
import DashboardCard from "./DashboardCard";

export default function RecentActivityCard() {
  return (
    <DashboardCard className="h-full">
      <p className="text-sm text-gray-500">Recent Activity</p>

      <div className="mt-6 space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <p className="font-medium">Account setup completed</p>
            <p className="text-sm text-gray-500">Just now</p>
          </div>

          <CheckCircle size={20} className="text-gray-400" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Profile created</p>
            <p className="text-sm text-gray-500">Welcome aboard</p>
          </div>

          <CircleUser size={20} className="text-gray-400" />
        </div>
      </div>
    </DashboardCard>
  );
}