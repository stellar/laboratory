import { test, expect, Page } from "@playwright/test";

test.describe("Build Transaction Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/transaction/build");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Build Transaction");
  });

  test("Initial state with errors", async ({ page }) => {
    const { paramsErrors, operationsErrors, txnSuccess } =
      getOperationsErrorsAndSuccessElements(page);

    await expect(paramsErrors).toBeVisible();
    await expect(operationsErrors).toBeVisible();
    await expect(txnSuccess).toBeHidden();

    // Default errors to fill required params
    await expect(paramsErrors.getByRole("listitem")).toHaveText([
      "Source Account is a required field",
      "Transaction Sequence Number is a required field",
    ]);

    await expect(
      operationsErrors.getByText("Operation #0").locator("+ ul"),
    ).toHaveText(["Select operation type"]);
  });

  test.describe("Params", () => {
    test("Happy path", async ({ page }) => {
      const { paramsErrors } = getOperationsErrorsAndSuccessElements(page);
      const fetchNextSeqButton = page.getByText("Fetch next sequence");

      await expect(fetchNextSeqButton).toBeDisabled();

      // Source account
      await page.getByLabel("Source Account").fill(SOURCE_ACCOUNT);

      // Sequence number
      await expect(fetchNextSeqButton).toBeEnabled();
      await fetchNextSeqButton.click();

      // Base fee
      await expect(page.getByLabel("Base fee")).toHaveValue("100");

      // Mock fetch next sequence number
      await page.route(`*/**/accounts/${SOURCE_ACCOUNT}`, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/hal+json; charset=utf-8",
          body: JSON.stringify(MOCK_SOURCE_ACCOUNT_RESPONSE),
        });
      });

      await expect(page.getByLabel("Transaction Sequence Number")).toHaveValue(
        SEQUENCE_NUMBER,
      );

      // Memo
      await page
        .getByTestId("memo-picker")
        .locator(".RadioPicker__item")
        .filter({ hasText: "Text" })
        .click();

      await expect(paramsErrors.getByRole("listitem")).toHaveText([
        "Memo value is required when memo type is selected",
      ]);
      const memoValueInput = page.getByPlaceholder(
        "UTF-8 string of up to 28 bytes",
      );
      await memoValueInput.fill("123");
      await expect(paramsErrors).toBeHidden();

      // Time bounds
      const lowerTimeBoundsInput = page.getByPlaceholder(
        "Lower time bound unix timestamp. Ex: 1479151713",
      );
      const upperTimeBoundsInput = page.getByPlaceholder(
        "Upper time bound unix timestamp. Ex: 1479151713",
      );

      await lowerTimeBoundsInput.fill("1729270000");
      await expect(lowerTimeBoundsInput.locator("+ div")).toHaveText(
        "Fri, Oct 18, 2024, 16:46:40 UTC",
      );

      await upperTimeBoundsInput.fill("1729517340");
      await expect(upperTimeBoundsInput.locator("+ div")).toHaveText(
        /Mon, Oct 21, 2024, 13:29:00 UTC/,
      );

      // Clear params
      await expect(paramsErrors).toBeHidden();
      await page.getByText("Clear Params").click();
      await expect(paramsErrors).toBeVisible();
    });

    test("Validation", async ({ page }) => {
      // Source account
      await page.getByLabel("Source Account").fill("aaa");
      await expect(page.getByText("Public key is invalid.")).toBeVisible();

      // Sequence number
      await page.getByLabel("Transaction Sequence Number").fill("aaa");
      await expect(
        page.getByText("Expected a whole number.").nth(0),
      ).toBeVisible();

      // Base fee
      await page.getByLabel("Base Fee").fill("aaa");
      await expect(
        page.getByText("Expected a whole number.").nth(1),
      ).toBeVisible();

      // Memo
      await selectRadioPicker({
        page,
        testId: "memo-picker",
        selectOption: "ID",
      });

      const memoValueInput = page.getByPlaceholder("Unsigned 64-bit integer");
      await memoValueInput.fill("aaa");
      await expect(
        page.getByText("Memo ID accepts a positive integer."),
      ).toBeVisible();

      // Time bounds
      await page
        .getByPlaceholder("Lower time bound unix timestamp. Ex: 1479151713")
        .fill("aaa");
      await expect(
        page.getByText("Lower time bound: Expected a whole number."),
      ).toBeVisible();

      await page
        .getByPlaceholder("Upper time bound unix timestamp. Ex: 1479151713")
        .fill("aaa");
      await expect(
        page.getByText("Upper time bound: Expected a whole number."),
      ).toBeVisible();
    });
  });

  test.describe("Operation", () => {
    test.beforeEach(async ({ page }) => {
      // Set params
      await page.getByLabel("Source Account").fill(SOURCE_ACCOUNT);
      await page
        .getByLabel("Transaction Sequence Number")
        .fill(SEQUENCE_NUMBER);
    });

    test("Add operation works", async ({ page }) => {
      const { operationsErrors } = getOperationsErrorsAndSuccessElements(page);

      await expect(
        operationsErrors.getByText("Operation #0").locator("+ ul"),
      ).toHaveText(["Select operation type"]);

      await expect(operationsErrors.getByText("Operation #1")).toBeHidden();

      await page.getByText("Add Operation").click();

      await expect(operationsErrors.getByText("Operation #1")).toBeVisible();
      await expect(
        operationsErrors.getByText("Operation #1").locator("+ ul"),
      ).toHaveText(["Select operation type"]);
    });

    // Create Account
    test.describe("Create Account", () => {
      test("Happy path", async ({ page }) => {
        const { paramsErrors, operationsErrors, txnSuccess } =
          getOperationsErrorsAndSuccessElements(page);

        const { operation_0 } = await selectOperationType({
          page,
          opType: "create_account",
        });

        await operation_0.getByLabel("Destination").fill(ACCOUNT_ONE);
        await operation_0.getByLabel("Starting Balance").fill("1");

        // No errors
        await expect(paramsErrors).toBeHidden();
        await expect(operationsErrors).toBeHidden();

        // Success
        await expect(txnSuccess).toBeVisible();
        await expect(
          txnSuccess.getByText("Network Passphrase").locator("+ div"),
        ).toHaveText("Test SDF Network ; September 2015");
        await expect(txnSuccess.getByText("Hash").locator("+ div")).toHaveText(
          "a93642c2e60a1c1581fc583d0bb48b5da630909e103d36ed1156fdd3e85b1c2c",
        );
        await expect(txnSuccess.getByText("XDR").locator("+ div")).toHaveText(
          "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAC23ZgEEvb0ushQAKe4Pv/scVG2zGiwNgw5EL5Yd+lQJgAAAAAAmJaAAAAAAAAAAAA=",
        );
      });

      test("Validation", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "create_account",
        });

        await testInputError({
          page,
          label: "Destination",
          value: "aaa",
          errorMessage: "Public key is invalid.",
        });

        await testInputError({
          page,
          label: "Starting Balance",
          value: "aaa",
          errorMessage:
            "Amount can only contain numbers and a period for the decimal point.",
        });

        // Error message
        const { operationsErrors } =
          getOperationsErrorsAndSuccessElements(page);

        await expect(
          operationsErrors
            .getByText("Operation #0: Create Account")
            .locator("+ ul"),
        ).toHaveText(["Fix errors"]);

        // Clear operations
        await page.getByText("Clear Operations").click();
        await expect(operation_0.getByLabel("Operation type")).toHaveValue("");
      });
    });

    // Payment
    test.describe("Payment", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "payment",
        });

        await operation_0.getByLabel("Destination").fill(ACCOUNT_ONE);

        await selectRadioPicker({
          page,
          testId: "asset-picker",
          selectOption: "Alphanumeric 4",
        });

        await operation_0.getByLabel("Asset Code").fill(ASSET_CODE);
        await operation_0.getByLabel("Issuer Account ID").fill(ASSET_ISSUER);
        await operation_0.getByLabel("Amount").fill("1");

        await testOpSuccessHashAndXdr({
          page,
          hash: "f22884243bf3eb3ec0dabbb778e43446517828957d216afc92bb347e97075229",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAAC23ZgEEvb0ushQAKe4Pv/scVG2zGiwNgw5EL5Yd+lQJgAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAAAACYloAAAAAAAAAAAA==",
        });
      });

      test("Validation", async ({ page }) => {
        await selectOperationType({
          page,
          opType: "payment",
        });

        await testInputError({
          page,
          label: "Destination",
          value: "aaa",
          errorMessage: "Public key is invalid.",
        });

        await selectRadioPicker({
          page,
          testId: "asset-picker",
          selectOption: "Alphanumeric 4",
        });

        await testInputError({
          page,
          label: "Asset Code",
          value: "aaaaa",
          errorMessage: "Asset code must be between 1 and 4 characters long.",
        });

        await testInputError({
          page,
          label: "Issuer Account ID",
          value: "aaa",
          errorMessage: "Public key is invalid.",
          nthErrorIndex: 1,
        });

        await testInputError({
          page,
          label: "Amount",
          value: "aaa",
          errorMessage:
            "Amount can only contain numbers and a period for the decimal point.",
        });
      });
    });

    // Path Payment Strict Send
    test.describe("Path Payment Strict Send", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "path_payment_strict_send",
        });

        await operation_0
          .getByLabel("Destination", { exact: true })
          .fill(ACCOUNT_ONE);

        await selectRadioPicker({
          page,
          testId: "asset-picker",
          selectOption: "Alphanumeric 4",
        });

        await operation_0.getByLabel("Asset Code").nth(0).fill(ASSET_CODE);
        await operation_0
          .getByLabel("Issuer Account ID")
          .nth(0)
          .fill(ASSET_ISSUER);
        await operation_0.getByLabel("Send Amount").fill("1");

        await operation_0.getByText("Add intermediate asset").click();
        await selectRadioPicker({
          page,
          testId: "asset-multipicker-0",
          selectOption: "Native",
        });

        await selectRadioPicker({
          page,
          testId: "asset-picker",
          selectOption: "Native",
          nthIndex: 1,
        });

        await operation_0.getByLabel("Minimum Destination Amount").fill("1");

        await testOpSuccessHashAndXdr({
          page,
          hash: "84df50364c513a3861d1ffc319bce73c7eb9cc34a74cfca88b898ba82535bd47",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAADQAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAAAACYloAAAAAAtt2YBBL29LrIUACnuD7/7HFRtsxosDYMORC+WHfpUCYAAAAAAAAAAACYloAAAAABAAAAAAAAAAAAAAAA",
        });
      });

      test("Validation", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "path_payment_strict_send",
        });

        await operation_0.getByText("Add intermediate asset").click();
        await selectRadioPicker({
          page,
          testId: "asset-multipicker-0",
          selectOption: "Alphanumeric 4",
        });

        await testInputError({
          page,
          label: "Asset Code",
          value: "aaaaa",
          errorMessage: "Asset code must be between 1 and 4 characters long.",
          nthLabelIndex: 1,
        });

        await testInputError({
          page,
          label: "Issuer Account ID",
          value: "aaa",
          errorMessage: "Public key is invalid.",
          nthLabelIndex: 1,
        });
      });
    });

    // Path Payment Strict Receive
    test.describe("Path Payment Strict Receive", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "path_payment_strict_receive",
        });

        await operation_0
          .getByLabel("Destination", { exact: true })
          .fill(ACCOUNT_ONE);

        // Sending Asset
        await selectRadioPicker({
          page,
          testId: "asset-picker",
          selectOption: "Alphanumeric 4",
        });

        await operation_0.getByLabel("Asset Code").nth(0).fill(ASSET_CODE);
        await operation_0
          .getByLabel("Issuer Account ID")
          .nth(0)
          .fill(ASSET_ISSUER);
        await operation_0.getByLabel("Maximum send amount").fill("1");

        await operation_0.getByText("Add intermediate asset").click();
        await selectRadioPicker({
          page,
          testId: "asset-multipicker-0",
          selectOption: "Native",
        });

        // Destination Asset
        await selectRadioPicker({
          page,
          testId: "asset-picker",
          selectOption: "Native",
          nthIndex: 1,
        });

        await operation_0.getByLabel("Destination Amount").fill("1");

        await testOpSuccessHashAndXdr({
          page,
          hash: "7af482724966b41e1b0ed0ddfa3136184d1d688283364e7aa5a18031b8e40d6a",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAgAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAAAACYloAAAAAAtt2YBBL29LrIUACnuD7/7HFRtsxosDYMORC+WHfpUCYAAAAAAAAAAACYloAAAAABAAAAAAAAAAAAAAAA",
        });
      });
    });
  });
});

