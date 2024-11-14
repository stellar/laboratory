import { test, expect } from "@playwright/test";

test.describe("View XDR Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/xdr/view");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("View XDR");
  });

  test("Import TransactionEnvelope XDR", async ({ page }) => {
    const jsonView = page.getByTestId("view-xdr-render-json");
    const clearBtn = page.getByText("Clear XDR");
    const claimableBalanceOp = page.getByTestId(
      "view-xdr-claimable-balance-container",
    );

    // XDR JSON not visible
    await expect(jsonView).toBeHidden();

    // Clear button disabled
    await expect(clearBtn).toBeDisabled();

    // XDR input
    const xdrInput = page.getByLabel("Base-64 encoded XDR");
    await xdrInput.fill(MOCK_TX_TRANSACTION_ENVELOPE);

    await expect(xdrInput).toHaveValue(MOCK_TX_TRANSACTION_ENVELOPE);

    // XDR type
    await expect(page.getByLabel("XDR type")).toHaveValue(
      "TransactionEnvelope",
    );

    // Transaction hash
    await expect(page.getByLabel("Transaction hash")).toHaveValue(
      MOCK_TX_TRANSACTION_ENVELOPE_HASH,
    );

    // XDR JSON visible
    await expect(jsonView).toBeVisible();

    // Claimable balance operations not visible
    await expect(claimableBalanceOp).toBeHidden();

    // Clear button enabled
    await expect(clearBtn).toBeEnabled();

    // Clear screen
    await clearBtn.click();

    await expect(xdrInput).toHaveValue("");
  });

  test("Import TransactionResult XDR", async ({ page }) => {
    const xdrInput = page.getByLabel("Base-64 encoded XDR");
    await xdrInput.fill(MOCK_TX_TRANSACTION_RESULT);

    const xdrTypeInput = page.getByLabel("XDR type");
    const xdrTypeOptions = page.getByTestId("xdr-type-select-options");
    const jsonView = page.getByTestId("view-xdr-render-json");
    const decodeErrorMsg = page.getByText(
      "Unable to decode input as TransactionEnvelope: xdr value invalid. Select another XDR type.",
    );

    // Initial state
    await expect(xdrTypeInput).toHaveValue("TransactionEnvelope");

    // Show unable to decode message
    await expect(decodeErrorMsg).toBeVisible();
    await expect(xdrTypeOptions).toBeHidden();
    await expect(jsonView).toBeHidden();

    // Select TransactionResult type from options
    await xdrTypeInput.focus();
    await expect(xdrTypeOptions).toBeVisible();
    await page.getByText("TransactionResultPossible Type").first().click();

    // Decode XDR for the correct type
    await expect(xdrTypeInput).toHaveValue("TransactionResult");
    await expect(decodeErrorMsg).toBeHidden();
    await expect(jsonView).toBeVisible();
  });

  test("Import TransactionMeta XDR", async ({ page }) => {
    const xdrInput = page.getByLabel("Base-64 encoded XDR");
    await xdrInput.fill(MOCK_TX_TRANSACTION_META);

    const xdrTypeInput = page.getByLabel("XDR type");
    const xdrTypeOptions = page.getByTestId("xdr-type-select-options");
    const jsonView = page.getByTestId("view-xdr-render-json");
    const decodeErrorMsg = page.getByText(
      "Unable to decode input as TransactionEnvelope: xdr value invalid. Select another XDR type.",
    );

    // Initial state
    await expect(xdrTypeInput).toHaveValue("TransactionEnvelope");

    // Show unable to decode message
    await expect(decodeErrorMsg).toBeVisible();
    await expect(xdrTypeOptions).toBeHidden();
    await expect(jsonView).toBeHidden();

    // Select TransactionResult type from options
    await xdrTypeInput.focus();
    await expect(xdrTypeOptions).toBeVisible();
    await page.getByText("TransactionMetaPossible Type").first().click();

    // Decode XDR for the correct type
    await expect(xdrTypeInput).toHaveValue("TransactionMeta");
    await expect(decodeErrorMsg).toBeHidden();
    await expect(jsonView).toBeVisible();
  });

  test("Import transaction with claimable balance operation", async ({
    page,
  }) => {
    const xdrInput = page.getByLabel("Base-64 encoded XDR");
    await xdrInput.fill(MOCK_TX_TRANSACTION_ENVELOPE_CLAIMABLE_BALANCE);

    const jsonView = page.getByTestId("view-xdr-render-json");
    const claimableBalanceOp = page.getByTestId(
      "view-xdr-claimable-balance-container",
    );

    await expect(jsonView).toBeVisible();
    await expect(claimableBalanceOp).toBeVisible();
  });

  test("Fetch latest transaction", async ({ page }) => {
    // Click to fetch
    await page
      .getByText("or fetch the latest transaction to try it out")
      .click();

    // Mock fetch latest transaction response
    await page.route("*/**/transactions?limit=1&order=desc", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/hal+json; charset=utf-8",
        body: JSON.stringify(MOCK_LATEST_TX_RESPONSE),
      });
    });

    // XDR input
    await expect(page.getByLabel("Base-64 encoded XDR")).toHaveValue(
      MOCK_TX_TRANSACTION_ENVELOPE,
    );

    // Transaction hash
    await expect(page.getByLabel("Transaction hash")).toHaveValue(
      MOCK_TX_TRANSACTION_ENVELOPE_HASH,
    );

    // XDR type
    await expect(page.getByLabel("XDR type")).toHaveValue(
      "TransactionEnvelope",
    );
  });

  test("Invalid XDR", async ({ page }) => {
    const decodeErrorMsg = page.getByText(
      "Unable to decode input as TransactionEnvelope: length limit exceeded. Select another XDR type.",
    );

    await expect(decodeErrorMsg).toBeHidden();

    const xdrInput = page.getByLabel("Base-64 encoded XDR");
    await xdrInput.fill("AAA");

    await expect(decodeErrorMsg).toBeVisible();
  });
});

