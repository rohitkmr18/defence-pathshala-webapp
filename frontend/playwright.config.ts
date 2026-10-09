import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e", workers: 1, timeout: 60000,
  outputDir: "../test-results/issue-47",
  use: { baseURL: "http://127.0.0.1:4548", viewport: { width: 390, height: 844 },
    launchOptions: { executablePath: process.env.DP_CHROMIUM_PATH || "/usr/bin/chromium", args: ["--no-sandbox"] },
    trace: "retain-on-failure" },
  webServer: [
    { command: "node ../scripts/test-support/editorial-upstream.cjs", url: "http://127.0.0.1:4547/__qa", reuseExistingServer: false },
    { command: "npm run dev -- --hostname 127.0.0.1 --port 4548", url: "http://127.0.0.1:4548/current-affairs/2030-01-01", timeout: 120000,
      env: { NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:4547", NEXT_PUBLIC_SUPABASE_ANON_KEY: "synthetic-anon",
        SUPABASE_SERVICE_ROLE_KEY: "synthetic-service", NEXT_TELEMETRY_DISABLED: "1" } },
  ],
});
