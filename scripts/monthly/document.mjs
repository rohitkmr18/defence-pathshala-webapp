import React from "../../frontend/node_modules/react/index.js";
import { renderToStaticMarkup } from "../../frontend/node_modules/react-dom/server.node.js";
import Markdown from "../../frontend/node_modules/react-markdown/index.js";
import remarkGfm from "../../frontend/node_modules/remark-gfm/index.js";
import { unified } from "../../frontend/node_modules/unified/index.js";
import remarkParse from "../../frontend/node_modules/remark-parse/index.js";
import { projection, verifySnapshot, GENERATOR_VERSION } from "./core.mjs";

import loader from "../test-support/load-ts.cjs";
import { fileURLToPath } from "node:url";
const { parseStatementQuestion } = loader()(fileURLToPath(new URL('../../frontend/src/lib/current-affairs/question-display.ts',import.meta.url)));
const h = React.createElement;
const parser = unified().use(remarkParse).use(remarkGfm);
export function plainMarkdown(source, listMarkers = false) {
  const walk = node => listMarkers && node.type === "list" && node.ordered ? node.children.map((child,i) => (node.start+i)+". "+walk(child)).join(" ") : typeof node.value === "string" ? node.value
    : (node.children ?? []).map(walk).join(["root", "list", "listItem", "blockquote", "table", "tableRow"].includes(node.type) ? " " : "");
  return walk(parser.parse(source));
}
export const normalizeText = text => text.normalize("NFKC").replace(/\s+/gu, " ").trim();
function md(source) {
  return h(Markdown, { remarkPlugins: [remarkGfm], urlTransform: url => {
    if (url.startsWith("#")) return url;
    try { const parsed = new URL(url); return parsed.protocol === "https:" && !parsed.username && !parsed.password ? url : ""; } catch { return ""; }
  }, components: { img: ({ alt }) => h("span", null, alt ?? ""),
    table: ({ children }) => h("table", null, children) } }, source);
}
const section = (id, title, children, className = "page-section") => h("section", { id, className, key: id }, h("h1", null, title), children);
const url = value => h("a", { href: value }, value);
export function documentModel(snapshot) {
  verifySnapshot(snapshot);
  if (!["VALIDATED", "APPROVED", "RELEASED"].includes(snapshot.status) || snapshot.decision_queue.length) throw new Error("Only validated, resolved snapshots may render");
  const blocks = [], mcqs = snapshot.stories.flatMap(s => s.mcqs.map(q => ({ ...q, story: s })));
  const block = (id, source) => { blocks.push({ id, expected_text: normalizeText(plainMarkdown(source)), expected_pdf_text: normalizeText(plainMarkdown(source,true)) }); return h("div", { "data-parity-block": id }, md(source)); };
  const sample = snapshot.kind === "SAMPLE";
  const released = snapshot.status === "RELEASED";
  const toc = [["overview", "How to use & revision overview"], ...snapshot.taxonomy.filter(t => snapshot.stories.some(s => s.subject === t)).map((subject, i) => ["chapter-" + i, subject]),
    ["practice", "Consolidated MCQ practice"], ["answers", "Answer key & explanations"], ["register", "Quick revision, sources & corrections"]];
  const content = [
    h("section", { className: "cover", id: "cover", key: "cover" },
      h("p", { className: "brand" }, "DP / DEFENCE PATHSHALA"),
      h("p", { className: "eyebrow" }, sample ? "FREE SAMPLE · ONE APPROVED LESSON" : released ? "MONTHLY EDITION · RELEASED" : "EDITORIAL REVIEW COPY · NOT FOR PUBLIC DISTRIBUTION"),
      h("h1", null, "Monthly", h("br"), "Current Affairs", h("br"), "Intelligence"),
      h("p", { className: "cover-month" }, snapshot.edition_id === "2026-10" ? "OCTOBER 2026" : snapshot.edition_id),
      h("p", null, sample ? "BIMSTEC · International Relations" : snapshot.title),
      h("div", { className: "cover-rule" }),
      h("p", { className: "cover-note" }, sample ? "This is a free sample, not the complete October compilation. The full edition remains in preparation." : released ? "Subject-wise learning, original practice and consolidated revision from the approved monthly snapshot." : "Compilation does not confer editorial approval. Release requires a separate trusted approval and artifact review."),
      h("p", { className: "cover-meta" }, snapshot.exam_inclusion.join(" · "), h("br"), "Version " + snapshot.edition_version + " / " + snapshot.status)),
    section("overview", "Contents", [
      h("nav", { "aria-label": "Contents", key: "toc" }, h("ol", null, toc.map(([id, label]) => h("li", { key: id }, h("a", { href: "#" + id }, label))))),
      h("h2", { key: "how" }, "How to use this edition"),
      h("p", { key: "instructions" }, "Read the approved lesson, note the static–current connections, attempt the MCQ before checking the answer, and return to the revision facts. Linked PYQs use the existing DP player; login is required to attempt and save them."),
      h("h2", { key: "overview" }, "Revision overview"),
      h("p", { key: "scope" }, "Coverage: " + snapshot.coverage_start + " to " + snapshot.coverage_end + ". Facts below are retained from the approved source."),
      ...snapshot.stories.map(s => h("ul", { key: s.source_id }, s.content.keyFacts.map((fact, i) => h("li", { key: i }, block("overview-" + s.source_id + "-" + i, fact))))),
    ]),
    ...snapshot.taxonomy.filter(t => snapshot.stories.some(s => s.subject === t)).map((subject, index) =>
      section("chapter-" + index, subject, snapshot.stories.filter(s => s.subject === subject).map(s =>
        h("article", { key: s.source_id, id: "story-" + s.source_id, "data-story-id": s.source_id },
          h("h2", { className: "story-title" }, s.content.headline),
          block("story-" + s.source_id, s.content.editorialMarkdown),
          s.linked_pyqs.length ? h("aside", { className: "exam-links" }, h("h3", null, "Linked historical PYQs"),
            h("p", null, "Eligible canonical references · checked " + snapshot.source_as_of + ". Content verification status is retained separately."),
            h("ul", null, s.linked_pyqs.map(q => h("li", { key: q.id, "data-pyq-id": q.id }, h("a", { href: "https://www.defencepathshala.in/pyq/" + q.id + "?edition=" + s.source_date }, q.id), " · " + q.content_status)))) : null,
          sample ? h("p", { className: "web-link" }, h("a", { href: "https://www.defencepathshala.in/current-affairs/monthly/2026-10/sample" }, "Open the working interactive sample →")) : null)))),
    section("practice", "Consolidated MCQ practice", mcqs.map((q, i) => h("article", { key: q.source_id, "data-question-id": q.source_id, className: "question" },
      h("h2", null, "Question " + (i + 1)),
      (() => {
        const parts = parseStatementQuestion(q.content.question);
        if (!parts) return block("question-" + q.source_id, q.content.question);
        blocks.push({id: "question-" + q.source_id, expected_text: normalizeText(q.content.question)});
        return h("div", {"data-parity-block":"question-"+q.source_id}, h("p",null,parts.intro),
          h("ul",{className:"statements"},parts.statements.map((statement,i)=>h("li",{key:i},statement))),h("p",null,parts.prompt));
      })(),
      h("ol", { className: "options" }, Object.entries(q.content.options).map(([key, text]) => h("li", { key, "data-option": key }, block("option-" + q.source_id + "-" + key, key + ". " + text)))),
      h("p", null, h("a", { href: "#answer-" + q.source_id }, "Check the answer and explanation →"))))),
    section("answers", "Answer key & explanations", mcqs.map((q, i) => h("article", { key: q.source_id, id: "answer-" + q.source_id, "data-answer-id": q.source_id, className: "answer" },
      h("h2", null, "Question " + (i + 1) + " · Answer " + q.content.correctOption),
      block("explanation-" + q.source_id, q.content.explanation),
      h("aside", { className: "exam-edge" }, h("h3", null, "Exam Edge"), block("edge-" + q.source_id, q.content.examEdge)),
      h("p", null, h("a", { href: "#practice" }, "Return to practice"))))),
    section("register", "Quick revision", [
      ...snapshot.stories.map(s => h("div", { key: s.source_id }, h("h2", null, s.content.headline),
        h("ul", null, s.content.keyFacts.map((fact, i) => h("li", { key: i }, block("revision-" + s.source_id + "-" + i, fact)))))),
      h("h2", { key: "source" }, "Official source register"),
      ...snapshot.stories.map(s => h("div", { className: "source-entry", key: "source-" + s.source_id, "data-source-id": s.source_id },
        h("p", null, s.content.sourceName + " · " + s.content.sourceDate),
        h("p", null, url(s.content.sourceUrl)))),
      h("h2", { key: "version" }, "Edition version & corrections"),
      h("p", { key: "identity" }, snapshot.edition_id + " · version " + snapshot.edition_version + " · " + snapshot.status + " · " + snapshot.kind),
      h("p", { key: "approval" }, sample ? "The lesson is from an approved public daily source. This validated sample does not approve or release the complete October monthly edition." : "Founder approval and release metadata remain separate from compilation."),
      h("p", { className: "metadata", key: "hash" }, "Content digest: " + snapshot.content_hash),
      h("p", { className: "metadata", key: "generator" }, "Generator: " + GENERATOR_VERSION),
      h("p", { key: "correction" }, snapshot.correction_lineage ? "Correction lineage: " + snapshot.correction_lineage.reason : "Initial sample version. Corrections require a new immutable snapshot version."),
      h("p", { className: "metadata", key: "source-hash" }, snapshot.source_hashes.map(s => "Approved source hash: " + s.source_hash).join(" · ")),
    ]),
  ];
  const html = renderToStaticMarkup(h("main", { "data-content-hash": snapshot.content_hash }, content));
  return { html, blocks, projection: projection(snapshot), toc: toc.map(([id]) => id) };
}
