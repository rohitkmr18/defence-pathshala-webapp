const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("canonical analytics layer owns provider dispatch", () => {
  const track = read("frontend/src/lib/analytics/track.ts");
  const ga4 = read("frontend/src/lib/analytics/providers/ga4.ts");
  const posthog = read("frontend/src/lib/analytics/providers/posthog.ts");
  const legacy = read("frontend/src/lib/learning-events.ts");

  assert.match(track, /captureGa4\(name, event\)/);
  assert.match(track, /capturePostHog\(name, event\)/);
  assert.match(track, /event_version/);
  assert.match(track, /deployment_environment/);
  assert.match(track, /git_sha/);
  assert.match(track, /anonymous_id/);
  assert.match(ga4, /dataLayer\.push/);
  assert.match(posthog, /posthog/);
  assert.match(legacy, /trackProductEventUnsafe/);
});

test("P0 learner-intelligence surfaces emit canonical events", () => {
  const dashboard = read("frontend/src/components/dashboard/LearnerDashboardOverview.tsx");
  const loggedOut = read("frontend/src/components/dashboard/LoggedOutDashboard.tsx");
  const practice = read("frontend/src/app/dashboard/practice/session/SessionPageClient.tsx");
  const mistakes = read("frontend/src/app/dashboard/mistakes/page.tsx");
  const mistakeDetail = read("frontend/src/app/dashboard/mistakes/[questionId]/page.tsx");

  for (const event of [
    "dashboard_viewed",
    "next_best_action_viewed",
    "next_best_action_clicked",
  ]) assert.match(dashboard, new RegExp(event));

  assert.match(loggedOut, /dashboard_logged_out_viewed/);

  for (const event of ["practice_started", "practice_resumed", "practice_completed"])
    assert.match(practice, new RegExp(event));

  for (const event of ["mistake_list_viewed", "mistake_review_started", "related_practice_started"])
    assert.match(mistakes, new RegExp(event));

  assert.match(mistakeDetail, /mistake_question_opened/);
  assert.match(mistakeDetail, /related_practice_started/);
});
