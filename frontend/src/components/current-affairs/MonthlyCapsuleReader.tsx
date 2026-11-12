"use client";

import { useMemo } from "react";
import EbookPageReader from "@/components/library/EbookPageReader";
import { capsuleHotspots, type MonthlyCapsule } from "@/lib/monthly-capsules";

/**
 * Online-only reader for a monthly capsule. Pages are images; there is no download
 * control and the source PDF is never sent to the browser. Shares its reader with
 * the Free Library; events stay monthly_capsule_open / _page / _depth.
 */
export default function MonthlyCapsuleReader({ capsule }: { capsule: MonthlyCapsule }) {
  const pages = useMemo(() => Array.from({ length: capsule.pageCount }, (_, i) => i + 1), [capsule.pageCount]);
  const hotspots = useMemo(() => capsuleHotspots(capsule), [capsule]);

  return (
    <EbookPageReader
      title={capsule.title}
      srcBase={`/monthly-capsule/${capsule.edition}`}
      pages={pages}
      pageWidth={capsule.pageWidth}
      pageHeight={capsule.pageHeight}
      sections={capsule.sections}
      hotspots={hotspots}
      eventPrefix="monthly_capsule"
      eventKey="edition"
      eventId={capsule.edition}
      contentsLabel="Capsule contents"
    />
  );
}
