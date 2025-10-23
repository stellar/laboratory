import { test, expect, Page, Browser } from "@playwright/test";
import {
  MOCK_LOCAL_STORAGE,
  SAVED_ACCOUNT_1,
  SAVED_ACCOUNT_1_SECRET,
  SAVED_ACCOUNT_2,
  SAVED_ACCOUNT_2_SECRET,
} from "./mock/localStorage";

// Helper functions
async function setupPageContext(browser: Browser, url: string): Promise<Page> {
  const browserContext = await browser.newContext({
    storageState: MOCK_LOCAL_STORAGE,
  });
  const page = await browserContext.newPage();
  await page.goto(url);
  return page;
}

async function validateSignerSelectorOptions(page: Page) {
  const signerSelectorOptions = page.getByTestId("signer-selector-options");

  await expect(signerSelectorOptions).toBeVisible();

  const labels = signerSelectorOptions.locator(
    ".SignerSelector__dropdown__item__label",
  );
  const values = signerSelectorOptions.locator(
    ".SignerSelector__dropdown__item__value",
  );

  await expect(labels).toHaveText("Saved Keypairs");
  await expect(values.nth(0)).toHaveText("[Account 1]GA46…GMXG");
  await expect(values.nth(1)).toHaveText("[Account 2]GC5T…Z6LD");

  return { values };
}

test.describe("Signer Selector", () => {
  test.describe("in Source Account on Build Transaction Page", () => {
    let pageContext: Page;

    test.beforeAll(async ({ browser }) => {
      pageContext = await setupPageContext(
        browser,
        "http://localhost:3000/transaction/build",
      );
    });

    test("Loads", async () => {
      await expect(pageContext.locator("h1")).toHaveText("Build Transaction");
    });

    test("'Get address' dropdown works for source account", async () => {
      const signerSelectorBtn = pageContext.getByText("Get address");
      await signerSelectorBtn.click();

      const { values } = await validateSignerSelectorOptions(pageContext);
      await values.nth(0).click();
      await expect(pageContext.getByLabel("Source Account")).toHaveValue(
        SAVED_ACCOUNT_1,
      );

      await signerSelectorBtn.click();
      const { values: values2 } =
        await validateSignerSelectorOptions(pageContext);
      await values2.nth(1).click();
      await expect(pageContext.getByLabel("Source Account")).toHaveValue(
        SAVED_ACCOUNT_2,
      );
    });
  });

  test.describe("in Secret Key on Sign TX Page", () => {
    let pageContext: Page;

    test.beforeAll(async ({ browser }) => {
      pageContext = await setupPageContext(
        browser,
        "http://localhost:3000/transaction/sign",
      );
    });

    test("Loads", async () => {
      await expect(pageContext.locator("h1")).toHaveText("Sign Transaction");
    });

    test("'Use secret key' dropdown works for source account", async () => {
      // Import transaction
      await pageContext
        .getByLabel("Import a transaction envelope in XDR format")
        .fill(MOCK_TX_XDR);
      await expect(
        pageContext.getByText("Valid Transaction Envelope XDR"),
      ).toBeVisible();
      await pageContext.getByText("Import transaction").click();

      // Verify overview is visible
      await expect(pageContext.getByTestId("sign-tx-overview")).toBeVisible();

      // First signer
      await pageContext.getByText("Use secret key").click();

      const { values } = await validateSignerSelectorOptions(pageContext);
      await values.nth(0).click();

      const multipickers = pageContext.getByTestId("multipicker-signer");
      const multiPickerInputs = multipickers.locator(".Input");
      await expect(multiPickerInputs.nth(0).locator("input")).toHaveValue(
        SAVED_ACCOUNT_1_SECRET,
      );

      // Add second signer
      await multipickers
        .getByRole("button", { name: "Add additional" })
        .click();
      await expect(multiPickerInputs).toHaveCount(2);

      await pageContext.getByText("Use secret key").nth(1).click();
      const { values: values2 } =
        await validateSignerSelectorOptions(pageContext);
      await values2.nth(1).click();
      await expect(multiPickerInputs.nth(1).locator("input")).toHaveValue(
        SAVED_ACCOUNT_2_SECRET,
      );

      // Wait for the dropdown to close before clicking sign button
      await expect(
        pageContext.getByTestId("signer-selector-options").nth(1),
      ).toBeHidden();

      // Sign transaction
      await pageContext
        .getByTestId("sign-tx-secretkeys")
        .getByText("Sign transaction")
        .click();

      await expect(
        pageContext.getByText("Successfully added 2 signatures"),
      ).toBeVisible();
    });
  });
});

// =============================================================================
// Mock data
// =============================================================================

const MOCK_TX_XDR =
  "AAAAAgAAAADJrq4b4AopDZibkeBWpDxuWKUcY4FUUNQdIEF3Nm9dkQAAAGQAAAIiAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAACXlGN76T6NQcaUJxbEkH3mi1HHWsHnLqMDdlLl9NlJgQAAAAAAAAAABfXhAAAAAAAAAAAA";
