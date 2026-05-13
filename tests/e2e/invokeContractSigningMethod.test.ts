import { baseURL } from "../../playwright.config";
import { test, expect } from "@playwright/test";
import { STELLAR_EXPERT_API } from "@/constants/settings";
import {
  MOCK_SAC_CONTRACT_ID,
  MOCK_SAC_CONTRACT_TYPE_RESPONSE,
} from "./mock/smartContracts";
import { mockRpcRequest } from "./mock/helpers";
import stellarAssetSpec from "./mock/stellarAssetSpec.json";

/**
 * E2E test for the "Use another signing method" radio on the Invoke contract
 * tab. Exercises the SAC spec path (no wasm decoding required) by serving a
 * SAC contract data ledger entry from getLedgerEntries and the SAC spec JSON
 * from raw.githubusercontent.com.
 */
test.describe("Smart Contracts: Invoke Contract — Use another signing method", () => {
  test.beforeEach(async ({ page }) => {
    await mockRpcRequest({
      page,
      rpcMethod: "getLedgerEntries",
      bodyJsonResponse: MOCK_SAC_CONTRACT_TYPE_RESPONSE,
    });

    await page.route(
      "https://raw.githubusercontent.com/stellar/stellar-asset-contract-spec/refs/heads/main/stellar-asset-spec.json",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(stellarAssetSpec),
        });
      },
    );

    // SE Contract Info isn't relevant here; respond 404 so the query fails
    // fast rather than hitting the real network.
    await page.route(
      `${STELLAR_EXPERT_API}/testnet/contract/${MOCK_SAC_CONTRACT_ID}`,
      async (route) => {
        await route.fulfill({
          status: 404,
          contentType: "application/json",
          body: "{}",
        });
      },
    );
  });

  test("'Use another signing method' + Build transaction redirects to /transaction/build with prefilled state", async ({
    page,
  }) => {
    await page.goto(`${baseURL}/smart-contracts/contract-explorer`);

    await page.getByLabel("Contract ID").fill(MOCK_SAC_CONTRACT_ID);
    await page.getByRole("button", { name: "Load contract" }).click();

    // Switch to the Invoke contract tab.
    await page.getByTestId("contract-invoke").click();
    await expect(page.getByTestId("contract-invoke")).toHaveAttribute(
      "data-is-active",
      "true",
    );

    // Wait for the SAC function cards to render. `decimals` is a no-arg
    // function, so its Simulate & submit button is enabled without any input.
    const invokeContainer = page.getByTestId("invoke-contract-container");
    await expect(invokeContainer).toBeVisible();
    const decimalsTitle = invokeContainer.getByText("decimals", {
      exact: true,
    });
    await expect(decimalsTitle).toBeVisible();

    // Select "Use another signing method"
    await page.locator('label[for="invoke-contract-signing-another"]').click();
    await expect(page.getByLabel("Use another signing method")).toBeChecked();

    // Click "Build transaction" on the `decimals` card. When "Use another
    // signing method" is selected, the per-function action button text
    // changes from "Simulate & submit" to "Build transaction"
    const decimalsCard = decimalsTitle.locator(
      'xpath=ancestor::*[contains(@class, "Card")][1]',
    );
    await decimalsCard
      .getByRole("button", { name: "Build transaction" })
      .click();

    // Should land on /transaction/build with the build store seeded.
    await expect(page).toHaveURL(/\/transaction\/build/);

    const stored = await page.evaluate(() =>
      sessionStorage.getItem("stellar_lab_tx_flow_build"),
    );
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored as string);
    expect(parsed.state.build.soroban.operation.operation_type).toBe(
      "invoke_contract_function",
    );

    const invokeParam = JSON.parse(
      parsed.state.build.soroban.operation.params.invoke_contract,
    );
    expect(invokeParam.contract_id).toBe(MOCK_SAC_CONTRACT_ID);
    expect(invokeParam.function_name).toBe("decimals");
  });
});
