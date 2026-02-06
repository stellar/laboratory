import { test, expect } from "@playwright/test";
import { shortenStellarAddress } from "../../src/helpers/shortenStellarAddress";

const TEST_ACCOUNT_PUBLIC_KEY =
  "GBIPXRJY4MRSO7IFGTS7KTJOAC2TUKPBOUDY7BF7NOR6WINCZ7FOBMEH";
const TEST_ACCOUNT_PUBLICK_KEY_SHORT = shortenStellarAddress(
  TEST_ACCOUNT_PUBLIC_KEY,
);
const TEST_ACCOUNT_SECRET_KEY =
  "SAGMD25QLMP5ZERFIJUYU6F6JO7S66GZ4CXNFF522FUQMCFZ7YGKDQV3";
const TEST_MUXED_ACCOUNT =
  "MBIPXRJY4MRSO7IFGTS7KTJOAC2TUKPBOUDY7BF7NOR6WINCZ7FOAAAAAAAAAAAAAEFRU";

const TEST_CONTRACT_ID =
  "CDLUDNR7VGBRC3RCAG5AVWFF6O54NRYPZVWEISV6M7OFR4GT53Z6IL6P";
const TEST_CONTRACT_ID_SHORT = shortenStellarAddress(TEST_CONTRACT_ID);

