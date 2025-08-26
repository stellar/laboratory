import { test, expect } from "@playwright/test";

test.describe("Introduction Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText(
      "Simulate, Analyze, and Explore — All in One place",
    );
  });
});
