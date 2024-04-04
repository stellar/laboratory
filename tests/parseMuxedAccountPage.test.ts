import { test, expect } from "@playwright/test";

test.describe("Parse Muxed Account Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/account/muxed-parse");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText(
      "Get Muxed Account from M address",
    );
  });

  test("Renders 'Muxed Account M Address' input field", async ({ page }) => {
    expect(page.locator("input[id='muxed-account-address']")).toBeVisible;
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
      page.getByText(/Muxed account address should start with M/),
    ).toBeVisible();
  });
});
