import { STELLAR_EXPERT } from "@/constants/settings";
import { test, expect, Page } from "@playwright/test";

test.describe("Submit Transaction Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/transaction/submit");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Submit Transaction");
  });

  test("Save Transaction Flow", async ({ page }) => {
    const xdrInput = page.getByLabel(
      "Input a base-64 encoded TransactionEnvelope",
    );

    const saveTxBtn = page.getByRole("button", {
      name: "Save transaction",
    });

    // Check if the button is disabled by default
    await expect(saveTxBtn).toBeDisabled();

    // Input the XDR
    await xdrInput.fill(MOCK_VALID_SUCCESS_TX_XDR.XDR);

    // Check if the button is enabled after a successful XDR input
    await expect(saveTxBtn).toBeEnabled();

    await saveTxBtn.click();

    const modal = page.locator(".Modal");

    // Save TX Modal to appear
    await expect(modal).toBeVisible();
    await expect(page.locator(".ModalHeading")).toHaveText("Save Transaction");

    await modal.getByLabel("Name", { exact: true }).fill("Transaction 1");
    await modal.getByText("Save", { exact: true }).click();

    await expect(modal).toBeHidden();
  });

  test("Simulate Transaction Flow", async ({ page }) => {
    const xdrInput = page.getByLabel(
      "Input a base-64 encoded TransactionEnvelope",
    );

    const simulateTxBtn = page.getByRole("button", {
      name: "Simulate transaction",
    });

    // Simulate Transaction button should be disabled by default
    await expect(simulateTxBtn).toBeDisabled();

    await xdrInput.fill(MOCK_VALID_SUCCESS_TX_XDR.XDR);

    await expect(simulateTxBtn).toBeEnabled();

    await simulateTxBtn.click();

    await page.waitForURL(/\/transaction\/simulate\?/);

    await expect(page.locator("h1")).toHaveText("Simulate Transaction");

    await expect(
      page.getByLabel("Input a base-64 encoded TransactionEnvelope"),
    ).toHaveValue(MOCK_VALID_SUCCESS_TX_XDR.XDR);
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

      await testButtonState({ page, isDisabledExpected: true });
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
      await testButtonState({ page, isDisabledExpected: true });
    });
  });

  test.describe("Valid XDR with a Failed 400 Submission Flow", () => {
    test("Submit via Horizon", async ({ page }) => {
      const xdrInput = page.getByLabel(
        "Input a base-64 encoded TransactionEnvelope",
      );
      const validationCard = page.locator(".ValidationResponseCard");

      // Submit, Simulate, and Save TX buttons to be disabled by default
      await testButtonState({ page, isDisabledExpected: true });

      await xdrInput.fill(MOCK_VALID_FAILED_TX_XDR.XDR);

      // Submit, Simulate, and Save TX buttons to be enabled
      await testButtonState({ page });

      expect(page.getByLabel("Transaction hash")).toBeVisible;

      await testSuccessHashAndJson({
        page,
        hash: MOCK_VALID_FAILED_TX_XDR.hash,
        json: MOCK_VALID_FAILED_TX_XDR.JSON,
      });

      const submitMethodsDropdown = page.getByTestId(
        "submit-tx-methods-dropdown",
      );

      await page
        .locator(".SubmitTx__buttons")
        .getByRole("button", { name: /via/i })
        .click();

      await expect(submitMethodsDropdown).toBeVisible();

      const methods = await submitMethodsDropdown
        .locator(".SubmitTx__floater__item__title")
        .allTextContents();

      expect(methods).toEqual(["via RPC", "via Horizon"]);

      await submitMethodsDropdown.getByText("via Horizon").click();

      const submitTxBtn = page.getByRole("button", {
        name: "Submit transaction",
      });

      // Mock the horizon submission api call
      await page.route("*/**/transactions", async (route) => {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify(MOCK_FAILED_TX_HORIZON_RESPONSE),
        });
      });

      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes("/transactions") && response.status() === 400,
      );

      await submitTxBtn.click();

      await responsePromise;

      await expect(validationCard).toBeVisible();

      await expect(
        validationCard.getByText("Transaction failed!"),
      ).toBeVisible();

      await expect(
        validationCard.getByText("Request failed with status code 400"),
      ).toBeVisible();

      const txResponseError = validationCard.getByTestId(
        "submit-tx-horizon-error-extras",
      );
      expect(txResponseError.locator(".TxResponse__value")).toBeVisible;
    });

    test("Submit via RPC", async ({ page }) => {
      const xdrInput = page.getByLabel(
        "Input a base-64 encoded TransactionEnvelope",
      );
      const validationCard = page.locator(".ValidationResponseCard");
      const errorValidationCard = page.getByTestId("submit-tx-rpc-error");

      // Submit, Simulate, and Save TX buttons to be disabled by default
      await testButtonState({ page, isDisabledExpected: true });

      await xdrInput.fill(MOCK_VALID_FAILED_TX_XDR.XDR);

      // Submit, Simulate, and Save TX buttons to be enabled
      await testButtonState({ page });

      expect(page.getByLabel("Transaction hash")).toBeVisible;

      await testSuccessHashAndJson({
        page,
        hash: MOCK_VALID_FAILED_TX_XDR.hash,
        json: MOCK_VALID_FAILED_TX_XDR.JSON,
      });

      const submitMethodsBtn = page
        .locator(".SubmitTx__buttons")
        .getByRole("button", { name: /via/i });

      const submitMethodsDropdown = page.getByTestId(
        "submit-tx-methods-dropdown",
      );

      await submitMethodsBtn.click();
      await expect(submitMethodsDropdown).toBeVisible();

      const methods = await submitMethodsDropdown
        .locator(".SubmitTx__floater__item__title")
        .allTextContents();

      expect(methods).toEqual(["via RPC", "via Horizon"]);

      await submitMethodsDropdown.getByText("via RPC").click();

      const submitTxBtn = page.getByRole("button", {
        name: "Submit transaction",
      });

      // Mock the rpc submission api call
      await page.route("https://soroban-testnet.stellar.org", async (route) => {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify(MOCK_TX_XDR_FAILED_RPC_RESPONSE),
        });
      });

      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes("soroban") && response.status() === 400,
      );

      await submitTxBtn.click();

      await responsePromise;

      await expect(errorValidationCard).toBeVisible();

      await expect(
        validationCard.getByText("Transaction failed"),
      ).toBeVisible();

      await expect(
        errorValidationCard.locator(".TxResponse__value"),
      ).toBeVisible();
    });
  });

  test.describe("Valid XDR with a Successful Submission Flow", () => {
    test("Submit via Horizon", async ({ page }) => {
      const xdrInput = page.getByLabel(
        "Input a base-64 encoded TransactionEnvelope",
      );
      const validationCard = page.locator(".ValidationResponseCard");
      const submitTxBtn = page.getByRole("button", {
        name: "Submit transaction",
      });

      // Submit, Simulate, and Save TX buttons to be disabled by default
      await testButtonState({ page, isDisabledExpected: true });
      await xdrInput.fill(MOCK_VALID_SUCCESS_TX_XDR.XDR);

      // Submit, Simulate, and Save TX buttons to be enabled
      await testButtonState({ page });

      expect(page.getByLabel("Transaction hash")).toBeVisible;

      await testSuccessHashAndJson({
        page,
        hash: MOCK_VALID_SUCCESS_TX_XDR.hash,
        json: MOCK_VALID_SUCCESS_TX_XDR.JSON,
      });

      const submitMethodsBtn = page
        .locator(".SubmitTx__buttons")
        .getByRole("button", { name: /via/i });

      const submitMethodsDropdown = page.getByTestId(
        "submit-tx-methods-dropdown",
      );

      await submitMethodsBtn.click();
      await expect(submitMethodsDropdown).toBeVisible();

      const methods = await submitMethodsDropdown
        .locator(".SubmitTx__floater__item__title")
        .allTextContents();

      expect(methods).toEqual(["via RPC", "via Horizon"]);

      await submitMethodsDropdown.getByText("via Horizon").click();

      await expect(submitTxBtn).toBeEnabled();

      // Mock the horizon submission api call
      await page.route("*/**/transactions", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            hash: MOCK_VALID_TX_SUCCESS_HORIZON_RESPONSE.hash,
            ledger: MOCK_VALID_TX_SUCCESS_HORIZON_RESPONSE.ledger,
            envelope_xdr: MOCK_VALID_TX_SUCCESS_HORIZON_RESPONSE.envelope_xdr,
            fee_charged: MOCK_VALID_TX_SUCCESS_HORIZON_RESPONSE.fee_charged,
            result_xdr: MOCK_VALID_TX_SUCCESS_HORIZON_RESPONSE.result_xdr,
          }),
        });
      });

      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes("/transactions") && response.status() === 200,
      );

      await submitTxBtn.click();

      await responsePromise;

      await expect(validationCard).toBeVisible();

      await expect(
        validationCard.getByText("Transaction submitted!"),
      ).toBeVisible();

      // Check the links of stellar blockchain explorer - stellar.expert and stellarchain
      await testBlockExplorerLink({
        page,
        hash: MOCK_VALID_TX_SUCCESS_HORIZON_RESPONSE.hash,
      });
    });

    test("Submit via RPC", async ({ page }) => {
      const xdrInput = page.getByLabel(
        "Input a base-64 encoded TransactionEnvelope",
      );
      const submitTxBtn = page.getByRole("button", {
        name: "Submit transaction",
      });
      const validationCard = page.locator(".ValidationResponseCard");

      // Submit, Simulate, and Save TX buttons to be disabled by default
      await testButtonState({ page, isDisabledExpected: true });

      await xdrInput.fill(MOCK_VALID_SUCCESS_TX_XDR_RPC.XDR);

      // Submit, Simulate, and Save TX buttons to be enabled
      await testButtonState({ page });

      expect(page.getByLabel("Transaction hash")).toBeVisible;

      await testSuccessHashAndJson({
        page,
        hash: MOCK_VALID_SUCCESS_TX_XDR_RPC.hash,
        json: MOCK_VALID_SUCCESS_TX_XDR_RPC.JSON,
      });

      const submitMethodsBtn = page
        .locator(".SubmitTx__buttons")
        .getByRole("button", { name: /via/i });

      const submitMethodsDropdown = page.getByTestId(
        "submit-tx-methods-dropdown",
      );

      await submitMethodsBtn.click();
      await expect(submitMethodsDropdown).toBeVisible();

      const methods = await submitMethodsDropdown
        .locator(".SubmitTx__floater__item__title")
        .allTextContents();

      expect(methods).toEqual(["via RPC", "via Horizon"]);

      await submitMethodsDropdown.getByText("via RPC").click();

      await expect(submitTxBtn).toBeEnabled();

      // Mock the horizon submission api call
      await page.route("https://soroban-testnet.stellar.org", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            result: {
              status: "SUCCESS",
            },
          }),
        });
      });

      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes("soroban-testnet") &&
          response.status() === 200,
      );

      await submitTxBtn.click();

      await responsePromise;

      await expect(validationCard).toBeVisible();

      // Omitting the API end result because the test gives inconsistenet results
    });
  });

  test.describe("Update default submit method to RPC when it is a Soroban XDR", () => {
    test("Submit Soroban", async ({ page }) => {
      const xdrInput = page.getByLabel(
        "Input a base-64 encoded TransactionEnvelope",
      );

      // Input the Soroban XDR
      await xdrInput.fill(MOCK_VALID_SOROBAN_TX_XDR.XDR);

      const submitMethodsBtn = page
        .locator(".SubmitTx__buttons")
        .getByRole("button", { name: /via/i });

      await expect(submitMethodsBtn).toBeVisible();

      // Check if the submit method button shows RPC as default
      await expect(submitMethodsBtn).toHaveText("via RPC");
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

const testButtonState = async ({
  page,
  isDisabledExpected,
}: {
  page: Page;
  isDisabledExpected?: boolean;
}) => {
  const submitTxBtn = page.getByRole("button", {
    name: "Submit transaction",
  });

  const simulateTxBtn = page.getByRole("button", {
    name: "Simulate transaction",
  });

  const saveTxBtn = page.getByRole("button", {
    name: "Save transaction",
  });

  for (const btn of [submitTxBtn, simulateTxBtn, saveTxBtn])
    if (isDisabledExpected) {
      await expect(btn).toBeDisabled();
    } else {
      await expect(btn).toBeEnabled();
    }
};

const testBlockExplorerLink = async ({
  page,
  hash,
}: {
  page: Page;
  hash: string;
}) => {
  const network = await page
    .getByTestId("networkSelector-button")
    .textContent();

  const validationCard = page.locator(".ValidationResponseCard");
  const stellarExpertLink = validationCard.getByRole("button", {
    name: "View on stellar.expert",
  });
  const stellarChainLink = validationCard.getByRole("button", {
    name: "View on stellarchain.io",
  });

  const [stellarExpertPage] = await Promise.all([
    page.context().waitForEvent("page"), // Wait for the new tab
    stellarExpertLink.click(), // Trigger the new tab
  ]);

  // Wait for the new StellarExpert tab to load
  await stellarExpertPage.waitForLoadState();

  // Get the URL of the new tab
  const newTabUrl = stellarExpertPage.url();

  // Assert the StellarExpert URL
  expect(newTabUrl).toBe(
    `${STELLAR_EXPERT}/${network?.toLowerCase()}/tx/${hash}`,
  );

  const [stellarChainPage] = await Promise.all([
    page.context().waitForEvent("page"), // Wait for the new tab
    stellarChainLink.click(), // Trigger the new tab
  ]);

  // Wait for the new Stellar Chain tab to load
  await stellarChainPage.waitForLoadState();

  // Get the URL of the new tab
  const newTabUrl2 = stellarChainPage.url();

  // Assert the StellarChain URL
  expect(newTabUrl2).toBe(
    `https://${network?.toLowerCase()}.stellarchain.io/transactions/${hash}`,
  );
};

// // =============================================================================
// // Mock data
// // =============================================================================
const MOCK_SC_VAL_XDR =
  "AAAAEQAAAAEAAAAGAAAADwAAAAZhbW91bnQAAAAAAAoAAAAAAAAAAAAACRhOcqAAAAAADwAAAAxib290c3RyYXBwZXIAAAASAAAAARssFqxD/prgmYc9vGkaqslWrGlPINzMYTLc4yqRfO3AAAAADwAAAAxjbG9zZV9sZWRnZXIAAAADAz6ilAAAAA8AAAAIcGFpcl9taW4AAAAKAAAAAAAAAAAAAAARdlkuAAAAAA8AAAAEcG9vbAAAABIAAAABX/a7xfliM8nFgGel6pbCM6fT/kqrHAITNtWZQXgDlIIAAAAPAAAAC3Rva2VuX2luZGV4AAAAAAMAAAAA";

const MOCK_VALID_FAILED_TX_XDR = {
  XDR: "AAAAAgAAAADJrq4b4AopDZibkeBWpDxuWKUcY4FUUNQdIEF3Nm9dkQAAAGQAAAIiAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAACXlGN76T6NQcaUJxbEkH3mi1HHWsHnLqMDdlLl9NlJgQAAAAAAAAAABfXhAAAAAAAAAAAA",
  JSON: `{"tx":{2 items"tx":{7 items"source_account":"GDE25LQ34AFCSDMYTOI6AVVEHRXFRJI4MOAVIUGUDUQEC5ZWN5OZDLAZ","fee":100,"seq_num":2345052143617,"cond":{1 item"time":{2 items"min_time":0,"max_time":0,},},"memo":"none","operations":[1 item{2 items"source_account":null,"body":{1 item"payment":{3 items"destination":"GCLZIY335E7I2QOGSQTRNREQPXTIWUOHLLA6OLVDAN3FFZPU3FEYDA3D","asset":"native","amount":10.0 (raw: 100000000),},},},],"ext":"v0",},"signatures":[],},}`,
  hash: "794e2073e130dc09d2b7e8b147b51f6ef75ff171c83c603bc8ab4cffa3f341a1",
};

const MOCK_VALID_SUCCESS_TX_XDR = {
  XDR: "AAAAAgAAAABua+HUFN6zjqIQaw+w+xQgEmGB7deJ7fGT6bez/oKDzwAAAGQAAY/PAAAABwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAAAkykrlZ6vjTMpbViATGt20liShZWOSoGzFDkcPC9C5KgAAAAAAAAAAAvrwgAAAAAAAAAAB/oKDzwAAAEDSDO1Dz8nPdSj4LJxs8vKVCTgYczDVk3+bwjDcxN7KMtrTlPllYsXSdfVCWDa02IhlZi9WuycvGjoouDu0YxYP",
  JSON: `{"tx":{2 items"tx":{7 items"source_account":"GBXGXYOUCTPLHDVCCBVQ7MH3CQQBEYMB5XLYT3PRSPU3PM76QKB47XJQ","fee":100,"seq_num":439594197712903,"cond":{1 item"time":{2 items"min_time":0,"max_time":0,},},"memo":"none","operations":[1 item{2 items"source_account":null,"body":{1 item"payment":{3 items"destination":"GASMUSXFM6V6GTGKLNLCAEY23W2JMJFBMVRZFIDMYUHEODYL2C4SVKUP","asset":"native","amount":5.0 (raw: 50000000),},},},],"ext":"v0",},"signatures":[1 item· Signatures Checked{2 items"hint":"G----------------------------------------------6QKB4----","signature":"d20ced43cfc9cf7528f82c9c6cf2f2950938187330d5937f9bc230dcc4deca32dad394f96562c5d275f5425836b4d88865662f56bb272f1a3a28b83bb463160f",},],},}`,
  hash: "1d2e5940dc4c7bad304291a0f399e0bcd69461d197fef7df16852f0d25999fdc",
};

const MOCK_VALID_SUCCESS_TX_XDR_RPC = {
  XDR: "AAAAAgAAAABua+HUFN6zjqIQaw+w+xQgEmGB7deJ7fGT6bez/oKDzwAAAGQAAY/PAAAACQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAAAkykrlZ6vjTMpbViATGt20liShZWOSoGzFDkcPC9C5KgAAAAAAAAAAAvrwgAAAAAAAAAAB/oKDzwAAAEDo5iGuMU5bhYmLZsfb13hnwPvXnO9VwMQvuoHKcPiIB3u5aa/1zfgm/hzFYY+g66LbgkXoOKcCCvVj708iwTgJ",
  JSON: `{"tx":{2 items"tx":{7 items"source_account":"GBXGXYOUCTPLHDVCCBVQ7MH3CQQBEYMB5XLYT3PRSPU3PM76QKB47XJQ","fee":100,"seq_num":439594197712905,"cond":{1 item"time":{2 items"min_time":0,"max_time":0,},},"memo":"none","operations":[1 item{2 items"source_account":null,"body":{1 item"payment":{3 items"destination":"GASMUSXFM6V6GTGKLNLCAEY23W2JMJFBMVRZFIDMYUHEODYL2C4SVKUP","asset":"native","amount":5.0 (raw: 50000000),},},},],"ext":"v0",},"signatures":[1 item· Signatures Checked{2 items"hint":"G----------------------------------------------6QKB4----","signature":"e8e621ae314e5b85898b66c7dbd77867c0fbd79cef55c0c42fba81ca70f888077bb969aff5cdf826fe1cc5618fa0eba2db8245e838a7020af563ef4f22c13809",},],},}`,
  hash: "00cb774dce521a93438236d49f8154ede32729a595c797d51c1a72c364056fd0",
};

const MOCK_VALID_SOROBAN_TX_XDR = {
  XDR: "AAAAAgAAAAB+TL0HLiAjanMRnyeqyhb8Iu+4d1g2dl1cwPi1UZAigwAAtwUABiLjAAAAGQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAGQAAAAAAAHUwAAAAAQAAAAAAAAABAAAABgAAAAEg/u86MzPrVcpNrsFUa84T82Kss8DLAE9ZMxLqhM22HwAAABAAAAABAAAAAgAAAA8AAAAHQ291bnRlcgAAAAASAAAAAAAAAAB+TL0HLiAjanMRnyeqyhb8Iu+4d1g2dl1cwPi1UZAigwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtqEAAAABUZAigwAAAEADYbntiznotYPblvJQ35DiGEpMTQU9jCYANxV18VVGV6zDFSjB+qK++dF656Pr4oMTpyBVvE15YSo6ITxR5DoE",
  JSON: `{"tx":{"tx":{"source_account":"GB7EZPIHFYQCG2TTCGPSPKWKC36CF35YO5MDM5S5LTAPRNKRSARIHWGG","fee":46853,"seq_num":1727208213184537,"cond":{"time":{"min_time":0,"max_time":0}},"memo":"none","operations":[{"source_account":null,"body":{"extend_footprint_ttl":{"ext":"v0","extend_to":30000}}}],"ext":{"v1":{"ext":"v0","resources":{"footprint":{"read_only":[{"contract_data":{"contract":"CAQP53Z2GMZ6WVOKJWXMCVDLZYJ7GYVMWPAMWACPLEZRF2UEZW3B636S","key":{"vec":[{"symbol":"Counter"},{"address":"GB7EZPIHFYQCG2TTCGPSPKWKC36CF35YO5MDM5S5LTAPRNKRSARIHWGG"}]},"durability":"persistent"}}],"read_write":[]},"instructions":0,"read_bytes":0,"write_bytes":0},"resource_fee":46753}}},"signatures":[{"hint":"51902283","signature":"0361b9ed8b39e8b583db96f250df90e2184a4c4d053d8c2600371575f1554657acc31528c1faa2bef9d17ae7a3ebe28313a72055bc4d79612a3a213c51e43a04"}]}}`,
  hash: "0571508f487a343006d231d11f201a855f67973e0e019da6164b32b992dab46f",
};

const MOCK_VALID_TX_SUCCESS_HORIZON_RESPONSE = {
  _links: {
    self: {
      href: "https://horizon-testnet.stellar.org/transactions/1d2e5940dc4c7bad304291a0f399e0bcd69461d197fef7df16852f0d25999fdc",
    },
    account: {
      href: "https://horizon-testnet.stellar.org/accounts/GBXGXYOUCTPLHDVCCBVQ7MH3CQQBEYMB5XLYT3PRSPU3PM76QKB47XJQ",
    },
    ledger: {
      href: "https://horizon-testnet.stellar.org/ledgers/1321679",
    },
    operations: {
      href: "https://horizon-testnet.stellar.org/transactions/1d2e5940dc4c7bad304291a0f399e0bcd69461d197fef7df16852f0d25999fdc/operations{?cursor,limit,order}",
      templated: true,
    },
    effects: {
      href: "https://horizon-testnet.stellar.org/transactions/1d2e5940dc4c7bad304291a0f399e0bcd69461d197fef7df16852f0d25999fdc/effects{?cursor,limit,order}",
      templated: true,
    },
    precedes: {
      href: "https://horizon-testnet.stellar.org/transactions?order=asc\u0026cursor=5676568080814080",
    },
    succeeds: {
      href: "https://horizon-testnet.stellar.org/transactions?order=desc\u0026cursor=5676568080814080",
    },
    transaction: {
      href: "https://horizon-testnet.stellar.org/transactions/1d2e5940dc4c7bad304291a0f399e0bcd69461d197fef7df16852f0d25999fdc",
    },
  },
  id: "1d2e5940dc4c7bad304291a0f399e0bcd69461d197fef7df16852f0d25999fdc",
  paging_token: "5676568080814080",
  successful: true,
  hash: "1d2e5940dc4c7bad304291a0f399e0bcd69461d197fef7df16852f0d25999fdc",
  ledger: 1321679,
  created_at: "2024-12-05T22:36:26Z",
  source_account: "GBXGXYOUCTPLHDVCCBVQ7MH3CQQBEYMB5XLYT3PRSPU3PM76QKB47XJQ",
  source_account_sequence: "439594197712903",
  fee_account: "GBXGXYOUCTPLHDVCCBVQ7MH3CQQBEYMB5XLYT3PRSPU3PM76QKB47XJQ",
  fee_charged: "100",
  max_fee: "100",
  operation_count: 1,
  envelope_xdr:
    "AAAAAgAAAABua+HUFN6zjqIQaw+w+xQgEmGB7deJ7fGT6bez/oKDzwAAAGQAAY/PAAAABwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAAAkykrlZ6vjTMpbViATGt20liShZWOSoGzFDkcPC9C5KgAAAAAAAAAAAvrwgAAAAAAAAAAB/oKDzwAAAEDSDO1Dz8nPdSj4LJxs8vKVCTgYczDVk3+bwjDcxN7KMtrTlPllYsXSdfVCWDa02IhlZi9WuycvGjoouDu0YxYP",
  result_xdr: "AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAABAAAAAAAAAAA=",
  fee_meta_xdr:
    "AAAAAgAAAAMAFCq3AAAAAAAAAABua+HUFN6zjqIQaw+w+xQgEmGB7deJ7fGT6bez/oKDzwAAABdAt0EoAAGPzwAAAAYAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAADAAAAAAAUKrcAAAAAZ1IqcgAAAAAAAAABABQqzwAAAAAAAAAAbmvh1BTes46iEGsPsPsUIBJhge3Xie3xk+m3s/6Cg88AAAAXQLdAxAABj88AAAAGAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAwAAAAAAFCq3AAAAAGdSKnIAAAAA",
  memo_type: "none",
  signatures: [
    "0gztQ8/Jz3Uo+CycbPLylQk4GHMw1ZN/m8Iw3MTeyjLa05T5ZWLF0nX1Qlg2tNiIZWYvVrsnLxo6KLg7tGMWDw==",
  ],
  preconditions: {
    timebounds: {
      min_time: "0",
    },
  },
};

const MOCK_FAILED_TX_HORIZON_RESPONSE = {
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
