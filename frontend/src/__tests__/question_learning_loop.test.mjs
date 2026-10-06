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
import { classifyAttempt, getPaceTargetSeconds } from "../lib/attempt-intelligence.ts";
import { renderOptionText } from "../components/practice/player/renderers/renderQuestionText.ts";

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


test("session-style browser URL parsing preserves repeated comma-bearing subtopics", () => {
  const params = new URLSearchParams();
  params.set("filter_format", "v2");
  params.append("exam", "CDS");
  params.append("subject", "Science & Technology");
  params.append("topic", "Chemistry");
  params.append("subtopic", "Industrial, Materials & Applied Chemistry");
  params.append("subtopic", "Acids, Bases, pH & Commercial Inorganic Salts");

  const reconstructed = parseFiltersFromSearchParams(
    new URLSearchParams(params.toString())
  );

  assert.deepEqual(reconstructed.subtopics, [
    "Industrial, Materials & Applied Chemistry",
    "Acids, Bases, pH & Commercial Inorganic Salts",
  ]);
});

test("v2 filter serialization preserves commas inside taxonomy labels", () => {
  const filters = {
    exams: ["CDS", "CAPF-AC"],
    subjects: ["Science & Technology"],
    topics: ["Chemistry"],
    subtopics: [
      "Industrial, Materials & Applied Chemistry",
      "Acids, Bases, pH & Commercial Inorganic Salts",
    ],
  };
  const params = serializeFiltersToSearchParams(filters);
  assert.equal(params.get("filter_format"), "v2");
  assert.deepEqual(params.getAll("exam"), ["CDS", "CAPF-AC"]);
  assert.deepEqual(params.getAll("subtopic"), filters.subtopics);

  const reconstructed = parseFiltersFromSearchParams(params);
  assert.deepEqual(reconstructed.exams, filters.exams);
  assert.deepEqual(reconstructed.subjects, filters.subjects);
  assert.deepEqual(reconstructed.topics, filters.topics);
  assert.deepEqual(reconstructed.subtopics, filters.subtopics);
});

test("legacy comma-separated filter URLs remain backward compatible", () => {
  const legacy = new URLSearchParams(
    "exam=CDS,CAPF-AC&year=2024,2025&subject=History"
  );
  const parsed = parseFiltersFromSearchParams(legacy);
  assert.deepEqual(parsed.exams, ["CDS", "CAPF-AC"]);
  assert.deepEqual(parsed.years, [2024, 2025]);
  assert.deepEqual(parsed.subjects, ["History"]);
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
  assert.ok(practiceUrl.includes("filter_format=v2"));
  assert.ok(practiceUrl.includes("exam=CDS"));
  assert.ok(practiceUrl.includes("exam=CAPF-AC"));
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


test("normalizeQuestion preserves canonical v2 trust fields and numeric intelligence metrics", () => {
  const normalized = normalizeQuestion({
    id: "q-trust",
    question_id: "CDS_2025_TRUST_1",
    exam: "CDS",
    year: 2025,
    subject: "Polity",
    topic: "Parliament",
    question: "Question",
    opt_a: "A",
    opt_b: "B",
    opt_c: "C",
    opt_d: "D",
    final_opt: "A",
    intelligence_trust_tier: "MODEL_READY",
    intelligence_verification_status: "UNVERIFIED_READY",
    student_release_status: "RELEASED",
    expected_knowledge: 0.72,
    source_accessibility: 0.8,
    preparation_accessibility: 0.64,
    cognitive_complexity: 0.51,
  });

  assert.equal(normalized.intelligence_trust_tier, "MODEL_READY");
  assert.equal(normalized.intelligence_verification_status, "UNVERIFIED_READY");
  assert.equal(normalized.student_release_status, "RELEASED");
  assert.equal(normalized.expected_knowledge, 0.72);
  assert.equal(normalized.source_accessibility, 0.8);
  assert.equal(normalized.preparation_accessibility, 0.64);
  assert.equal(normalized.cognitive_complexity, 0.51);
});

test("option rendering strips only explicit labels and preserves real initial letters", () => {
  assert.equal(renderOptionText("A. Explicit label", "A"), "Explicit label");
  assert.equal(renderOptionText("(B) Explicit label", "B"), "Explicit label");
  assert.equal(renderOptionText("Argentina", "A"), "Argentina");
  assert.equal(renderOptionText("British Constitution", "B"), "British Constitution");
});

test("attempt intelligence is deterministic across correctness, pace and difficulty", () => {
  assert.equal(getPaceTargetSeconds("Easy"), 35);
  assert.equal(getPaceTargetSeconds("Moderate"), 45);
  assert.equal(getPaceTargetSeconds("Hard"), 60);

  assert.equal(classifyAttempt(true, 30, "Easy").state, "strong_execution");
  assert.equal(classifyAttempt(true, 50, "Moderate").state, "correct_slow");
  assert.equal(classifyAttempt(false, 30, "Moderate").state, "incorrect_fast");
  assert.equal(classifyAttempt(false, 70, "Hard").state, "incorrect_slow");
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

