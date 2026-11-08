import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({
  ...base,
  testMatch: 'landing.spec.ts',
  outputDir: '../test-results/landing',
  webServer: Array.isArray(base.webServer)
    ? base.webServer.map(server => ({ ...server, reuseExistingServer: !process.env.CI }))
    : base.webServer,
});