// =============================================================================
// Helpers
// =============================================================================
const selectRadioPicker = async ({
  page,
  testId,
  selectOption,
  nthIndex = 0,
}: {
  page: Page;
  testId: string;
  selectOption: string;
  nthIndex?: number;
}) => {
  await page
    .getByTestId(testId)
    .nth(nthIndex)
    .locator(".RadioPicker__item")
    .filter({ hasText: selectOption })
    .click();
};

const getOperationsErrorsAndSuccessElements = (page: Page) => {
  const paramsErrors = page.getByTestId("build-transaction-params-errors");
  const operationsErrors = page.getByTestId(
    "build-transaction-operations-errors",
  );
  const txnSuccess = page.getByTestId("build-transaction-envelope-xdr");

  return { paramsErrors, operationsErrors, txnSuccess };
};

const selectOperationType = async ({
  page,
  opType,
}: {
  page: Page;
  opType: string;
}) => {
  const operation_0 = page.getByTestId("build-transaction-operation-0");
  await operation_0
    .getByLabel("Operation type")
    .selectOption({ value: opType });

  return { operation_0 };
};

const testOpSuccessHashAndXdr = async ({
  page,
  hash,
  xdr,
}: {
  page: Page;
  hash: string;
  xdr: string;
}) => {
  const txnSuccess = page.getByTestId("build-transaction-envelope-xdr");

  await expect(txnSuccess.getByText("Hash").locator("+ div")).toHaveText(hash);
  await expect(txnSuccess.getByText("XDR").locator("+ div")).toHaveText(xdr);
};

