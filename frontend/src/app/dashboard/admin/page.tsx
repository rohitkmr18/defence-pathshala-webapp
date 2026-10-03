import { redirect } from "next/navigation";
import { checkIsAdmin } from "@/lib/admin";
import AdminDatasetSyncClient from "@/components/admin/AdminDatasetSyncClient";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Admin Dataset Sync – Defence Pathshala",
  description: "Synchronize live Google Sheets dataset with Supabase database.",
};

export default async function AdminDashboardPage() {
  const { isAdmin, user } = await checkIsAdmin();

  if (!user) {
    redirect("/auth/login?next=/dashboard/admin");
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-8 ring-red-50/50">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Admin Access Required
          </h1>

          <p className="mt-3 text-sm text-slate-600 sm:text-base max-w-md mx-auto">
            This administrative dashboard is restricted to authorized Defence Pathshala administrators.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Student Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <AdminDatasetSyncClient userEmail={user.email || ""} />;
}

