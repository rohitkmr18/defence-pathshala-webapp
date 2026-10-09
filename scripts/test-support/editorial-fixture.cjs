const { createHash } = require('node:crypto');
function approve(edition) {
  const { approvedEditorial, ...fields } = edition;
  const source = JSON.stringify(fields);
  return { ...fields, approvedEditorial: { version: 1, source, sha256: createHash('sha256').update(source).digest('hex') } };
}
function edition(date = '2030-01-01') {
  return approve({ date, title: 'Synthetic acceptance edition', summary: 'Isolated QA only — not editorial content.',
    stories: Array.from({ length: 3 }, (_, i) => ({
      headline: `Synthetic story ${date} ${i}`, summary: 'Full summary',
      editorialMarkdown: '## Approved section\n\nFirst **complete** paragraph.\n\nSecond paragraph — भारत.\n\n### Static-current linkage\n\n- Every fact retained\n- Every explanation retained\n\n| Angle | Fact |\n| --- | --- |\n| Future | Complete |\n\n[Primary citation](https://pib.gov.in/test)\n\n<script>alert("xss")</script>\n\n[Unsafe](javascript:alert(1))',
      whatHappened: '  Exact approved event\n\nSecond paragraph.  ', whyItMatters: 'Full importance',
      keyFacts: ['First fact', 'Second fact'], conceptualLinkage: 'Complete conceptual linkage',
      staticLink: 'Complete static linkage', examRelevance: 'Complete exam relevance',
      futureAngle: 'Future question angle', keywords: ['Synthetic', 'Complete'], category: 'QA',
      subject: 'Economy', topic: 'Synthetic', subtopic: 'Retained', theme: 'Complete',
      examTags: ['CDS', 'CAPF'], dpScore: 85, sourceName: 'PIB',
      sourceUrl: `https://pib.gov.in/test/${date}/${i}`, sourceDate: date,
      linkedPyqIds: ['CDS_II_2026_GK_011'],
      mcqs: [{ question: `  Synthetic MCQ ${i}?  `, options: { A: 'One', B: 'Two', C: 'Three', D: 'Four' },
        correctOption: 'B', explanation: 'Full explanation\n\nSecond explanation paragraph.',
        examEdge: 'Complete exam edge', difficulty: 'Moderate', contentStatus: 'VERIFIED',
        sourceUrl: 'https://pib.gov.in/test', examTags: ['CDS'] }],
    })) });
}
module.exports = { approve, edition };
