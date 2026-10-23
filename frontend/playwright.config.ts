import { defineConfig } from "@playwright/test";
import { execFileSync } from "node:child_process";
import path from "node:path";

export default defineConfig({
  testDir: "./e2e", workers: 1, timeout: 60000,
  metadata: {
    testedGitSha: execFileSync("git", ["rev-parse", "HEAD"], { cwd: __dirname, encoding: "utf8" }).trim(),
    browserRuntime: process.env.DP_E2E_PRODUCTION === "1" ? "production" : "development",
    persistence: "synthetic-local",
  },
  reporter: [["list"], ["json", { outputFile: path.resolve(__dirname, "../test-results/issue-47/results.json") }]],
  projects: [360, 390, 430, 1440].map(width => ({
    name: "width-" + width,
    use: { viewport: { width, height: width === 1440 ? 1000 : 844 } },
  })),
  outputDir: "../test-results/issue-47",
  use: { baseURL: "http://127.0.0.1:4548", viewport: { width: 390, height: 844 },
    launchOptions: { executablePath: process.env.DP_CHROMIUM_PATH || "/usr/bin/chromium", args: ["--no-sandbox"] },
    trace: "retain-on-failure" },
  webServer: [
    { command: "node ../scripts/test-support/editorial-upstream.cjs", cwd: __dirname, url: "http://127.0.0.1:4547/__qa", reuseExistingServer: false },
    { command: process.env.DP_E2E_PRODUCTION === "1" ? "npm run start -- --hostname 127.0.0.1 --port 4548" : "npm run dev -- --hostname 127.0.0.1 --port 4548", url: "http://127.0.0.1:4548/current-affairs/2030-01-01", timeout: 120000,
      cwd: __dirname,
      env: { NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:4547", NEXT_PUBLIC_SUPABASE_ANON_KEY: "synthetic-anon",
        SUPABASE_URL: "http://127.0.0.1:4547", SUPABASE_JWT_SECRET: "synthetic-jwt-secret-for-local-tests-only",
        SUPABASE_SERVICE_ROLE_KEY: "synthetic-service", VERCEL_ENV: "development", NEXT_TELEMETRY_DISABLED: "1" } },
  ],
});
