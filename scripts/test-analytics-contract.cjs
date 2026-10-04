const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const createLoader = require("./test-support/load-ts.cjs");

function storage() {
  const values = new Map();
  return {
    get length() { return values.size; },
    key: index => [...values.keys()][index],
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  };
}

function fixture(env = {}, localStorage = storage()) {
  const calls = { capture: [], identify: [], reset: [], init: [], register: [] };
  const sdk = Object.fromEntries(Object.keys(calls).map(method =>
    [method, (...args) => calls[method].push(args)]));
  const window = { localStorage, innerWidth: 390,
    location: { origin: "https://preview.test", pathname: "/dashboard/question-bank" } };
  const sessionStorage = storage();
  const globals = { window, sessionStorage, process: { env: {
    NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: "test-project-token",
    NEXT_PUBLIC_POSTHOG_HOST: "https://us.i.posthog.com",
    NEXT_PUBLIC_DP_DEPLOYMENT_ENV: "preview",
    NEXT_PUBLIC_DP_GIT_SHA: "test-sha", ...env,
  } } };
  const load = createLoader({ "posthog-js": sdk }, globals);
  const provider = load("frontend/src/lib/analytics/providers/posthog.ts");
  const track = load("frontend/src/lib/analytics/track.ts");
  provider.initializePostHog();
  return { calls, sdk, window, sessionStorage, globals, load, provider, ...track };
}

test("one canonical event reaches GA4 and SDK with authoritative release/identity context", () => {
  const f = fixture();
  f.trackProductEvent("explore_viewed", { source_surface: "explore", git_sha: "wrong", user_id: "wrong" });
  const [command, name, ga4] = f.window.dataLayer[0];
  const [sdkName, properties] = f.calls.capture[0];
  assert.equal(command, "event");
  assert.equal(name, "explore_viewed");
  assert.equal(sdkName, name);
  assert.equal(JSON.stringify(properties), JSON.stringify(ga4));
  assert.equal(properties.event_version, 1);
  assert.equal(properties.deployment_environment, "preview");
  assert.equal(properties.git_sha, "test-sha");
  assert.equal(properties.user_id, undefined);
  assert.equal(properties.auth_state, "anonymous");
  assert.ok(properties.timestamp);
  assert.ok(properties.anonymous_id);
  assert.equal(f.calls.init[0][1].bootstrap.distinctID, properties.anonymous_id);
});

test("environment separation uses build-time metadata, including production on a preview-looking hostname", () => {
  for (const environment of ["production", "preview", "development", "test"]) {
    const f = fixture({ NEXT_PUBLIC_DP_DEPLOYMENT_ENV: environment });
    f.window.location.hostname = "anything.vercel.app";
    f.trackProductEvent("explore_viewed");
    assert.equal(f.calls.capture[0][1].deployment_environment, environment);
  }
  const f = fixture({ NEXT_PUBLIC_DP_DEPLOYMENT_ENV: "", NODE_ENV: "test" });
  f.trackProductEvent("explore_viewed");
  assert.equal(f.calls.capture[0][1].deployment_environment, "test");
});

test("anonymous ID survives events/reloads and unavailable storage", () => {
  const local = storage();
  const first = fixture({}, local);
  first.trackProductEvent("explore_viewed");
  first.trackProductEvent("practice_cta_clicked");
  const id = first.calls.capture[0][1].anonymous_id;
  assert.equal(first.calls.capture[1][1].anonymous_id, id);
  const reloaded = fixture({}, local);
  reloaded.trackProductEvent("explore_viewed");
  assert.equal(reloaded.calls.capture[0][1].anonymous_id, id);
  const blocked = fixture({}, { getItem() { throw Error("blocked"); }, setItem() { throw Error("blocked"); } });
  blocked.trackProductEvent("explore_viewed");
  blocked.trackProductEvent("practice_cta_clicked");
  assert.ok(blocked.calls.capture[0][1].anonymous_id);
  assert.equal(blocked.calls.capture[0][1].anonymous_id, blocked.calls.capture[1][1].anonymous_id);
});

