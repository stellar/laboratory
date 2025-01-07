import { test, expect } from "@playwright/test";
import { STELLAR_EXPERT_API } from "@/constants/settings";
import {
  MOCK_CONTRACT_ID,
  MOCK_CONTRACT_INFO_RESPONSE_SUCCESS,
} from "./mock/smartContracts";

test.describe("Smart Contracts: Version History", () => {
  test.beforeEach(async ({ page }) => {
    // Mock the Contract Info API call
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

    // Mock the Version History API call
    await page.route(
      `${STELLAR_EXPERT_API}/testnet/contract/${MOCK_CONTRACT_ID}/version`,
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(MOCK_RESPONSE_SUCCESS),
        });
      },
    );

    await page.goto("http://localhost:3000/smart-contracts/contract-explorer");
    await expect(page.locator("h1")).toHaveText("Contract Explorer");

    // Load Contract Info
    await page.getByLabel("Contract ID").fill(MOCK_CONTRACT_ID);
    await page.getByRole("button", { name: "Load contract" }).click();
  });

  test("Loads", async ({ page }) => {
    await expect(
      page.getByText("Version History", { exact: true }),
    ).toHaveAttribute("data-is-active", "true");
  });

  test("Table data", async ({ page }) => {
    const table = page.getByTestId("version-history-table");
    const colWasm = table.locator("th").nth(0);
    const colUpdated = table.locator("th").nth(1);

    // Table headers
    await expect(colWasm).toContainText("Contract WASM Hash");
    await expect(colUpdated).toContainText("Updated");

    // Table data
    const firstRow = table.locator("tr").nth(1);
    await expect(firstRow.locator("td").nth(0)).toContainText(DATA_1_WASM);
    await expect(firstRow.locator("td").nth(1)).toContainText(
      "08/09/2024, 18:46:16 UTC",
    );

    const secondRow = table.locator("tr").nth(2);
    await expect(secondRow.locator("td").nth(0)).toContainText(DATA_2_WASM);
    await expect(secondRow.locator("td").nth(1)).toContainText(
      "08/09/2024, 21:07:18 UTC",
    );

    // Sort by Wasm hash
    await colWasm.click();
    await expect(firstRow.locator("td").nth(0)).toContainText(DATA_2_WASM);

    // Sort by Updated
    await colUpdated.click();
    await expect(firstRow.locator("td").nth(0)).toContainText(DATA_1_WASM);
  });
});

// =============================================================================
// Mock data
// =============================================================================
const DATA_1_WASM =
  "eea70a48a2fbac11ed98c081b11dbdce89e6be8d421a833228069497c1c50d28";
const DATA_2_WASM =
  "531feab70c29fe5373191071fdc5d92057cccee9f5d8113fc090447029868100";

const MOCK_RESPONSE_SUCCESS = {
  _embedded: {
    records: [
      {
        wasm: DATA_1_WASM,
        operation: "227446955302756353",
        ts: 1723229176,
        paging_token: "QAAFc6L7rBFmtmP4sR29zonmvo1CGoMyKAaUl8HFDSg=",
      },
      {
        wasm: DATA_2_WASM,
        operation: "227453183007010817",
        ts: 1723237638,
        paging_token: "QAAFcwwp/lNmtoUG/cXZIFfMzun12BE/wJBEcCmGgQA=",
      },
    ],
  },
};
