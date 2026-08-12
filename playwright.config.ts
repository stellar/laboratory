import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3000;
// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
export const baseURL = `http://localhost:${PORT}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* Timeout per test */
  timeout: 20 * 1000,
  /* Assertion timeout. Higher than Playwright's 5s default because `next dev`
   * compiles routes lazily: whichever test hits a route first pays a multi-second
   * compile, which can outlast a shorter assertion window. */
  expect: { timeout: 10 * 1000 },
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
  },

  /* Run your local dev server before starting the tests.
   * CI builds first so routes are compiled up front rather than lazily on first
   * hit, which is what makes dev-mode runs timing-sensitive. Locally we stay on
   * `next dev` to keep HMR and a fast edit/re-run loop. */
  webServer: {
    command: process.env.CI ? "pnpm build && pnpm start" : "pnpm dev",
    url: baseURL,
    /* The CI budget has to cover a full production build, not just server boot. */
    timeout: process.env.CI ? 300 * 1000 : 60 * 1000,
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
