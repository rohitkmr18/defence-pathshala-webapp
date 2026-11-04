"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { trackAfcatFunnel } from "@/lib/afcat/funnel";

export default function AfcatCtaLink({
  href, placement, className, children,
}: { href: string; placement: string; className?: string; children: ReactNode }) {
  return (
    <Link href={href} className={className}
      onClick={() => trackAfcatFunnel("afcat_cta_click", { placement })}>
      {children}
    </Link>
  );
}
