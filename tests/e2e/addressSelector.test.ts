import { baseURL } from "../../playwright.config";
import { test, expect, Page, Browser } from "@playwright/test";
import { STELLAR_EXPERT_API } from "@/constants/settings";

import {
  MOCK_LOCAL_STORAGE,
  SAVED_ACCOUNT_1,
  SAVED_ACCOUNT_1_SECRET,
  SAVED_ACCOUNT_2,
  SAVED_ACCOUNT_2_SECRET,
  SAVED_CONTRACT_1,
  SAVED_CONTRACT_2,
} from "./mock/localStorage";
import {
  MOCK_SAC_CONTRACT_ID,
  MOCK_SAC_CONTRACT_TYPE_RESPONSE,
} from "./mock/smartContracts";
import { mockRpcRequest } from "./mock/helpers";
import stellarAssetSpec from "./mock/stellarAssetSpec.json";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";

// Helper functions
async function setupPageContext(browser: Browser, url: string): Promise<Page> {
  const browserContext = await browser.newContext({
    storageState: MOCK_LOCAL_STORAGE,
  });
  const page = await browserContext.newPage();
  await page.goto(url);
  return page;
}

// Registers the mocks needed to load a SAC contract (real contract.Spec, no
// wasm decoding) so the Invoke contract tab renders its function cards.
async function mockSacContract(page: Page) {
  await mockRpcRequest({
    page,
    rpcMethod: "getLedgerEntries",
    bodyJsonResponse: MOCK_SAC_CONTRACT_TYPE_RESPONSE,
  });

  await page.route(
    "https://raw.githubusercontent.com/stellar/stellar-asset-contract-spec/refs/heads/main/stellar-asset-spec.json",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(stellarAssetSpec),
      });
    },
  );

  await page.route(
    `${STELLAR_EXPERT_API}/testnet/contract/${MOCK_SAC_CONTRACT_ID}`,
    async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: "{}",
      });
    },
  );
}

async function validateAddressSelectorOptions(page: Page) {
  const addressSelectorOptions = page.getByTestId("address-selector-options");

  await expect(addressSelectorOptions).toBeVisible();

  const labels = addressSelectorOptions.locator(
    ".AddressSelector__dropdown__item__label",
  );
  const values = addressSelectorOptions.locator(
    ".AddressSelector__dropdown__item__value",
  );

  await expect(labels.locator("div").first()).toHaveText("Saved keypairs");
  await expect(
    labels.locator(".AddressSelector__dropdown__item__label__savedKeypairs"),
  ).toHaveText("Public key");
  await expect(values.nth(0)).toHaveText("[Account 1]GA46...GMXG");
  await expect(values.nth(1)).toHaveText("[Account 2]GC5T...Z6LD");

  return { values };
}

