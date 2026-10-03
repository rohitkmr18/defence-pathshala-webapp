import test from "node:test";
import assert from "node:assert/strict";

// Test 1: Canonical QuestionSetFilters Parsing & Serialization
import {
  parseListParam,
  parseNumberListParam,
  parseFiltersFromSearchParams,
  serializeFiltersToSearchParams,
  buildPracticeUrl,
  buildPracticeSessionUrl,
  buildExploreUrl,
} from "../lib/question-filters.ts";

// Test 2: Canonical Question Intelligence Normalization
import { normalizeQuestion } from "../lib/question-intelligence.ts";

test("parseListParam splits and trims comma-separated values and arrays", () => {
  assert.deepEqual(parseListParam("CDS, CAPF-AC"), ["CDS", "CAPF-AC"]);
  assert.deepEqual(parseListParam(["CDS", "NDA, CDS"]), ["CDS", "NDA"]);
  assert.deepEqual(parseListParam(""), []);
  assert.deepEqual(parseListParam(null), []);
});

test("parseNumberListParam parses valid years", () => {
  assert.deepEqual(parseNumberListParam("2024, 2025, 2026"), [2024, 2025, 2026]);
  assert.deepEqual(parseNumberListParam(["2023", "invalid, 2024"]), [2023, 2024]);
});

test("parseFiltersFromSearchParams parses all filter dimensions", () => {
  const searchParams = new URLSearchParams(
    "exam=CDS,CAPF-AC&year=2024,2025&cycle=I,II&subject=Indian+Polity&topic=Preamble&subtopic=Key+Terms&difficulty=Moderate&returnTo=%2Fdashboard%2Fquestion-bank"
  );
  const filters = parseFiltersFromSearchParams(searchParams);

  assert.deepEqual(filters.exams, ["CDS", "CAPF-AC"]);
  assert.deepEqual(filters.years, [2024, 2025]);
  assert.deepEqual(filters.cycles, ["I", "II"]);
  assert.deepEqual(filters.subjects, ["Indian Polity"]);
  assert.deepEqual(filters.topics, ["Preamble"]);
  assert.deepEqual(filters.subtopics, ["Key Terms"]);
  assert.deepEqual(filters.difficulties, ["Moderate"]);
  assert.equal(filters.returnTo, "/dashboard/question-bank");
});

test("serializeFiltersToSearchParams preserves all active dimensions", () => {
  const params = serializeFiltersToSearchParams({
    exams: ["CDS"],
    years: [2025],
    cycles: ["I"],
    subjects: ["Geography"],
    topics: ["Physical Geography"],
    subtopics: ["Geomorphology"],
    difficulties: ["Moderate"],
    returnTo: "/dashboard/question-bank?exam=CDS",
  });

  assert.equal(params.get("exam"), "CDS");
  assert.equal(params.get("year"), "2025");
  assert.equal(params.get("cycle"), "I");
  assert.equal(params.get("subject"), "Geography");
  assert.equal(params.get("topic"), "Physical Geography");
  assert.equal(params.get("subtopic"), "Geomorphology");
  assert.equal(params.get("difficulty"), "Moderate");
  assert.equal(params.get("returnTo"), "/dashboard/question-bank?exam=CDS");
});

test("buildPracticeUrl and buildPracticeSessionUrl generate deterministic URLs", () => {
  const practiceUrl = buildPracticeUrl(
    {
      exams: ["CDS", "CAPF-AC"],
      years: [2024],
      subjects: ["Indian Polity"],
    },
    { returnTo: "/dashboard/question-bank?exam=CDS" }
  );

  assert.ok(practiceUrl.startsWith("/dashboard/practice?"));
  assert.ok(practiceUrl.includes("exam=CDS%2CCAPF-AC"));
  assert.ok(practiceUrl.includes("year=2024"));
  assert.ok(practiceUrl.includes("subject=Indian+Polity"));
  assert.ok(practiceUrl.includes("returnTo="));

  const sessionUrl = buildPracticeSessionUrl(
    {
      exams: ["CDS"],
      subjects: ["History"],
    },
    { mode: "instant", returnTo: "/dashboard/practice" }
  );

  assert.ok(sessionUrl.startsWith("/dashboard/practice/session?"));
  assert.ok(sessionUrl.includes("mode=instant"));
  assert.ok(sessionUrl.includes("exam=CDS"));
  assert.ok(sessionUrl.includes("subject=History"));
});

