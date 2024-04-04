import { test, expect } from "@playwright/test";

test.describe("Create Account Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/account/create");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Keypair Generator");
  });

  test("Renders 'Generate keypair' and 'Fund account' button", async ({
    page,
  }) => {
    await expect(page.getByTestId("keypairGenerate-button")).toHaveText(
      "Generate keypair",
    );
    await expect(page.getByTestId("keypairFund-button")).toHaveText(
      "Fund account with Friendbot",
    );
  });
});