// =============================================================================
// Mock data
// =============================================================================
const MOCK_TX_TRANSACTION_ENVELOPE =
  "AAAAAgAAAAAYheerp3FCahtW+3qusxzklJhfxMPQJERfPKY0lXnVjQAPQkAADQg/AAAAJAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAABB90WssODNIgi6BHveqzxTRmIpvAFRyVNM+Hm2GVuCcAAAAAAAAAADGfZUR9pNoQGv+u6uGjdcwVF3zlb/mjyN53fUCn+iBGQAAABdIdugAAAAAAAAAAAKVedWNAAAAQA8JEfXRL2BLjcYHYX+6Dloij4OIR44zsu6hd9CSI/rQSgGulcIFmzY0sX4LIxdwCg/3UMOfXFEpGxIsDvaJEQuGVuCcAAAAQBYyy1VZl3iPQBI4hyv4e91Xv9KfM54jWWLVoh2HEjTWzPUsTlo6e2u/zGi+dcZxbNy/1MV9ipZuflVzLHPKlgs=";
const MOCK_TX_TRANSACTION_ENVELOPE_HASH =
  "690b27bc3708ccaf6a97a136fe02ba1f52a3203ef6d3832f372ea3a06f38390f";
const MOCK_TX_TRANSACTION_ENVELOPE_CLAIMABLE_BALANCE =
  "AAAAAgAAAAAZCaG2HvD37MucM8Z4qhClE0XQWhEakEgovVIZfS+4JgAAAMgAADgIAAAALAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAADgAAAAAAAAAAAJiWgAAAAAEAAAAAAAAAABv1ZY2hLWb8m+1MaU/6hIGsWBvl7J70/xL8wq4+s9NSAAAAAAAAAAAAAAABAAAAABv1ZY2hLWb8m+1MaU/6hIGsWBvl7J70/xL8wq4+s9NSAAAAAAAAAAAAmJaAAAAAAAAAAAA=";
const MOCK_TX_TRANSACTION_RESULT =
  "AAAAAAAABEwAAAAAAAAACwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAABAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
const MOCK_TX_TRANSACTION_META =
  "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";

