import { baseURL } from "../../playwright.config";
import { test, expect } from "@playwright/test";

import { encodeMuxedContractAddress } from "@stellar/stellar-sdk";

test.describe("Parse Muxed Account Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/account/muxed-parse`);
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText(
      "Get muxed account from M or W address",
    );
  });

  test("Renders 'Muxed Account M Address' input field", async ({ page }) => {
    await expect(
      page.locator("input[id='muxed-account-address']"),
    ).toBeVisible();
  });

  test("Gets an error with an invalid muxed account key in 'Muxed Account M Address' field", async ({
    page,
  }) => {
    const publicKeyInput = page.locator("#muxed-account-address");

    await publicKeyInput.fill(
      "GDVOT2ALMUF3G54RBHNJUEV6LOAZCQQCARHEVNUPKGMVPWFC4PFN33QR",
    );

    await expect(publicKeyInput).toHaveAttribute("aria-invalid", "true");
    await expect(
      page.getByText("Muxed address should start with M or W"),
    ).toBeVisible();
  });

  test("Parses a muxed contract (W) address", async ({ page }) => {
    const contractId =
      "CBHQGTSBJWA54K67RSG3JPXSZY5IXIZ4FSLJM4PQ33FA3FYCU5YZV7MZ";
    const muxedAddressInput = page.locator("#muxed-account-address");

    await muxedAddressInput.fill(encodeMuxedContractAddress(contractId, "42"));
    await expect(muxedAddressInput).toHaveAttribute("aria-invalid", "false");

    await page.getByRole("button").getByText("Parse").click();

    await expect(page.getByLabel("Base Contract C Address")).toHaveValue(
      contractId,
    );
    await expect(page.locator("#muxed-account-id-result")).toHaveValue("42");
  });
});
