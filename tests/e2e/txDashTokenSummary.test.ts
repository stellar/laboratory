import { expect, Locator, Page, test } from "@playwright/test";
import {
  TX_EVENTS_MOCK_KALE,
  TX_EVENTS_MOCK_MUXED,
  TX_EVENTS_MOCK_RESPONSE_EMPTY,
  TX_EVENTS_MOCK_RESPONSE_NO_CONTRACT_EVENTS,
  TX_EVENTS_MOCK_SAC,
  TX_EVENTS_MOCK_SOROSWAP,
} from "./mock/txEvents";
import { mockRpcRequest } from "./mock/helpers";

test.describe("Transaction Dashboard: Token Summary", () => {
  test.beforeEach(async ({ page }) => {
    // Load page
    await page.goto("http://localhost:3000/transaction/dashboard");
  });

  test("SAC", async ({ page }) => {
    await eventsData({
      page,
      mockResponse: TX_EVENTS_MOCK_SAC,
    });

    // Tokens
    const contractTokensContainer = page.getByTestId("asset-ev");
    await expect(contractTokensContainer).toBeVisible();
    await expect(contractTokensContainer.locator("> .Text")).toHaveText(
      "Contract token transferred",
    );
    const contracTokensRows = contractTokensContainer.locator("tbody tr");
    await expect(contracTokensRows).toHaveCount(2);

    // First row
    await testTableCellValue({
      tableRows: contracTokensRows,
      rowIndex: 0,
      cellIndex: 0,
      cellValue: "GBJX...G7YU",
    });
    await testTableCellValue({
      tableRows: contracTokensRows,
      rowIndex: 0,
      cellIndex: 1,
      cellValue: "CDHN...FNJE",
    });
    await testTableCellValue({
      tableRows: contracTokensRows,
      rowIndex: 0,
      cellIndex: 2,
      cellValue: "277.52",
    });
    await testTableCellValue({
      tableRows: contracTokensRows,
      rowIndex: 0,
      cellIndex: 3,
      cellValue: "USDC",
    });

    // Second row
    await testTableCellValue({
      tableRows: contracTokensRows,
      rowIndex: 1,
      cellIndex: 0,
      cellValue: "CDHN...FNJE",
    });
    await testTableCellValue({
      tableRows: contracTokensRows,
      rowIndex: 1,
      cellIndex: 1,
      cellValue: "CA6P...CJBE",
    });
    await testTableCellValue({
      tableRows: contracTokensRows,
      rowIndex: 1,
      cellIndex: 2,
      cellValue: "277.52",
    });
    await testTableCellValue({
      tableRows: contracTokensRows,
      rowIndex: 1,
      cellIndex: 3,
      cellValue: "USDC",
    });

    // Native
    const assetTokensContainer = page.getByTestId("native-ev");
    await expect(assetTokensContainer).toBeVisible();
    await expect(assetTokensContainer.locator("> .Text")).toHaveText(
      "Native token (XLM) transferred",
    );
    const contracNativeRows = assetTokensContainer.locator("tbody tr");
    await expect(contracNativeRows).toHaveCount(2);

    // First row
    await testTableCellValue({
      tableRows: contracNativeRows,
      rowIndex: 0,
      cellIndex: 0,
      cellValue: "CA6P...CJBE",
    });
    await testTableCellValue({
      tableRows: contracNativeRows,
      rowIndex: 0,
      cellIndex: 1,
      cellValue: "CDHN...FNJE",
    });
    await testTableCellValue({
      tableRows: contracNativeRows,
      rowIndex: 0,
      cellIndex: 2,
      cellValue: "1,107.97",
    });
    await testTableCellValue({
      tableRows: contracNativeRows,
      rowIndex: 0,
      cellIndex: 3,
      cellValue: "XLM",
    });

    // Second row
    await testTableCellValue({
      tableRows: contracNativeRows,
      rowIndex: 1,
      cellIndex: 0,
      cellValue: "CDHN...FNJE",
    });
    await testTableCellValue({
      tableRows: contracNativeRows,
      rowIndex: 1,
      cellIndex: 1,
      cellValue: "GBJX...G7YU",
    });
    await testTableCellValue({
      tableRows: contracNativeRows,
      rowIndex: 1,
      cellIndex: 2,
      cellValue: "1,107.97",
    });
    await testTableCellValue({
      tableRows: contracNativeRows,
      rowIndex: 1,
      cellIndex: 3,
      cellValue: "XLM",
    });
  });

  test("SoroSwap", async ({ page }) => {
    await eventsData({
      page,
      mockResponse: TX_EVENTS_MOCK_SOROSWAP,
    });

    // Tokens
    const contractTokensContainer = page.getByTestId("asset-ev");
    await expect(contractTokensContainer).toBeVisible();
    await expect(contractTokensContainer.locator("> .Text")).toHaveText(
      "Contract token transferred",
    );
    const contracTokensRows = contractTokensContainer.locator("tbody tr");
    await expect(contracTokensRows).toHaveCount(10);

    // Native
    const assetTokensContainer = page.getByTestId("native-ev");
    await expect(assetTokensContainer).toBeVisible();
    await expect(assetTokensContainer.locator("> .Text")).toHaveText(
      "Native token (XLM) transferred",
    );
    const contracNativeRows = assetTokensContainer.locator("tbody tr");
    await expect(contracNativeRows).toHaveCount(2);
  });

  test("KALE: no transfer events", async ({ page }) => {
    await eventsData({
      page,
      mockResponse: TX_EVENTS_MOCK_KALE,
    });

    await expect(
      page.getByText("This transaction has no token transfers."),
    ).toBeVisible();
  });

  test("Muxed account", async ({ page }) => {
    await eventsData({
      page,
      mockResponse: TX_EVENTS_MOCK_MUXED,
    });

    // Tokens
    const contractTokensContainer = page.getByTestId("asset-ev");
    await expect(contractTokensContainer).toBeVisible();
    await expect(contractTokensContainer.locator("> .Text")).toHaveText(
      "Contract token transferred",
    );
    const contracTokensRows = contractTokensContainer.locator("tbody tr");
    await expect(contracTokensRows).toHaveCount(1);

    // Native
    const assetTokensContainer = page.getByTestId("native-ev");
    await expect(assetTokensContainer).toBeHidden();
  });

  test.describe("No transfer events", () => {
    test("Contract events empty", async ({ page }) => {
      await eventsData({ page, mockResponse: TX_EVENTS_MOCK_RESPONSE_EMPTY });

      await expect(
        page.getByText("This transaction has no token transfers."),
      ).toBeVisible();
    });

    test("Contract events undefined", async ({ page }) => {
      await eventsData({
        page,
        mockResponse: TX_EVENTS_MOCK_RESPONSE_NO_CONTRACT_EVENTS,
      });

      await expect(
        page.getByText("This transaction has no token transfers."),
      ).toBeVisible();
    });
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
  await page.getByLabel("Transaction hash").fill(mockResponse.result.txHash);

  await expect(loadButton).toBeEnabled();

  // Mock response
  await mockRpcRequest({
    page,
    rpcMethod: "getTransaction",
    bodyJsonResponse: mockResponse,
  });

  await loadButton.click();

  // Select Token Summary tab
  const tokenSummaryTabButton = page.getByTestId("tx-token-summary");
  await expect(tokenSummaryTabButton).toHaveAttribute(
    "data-is-active",
    "false",
  );

  await tokenSummaryTabButton.click();
  await expect(tokenSummaryTabButton).toHaveAttribute("data-is-active", "true");
};

const testTableCellValue = async ({
  tableRows,
  rowIndex,
  cellIndex,
  cellValue,
}: {
  tableRows: Locator;
  rowIndex: number;
  cellIndex: number;
  cellValue: string;
}) => {
  await expect(
    tableRows.nth(rowIndex).locator("td").nth(cellIndex),
  ).toContainText(cellValue);
};
