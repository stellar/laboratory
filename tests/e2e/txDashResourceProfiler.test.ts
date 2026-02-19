import { expect, Page, test } from "@playwright/test";
import { TX_EVENTS_MOCK_SOROSWAP } from "./mock/txEvents";
import { mockRpcRequest } from "./mock/helpers";

test.describe("Transaction Dashboard: Resource Profiler", () => {
  test.beforeEach(async ({ page }) => {
    // Load page
    await page.goto("http://localhost:3000/transaction/dashboard");
  });

  test("Resources", async ({ page }) => {
    await txData({ page, mockResponse: TX_EVENTS_MOCK_SOROSWAP });

    await expect(
      page.locator("h3").filter({ hasText: "Resources" }),
    ).toBeVisible();

    // CPU and memory
    await checkItemGroup({
      page,
      groupId: "cpu-and-memory-item",
      headerTitle: "CPU and memory",
      itemRows: [
        [
          { label: "CPU instructions", value: "19,828,719" },
          { hasLimit: true },
        ],
        [{ label: "Memory usage", value: "18,931,120 B" }, { hasLimit: true }],
      ],
    });

    // Footprint
    await checkItemGroup({
      page,
      groupId: "footprint-item",
      headerTitle: "Footprint",
      itemRows: [
        [{ label: "Footprint keys read only", value: "12" }],
        [{ label: "Footprint keys read write", value: "27" }],
        [{ label: "Footprint keys total", value: "39" }, { hasLimit: true }],
      ],
    });

    // Ledger I/O
    await checkItemGroup({
      page,
      groupId: "ledger-io-item",
      headerTitle: "Ledger I/O",
      itemRows: [
        [{ label: "Entries read", value: "32 entries" }, { hasLimit: true }],
        [{ label: "Entries write", value: "16 entries" }, { hasLimit: true }],
        [{ label: "Ledger read", value: "0 B" }, { hasLimit: true }],
        [{ label: "Ledger write", value: "2,480 B" }, { hasLimit: true }],
      ],
    });

    // Data I/O
    await checkItemGroup({
      page,
      groupId: "data-io-item",
      headerTitle: "Data I/O",
      itemRows: [
        [{ label: "Data read", value: "0 B" }],
        [{ label: "Data write", value: "2,480 B" }],
        [{ label: "Key read", value: "0 B" }],
        [{ label: "Key write", value: "0 B" }],
        [{ label: "Code read", value: "0 B" }],
        [{ label: "Code write", value: "0 B" }],
      ],
    });

    // Events
    await checkItemGroup({
      page,
      groupId: "events-item",
      headerTitle: "Events",
      itemRows: [
        [{ label: "Emit event count", value: "7" }],
        [{ label: "Emit event bytes", value: "1,740 B" }, { hasLimit: true }],
      ],
    });

    // Execution metrics
    await checkItemGroup({
      page,
      groupId: "execution-metrics-item",
      headerTitle: "Execution metrics",
      itemRows: [[{ label: "Invoke time", value: "3,285,341 ns" }]],
    });
  });
});

// =============================================================================
// Helpers
// =============================================================================
const txData = async ({
  page,
  mockResponse,
}: {
  page: Page;
  mockResponse: any;
}) => {
  // Input transaction hash
  const loadButton = page.getByRole("button", { name: "Load transaction" });

  await expect(loadButton).toBeDisabled();
  await page.getByLabel("Transaction hash").fill(mockResponse.result.txHash);

  await expect(loadButton).toBeEnabled();

  // Mock response
  await mockRpcRequest({
    page,
    rpcMethod: "getTransaction",
    bodyJsonResponse: mockResponse,
  });

  await loadButton.click();

  // Verify Call stack trace tab is active by default
  const callStackTraceTabButton = page.getByTestId("tx-call-stack-trace");
  await expect(callStackTraceTabButton).toHaveAttribute(
    "data-is-active",
    "true",
  );

  // Select tab
  const resourceProfilerTabButton = page.getByTestId("tx-resource-profiler");
  await expect(resourceProfilerTabButton).toHaveAttribute(
    "data-is-active",
    "false",
  );

  await resourceProfilerTabButton.click();
  await expect(resourceProfilerTabButton).toHaveAttribute(
    "data-is-active",
    "true",
  );
};

type ItemGroup = ({ label: string; value: string } | { hasLimit: true })[];

const checkItemGroup = async ({
  page,
  groupId,
  headerTitle,
  itemRows,
}: {
  page: Page;
  groupId: string;
  headerTitle: string;
  itemRows: ItemGroup[];
}) => {
  const groupContainer = page.getByTestId(groupId);

  // Header
  await expect(
    groupContainer.locator(".TransactionResourceProfiler__item__header").nth(0),
  ).toContainText(headerTitle);

  // Items
  const groupItems = groupContainer.locator(
    ".TransactionResourceProfiler__item__container",
  );

  for (let ir = 0; ir < itemRows.length; ir++) {
    const itemRow = groupItems
      .nth(ir)
      .locator(".TransactionResourceProfiler__item__row");
    for (let ic = 0; ic < itemRows[ir].length; ic++) {
      const item = itemRows[ir][ic];

      if ("hasLimit" in item) {
        // For limits, we want to check only the rendered elements, not their values,
        // because we fetch them dynamically via a pre-build script.
        await expect(itemRow.nth(ic).locator("> div").nth(0)).toBeVisible();
        await expect(itemRow.nth(ic).locator("> div").nth(1)).toBeVisible();
      } else {
        // Check exact values
        await expect(itemRow.nth(ic).locator("> div").nth(0)).toHaveText(
          item.label,
        );
        await expect(itemRow.nth(ic).locator("> div").nth(1)).toHaveText(
          item.value,
        );
      }
    }
  }
};
