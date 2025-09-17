import { expect, test } from "@playwright/test";
import {
  TX_ST_CHANGE_DOMAIN_SET,
  TX_ST_CHANGE_KALE_PLANT,
} from "./mock/txStateChange";
import { TX_DASH_CLASSIC } from "./mock/txDash";
import { mockRpcRequest } from "./mock/helpers";

test.describe("Transaction Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/transaction-dashboard");
  });

  test("Loads", async ({ page }) => {
    await page.waitForSelector("h1", { timeout: 5000 });
    await expect(page.locator("h1")).toHaveText("Transaction Dashboard");
  });

  test("Soroban transaction info", async ({ page }) => {
    // Fill transaction hash input
    const loadButton = page.getByRole("button", { name: "Load transaction" });

    await expect(loadButton).toBeDisabled();
    await page
      .getByLabel("Transaction Hash")
      .fill(TX_ST_CHANGE_DOMAIN_SET.result.txHash);

    await expect(loadButton).toBeEnabled();

    // Mock the RPC call for getting the contract type
    await mockRpcRequest({
      page,
      rpcMethod: "getTransaction",
      bodyJsonResponse: TX_ST_CHANGE_DOMAIN_SET,
    });

    await loadButton.click();

    // Badges
    await expect(
      page.getByTestId("transaction-info-badges").locator(".Badge"),
    ).toHaveText(["Soroban Transaction"]);

    // Info
    const infoContainer = page.getByTestId("transaction-info-container");

    // Info labels
    await expect(infoContainer.locator(".InfoFieldItem__label")).toHaveText([
      "Status",
      "Transaction Info",
      "Source Account",
      "Sequence Number",
      "Processed",
      "Max Fee",
      "Transaction Fee",
    ]);

    // Info data
    await assertInfoItem(infoContainer, "Status", "Success");
    await assertInfoItem(
      infoContainer,
      "Transaction Info",
      "2ddb68eb58bfac410a6bcbafa4e409321bd147cc05a0e4e820b69639df2abf49",
    );
    await assertInfoItem(
      infoContainer,
      "Source Account",
      "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
    );
    await assertInfoItem(
      infoContainer,
      "Sequence Number",
      "245643245676134560",
    );
    await assertInfoItem(
      infoContainer,
      "Processed",
      "Wed, Jun 25, 2025, 20:45:23 UTC",
    );
    await assertInfoItem(
      infoContainer,
      "Max Fee",
      "1.5499079 XLM 15,499,079 stroops",
    );
    await assertInfoItem(
      infoContainer,
      "Transaction Fee",
      "0.4763796 XLM 4,763,796 stroops",
    );
  });

  test("Soroban fee bump transaction info", async ({ page }) => {
    // Fill transaction hash input
    const loadButton = page.getByRole("button", { name: "Load transaction" });

    await expect(loadButton).toBeDisabled();
    await page
      .getByLabel("Transaction Hash")
      .fill(TX_ST_CHANGE_KALE_PLANT.result.txHash);

    await expect(loadButton).toBeEnabled();

    // Mock the RPC call for getting the contract type
    await mockRpcRequest({
      page,
      rpcMethod: "getTransaction",
      bodyJsonResponse: TX_ST_CHANGE_KALE_PLANT,
    });

    await loadButton.click();

    // Badges
    await expect(
      page.getByTestId("transaction-info-badges").locator(".Badge"),
    ).toHaveText(["Soroban Transaction", "Fee Bump Transaction"]);

    // Info
    const infoContainer = page.getByTestId("transaction-info-container");

    // Info labels
    await expect(infoContainer.locator(".InfoFieldItem__label")).toHaveText([
      "Status",
      "Transaction Info",
      "Source Account",
      "Sequence Number",
      "Processed",
      "Max Fee",
      "Transaction Fee",
      "Fee Source Account",
    ]);

    // Info data
    await assertInfoItem(infoContainer, "Status", "Success");
    await assertInfoItem(
      infoContainer,
      "Transaction Info",
      "240a89f6a1cb904c87af1d9ea14dab31cacafb69cd2681e751c21493d2abe390",
    );
    await assertInfoItem(
      infoContainer,
      "Source Account",
      "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
    );
    await assertInfoItem(
      infoContainer,
      "Sequence Number",
      "248178152554106800",
    );
    await assertInfoItem(
      infoContainer,
      "Processed",
      "Tue, Jul 8, 2025, 14:10:23 UTC",
    );
    await assertInfoItem(
      infoContainer,
      "Max Fee",
      "0.0298012 XLM 298,012 stroops",
    );
    await assertInfoItem(
      infoContainer,
      "Transaction Fee",
      "0.0226598 XLM 226,598 stroops",
    );
    await assertInfoItem(
      infoContainer,
      "Fee Source Account",
      "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
    );
  });

  test("Classic transaction info", async ({ page }) => {
    // Fill transaction hash input
    const loadButton = page.getByRole("button", { name: "Load transaction" });

    await expect(loadButton).toBeDisabled();
    await page
      .getByLabel("Transaction Hash")
      .fill(TX_DASH_CLASSIC.result.txHash);

    await expect(loadButton).toBeEnabled();

    // Mock the RPC call for getting the contract type
    await mockRpcRequest({
      page,
      rpcMethod: "getTransaction",
      bodyJsonResponse: TX_DASH_CLASSIC,
    });

    await loadButton.click();

    // Badges
    await expect(
      page.getByTestId("transaction-info-badges").locator(".Badge"),
    ).toHaveText(["Classic Transaction"]);

    // Info
    const infoContainer = page.getByTestId("transaction-info-container");

    // Info labels
    await expect(infoContainer.locator(".InfoFieldItem__label")).toHaveText([
      "Status",
      "Transaction Info",
      "Source Account",
      "Sequence Number",
      "Processed",
      "Operations",
      "Memo",
      "Max Fee",
      "Transaction Fee",
    ]);

    // Info data
    await assertInfoItem(infoContainer, "Status", "Success");
    await assertInfoItem(
      infoContainer,
      "Transaction Info",
      "c724819cd33b9a57d60e26e760aa1cd152ea1612f1860c9e5c9708070799c970",
    );
    await assertInfoItem(
      infoContainer,
      "Source Account",
      "GCMN6GO36KGLJXGLRBCD5CWO25ZXKWMVXKAOZFIPMPRT3BDVJP5QGOHL",
    );
    await assertInfoItem(
      infoContainer,
      "Sequence Number",
      "161395112819909083",
    );
    await assertInfoItem(
      infoContainer,
      "Processed",
      "Wed, Sep 17, 2025, 17:29:08 UTC",
    );
    await assertInfoItem(infoContainer, "Operations", "1");
    await assertInfoItem(infoContainer, "Memo", "none");
    await assertInfoItem(infoContainer, "Max Fee", "0.0000101 XLM 101 stroops");
    await assertInfoItem(
      infoContainer,
      "Transaction Fee",
      "0.00001 XLM 100 stroops",
    );
  });

  test("Could not find transaction view", async ({ page }) => {
    const loadButton = page.getByRole("button", { name: "Load transaction" });

    await page
      .getByLabel("Transaction Hash")
      .fill(TX_ST_CHANGE_KALE_PLANT.result.txHash);

    await expect(loadButton).toBeEnabled();
    await loadButton.click();

    const txInfoContainer = page.locator(".TransactionInfo");
    await expect(txInfoContainer.locator(".NoInfoLoadedView")).toHaveText(
      "Couldn’t find that transaction. Please make sure you’re using the correct network, or the transaction is within the retention window of the RPC.",
    );
  });
});

// =============================================================================
// Helpers
// =============================================================================
const assertInfoItem = async (
  infoContainer: any,
  itemLabel: string,
  itemValue: string,
) => {
  await expect(
    infoContainer
      .locator(".InfoFieldItem__label")
      .getByText(itemLabel, { exact: true })
      .locator("+ .InfoFieldItem__value"),
  ).toHaveText(itemValue);
};
