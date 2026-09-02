import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  timeout: 30_000,

  projects: [
    {
      // Pure-function specs (no browser) — fast
      name: "logic",
      testMatch: "tests/logic/**/*.spec.ts",
      use: {},
    },
    {
      // E2E specs — headed chromium
      name: "e2e",
      testMatch: "tests/e2e/**/*.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
