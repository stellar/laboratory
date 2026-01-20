import { expect, Page, test } from "@playwright/test";
import {
  TX_EVENTS_MOCK_RESPONSE,
  TX_EVENTS_MOCK_RESPONSE_EMPTY,
} from "./mock/txEvents";
import { mockRpcRequest } from "./mock/helpers";

test.describe("Transaction Dashboard: Events", () => {
  test.beforeEach(async ({ page }) => {
    // Load page
    await page.goto("http://localhost:3000/transaction-dashboard");
  });

  test("Contract Events", async ({ page }) => {
    await eventsData({ page, mockResponse: TX_EVENTS_MOCK_RESPONSE });

    await expect(
      page.locator("h3").filter({ hasText: "Contract Events" }),
    ).toBeVisible();

    // Items
    const items = page.getByTestId("ev-c-item");
    await expect(items).toHaveCount(5);
  });

  test("Transaction Events", async ({ page }) => {
    await eventsData({ page, mockResponse: TX_EVENTS_MOCK_RESPONSE });

    await expect(
      page.locator("h3").filter({ hasText: "Transaction Events" }),
    ).toBeVisible();

    // Items
    const items = page.getByTestId("ev-t-item");
    await expect(items).toHaveCount(2);
  });

  test("No events", async ({ page }) => {
    await eventsData({ page, mockResponse: TX_EVENTS_MOCK_RESPONSE_EMPTY });

    await expect(
      page.locator("h3").filter({ hasText: "Contract Events" }),
    ).toBeHidden();

    await expect(
      page.locator("h3").filter({ hasText: "Transaction Events" }),
    ).toBeHidden();

    await expect(
      page.getByText("This transaction has no events emitted."),
    ).toBeVisible();
  });
});

// =============================================================================
// Helpers
// =============================================================================
const eventsData = async ({
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

  // Select Events tab
  const eventsTabButton = page.getByTestId("tx-events");
  await expect(eventsTabButton).toHaveAttribute("data-is-active", "false");

  await eventsTabButton.click();
  await expect(eventsTabButton).toHaveAttribute("data-is-active", "true");
};
