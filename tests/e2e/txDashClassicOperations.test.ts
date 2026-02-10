import { expect, test } from "@playwright/test";
import {
  TX_CLASSIC_MANY_OPS,
  TX_CLASSIC_OPS_WITH_STRING_BODY,
} from "./mock/classicOperations";
import { TX_DASH_CLASSIC } from "./mock/txDash";
import { mockRpcRequest } from "./mock/helpers";

test.describe("Transaction Dashboard - Classic Operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/transaction-dashboard");
  });

  test("Displays single classic operation correctly", async ({ page }) => {
    const loadButton = page.getByRole("button", { name: "Load transaction" });

    await page
      .getByLabel("Transaction hash")
      .fill(TX_DASH_CLASSIC.result.txHash);

    await mockRpcRequest({
      page,
      rpcMethod: "getTransaction",
      bodyJsonResponse: TX_DASH_CLASSIC,
    });

    await loadButton.click();

    // Wait for operations section to load
    await page.waitForSelector("text=Operations", { timeout: 5000 });

    // Check operations heading exists
    await expect(
      page.getByRole("heading", { name: "Operations" }),
    ).toBeVisible();

    // Check single operation badge
    const operationBadges = page
      .locator(".Badge")
      .filter({ hasText: "manage_buy_offer" });
    await expect(operationBadges).toHaveCount(1);

    // Check operation details are displayed
    const operationDetails = page.locator(
      ".TransactionClassicOperations__operationDetails",
    );
    await expect(operationDetails).toBeVisible();

    // Check specific fields in the operation
    await expect(operationDetails.getByText("Selling")).toBeVisible();
    await expect(operationDetails.getByText("Buying")).toBeVisible();
    await expect(operationDetails.getByText("Buy amount")).toBeVisible();
  });

  test("Displays multiple operations with string-body correctly", async ({
    page,
  }) => {
    const loadButton = page.getByRole("button", { name: "Load transaction" });

    await page
      .getByLabel("Transaction hash")
      .fill(TX_CLASSIC_OPS_WITH_STRING_BODY.result.txHash);

    await mockRpcRequest({
      page,
      rpcMethod: "getTransaction",
      bodyJsonResponse: TX_CLASSIC_OPS_WITH_STRING_BODY,
    });

    await loadButton.click();

    // Wait for operations section to load
    await page.waitForSelector("text=Operations", { timeout: 5000 });

    // Check all three operation types are displayed
    await expect(
      page
        .locator(".Badge")
        .filter({ hasText: "begin_sponsoring_future_reserves" }),
    ).toBeVisible();
    await expect(
      page.locator(".Badge").filter({ hasText: "create_account" }),
    ).toBeVisible();
    await expect(
      page
        .locator(".Badge")
        .filter({ hasText: "end_sponsoring_future_reserves" }),
    ).toBeVisible();

    // Check we have 3 operation cards
    const operationCards = page.locator(
      ".TransactionClassicOperations__operation",
    );
    await expect(operationCards).toHaveCount(3);

    // Verify begin_sponsoring_future_reserves operation details
    const beginSponsoringOp = operationCards.first();
    await expect(beginSponsoringOp.getByText("Sponsored id")).toBeVisible();

    // Verify create_account operation details
    const createAccountOp = operationCards.nth(1);
    await expect(createAccountOp.getByText("Destination")).toBeVisible();
    await expect(createAccountOp.getByText("Starting balance")).toBeVisible();

    // Verify end_sponsoring_future_reserves has no details (string-body operation)
    const endSponsoringOp = operationCards.nth(2);
    const endSponsoringDetails = endSponsoringOp.locator(
      ".TransactionClassicOperations__operationDetails",
    );
    await expect(endSponsoringDetails).not.toBeVisible();
  });

  test("Pagination works correctly with many operations", async ({ page }) => {
    const loadButton = page.getByRole("button", { name: "Load transaction" });

    await page
      .getByLabel("Transaction hash")
      .fill(TX_CLASSIC_MANY_OPS.result.txHash);

    await mockRpcRequest({
      page,
      rpcMethod: "getTransaction",
      bodyJsonResponse: TX_CLASSIC_MANY_OPS,
    });

    await loadButton.click();

    // Wait for operations section to load
    await page.waitForSelector("text=Operations", { timeout: 5000 });

    // Check pagination controls are visible (since we have 15 operations > PAGE_SIZE of 5)
    await expect(page.getByRole("button", { name: "First" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Last" })).toBeVisible();

    // Check page count displays correctly (15 operations / 5 per page = 3 pages)
    await expect(page.locator(".DataTable__pagination")).toHaveText(
      "Page 1 of 3",
    );

    // Check we see 5 operations on first page (PAGE_SIZE = 5)
    const operationCards = page.locator(
      ".TransactionClassicOperations__operation",
    );
    await expect(operationCards).toHaveCount(5);

    // Check first page navigation buttons
    await expect(page.getByRole("button", { name: "First" })).toBeDisabled();
    const prevButton = page
      .getByRole("button", { name: "First" })
      .locator("xpath=following-sibling::button[1]");
    await expect(prevButton).toBeDisabled();
    const nextButton = page
      .locator(".DataTable__pagination")
      .locator("xpath=following-sibling::button[1]");
    await expect(nextButton).toBeEnabled();
    await expect(page.getByRole("button", { name: "Last" })).toBeEnabled();

    // Navigate to next page
    await nextButton.click();

    // Check we're on page 2
    await expect(page.locator(".DataTable__pagination")).toHaveText(
      "Page 2 of 3",
    );

    // Check we see 5 operations on second page
    await expect(operationCards).toHaveCount(5);

    // Navigate to page 3
    const nextButton2 = page
      .locator(".DataTable__pagination")
      .locator("xpath=following-sibling::button[1]");
    await nextButton2.click();

    // Check we're on page 3
    await expect(page.locator(".DataTable__pagination")).toHaveText(
      "Page 3 of 3",
    );

    // Check we see 5 operations on third page (15 total - 10 on first two pages = 5)
    await expect(operationCards).toHaveCount(5);

    // Check last page navigation buttons
    await expect(page.getByRole("button", { name: "First" })).toBeEnabled();
    const prevButton3 = page
      .getByRole("button", { name: "First" })
      .locator("xpath=following-sibling::button[1]");
    await expect(prevButton3).toBeEnabled();
    const nextButton3 = page
      .locator(".DataTable__pagination")
      .locator("xpath=following-sibling::button[1]");
    await expect(nextButton3).toBeDisabled();
    await expect(page.getByRole("button", { name: "Last" })).toBeDisabled();

    // Navigate back to first page
    await page.getByRole("button", { name: "First" }).click();

    // Verify we're back on page 1
    await expect(page.locator(".DataTable__pagination")).toHaveText(
      "Page 1 of 3",
    );
    await expect(operationCards).toHaveCount(5);

    // Test "Last" button
    await page.getByRole("button", { name: "Last" }).click();
    await expect(page.locator(".DataTable__pagination")).toHaveText(
      "Page 3 of 3",
    );
    await expect(operationCards).toHaveCount(5);
  });

  test("Displays various operation types correctly", async ({ page }) => {
    const loadButton = page.getByRole("button", { name: "Load transaction" });

    await page
      .getByLabel("Transaction hash")
      .fill(TX_CLASSIC_MANY_OPS.result.txHash);

    await mockRpcRequest({
      page,
      rpcMethod: "getTransaction",
      bodyJsonResponse: TX_CLASSIC_MANY_OPS,
    });

    await loadButton.click();

    // Wait for operations section to load
    await page.waitForSelector("text=Operations", { timeout: 5000 });

    // Check various operation type badges are displayed
    await expect(
      page
        .locator(".Badge")
        .filter({ hasText: "begin_sponsoring_future_reserves" }),
    ).toBeVisible();
    await expect(
      page.locator(".Badge").filter({ hasText: "create_account" }),
    ).toBeVisible();
    await expect(
      page.locator(".Badge").filter({ hasText: "manage_data" }),
    ).toBeVisible();
    await expect(
      page.locator(".Badge").filter({ hasText: "change_trust" }),
    ).toBeVisible();
    await expect(
      page.locator(".Badge").filter({ hasText: "payment" }),
    ).toBeVisible();

    // Verify some operation details
    const operationDetails = page
      .locator(".TransactionClassicOperations__operationDetails")
      .first();
    await expect(operationDetails.getByText("Sponsored id")).toBeVisible();
  });

  test("Formats operation field labels correctly", async ({ page }) => {
    const loadButton = page.getByRole("button", { name: "Load transaction" });

    await page
      .getByLabel("Transaction hash")
      .fill(TX_CLASSIC_OPS_WITH_STRING_BODY.result.txHash);

    await mockRpcRequest({
      page,
      rpcMethod: "getTransaction",
      bodyJsonResponse: TX_CLASSIC_OPS_WITH_STRING_BODY,
    });

    await loadButton.click();

    // Wait for operations section to load
    await page.waitForSelector("text=Operations", { timeout: 5000 });

    const operationDetails = page.locator(
      ".TransactionClassicOperations__operationDetails",
    );

    // Check that labels are formatted correctly (underscores replaced with spaces, capitalized)
    await expect(operationDetails.getByText("Sponsored id")).toBeVisible(); // sponsored_id -> Sponsored id
    await expect(operationDetails.getByText("Starting balance")).toBeVisible(); // starting_balance -> Starting balance
  });

  test("No pagination controls shown for few operations", async ({ page }) => {
    const loadButton = page.getByRole("button", { name: "Load transaction" });

    await page
      .getByLabel("Transaction hash")
      .fill(TX_DASH_CLASSIC.result.txHash);

    await mockRpcRequest({
      page,
      rpcMethod: "getTransaction",
      bodyJsonResponse: TX_DASH_CLASSIC,
    });

    await loadButton.click();

    // Wait for operations section to load
    await page.waitForSelector("text=Operations", { timeout: 5000 });

    // Check pagination controls are NOT visible (only 1 operation)
    await expect(page.getByRole("button", { name: "First" })).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Last" })).not.toBeVisible();
    await expect(page.locator(".DataTable__pagination")).not.toBeVisible();
  });
});
