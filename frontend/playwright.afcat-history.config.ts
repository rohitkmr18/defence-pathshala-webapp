import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e", testMatch: "afcat-history.spec.ts",
  workers: 1, timeout: 60000,
  use: { baseURL: "http://127.0.0.1:4593", viewport: { width: 390, height: 844 },
    launchOptions: { executablePath: process.env.DP_CHROMIUM_PATH || "/usr/bin/chromium", args: ["--no-sandbox"] } },
  webServer: { command: "npm run start -- --hostname 127.0.0.1 --port 4593",
    url: "http://127.0.0.1:4593/afcat/dashboard", timeout: 120000,
    reuseExistingServer: false },
});