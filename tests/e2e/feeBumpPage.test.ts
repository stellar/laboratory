import { baseURL } from "../../playwright.config";
import { test, expect } from "@playwright/test";

test.describe("Fee Bump Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/transaction/fee-bump`);
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Fee bump transaction");
  });

  test.describe("Render", () => {
    let successCard: any;

    test.beforeEach(async ({ page }) => {
      await page
        .getByLabel("Fee-paying account")
        .fill("GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG");
      await page
        .getByLabel("Base64 encoded XDR")
        .fill(
          "AAAAAgAAAAA55ZjOXdOOulfzeLPXjLDLdplq/5HGjapWAXjGSkdAkwAAAGQADQioAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAC7OH53UcxOpgzL8V6oMoe/fz8QrTsG/TE1hHiDWv0K/AAAAAJUC+QAAAAAAAAAAAA=",
        );

      successCard = page.getByTestId("fee-bump-success");
    });

    test("Base Fee validation + Success", async ({ page }) => {
      await page.getByLabel("Base Fee").fill("10");

      await expect(
        page.getByText("Invalid baseFee, it should be at least 100 stroops."),
      ).toBeVisible();

      await page.getByLabel("Base Fee").fill(BASE_FEE);

      await expect(successCard).toBeVisible();
      await expect(
        successCard.getByText("Network Passphrase:").locator("+ div"),
      ).toHaveText("Test SDF Network ; September 2015");
      await expect(successCard.getByText("XDR:").locator("+ div")).toHaveText(
        MOCK_XDR,
      );

      // Clear
      await page.getByTestId("clear-all-button").click();
      await page.getByRole("button", { name: "Clear all" }).click();
      await expect(successCard).toBeHidden();
    });

    test("Advance to Sign step", async ({ page }) => {
      await page.getByLabel("Base Fee").fill(BASE_FEE);

      const nextButton = page.getByRole("button", {
        name: "Sign transaction",
        exact: true,
      });

      await expect(nextButton).toBeVisible();
      await nextButton.click();

      await expect(page.locator("h1")).toHaveText("Sign transaction");
    });

    test("View in XDR viewer", async ({ page }) => {
      await page.getByLabel("Base Fee").fill(BASE_FEE);

      const viewButton = page.getByRole("button", {
        name: "View in XDR viewer",
        exact: true,
      });

      await expect(viewButton).toBeVisible();
      await viewButton.click();

      await page.waitForURL("**/xdr/view");

      await expect(page.locator("h1")).toHaveText("View XDR");
      await expect(page.getByLabel("Base64 encoded XDR")).toHaveText(MOCK_XDR);
    });
  });
});

// =============================================================================
// Mock data
// =============================================================================
const MOCK_XDR =
  "AAAABQAAAAA55ZjOXdOOulfzeLPXjLDLdplq/5HGjapWAXjGSkdAkwAAAAAAAADIAAAAAgAAAAA55ZjOXdOOulfzeLPXjLDLdplq/5HGjapWAXjGSkdAkwAAAGQADQioAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAC7OH53UcxOpgzL8V6oMoe/fz8QrTsG/TE1hHiDWv0K/AAAAAJUC+QAAAAAAAAAAAAAAAAAAAAAAA==";
const BASE_FEE = "100";
