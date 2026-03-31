import { baseURL } from "../../playwright.config";
import { test, expect } from "@playwright/test";
import {
  TX_ST_CHANGE_KALE_HARVEST,
  TX_ST_CHANGE_DOMAIN_SET,
} from "./mock/txStateChange";
import { TX_EVENTS_MOCK_SOROSWAP } from "./mock/txEvents";
import { mockRpcRequest } from "./mock/helpers";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";

test.describe("Transaction Dashboard: Signatures", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/transaction/dashboard`);
  });

  test("Soroban Transaction", async ({ page }) => {
    // Fill transaction hash input
    const loadButton = page.getByRole("button", { name: "Load transaction" });

    await expect(loadButton).toBeDisabled();
    await page
      .getByLabel("Transaction hash")
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
    const signaturesTabButton = page.getByTestId("tx-signatures");
    await expect(signaturesTabButton).toHaveAttribute(
      "data-is-active",
      "false",
    );

    await signaturesTabButton.click();
    await expect(signaturesTabButton).toHaveAttribute("data-is-active", "true");

    // Signatures table
    const table = page.locator(".Signatures table");
    const rows = table.locator("tr");

    // Table columns
    await expect(getTableRow(rows, 0)).toHaveText([
      "Signer",
      "Signature",
      "Hint",
    ]);

    // Table columns
    await expect(getTableRow(rows, 1)).toHaveText([
      `${shortenStellarAddress(TX_ST_CHANGE_DOMAIN_SET.result.envelopeJson.tx.tx.source_account)}`,
      `${TX_ST_CHANGE_DOMAIN_SET.result.envelopeJson.tx.signatures[0].signature}`,
      `${TX_ST_CHANGE_DOMAIN_SET.result.envelopeJson.tx.signatures[0].hint}`,
    ]);
  });

  test("FeeBump Soroban Transaction", async ({ page }) => {
    // Fill transaction hash input
    const loadButton = page.getByRole("button", { name: "Load transaction" });

    await expect(loadButton).toBeDisabled();
    await page
      .getByLabel("Transaction hash")
      .fill(TX_ST_CHANGE_KALE_HARVEST.result.txHash);

    await expect(loadButton).toBeEnabled();

    // Mock the RPC call for getting the contract type
    await mockRpcRequest({
      page,
      rpcMethod: "getTransaction",
      bodyJsonResponse: TX_ST_CHANGE_KALE_HARVEST,
    });

    await loadButton.click();

    // Select tab
    const signaturesTabButton = page.getByTestId("tx-signatures");
    await expect(signaturesTabButton).toHaveAttribute(
      "data-is-active",
      "false",
    );

    await signaturesTabButton.click();
    await expect(signaturesTabButton).toHaveAttribute("data-is-active", "true");

    // Signatures table
    const table = page.locator(".Signatures table");
    const rows = table.locator("tr");

    // Table columns
    await expect(getTableRow(rows, 0)).toHaveText([
      "Signer",
      "Signature",
      "Hint",
    ]);

    // Table columns
    await expect(getTableRow(rows, 1)).toHaveText([
      `${shortenStellarAddress(TX_ST_CHANGE_KALE_HARVEST.result.envelopeJson.tx_fee_bump.tx.inner_tx.tx.tx.source_account)}`,
      `${TX_ST_CHANGE_KALE_HARVEST.result.envelopeJson.tx_fee_bump.tx.inner_tx.tx.signatures[0].signature}`,
      `${TX_ST_CHANGE_KALE_HARVEST.result.envelopeJson.tx_fee_bump.tx.inner_tx.tx.signatures[0].hint}`,
    ]);
  });

  test("Auth Entry Signatures", async ({ page }) => {
    const loadButton = page.getByRole("button", { name: "Load transaction" });

    await expect(loadButton).toBeDisabled();
    await page
      .getByLabel("Transaction hash")
      .fill(TX_EVENTS_MOCK_SOROSWAP.result.txHash);

    await expect(loadButton).toBeEnabled();

    await mockRpcRequest({
      page,
      rpcMethod: "getTransaction",
      bodyJsonResponse: TX_EVENTS_MOCK_SOROSWAP,
    });

    await loadButton.click();

    // Select tab
    const signaturesTabButton = page.getByTestId("tx-signatures");
    await signaturesTabButton.click();
    await expect(signaturesTabButton).toHaveAttribute("data-is-active", "true");

    const tables = page.locator(".Signatures table");

    // First table: transaction signatures
    const txRows = tables.nth(0).locator("tr");
    await expect(getTableRow(txRows, 0)).toHaveText([
      "Signer",
      "Signature",
      "Hint",
    ]);

    // Second table: auth entry signatures
    const authRows = tables.nth(1).locator("tr");
    await expect(getTableRow(authRows, 0)).toHaveText([
      "Address",
      "Signature",
      "Contract Function",
    ]);

    const authEntry =
      TX_EVENTS_MOCK_SOROSWAP.result.envelopeJson.tx_fee_bump.tx.inner_tx.tx.tx
        .operations[0].body.invoke_host_function.auth[0];
    const creds = authEntry.credentials.address;
    const sigMap = creds.signature.vec[0].map;
    const signatureBytes = sigMap.find(
      (item: any) => item.key.symbol === "signature",
    )!.val.bytes;
    const contractAddress =
      authEntry.root_invocation.function.contract_fn.contract_address;

    await expect(getTableRow(authRows, 1)).toHaveText([
      `${shortenStellarAddress(creds.address)}`,
      signatureBytes,
      `${shortenStellarAddress(contractAddress)}`,
    ]);
  });
});

// =============================================================================
// Helpers
// =============================================================================
const getTableRow = (rows: any, index: number) => {
  return rows.nth(index).locator(".Signatures__cell");
};
