import type { Metadata } from "next";

// Staging-first product surface: keep out of search indexes until founder approval.
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function MockLayout({ children }: { children: React.ReactNode }) {
  return children;
}