const testInputError = async ({
  page,
  label,
  value,
  errorMessage,
  nthErrorIndex = 0,
  nthLabelIndex = 0,
  exact = false,
}: {
  page: Page;
  label: string;
  value: string;
  errorMessage: string;
  nthErrorIndex?: number;
  nthLabelIndex?: number;
  exact?: boolean;
}) => {
  const operation_0 = page.getByTestId("build-transaction-operation-0");

  await operation_0.getByLabel(label, { exact }).nth(nthLabelIndex).fill(value);
  await expect(
    operation_0.getByText(errorMessage).nth(nthErrorIndex),
  ).toBeVisible();
};

// =============================================================================
// Mock data
// =============================================================================
const SOURCE_ACCOUNT =
  "GAGSY6UVUIINHRHSSDO7NMCM7ADWUF5UJ4ZGGJSFSXKWNJDRW6AA4H3Q";
const MOCK_SOURCE_ACCOUNT_RESPONSE = {
  _links: {
    self: {
      href: "https://horizon-testnet.stellar.org/accounts/GAGSY6UVUIINHRHSSDO7NMCM7ADWUF5UJ4ZGGJSFSXKWNJDRW6AA4H3Q",
    },
    transactions: {
      href: "https://horizon-testnet.stellar.org/accounts/GAGSY6UVUIINHRHSSDO7NMCM7ADWUF5UJ4ZGGJSFSXKWNJDRW6AA4H3Q/transactions{?cursor,limit,order}",
      templated: true,
    },
    operations: {
      href: "https://horizon-testnet.stellar.org/accounts/GAGSY6UVUIINHRHSSDO7NMCM7ADWUF5UJ4ZGGJSFSXKWNJDRW6AA4H3Q/operations{?cursor,limit,order}",
      templated: true,
    },
    payments: {
      href: "https://horizon-testnet.stellar.org/accounts/GAGSY6UVUIINHRHSSDO7NMCM7ADWUF5UJ4ZGGJSFSXKWNJDRW6AA4H3Q/payments{?cursor,limit,order}",
      templated: true,
    },
    effects: {
      href: "https://horizon-testnet.stellar.org/accounts/GAGSY6UVUIINHRHSSDO7NMCM7ADWUF5UJ4ZGGJSFSXKWNJDRW6AA4H3Q/effects{?cursor,limit,order}",
      templated: true,
    },
    offers: {
      href: "https://horizon-testnet.stellar.org/accounts/GAGSY6UVUIINHRHSSDO7NMCM7ADWUF5UJ4ZGGJSFSXKWNJDRW6AA4H3Q/offers{?cursor,limit,order}",
      templated: true,
    },
    trades: {
      href: "https://horizon-testnet.stellar.org/accounts/GAGSY6UVUIINHRHSSDO7NMCM7ADWUF5UJ4ZGGJSFSXKWNJDRW6AA4H3Q/trades{?cursor,limit,order}",
      templated: true,
    },
    data: {
      href: "https://horizon-testnet.stellar.org/accounts/GAGSY6UVUIINHRHSSDO7NMCM7ADWUF5UJ4ZGGJSFSXKWNJDRW6AA4H3Q/data/{key}",
      templated: true,
    },
  },
  id: "GAGSY6UVUIINHRHSSDO7NMCM7ADWUF5UJ4ZGGJSFSXKWNJDRW6AA4H3Q",
  account_id: "GAGSY6UVUIINHRHSSDO7NMCM7ADWUF5UJ4ZGGJSFSXKWNJDRW6AA4H3Q",
  sequence: "4466559829409792",
  subentry_count: 0,
  last_modified_ledger: 1039952,
  last_modified_time: "2024-11-19T14:53:10Z",
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
      key: "GAGSY6UVUIINHRHSSDO7NMCM7ADWUF5UJ4ZGGJSFSXKWNJDRW6AA4H3Q",
      type: "ed25519_public_key",
    },
  ],
  data: {},
  num_sponsoring: 0,
  num_sponsored: 0,
  paging_token: "GAGSY6UVUIINHRHSSDO7NMCM7ADWUF5UJ4ZGGJSFSXKWNJDRW6AA4H3Q",
};
const SEQUENCE_NUMBER = "4466559829409793";
const ACCOUNT_ONE = "GC3N3GAECL3PJOWIKAAKPOB677WHCUNWZRULANQMHEIL4WDX5FICMF3I";
const ASSET_CODE = "USDC";
const ASSET_ISSUER = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";
