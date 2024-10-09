import { test, expect } from "@playwright/test";

test.describe("Introduction Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Stellar Lab");
  });

  test("Renders info cards", async ({ page }) => {
    await expect(page.getByTestId("info-cards").locator("h2")).toHaveText([
      "Stellar Quest",
      "Developer Tools",
      "Soroban RPC",
      "Horizon",
    ]);
  });
});
