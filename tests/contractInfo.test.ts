import { test, expect } from "@playwright/test";
import { STELLAR_EXPERT_API } from "@/constants/settings";
import { SAVED_ACCOUNT_1 } from "./mock/localStorage";

test.describe("Contract Info", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/smart-contracts/contract-explorer");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Contract Explorer");
    await expect(page.getByLabel("Contract ID")).toHaveValue("");
    await expect(
      page.getByRole("button", { name: "Load contract" }),
    ).toBeDisabled();
  });

  test("Response success", async ({ page }) => {
    // Mock the API call
    await page.route(
      `${STELLAR_EXPERT_API}/testnet/contract/${MOCK_CONTRACT_ID}`,
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(MOCK_RESPONSE_SUCCESS),
        });
      },
    );

    const contractIdInput = page.getByLabel("Contract ID");

    // Input validation
    await contractIdInput.fill("aaa");
    await expect(
      page.getByText("The string must start with 'C'."),
    ).toBeVisible();

    // Valid input
    await contractIdInput.fill(MOCK_CONTRACT_ID);
    await expect(
      page.getByText("The string must start with 'C'."),
    ).toBeHidden();

    // Fetch info
    const loadButton = page.getByRole("button", { name: "Load contract" });

    await expect(loadButton).toBeEnabled();
    await loadButton.click();

    // Show info
    await expect(
      page.getByText("Contract Info", { exact: true }),
    ).toHaveAttribute("data-is-active", "true");

    const contractInfoContainer = page.getByTestId("contract-info-container");

    const getInfoItem = (label: string) => {
      return contractInfoContainer.getByText(label).locator("+ div");
    };

    await expect(getInfoItem("Source Code")).toHaveText("test-org/test-repo");
    await expect(getInfoItem("Created")).toHaveText(
      "Tue, Nov 12, 2024, 09:12:56 UTC",
    );
    await expect(getInfoItem("WASM Hash")).toHaveText(
      "df88820e231ad8f3027871e5dd3cf45491d7b7735e785731466bfc2946008608",
    );
    await expect(getInfoItem("Versions")).toHaveText("-");
    await expect(getInfoItem("Creator")).toHaveText(SAVED_ACCOUNT_1);
    await expect(getInfoItem("Data Storage")).toHaveText("10 entries");

    // Clear
    await page.getByRole("button", { name: "Clear", exact: true }).click();
    await expect(contractIdInput).toHaveValue("");
    await expect(loadButton).toBeDisabled();
    await expect(contractInfoContainer).toBeHidden();
  });

  test("Response error", async ({ page }) => {
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
        "Something went wrong. Not found. Contract was not found on the ledger. Check if you specified contract address correctly.",
      ),
    ).toBeVisible();
  });
});

// =============================================================================
// Mock data
// =============================================================================
const MOCK_CONTRACT_ID =
  "CBP7NO6F7FRDHSOFQBT2L2UWYIZ2PU76JKVRYAQTG3KZSQLYAOKIF2WB";
const MOCK_RESPONSE_SUCCESS = {
  contract: MOCK_CONTRACT_ID,
  account: MOCK_CONTRACT_ID,
  created: 1731402776,
  creator: SAVED_ACCOUNT_1,
  payments: 300,
  trades: 0,
  wasm: "df88820e231ad8f3027871e5dd3cf45491d7b7735e785731466bfc2946008608",
  storage_entries: 10,
  validation: {
    status: "verified",
    repository: "https://github.com/test-org/test-repo",
    commit: "391f37e39a849ddf7543a5d7f1488e055811cb68",
    ts: 1731402776,
  },
};
const MOCK_RESPONSE_ERROR = {
  error:
    "Not found. Contract was not found on the ledger. Check if you specified contract address correctly.",
  status: 404,
};