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

      await expect(txItems).toHaveCount(4);
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

    test("[Soroban] Submit item", async () => {
      await pageContext.waitForSelector(
        '[data-testid="saved-transactions-item"]',
      );
      const items = pageContext.getByTestId("saved-transactions-item");

      const submitItem = items.last();
      await expect(submitItem).toBeVisible();

      const nameInput = submitItem.getByTestId("saved-transactions-name");
      await expect(nameInput).toBeVisible();

      await expect(nameInput).toHaveValue("Extend TTL");
      await expect(
        submitItem.getByText("Last saved Jan 17, 2025, 9:13 PM UTC"),
      ).toBeVisible();

      // Edit name
      await submitItem.getByTestId("saved-transactions-edit").click();

      await expect(
        pageContext.getByText("Edit Saved Transaction", { exact: true }),
      ).toBeVisible();

      const newName = "Extend TTL New";

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
        "AAAAAgAAAAB+TL0HLiAjanMRnyeqyhb8Iu+4d1g2dl1cwPi1UZAigwAAtwUABiLjAAAAGQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAGQAAAAAAAHUwAAAAAQAAAAAAAAABAAAABgAAAAEg/u86MzPrVcpNrsFUa84T82Kss8DLAE9ZMxLqhM22HwAAABAAAAABAAAAAgAAAA8AAAAHQ291bnRlcgAAAAASAAAAAAAAAAB+TL0HLiAjanMRnyeqyhb8Iu+4d1g2dl1cwPi1UZAigwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtqEAAAABUZAigwAAAEADYbntiznotYPblvJQ35DiGEpMTQU9jCYANxV18VVGV6zDFSjB+qK++dF656Pr4oMTpyBVvE15YSo6ITxR5DoE",
      );
      await expect(pageContext.getByLabel("Transaction hash")).toHaveValue(
        "0571508f487a343006d231d11f201a855f67973e0e019da6164b32b992dab46f",
      );
    });

    test("[Soroban] Build item", async () => {
      const buildItem = pageContext
        .getByTestId("saved-transactions-item")
        .nth(2);

      await expect(
        buildItem.getByTestId("saved-transactions-name"),
      ).toHaveValue("Extend to TTL");

      const ops = buildItem.getByTestId("saved-transactions-op");

      await expect(ops.nth(0)).toHaveValue("Extend Footprint TTL");

      await expect(
        buildItem.getByText("Last saved Jan 17, 2025, 7:54 PM UTC"),
      ).toBeVisible();

      // Click the button
      await buildItem.getByText("View in builder", { exact: true }).click();

      // Wait for navigation
      await pageContext.waitForURL("**/transaction/build");

      // Params
      await expect(
        pageContext.getByLabel("Source Account").first(),
      ).toHaveValue("GB7EZPIHFYQCG2TTCGPSPKWKC36CF35YO5MDM5S5LTAPRNKRSARIHWGG");
      await expect(
        pageContext.getByLabel("Transaction Sequence Number"),
      ).toHaveValue("1727208213184537");

      const sorobanOperation = pageContext.getByTestId(
        "build-soroban-transaction-operation",
      );
      await expect(sorobanOperation.getByLabel("Operation type")).toHaveValue(
        "extend_footprint_ttl",
      );

      // Operations
      await expect(
        pageContext.getByTestId("build-soroban-transaction-operation"),
      ).toBeVisible();
      await expect(pageContext.getByLabel("Contract ID")).toHaveValue(
        "CAQP53Z2GMZ6WVOKJWXMCVDLZYJ7GYVMWPAMWACPLEZRF2UEZW3B636S",
      );
      await expect(pageContext.getByLabel("Key ScVal in XDR")).toHaveValue(
        "AAAAEAAAAAEAAAACAAAADwAAAAdDb3VudGVyAAAAABIAAAAAAAAAAH5MvQcuICNqcxGfJ6rKFvwi77h3WDZ2XVzA+LVRkCKD",
      );
      await expect(pageContext.getByLabel("Extend To")).toHaveValue("30000");
      await expect(
        pageContext.getByLabel("Resource Fee (in stroops)"),
      ).toHaveValue("46753");

      const xdrElement = pageContext.getByTestId(
        "build-soroban-transaction-envelope-xdr",
      );

      await xdrElement.isVisible();

      // XDR
      await expect(xdrElement.getByText("XDR").locator("+ div")).toHaveText(
        "AAAAAgAAAAB+TL0HLiAjanMRnyeqyhb8Iu+4d1g2dl1cwPi1UZAigwAAtwUABiLjAAAAGQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAGQAAAAAAAHUwAAAAAQAAAAAAAAABAAAABgAAAAEg/u86MzPrVcpNrsFUa84T82Kss8DLAE9ZMxLqhM22HwAAABAAAAABAAAAAgAAAA8AAAAHQ291bnRlcgAAAAASAAAAAAAAAAB+TL0HLiAjanMRnyeqyhb8Iu+4d1g2dl1cwPi1UZAigwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtqEAAAAA",
      );
    });

    test("Delete transaction", async () => {
      const txItem = pageContext.getByTestId("saved-transactions-item").first();

      await txItem.locator(".Button--error").click();

      const txItems = pageContext.getByTestId("saved-transactions-item");
      await expect(txItems).toHaveCount(3);
    });
  });
});
