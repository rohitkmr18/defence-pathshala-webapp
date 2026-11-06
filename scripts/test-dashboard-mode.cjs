const { test } = require("node:test");
const assert = require("node:assert/strict");
const createLoader = require("./test-support/load-ts.cjs");

test("dashboard renders acquisition surface for logged-out visitors", async () => {
  const load = createLoader({
    "@/components/dashboard/LearnerDashboardOverview": "learner-dashboard",
    "@/components/dashboard/LoggedOutDashboard": "logged-out-dashboard",
    "@/lib/profile-server": {
      getSafeProfile: async () => ({
        user: null,
        profile: { full_name: "", target_exams: [] },
      }),
    },
  });
  const DashboardPage = load("frontend/src/app/dashboard/page.tsx").default;
  const tree = await DashboardPage();
  assert.equal(tree.type, "logged-out-dashboard");
});

test("dashboard renders learner intelligence for authenticated users", async () => {
  const load = createLoader({
    "@/components/dashboard/LearnerDashboardOverview": "learner-dashboard",
    "@/components/dashboard/LoggedOutDashboard": "logged-out-dashboard",
    "@/lib/profile-server": {
      getSafeProfile: async () => ({
        user: { email: "aspirant@example.test" },
        profile: { full_name: "Test Aspirant", target_exams: ["CDS"] },
      }),
    },
  });
  const DashboardPage = load("frontend/src/app/dashboard/page.tsx").default;
  const tree = await DashboardPage();
  // The overview reads ?paper= (GS / Maths / English), so the page wraps it in <Suspense>.
  const boundary = tree.props.children.props.children;
  const learner = boundary.props.fallback !== undefined ? boundary.props.children : boundary;
  assert.equal(learner.type, "learner-dashboard");
  assert.equal(learner.props.firstName, "Test");
  assert.deepEqual(Array.from(learner.props.targetExams), ["CDS"]);
});
