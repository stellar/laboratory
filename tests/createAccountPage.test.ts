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
    const buttonContainer = page.getByTestId("createAccount-buttons");
    await expect(buttonContainer.getByText("Generate keypair")).toBeVisible;
    await expect(buttonContainer.getByText("Fund account with Friendbot"))
      .toBeVisible;
  });

  test("Test 'Generate keypair' button", async ({ page }) => {
    await page.getByRole("button", { name: "Generate keypair" }).click();

    await expect(
      page.locator("input[id='generate-keypair-publickey']"),
    ).toHaveValue(/^G/);
    await expect(
      page.locator("input[id='generate-keypair-secretkey']"),
    ).toHaveValue(/^S/);
  });

  test("Test 'Fund account' button", async ({ page }) => {
    await page
      .getByRole("button", { name: "Fund account with Friendbot" })
      .click();

    await page.goto("http://localhost:3000/account/fund");
  });
});