test.describe("Address Selector", () => {
  test.describe("in Source Account on Build Transaction Page", () => {
    let pageContext: Page;

    test.beforeAll(async ({ browser }) => {
      pageContext = await setupPageContext(
        browser,
        `${baseURL}/transaction/build`,
      );
    });

    test("Loads", async () => {
      await expect(pageContext.locator("h1")).toHaveText("Build transaction");
    });

    test("'Get address' dropdown works for source account", async () => {
      const signerSelectorBtn = pageContext.getByText("Get address");
      await signerSelectorBtn.click();

      const { values } = await validateAddressSelectorOptions(pageContext);
      await values.nth(0).click();
      await expect(pageContext.getByLabel("Source account")).toHaveValue(
        SAVED_ACCOUNT_1,
      );

      await signerSelectorBtn.click();
      const { values: values2 } =
        await validateAddressSelectorOptions(pageContext);
      await values2.nth(1).click();
      await expect(pageContext.getByLabel("Source account")).toHaveValue(
        SAVED_ACCOUNT_2,
      );
    });
  });

  test.describe("in Secret Key on Sign TX Page", () => {
    let pageContext: Page;

    test.beforeAll(async ({ browser }) => {
      pageContext = await setupPageContext(
        browser,
        `${baseURL}/transaction/sign`,
      );
    });

    test("Loads", async () => {
      await expect(pageContext.locator("h1")).toHaveText("Import transaction");
    });

    test("'Use secret key' dropdown works for source account", async () => {
      // Import transaction
      await pageContext
        .getByLabel("Transaction envelope in XDR")
        .fill(MOCK_TX_XDR);
      await expect(
        pageContext.getByText("Transaction imported successfully"),
      ).toBeVisible();

      // Advance to the Sign step
      await pageContext
        .getByRole("button", { name: "Sign transaction", exact: true })
        .click();

      // First signer
      await pageContext.getByText("Use secret key").first().click();

      const { values } = await validateAddressSelectorOptions(pageContext);
      await values.nth(0).click();

      const multipickers = pageContext.getByTestId(
        "multipicker-sign-step-signer",
      );
      const multiPickerInputs = multipickers.locator(".Input");
      await expect(multiPickerInputs.nth(0).locator("input")).toHaveValue(
        SAVED_ACCOUNT_1_SECRET,
      );

      // Add second signer
      await multipickers
        .getByRole("button", { name: "Add additional" })
        .click();
      await expect(multiPickerInputs).toHaveCount(2);

      await pageContext.getByText("Use secret key").nth(1).click();
      const { values: values2 } =
        await validateAddressSelectorOptions(pageContext);
      await values2.nth(1).click();
      await expect(multiPickerInputs.nth(1).locator("input")).toHaveValue(
        SAVED_ACCOUNT_2_SECRET,
      );

      // Wait for the dropdown to close before clicking sign button
      await expect(
        pageContext.getByTestId("address-selector-options").nth(1),
      ).toBeHidden();

      // Sign transaction
      await pageContext
        .getByRole("button", { name: "Sign", exact: true })
        .click();

      await expect(
        pageContext.getByText("Successfully added 2 signatures"),
      ).toBeVisible();
    });
  });
  test.describe("in Address field on Invoke Contract Page", () => {
    let pageContext: Page;

    test.beforeAll(async ({ browser }) => {
      const browserContext = await browser.newContext({
        storageState: MOCK_LOCAL_STORAGE,
      });
      pageContext = await browserContext.newPage();

      await mockSacContract(pageContext);

      await pageContext.goto(`${baseURL}/smart-contracts/contract-explorer`);
    });

    test("'Get address' dropdown shows both saved keypairs and saved contracts", async () => {
      // Load the SAC contract and open the Invoke contract tab.
      await pageContext.getByLabel("Contract ID").fill(MOCK_SAC_CONTRACT_ID);
      await pageContext.getByRole("button", { name: "Load contract" }).click();
      await pageContext.getByTestId("contract-invoke").click();

      const invokeContainer = pageContext.getByTestId(
        "invoke-contract-container",
      );
      await expect(invokeContainer).toBeVisible();

      // `balance` takes a single `id: address` argument, so its card has the
      // address input with the "Get address" selector.
      const balanceTitle = invokeContainer.getByText("balance", {
        exact: true,
      });
      await expect(balanceTitle).toBeVisible();
      const balanceCard = balanceTitle.locator(
        'xpath=ancestor::*[contains(@class, "Card")][1]',
      );

      await balanceCard.getByText("Get address").click();

      // Two groups render: saved keypairs and saved contracts.
      const groups = balanceCard.getByTestId("address-selector-options");
      const labels = groups.locator(".AddressSelector__dropdown__item__label");
      await expect(labels.filter({ hasText: "Saved keypairs" })).toBeVisible();
      await expect(labels.filter({ hasText: "Saved contracts" })).toBeVisible();

      const values = groups.locator(".AddressSelector__dropdown__item__value");
      await expect(
        values.filter({ hasText: shortenStellarAddress(SAVED_ACCOUNT_1) }),
      ).toBeVisible();
      await expect(
        values.filter({ hasText: shortenStellarAddress(SAVED_CONTRACT_1) }),
      ).toBeVisible();

      // Selecting a contract fills the address input with its contract ID.
      await values
        .filter({ hasText: shortenStellarAddress(SAVED_CONTRACT_2) })
        .click();
      await expect(balanceCard.locator("input").first()).toHaveValue(
        SAVED_CONTRACT_2,
      );
    });
  });

  test.describe("in Contract ID on Build Transaction Page", () => {
    let pageContext: Page;

    test.beforeAll(async ({ browser }) => {
      const browserContext = await browser.newContext({
        storageState: MOCK_LOCAL_STORAGE,
      });
      pageContext = await browserContext.newPage();

      // Selecting a contract id triggers the picker's debounced auto-fetch.
      // Stub the RPC so these assertions don't depend on the network.
      await pageContext.route(
        "https://soroban-testnet.stellar.org",
        async (route) => {
          await route.fulfill({
            status: 500,
            contentType: "application/json",
            body: "{}",
          });
        },
      );

      await pageContext.goto(`${baseURL}/transaction/build`);

      // Seed the flow store with an invoke_contract_function operation so the
      // build step renders the Contract ID picker.
      await pageContext.evaluate((stateJson) => {
        sessionStorage.setItem("stellar_lab_tx_flow_build", stateJson);
      }, JSON.stringify(BUILD_STORE_STATE_WITH_INVOKE_OP));

      await pageContext.reload();
    });

    test("'Get contract ID' dropdown offers only saved contracts", async () => {
      const selectorBtn = pageContext.getByText("Get contract ID");
      await expect(selectorBtn).toBeVisible();
      await selectorBtn.click();

      const groups = pageContext.getByTestId("address-selector-options");
      const labels = groups.locator(".AddressSelector__dropdown__item__label");

      // "contract" mode resolves to a contract address, so saved keypairs and
      // the connected wallet must never be offered here — a public key would
      // fail contract id validation.
      await expect(labels.filter({ hasText: "Saved contracts" })).toBeVisible();
      await expect(labels.filter({ hasText: "Saved keypairs" })).toHaveCount(0);
      await expect(labels.filter({ hasText: "Connected Wallet" })).toHaveCount(
        0,
      );

      const values = groups.locator(".AddressSelector__dropdown__item__value");
      await expect(values).toHaveCount(2);

      // Selecting a contract fills the Contract ID input with its contract id.
      await values
        .filter({ hasText: shortenStellarAddress(SAVED_CONTRACT_2) })
        .click();
      await expect(pageContext.getByLabel("Contract ID")).toHaveValue(
        SAVED_CONTRACT_2,
      );
    });
  });

  test.describe("in Contract ID with no saved contracts", () => {
    let pageContext: Page;

    test.beforeAll(async ({ browser }) => {
      const browserContext = await browser.newContext({
        storageState: MOCK_LOCAL_STORAGE_NO_CONTRACTS,
      });
      pageContext = await browserContext.newPage();

      await pageContext.goto(`${baseURL}/transaction/build`);

      await pageContext.evaluate((stateJson) => {
        sessionStorage.setItem("stellar_lab_tx_flow_build", stateJson);
      }, JSON.stringify(BUILD_STORE_STATE_WITH_INVOKE_OP));

      await pageContext.reload();
    });

    test("hides the selector instead of falling back to saved keypairs", async () => {
      // The Contract ID field still renders, but with no saved contracts there
      // is nothing valid to offer. Saved keypairs hold public keys, which would
      // fail contract id validation, so the button must not appear at all.
      await expect(pageContext.getByLabel("Contract ID")).toBeVisible();
      await expect(pageContext.getByText("Get contract ID")).toHaveCount(0);
      await expect(
        pageContext.getByTestId("address-selector-options"),
      ).toHaveCount(0);
    });
  });
});

