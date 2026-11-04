import { baseURL } from "../../playwright.config";
import { expect, Locator, Page, test } from "@playwright/test";
import {
  TX_EVENTS_MOCK_KALE,
  TX_EVENTS_MOCK_MUXED,
  TX_EVENTS_MOCK_RESPONSE_EMPTY,
  TX_EVENTS_MOCK_RESPONSE_NO_CONTRACT_EVENTS,
  TX_EVENTS_MOCK_SAC,
  TX_EVENTS_MOCK_SOROSWAP,
  TX_EVENTS_MOCK_SPOOFED_NATIVE,
} from "./mock/txEvents";
import { mockRpcRequest } from "./mock/helpers";

test.describe("Transaction Dashboard: Token Summary", () => {
  test("SAC", async ({ page }) => {
    await eventsData({
      page,
      mockResponse: TX_EVENTS_MOCK_SAC,
      networkId: "mainnet",
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
      networkId: "mainnet",
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

  test("Non-SAC transfer with 'native' asset topic", async ({ page }) => {
    await eventsData({
      page,
      mockResponse: TX_EVENTS_MOCK_SPOOFED_NATIVE,
      networkId: "mainnet",
    });

    // The spoofed event is listed as a contract token with no asset
    const contractTokensContainer = page.getByTestId("asset-ev");
    await expect(contractTokensContainer).toBeVisible();
    const contracTokensRows = contractTokensContainer.locator("tbody tr");
    await expect(contracTokensRows).toHaveCount(3);

    await testTableCellValue({
      tableRows: contracTokensRows,
      rowIndex: 2,
      cellIndex: 0,
      cellValue: "CA6P...CJBE",
    });
    await testTableCellValue({
      tableRows: contracTokensRows,
      rowIndex: 2,
      cellIndex: 1,
      cellValue: "CDHN...FNJE",
    });
    await expect(contracTokensRows.nth(2).locator("td").nth(3)).toHaveText("");

    // Only the real native SAC transfer is in the XLM group
    const nativeContainer = page.getByTestId("native-ev");
    await expect(nativeContainer).toBeVisible();
    const nativeRows = nativeContainer.locator("tbody tr");
    await expect(nativeRows).toHaveCount(1);

    await testTableCellValue({
      tableRows: nativeRows,
      rowIndex: 0,
      cellIndex: 0,
      cellValue: "CDHN...FNJE",
    });
    await testTableCellValue({
      tableRows: nativeRows,
      rowIndex: 0,
      cellIndex: 3,
      cellValue: "XLM",
    });
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

    // `to_muxed_id` 1 on GC4N...DMXU shows as its M address and the ID
    await testTableCellValue({
      tableRows: contracTokensRows,
      rowIndex: 0,
      cellIndex: 1,
      cellValue: "MC4N...GIQE",
    });
    await testTableCellValue({
      tableRows: contracTokensRows,
      rowIndex: 0,
      cellIndex: 1,
      cellValue: "Muxed ID: 1",
    });

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
// Mainnet has no default RPC URL, so mainnet tests use a mock one
const MAINNET_MOCK_RPC_URL = "https://mainnet-rpc.mock";

const eventsData = async ({
  page,
  mockResponse,
  networkId = "testnet",
}: {
  page: Page;
  mockResponse: any;
  // Must match the fixture's network: the SAC contract ID depends on it
  networkId?: "testnet" | "mainnet";
}) => {
  if (networkId === "mainnet") {
    // Saved network is used on load when the URL has none (no confirm modal)
    await page.addInitScript((rpcUrl) => {
      localStorage.setItem(
        "stellar_lab_network",
        JSON.stringify({
          id: "mainnet",
          label: "Mainnet",
          horizonUrl: "https://horizon.stellar.org",
          rpcUrl,
          passphrase: "Public Global Stellar Network ; September 2015",
        }),
      );
    }, MAINNET_MOCK_RPC_URL);
  }

  await page.goto(`${baseURL}/transaction/dashboard`);

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
    rpcUrl: networkId === "mainnet" ? MAINNET_MOCK_RPC_URL : undefined,
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
