import { test, expect } from "@playwright/test";

test.describe("Network selector", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Stellar Laboratory");
  });

  test("Renders info cards", async ({ page }) => {
    await expect(page.locator("h2")).toHaveText([
      "Stellar Quest",
      "Developer Tools",
      "Stellar RPC",
      "Horizon",
    ]);
  });
});
