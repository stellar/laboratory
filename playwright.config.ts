import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3000;
// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = `http://localhost:${PORT}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* Timeout per test */
  timeout: 20 * 1000,
  /* Tests directory */
  testDir: "./tests/e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry */
  retries: 2,
  workers: 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "list",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env.CI ? "retain-on-failure" : "off",
    screenshot: "off",
    video: "off",
    actionTimeout: 10 * 1000,
    navigationTimeout: 15 * 1000,
    launchOptions: {
      args: [
        // Block Google Translate CDN requests so they don't slow down page
        // loads in test environments. The app loads the GT script on every
        // page (src/app/layout.tsx), and in environments with restricted or
        // slow access to Google's CDN the external requests can push page
        // loads past navigationTimeout, causing flaky failures in unrelated
        // tests. Mapping these hosts to 127.0.0.1 makes connections fail
        // immediately ("connection refused") rather than hanging. The async
        // GT script handles the failure gracefully without blocking page load.
        // Language selector tests are unaffected — they only verify cookie
        // behaviour and UI state, not that the page is actually translated.
        "--host-rules=MAP translate.google.com 127.0.0.1, MAP translate.googleapis.com 127.0.0.1",
      ],
    },
  },

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "pnpm dev",
    url: baseURL,
    timeout: 60 * 1000,
    reuseExistingServer: !process.env.CI,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // TODO: enable these later if needed
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
