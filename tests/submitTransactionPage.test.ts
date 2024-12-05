import { test, expect, Page } from "@playwright/test";

test.describe("Submit Transaction Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/transaction/submit");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Submit Transaction");
  });

  test.describe("Invalid XDR Flow", () => {
    test("display an error with a random text", async ({ page }) => {
      const invalidXdrMsg = page.getByText(
        "Unable to decode input as TransactionEnvelope",
      );
      const xdrInput = page.getByLabel(
        "Input a base-64 encoded TransactionEnvelope",
      );
      await xdrInput.fill("ssdfsdf");
      await expect(invalidXdrMsg).toBeVisible();

      // Submit, Simulate, and Save TX buttons to be disabled
      for (const btn of await page
        .getByRole("button", { name: /transaction/i })
        .all())
        await btn.isDisabled();
    });

    test("display an error with a valid XDR that is not TX Envelope", async ({
      page,
    }) => {
      const invalidXdrMsg = page.getByText(
        "Unable to decode input as TransactionEnvelope",
      );
      const xdrInput = page.getByLabel(
        "Input a base-64 encoded TransactionEnvelope",
      );
      await xdrInput.fill(MOCK_SC_VAL_XDR);
      await expect(invalidXdrMsg).toBeVisible();

      // Submit, Simulate, and Save TX buttons to be disabled
      for (const btn of await page
        .getByRole("button", { name: /transaction/i })
        .all())
        await btn.isDisabled();
    });
  });

  test.describe("Valid XDR with a Failed 400 Submission Flow", () => {
    test("Submit via Horizon", async ({ page }) => {
      const xdrInput = page.getByLabel(
        "Input a base-64 encoded TransactionEnvelope",
      );
      const validationCard = page.locator(".ValidationResponseCard");

      await xdrInput.fill(MOCK_VALID_TX_XDR.XDR);

      // Submit, Simulate, and Save TX buttons to be disabled
      for (const btn of await page
        .getByRole("button", { name: /transaction/i })
        .all())
        await btn.isEnabled();

      await expect(page.getByLabel("Transaction hash")).toBeVisible;

      await testSuccessHashAndJson({
        page,
        hash: MOCK_VALID_TX_XDR.hash,
        json: MOCK_VALID_TX_XDR.JSON,
      });

      const submitMethodsDropdown = page.getByTestId(
        "submit-tx-methods-dropdown",
      );

      await submitMethodsDropdown.isVisible();

      const methods = await submitMethodsDropdown
        .locator(".SubmitTx__floater__item__title")
        .allTextContents();

      expect(methods).toEqual(["via RPC", "via Horizon"]);

      await page
        .locator(".SubmitTx__buttons")
        .getByRole("button", { name: /via/i })
        .click();

      await submitMethodsDropdown.getByText("via Horizon").click();

      const submitTxBtn = page.getByRole("button", {
        name: "Submit transaction",
      });

      // Mock the horizon submission api call
      await page.route("*/**/transactions", async (route) => {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify(MOCK_TX_XDR_FAILED_HORIZON_RESPONSE),
        });
      });

      const responsePromise = page.waitForResponse((response) => {
        if (response.url().includes("/transactions")) {
        }
        return (
          response.url().includes("/transactions") && response.status() === 400
        );
      });

      await submitTxBtn.click();

      await responsePromise;

      await validationCard.isVisible();

      await validationCard.getByText("Transaction failed!").isVisible();
      await validationCard
        .getByText("Request failed with status code 400!")
        .isVisible();

      const txResponseError = validationCard.getByTestId(
        "submit-tx-horizon-error-extras",
      );
      await txResponseError.locator(".TxResponse__value").isVisible;

      await expect(
        txResponseError.locator(".TxResponse__value").nth(0),
      ).toHaveText(
        `{"transaction":"tx_failed","operations":["op_no_destination"]}`,
      );
      await expect(
        txResponseError.locator(".TxResponse__value").nth(1),
      ).toHaveText("AAAAAAAAAGT/////AAAAAQAAAAAAAAAB////+wAAAAA=");
    });

    test("Submit via RPC", async ({ page }) => {
      const xdrInput = page.getByLabel(
        "Input a base-64 encoded TransactionEnvelope",
      );
      const errorValidationCard = page.getByTestId("submit-tx-rpc-error");

      await xdrInput.fill(MOCK_VALID_TX_XDR.XDR);

      // Submit, Simulate, and Save TX buttons to be disabled
      for (const btn of await page
        .getByRole("button", { name: /transaction/i })
        .all())
        await btn.isEnabled();

      await expect(page.getByLabel("Transaction hash")).toBeVisible;

      await testSuccessHashAndJson({
        page,
        hash: MOCK_VALID_TX_XDR.hash,
        json: MOCK_VALID_TX_XDR.JSON,
      });

      const submitMethodsDropdown = page.getByTestId(
        "submit-tx-methods-dropdown",
      );

      await submitMethodsDropdown.isVisible();

      const methods = await submitMethodsDropdown
        .locator(".SubmitTx__floater__item__title")
        .allTextContents();

      expect(methods).toEqual(["via RPC", "via Horizon"]);

      await page
        .locator(".SubmitTx__buttons")
        .getByRole("button", { name: /via/i })
        .click();

      await submitMethodsDropdown.getByText("via RPC").click();

      const submitTxBtn = page.getByRole("button", {
        name: "Submit transaction",
      });

      // Mock the horizon submission api call
      await page.route("**", async (route) => {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify(MOCK_TX_XDR_FAILED_RPC_RESPONSE),
        });
      });

      page.on("request", (request) => console.log("Request:", request.url()));
      page.on("response", (response) =>
        console.log("Response:", response.url(), response.status()),
      );

      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes("soroban") && response.status() === 400,
      );

      await submitTxBtn.click();

      await responsePromise;

      await errorValidationCard.isVisible();

      await errorValidationCard.getByText("Transaction failed!").isVisible();

      await errorValidationCard.locator(".TxResponse__value").isVisible;

      const test = await errorValidationCard
        .locator(".TxResponse__value")
        .textContent();

      console.log("test: ", test);
      //   await expect(
      //     errorValidationCard.locator(".TxResponse__value"),
      //   ).toContainText('Error result: { "status": "ERROR"');

      //   const txResponseError = validationCard.getByTestId(
      //     "submit-tx-horizon-error-extras",
      //   );
      //   await txResponseError.locator(".TxResponse__value").isVisible;

      //   await expect(
      //     txResponseError.locator(".TxResponse__value").nth(0),
      //   ).toHaveText(
      //     `{"transaction":"tx_failed","operations":["op_no_destination"]}`,
      //   );
      //   await expect(
      //     txResponseError.locator(".TxResponse__value").nth(1),
      //   ).toHaveText("AAAAAAAAAGT/////AAAAAQAAAAAAAAAB////+wAAAAA=");
    });
  });
});

