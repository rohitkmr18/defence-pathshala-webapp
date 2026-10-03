import Link from "next/link";
import { authUrl } from "@/lib/auth-redirect";

export default async function RecoveryPage({ searchParams }: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <main className="mx-auto max-w-md space-y-5 px-6 py-16">
    <h1 className="text-2xl font-bold">We couldn&apos;t load your profile</h1>
    <p role="alert">Please retry. Your destination is saved.</p>
    <Link prefetch={false} className="inline-block rounded-xl bg-blue-600 px-5 py-3 text-white"
      href={authUrl("/auth/continue", next)}>Retry</Link>
  </main>;
}
