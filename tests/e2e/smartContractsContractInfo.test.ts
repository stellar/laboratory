import { baseURL } from "../../playwright.config";
import { test, expect, Page } from "@playwright/test";
import { STELLAR_EXPERT_API } from "@/constants/settings";
import {
  MOCK_LOCAL_STORAGE,
  SAVED_ACCOUNT_1,
  SAVED_CONTRACT_1,
} from "./mock/localStorage";
import {
  MOCK_CONTRACT_ID,
  MOCK_CONTRACT_INFO_CONTRACT_TYPE_FAILURE,
  MOCK_CONTRACT_INFO_CONTRACT_TYPE_SUCCESS,
  MOCK_CONTRACT_INFO_RESPONSE_SUCCESS,
} from "./mock/smartContracts";
import { mockRpcRequest } from "./mock/helpers";

test.describe("Smart Contracts: Contract Info", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/smart-contracts/contract-explorer`);
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
      page.getByText("Contract info", { exact: true }).first(),
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

test.describe("Smart Contracts: Contract Selector", () => {
  let pageContext: Page;

  test.beforeEach(async ({ browser }) => {
    const browserContext = await browser.newContext({
      storageState: MOCK_LOCAL_STORAGE,
    });
    pageContext = await browserContext.newPage();

    // Selecting or typing a valid contract ID auto-loads the contract, so keep
    // those network calls deterministic.
    await mockRpcRequest({
      page: pageContext,
      rpcMethod: "getLedgerEntries",
      bodyJsonResponse: MOCK_CONTRACT_INFO_CONTRACT_TYPE_SUCCESS,
    });
    await pageContext.route(
      `${STELLAR_EXPERT_API}/testnet/contract/*`,
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(MOCK_CONTRACT_INFO_RESPONSE_SUCCESS),
        });
      },
    );

    await pageContext.goto(`${baseURL}/smart-contracts/contract-explorer`);
  });

  test("Lists saved contracts, fills the input on select, and shows a name badge", async () => {
    // The selector button only appears when there are saved contracts for the
    // current network.
    const savedContractsBtn = pageContext.getByRole("button", {
      name: "Saved contracts",
    });
    await expect(savedContractsBtn).toBeVisible();
    await savedContractsBtn.click();

    const options = pageContext.getByTestId("contract-selector-options");
    await expect(options).toBeVisible();

    // Group label + column note
    const label = options.locator(".ContractSelector__dropdown__item__label");
    await expect(label.locator("div").first()).toHaveText("Saved contracts");
    await expect(
      label.locator(".ContractSelector__dropdown__item__label__note"),
    ).toHaveText("Contract ID");

    // Each saved contract is listed as "[name]shortenedId"
    const values = options.locator(".ContractSelector__dropdown__item__value");
    await expect(values.nth(0)).toHaveText("[Contract 1]CA7E...DQQB");
    await expect(values.nth(1)).toHaveText("[Contract 2]CBAS...JMUQ");

    // Selecting an option fills the Contract ID input
    await values.nth(0).click();
    await expect(pageContext.getByLabel("Contract ID")).toHaveValue(
      SAVED_CONTRACT_1,
    );

    // ...and surfaces the saved name as a badge next to the label
    await expect(
      pageContext.locator(".Badge").filter({ hasText: "Contract 1" }),
    ).toBeVisible();
  });

  test("Saved contract options are keyboard focusable and activatable", async () => {
    await pageContext
      .getByRole("button", { name: "Saved contracts" })
      .click();

    const options = pageContext.getByTestId("contract-selector-options");
    await expect(options).toBeVisible();

    // The options are real buttons: focusable and activatable via the keyboard
    const optionButtons = options.getByRole("button");
    await optionButtons.nth(0).focus();
    await expect(optionButtons.nth(0)).toBeFocused();
    await pageContext.keyboard.press("Enter");

    await expect(pageContext.getByLabel("Contract ID")).toHaveValue(
      SAVED_CONTRACT_1,
    );
  });

  test("Shows no name badge for a contract ID that is not saved", async () => {
    // A valid contract ID that is not in the saved list
    await pageContext.getByLabel("Contract ID").fill(MOCK_CONTRACT_ID);

    await expect(
      pageContext.getByText("Contract 1", { exact: true }),
    ).toBeHidden();
    await expect(
      pageContext.getByText("Contract 2", { exact: true }),
    ).toBeHidden();
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