test("normalizeQuestion does NOT use verified_status as eligibility substitute", () => {
  // A question that is Draft / not human verified is STILL intelligence_eligible = true
  const rawDraftQuestion = {
    id: "q-123",
    question_id: "CDS_2025_P1_001",
    exam: "CDS",
    year: 2025,
    subject: "Indian Polity",
    topic: "Preamble",
    question: "What is the Preamble?",
    opt_a: "Intro",
    opt_b: "End",
    opt_c: "Middle",
    opt_d: "None",
    final_opt: "A",
    production_eligible: true,
    intelligence_eligible: true,
    human_review_required: true,
    intelligence_verified: false,
    intelligence_confidence: "MODEL_DERIVED",
    verified_status: "Draft",
    key_discrepancy: false,
    explanation: "Derived explanation",
    source: "Static corpus",
  };

  const normalized = normalizeQuestion(rawDraftQuestion);

  assert.equal(normalized.intelligence_eligible, true);
  assert.equal(normalized.production_eligible, true);
  assert.equal(normalized.human_review_required, true);
  assert.equal(normalized.intelligence_verified, false);
  assert.equal(normalized.intelligence_confidence, "MODEL_DERIVED");
});

test("normalizeQuestion assigns HUMAN_VERIFIED confidence when verified and no discrepancy", () => {
  const rawVerifiedQuestion = {
    id: "q-456",
    question_id: "CDS_2024_P1_002",
    exam: "CDS",
    year: 2024,
    subject: "Geography",
    topic: "Climate",
    question: "Monsoon mechanism...",
    opt_a: "A",
    opt_b: "B",
    opt_c: "C",
    opt_d: "D",
    final_opt: "B",
    production_eligible: true,
    intelligence_eligible: true,
    human_review_required: false,
    intelligence_verified: true,
    intelligence_confidence: "HUMAN_VERIFIED",
    verified_status: "Verified",
    key_discrepancy: false,
    explanation: "Official explanation",
    source: "NCERT Class 11",
  };

  const normalized = normalizeQuestion(rawVerifiedQuestion);

  assert.equal(normalized.intelligence_eligible, true);
  assert.equal(normalized.production_eligible, true);
  assert.equal(normalized.human_review_required, false);
  assert.equal(normalized.intelligence_verified, true);
  assert.equal(normalized.intelligence_confidence, "HUMAN_VERIFIED");
});

// Test Suite: 7 Canonical Explore <-> Practice Filter Equivalence Combinations
test("Filter Equivalence Combination 1: exam only", () => {
  const exploreFilter = { exams: ["CDS"] };
  const practiceUrl = buildPracticeUrl(exploreFilter, { returnTo: "/dashboard/question-bank?exam=CDS" });
  const parsedParams = new URL(practiceUrl, "http://localhost").searchParams;
  const reconstructed = parseFiltersFromSearchParams(parsedParams);

  assert.deepEqual(reconstructed.exams, exploreFilter.exams);
  assert.deepEqual(reconstructed.subjects, []);
  assert.deepEqual(reconstructed.years, []);
});

test("Filter Equivalence Combination 2: exam + subject", () => {
  const exploreFilter = { exams: ["CAPF-AC"], subjects: ["Indian Polity"] };
  const practiceUrl = buildPracticeUrl(exploreFilter);
  const parsedParams = new URL(practiceUrl, "http://localhost").searchParams;
  const reconstructed = parseFiltersFromSearchParams(parsedParams);

  assert.deepEqual(reconstructed.exams, ["CAPF-AC"]);
  assert.deepEqual(reconstructed.subjects, ["Indian Polity"]);
  assert.deepEqual(reconstructed.topics, []);
});

