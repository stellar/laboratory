import { test, expect, type Page } from "@playwright/test";

import {
  formatLedgersToDays,
  formatLedgersToMonths,
} from "@/helpers/formatLedgersToTime";
import { formatLargeNumber } from "@/helpers/formatLargeNumber";
import { formatFileSize } from "@/helpers/formatFileSize";
import { formatNumber } from "@/helpers/formatNumber";

import { MAINNET_LIMITS } from "@/constants/networkLimits";

test.describe("Network Limits page on Mainnet", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "http://localhost:3000/network-limits?$=network$id=mainnet",
    );
  });

  test("Loads the page", async ({ page }) => {
    await expect(page.getByTestId("networkSelector-button")).toHaveText(
      "Mainnet",
    );

    await expect(page.locator("h1")).toHaveText("Network limits");
  });

  test("Displays introduction text and link", async ({ page }) => {
    const introText = page.locator(
      "text=Resource limitations and fees only apply to smart contract transactions",
    );
    await expect(introText).toBeVisible();
  });

  test("Displays Resource limits section with correct values", async ({
    page,
  }) => {
    const resourceLimitsHeading = page.locator("text=Resource limits");
    const table = page.locator(".NetworkLimits__table");
    const rows = table.locator(".NetworkLimits__table__row");

    await expect(resourceLimitsHeading).toBeVisible();

    // Check table entries
    await expect(getTableRow(rows, 1)).toHaveText([
      "Max CPU instructions",
      `${formatLargeNumber(MAINNET_LIMITS.tx_max_instructions)}`,
      `${formatLargeNumber(MAINNET_LIMITS.ledger_max_instructions)}`,
    ]);

    await expect(getTableRow(rows, 2)).toHaveText([
      "Max memory (RAM)",
      `${formatFileSize(MAINNET_LIMITS.tx_memory_limit)}`,
      "no explicit limit",
    ]);

    await expect(getTableRow(rows, 3)).toHaveText([
      "Max number of keys in footprint",
      `${MAINNET_LIMITS.tx_max_footprint_entries.toString()}`,
      "no explicit limit",
    ]);

    await expect(getTableRow(rows, 4)).toHaveText([
      "Disk reads",
      `${MAINNET_LIMITS.tx_max_disk_read_entries} entries / ${formatFileSize(MAINNET_LIMITS.tx_max_disk_read_bytes)}`,
      `${MAINNET_LIMITS.ledger_max_disk_read_entries} entries / ${formatFileSize(MAINNET_LIMITS.ledger_max_disk_read_bytes)}`,
    ]);

    await expect(getTableRow(rows, 5)).toHaveText([
      "Disk writes",
      `${MAINNET_LIMITS.tx_max_write_ledger_entries} entries / ${formatFileSize(MAINNET_LIMITS.tx_max_write_bytes)}`,
      `${MAINNET_LIMITS.ledger_max_write_ledger_entries} entries / ${formatFileSize(MAINNET_LIMITS.ledger_max_write_bytes)}`,
    ]);

    await expect(getTableRow(rows, 6)).toHaveText([
      "Transaction size",
      `${formatFileSize(MAINNET_LIMITS.tx_max_write_bytes)}`,
      `${formatFileSize(MAINNET_LIMITS.ledger_max_txs_size_bytes)}`,
    ]);

    await expect(getTableRow(rows, 7)).toHaveText([
      "Events + return value size",
      `${formatFileSize(MAINNET_LIMITS.tx_max_contract_events_size_bytes)}`,
      "no explicit limit",
    ]);

    await expect(getTableRow(rows, 8)).toHaveText([
      "Individual ledger key sizecontract storage key",
      `${MAINNET_LIMITS.contract_data_key_size_bytes} bytes`,
      "",
    ]);

    await expect(getTableRow(rows, 9)).toHaveText([
      "Individual ledger entry sizeincluding Wasm entries",
      `${formatFileSize(MAINNET_LIMITS.contract_max_size_bytes, "binary")}`,
      "",
    ]);
  });

  test("Displays State Archival section with correct values", async ({
    page,
  }) => {
    const stateArchivalHeading = page.locator("text=TTL extension parameter");
    await expect(stateArchivalHeading).toBeVisible();

    const tables = page.locator(".NetworkLimits__table");
    const stateArchivalTable = tables.nth(1);
    const rows = stateArchivalTable.locator(".NetworkLimits__table__row");

    await expect(getTableRow(rows, 1)).toHaveText([
      "Persistent entry TTL on creation",
      `${formatLedgersToDays(MAINNET_LIMITS.min_persistent_ttl)}`,
    ]);

    await expect(getTableRow(rows, 2)).toHaveText([
      "Temporary entry TTL on creation",
      `${formatLedgersToDays(MAINNET_LIMITS.min_temporary_ttl)}`,
    ]);

    await expect(getTableRow(rows, 3)).toHaveText([
      "Max ledger entry TTL extension",
      `${formatLedgersToMonths(MAINNET_LIMITS.max_entry_ttl)}`,
    ]);
  });

  test("Displays Resource fees section with correct values", async ({
    page,
  }) => {
    const resourceFeesHeading = page.locator("text=Resource fees");
    await expect(resourceFeesHeading).toBeVisible();

    const tables = page.locator(".NetworkLimits__table");
    const feesTable = tables.nth(2);
    const rows = feesTable.locator(".NetworkLimits__table__row");

    const BYTES_PER_KB = 1024;

    // Calculate max fees based on transaction limits
    const maxCpuInstructionsFee = formatNumber(
      (MAINNET_LIMITS.tx_max_instructions / 10000) *
        MAINNET_LIMITS.fee_rate_per_instructions_increment,
    );

    const maxReadEntriesFee = formatNumber(
      MAINNET_LIMITS.tx_max_disk_read_entries *
        Number(MAINNET_LIMITS.fee_read_ledger_entry),
    );

    const maxReadBytesFee = formatNumber(
      (MAINNET_LIMITS.tx_max_disk_read_bytes / BYTES_PER_KB) *
        Number(MAINNET_LIMITS.fee_read_1kb),
    );

    const maxWriteEntriesFee = formatNumber(
      MAINNET_LIMITS.tx_max_write_ledger_entries *
        Number(MAINNET_LIMITS.fee_write_ledger_entry),
    );

    const maxWriteBytesFee = formatNumber(
      (MAINNET_LIMITS.tx_max_write_bytes / BYTES_PER_KB) *
        Number(MAINNET_LIMITS.fee_write_1kb),
    );

    const maxTxSizeFee = formatNumber(
      (MAINNET_LIMITS.tx_max_write_bytes / BYTES_PER_KB) *
        Number(MAINNET_LIMITS.fee_tx_size_1kb),
    );

    const maxHistoricalFee = formatNumber(
      (MAINNET_LIMITS.tx_max_write_bytes / BYTES_PER_KB) *
        Number(MAINNET_LIMITS.fee_historical_1kb),
    );

    const maxEventsFee = formatNumber(
      (MAINNET_LIMITS.tx_max_contract_events_size_bytes / BYTES_PER_KB) *
        Number(MAINNET_LIMITS.fee_contract_events_1kb),
    );

    await expect(getTableRow(rows, 1)).toHaveText([
      "10,000 CPU instructions",
      `${MAINNET_LIMITS.fee_rate_per_instructions_increment} (${maxCpuInstructionsFee}/max tx)`,
    ]);

    await expect(getTableRow(rows, 2)).toHaveText([
      "Read 1 ledger entry from disk",
      `${formatNumber(Number(MAINNET_LIMITS.fee_read_ledger_entry))} (${maxReadEntriesFee}/max tx)`,
    ]);

    await expect(getTableRow(rows, 3)).toHaveText([
      "Read 1 KB from disk",
      `${formatNumber(Number(MAINNET_LIMITS.fee_read_1kb))} (${maxReadBytesFee}/max tx)`,
    ]);

    await expect(getTableRow(rows, 4)).toHaveText([
      "Write 1 ledger entry",
      `${formatNumber(Number(MAINNET_LIMITS.fee_write_ledger_entry))} (${maxWriteEntriesFee}/max tx)`,
    ]);

    await expect(getTableRow(rows, 5)).toHaveText([
      "Write 1KB to disk",
      `${formatNumber(Number(MAINNET_LIMITS.fee_write_1kb))} (${maxWriteBytesFee}/max tx)`,
    ]);

    await expect(getTableRow(rows, 6)).toContainText([
      "1 KB of transaction size (bandwidth)",
      `${formatNumber(Number(MAINNET_LIMITS.fee_tx_size_1kb))} (${maxTxSizeFee}/max tx)`,
    ]);

    await expect(getTableRow(rows, 7)).toContainText([
      "1 KB of transaction size (history)",
      `${formatNumber(Number(MAINNET_LIMITS.fee_historical_1kb))} (${maxHistoricalFee}/max tx)`,
    ]);

    await expect(getTableRow(rows, 8)).toHaveText([
      "1 KB of Events/return value",
      `${formatNumber(Number(MAINNET_LIMITS.fee_contract_events_1kb))} (${maxEventsFee}/max tx)`,
    ]);

    // Rent fees have dynamic calculations, so just verify they're present
    const persistentRentRow = getTableRow(rows, 9);
    await expect(persistentRentRow).toContainText([
      "30 days of rent for 1 KB of persistent storage",
    ]);

    const temporaryRentRow = getTableRow(rows, 10);
    await expect(temporaryRentRow).toContainText([
      "30 days of rent for 1 KB of temporary storage",
    ]);
  });

  test("Displays Table and JSON tabs", async ({ page }) => {
    const tableTab = page.getByTestId("table");
    const jsonTab = page.getByTestId("json");

    await expect(tableTab).toBeVisible();
    await expect(jsonTab).toBeVisible();

    // Table tab is active by default
    await expect(tableTab).toHaveAttribute("data-is-active", "true");
    await expect(jsonTab).toHaveAttribute("data-is-active", "false");
  });

  test("Switches to JSON tab and displays JSON content", async ({ page }) => {
    // Dismiss the "Review Network Settings" modal if it appears
    await dismissNetworkSettingsModal(page);

    const jsonTab = page.getByTestId("json");
    await jsonTab.click();

    // Table content should no longer be visible
    await expect(page.locator("text=Resource limits")).not.toBeVisible();
    await expect(page.locator("text=Resource fees")).not.toBeVisible();

    // JSON editor should be visible
    const jsonContainer = page.locator(".NetworkLimits__json-container");
    await expect(jsonContainer).toBeVisible();

    // Verify JSON content contains expected data in the Monaco editor
    const editorContent = jsonContainer.locator(".monaco-editor");
    await expect(editorContent).toBeVisible();
    await expect(editorContent).toContainText("updated_entry");
    await expect(editorContent).toContainText("contract_max_size_bytes");

    // Copy JSON button should be visible
    await expect(page.locator("button:has-text('Copy JSON')")).toBeVisible();
  });

  test("Switches back to Table tab from JSON tab", async ({ page }) => {
    // Dismiss the "Review Network Settings" modal if it appears
    await dismissNetworkSettingsModal(page);

    const tableTab = page.getByTestId("table");
    const jsonTab = page.getByTestId("json");

    // Switch to JSON
    await jsonTab.click();
    await expect(page.locator("text=Resource limits")).not.toBeVisible();

    // Switch back to Table
    await tableTab.click();
    await expect(tableTab).toHaveAttribute("data-is-active", "true");
    await expect(jsonTab).toHaveAttribute("data-is-active", "false");

    // Table content should be visible again
    await expect(page.locator("text=Resource limits")).toBeVisible();
    await expect(page.locator("text=Resource fees")).toBeVisible();
  });

  test("Custom network shows warning message", async ({ page }) => {
    // Navigate directly to custom network
    await page.goto("http://localhost:3000/network-limits?$=network$id=custom");

    // Verify we're on custom network
    await expect(page.getByTestId("networkSelector-button")).toHaveText(
      "Custom",
    );

    // Check for warning message
    const warningText = page.locator(
      "text=Network limit data is not available for the selected custom network",
    );
    await expect(warningText).toBeVisible();

    // Switch network buttons should be visible
    await expect(page.locator("button:has-text('Mainnet')")).toBeVisible();
    await expect(page.locator("button:has-text('Testnet')")).toBeVisible();
    await expect(page.locator("button:has-text('Futurenet')")).toBeVisible();

    // Table/JSON tabs should NOT be visible on custom network
    await expect(page.getByTestId("table")).not.toBeVisible();
    await expect(page.getByTestId("json")).not.toBeVisible();
  });
});

// =============================================================================
// Helpers
// =============================================================================
const getTableRow = (rows: any, index: number) => {
  return rows.nth(index).locator(".NetworkLimits__table__cell");
};

/**
 * Dismisses the "Review Network Settings" modal that appears on first visit.
 * Waits for the modal's Accept button and clicks it.
 */
const dismissNetworkSettingsModal = async (page: Page) => {
  const modal = page.locator(".Modal");
  const acceptButton = modal.locator("button", { hasText: "Accept" });
  await acceptButton.waitFor({ state: "visible", timeout: 5000 });
  await acceptButton.click();
  await modal.waitFor({ state: "hidden" });
};
