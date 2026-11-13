const { test } = require("node:test");
const assert = require("node:assert/strict");
const createLoader = require("./test-support/load-ts.cjs");

const { stripUnresolvedCitations } = createLoader()(
  "frontend/src/lib/strip-unresolved-citations.ts"
);

test("removes unresolved tool citations without affecting educational content", () => {
  assert.equal(
    stripUnresolvedCitations("Article 371F. \uE200cite\uE202turn1search25\uE201"),
    "Article 371F. "
  );
  assert.equal(
    stripUnresolvedCitations("A [cite: 2, 3] B"),
    "A  B"
  );
  assert.equal(
    stripUnresolvedCitations("See https://www.legislative.gov.in and $\\\\frac{1}{2}$"),
    "See https://www.legislative.gov.in and $\\\\frac{1}{2}$"
  );
});

test("does not transform stored escaped newlines or double-backslash LaTeX", () => {
  const source = String.raw`First\\nSecond $\\\\theta$`;
  assert.equal(stripUnresolvedCitations(source), source);
});
