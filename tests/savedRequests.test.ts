import { test, expect, Page, BrowserContext } from "@playwright/test";
import { MOCK_LOCAL_STORAGE } from "./mock/localStorage";

test.describe("Saved Requests Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/endpoints/saved");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Saved Requests");
  });

  test("Tabs with empty message", async ({ page }) => {
    const container = page.getByTestId("saved-requests-container");
    const horizonTab = container.getByText("Horizon Endpoints", {
      exact: true,
    });
    const rpcTab = container.getByText("RPC Methods", { exact: true });

    await expect(horizonTab).toBeVisible();
    await expect(rpcTab).toBeVisible();

    await expect(
      container.getByText(
        "There are no saved Horizon Endpoints on Testnet network",
      ),
    ).toBeVisible();

    await rpcTab.click();

    await expect(
      container.getByText("There are no saved RPC Methods Testnet network"),
    ).toBeVisible();
  });

  test.describe("Saved requests", () => {
    // Setting page context to share among all the tests in this section to keep
    // local storage data
    let browserContext: BrowserContext;
    let pageContext: Page;

    test.beforeAll(async ({ browser }) => {
      browserContext = await browser.newContext({
        storageState: MOCK_LOCAL_STORAGE,
      });
      pageContext = await browserContext.newPage();
      await pageContext.goto("http://localhost:3000/endpoints/saved");
    });

    test.afterAll(() => {
      browserContext.close();
    });

    test("Loads Horizon endpoints", async () => {
      const horizonItems = pageContext.getByTestId(
        "saved-requests-horizon-item",
      );
      await expect(horizonItems).toHaveCount(2);

      // Item 1
      const txItem = horizonItems.nth(0);

      await expect(txItem.getByTestId("saved-horizon-name")).toHaveValue(
        "Transactions",
      );

      await expect(txItem.getByTestId("saved-horizon-url")).toHaveValue(
        "https://horizon-testnet.stellar.org/transactions?limit=5&order=desc",
      );
      await expect(
        txItem.getByText("Last saved Dec 2, 2024, 9:10 PM UTC", {
          exact: true,
        }),
      ).toBeVisible();

      // Edit name
      await txItem.getByTestId("saved-horizon-edit").click();

      await expect(
        pageContext.getByText("Edit Saved Horizon Endpoint"),
      ).toBeVisible();

      const nameInput = pageContext.getByLabel("Name");
      const newName = "Transactions New";

      await nameInput.fill(newName);

      await pageContext.getByText("Save", { exact: true }).click();

      await expect(txItem.getByTestId("saved-horizon-name")).toHaveValue(
        newName,
      );

      // Item 2
      const accItem = horizonItems.nth(1);

      await expect(accItem.getByTestId("saved-horizon-name")).toHaveValue(
        "Account",
      );
      await expect(accItem.getByTestId("saved-horizon-url")).toHaveValue(
        "https://horizon-testnet.stellar.org/accounts/GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG",
      );
      await expect(
        accItem.getByText("Last saved Dec 3, 2024, 1:47 PM UTC", {
          exact: true,
        }),
      ).toBeVisible();
    });

    test("Delete Horizon endpoint", async () => {
      const horizonItems = pageContext.getByTestId(
        "saved-requests-horizon-item",
      );

      await expect(horizonItems).toHaveCount(2);
      await horizonItems.nth(0).locator(".Button--error").click();
      await expect(horizonItems).toHaveCount(1);
    });

    test("Load RPC methods", async () => {
      await clickRpcTab(pageContext);

      const rpcItems = pageContext.getByTestId("saved-requests-rpc-item");
      const txItem = rpcItems.nth(0);

      await expect(
        txItem.getByText("getTransactions", { exact: true }),
      ).toBeVisible();

      await expect(txItem.getByTestId("saved-rpc-name")).toHaveValue(
        "Transactions",
      );

      await expect(txItem.getByTestId("saved-rpc-url")).toHaveValue(
        "https://soroban-testnet.stellar.org",
      );
      await expect(
        txItem.getByText("Last saved Dec 2, 2024, 9:08 PM UTC", {
          exact: true,
        }),
      ).toBeVisible();

      // Edit name
      await txItem.getByTestId("saved-rpc-edit").click();

      await expect(
        pageContext.getByText("Edit Saved RPC Endpoint"),
      ).toBeHidden();

      const nameInput = pageContext.getByLabel("Name");
      const newName = "Transactions New";

      await nameInput.fill(newName);

      await pageContext.getByText("Save", { exact: true }).click();

      await expect(txItem.getByTestId("saved-rpc-name")).toHaveValue(newName);

      // View payload
      const rpcPayload = txItem.getByTestId("saved-rpc-payload");

      await expect(rpcPayload).toBeHidden();
      await txItem.getByText("View payload", { exact: true }).click();
      await expect(rpcPayload).toBeVisible();
    });

    test("Delete RPC method", async () => {
      await clickRpcTab(pageContext);

      const rpcItems = pageContext.getByTestId("saved-requests-rpc-item");

      await expect(rpcItems).toHaveCount(2);
      await rpcItems.nth(0).locator(".Button--error").click();
      await expect(rpcItems).toHaveCount(1);
    });

    test("Horizon endpoint View action", async () => {
      const horizonItem = pageContext
        .getByTestId("saved-requests-horizon-item")
        .nth(0);

      await horizonItem.getByText("View", { exact: true }).click();

      // Loads All Transactions endpoint page with saved params
      await expect(pageContext.locator("h1")).toHaveText("All Transactions");

      await expect(pageContext.getByTestId("endpoints-url")).toHaveValue(
        "https://horizon-testnet.stellar.org/transactions?limit=5&order=desc",
      );
      await expect(pageContext.getByLabel("Limit")).toHaveValue("5");
      await expect(pageContext.locator("#desc-order")).toBeChecked();
    });

    test("RPC method View in API Explorer action", async () => {
      await clickRpcTab(pageContext);

      const rpcItem = pageContext.getByTestId("saved-requests-rpc-item").nth(0);

      await rpcItem.getByText("View in API Explorer", { exact: true }).click();

      // Loads getTransactions RPC request page with saved params
      await expect(pageContext.locator("h1")).toHaveText("getTransactions");

      await expect(pageContext.getByTestId("endpoints-url")).toHaveValue(
        "https://soroban-testnet.stellar.org",
      );
      await expect(pageContext.getByLabel("Start Ledger Sequence")).toHaveValue(
        "1268840",
      );
      await expect(pageContext.getByLabel("Limit")).toHaveValue("5");
      await expect(pageContext.getByLabel("XDR Format")).toHaveValue("base64");
    });
  });
});

// =============================================================================
// Helpers
// =============================================================================
const clickRpcTab = async (pageContext: Page) => {
  const container = pageContext.getByTestId("saved-requests-container");
  const rpcTab = container.getByText("RPC Methods", { exact: true });

  await rpcTab.click();
};
