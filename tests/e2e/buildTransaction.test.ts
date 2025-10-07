import { test, expect, Page } from "@playwright/test";
import { mockSimulateTx } from "./mock/helpers";

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

  test("Save transaction modal works", async ({ page }) => {
    await page.getByLabel("Source Account").fill(SOURCE_ACCOUNT);
    await page.getByLabel("Transaction Sequence Number").fill(SEQUENCE_NUMBER);

    const saveTxButton = page.getByTitle("Save transaction");

    await expect(saveTxButton).toBeDisabled();

    const { operation_0 } = await selectOperationType({
      page,
      opType: "create_account",
    });

    await operation_0.getByLabel("Destination").fill(ACCOUNT_ONE);
    await operation_0.getByLabel("Starting Balance").fill("1");

    await expect(saveTxButton).toBeEnabled();
    await saveTxButton.click();

    const modal = page.locator(".Modal");

    await expect(modal).toBeVisible();
    await expect(page.locator(".ModalHeading")).toHaveText("Save Transaction");

    await modal.getByLabel("Name", { exact: true }).fill("Transaction 1");
    await modal.getByText("Save", { exact: true }).click();

    await expect(modal).toBeHidden();
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

      await fetchNextSeqButton.click();

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

    // Manage Sell Offer
    test.describe("Manage Sell Offer", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "manage_sell_offer",
        });

        await selectRadioPicker({
          page,
          testId: "asset-picker",
          selectOption: "Native",
          nthIndex: 0,
        });

        await selectRadioPicker({
          page,
          testId: "asset-picker",
          selectOption: "Alphanumeric 4",
          nthIndex: 1,
        });

        await operation_0.getByLabel("Asset Code").nth(1).fill(ASSET_CODE);
        await operation_0
          .getByLabel("Issuer Account ID")
          .nth(1)
          .fill(ASSET_ISSUER);

        await operation_0.getByLabel("Amount you are selling").fill("1");
        await operation_0
          .getByLabel("Price of 1 unit of selling in terms of buying")
          .fill("2");

        await expect(operation_0.getByLabel("Offer ID")).toHaveValue("0");

        await testOpSuccessHashAndXdr({
          page,
          hash: "aeb031d72eee5fd7dc2d53a8a70ce69fcddc07d37cc9a0fd7fb4523883fb4e91",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAwAAAAAAAAABVVNEQwAAAABCPn0F8uyvv+wZKyFaPxvpau242OcCVKvjQT4CB95WsgAAAAAAmJaAAAAAAgAAAAEAAAAAAAAAAAAAAAAAAAAA",
        });
      });

      test("Validation", async ({ page }) => {
        await selectOperationType({
          page,
          opType: "manage_sell_offer",
        });

        await testInputError({
          page,
          label: "Amount you are selling",
          value: "aaa",
          errorMessage:
            "Amount can only contain numbers and a period for the decimal point.",
        });

        await testInputError({
          page,
          label: "Price of 1 unit of selling in terms of buying",
          value: "aaa",
          errorMessage:
            "Expected a positive number with a period for the decimal point.",
        });

        await testInputError({
          page,
          label: "Offer ID",
          value: "aaa",
          errorMessage: "Expected a whole number.",
        });
      });
    });

    // Manage Buy Offer
    test.describe("Manage Buy Offer", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "manage_buy_offer",
        });

        await selectRadioPicker({
          page,
          testId: "asset-picker",
          selectOption: "Native",
          nthIndex: 0,
        });

        await selectRadioPicker({
          page,
          testId: "asset-picker",
          selectOption: "Alphanumeric 4",
          nthIndex: 1,
        });

        await operation_0.getByLabel("Asset Code").nth(1).fill(ASSET_CODE);
        await operation_0
          .getByLabel("Issuer Account ID")
          .nth(1)
          .fill(ASSET_ISSUER);

        await operation_0.getByLabel("Amount you are buying").fill("1");
        await operation_0
          .getByLabel("Price of 1 unit of buying in terms of selling")
          .fill("2");

        await expect(operation_0.getByLabel("Offer ID")).toHaveValue("0");

        await testOpSuccessHashAndXdr({
          page,
          hash: "01d3a1f320ede12976260e4d30d15c4530b21241e91b6cbbe03c405b8f6d9de2",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAADAAAAAAAAAABVVNEQwAAAABCPn0F8uyvv+wZKyFaPxvpau242OcCVKvjQT4CB95WsgAAAAAAmJaAAAAAAgAAAAEAAAAAAAAAAAAAAAAAAAAA",
        });
      });
    });

    // Create Passive Sell Offer
    test.describe("Create Passive Sell Offer", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "create_passive_sell_offer",
        });

        await selectRadioPicker({
          page,
          testId: "asset-picker",
          selectOption: "Native",
          nthIndex: 0,
        });

        await selectRadioPicker({
          page,
          testId: "asset-picker",
          selectOption: "Alphanumeric 4",
          nthIndex: 1,
        });

        await operation_0.getByLabel("Asset Code").nth(1).fill(ASSET_CODE);
        await operation_0
          .getByLabel("Issuer Account ID")
          .nth(1)
          .fill(ASSET_ISSUER);

        await operation_0.getByLabel("Amount you are selling").fill("1");
        await operation_0
          .getByLabel("Price of 1 unit of selling in terms of buying")
          .fill("2");

        await testOpSuccessHashAndXdr({
          page,
          hash: "66e63ecf7ebc9c67b78e201fd604f8775b9dc7a47a1d89e836505a75557e4e1c",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAABAAAAAAAAAABVVNEQwAAAABCPn0F8uyvv+wZKyFaPxvpau242OcCVKvjQT4CB95WsgAAAAAAmJaAAAAAAgAAAAEAAAAAAAAAAA==",
        });
      });
    });

    // Set Options
    test.describe("Set Options", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "set_options",
        });

        // Set flags
        const setFlagsPicker = page.getByTestId("flag-field-picker").nth(0);
        const setFlagsOptions = setFlagsPicker.locator(".RadioPicker__item");

        await setFlagsOptions
          .filter({ hasText: "Authorization required" })
          .click();
        await setFlagsOptions
          .filter({ hasText: "Authorization revocable" })
          .click();
        await setFlagsOptions
          .filter({ hasText: "Authorization immutable" })
          .click();
        await setFlagsOptions
          .filter({ hasText: "Authorization clawback enabled" })
          .click();

        await expect(
          setFlagsPicker.getByText(
            "Authorization required (1) + Authorization revocable (2) + Authorization immutable (4) + Authorization clawback enabled (8) = 15",
          ),
        ).toBeVisible();

        // Clear flags
        const clearFlagsPicker = page.getByTestId("flag-field-picker").nth(1);
        const clearFlagsOptions =
          clearFlagsPicker.locator(".RadioPicker__item");

        await clearFlagsOptions
          .filter({ hasText: "Authorization required" })
          .click();
        await clearFlagsOptions
          .filter({ hasText: "Authorization revocable" })
          .click();
        await clearFlagsOptions
          .filter({ hasText: "Authorization clawback enabled" })
          .click();

        await expect(
          clearFlagsPicker.getByText(
            "Authorization required (1) + Authorization revocable (2) + Authorization clawback enabled (8) = 11",
          ),
        ).toBeVisible();

        await operation_0.getByLabel("Master Weight").fill("1");
        await operation_0.getByLabel("Low Threshold").fill("2");
        await operation_0.getByLabel("Medium Threshold").fill("3");
        await operation_0.getByLabel("High Threshold").fill("4");

        await operation_0
          .locator(`[id="0-set_options-signer"]`)
          .selectOption({ value: "ed25519PublicKey" });

        await operation_0.getByLabel("Key", { exact: true }).fill(ACCOUNT_ONE);
        await operation_0.getByLabel("Weight", { exact: true }).fill("5");

        await operation_0.getByLabel("Home Domain").fill("test.org");

        await testOpSuccessHashAndXdr({
          page,
          hash: "073fb00287ddc690ebe11682305fd5e81f9db9062be577df02692143c02f367f",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAABQAAAAAAAAABAAAACwAAAAEAAAAPAAAAAQAAAAEAAAABAAAAAgAAAAEAAAADAAAAAQAAAAQAAAABAAAACHRlc3Qub3JnAAAAAQAAAAC23ZgEEvb0ushQAKe4Pv/scVG2zGiwNgw5EL5Yd+lQJgAAAAUAAAAAAAAAAA==",
        });
      });

      test("Validation", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "set_options",
        });

        await testInputError({
          page,
          label: "Master Weight",
          value: "aaa",
          errorMessage: "Expected a whole number.",
          nthErrorIndex: 0,
        });

        await testInputError({
          page,
          label: "Low Threshold",
          value: "aaa",
          errorMessage: "Expected a whole number.",
          nthErrorIndex: 1,
        });

        await testInputError({
          page,
          label: "Medium Threshold",
          value: "aaa",
          errorMessage: "Expected a whole number.",
          nthErrorIndex: 2,
        });

        await testInputError({
          page,
          label: "High Threshold",
          value: "aaa",
          errorMessage: "Expected a whole number.",
          nthErrorIndex: 3,
        });

        await operation_0
          .locator(`[id="0-set_options-signer"]`)
          .selectOption({ value: "ed25519PublicKey" });

        await testInputError({
          page,
          label: "Key",
          exact: true,
          value: "aaa",
          errorMessage: "Public key is invalid.",
        });

        await testInputError({
          page,
          label: "Weight",
          exact: true,
          value: "aaa",
          errorMessage: "Expected a whole number.",
          nthErrorIndex: 4,
        });

        await testInputError({
          page,
          label: "Home Domain",
          value: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          errorMessage: "Max length of home domain is 32 characters (got 40).",
        });
      });
    });

    // Change Trust
    test.describe("Change Trust", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "change_trust",
        });

        await selectRadioPicker({
          page,
          testId: "asset-picker",
          selectOption: "Liquidity pool shares",
          nthIndex: 0,
        });

        await selectRadioPicker({
          page,
          testId: "asset-picker",
          selectOption: "Native",
          nthIndex: 1,
        });

        await selectRadioPicker({
          page,
          testId: "asset-picker",
          selectOption: "Alphanumeric 4",
          nthIndex: 2,
        });

        await operation_0.getByLabel("Asset Code").nth(1).fill(ASSET_CODE);
        await operation_0
          .getByLabel("Issuer Account ID")
          .nth(1)
          .fill(ASSET_ISSUER);

        await expect(operation_0.getByLabel("Fee")).toHaveValue("30");

        await testOpSuccessHashAndXdr({
          page,
          hash: "12e8de530a1f9c6a88c64496760813c6958ce9829bb97cbd18058223a53e4d58",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAABgAAAAMAAAAAAAAAAAAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAAHn//////////AAAAAAAAAAA=",
        });
      });

      test("Validation", async ({ page }) => {
        await selectOperationType({
          page,
          opType: "change_trust",
        });

        await testInputError({
          page,
          label: "Trust Limit",
          value: "aaa",
          errorMessage:
            "Expected a positive number with a period for the decimal point.",
        });
      });
    });

    // Allow Trust
    test.describe("Allow Trust", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "allow_trust",
        });

        await expect(
          operation_0.getByText(
            "This operation is deprecated as of Protocol 17. Prefer SetTrustLineFlags instead.",
          ),
        ).toBeVisible();
      });
    });

    // Account Merge
    test.describe("Account Merge", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "account_merge",
        });

        await operation_0.getByLabel("Destination").fill(ACCOUNT_ONE);

        await testOpSuccessHashAndXdr({
          page,
          hash: "ba4cde50dbd3c47e08df575e63189432490125cc3e4b1582594552cfc23044ea",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAACAAAAAC23ZgEEvb0ushQAKe4Pv/scVG2zGiwNgw5EL5Yd+lQJgAAAAAAAAAA",
        });
      });
    });

    // Manage Data
    test.describe("Manage Data", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "manage_data",
        });

        await operation_0.getByLabel("Entry name").fill("Test Name");
        await operation_0.getByLabel("Entry value").fill("Test Value");

        await testOpSuccessHashAndXdr({
          page,
          hash: "59606ea77f40ee57da6ec0077eb6c796e07fd7d2c6ed5144bfd733fdf4b10691",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAACgAAAAlUZXN0IE5hbWUAAAAAAAABAAAAClRlc3QgVmFsdWUAAAAAAAAAAAAA",
        });
      });
    });

    // Bump Sequence
    test.describe("Bump Sequence", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "bump_sequence",
        });

        await operation_0
          .getByLabel("Bump To")
          .fill((Number(SEQUENCE_NUMBER) + 1).toString());

        await testOpSuccessHashAndXdr({
          page,
          hash: "65c428afe32631ed2539637ca10e3bebdbb297ac8a890dca1db918dcef580ce3",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAACwAP3lAAAAACAAAAAAAAAAA=",
        });
      });

      test("Validation", async ({ page }) => {
        await selectOperationType({
          page,
          opType: "bump_sequence",
        });

        await testInputError({
          page,
          label: "Bump To",
          value: "aaa",
          errorMessage: "Expected a whole number.",
        });
      });
    });

    // Create Claimable Balance
    test.describe("Create Claimable Balance", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "create_claimable_balance",
        });

        await selectRadioPicker({
          page,
          testId: "asset-picker",
          selectOption: "Native",
        });

        await operation_0.getByLabel("Amount", { exact: true }).fill("1");
        await operation_0.getByText("Add a claimant").click();

        const claimantEl = operation_0.getByTestId("claimants-picker");

        await expect(claimantEl.getByText("Claimant 1")).toBeVisible();

        await claimantEl
          .getByLabel("Destination", { exact: true })
          .fill(ACCOUNT_ONE);

        await claimantEl
          .getByTestId("predicate-picker")
          .getByText("Conditional", { exact: true })
          .click();

        await claimantEl
          .getByTestId("predicate-type-picker")
          .getByText("AND", { exact: true })
          .click();

        await claimantEl
          .getByTestId("predicate-picker")
          .nth(1)
          .getByText("Conditional", { exact: true })
          .click();

        await claimantEl
          .getByTestId("predicate-type-picker")
          .nth(1)
          .getByText("Time", { exact: true })
          .click();

        await claimantEl
          .getByTestId("predicate-time-picker")
          .getByText("Relative", { exact: true })
          .click();

        await claimantEl.getByLabel("Time Value").fill("1729270000");

        await claimantEl
          .getByTestId("predicate-picker")
          .nth(2)
          .getByText("Unconditional", { exact: true })
          .click();

        await expect(page.getByLabel("Claimable Balance ID")).toHaveValue(
          "00000000379df3d9e7f90a0de80d452e00ec02168f08479450ba8370aaf13c765ee988bd",
        );

        await testOpSuccessHashAndXdr({
          page,
          hash: "fc83c0c77ea2c152ee0814fcaadbdba0ea57275c34a17488c233c0fc04639e0e",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAADgAAAAAAAAAAAJiWgAAAAAEAAAAAAAAAALbdmAQS9vS6yFAAp7g+/+xxUbbMaLA2DDkQvlh36VAmAAAAAQAAAAIAAAAFAAAAAGcSkPAAAAAAAAAAAAAAAAA=",
        });
      });
    });

    // Claim Claimable Balance
    test.describe("Claim Claimable Balance", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "claim_claimable_balance",
        });

        await operation_0
          .getByLabel("Claimable Balance ID")
          .fill(
            "00000000379df3d9e7f90a0de80d452e00ec02168f08479450ba8370aaf13c765ee988bd",
          );

        await testOpSuccessHashAndXdr({
          page,
          hash: "d6a82a52a53ee9c61cfbc906ccf55d81782dc3900d0ebde2f6fbe7de5fab45be",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAADwAAAAA3nfPZ5/kKDegNRS4A7AIWjwhHlFC6g3Cq8Tx2XumIvQAAAAAAAAAA",
        });
      });

      test("Validation", async ({ page }) => {
        await selectOperationType({
          page,
          opType: "claim_claimable_balance",
        });

        await testInputError({
          page,
          label: "Claimable Balance ID",
          value: "aaa",
          errorMessage: "Claimable Balance ID is invalid.",
        });
      });
    });

    // Begin and End Sponsoring Future Reserves
    test.describe("Begin and End Sponsoring Future Reserves", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "begin_sponsoring_future_reserves",
        });

        await operation_0.getByLabel("Sponsored ID").fill(ACCOUNT_ONE);

        await page.getByText("Add Operation").click();

        const operation_1 = page.getByTestId("build-transaction-operation-1");
        await operation_1
          .getByLabel("Operation type")
          .selectOption({ value: "end_sponsoring_future_reserves" });

        await testOpSuccessHashAndXdr({
          page,
          hash: "175658bca4faee673efb5c9548c775fc0156ecb3b14e0c28a805463585ff8af9",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAMgAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAEAAAAAC23ZgEEvb0ushQAKe4Pv/scVG2zGiwNgw5EL5Yd+lQJgAAAAAAAAARAAAAAAAAAAA=",
        });
      });
    });

    // Revoke Sponsorship
    test.describe("Revoke Sponsorship", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "revoke_sponsorship",
        });

        await operation_0
          .getByLabel("Revoke Sponsorship Type")
          .selectOption({ value: "account" });

        await operation_0
          .getByLabel("Account", { exact: true })
          .fill(ACCOUNT_ONE);

        await testOpSuccessHashAndXdr({
          page,
          hash: "ae866b5937d65908fb3a8a07cb6b82f03c3dc4df9a91553783aebfaff1d4187e",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAEgAAAAAAAAAAAAAAALbdmAQS9vS6yFAAp7g+/+xxUbbMaLA2DDkQvlh36VAmAAAAAAAAAAA=",
        });
      });
    });

    // Clawback
    test.describe("Clawback", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "clawback",
        });

        await selectRadioPicker({
          page,
          testId: "asset-picker",
          selectOption: "Alphanumeric 4",
        });

        await operation_0.getByLabel("Asset Code").fill(ASSET_CODE);
        await operation_0.getByLabel("Issuer Account ID").fill(ASSET_ISSUER);
        await operation_0.getByLabel("From", { exact: true }).fill(ACCOUNT_ONE);
        await operation_0.getByLabel("Amount", { exact: true }).fill("1");

        await testOpSuccessHashAndXdr({
          page,
          hash: "0fd135ae4d3dd28d338ac78e5f6f76ea99cebebf56f22dd9370b1d7273b42825",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAEwAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAAALbdmAQS9vS6yFAAp7g+/+xxUbbMaLA2DDkQvlh36VAmAAAAAACYloAAAAAAAAAAAA==",
        });
      });
    });

    // Clawback Claimable Balance
    test.describe("Clawback Claimable Balance", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "clawback_claimable_balance",
        });

        await operation_0
          .getByLabel("Claimable Balance ID")
          .fill(
            "00000000379df3d9e7f90a0de80d452e00ec02168f08479450ba8370aaf13c765ee988bd",
          );

        await testOpSuccessHashAndXdr({
          page,
          hash: "257a9b3731e2933f9ff20f42a1db0778c379a7b41e0bab382b908ba19e780b97",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAFAAAAAA3nfPZ5/kKDegNRS4A7AIWjwhHlFC6g3Cq8Tx2XumIvQAAAAAAAAAA",
        });
      });
    });

    // Set Trust Line Flags
    test.describe("Set Trust Line Flags", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "set_trust_line_flags",
        });

        await selectRadioPicker({
          page,
          testId: "asset-picker",
          selectOption: "Alphanumeric 4",
        });

        await operation_0.getByLabel("Asset Code").fill(ASSET_CODE);
        await operation_0.getByLabel("Issuer Account ID").fill(ASSET_ISSUER);
        await operation_0.getByLabel("Trustor").fill(ACCOUNT_ONE);

        // Set flags
        const setFlagsPicker = page.getByTestId("flag-field-picker").nth(0);

        await setFlagsPicker.getByText("Authorized", { exact: true }).click();
        await setFlagsPicker
          .getByText("Authorized to maintain liabilites", { exact: true })
          .click();

        await expect(
          setFlagsPicker.getByText(
            "Authorized (1) + Authorized to maintain liabilites (2) = 3",
          ),
        ).toBeVisible();

        // Clear flags
        const clearFlagsPicker = page.getByTestId("flag-field-picker").nth(1);

        await clearFlagsPicker.getByText("Authorized", { exact: true }).click();
        await clearFlagsPicker
          .getByText("Authorized to maintain liabilites", { exact: true })
          .click();
        await clearFlagsPicker
          .getByText("Clawback enabled", { exact: true })
          .click();

        await expect(
          clearFlagsPicker.getByText(
            "Authorized (1) + Authorized to maintain liabilites (2) + Clawback enabled (4) = 7",
          ),
        ).toBeVisible();

        await testOpSuccessHashAndXdr({
          page,
          hash: "c5af39517a4f66420594e2938cd38cd813b5f31939258cf005899ed423bc25a7",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAFQAAAAC23ZgEEvb0ushQAKe4Pv/scVG2zGiwNgw5EL5Yd+lQJgAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAABwAAAAMAAAAAAAAAAA==",
        });
      });
    });

    // Liquidity Pool Deposit
    test.describe("Liquidity Pool Deposit", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "liquidity_pool_deposit",
        });

        await operation_0
          .getByLabel("Liquidity Pool ID")
          .fill(
            "67260c4c1807b262ff851b0a3fe141194936bb0215b2f77447f1df11998eabb9",
          );
        await operation_0.getByLabel("Max Amount A").fill("1");
        await operation_0.getByLabel("Max Amount B").fill("2");

        const minPricePicker = page
          .getByTestId("number-fraction-picker")
          .nth(0);

        await minPricePicker.getByText("Number", { exact: true }).click();
        await minPricePicker
          .locator(`[id="0-liquidity_pool_deposit-min_price-number"]`)
          .fill("3");

        const maxPricePicker = page
          .getByTestId("number-fraction-picker")
          .nth(1);

        await maxPricePicker.getByText("Fraction", { exact: true }).click();
        await maxPricePicker.getByLabel("Numerator").fill("4");
        await maxPricePicker.getByLabel("Denominator").fill("5");

        await testOpSuccessHashAndXdr({
          page,
          hash: "3a3272395648f4936e88406651ad33df330c749f9afc90364326d8542e4cae41",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAFmcmDEwYB7Ji/4UbCj/hQRlJNrsCFbL3dEfx3xGZjqu5AAAAAACYloAAAAAAATEtAAAAAAMAAAABAAAABAAAAAUAAAAAAAAAAA==",
        });
      });

      test("Validation", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "liquidity_pool_deposit",
        });

        await testInputError({
          page,
          label: "Max Amount A",
          value: "aaa",
          errorMessage:
            "Amount can only contain numbers and a period for the decimal point.",
          nthErrorIndex: 0,
        });

        await testInputError({
          page,
          label: "Max Amount B",
          value: "aaa",
          errorMessage:
            "Amount can only contain numbers and a period for the decimal point.",
          nthErrorIndex: 1,
        });

        const minPricePicker = page
          .getByTestId("number-fraction-picker")
          .nth(0);

        await minPricePicker.getByText("Number", { exact: true }).click();
        await minPricePicker
          .locator(`[id="0-liquidity_pool_deposit-min_price-number"]`)
          .fill("aaa");
        await expect(
          operation_0
            .getByText(
              "Amount can only contain numbers and a period for the decimal point.",
            )
            .nth(2),
        ).toBeVisible();

        const maxPricePicker = page
          .getByTestId("number-fraction-picker")
          .nth(1);

        await maxPricePicker.getByText("Fraction", { exact: true }).click();
        await maxPricePicker.getByLabel("Numerator").fill("aaa");
        await maxPricePicker.getByLabel("Denominator").fill("aaa");

        await expect(
          operation_0.getByText(
            "Numerator: Expected a whole number. Denominator: Expected a whole number.",
          ),
        ).toBeVisible();
      });
    });

    // Liquidity Pool Withdraw
    test.describe("Liquidity Pool Withdraw", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "liquidity_pool_withdraw",
        });

        await operation_0
          .getByLabel("Liquidity Pool ID")
          .fill(
            "67260c4c1807b262ff851b0a3fe141194936bb0215b2f77447f1df11998eabb9",
          );
        await operation_0.getByLabel("Amount", { exact: true }).fill("1");
        await operation_0.getByLabel("Min Amount A").fill("2");
        await operation_0.getByLabel("Min Amount B").fill("3");

        await testOpSuccessHashAndXdr({
          page,
          hash: "d5d0af78096983daa56b980cfd588176593449a5ed34be29932c604c46b33a99",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgAAAGQAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAF2cmDEwYB7Ji/4UbCj/hQRlJNrsCFbL3dEfx3xGZjqu5AAAAAACYloAAAAAAATEtAAAAAAABycOAAAAAAAAAAAA=",
        });
      });
    });

    // Soroban Extend Footprint TTL
    test.describe("Soroban Extend Footprint TTL", () => {
      test("Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "extend_footprint_ttl",
        });
        // we are going from classic operation to soroban operation
        // so the classic operation should not be visible
        await expect(operation_0).not.toBeVisible();

        const soroban_operation = page.getByTestId(
          "build-soroban-transaction-operation",
        );

        // Verify warning message about one operation limit
        await expect(
          page.getByText(
            "Note that Soroban transactions can only contain one operation per transaction.",
          ),
        ).toBeVisible();

        // Soroban Operation only allows one operation
        // Add Operation button should be disabled
        await expect(page.getByText("Add Operation")).toBeDisabled();

        // Fill in required fields
        await soroban_operation
          .getByLabel("Contract ID")
          .fill("CAQP53Z2GMZ6WVOKJWXMCVDLZYJ7GYVMWPAMWACPLEZRF2UEZW3B636S");
        await soroban_operation
          .getByLabel("Key ScVal in XDR")
          .fill(
            "AAAAEAAAAAEAAAACAAAADwAAAAdDb3VudGVyAAAAABIAAAAAAAAAAH5MvQcuICNqcxGfJ6rKFvwi77h3WDZ2XVzA+LVRkCKD",
          );
        await soroban_operation.getByLabel("Extend To").fill("30000");
        await soroban_operation
          .getByLabel("Resource Fee (in stroops)")
          .fill("20000");

        await soroban_operation
          .getByLabel("Durability")
          .selectOption({ value: "persistent" });

        const prepareTxButton = page.getByText(
          "Prepare Soroban Transaction to Sign",
        );

        // Mock simulate transaction RPC call
        await mockSimulateTx({
          page,
          responseXdr: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtug=",
        });

        await expect(prepareTxButton).toBeEnabled();
        await prepareTxButton.click();

        await testOpSuccessHashAndXdr({
          isSorobanOp: true,
          page,
          hash: "6a5f375827ddb91900f160b38e125c20c4b10a64a88842155261fc8e925c8198",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgABu0EAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAGQAAAAAAAHUwAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALboAAAAAA==",
        });
      });

      test("Validation", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "extend_footprint_ttl",
        });

        await expect(operation_0).not.toBeVisible();

        await testInputError({
          page,
          isSorobanOp: true,
          label: "Contract ID",
          value: "aaa",
          errorMessage:
            "Invalid contract ID. Please enter a valid contract ID.",
        });

        await testInputError({
          page,
          isSorobanOp: true,
          label: "Contract ID",
          value: "CAQP53Z2GMZ6WVOKJWXMCVDL",
          errorMessage:
            "Invalid contract ID. Please enter a valid contract ID.",
        });

        await testInputError({
          page,
          isSorobanOp: true,
          label: "Extend To",
          value: "aaa",
          errorMessage: "Expected a whole number.",
        });

        await testInputError({
          page,
          isSorobanOp: true,
          label: "Resource Fee (in stroops)",
          value: "aaa",
          errorMessage:
            "Expected a positive number with a period for the decimal point.",
        });
      });

      test("Check rendering between classic and soroban", async ({ page }) => {
        // Select Soroban Operation
        const { operation_0 } = await selectOperationType({
          page,
          opType: "extend_footprint_ttl",
        });
        // we are going from classic operation to soroban operation
        // so the classic operation should not be visible
        await expect(operation_0).not.toBeVisible();

        const soroban_operation = page.getByTestId(
          "build-soroban-transaction-operation",
        );

        // Verify warning message about one operation limit
        await expect(
          page.getByText(
            "Note that Soroban transactions can only contain one operation per transaction.",
          ),
        ).toBeVisible();

        // Soroban Operation only allows one operation
        // Add Operation button should be disabled
        await expect(page.getByText("Add Operation")).toBeDisabled();

        // Select Classic Operation
        await soroban_operation.getByLabel("Operation type").selectOption({
          value: "payment",
        });

        const classicOperation = page.getByTestId(
          "build-transaction-operation-0",
        );

        await expect(classicOperation).toBeVisible();

        await expect(page.getByText("Add Operation")).toBeVisible();
      });
    });

    // Soroban Restore Footprint
    test.describe("Soroban Restore Footprint", () => {
      test("[Use Xdr Ledger Key] Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "restore_footprint",
        });
        // we are going from classic operation to soroban operation
        // so the classic operation should not be visible
        await expect(operation_0).not.toBeVisible();

        const soroban_operation = page.getByTestId(
          "build-soroban-transaction-operation",
        );

        // Verify warning message about one operation limit
        await expect(
          page.getByText(
            "Note that Soroban transactions can only contain one operation per transaction.",
          ),
        ).toBeVisible();

        // Soroban Operation only allows one operation
        // Add Operation button should be disabled
        await expect(page.getByText("Add Operation")).toBeDisabled();

        // 'Use Ledger Xdr' Tab is the default tab
        const useLedgerxdrTabButton = page.getByTestId("xdr");
        await expect(useLedgerxdrTabButton).toHaveAttribute(
          "data-is-active",
          "true",
        );

        // Fill in required fields
        await soroban_operation
          .getByLabel("Ledger Key XDR")
          .fill(
            "AAAABgAAAAHnjb/OrjcmZvHY8g977QXKQQPA2B2bkpvYx6AIOObEhQAAABAAAAABAAAAAgAAAA8AAAAHQmFsYW5jZQAAAAASAAAAATF8egab3Cz7/mLNPqSklWLk+ckv622td2TFqMEZm/qcAAAAAQ==",
          );

        const contractInput = soroban_operation.getByLabel("Contract");
        await expect(contractInput).toBeDisabled();
        await expect(contractInput).toHaveValue(
          "CDTY3P6OVY3SMZXR3DZA667NAXFECA6A3AOZXEU33DD2ACBY43CIKDPT",
        );

        const scValInput = soroban_operation.getByLabel("Key (ScVal)");
        const stringifiedScVal = JSON.stringify(
          {
            vec: [
              {
                symbol: "Balance",
              },
              {
                address:
                  "CAYXY6QGTPOCZ676MLGT5JFESVROJ6OJF7VW3LLXMTC2RQIZTP5JYNEL",
              },
            ],
          },
          null,
          2,
        );
        await expect(scValInput).toBeDisabled();
        await expect(scValInput).toHaveValue(stringifiedScVal);

        const durabilityInput = page.locator("#persistent-durability-type");
        await expect(durabilityInput).toBeChecked();

        await soroban_operation
          .getByLabel("Resource Fee (in stroops)")
          .fill("20000");

        const prepareTxButton = page.getByText(
          "Prepare Soroban Transaction to Sign",
        );

        // Mock simulate transaction RPC call
        // @TODO update this after investigating restore footprint
        await mockSimulateTx({
          page,
          responseXdr: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATiA=",
        });

        await expect(prepareTxButton).toBeEnabled();
        await prepareTxButton.click();

        // @TODO update this after investigating restore footprint
        await testOpSuccessHashAndXdr({
          isSorobanOp: true,
          page,
          hash: "aa5a5bd20265afdee0d01d36add7b9e67364516e69339313be2c174c8ee81313",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgABu0EAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAGgAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATiAAAAAA",
        });
      });

      test("[Use Contract Data Key] Happy path", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "restore_footprint",
        });
        // we are going from classic operation to soroban operation
        // so the classic operation should not be visible
        await expect(operation_0).not.toBeVisible();

        const soroban_operation = page.getByTestId(
          "build-soroban-transaction-operation",
        );

        // Verify warning message about one operation limit
        await expect(
          page.getByText(
            "Note that Soroban transactions can only contain one operation per transaction.",
          ),
        ).toBeVisible();

        // Soroban Operation only allows one operation
        // Add Operation button should be disabled
        await expect(page.getByText("Add Operation")).toBeDisabled();

        // 'Use Ledger Xdr' Tab is the default tab
        const useLedgerxdrTabButton = page.getByTestId("xdr");
        await expect(useLedgerxdrTabButton).toHaveAttribute(
          "data-is-active",
          "true",
        );

        // Mimic the most common behavior which is copy and paste XDR
        await soroban_operation
          .getByLabel("Ledger Key XDR")
          .fill(
            "AAAABgAAAAHnjb/OrjcmZvHY8g977QXKQQPA2B2bkpvYx6AIOObEhQAAABAAAAABAAAAAgAAAA8AAAAHQmFsYW5jZQAAAAASAAAAATF8egab3Cz7/mLNPqSklWLk+ckv622td2TFqMEZm/qcAAAAAQ==",
          );

        const useContractDataTabButton = page.getByTestId("ledgerKey");
        await useContractDataTabButton.click();
        await expect(useContractDataTabButton).toHaveAttribute(
          "data-is-active",
          "true",
        );

        const contractDataSelect =
          soroban_operation.getByLabel("Ledger Key Type");

        const selectedValue = await contractDataSelect.inputValue();
        expect(selectedValue).toBe("contract_data");

        await expect(contractDataSelect).toBeDisabled();

        const contractInput = soroban_operation.getByLabel("Contract");
        await expect(contractInput).toBeEditable();
        await expect(contractInput).toHaveValue(
          "CDTY3P6OVY3SMZXR3DZA667NAXFECA6A3AOZXEU33DD2ACBY43CIKDPT",
        );

        const scValInput = soroban_operation.getByLabel("Key (ScVal)");
        const stringifiedScVal = JSON.stringify(
          {
            vec: [
              {
                symbol: "Balance",
              },
              {
                address:
                  "CAYXY6QGTPOCZ676MLGT5JFESVROJ6OJF7VW3LLXMTC2RQIZTP5JYNEL",
              },
            ],
          },
          null,
          2,
        );
        await expect(scValInput).toBeEditable();
        await expect(scValInput).toHaveValue(stringifiedScVal);

        const ledgerKeyXdrInput =
          soroban_operation.getByLabel("Ledger Key XDR");
        await expect(ledgerKeyXdrInput).toBeDisabled();
        await expect(ledgerKeyXdrInput).toHaveValue(
          "AAAABgAAAAHnjb/OrjcmZvHY8g977QXKQQPA2B2bkpvYx6AIOObEhQAAABAAAAABAAAAAgAAAA8AAAAHQmFsYW5jZQAAAAASAAAAATF8egab3Cz7/mLNPqSklWLk+ckv622td2TFqMEZm/qcAAAAAQ==",
        );

        const updatedStringifiedScVal = JSON.stringify(
          {
            vec: [
              {
                symbol: "Test",
              },
              {
                address:
                  "CAYXY6QGTPOCZ676MLGT5JFESVROJ6OJF7VW3LLXMTC2RQIZTP5JYNEL",
              },
            ],
          },
          null,
          2,
        );

        await scValInput.fill(updatedStringifiedScVal);

        await expect(ledgerKeyXdrInput).toHaveValue(
          "AAAABgAAAAHnjb/OrjcmZvHY8g977QXKQQPA2B2bkpvYx6AIOObEhQAAABAAAAABAAAAAgAAAA8AAAAEVGVzdAAAABIAAAABMXx6BpvcLPv+Ys0+pKSVYuT5yS/rba13ZMWowRmb+pwAAAAB",
        );

        const durabilityInput = page.locator("#persistent-durability-type");
        await expect(durabilityInput).toBeChecked();

        await soroban_operation
          .getByLabel("Resource Fee (in stroops)")
          .fill("20000");

        const prepareTxButton = page.getByText(
          "Prepare Soroban Transaction to Sign",
        );

        // Mock simulate transaction RPC call
        // @TODO update this after investigating restore footprint
        await mockSimulateTx({
          page,
          responseXdr: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATiA=",
        });

        await expect(prepareTxButton).toBeEnabled();
        await prepareTxButton.click();

        // @TODO update this after investigating restore footprint
        await testOpSuccessHashAndXdr({
          isSorobanOp: true,
          page,
          hash: "aa5a5bd20265afdee0d01d36add7b9e67364516e69339313be2c174c8ee81313",
          xdr: "AAAAAgAAAAANLHqVohDTxPKQ3fawTPgHahe0TzJjJkWV1WakcbeADgABu0EAD95QAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAGgAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATiAAAAAA",
        });
      });

      test("[Use Contract Data Key] Validation", async ({ page }) => {
        const { operation_0 } = await selectOperationType({
          page,
          opType: "restore_footprint",
        });

        await expect(operation_0).not.toBeVisible();

        const soroban_operation = page.getByTestId(
          "build-soroban-transaction-operation",
        );

        // 'Use Ledger Xdr' Tab is the default tab
        const useLedgerxdrTabButton = page.getByTestId("xdr");
        await expect(useLedgerxdrTabButton).toHaveAttribute(
          "data-is-active",
          "true",
        );

        // Mimic the most common behavior which is copy and paste XDR
        await soroban_operation
          .getByLabel("Ledger Key XDR")
          .fill(
            "AAAABgAAAAHnjb/OrjcmZvHY8g977QXKQQPA2B2bkpvYx6AIOObEhQAAABAAAAABAAAAAgAAAA8AAAAHQmFsYW5jZQAAAAASAAAAATF8egab3Cz7/mLNPqSklWLk+ckv622td2TFqMEZm/qcAAAAAQ==",
          );

        const useContractDataTabButton = page.getByTestId("ledgerKey");
        await useContractDataTabButton.click();
        await expect(useContractDataTabButton).toHaveAttribute(
          "data-is-active",
          "true",
        );

        await testInputError({
          page,
          isSorobanOp: true,
          label: "Contract",
          value: "aaa",
          errorMessage:
            "Invalid contract ID. Please enter a valid contract ID.",
        });

        await testInputError({
          page,
          isSorobanOp: true,
          label: "Resource Fee (in stroops)",
          value: "aaa",
          errorMessage:
            "Expected a positive number with a period for the decimal point.",
        });

        const scValInput = soroban_operation.getByLabel("Key (ScVal)");
        const stringifiedScVal = JSON.stringify(
          {
            vec: [
              {
                symbol: "Balance",
              },
              {
                address:
                  "CAYXY6QGTPOCZ676MLGT5JFESVROJ6OJF7VW3LLXsssssMTC2RQIZTP5JYNEL",
              },
            ],
          },
          null,
          2,
        );

        await scValInput.fill(stringifiedScVal);

        const errorNote = soroban_operation
          .locator(".FieldNote--error")
          .filter({
            hasText: "Unable to encode JSON as LedgerKey",
          });
        await expect(errorNote).toBeVisible();
      });

      test("Check rendering between classic and soroban", async ({ page }) => {
        // Select Soroban Operation
        const { operation_0 } = await selectOperationType({
          page,
          opType: "restore_footprint",
        });
        // we are going from classic operation to soroban operation
        // so the classic operation should not be visible
        await expect(operation_0).not.toBeVisible();

        const soroban_operation = page.getByTestId(
          "build-soroban-transaction-operation",
        );

        // Verify warning message about one operation limit
        await expect(
          page.getByText(
            "Note that Soroban transactions can only contain one operation per transaction.",
          ),
        ).toBeVisible();

        // Soroban Operation only allows one operation
        // Add Operation button should be disabled
        await expect(page.getByText("Add Operation")).toBeDisabled();

        // Select Classic Operation
        await soroban_operation.getByLabel("Operation type").selectOption({
          value: "payment",
        });

        const classicOperation = page.getByTestId(
          "build-transaction-operation-0",
        );

        await expect(classicOperation).toBeVisible();

        await expect(page.getByText("Add Operation")).toBeVisible();
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
  isSorobanOp = false,
}: {
  page: Page;
  hash: string;
  xdr: string;
  isSorobanOp?: boolean;
}) => {
  let txnSuccess;

  if (isSorobanOp) {
    txnSuccess = page.getByTestId("build-soroban-transaction-envelope-xdr");
  } else {
    txnSuccess = page.getByTestId("build-transaction-envelope-xdr");
  }

  await expect(txnSuccess).toBeVisible();

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
  isSorobanOp = false,
}: {
  page: Page;
  label: string;
  value: string;
  errorMessage: string;
  nthErrorIndex?: number;
  nthLabelIndex?: number;
  exact?: boolean;
  isSorobanOp?: boolean;
}) => {
  let operation;

  if (isSorobanOp) {
    operation = page.getByTestId("build-soroban-transaction-operation");
  } else {
    operation = page.getByTestId("build-transaction-operation-0");
  }

  await operation.getByLabel(label, { exact }).nth(nthLabelIndex).fill(value);
  await expect(
    operation.getByText(errorMessage).nth(nthErrorIndex),
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