const testSuccessHashAndJson = async ({
  page,
  hash,
  json,
}: {
  page: Page;
  hash: string;
  json: string;
}) => {
  const txJsonFlow = page.getByTestId("submit-tx-envelope-json");
  await expect(page.getByLabel("Transaction hash")).toHaveValue(hash);
  await expect(
    txJsonFlow.getByText("Transaction Envelope").locator("+ div"),
  ).toHaveText(json);
};

// // =============================================================================
// // Mock data
// // =============================================================================

const MOCK_SC_VAL_XDR =
  "AAAAEQAAAAEAAAAGAAAADwAAAAZhbW91bnQAAAAAAAoAAAAAAAAAAAAACRhOcqAAAAAADwAAAAxib290c3RyYXBwZXIAAAASAAAAARssFqxD/prgmYc9vGkaqslWrGlPINzMYTLc4yqRfO3AAAAADwAAAAxjbG9zZV9sZWRnZXIAAAADAz6ilAAAAA8AAAAIcGFpcl9taW4AAAAKAAAAAAAAAAAAAAARdlkuAAAAAA8AAAAEcG9vbAAAABIAAAABX/a7xfliM8nFgGel6pbCM6fT/kqrHAITNtWZQXgDlIIAAAAPAAAAC3Rva2VuX2luZGV4AAAAAAMAAAAA";

const MOCK_VALID_TX_XDR = {
  XDR: "AAAAAgAAAADJrq4b4AopDZibkeBWpDxuWKUcY4FUUNQdIEF3Nm9dkQAAAGQAAAIiAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAACXlGN76T6NQcaUJxbEkH3mi1HHWsHnLqMDdlLl9NlJgQAAAAAAAAAABfXhAAAAAAAAAAAA",
  JSON: `{"tx":{2 items"tx":{7 items"source_account":"GDE25LQ34AFCSDMYTOI6AVVEHRXFRJI4MOAVIUGUDUQEC5ZWN5OZDLAZ","fee":100,"seq_num":2345052143617,"cond":{1 item"time":{2 items"min_time":0,"max_time":0,},},"memo":"none","operations":[1 item{2 items"source_account":null,"body":{1 item"payment":{3 items"destination":"GCLZIY335E7I2QOGSQTRNREQPXTIWUOHLLA6OLVDAN3FFZPU3FEYDA3D","asset":"native","amount":10.0 (raw: 100000000),},},},],"ext":"v0",},"signatures":[],},}`,
  hash: "794e2073e130dc09d2b7e8b147b51f6ef75ff171c83c603bc8ab4cffa3f341a1",
};

const MOCK_TX_XDR_FAILED_HORIZON_RESPONSE = {
  type: "https://stellar.org/horizon-errors/transaction_failed",
  title: "Transaction Failed",
  status: 400,
  detail:
    "The transaction failed when submitted to the stellar network. The `extras.result_codes` field on this response contains further details.  Descriptions of each code can be found at: https://developers.stellar.org/api/errors/http-status-codes/horizon-specific/transaction-failed/",
  extras: {
    envelope_xdr:
      "AAAAAgAAAADJrq4b4AopDZibkeBWpDxuWKUcY4FUUNQdIEF3Nm9dkQAAAGQAAAIiAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAACXlGN76T6NQcaUJxbEkH3mi1HHWsHnLqMDdlLl9NlJgQAAAAAAAAAABfXhAAAAAAAAAAAA",
    result_codes: {
      transaction: "tx_failed",
      operations: ["op_no_destination"],
    },
    result_xdr: "AAAAAAAAAGT/////AAAAAQAAAAAAAAAB////+wAAAAA=",
  },
};

const MOCK_TX_XDR_FAILED_RPC_RESPONSE = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    errorResultXdr: "AAAAAAAAAGT////7AAAAAA==",
    status: "ERROR",
    hash: "794e2073e130dc09d2b7e8b147b51f6ef75ff171c83c603bc8ab4cffa3f341a1",
    latestLedger: 1305084,
    latestLedgerCloseTime: "1733355115",
  },
};
// const MOCK_TX_XDR_3_OPERATIONS =
//   "AAAAAgAAAABnAj9Nl60oxvi+eJSta3cdY/V2PkpDL69joQGRY+Mx3AAAASwAECzEAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAEAAAAABHLXc6lPRFz7BJua75KzEQi1Iw3Hj6bUXLrNdMRPZmYwAAAAAAAAAAAAAAAEctdzqU9EXPsEm5rvkrMRCLUjDcePptRcus10xE9mZjAAAAAAExLQAAAAAAAAAAEQAAAAAAAAAA";
