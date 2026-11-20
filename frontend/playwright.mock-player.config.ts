import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  testMatch: "mock-player.spec.ts",
  workers: 1,
  timeout: 90000,
  use: {
    baseURL: "http://127.0.0.1:4590",
    headless: true,
    launchOptions: { executablePath: process.env.DP_CHROMIUM_PATH },
  },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 4590",
    url: "http://127.0.0.1:4590/mock/cds-gk",
    timeout: 120000,
    reuseExistingServer: false,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "synthetic-fixture-key",
    },
  },
});