// =============================================================================
// Mock data
// =============================================================================

const MOCK_TX_XDR =
  "AAAAAgAAAADJrq4b4AopDZibkeBWpDxuWKUcY4FUUNQdIEF3Nm9dkQAAAGQAAAIiAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAACXlGN76T6NQcaUJxbEkH3mi1HHWsHnLqMDdlLl9NlJgQAAAAAAAAAABfXhAAAAAAAAAAAA";

// MOCK_LOCAL_STORAGE with the saved contracts stripped out, so contract mode
// has saved keypairs available but no valid contract to offer.
const MOCK_LOCAL_STORAGE_NO_CONTRACTS = {
  ...MOCK_LOCAL_STORAGE,
  origins: MOCK_LOCAL_STORAGE.origins.map((origin) => ({
    ...origin,
    localStorage: origin.localStorage.filter(
      (item) => item.name !== "stellar_lab_saved_contract_ids",
    ),
  })),
};

// Minimal flow-store state that parks the build step on an
// invoke_contract_function operation. `page.tsx` treats a non-empty
// `operation_type` as Soroban, which is what renders the Contract ID picker.
const BUILD_STORE_STATE_WITH_INVOKE_OP = {
  state: {
    activeStep: "build",
    highestCompletedStep: null,
    build: {
      classic: { operations: [], xdr: "" },
      soroban: {
        operation: {
          operation_type: "invoke_contract_function",
          params: {
            invoke_contract: JSON.stringify({
              contract_id: "",
              function_name: "",
              args: {},
            }),
          },
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
      isValid: { params: false, operations: false },
    },
    simulate: {
      xdrFormat: "base64",
      authMode: "record",
      simulationResultJson: "",
      isValid: false,
    },
    sign: { signedXdr: "" },
    submit: { submitResultJson: "" },
  },
  version: 0,
};
