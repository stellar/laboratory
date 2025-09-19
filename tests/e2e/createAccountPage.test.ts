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
    await expect(buttonContainer.getByText("Generate keypair")).toBeVisible();
    await expect(
      buttonContainer.getByText("Fund account with Friendbot"),
    ).toBeVisible();
  });

  test("Test 'Generate keypair' button", async ({ page }) => {
    await page.getByRole("button", { name: "Generate keypair" }).click();

    await expect(
      page.locator("input[id='generate-keypair-publickey']"),
    ).toHaveValue(/^G/);
    await expect(
      page.locator("input[id='generate-keypair-secretkey']"),
    ).toHaveValue(/^S/);
    // Match any 24 words separated by space
    await expect(
      page.locator("input[id='generate-keypair-recovery-phrase']"),
    ).toHaveValue(/^([a-zA-Z]+\s){23}[a-zA-Z]+$/);
  });

  test("Successfully funds an account when clicking 'Fund account' with a valid public key", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Generate keypair" }).click();

    const fundButton = page
      .getByTestId("fundAccount-button")
      .getByText("Fund account with Friendbot");

    await expect(fundButton).toBeEnabled();

    // Mock the friendbot api call
    await page.route("**/friendbot.stellar.org/**", async (route) => {
      const url = new URL(route.request().url());
      const addr = url.searchParams.get("addr");

      if (addr) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({}),
        });
      } else {
        await route.abort();
      }
    });

    // Ensure the listener is set up before the action that triggers the request
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("?addr=") && response.status() === 200,
    );

    await fundButton.click();

    // Wait for the mocked response
    await responsePromise;

    // Success <Alert/> is visible
    const alertBox = page.getByText(/Successfully funded/);
    await expect(alertBox).toBeVisible();
  });
});
