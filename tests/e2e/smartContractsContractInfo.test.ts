import { test, expect } from "@playwright/test";
import { STELLAR_EXPERT_API } from "@/constants/settings";
import { SAVED_ACCOUNT_1 } from "./mock/localStorage";
import {
  MOCK_CONTRACT_ID,
  MOCK_CONTRACT_INFO_CONTRACT_TYPE_FAILURE,
  MOCK_CONTRACT_INFO_CONTRACT_TYPE_SUCCESS,
  MOCK_CONTRACT_INFO_RESPONSE_SUCCESS,
} from "./mock/smartContracts";
import { mockRpcRequest } from "./mock/helpers";

test.describe("Smart Contracts: Contract Info", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/smart-contracts/contract-explorer");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Contract explorer");
    await expect(page.getByLabel("Contract ID")).toHaveValue("");
    await expect(
      page.getByRole("button", { name: "Load contract" }),
    ).toBeDisabled();
  });

  test("Response success", async ({ page }) => {
    // Mock the RPC call for getting the contract type
    await mockRpcRequest({
      page,
      rpcMethod: "getLedgerEntries",
      bodyJsonResponse: MOCK_CONTRACT_INFO_CONTRACT_TYPE_SUCCESS,
    });

    // Mock the Stellar Expert API call
    await page.route(
      `${STELLAR_EXPERT_API}/testnet/contract/${MOCK_CONTRACT_ID}`,
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(MOCK_CONTRACT_INFO_RESPONSE_SUCCESS),
        });
      },
    );

    const contractIdInput = page.getByLabel("Contract ID");

    // Input validation
    await contractIdInput.fill("aaa");
    await expect(
      page.getByText("Invalid contract ID. Please enter a valid contract ID."),
    ).toBeVisible();

    // Valid input
    await contractIdInput.fill(MOCK_CONTRACT_ID);
    await expect(
      page.getByText("Invalid contract ID. Please enter a valid contract ID."),
    ).toBeHidden();

    // Fetch info
    const loadButton = page.getByRole("button", { name: "Load contract" });

    await expect(loadButton).toBeEnabled();
    await loadButton.click();

    // Show info
    await expect(
      page.getByText("Contract Info", { exact: true }).first(),
    ).toHaveAttribute("data-is-active", "true");

    const contractInfoContainer = page.getByTestId("contract-info-container");

    const getInfoItem = (label: string) => {
      return contractInfoContainer.getByText(label).locator("+ div");
    };

    await expect(getInfoItem("Source Code")).toHaveText("test-org/test-repo");
    await expect(getInfoItem("Created")).toHaveText(
      "Tue, Nov 12, 2024, 09:12:56 UTC",
    );
    await expect(getInfoItem("Wasm Hash")).toHaveText(
      "a0db88b6da6f83bf1c2c8fafcc8fa9cf9d2abc7f8507d831d086aa2c6ad5fc1b",
    );
    await expect(getInfoItem("Creator")).toHaveText(SAVED_ACCOUNT_1);
    await expect(getInfoItem("Contract Storage")).toHaveText("10 entries");

    // Clear
    await page.getByRole("button", { name: "Clear", exact: true }).click();
    await expect(contractIdInput).toHaveValue("");
    await expect(loadButton).toBeDisabled();
    await expect(contractInfoContainer).toBeVisible();
  });

  test("Response error", async ({ page }) => {
    // Mock the RPC call for getting the contract type
    await mockRpcRequest({
      page,
      rpcMethod: "getLedgerEntries",
      bodyJsonResponse: MOCK_CONTRACT_INFO_CONTRACT_TYPE_FAILURE,
    });

    // Mock the API call
    await page.route(
      `${STELLAR_EXPERT_API}/testnet/contract/${MOCK_CONTRACT_ID}`,
      async (route) => {
        await route.fulfill({
          status: 404,
          contentType: "application/json",
          body: JSON.stringify(MOCK_RESPONSE_ERROR),
        });
      },
    );

    // Input
    await page.getByLabel("Contract ID").fill(MOCK_CONTRACT_ID);
    const loadButton = page.getByRole("button", { name: "Load contract" });

    await expect(loadButton).toBeEnabled();
    await loadButton.click();

    await expect(
      page.getByText(
        "Something went wrong getting contract data by contract ID. Could not obtain contract data from server.",
      ),
    ).toBeVisible();
  });
});

// =============================================================================
// Mock data
// =============================================================================
const MOCK_RESPONSE_ERROR = {
  error:
    "Not found. Contract was not found on the ledger. Check if you specified contract address correctly.",
  status: 404,
};
