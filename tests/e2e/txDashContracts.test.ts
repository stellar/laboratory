import { expect, Page, test } from "@playwright/test";
import {
  TX_EVENTS_MOCK_RESPONSE,
  TX_EVENTS_MOCK_RESPONSE_EMPTY,
} from "./mock/txEvents";
import { mockRpcRequest } from "./mock/helpers";

test.describe("Transaction Dashboard: Contracts", () => {
  test.beforeEach(async ({ page }) => {
    // Load page
    await page.goto("http://localhost:3000/transaction-dashboard");
  });

  test("Contracts Summary", async ({ page }) => {
    await data({ page, mockResponse: TX_EVENTS_MOCK_RESPONSE });

    const contractsTable = page.getByTestId("tx-contracts-summary-table");
    await expect(contractsTable).toBeVisible();

    const items = contractsTable.locator("tbody").getByRole("row");
    await expect(items).toHaveCount(5);
  });

  test("No events", async ({ page }) => {
    await data({ page, mockResponse: TX_EVENTS_MOCK_RESPONSE_EMPTY });

    await expect(
      page.getByText("There are no contracts in this transaction."),
    ).toBeVisible();
  });
});

// =============================================================================
// Helpers
// =============================================================================
const data = async ({
  page,
  mockResponse,
}: {
  page: Page;
  mockResponse: any;
}) => {
  // Input transaction hash
  const loadButton = page.getByRole("button", { name: "Load transaction" });

  await expect(loadButton).toBeDisabled();
  await page.getByLabel("Transaction Hash").fill(mockResponse.result.txHash);

  await expect(loadButton).toBeEnabled();

  // Mock response
  await mockRpcRequest({
    page,
    rpcMethod: "getTransaction",
    bodyJsonResponse: mockResponse,
  });

  await loadButton.click();

  // Select Contracts tab
  const eventsTabButton = page.getByTestId("tx-contracts");
  await expect(eventsTabButton).toHaveAttribute("data-is-active", "false");

  await eventsTabButton.click();
  await expect(eventsTabButton).toHaveAttribute("data-is-active", "true");
};
