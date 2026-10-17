import type { Root, RootContent, Nodes } from "mdast";

const sectionHeading = /^(?:What\s+Happened|Why\s+It\s+Matters|Key\s+(?:Exam\s+)?Facts|Static\s*[–—-]\s*Current(?:\s+Affairs)?\s+Linkage|Conceptual\s+Linkage|Exam\s+Edge|Future\s+Question\s+Angles?|Explanation)\s*[?:.]?$/i;

/** Promote only standalone text or one bold-only paragraph. Never rewrite copy. */
export function editorialHeadings() {
  return (tree: Root) => {
    const normalizeHeading = (node: Nodes) => {
      if (node.type === "heading") node.depth = 3;
      if ("children" in node) node.children.forEach(normalizeHeading);
    };
    normalizeHeading(tree);
    tree.children = tree.children.map((node): RootContent => {
      if (node.type === "heading") return { ...node, depth: 3 };
      if (node.type !== "paragraph") return node;
      const children = node.children.length === 1 && node.children[0].type === "strong"
        ? node.children[0].children : node.children;
      if (!children.every(child => child.type === "text")) return node;
      const text = children.map(child => child.type === "text" ? child.value : "").join("");
      if (text.includes("\n") || !sectionHeading.test(text.trim())) return node;
      return { ...node, type: "heading", depth: 3 };
    });
  };
}
