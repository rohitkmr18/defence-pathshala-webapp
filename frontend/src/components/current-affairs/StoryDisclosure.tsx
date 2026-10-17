"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Native disclosure keeps the full manuscript in server-rendered HTML. */
export default function StoryDisclosure({ id, preview, children }: {
  id: string; preview: ReactNode; children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    function reveal(hash: string) {
      let target: HTMLElement | null;
      try { target = document.getElementById(decodeURIComponent(hash.slice(1))); }
      catch { return; }
      const details = ref.current;
      if (!details || !target || (target !== details && !details.contains(target))) return;
      details.open = true;
      if (target === details) details.querySelector("summary")?.focus({ preventScroll: true });
    }
    const onHash = () => reveal(window.location.hash);
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest?.("a");
      if (!anchor || anchor.origin !== window.location.origin || anchor.pathname !== window.location.pathname || !anchor.hash) return;
      reveal(anchor.hash);
    };
    onHash();
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHash);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);
  return <details ref={ref} id={id} className="group scroll-mt-24 rounded-2xl border border-slate-200 bg-white shadow-sm open:border-blue-200">
    <summary className="cursor-pointer list-none rounded-2xl p-4 focus-visible:outline-2 focus-visible:outline-blue-600 sm:p-5 [&::-webkit-details-marker]:hidden">{preview}</summary>
    <div className="min-w-0 border-t border-slate-100 p-4 sm:p-6">{children}</div>
  </details>;
}
