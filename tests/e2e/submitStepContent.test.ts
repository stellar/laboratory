import { baseURL } from "../../playwright.config";
import { test, expect, Page } from "@playwright/test";

/**
 * E2E tests for the Submit step in the single-page transaction build flow.
 *
 * Seeds sessionStorage with a signed classic transaction so the flow starts
 * at the submit step. Mocks both RPC (sendTransaction + getTransaction) and
 * Horizon (/transactions) endpoints for success and error scenarios.
 */

// A signed classic path payment transaction XDR (testnet)
const MOCK_SIGNED_CLASSIC_XDR =
  "AAAAAgAAAAC3gFZiADqJtbRXtDxNmR1jp/oUk2bmGNd+nOl6aFigVQAAAGQADSxdAAAAAQAAAAAAAAAAAAAAAQAAAAAAAAABAAAAAF6GUIkuJfjPW4O0AR9JYo113yjhOgEGUGF3qKs9PuVWAAAAAAAAAAAF9eEAAAAAAAAAAAFoWKBVAAAAQJ0mGItCNQoAcNg9jjvqI+YhEKLu7LCAqKCVn0mzRxlHTQ1NU/73NBUNqGmpm2FxbtphtNDkJEz8jazDzEWikAE=";

const MOCK_TX_CLASSIC_HASH =
  "4bb833c2016dce5a8bc6026a4148a9f276fa9cbaaab71bc24dcfc0a06670855d";

const MOCK_SIGNED_SOROBAN_XDR =
  "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";

const MOCK_TX_SOROBAN_HASH =
  "8a3d1009c0a95b5a6eb3304dbc976e0fa803e7e21421fc2a1efbfbc09d57017e";

const buildClassicStoreState = (signedXdr: string) => ({
  state: {
    activeStep: "submit",
    highestCompletedStep: "sign",
    build: {
      classic: { operations: [], xdr: signedXdr },
      soroban: {
        operation: {
          operation_type: "",
          params: {},
          source_account: "",
        },
        xdr: "",
      },
      params: {
        source_account: "",
        fee: "100",
        seq_num: "",
        cond: { time: { min_time: "", max_time: "" } },
        memo: {},
      },
      error: { params: [], operations: [] },
      isValid: { params: true, operations: true },
    },
    simulate: {
      xdrFormat: "base64",
      authMode: "record",
      simulationResultJson: "",
      isValid: false,
    },
    sign: { signedXdr },
    submit: { submitResultJson: "" },
    feeBump: { source_account: "", fee: "", xdr: "" },
  },
  version: 0,
});

const buildSorobanStoreState = (signedXdr: string) => ({
  state: {
    activeStep: "submit",
    highestCompletedStep: "validate",
    build: {
      classic: { operations: [], xdr: "" },
      soroban: {
        operation: {
          operation_type: "invoke_contract_function",
          params: {},
          source_account: "",
        },
        xdr: signedXdr,
      },
      params: {
        source_account: "",
        fee: "100",
        seq_num: "",
        cond: { time: { min_time: "", max_time: "" } },
        memo: {},
      },
      error: { params: [], operations: [] },
      isValid: { params: true, operations: true },
    },
    simulate: {
      xdrFormat: "base64",
      authMode: "record",
      simulationResultJson: JSON.stringify({ result: {} }),
      authEntriesXdr: [],
      signedAuthEntriesXdr: [],
      isValid: true,
    },
    sign: { signedXdr },
    submit: { submitResultJson: "" },
    feeBump: { source_account: "", fee: "", xdr: "" },
  },
  version: 0,
});

const seedSessionStorage = async (page: Page, storeState: object) => {
  await page.goto(`${baseURL}/transaction/build`);

  await page.evaluate((stateJson) => {
    sessionStorage.setItem("stellar_lab_tx_flow_build", stateJson);
  }, JSON.stringify(storeState));

  await page.reload();
};

/**
 * Mock RPC sendTransaction returning an error (non-PENDING status).
 */
