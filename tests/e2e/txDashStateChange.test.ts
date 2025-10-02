import { test, expect, Page } from "@playwright/test";
import {
  TX_ST_CHANGE_BLEND_USDC_XLM_V2_SUBMIT,
  TX_ST_CHANGE_DOMAIN_BURN,
  TX_ST_CHANGE_DOMAIN_SET,
  TX_ST_CHANGE_KALE_HARVEST,
  TX_ST_CHANGE_KALE_PLANT,
  TX_ST_CHANGE_KALE_WORK,
  TX_ST_CHANGE_NO_STATE_CHANGE,
  TX_ST_CHANGE_RESULT_META_V4_EXAMPLE,
  TX_ST_CHANGE_SOROSWAP_ADD_LIQUIDITY,
  TX_ST_CHANGE_SOROSWAP_REMOVE_LIQUIDITY,
  TX_ST_CHANGE_SOROSWAP_SWAP_EXACT_TOKENS,
} from "./mock/txStateChange";

test.describe("Transaction Dashboard: State Change", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/transaction-dashboard");
  });

  test.describe("KALE", () => {
    // ERROR
    test("plant", async ({ page }) => {
      await testTxStateChange({
        page,
        mockResponse: TX_ST_CHANGE_KALE_PLANT,
        stateChangeItemCount: 6,
      });
    });

    test("work", async ({ page }) => {
      await testTxStateChange({
        page,
        mockResponse: TX_ST_CHANGE_KALE_WORK,
        stateChangeItemCount: 3,
      });
    });

    test("harvest", async ({ page }) => {
      await testTxStateChange({
        page,
        mockResponse: TX_ST_CHANGE_KALE_HARVEST,
        stateChangeItemCount: 7,
      });
    });
  });

  test.describe("Domain", () => {
    test("set", async ({ page }) => {
      await testTxStateChange({
        page,
        mockResponse: TX_ST_CHANGE_DOMAIN_SET,
        stateChangeItemCount: 5,
      });
    });

    test("burn", async ({ page }) => {
      await testTxStateChange({
        page,
        mockResponse: TX_ST_CHANGE_DOMAIN_BURN,
        stateChangeItemCount: 5,
      });
    });
  });

  test.describe("Soroswap", () => {
    test("add liquidity", async ({ page }) => {
      await testTxStateChange({
        page,
        mockResponse: TX_ST_CHANGE_SOROSWAP_ADD_LIQUIDITY,
        stateChangeItemCount: 7,
      });
    });

    test("remove liquidity", async ({ page }) => {
      await testTxStateChange({
        page,
        mockResponse: TX_ST_CHANGE_SOROSWAP_REMOVE_LIQUIDITY,
        stateChangeItemCount: 7,
      });
    });

    test("swap exact tokens for tokens", async ({ page }) => {
      await testTxStateChange({
        page,
        mockResponse: TX_ST_CHANGE_SOROSWAP_SWAP_EXACT_TOKENS,
        stateChangeItemCount: 5,
      });
    });
  });

  test.describe("Blend USDC-XLM Pool V2", () => {
    test("submit", async ({ page }) => {
      await testTxStateChange({
        page,
        mockResponse: TX_ST_CHANGE_BLEND_USDC_XLM_V2_SUBMIT,
        stateChangeItemCount: 5,
      });
    });
  });

  test.describe("Result Meta JSON v4", () => {
    test("submit", async ({ page }) => {
      await testTxStateChange({
        page,
        mockResponse: TX_ST_CHANGE_RESULT_META_V4_EXAMPLE,
        stateChangeItemCount: 14,
      });
    });
  });

  test("No state change", async ({ page }) => {
    await testTxStateChange({
      page,
      mockResponse: TX_ST_CHANGE_NO_STATE_CHANGE,
      stateChangeItemCount: 0,
    });

    await expect(
      page
        .getByTestId("contract-info-contract-container")
        .getByText("There are no state changes in this transaction."),
    ).toBeVisible();
  });
});

// =============================================================================
// Helpers
// =============================================================================
const testTxStateChange = async ({
  page,
  mockResponse,
  stateChangeItemCount,
}: {
  page: Page;
  mockResponse: any;
  stateChangeItemCount: number;
}) => {
  // Mock the tx API call response
  await page.route(`https://soroban-testnet.stellar.org/`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockResponse),
    });
  });

  await expect(page.locator("h1")).toHaveText("Transaction Dashboard");

  // Fill Transaction Hash input and trigger the API call
  const loadTxButton = page.getByRole("button", { name: "Load transaction" });
  await expect(loadTxButton).toBeDisabled();
  await page
    .getByLabel("Transaction Hash", { exact: true })
    .fill(mockResponse.result.txHash);
  await expect(loadTxButton).toBeEnabled();

  await loadTxButton.click();

  // Check the correct data is displayed by checking the Transaction Info value
  const txInfoContainer = page.getByTestId("transaction-info-container");
  const txInfoLabel = txInfoContainer.locator(".InfoFieldItem").filter({
    has: page.locator('.InfoFieldItem__label:text("Transaction Info")'),
  });

  const txInfoValue = txInfoLabel.locator(".InfoFieldItem__value a");
  await expect(txInfoValue).toBeVisible();
  await expect(txInfoValue).toHaveText(mockResponse.result.txHash);

  const contractInfoContainer = page.getByTestId(
    "contract-info-contract-container",
  );

  // Check the tabs section
  await expect(page.getByTestId("tx-state-change")).toHaveAttribute(
    "data-is-active",
    "true",
  );

  // Check State Change item count
  await expect(contractInfoContainer.locator(".StateChange__item")).toHaveCount(
    stateChangeItemCount,
  );
};
