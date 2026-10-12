import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import Link from "next/link";

import { editorialHeadings } from "@/lib/current-affairs/editorial-headings";

/** HTML is displayed as text; no raw-HTML plugin, scripts or unsafe protocols. */
export default function EditorialMarkdown({ source, anchorPrefix = "editorial-" }: { source: string; anchorPrefix?: string }) {
  return <div className="editorial-copy min-w-0 max-w-[72ch] [overflow-wrap:anywhere] text-base leading-[1.75] text-slate-700 sm:text-[17px] [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-950 [&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-200 [&_blockquote]:pl-4 [&_strong]:text-slate-950 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-slate-50 [&_pre]:p-4">
    <Markdown remarkPlugins={[remarkGfm, editorialHeadings]} remarkRehypeOptions={{ clobberPrefix: anchorPrefix }} urlTransform={url => {
      if (url.startsWith("#")) return url;
      try { const u = new URL(url); return u.protocol === "https:" && !u.username && !u.password ? url : ""; }
      catch { return ""; }
    }} components={{
      h2: ({ children }) => <h3>{children}</h3>,
      a: ({ children, href }) => href?.startsWith("#") ? <Link href={href} className="font-semibold text-blue-700 underline underline-offset-4">{children}</Link> : href ? <a href={href} target={href.startsWith("#") ? undefined : "_blank"} rel={href.startsWith("#") ? undefined : "noopener noreferrer"} className="font-semibold text-blue-700 underline underline-offset-4">{children}</a> : <span>{children}</span>,
      img: ({ src, alt }) => typeof src === "string" && src.startsWith("https://")
        ? <Image src={src} alt={alt ?? ""} width={1200} height={800} unoptimized loading="lazy" className="my-4 h-auto w-full rounded-xl" />
        : <span>{alt}</span>,
      table: ({ children }) => <div tabIndex={0} role="region" aria-label="Editorial table" className="my-5 max-w-full overflow-x-auto"><table className="w-full min-w-[32rem] border-collapse text-left text-sm [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:p-3 [&_td]:border [&_td]:border-slate-200 [&_td]:p-3">{children}</table></div>,
    }}>{source}</Markdown>
  </div>;
}
