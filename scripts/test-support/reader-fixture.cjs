const { edition, approve } = require('./editorial-fixture.cjs');
function readerEdition() {
  const p = edition();
  p.stories[0].summary = null;
  p.stories[0].linkedPyqIds.push('SYNTHETIC_' + 'LONG_EXACT_ID_'.repeat(8));
  p.stories[0].mcqs[0].options.D = 'Synthetic long quiz option ' + 'approved-text-'.repeat(35);
  p.stories[0].headline = 'Synthetic mobile reader: a deliberately long approved headline for current affairs with exact content, source links and exam context';
  p.stories[0].editorialMarkdown = `STORY 1 — ${p.stories[0].headline}\n\nSubject: Economy\nRelevant Exams: CDS | CAPF\n\nWhat Happened?\n\nFirst **complete** paragraph with [Primary citation](https://pib.gov.in/test).\n\nSecond paragraph — भारत.\n\n**Why It Matters:**\n\nWhy It Matters is explained in this sentence, which must remain normal prose.\n\n## Key Exam Facts\n\n- Every fact retained\n- Every explanation retained\n\nStatic – Current Affairs Linkage:\n\nComplete static linkage.\n\nConceptual Linkage\n\nComplete conceptual linkage.\n\n### Unknown approved heading\n\nUnknown section stays visible with *emphasis* and a footnote.[^reader]\n\n| Angle | Fact |\n| --- | --- |\n| Future | ${'UNBROKEN_TABLE_VALUE_'.repeat(20)} |\n\n[Long source URL](https://pib.gov.in/${'long-approved-citation-'.repeat(20)})\n\nPYQ Connection\n\nThe exact question tests the related concept; retain this explanatory PYQ analysis.\n\nExam Edge.\n\nKeep this distinction.\n\n**Future Question Angles?**\n\nKeep this approved angle.\n\n[^reader]: Complete footnote content.\n\n<script>alert("xss")</script>\n\n[Unsafe](javascript:alert(1))`;
  // More than five verifies actual quiz count without a presentation cap.
  p.stories[1].mcqs = Array.from({ length: 4 }, (_, i) => ({ ...p.stories[1].mcqs[0], question: `Synthetic extra question ${i}?` }));
  return approve(p);
}
module.exports = { readerEdition };