test("UUID identify links the bootstrapped visitor; logout and account switches isolate identities", () => {
  const f = fixture();
  const uuid = "11111111-1111-4111-8111-111111111111";
  f.trackProductEvent("explore_viewed");
  const visitor = f.calls.capture[0][1].anonymous_id;
  f.resetAnalyticsUser(); // initial anonymous auth callback must preserve the journey
  assert.equal(f.calls.reset.length, 0);
  f.identifyAnalyticsUser(uuid);
  f.identifyAnalyticsUser(uuid); // token refresh/Strict Mode must not identify twice
  assert.deepEqual(f.calls.identify, [[uuid]]);
  f.trackProductEvent("dashboard_viewed", {}, "dashboard");
  assert.equal(f.calls.capture.at(-1)[1].user_id, uuid);
  assert.equal(f.calls.capture.at(-1)[1].anonymous_id, visitor);
  f.resetAnalyticsUser(true);
  assert.equal(f.calls.reset.length, 1);
  assert.equal(f.calls.reset[0][0].resetDeviceID, true);
  f.trackProductEvent("dashboard_logged_out_viewed");
  const nextVisitor = f.calls.capture.at(-1)[1].anonymous_id;
  assert.notEqual(nextVisitor, visitor);
  assert.equal(f.calls.capture.at(-1)[1].user_id, undefined);
  assert.equal(f.calls.reset[0][0].bootstrap.distinctID, nextVisitor);
  f.identifyAnalyticsUser("22222222-2222-4222-8222-222222222222");
  f.trackProductEvent("dashboard_viewed", {}, "dashboard");
  assert.equal(f.calls.capture.at(-1)[0], "dashboard_viewed");
  f.identifyAnalyticsUser(uuid); // switch without a preceding SIGNED_OUT also resets
  assert.equal(f.calls.reset.length, 2);
});

test("Check/Next deduplication dispatches one logical event per interaction key", () => {
  const f = fixture();
  for (const name of ["answer_checked", "next_question_clicked"]) {
    f.trackProductEvent(name, { practice_session_id: "session" }, "session:q1");
    f.trackProductEvent(name, { practice_session_id: "session" }, "session:q1");
    assert.equal(f.calls.capture.filter(event => event[0] === name).length, 1);
    assert.equal(f.window.dataLayer.filter(event => event[1] === name).length, 1);
  }
});

test("missing configuration and SDK failure never break events or GA4", () => {
  const absent = fixture({ NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: "" });
  absent.trackProductEvent("explore_viewed");
  absent.identifyAnalyticsUser("11111111-1111-4111-8111-111111111111");
  absent.resetAnalyticsUser(true);
  assert.equal(absent.calls.init.length, 0);
  assert.equal(absent.calls.capture.length, 0);
  assert.equal(absent.window.dataLayer.length, 1);
  const f = fixture();
  const location = f.window.location;
  f.window.location = undefined;
  assert.doesNotThrow(() => f.trackProductEvent("auth_started"));
  f.window.location = location;
  for (const method of ["capture", "identify", "reset"]) f.sdk[method] = () => { throw Error("SDK failed"); };
  assert.doesNotThrow(() => f.trackProductEvent("explore_viewed"));
  assert.doesNotThrow(() => f.identifyAnalyticsUser("11111111-1111-4111-8111-111111111111"));
  assert.doesNotThrow(() => f.resetAnalyticsUser(true));
  assert.equal(f.window.dataLayer.length, 1);
});

