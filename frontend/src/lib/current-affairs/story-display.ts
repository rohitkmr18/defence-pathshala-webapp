// Presentation only: never change the stored approved source or its hash.
const label = (line: string) => line.trim().replace(/^#{1,6}\s+/, "").replace(/\*\*|__/g, "").replace(/[?:]\s*$/, "").trim();

export function storyDisplayMarkdown(source: string, linkedPyqIds: readonly string[]) {
  const lines = source.split("\n");
  const start = lines.findIndex(line => /^what happened$/i.test(label(line)));
  // Only remove a recognised metadata preamble; retain unfamiliar editorial prose.
  const metadata = /^(?:STORY\s+\d+\s*[—–:-].*|(?:Subject|Topic|DP Relevance Score|Relevant Exams):.*)$/i;
  const body = start > 0 && lines.slice(0, start).every(line => !line.trim() || metadata.test(label(line)))
    ? lines.slice(start) : lines;
  const connection = body.findIndex(line => /^PYQ connection$/i.test(label(line)));
  const edge = body.findIndex((line, index) => index > connection && /^exam edge$/i.test(label(line)));
  if (connection >= 0 && edge > connection && linkedPyqIds.length > 0) {
    const references = body.slice(connection + 1, edge)
      .map(line => label(line).replace(/^[-*+]\s+/, ""))
      .filter(line => line && !/^Relevant production question IDs$/i.test(line));
    // Do not hide analysis or IDs that have no replacement clickable link.
    if (references.length > 0 && references.every(id => linkedPyqIds.includes(id))) {
      body.splice(connection, edge - connection);
    }
  }
  // Hide missing-PYQ review notes only in the reader; retain the approved source.
  if (linkedPyqIds.length === 0) {
    for (let i = 0; i < body.length; i++) {
      const marker = /(?:\*\*)?Linked PYQ IDs:\s*\[\](?:\*\*)?/i;
      const match = marker.exec(body[i]);
      if (match) body[i] = body[i].slice(0, match.index).trimEnd();
    }
  }
  return body.join("\n");
}
