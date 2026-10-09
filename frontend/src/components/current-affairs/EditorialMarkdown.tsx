import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

/** HTML is displayed as text; no raw-HTML plugin, scripts or unsafe protocols. */
export default function EditorialMarkdown({ source }: { source: string }) {
  return <div className="editorial-copy min-w-0 break-words text-base leading-8 text-slate-700 [&_h1]:mt-8 [&_h1]:text-2xl [&_h2]:mt-7 [&_h2]:text-xl [&_h3]:mt-6 [&_h3]:text-lg [&_h4]:mt-5 [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_h4]:font-bold [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-200 [&_blockquote]:pl-4 [&_strong]:text-slate-950 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-slate-50 [&_pre]:p-4">
    <Markdown remarkPlugins={[remarkGfm]} urlTransform={url => {
      if (url.startsWith("#")) return url;
      try { const u = new URL(url); return u.protocol === "https:" && !u.username && !u.password ? url : ""; }
      catch { return ""; }
    }} components={{
      a: ({ children, href }) => href ? <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 underline underline-offset-4">{children}</a> : <span>{children}</span>,
      img: ({ src, alt }) => typeof src === "string" && src.startsWith("https://")
        ? <Image src={src} alt={alt ?? ""} width={1200} height={800} unoptimized loading="lazy" className="my-4 h-auto w-full rounded-xl" />
        : <span>{alt}</span>,
      table: ({ children }) => <div className="my-5 overflow-x-auto"><table className="w-full border-collapse text-left text-sm [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:p-3 [&_td]:border [&_td]:border-slate-200 [&_td]:p-3">{children}</table></div>,
    }}>{source}</Markdown>
  </div>;
}