const mockRpcSubmitError = async (page: Page) => {
  await page.route("**/soroban-testnet.stellar.org/**", async (route) => {
    const request = route.request();
    let postData;
    try {
      postData = request.postDataJSON();
    } catch {
      await route.continue();
      return;
    }

    if (postData?.method === "sendTransaction") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: postData.id,
          result: {
            status: "ERROR",
            errorResultXdr: "AAAAAAAAAGT////7AAAAAA==",
            hash: MOCK_TX_CLASSIC_HASH,
            latestLedger: 1000,
            latestLedgerCloseTime: "1700000000",
          },
        }),
      });
    } else {
      await route.continue();
    }
  });
};

/**
 * Mock Horizon POST /transactions success.
 */
const mockHorizonSubmitSuccess = async (page: Page) => {
  await page.route(
    "https://horizon-testnet.stellar.org/transactions",
    async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            hash: MOCK_TX_CLASSIC_HASH,
            ledger: 1917984,
            envelope_xdr: MOCK_SIGNED_CLASSIC_XDR,
            result_xdr: "AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAABAAAAAAAAAAA=",
            fee_charged: "100",
            operation_count: 1,
            successful: true,
          }),
        });
      } else {
        await route.continue();
      }
    },
  );
};

/**
 * Mock Horizon POST /transactions error (400).
 */
const mockHorizonSubmitError = async (page: Page) => {
  await page.route(
    "https://horizon-testnet.stellar.org/transactions",
    async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({
            type: "https://stellar.org/horizon-errors/transaction_failed",
            title: "Transaction Failed",
            status: 400,
            detail:
              "The transaction failed when submitted to the stellar network.",
            extras: {
              envelope_xdr: MOCK_SIGNED_CLASSIC_XDR,
              result_xdr: "AAAAAAAAAGT////7AAAAAA==",
              result_codes: {
                transaction: "tx_bad_seq",
              },
            },
          }),
        });
      } else {
        await route.continue();
      }
    },
  );
};

