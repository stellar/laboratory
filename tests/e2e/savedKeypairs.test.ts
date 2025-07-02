import { test, expect, Page } from "@playwright/test";
import {
  MOCK_LOCAL_STORAGE,
  SAVED_ACCOUNT_1,
  SAVED_ACCOUNT_1_RECOVERY_PHRASE,
  SAVED_ACCOUNT_1_SECRET,
  SAVED_ACCOUNT_2,
} from "./mock/localStorage";

test.describe("Saved Keypairs Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/account/saved");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Saved Keypairs");
  });

  test("Show no saved keypairs message", async ({ page }) => {
    await expect(
      page.getByText("There are no saved keypairs on Testnet network."),
    ).toBeVisible();
  });

  test.describe("Saved accounts", () => {
    // Setting page context to share among all the tests in this section to keep
    // local storage data
    let pageContext: Page;

    test.beforeAll(async ({ browser }) => {
      const browserContext = await browser.newContext({
        storageState: MOCK_LOCAL_STORAGE,
      });
      pageContext = await browserContext.newPage();

      await pageContext.goto("http://localhost:3000/account/saved");

      // Account 1 response (funded)
      await pageContext.route(
        `*/**/accounts/${SAVED_ACCOUNT_1}`,
        async (route) => {
          await route.fulfill({
            status: 200,
            contentType: "application/hal+json; charset=utf-8",
            body: JSON.stringify(MOCK_ACCOUNT_1_RESPONSE),
          });
        },
      );

      // Account 2 response (unfunded)
      await pageContext.route(
        `*/**/accounts/${SAVED_ACCOUNT_2}`,
        async (route) => {
          await route.fulfill({
            status: 404,
            contentType: "application/problem+json; charset=utf-8",
            body: JSON.stringify(MOCK_ACCOUNT_2_RESPONSE_UNFUNDED),
          });
        },
      );
    });

    test("Loads", async () => {
      await expect(
        pageContext.getByText(
          "There are no saved keypairs on Testnet network.",
        ),
      ).toBeHidden();

      const keypairItems = pageContext.getByTestId("saved-keypair-item");

      await expect(keypairItems).toHaveCount(2);
    });

    test("Funded account", async () => {
      const keypairItem = pageContext.getByTestId("saved-keypair-item").first();

      await expect(keypairItem).toBeVisible();
      await expect(keypairItem.getByTestId("saved-keypair-name")).toHaveValue(
        "Account 1",
      );
      await expect(keypairItem.getByTestId("saved-keypair-pk")).toHaveValue(
        SAVED_ACCOUNT_1,
      );
      await expect(keypairItem.getByTestId("saved-keypair-sk")).toHaveValue(
        SAVED_ACCOUNT_1_SECRET,
      );
      await expect(keypairItem.getByTestId("saved-keypair-rp")).toHaveValue(
        SAVED_ACCOUNT_1_RECOVERY_PHRASE,
      );
      await expect(
        keypairItem.getByText("Balance: 10000.0000000 XLM", { exact: true }),
      ).toBeVisible();
      await expect(
        keypairItem.getByText("Last saved Nov 22, 2024, 3:04 PM UTC", {
          exact: true,
        }),
      ).toBeVisible();
    });

    test("Delete keypair", async () => {
      const keypairItem = pageContext.getByTestId("saved-keypair-item").first();
      const deleteButton = keypairItem.locator(".Button--error");

      await deleteButton.click();

      const keypairItems = pageContext.getByTestId("saved-keypair-item");
      await expect(keypairItems).toHaveCount(1);
    });
  });
});

// =============================================================================
// Mock data
// =============================================================================
const MOCK_ACCOUNT_1_RESPONSE = {
  _links: {
    self: {
      href: "https://horizon-testnet.stellar.org/accounts/GDREGRXN4NCEKRACVD4SPMQTF6IEMNVSYT6ELCECQNEOPAIFA7MYVY6K",
    },
    transactions: {
      href: "https://horizon-testnet.stellar.org/accounts/GDREGRXN4NCEKRACVD4SPMQTF6IEMNVSYT6ELCECQNEOPAIFA7MYVY6K/transactions{?cursor,limit,order}",
      templated: true,
    },
    operations: {
      href: "https://horizon-testnet.stellar.org/accounts/GDREGRXN4NCEKRACVD4SPMQTF6IEMNVSYT6ELCECQNEOPAIFA7MYVY6K/operations{?cursor,limit,order}",
      templated: true,
    },
    payments: {
      href: "https://horizon-testnet.stellar.org/accounts/GDREGRXN4NCEKRACVD4SPMQTF6IEMNVSYT6ELCECQNEOPAIFA7MYVY6K/payments{?cursor,limit,order}",
      templated: true,
    },
    effects: {
      href: "https://horizon-testnet.stellar.org/accounts/GDREGRXN4NCEKRACVD4SPMQTF6IEMNVSYT6ELCECQNEOPAIFA7MYVY6K/effects{?cursor,limit,order}",
      templated: true,
    },
    offers: {
      href: "https://horizon-testnet.stellar.org/accounts/GDREGRXN4NCEKRACVD4SPMQTF6IEMNVSYT6ELCECQNEOPAIFA7MYVY6K/offers{?cursor,limit,order}",
      templated: true,
    },
    trades: {
      href: "https://horizon-testnet.stellar.org/accounts/GDREGRXN4NCEKRACVD4SPMQTF6IEMNVSYT6ELCECQNEOPAIFA7MYVY6K/trades{?cursor,limit,order}",
      templated: true,
    },
    data: {
      href: "https://horizon-testnet.stellar.org/accounts/GDREGRXN4NCEKRACVD4SPMQTF6IEMNVSYT6ELCECQNEOPAIFA7MYVY6K/data/{key}",
      templated: true,
    },
  },
  id: "GDREGRXN4NCEKRACVD4SPMQTF6IEMNVSYT6ELCECQNEOPAIFA7MYVY6K",
  account_id: "GDREGRXN4NCEKRACVD4SPMQTF6IEMNVSYT6ELCECQNEOPAIFA7MYVY6K",
  sequence: "4914705307009024",
  subentry_count: 0,
  last_modified_ledger: 1144294,
  last_modified_time: "2024-11-25T15:57:29Z",
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
      key: "GDREGRXN4NCEKRACVD4SPMQTF6IEMNVSYT6ELCECQNEOPAIFA7MYVY6K",
      type: "ed25519_public_key",
    },
  ],
  data: {},
  num_sponsoring: 0,
  num_sponsored: 0,
  paging_token: "GDREGRXN4NCEKRACVD4SPMQTF6IEMNVSYT6ELCECQNEOPAIFA7MYVY6K",
};

const MOCK_ACCOUNT_2_RESPONSE_UNFUNDED = {
  type: "https://stellar.org/horizon-errors/not_found",
  title: "Resource Missing",
  status: 404,
  detail:
    "The resource at the url requested was not found.  This usually occurs for one of two reasons:  The url requested is not valid, or no data in our database could be found with the parameters provided.",
};
