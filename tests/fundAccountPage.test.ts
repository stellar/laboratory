import { test, expect } from "@playwright/test";

import { Keypair } from "@stellar/stellar-sdk";

test.describe("Fund Account Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/account/fund");
  });

  test("Shows testnet network in the title by default", async ({ page }) => {
    await expect(page.getByTestId("networkSelector-button")).toHaveText(
      "Testnet",
    );
    await expect(page.locator("h1")).toHaveText(
      "Friendbot: fund a testnet network account",
    );
  });

  test("Shows futurenet network in the title if I change my network to futurenet", async ({
    page,
  }) => {
    // Click network selector dropdown button
    await page.getByTestId("networkSelector-button").click();
    await expect(page.getByTestId("networkSelector-dropdown")).toBeVisible();

    // Select Futurenet in the dropdown list
    await page
      .getByTestId("networkSelector-dropdown")
      .getByTestId("networkSelector-option")
      .filter({ has: page.getByText("Futurenet") })
      .click();

    // Network Submit button
    const submitButton = page.getByTestId("networkSelector-submit-button");

    // Select 'Futurenet' in the network dropdown list
    await expect(submitButton).toHaveText("Switch to Futurenet");
    await expect(submitButton).toBeEnabled();

    // Click 'Switch to Futurenet' button
    await submitButton.click();

    await expect(page.getByTestId("networkSelector-button")).toHaveText(
      "Futurenet",
    );
    await expect(page.locator("h1")).toHaveText(
      "Friendbot: fund a futurenet network account",
    );
  });

  test("By default, 'Public Key' input field is empty and buttons are disabled", async ({
    page,
  }) => {
    await expect(page.locator("#generate-keypair-publickey")).toHaveValue("");

    const getLumenButton = page
      .getByTestId("fundAccount-buttons")
      .getByText("Get lumens");
    const fillInButton = page
      .getByTestId("fundAccount-buttons")
      .getByText("Fill in with generated key");

    await expect(getLumenButton).toBeDisabled();
    await expect(fillInButton).toBeDisabled();
  });

  test("I see an error when I type in an invalid string in 'Public Key' input field", async ({
    page,
  }) => {
    const publicKeyInput = page.locator("#generate-keypair-publickey");

    // Type in an invalid string in 'Public Key' input field
    await publicKeyInput.fill("XLKDSFJLSKDJF");

    await expect(publicKeyInput).toHaveAttribute("aria-invalid", "true");
    await expect(
      page.getByTestId("fundAccount-buttons").getByText("Get lumens"),
    ).toBeDisabled();
  });

  test("Successfully funds an account when clicking 'Get lumens' with a valid public key", async ({
    page,
  }) => {
    // Get a new public key
    const keypair = Keypair.random();
    const publicKey = keypair.publicKey();

    const publicKeyInput = page.locator("#generate-keypair-publickey");
    const getLumenButton = page
      .getByTestId("fundAccount-buttons")
      .getByText("Get lumens");

    // Type in an invalid string in 'Public Key' input field
    await publicKeyInput.fill(publicKey);

    await expect(publicKeyInput).toHaveAttribute("aria-invalid", "false");
    await expect(getLumenButton).toBeEnabled();

    await getLumenButton.click();

    const alertBox = page.getByText(/Successfully funded/);
    await expect(alertBox).toBeVisible();
  });

  test("Gets an error when submitting 'Get lumens' button twice with a valid public key", async ({
    page,
  }) => {
    const publicKeyInput = page.locator("#generate-keypair-publickey");
    const getLumenButton = page
      .getByTestId("fundAccount-buttons")
      .getByText("Get lumens");

    // Type in an invalid string in 'Public Key' input field
    await publicKeyInput.fill(
      "GBX6W44ISK6XTBDDJ5ND6KTJHLYEYHMR4SDG635NRARYVJ3G2YXGDT6Y",
    );

    await expect(publicKeyInput).toHaveAttribute("aria-invalid", "false");
    await expect(getLumenButton).toBeEnabled();

    await getLumenButton.click();
    // Funding the same account twice to get an error alert
    await getLumenButton.click();

    const alertBox = page.getByText(/Unable to fund/);
    await expect(alertBox).toBeVisible();
  });
});
