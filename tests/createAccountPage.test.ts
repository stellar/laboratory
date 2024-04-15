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
    expect(buttonContainer.getByText("Generate keypair")).toBeVisible;
    expect(buttonContainer.getByText("Fund account with Friendbot"))
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

  test("Successfully funds an account when clicking 'Fund account' with a valid public key", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Generate keypair" }).click();

    const getLumenButton = page
      .getByTestId("fundAccount-button")
      .getByText("Fund account with Friendbot");

    await expect(getLumenButton).toBeEnabled();

    // Mock the friendbot api call
    await page.route(
      "*/**/?addr=GA4X4QMSTEUKWAXXX3TBFRMGWI3O5X5IUUHPKAIH5XKNQ4IBTQ6YSVV3",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({}),
        });
      },
    );

    // Ensure the listener is set up before the action that triggers the request
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("?addr=") && response.status() === 200,
    );

    await getLumenButton.click();

    // Wait for the mocked response
    await responsePromise;

    // Success <Alert/> is visible
    const alertBox = page.getByText(/Successfully funded/);
    await expect(alertBox).toBeVisible();
  });
});