test("Filter Equivalence Combination 3: exam + subject + topic", () => {
  const exploreFilter = { exams: ["CDS"], subjects: ["Geography"], topics: ["Physical Geography"] };
  const practiceUrl = buildPracticeUrl(exploreFilter);
  const parsedParams = new URL(practiceUrl, "http://localhost").searchParams;
  const reconstructed = parseFiltersFromSearchParams(parsedParams);

  assert.deepEqual(reconstructed.exams, ["CDS"]);
  assert.deepEqual(reconstructed.subjects, ["Geography"]);
  assert.deepEqual(reconstructed.topics, ["Physical Geography"]);
});

test("Filter Equivalence Combination 4: exam + year", () => {
  const exploreFilter = { exams: ["CDS"], years: [2024] };
  const practiceUrl = buildPracticeUrl(exploreFilter);
  const parsedParams = new URL(practiceUrl, "http://localhost").searchParams;
  const reconstructed = parseFiltersFromSearchParams(parsedParams);

  assert.deepEqual(reconstructed.exams, ["CDS"]);
  assert.deepEqual(reconstructed.years, [2024]);
});

test("Filter Equivalence Combination 5: exam + cycle", () => {
  const exploreFilter = { exams: ["CDS"], cycles: ["I"] };
  const practiceUrl = buildPracticeUrl(exploreFilter);
  const parsedParams = new URL(practiceUrl, "http://localhost").searchParams;
  const reconstructed = parseFiltersFromSearchParams(parsedParams);

  assert.deepEqual(reconstructed.exams, ["CDS"]);
  assert.deepEqual(reconstructed.cycles, ["I"]);
});

test("Filter Equivalence Combination 6: exam + subject + topic + difficulty", () => {
  const exploreFilter = {
    exams: ["CDS"],
    subjects: ["Indian Polity"],
    topics: ["Parliament"],
    difficulties: ["Hard"],
  };
  const practiceUrl = buildPracticeUrl(exploreFilter);
  const parsedParams = new URL(practiceUrl, "http://localhost").searchParams;
  const reconstructed = parseFiltersFromSearchParams(parsedParams);

  assert.deepEqual(reconstructed.exams, ["CDS"]);
  assert.deepEqual(reconstructed.subjects, ["Indian Polity"]);
  assert.deepEqual(reconstructed.topics, ["Parliament"]);
  assert.deepEqual(reconstructed.difficulties, ["Hard"]);
});

test("Filter Equivalence Combination 7: multi-exam + multi-year combination", () => {
  const exploreFilter = {
    exams: ["CDS", "CAPF-AC", "NDA"],
    years: [2023, 2024, 2025],
    subjects: ["History"],
    difficulties: ["Moderate", "Hard"],
  };
  const practiceUrl = buildPracticeUrl(exploreFilter);
  const parsedParams = new URL(practiceUrl, "http://localhost").searchParams;
  const reconstructed = parseFiltersFromSearchParams(parsedParams);

  assert.deepEqual(reconstructed.exams, ["CDS", "CAPF-AC", "NDA"]);
  assert.deepEqual(reconstructed.years, [2023, 2024, 2025]);
  assert.deepEqual(reconstructed.subjects, ["History"]);
  assert.deepEqual(reconstructed.difficulties, ["Moderate", "Hard"]);
});



test("missing canonical contract never invents eligibility or human verification", () => {
 const q = normalizeQuestion({ id: 'missing-contract', question: 'Text', final_opt: 'A',
   opt_a: 'A', opt_b: 'B', opt_c: 'C', opt_d: 'D', verified_status: 'Verified' });
 assert.equal(q.production_eligible, false);
 assert.equal(q.intelligence_eligible, false);
 assert.equal(q.intelligence_verified, false);
 assert.equal(q.intelligence_confidence, 'MODEL_DERIVED');
});
