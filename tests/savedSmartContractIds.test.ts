import { expect, Page, test } from "@playwright/test";
import { MOCK_LOCAL_STORAGE, SAVED_CONTRACT_1 } from "./mock/localStorage";

test.describe("Saved Smart Contract IDs Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/smart-contracts/saved");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Saved Smart Contract IDs");
  });

  test("Show no saved smart contract IDs message", async ({ page }) => {
    await expect(
      page.getByText(
        "There are no saved smart contract IDs on Testnet network.",
      ),
    ).toBeVisible();
  });
});

test.describe("Saved contract IDs", () => {
  // Setting page context to share among all the tests in this section to keep
  // local storage data
  let pageContext: Page;

  test.beforeAll(async ({ browser }) => {
    const browserContext = await browser.newContext({
      storageState: MOCK_LOCAL_STORAGE,
    });
    pageContext = await browserContext.newPage();

    await pageContext.goto("http://localhost:3000/smart-contracts/saved");
  });

  test("Loads", async () => {
    await expect(
      pageContext.getByText(
        "There are no saved smart contract IDs on Testnet network.",
      ),
    ).toBeHidden();

    const contractItems = pageContext.getByTestId("saved-contract-item");
    await expect(contractItems).toHaveCount(2);
  });

  test("Saved item", async () => {
    const contractItem = pageContext.getByTestId("saved-contract-item").first();

    await expect(contractItem).toBeVisible();
    await expect(contractItem.getByTestId("saved-contract-name")).toHaveValue(
      "Contract 1",
    );
    await expect(contractItem.getByTestId("saved-contract-id")).toHaveValue(
      SAVED_CONTRACT_1,
    );
    await expect(
      contractItem.getByText("Last saved May 7, 2025, 5:08 PM UTC", {
        exact: true,
      }),
    ).toBeVisible();
  });

  test("Delete item", async () => {
    const contractItem = pageContext.getByTestId("saved-contract-item").first();
    const deleteButton = contractItem.locator(".Button--error");

    await deleteButton.click();

    const contractItems = pageContext.getByTestId("saved-contract-item");
    await expect(contractItems).toHaveCount(1);
  });
});
