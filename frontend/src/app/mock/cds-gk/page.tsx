import type { Metadata } from "next";
import MockCatalogue from "@/components/mock/MockCatalogue";
import PublicNavbar from "@/components/public/PublicNavbar";

const BANNER = "https://www.defencepathshala.in/mock/cds-gk-banner.jpg";
const TITLE = "CDS GK Full-Length Mock Test | Defence Pathshala";
const DESCRIPTION = "120 questions, 2 hours, 100 marks. Sit a full CDS General Knowledge mock with UPSC-pattern marking and instant analysis.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/mock/cds-gk" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/mock/cds-gk",
    images: [{ url: BANNER, width: 1200, height: 675, alt: "CDS GK Full-Length Mock Test by Defence Pathshala" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [BANNER] },
};

export default function CdsGkMockCatalogue() {
  return (
    <>
      <PublicNavbar />
      <MockCatalogue />
    </>
  );
}