test("replay masks input/text/attributes and excludes console/network payloads and credential URLs", () => {
  const f = fixture();
  const config = f.calls.init[0][1];
  assert.equal(config.autocapture, false);
  assert.equal(config.capture_pageview, false);
  assert.equal(config.enable_recording_console_log, false);
  assert.equal(config.capture_performance, false);
  assert.equal(config.disable_session_recording, false);
  assert.equal(config.session_recording.maskAllInputs, true);
  assert.equal(config.session_recording.maskTextSelector, "*");
  assert.equal(config.session_recording.maskAllElementAttributes, true);
  assert.equal(config.session_recording.recordHeaders, false);
  assert.equal(config.session_recording.recordBody, false);
  assert.equal(config.session_recording.maskCapturedNetworkRequestFn({ body: "secret" }), null);
  assert.equal(config.disable_capture_url_hashes, true);
  assert.equal(config.mask_personal_data_properties, true);
  for (const key of ["code", "otp", "access_token", "refresh_token", "token_hash"])
    assert.ok(config.custom_personal_data_properties.includes(key));
  const event = config.before_send({ properties: {
    $current_url: "https://preview.test/auth/callback?code=secret#access_token=secret",
    $referrer: "https://example.test/?email=secret", source_surface: "login",
  } });
  assert.equal(event.properties.$current_url, "https://preview.test/auth/callback");
  assert.equal(event.properties.$referrer, "https://example.test/");
  f.trackProductEvent("otp_verified", { auth_method: "email_otp", email: "secret", otp: "secret",
    password: "secret", access_token: "secret", refresh_token: "secret", auth_token: "secret" });
  for (const payload of [f.calls.capture.at(-1)[1], f.window.dataLayer.at(-1)[2]]) {
    assert.doesNotMatch(JSON.stringify(payload), /secret/);
    assert.equal(payload.auth_method, "email_otp");
  }
});

test("auth listener identifies UUID only and ignores stale getUser response after logout", async () => {
  let resolveUser; let listener; let cleanup;
  const calls = [];
  const load = createLoader({
    react: { useEffect(effect) { cleanup = effect(); } },
    "@/lib/supabase/client": { createClient: () => ({ auth: {
      getUser: () => new Promise(resolve => { resolveUser = resolve; }),
      onAuthStateChange(callback) { listener = callback; return { data: { subscription: { unsubscribe() {} } } }; },
    } }) },
    "@/lib/analytics/track": {
      identifyAnalyticsUser: (...args) => calls.push(["identify", ...args]),
      resetAnalyticsUser: (...args) => calls.push(["reset", ...args]), trackProductEvent() {},
    },
  }, { sessionStorage: storage() });
  load("frontend/src/components/analytics/AnalyticsIdentity.tsx").default();
  const uuid = "11111111-1111-4111-8111-111111111111";
  listener("SIGNED_IN", { user: { id: uuid, email: "secret" }, access_token: "secret" });
  listener("SIGNED_OUT", null);
  resolveUser({ data: { user: { id: uuid } } });
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(calls, [["identify", uuid], ["reset", true]]);
  cleanup();
  listener("SIGNED_IN", { user: { id: uuid } });
  assert.equal(calls.length, 2);
});

test("P0 learner-intelligence surfaces emit canonical events", () => {
  const dashboard = read("frontend/src/components/dashboard/LearnerDashboardOverview.tsx");
  const loggedOut = read("frontend/src/components/dashboard/LoggedOutDashboard.tsx");
  const practice = read("frontend/src/app/dashboard/practice/session/SessionPageClient.tsx");
  const mistakes = read("frontend/src/app/dashboard/mistakes/page.tsx");
  const mistakeDetail = read("frontend/src/app/dashboard/mistakes/[questionId]/page.tsx");
  const explorer = read("frontend/src/components/question-bank/QuestionBankExplorer.tsx");
  const heatmap = read("frontend/src/components/charts/TopicHeatmap.tsx");
  const player = read("frontend/src/components/practice/player/QuestionPlayer.tsx");
  const otp = read("frontend/src/components/auth/EmailOtpForm.tsx");
  const identity = read("frontend/src/components/analytics/AnalyticsIdentity.tsx");
  const onboarding = read("frontend/src/app/onboarding/OnboardingForm.tsx");

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

  for (const event of ["explore_viewed", "exam_selected", "subject_selected"])
    assert.match(explorer, new RegExp(event));
  for (const event of ["topic_selected", "practice_cta_clicked"])
    assert.match(heatmap, new RegExp(event));
  for (const event of ["question_answered", "answer_checked", "next_question_clicked", "question_skipped"])
    assert.match(player, new RegExp(event));
  for (const event of ["auth_started", "otp_requested", "otp_verified"])
    assert.match(otp, new RegExp(event));

  assert.match(identity, /identifyAnalyticsUser/);
  assert.match(identity, /resetAnalyticsUser/);
  assert.match(identity, /auth_return_completed/);
  assert.match(onboarding, /onboarding_started/);
  assert.match(onboarding, /onboarding_completed/);
});