test.describe("Submit Step in Build Flow", () => {
  test("Loads the submit step with correct heading", async ({ page }) => {
    await seedSessionStorage(
      page,
      buildClassicStoreState(MOCK_SIGNED_CLASSIC_XDR),
    );

    await expect(page.locator("h1")).toHaveText("Submit transaction");
  });

  test("Shows signed transaction XDR in read-only picker", async ({ page }) => {
    await seedSessionStorage(
      page,
      buildClassicStoreState(MOCK_SIGNED_CLASSIC_XDR),
    );

    const xdrPicker = page.locator("#submit-tx-xdr");
    await expect(xdrPicker).toBeVisible();
  });

  test("Shows transaction hash", async ({ page }) => {
    await seedSessionStorage(
      page,
      buildClassicStoreState(MOCK_SIGNED_CLASSIC_XDR),
    );

    const hashField = page.getByLabel("Transaction hash");
    await expect(hashField).toBeVisible();
    await expect(hashField).toHaveValue(MOCK_TX_CLASSIC_HASH);
  });

  test("Submit button is enabled when signed XDR exists", async ({ page }) => {
    await seedSessionStorage(
      page,
      buildClassicStoreState(MOCK_SIGNED_CLASSIC_XDR),
    );

    const submitButton = page.getByRole("button", {
      name: "Submit transaction",
    });
    await expect(submitButton).toBeEnabled();
  });

  test.describe("Horizon submission", () => {
    test("Shows success response on successful Horizon submit", async ({
      page,
    }) => {
      await mockHorizonSubmitSuccess(page);
      await seedSessionStorage(
        page,
        buildClassicStoreState(MOCK_SIGNED_CLASSIC_XDR),
      );

      const submitButton = page.getByRole("button", {
        name: "Submit transaction",
      });
      await submitButton.click();

      await expect(page.getByText("Transaction submitted!")).toBeVisible();
      await expect(
        page.getByText(
          "Transaction successfully submitted with 1 operation(s)",
        ),
      ).toBeVisible();

      // Check response details
      await expect(page.getByText("Hash:")).toBeVisible();
      await expect(page.getByText("Ledger number:")).toBeVisible();
      await expect(page.getByText("Fee charged:")).toBeVisible();

      // Block explorer buttons should be visible on testnet
      await expect(
        page.getByRole("button", { name: "View on Stellar.Expert" }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "View on Stellarchain.io" }),
      ).toBeVisible();

      // Dashboard link
      await expect(
        page.getByRole("button", {
          name: "View in transaction dashboard",
        }),
      ).toBeVisible();
    });

    test("Shows error response on failed Horizon submit", async ({ page }) => {
      await mockHorizonSubmitError(page);
      await seedSessionStorage(
        page,
        buildClassicStoreState(MOCK_SIGNED_CLASSIC_XDR),
      );

      const submitButton = page.getByRole("button", {
        name: "Submit transaction",
      });
      await submitButton.click();

      await expect(page.getByText("Transaction Failed")).toBeVisible();
    });
  });

  test.describe("RPC submission", () => {
    const switchToRpc = async (page: Page) => {
      const methodButton = page.getByRole("button", { name: "via Horizon" });
      await methodButton.click();

      const rpcOption = page.locator('[data-is-selected="false"]').filter({
        hasText: "via RPC",
      });
      await rpcOption.click();
    };

    test("Shows error response on failed RPC submit", async ({ page }) => {
      await mockRpcSubmitError(page);
      await seedSessionStorage(
        page,
        buildClassicStoreState(MOCK_SIGNED_CLASSIC_XDR),
      );
      await switchToRpc(page);

      const submitButton = page.getByRole("button", {
        name: "Submit transaction",
      });
      await submitButton.click();

      // RPC errors show a "Transaction failed" alert
      await expect(page.getByText("Transaction failed")).toBeVisible({
        timeout: 15000,
      });
    });
  });

  test.describe("Submit method selector", () => {
    test("Defaults to Horizon for classic transactions", async ({ page }) => {
      await seedSessionStorage(
        page,
        buildClassicStoreState(MOCK_SIGNED_CLASSIC_XDR),
      );

      await expect(
        page.getByRole("button", { name: "via Horizon" }),
      ).toBeVisible();
    });

    test("Can switch between Horizon and RPC", async ({ page }) => {
      await seedSessionStorage(
        page,
        buildClassicStoreState(MOCK_SIGNED_CLASSIC_XDR),
      );

      // Open dropdown
      const methodButton = page.getByRole("button", { name: "via Horizon" });
      await methodButton.click();

      // Select RPC
      const rpcOption = page.locator('[data-is-selected="false"]').filter({
        hasText: "via RPC",
      });
      await rpcOption.click();

      // Button should now say "via RPC"
      await expect(page.getByRole("button", { name: "via RPC" })).toBeVisible();
    });
  });

  test.describe("Soroban transaction submission", () => {
    test("Defaults to RPC for Soroban transactions", async ({ page }) => {
      await seedSessionStorage(
        page,
        buildSorobanStoreState(MOCK_SIGNED_SOROBAN_XDR),
      );

      await expect(page.getByRole("button", { name: "via RPC" })).toBeVisible();
    });

    test("Shows signed Soroban XDR and transaction hash", async ({ page }) => {
      await seedSessionStorage(
        page,
        buildSorobanStoreState(MOCK_SIGNED_SOROBAN_XDR),
      );

      const xdrPicker = page.locator("#submit-tx-xdr");
      await expect(xdrPicker).toBeVisible();

      const hashField = page.getByLabel("Transaction hash");
      await expect(hashField).toHaveValue(MOCK_TX_SOROBAN_HASH);
    });

    test("Shows error response on failed Soroban RPC submit", async ({
      page,
    }) => {
      await mockRpcSubmitError(page);
      await seedSessionStorage(
        page,
        buildSorobanStoreState(MOCK_SIGNED_SOROBAN_XDR),
      );

      const submitButton = page.getByRole("button", {
        name: "Submit transaction",
      });
      await submitButton.click();

      await expect(page.getByText("Transaction failed")).toBeVisible({
        timeout: 15000,
      });
    });

  });
});
