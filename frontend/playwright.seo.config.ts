import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e", testMatch: "seo-foundation.spec.ts", workers: 1,
  outputDir: "../test-results/seo", timeout: 60000,
  use: { baseURL: "http://127.0.0.1:4558", launchOptions: { executablePath: process.env.DP_CHROMIUM_PATH || "/usr/bin/chromium", args: ["--no-sandbox"] }, trace: "retain-on-failure" },
  webServer: [
    { command: "node ../scripts/test-support/seo-upstream.cjs", url: "http://127.0.0.1:4557/__qa" },
    { command: "npm run start -- --hostname 127.0.0.1 --port 4558", url: "http://127.0.0.1:4558/pyqs/cds", timeout: 120000,
      env: { NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:4557", NEXT_PUBLIC_SUPABASE_ANON_KEY: "synthetic-anon", SUPABASE_SERVICE_ROLE_KEY: "synthetic-service", NEXT_TELEMETRY_DISABLED: "1" } },
  ],
});
