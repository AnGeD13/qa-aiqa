import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: process.env.CI ? 90_000 : 30_000,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    ["html", { open: process.env.CI ? "never" : "on-failure" }],
    ["json", { outputFile: "playwright-report/results.json" }],
    ["junit", { outputFile: "playwright-report/results.xml" }],
  ],
  projects: [
    {
      name: 'unit',
      testDir: './automation/tests/unit',
    },
    {
      name: 'api',
      testDir: './automation/tests/api',
    },
    {
      name: 'e2e',
      testDir: './automation/tests/e2e',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.POMIDORQA_BASE_URL ?? 'https://aiqa.su',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
  ],
});