test.describe("[futurenet/testnet] Fund Account Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/account/fund");
  });

  test("Shows testnet network in the title by default", async ({ page }) => {
    await expect(page.getByTestId("networkSelector-button")).toHaveText(
      "Testnet",
    );
    await expect(page.locator("h1")).toHaveText(
      "Friendbot: fund a Testnet account or contract with XLM, USDC, and EURC",
    );
  });

  test("Shows futurenet network in the title if I change my network to futurenet", async ({
    page,
  }) => {
    // Click network selector dropdown button
    await page.getByTestId("networkSelector-button").click();
    await expect(page.getByTestId("networkSelector-dropdown")).toBeVisible();

    // Select Futurenet in the dropdown list
    await page
      .getByTestId("networkSelector-dropdown")
      .getByTestId("networkSelector-option")
      .filter({ has: page.getByText("Futurenet") })
      .click();

    // Network Submit button
    const submitButton = page.getByTestId("networkSelector-submit-button");

    // Select 'Futurenet' in the network dropdown list
    await expect(submitButton).toHaveText("Switch to futurenet");
    await expect(submitButton).toBeEnabled();

    // Click 'Switch to Futurenet' button
    await submitButton.click();

    await expect(page.getByTestId("networkSelector-button")).toHaveText(
      "Futurenet",
    );
    await expect(page.locator("h1")).toHaveText(
      "Friendbot: fund a Futurenet account or contract with XLM, USDC, and EURC",
    );
  });

  test("By default, 'Public Key' input field is empty and buttons are disabled", async ({
    page,
  }) => {
    await expect(page.locator("#fund-public-key-input")).toHaveValue("");

    const getLumenButton = page.getByText("Fund", { exact: true });
    const fillInButton = page.getByText("Fill in with generated key");

    await expect(getLumenButton).toBeDisabled();
    await expect(fillInButton).toBeDisabled();
  });

  test("Gets an error with an invalid public key in 'Public Key' field", async ({
    page,
  }) => {
    const publicKeyInput = page.locator("#fund-public-key-input");

    // Type in an invalid string in 'Public Key' input field
    await publicKeyInput.fill("XLKDSFJLSKDJF");

    await expect(publicKeyInput).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Fund", { exact: true })).toBeDisabled();
  });

  test("Fund new account with XLM and add USDC trustline", async ({ page }) => {
    // We need to run multiple "accounts" API calls in this flow (initial fetch,
    // fund XLM, add USDC trustline). We use the counter to make sure we return
    // correct data for each step.
    let accountsCallCount = 0;

    // Mock accounts API call
    await page.route(
      `*/**/accounts/${TEST_ACCOUNT_PUBLIC_KEY}`,
      async (route) => {
        if (accountsCallCount === 0) {
          await route.fulfill({
            status: 200,
            contentType: "application/hal+json; charset=utf-8",
            body: JSON.stringify(MOCK_ACCOUNT_UNFUNDED_RESPONSE),
          });
        } else if (accountsCallCount === 1) {
          await route.fulfill({
            status: 200,
            contentType: "application/hal+json; charset=utf-8",
            body: JSON.stringify(MOCK_ACCOUNT_FUNDED_RESPONSE),
          });
        } else {
          await route.fulfill({
            status: 200,
            contentType: "application/hal+json; charset=utf-8",
            body: JSON.stringify(MOCK_ACCOUNT_FUNDED_RESPONSE_WITH_USDC),
          });
        }

        accountsCallCount++;
      },
    );

    // Mock the Friendbot API call
    await page.route(`*/**/?addr=${TEST_ACCOUNT_PUBLIC_KEY}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/hal+json",
      });
    });

    // Mock Add Trustline tx API call
    await page.route("*/**/transactions", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/hal+json; charset=utf-8",
        body: JSON.stringify(MOCK_TRUSTLINE_TX_RESPONSE),
      });
    });

    const publicKeyInput = page.locator("#fund-public-key-input");

    const tokens = page.getByTestId("fund-account-token");

    const fundXlmButton = tokens.nth(0).getByRole("button");
    const fundUsdcButton = tokens.nth(1).getByRole("button");
    const fundEurcButton = tokens.nth(2).getByRole("button");

    await expect(fundXlmButton).toBeVisible();
    await expect(fundXlmButton).toBeDisabled();

    await expect(fundUsdcButton).toBeVisible();
    await expect(fundUsdcButton).toBeDisabled();
    await expect(fundUsdcButton).toHaveText("Add trustline");

    await expect(fundEurcButton).toBeVisible();
    await expect(fundEurcButton).toBeDisabled();
    await expect(fundEurcButton).toHaveText("Add trustline");

    await publicKeyInput.fill(TEST_ACCOUNT_PUBLIC_KEY);
    await publicKeyInput.blur();

    // Fund XLM
    await expect(fundXlmButton).toBeEnabled();
    await fundXlmButton.click();

    await expect(
      page.getByText(
        `10,000 XLM was funded to ${TEST_ACCOUNT_PUBLICK_KEY_SHORT} on Testnet.`,
      ),
    ).toBeVisible();

    await expect(fundUsdcButton).toBeEnabled();
    await expect(fundEurcButton).toBeEnabled();

    // Add USDC trustline
    const signTxBox = page.getByTestId("sign-tx-xdr-fund-account-sign-tx");

    await expect(signTxBox).toBeHidden();
    await fundUsdcButton.click();
    await expect(signTxBox).toBeVisible();

    const signTxButton = signTxBox
      .getByRole("button")
      .getByText("Sign transaction");
    const addTrustlineButton = page
      .getByRole("button")
      .getByText("Add trustline")
      .nth(2);

    await expect(signTxButton).toBeDisabled();
    await expect(addTrustlineButton).toBeDisabled();
    await signTxBox
      .locator("#fund-account-sign-tx-signer-0")
      .fill(TEST_ACCOUNT_SECRET_KEY);

    await expect(signTxButton).toBeEnabled();
    await signTxButton.click();
    await expect(addTrustlineButton).toBeEnabled();
    await addTrustlineButton.click();

    await expect(signTxBox).toBeHidden();
    await expect(
      page.getByText(
        `USDC trustline has been successfully added to ${TEST_ACCOUNT_PUBLICK_KEY_SHORT} on Testnet.`,
      ),
    ).toBeVisible();
    await expect(fundUsdcButton).toHaveText("Fund");
    await expect(fundEurcButton).toHaveText("Add trustline");
  });

  test("Load funded account wiht USDC trustline", async ({ page }) => {
    // Mock accounts API call
    await page.route(
      `*/**/accounts/${TEST_ACCOUNT_PUBLIC_KEY}`,
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/hal+json; charset=utf-8",
          body: JSON.stringify(MOCK_ACCOUNT_FUNDED_RESPONSE_WITH_USDC),
        });
      },
    );

    const publicKeyInput = page.locator("#fund-public-key-input");

    const tokens = page.getByTestId("fund-account-token");

    const fundXlmButton = tokens.nth(0).getByRole("button");
    const fundUsdcButton = tokens.nth(1).getByRole("button");
    const fundEurcButton = tokens.nth(2).getByRole("button");

    await expect(fundXlmButton).toBeVisible();
    await expect(fundXlmButton).toBeDisabled();

    await expect(fundUsdcButton).toBeVisible();
    await expect(fundUsdcButton).toBeDisabled();
    await expect(fundUsdcButton).toHaveText("Add trustline");

    await expect(fundEurcButton).toBeVisible();
    await expect(fundEurcButton).toBeDisabled();
    await expect(fundEurcButton).toHaveText("Add trustline");

    await publicKeyInput.fill(TEST_ACCOUNT_PUBLIC_KEY);
    await publicKeyInput.blur();

    await expect(fundXlmButton).toBeEnabled();

    await expect(fundUsdcButton).toBeEnabled();
    await expect(fundUsdcButton).toHaveText("Fund");

    await expect(fundEurcButton).toBeEnabled();
    await expect(fundEurcButton).toHaveText("Add trustline");
  });

  test("Fund muxed account with XLM", async ({ page }) => {
    let accountsCallCount = 0;

    // Mock accounts API call
    await page.route(
      `*/**/accounts/${TEST_ACCOUNT_PUBLIC_KEY}`,
      async (route) => {
        if (accountsCallCount === 0) {
          await route.fulfill({
            status: 200,
            contentType: "application/hal+json; charset=utf-8",
            body: JSON.stringify(MOCK_ACCOUNT_UNFUNDED_RESPONSE),
          });
        } else if (accountsCallCount === 1) {
          await route.fulfill({
            status: 200,
            contentType: "application/hal+json; charset=utf-8",
            body: JSON.stringify(MOCK_ACCOUNT_FUNDED_RESPONSE),
          });
        }

        accountsCallCount++;
      },
    );

    // Mock the Friendbot API call
    await page.route(`*/**/?addr=${TEST_ACCOUNT_PUBLIC_KEY}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/hal+json",
      });
    });

    const publicKeyInput = page.locator("#fund-public-key-input");
    const tokens = page.getByTestId("fund-account-token");
    const fundXlmButton = tokens.nth(0).getByRole("button");

    await expect(fundXlmButton).toBeVisible();
    await expect(fundXlmButton).toBeDisabled();

    await publicKeyInput.fill(TEST_MUXED_ACCOUNT);
    await publicKeyInput.blur();

    await expect(
      page.getByText(
        `The base account ${TEST_ACCOUNT_PUBLIC_KEY} will be funded.`,
      ),
    ).toBeVisible();

    // Fund XLM
    await expect(fundXlmButton).toBeEnabled();
    await fundXlmButton.click();

    await expect(
      page.getByText(
        `10,000 XLM was funded to ${TEST_ACCOUNT_PUBLICK_KEY_SHORT} on Testnet.`,
      ),
    ).toBeVisible();
  });

  test("Error when funding already funded account", async ({ page }) => {
    // Mock accounts API call
    await page.route(
      `*/**/accounts/${TEST_ACCOUNT_PUBLIC_KEY}`,
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/hal+json; charset=utf-8",
          body: JSON.stringify(MOCK_ACCOUNT_FUNDED_RESPONSE),
        });
      },
    );

    // Mock the Friendbot API call
    await page.route(`*/**/?addr=${TEST_ACCOUNT_PUBLIC_KEY}`, async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/hal+json",
        body: JSON.stringify(MOCK_FRIENDBOT_RESPONSE_ALREADY_FUNDED),
      });
    });

    const publicKeyInput = page.locator("#fund-public-key-input");
    const tokens = page.getByTestId("fund-account-token");
    const fundXlmButton = tokens.nth(0).getByRole("button");

    await expect(fundXlmButton).toBeVisible();
    await expect(fundXlmButton).toBeDisabled();

    await publicKeyInput.fill(TEST_ACCOUNT_PUBLIC_KEY);
    await publicKeyInput.blur();

    // Fund XLM
    await expect(fundXlmButton).toBeEnabled();
    await fundXlmButton.click();

    await expect(
      page.getByText(
        `Unable to fund ${TEST_ACCOUNT_PUBLICK_KEY_SHORT} on the test network. Details: account already funded to starting balance`,
      ),
    ).toBeVisible();
  });

  test("Fund contract ID", async ({ page }) => {
    // Mock the Friendbot API call
    await page.route(`*/**/?addr=${TEST_CONTRACT_ID}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/hal+json",
      });
    });

    const publicKeyInput = page.locator("#fund-public-key-input");
    const tokens = page.getByTestId("fund-account-token");

    const fundXlmButton = tokens.nth(0).getByRole("button");
    const fundUsdcButton = tokens.nth(1).getByRole("button");
    const fundEurcButton = tokens.nth(2).getByRole("button");

    await expect(fundXlmButton).toBeVisible();
    await expect(fundXlmButton).toBeDisabled();

    await expect(fundUsdcButton).toBeDisabled();
    await expect(fundEurcButton).toBeDisabled();

    await publicKeyInput.fill(TEST_CONTRACT_ID);
    await publicKeyInput.blur();

    // Fund XLM
    await expect(fundXlmButton).toBeEnabled();
    await fundXlmButton.click();

    await expect(
      page.getByText(
        `10,000 XLM was funded to ${TEST_CONTRACT_ID_SHORT} on Testnet.`,
      ),
    ).toBeVisible();

    await expect(fundUsdcButton).toBeDisabled();
    await expect(fundUsdcButton).toHaveText("Add trustline");

    await expect(fundEurcButton).toBeDisabled();
    await expect(fundEurcButton).toHaveText("Add trustline");
  });
});

test.describe("[mainnet] Fund Account Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/account");

    // Switch to mainnet network
    await page.getByTestId("networkSelector-button").click();
    await expect(page.getByTestId("networkSelector-dropdown")).toBeVisible();

    // Select Mainnet in the dropdown list
    await page
      .getByTestId("networkSelector-dropdown")
      .getByTestId("networkSelector-option")
      .filter({ has: page.getByText("Mainnet") })
      .click();

    // Network Submit button
    const submitButton = page.getByTestId("networkSelector-submit-button");

    // Click 'Switch to Mainnet' button
    await submitButton.click();

    await expect(page.getByTestId("networkSelector-button")).toHaveText(
      "Mainnet",
    );
  });

  test("I should see 'Switch Network' page on /account/fund", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/account/fund");

    await expect(page.locator("h1")).toHaveText(
      "Fund a Futurenet or Testnet network account or contract with XLM, USDC, and EURC",
    );
  });
});

// =============================================================================
// Mock data
// =============================================================================
const MOCK_ACCOUNT_UNFUNDED_RESPONSE = {
  type: "https://stellar.org/horizon-errors/not_found",
  title: "Resource Missing",
  status: 404,
  detail:
    "The resource at the url requested was not found.  This usually occurs for one of two reasons:  The url requested is not valid, or no data in our database could be found with the parameters provided.",
};

const MOCK_ACCOUNT_FUNDED_RESPONSE = {
  _links: {},
  id: "GBIPXRJY4MRSO7IFGTS7KTJOAC2TUKPBOUDY7BF7NOR6WINCZ7FOBMEH",
  account_id: "GBIPXRJY4MRSO7IFGTS7KTJOAC2TUKPBOUDY7BF7NOR6WINCZ7FOBMEH",
  sequence: "9255551443664896",
  subentry_count: 0,
  last_modified_ledger: 2154976,
  last_modified_time: "2025-12-17T15:02:45Z",
  thresholds: {
    low_threshold: 0,
    med_threshold: 0,
    high_threshold: 0,
  },
  flags: {
    auth_required: false,
    auth_revocable: false,
    auth_immutable: false,
    auth_clawback_enabled: false,
  },
  balances: [
    {
      balance: "10000.0000000",
      buying_liabilities: "0.0000000",
      selling_liabilities: "0.0000000",
      asset_type: "native",
    },
  ],
  signers: [
    {
      weight: 1,
      key: "GBIPXRJY4MRSO7IFGTS7KTJOAC2TUKPBOUDY7BF7NOR6WINCZ7FOBMEH",
      type: "ed25519_public_key",
    },
  ],
  data: {},
  num_sponsoring: 0,
  num_sponsored: 0,
  paging_token: "GBIPXRJY4MRSO7IFGTS7KTJOAC2TUKPBOUDY7BF7NOR6WINCZ7FOBMEH",
};

const MOCK_ACCOUNT_FUNDED_RESPONSE_WITH_USDC = {
  _links: {},
  id: "GBIPXRJY4MRSO7IFGTS7KTJOAC2TUKPBOUDY7BF7NOR6WINCZ7FOBMEH",
  account_id: "GBIPXRJY4MRSO7IFGTS7KTJOAC2TUKPBOUDY7BF7NOR6WINCZ7FOBMEH",
  sequence: "9255551443664896",
  subentry_count: 0,
  last_modified_ledger: 2154976,
  last_modified_time: "2025-12-17T15:02:45Z",
  thresholds: {
    low_threshold: 0,
    med_threshold: 0,
    high_threshold: 0,
  },
  flags: {
    auth_required: false,
    auth_revocable: false,
    auth_immutable: false,
    auth_clawback_enabled: false,
  },
  balances: [
    {
      balance: "0.0000000",
      limit: "922337203685.4775807",
      buying_liabilities: "0.0000000",
      selling_liabilities: "0.0000000",
      last_modified_ledger: 2155335,
      is_authorized: true,
      is_authorized_to_maintain_liabilities: true,
      asset_type: "credit_alphanum4",
      asset_code: "USDC",
      asset_issuer: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
    },
    {
      balance: "10000.0000000",
      buying_liabilities: "0.0000000",
      selling_liabilities: "0.0000000",
      asset_type: "native",
    },
  ],
  signers: [
    {
      weight: 1,
      key: "GBIPXRJY4MRSO7IFGTS7KTJOAC2TUKPBOUDY7BF7NOR6WINCZ7FOBMEH",
      type: "ed25519_public_key",
    },
  ],
  data: {},
  num_sponsoring: 0,
  num_sponsored: 0,
  paging_token: "GBIPXRJY4MRSO7IFGTS7KTJOAC2TUKPBOUDY7BF7NOR6WINCZ7FOBMEH",
};

const MOCK_TRUSTLINE_TX_RESPONSE = {
  _links: {},
  id: "f59fce08744b9e68cbcbd4c707d1c916de7302c1b3c3998889479510c5c5e515",
  paging_token: "9257093336932352",
  successful: true,
  hash: "f59fce08744b9e68cbcbd4c707d1c916de7302c1b3c3998889479510c5c5e515",
  ledger: 2155335,
  created_at: "2025-12-17T15:32:43Z",
  source_account: "GCU2RU4PZHHG5XUWYC2FX3DEKQ6YAJB4IZOOLFZ3ZHCYOS4DQBTD7ABH",
  source_account_sequence: "9257076157054977",
  fee_account: "GCU2RU4PZHHG5XUWYC2FX3DEKQ6YAJB4IZOOLFZ3ZHCYOS4DQBTD7ABH",
  fee_charged: "100",
  max_fee: "100",
  operation_count: 1,
  envelope_xdr:
    "AAAAAgAAAACpqNOPyc5u3pbAtFvsZFQ9gCQ8RlzllzvJxYdLg4BmPwAAAGQAIONDAAAAAQAAAAEAAAAAAAAAAAAAAABpQs1JAAAAAAAAAAEAAAAAAAAABgAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layf/////////8AAAAAAAAAAYOAZj8AAABAkjOksyUV59P8RVYjdEIYlFnDA8AzinWxnNArZgmpeHcJYgK49EzpMsl/5BtO3UBl4VCYzQkeWCqW9z/bBzCLCg==",
  result_xdr: "AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAAGAAAAAAAAAAA=",
  fee_meta_xdr:
    "AAAAAgAAAAMAIONDAAAAAAAAAACpqNOPyc5u3pbAtFvsZFQ9gCQ8RlzllzvJxYdLg4BmPwAAABdIdugAACDjQwAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAEAIONHAAAAAAAAAACpqNOPyc5u3pbAtFvsZFQ9gCQ8RlzllzvJxYdLg4BmPwAAABdIduecACDjQwAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAA==",
  memo_type: "none",
  signatures: [
    "kjOksyUV59P8RVYjdEIYlFnDA8AzinWxnNArZgmpeHcJYgK49EzpMsl/5BtO3UBl4VCYzQkeWCqW9z/bBzCLCg==",
  ],
  preconditions: {
    timebounds: {
      min_time: "0",
      max_time: "1765985609",
    },
  },
};

const MOCK_FRIENDBOT_RESPONSE_ALREADY_FUNDED = {
  type: "https://stellar.org/friendbot-errors/bad_request",
  title: "Bad Request",
  status: 400,
  detail: "account already funded to starting balance",
};
