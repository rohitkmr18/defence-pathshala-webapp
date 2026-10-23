import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "afcat-visual.spec.ts",
  workers: 1,
  timeout: 60000,
  use: {
    baseURL: "http://127.0.0.1:4588",
    viewport: { width: 390, height: 844 },
    launchOptions: {
      executablePath: process.env.DP_CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
    },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 4588",
    url: "http://127.0.0.1:4588/afcat/visual-preview",
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  },
});
