import { expect, test } from "@playwright/test";
import { TX_ST_CHANGE_DOMAIN_SET } from "./mock/txStateChange";
import { mockRpcRequest } from "./mock/helpers";

test.describe("Transaction Dashboard: Fee Breakdown", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/transaction-dashboard");
  });

  test("Soroban transaction fees in XLM", async ({ page }) => {
    // Fill transaction hash input
    const loadButton = page.getByRole("button", { name: "Load transaction" });

    await expect(loadButton).toBeDisabled();
    await page
      .getByLabel("Transaction Hash")
      .fill(TX_ST_CHANGE_DOMAIN_SET.result.txHash);

    await expect(loadButton).toBeEnabled();

    // Mock the RPC call for getting the contract type
    await mockRpcRequest({
      page,
      rpcMethod: "getTransaction",
      bodyJsonResponse: TX_ST_CHANGE_DOMAIN_SET,
    });

    await loadButton.click();

    // Select tab
    const feeBreakdownTabButton = page.getByTestId("tx-fee-breakdown");
    await expect(feeBreakdownTabButton).toHaveAttribute(
      "data-is-active",
      "false",
    );

    await feeBreakdownTabButton.click();
    await expect(feeBreakdownTabButton).toHaveAttribute(
      "data-is-active",
      "true",
    );

    // Fee table
    const table = page.locator(".FeeBreakdown__gridTable");
    const rows = table.locator(".FeeBreakdown__gridTable__row");

    // Table columns
    await expect(getTableRow(rows, 0)).toHaveText([
      "Fee Type",
      "Proposed",
      "Refunded",
      "Final",
    ]);

    // Resource fee expanded view
    const resourceFeeToggle = table.locator(".ExpandToggle");

    await expect(resourceFeeToggle).toHaveAttribute(
      "data-is-expanded",
      "false",
    );
    await resourceFeeToggle.click();
    await expect(resourceFeeToggle).toHaveAttribute("data-is-expanded", "true");

    // Inclusion fee
    await expect(getTableRow(rows, 1)).toHaveText([
      "Inclusion Fee",
      "1 XLM",
      "-0.9999623 XLM",
      "0.0000377 XLM",
    ]);

    // Resource fee
    await expect(getTableRow(rows, 2)).toHaveText([
      "Resource Fee",
      "0.5499079 XLM",
      "-0.073566 XLM",
      "0.4763419 XLM",
    ]);

    // Refundable fee
    await expect(getTableRow(rows, 3)).toHaveText([
      // Including badges
      "Refundable FeeRentEventReturn Value",
      "0.5259301 XLM",
      "-0.073566 XLM",
      "0.4523641 XLM",
    ]);

    // Non-refundable fee
    await expect(getTableRow(rows, 4)).toHaveText([
      // Including badges
      "Non-Refundable FeeInstructionsReadWriteBandwidth",
      "0.0239778 XLM",
      "-0 XLM",
      "0.0239778 XLM",
    ]);

    // Total fees
    await expect(getTableRow(rows, 5)).toHaveText([
      "Total Fees",
      "1.5499079 XLM",
      "-1.0735283 XLM",
      "0.4763796 XLM",
    ]);
  });

  test("Soroban transaction fees in stroops", async ({ page }) => {
    // Fill transaction hash input
    const loadButton = page.getByRole("button", { name: "Load transaction" });

    await expect(loadButton).toBeDisabled();
    await page
      .getByLabel("Transaction Hash")
      .fill(TX_ST_CHANGE_DOMAIN_SET.result.txHash);

    await expect(loadButton).toBeEnabled();

    // Mock the RPC call for getting the contract type
    await mockRpcRequest({
      page,
      rpcMethod: "getTransaction",
      bodyJsonResponse: TX_ST_CHANGE_DOMAIN_SET,
    });

    await loadButton.click();

    // Select tab
    const feeBreakdownTabButton = page.getByTestId("tx-fee-breakdown");
    await expect(feeBreakdownTabButton).toHaveAttribute(
      "data-is-active",
      "false",
    );

    await feeBreakdownTabButton.click();
    await expect(feeBreakdownTabButton).toHaveAttribute(
      "data-is-active",
      "true",
    );

    // Fee table
    const table = page.locator(".FeeBreakdown__gridTable");
    const rows = table.locator(".FeeBreakdown__gridTable__row");

    // Resource fee expanded view
    const resourceFeeToggle = table.locator(".ExpandToggle");

    await expect(resourceFeeToggle).toHaveAttribute(
      "data-is-expanded",
      "false",
    );
    await resourceFeeToggle.click();
    await expect(resourceFeeToggle).toHaveAttribute("data-is-expanded", "true");

    // Stroops toggle
    const stroopsToggle = page.getByText("Change to Stroops", { exact: true });
    await stroopsToggle.click();

    // Inclusion fee
    await expect(getTableRow(rows, 1)).toHaveText([
      "Inclusion Fee",
      "10,000,000 stroops",
      "-9,999,623 stroops",
      "377 stroops",
    ]);

    // Resource fee
    await expect(getTableRow(rows, 2)).toHaveText([
      "Resource Fee",
      "5,499,079 stroops",
      "-735,660 stroops",
      "4,763,419 stroops",
    ]);

    // Refundable fee
    await expect(getTableRow(rows, 3)).toHaveText([
      // Including badges
      "Refundable FeeRentEventReturn Value",
      "5,259,301 stroops",
      "-735,660 stroops",
      "4,523,641 stroops",
    ]);

    // Non-refundable fee
    await expect(getTableRow(rows, 4)).toHaveText([
      // Including badges
      "Non-Refundable FeeInstructionsReadWriteBandwidth",
      "239,778 stroops",
      "-0 stroops",
      "239,778 stroops",
    ]);

    // Total fees
    await expect(getTableRow(rows, 5)).toHaveText([
      "Total Fees",
      "15,499,079 stroops",
      "-10,735,283 stroops",
      "4,763,796 stroops",
    ]);
  });
});

// =============================================================================
// Helpers
// =============================================================================
const getTableRow = (rows: any, index: number) => {
  return rows.nth(index).locator(".FeeBreakdown__gridTable__cell");
};