const MOCK_LATEST_TX_RESPONSE = {
  _links: {
    self: {
      href: "https://horizon-testnet.stellar.org/transactions?cursor=\u0026limit=1\u0026order=desc",
    },
    next: {
      href: "https://horizon-testnet.stellar.org/transactions?cursor=4026136703012864\u0026limit=1\u0026order=desc",
    },
    prev: {
      href: "https://horizon-testnet.stellar.org/transactions?cursor=4026136703012864\u0026limit=1\u0026order=asc",
    },
  },
  _embedded: {
    records: [
      {
        _links: {
          self: {
            href: "https://horizon-testnet.stellar.org/transactions/690b27bc3708ccaf6a97a136fe02ba1f52a3203ef6d3832f372ea3a06f38390f",
          },
          account: {
            href: "https://horizon-testnet.stellar.org/accounts/GAMILZ5LU5YUE2Q3K35XVLVTDTSJJGC7YTB5AJCEL46KMNEVPHKY24VT",
          },
          ledger: {
            href: "https://horizon-testnet.stellar.org/ledgers/937408",
          },
          operations: {
            href: "https://horizon-testnet.stellar.org/transactions/690b27bc3708ccaf6a97a136fe02ba1f52a3203ef6d3832f372ea3a06f38390f/operations{?cursor,limit,order}",
            templated: true,
          },
          effects: {
            href: "https://horizon-testnet.stellar.org/transactions/690b27bc3708ccaf6a97a136fe02ba1f52a3203ef6d3832f372ea3a06f38390f/effects{?cursor,limit,order}",
            templated: true,
          },
          precedes: {
            href: "https://horizon-testnet.stellar.org/transactions?order=asc\u0026cursor=4026136703012864",
          },
          succeeds: {
            href: "https://horizon-testnet.stellar.org/transactions?order=desc\u0026cursor=4026136703012864",
          },
          transaction: {
            href: "https://horizon-testnet.stellar.org/transactions/690b27bc3708ccaf6a97a136fe02ba1f52a3203ef6d3832f372ea3a06f38390f",
          },
        },
        id: "690b27bc3708ccaf6a97a136fe02ba1f52a3203ef6d3832f372ea3a06f38390f",
        paging_token: "4026136703012864",
        successful: true,
        hash: MOCK_TX_TRANSACTION_ENVELOPE_HASH,
        ledger: 937408,
        created_at: "2024-11-13T16:18:55Z",
        source_account:
          "GAMILZ5LU5YUE2Q3K35XVLVTDTSJJGC7YTB5AJCEL46KMNEVPHKY24VT",
        source_account_sequence: "3668241373200420",
        fee_account: "GAMILZ5LU5YUE2Q3K35XVLVTDTSJJGC7YTB5AJCEL46KMNEVPHKY24VT",
        fee_charged: "100",
        max_fee: "1000000",
        operation_count: 1,
        envelope_xdr: MOCK_TX_TRANSACTION_ENVELOPE,
        fee_meta_xdr:
          "AAAAAgAAAAMADkj2AAAAAAAAAAAYheerp3FCahtW+3qusxzklJhfxMPQJERfPKY0lXnVjQAAAAA8M1LUAA0IPwAAACMAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAADAAAAAAAOSPYAAAAAZzS5dwAAAAAAAAABAA5NwAAAAAAAAAAAGIXnq6dxQmobVvt6rrMc5JSYX8TD0CREXzymNJV51Y0AAAAAPDNScAANCD8AAAAjAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAwAAAAAADkj2AAAAAGc0uXcAAAAA",
        memo_type: "none",
        signatures: [
          "DwkR9dEvYEuNxgdhf7oOWiKPg4hHjjOy7qF30JIj+tBKAa6VwgWbNjSxfgsjF3AKD/dQw59cUSkbEiwO9okRCw==",
          "FjLLVVmXeI9AEjiHK/h73Ve/0p8zniNZYtWiHYcSNNbM9SxOWjp7a7/MaL51xnFs3L/UxX2Klm5+VXMsc8qWCw==",
        ],
        preconditions: {
          timebounds: {
            min_time: "0",
          },
        },
      },
    ],
  },
};
