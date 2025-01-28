import { test, expect, Page } from "@playwright/test";
import { MOCK_LOCAL_STORAGE } from "./mock/localStorage";

test.describe("Saved Transactions Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/transaction/saved");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Saved Transactions");
  });

  test("Empty message", async ({ page }) => {
    const container = page.getByTestId("saved-transactions-container");

    await expect(
      container.getByText(
        "There are no saved transactions on Testnet network.",
      ),
    ).toBeVisible();
  });

  test.describe("Saved transactions", () => {
    // Setting page context to share among all the tests in this section to keep
    // local storage data
    let pageContext: Page;

    test.beforeEach(async ({ browser }) => {
      const browserContext = await browser.newContext({
        storageState: MOCK_LOCAL_STORAGE,
      });
      pageContext = await browserContext.newPage();
      await pageContext.goto("http://localhost:3000/transaction/saved");
    });

    test("Loads", async () => {
      await expect(
        pageContext.getByText(
          "There are no saved transactions on Testnet network.",
        ),
      ).toBeHidden();

      const txItems = pageContext.getByTestId("saved-transactions-item");

      await expect(txItems).toHaveCount(2);
    });

    test("[Classic] Submit item", async () => {
      const submitItem = pageContext
        .getByTestId("saved-transactions-item")
        .nth(0);

      const nameInput = submitItem.getByTestId("saved-transactions-name");

      await expect(nameInput).toHaveValue("Submit Create Account Tx");
      await expect(
        submitItem.getByText("Last saved Dec 3, 2024, 8:58 PM UTC"),
      ).toBeVisible();

      // Edit name
      await submitItem.getByTestId("saved-transactions-edit").click();

      await expect(
        pageContext.getByText("Edit Saved Transaction", { exact: true }),
      ).toBeVisible();

      const newName = "Submit Create Account Tx New";

      await pageContext.getByLabel("Name").fill(newName);
      await pageContext.getByText("Save", { exact: true }).click();

      await expect(nameInput).toHaveValue(newName);

      // View in submitter
      await submitItem.getByText("View in submitter").click();
      await pageContext.waitForURL("**/transaction/submit");

      await expect(pageContext.locator("h1")).toHaveText("Submit Transaction");
      await expect(
        pageContext.getByLabel("Input a base-64 encoded TransactionEnvelope:"),
      ).toHaveValue(
        "AAAAAgAAAAA55ZjOXdOOulfzeLPXjLDLdplq/5HGjapWAXjGSkdAkwAAAGQADQioAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAD4XTdOZpDOMR4vk9NUjYLbGosEJ65W78xLqdY6paYxJwAAAAJUC+QAAAAAAAAAAAFKR0CTAAAAQOvPXZdv0dUdcNAY26wVnVAUjyGRd8yrxDeUO2qaP9XF9Ws2qaCnAnfdoCzp6hk5CHwA/EiA+aJGwnMMxUjoxQw=",
      );
      await expect(pageContext.getByLabel("Transaction hash")).toHaveValue(
        "d3fb0f568ce983920646a4cea46a527fbdccdcea2c774442cfb81418fb55891e",
      );
    });

    test("Build item", async () => {
      const buildItem = pageContext
        .getByTestId("saved-transactions-item")
        .nth(1);

      await expect(
        buildItem.getByTestId("saved-transactions-name"),
      ).toHaveValue("Create Account + Payment Tx");

      const ops = buildItem.getByTestId("saved-transactions-op");

      await expect(ops.nth(0)).toHaveValue("Create Account");
      await expect(ops.nth(1)).toHaveValue("Payment");

      await expect(
        buildItem.getByText("Last saved Dec 3, 2024, 8:59 PM UTC"),
      ).toBeVisible();

      // View in builder
      await buildItem.getByText("View in builder", { exact: true }).click();

      await expect(pageContext.locator("h1")).toHaveText("Build Transaction");

      // Params
      await expect(
        pageContext.getByLabel("Source Account").first(),
      ).toHaveValue("GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG");
      await expect(
        pageContext.getByLabel("Transaction Sequence Number"),
      ).toHaveValue("3668692344766465");

      // Operations
      await expect(
        pageContext.getByTestId("build-transaction-operation-0"),
      ).toBeVisible();
      await expect(
        pageContext.getByTestId("build-transaction-operation-1"),
      ).toBeVisible();

      // XDR
      await expect(
        pageContext
          .getByTestId("build-transaction-envelope-xdr")
          .getByText("XDR")
          .locator("+ div"),
      ).toHaveText(
        "AAAAAgAAAAA55ZjOXdOOulfzeLPXjLDLdplq/5HGjapWAXjGSkdAkwAAAMgADQioAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAD4XTdOZpDOMR4vk9NUjYLbGosEJ65W78xLqdY6paYxJwAAAAJUC+QAAAAAAAAAAAEAAAAA+F03TmaQzjEeL5PTVI2C2xqLBCeuVu/MS6nWOqWmMScAAAAAAAAAADuaygAAAAAAAAAAAA==",
      );
    });

    test("Delete transaction", async () => {
      const txItem = pageContext.getByTestId("saved-transactions-item").first();

      await txItem.locator(".Button--error").click();

      const txItems = pageContext.getByTestId("saved-transactions-item");
      await expect(txItems).toHaveCount(1);
    });
  });
});
