import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import loader from './test-support/load-ts.cjs';
import React from '../frontend/node_modules/react/index.js';
import { renderToStaticMarkup } from '../frontend/node_modules/react-dom/server.node.js';
const root = fileURLToPath(new URL('..', import.meta.url));
const { parseStatementQuestion } = loader()(path.join(root, 'frontend/src/lib/current-affairs/question-display.ts'));
const fixture = JSON.parse(readFileSync(new URL('./test-support/monthly-public-fixture.json', import.meta.url), 'utf8'));
const question = JSON.parse(fixture.approved_editorial_source).stories[0].mcqs[0].question;

test('approved BIMSTEC statement rendering is a lossless presentation split', () => {
  const parsed = parseStatementQuestion(question);
  assert.ok(parsed);
  assert.equal(parsed.statements.length, 3);
  assert.equal(parsed.statements[0].trim(), '1. The meeting took place in New Delhi.');
  assert.ok(parsed.statements[1].includes('March 2021.'));
  assert.equal(parsed.intro + parsed.statements.join('') + parsed.prompt, question);
});

test('representative inline and multiline numbered syntax preserves every byte and its original final prompt', () => {
  for (const separator of [' ', '\n', '\r\n', '  ']) {
    for (const prompt of ['Which statements are correct?', 'Which of the statements given above is/are correct?', 'Which of the above statements are correct?']) {
      const source = 'Consider the following statements:' + separator + '1. First statement.' + separator + '2. Second statement.' + separator + prompt;
      const parsed = parseStatementQuestion(source);
      assert.ok(parsed);
      assert.equal(parsed.intro + parsed.statements.join('') + parsed.prompt, source);
      assert.equal(parsed.statements[1].trim(), '2. Second statement.');
    }
  }
});

test('ordinary questions and ambiguous structures retain the original renderer without inventing a prompt', () => {
  for (const source of [
    'Where is the BIMSTEC Secretariat?',
    'Which event occurred on 1. January?',
    'Consider the following statements: 1. Only one statement. Which statements are correct?',
    'Consider the following statements: 1. First. 3. Gap. Which statements are correct?',
    'Consider the following statements: 1. First. 1. Duplicate. Which statements are correct?',
    'Consider the following statements: 1. First. 2. Second.',
    'Consider the following statements: 1. Is this quoted question? 2. Second. Which statements are correct?',
    'Consider the following statements: 1. First. 2. Nested 2.1. example. Which statements are correct?',
    'Consider the following statements: 1. First. 2. Second. 10. Extra. Which statements are correct?',
    '**Consider the following statements:** 1. First. 2. Second. Which statements are correct?',
    'Consider the following statements: 1. First. 2. Second. Choose an answer below.',
  ]) assert.equal(parseStatementQuestion(source), null, source);
});

test('production question component renders separate numbered lines and faithfully falls back for ordinary approved text', () => {
  const Question = loader({
    '@/lib/current-affairs/question-display': { parseStatementQuestion },
    './EditorialMarkdown': ({ source }) => React.createElement('div', { 'data-approved-renderer': true }, source),
  })(path.join(root, 'frontend/src/components/current-affairs/CurrentAffairsQuestion.tsx')).default;
  const html = renderToStaticMarkup(React.createElement(Question, { source: question, approved: true }));
  assert.equal((html.match(/<li /g) ?? []).length, 3);
  assert.ok(html.includes('aria-label="Question statements"'));
  assert.ok(html.includes('1. The meeting took place in New Delhi.'));
  const ordinary = 'Where is the BIMSTEC Secretariat?';
  assert.ok(renderToStaticMarkup(React.createElement(Question, { source: ordinary, approved: true })).includes(ordinary));
  assert.ok(renderToStaticMarkup(React.createElement(Question, { source: ordinary, approved: true })).includes('data-approved-renderer'));
});
