import { test, expect } from "@playwright/test";

test.describe("Fee Bump Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/transaction/fee-bump");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Fee Bump");
    await expect(page.getByText("Fee bump errors")).toBeVisible();
  });

  test.describe("Render", () => {
    let successCard: any;

    test.beforeEach(async ({ page }) => {
      await page
        .getByLabel("Source Account")
        .fill("GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG");
      await page
        .getByLabel("Input a base-64 encoded TransactionEnvelope")
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

      await expect(
        successCard.getByText("Network Passphrase:").locator("+ div"),
      ).toHaveText("Test SDF Network ; September 2015");
      await expect(successCard.getByText("XDR:").locator("+ div")).toHaveText(
        MOCK_XDR,
      );
    });

    test("Clear", async ({ page }) => {
      await page.getByLabel("Base Fee").fill(BASE_FEE);
      await expect(successCard).toBeVisible();

      await page.getByText("Clear and import new").click();
      await expect(successCard).toBeHidden();
    });

    test("Sign in Transaction Signer", async ({ page }) => {
      await page.getByLabel("Base Fee").fill(BASE_FEE);
      await page.getByText("Sign in Transaction Signer").click();

      // Adding extra delay because sometimes it takes longer to load the next page
      await expect(page.locator("h1")).toHaveText("Transaction Overview", {
        timeout: 5000,
      });
      await expect(page.getByLabel("Transaction Envelope XDR")).toHaveText(
        MOCK_XDR,
      );
    });

    test("View in XDR viewer", async ({ page }) => {
      await page.getByLabel("Base Fee").fill(BASE_FEE);
      await page.getByText("View in XDR Viewer").click();

      // Adding extra delay because sometimes it takes longer to load the next page
      await expect(page.locator("h1")).toHaveText("View XDR", {
        timeout: 5000,
      });
      await expect(page.getByLabel("Base-64 encoded XDR")).toHaveText(MOCK_XDR);
    });
  });
});

// =============================================================================
// Mock data
// =============================================================================
const MOCK_XDR =
  "AAAABQAAAAA55ZjOXdOOulfzeLPXjLDLdplq/5HGjapWAXjGSkdAkwAAAAAAAADIAAAAAgAAAAA55ZjOXdOOulfzeLPXjLDLdplq/5HGjapWAXjGSkdAkwAAAGQADQioAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAC7OH53UcxOpgzL8V6oMoe/fz8QrTsG/TE1hHiDWv0K/AAAAAJUC+QAAAAAAAAAAAAAAAAAAAAAAA==";
const BASE_FEE = "100";
