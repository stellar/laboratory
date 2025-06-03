import { test, expect } from "@playwright/test";

import { Account, MuxedAccount } from "@stellar/stellar-sdk";

test.describe("Create Muxed Account Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/account/muxed-create");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Create Multiplexed Account");
  });

  test("Renders 'Base Account G Address' and 'Muxed Account ID' input field", async ({
    page,
  }) => {
    expect(page.locator("input[id='muxed-public-key']")).toBeVisible;
    expect(page.locator("input[id='muxed-account-iD']")).toBeVisible;
  });

  test("Gets an error with an invalid public key in 'Base Account G Address' field", async ({
    page,
  }) => {
    const publicKeyInput = page.locator("#muxed-public-key");

    // Type in an invalid string in 'Public Key' input field
    await publicKeyInput.fill("XLKDSFJLSKDJF");

    await expect(publicKeyInput).toHaveAttribute("aria-invalid", "true");
    await expect(
      page.getByText("Base account address should start with G"),
    ).toBeVisible();
  });

  test("Gets an error with a non whole number 'Muxed Account ID' field", async ({
    page,
  }) => {
    const muxedAccountIdInput = page.locator("#muxed-account-id");

    await muxedAccountIdInput.fill("XLKDSFJLSKDJF");

    await expect(muxedAccountIdInput).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Expected a whole number")).toBeVisible();
  });

  test("Successfully creates a muxed account", async ({ page }) => {
    const publicKey =
      "GDVOT2ALMUF3G54RBHNJUEV6LOAZCQQCARHEVNUPKGMVPWFC4PFN33QR";
    const muxedId = "2";
    const publicKeyInput = page.locator("#muxed-public-key");
    await publicKeyInput.fill(publicKey);

    const muxedAccountIdInput = page.locator("#muxed-account-id");
    await muxedAccountIdInput.fill(muxedId);

    const createButton = page.getByRole("button").getByText("Create");

    await expect(publicKeyInput).toHaveAttribute("aria-invalid", "false");
    await expect(muxedAccountIdInput).toHaveAttribute("aria-invalid", "false");
    await expect(createButton).toBeEnabled();

    await createButton.click();

    await expect(page.getByTestId("createAccount-success")).toBeVisible();

    const muxedValue = page.locator("input[id='muxed-account-address-result']");

    const muxedAccount = new MuxedAccount(new Account(publicKey, "0"), muxedId);

    await expect(muxedValue).toHaveValue(muxedAccount.accountId());
  });
});
