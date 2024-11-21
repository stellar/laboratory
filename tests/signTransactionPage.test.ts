import { test, expect } from "@playwright/test";

test.describe("Sign Transaction Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/transaction/sign");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Sign Transaction");
  });

  test("Overview with a VALID transaction with ONE operation envelope XDR", async ({
    page,
  }) => {
    // sections
    const overview = page.getByTestId("sign-tx-overview");
    const signaturesView = page.getByTestId("sign-tx-sigs");
    const secretKeysView = page.getByTestId("sign-tx-secretkeys");
    const hardwareView = page.getByTestId("sign-tx-hardware");
    const walletExtView = page.getByTestId("sign-tx-wallet-ext");

    // Import Screen
    const importBtn = page.getByText("Import transaction");
    const validMsg = page.getByText("Valid Transaction Envelope XDR");

    const xdrInput = page.getByLabel(
      "Import a transaction envelope in XDR format",
    );
    await xdrInput.fill(MOCK_TX_XDR);

    await expect(validMsg).toBeVisible();

    await importBtn.click();

    // Overview and Signatures Screen
    await expect(overview).toBeVisible();
    await expect(signaturesView).toBeVisible();

    /*** TX Overview Details ***/
    // Network passphrase
    const overviewSigning = page.getByLabel("Signing for");
    await expect(overviewSigning).toHaveValue(
      "Test SDF Network ; September 2015",
    );

    // TX XDR
    const overviewTxXDR = page.getByLabel("Transaction Envelope XDR");
    await expect(overviewTxXDR).toHaveValue(MOCK_TX_XDR);

    // TX HASH
    const overviewTxHash = page.getByLabel("Transaction Hash");
    await expect(overviewTxHash).toHaveValue(
      "794e2073e130dc09d2b7e8b147b51f6ef75ff171c83c603bc8ab4cffa3f341a1",
    );

    // Source Account
    const overviewSource = page.getByLabel("Source account");
    await expect(overviewSource).toHaveValue(
      "GDE25LQ34AFCSDMYTOI6AVVEHRXFRJI4MOAVIUGUDUQEC5ZWN5OZDLAZ",
    );

    // Sequence number
    const overviewSeq = page.getByLabel("Sequence number");
    await expect(overviewSeq).toHaveValue("2345052143617");

    // Transaction Fee (stroops)
    const overviewTxFee = page.getByLabel("Transaction Fee (stroops)");
    await expect(overviewTxFee).toHaveValue("100");

    // Number of operations
    const overviewOpsNum = page.getByLabel("Number of operations");
    await expect(overviewOpsNum).toHaveValue("1");

    /*** Signatures: Secret Keys ***/
    // Click 'Add additional' button to get an additional secret input field
    const multiPickerContainer = page.getByTestId("multipicker-signer");
    const multiPickerInput = multiPickerContainer.getByPlaceholder(
      "Secret key (starting with S) or hash preimage (in hex)",
    );
    const addAddlSecretBtn = multiPickerContainer.getByText("Add additional");
    const secretKeysSignBtn = secretKeysView.getByText("Sign transaction");

    await expect(multiPickerInput).toHaveCount(1);
    await addAddlSecretBtn.click();
    await expect(multiPickerInput).toHaveCount(2);

    // Type in a string in an invalid secret key format
    await multiPickerInput.nth(0).fill("lkjlsdkjflksdjf");

    const invalidSecretKeyErrorMsg = page.getByText(
      "Invalid secret key. Please check your secret key and try again.",
    );
    const successSecretKeyMsg = secretKeysView.getByText(
      "Successfully added 1 signature",
    );

    await expect(invalidSecretKeyErrorMsg).toBeVisible();

    // Type in a string in an valid secret key format
    await multiPickerInput
      .nth(0)
      .fill("SCAM6CZNCLJFQOGSC7LLE2KMBYCBD7S5IYV447MZX5NHPGCHRHPYITCF");
    await expect(invalidSecretKeyErrorMsg).toBeHidden();
    await expect(secretKeysSignBtn).toBeEnabled();

    await secretKeysSignBtn.click();

    await expect(successSecretKeyMsg).toBeVisible();

    /*** Signatures: Hardware Wallet ***/
    const bipPathInput = await hardwareView.getByPlaceholder(
      "BIP path in format: 44'/148'/0'",
    );

    await expect(bipPathInput).toHaveValue("44'/148'/0'");

    const hardwareSelect = hardwareView.locator("id=hardware-wallet-select");

    await hardwareSelect.click();

    const options = await hardwareSelect.locator("option").allTextContents();
    expect(options).toEqual([
      "Select operation type",
      "Ledger",
      "Hash with Ledger",
      "Trezor",
    ]);

    await hardwareSelect.selectOption("Trezor");

    await expect(hardwareSelect).toHaveValue("trezor");

    const hardwareSignBtn = hardwareView.getByText("Sign transaction");

    // Start waiting for popup before clicking. Note no await.
    const pagePromise = page.context().waitForEvent("page");
    await hardwareSignBtn.click();
    await pagePromise;

    // @TODO mock the hardware API

    /*** Signatures: Wallet Extension ***/
    const walletExtSignBtn = walletExtView.getByRole("button", {
      name: "Sign with wallet",
    });
    await walletExtSignBtn.click();

    /*** Signatures: Add a signature ***/
  });

  test("Use an ScVal Type XDR that is not Transaction Envelope XDR", async ({
    page,
  }) => {
    const decodeErrorMsg = page.getByText(
      "Unable to parse input XDR into Transaction Envelope",
    );

    await expect(decodeErrorMsg).toBeHidden();

    const xdrInput = page.getByLabel(
      "Import a transaction envelope in XDR format",
    );
    await xdrInput.fill(MOCK_SC_VAL_XDR);

    await expect(decodeErrorMsg).toBeVisible();
  });

  test("Invalid XDR", async ({ page }) => {
    const decodeErrorMsg = page.getByText(
      "Unable to parse input XDR into Transaction Envelope",
    );

    await expect(decodeErrorMsg).toBeHidden();

    const xdrInput = page.getByLabel(
      "Import a transaction envelope in XDR format",
    );
    await xdrInput.fill("AAA");

    await expect(decodeErrorMsg).toBeVisible();
  });
});

// =============================================================================
// Mock data
// =============================================================================

const MOCK_SC_VAL_XDR =
  "AAAAEQAAAAEAAAAGAAAADwAAAAZhbW91bnQAAAAAAAoAAAAAAAAAAAAACRhOcqAAAAAADwAAAAxib290c3RyYXBwZXIAAAASAAAAARssFqxD/prgmYc9vGkaqslWrGlPINzMYTLc4yqRfO3AAAAADwAAAAxjbG9zZV9sZWRnZXIAAAADAz6ilAAAAA8AAAAIcGFpcl9taW4AAAAKAAAAAAAAAAAAAAARdlkuAAAAAA8AAAAEcG9vbAAAABIAAAABX/a7xfliM8nFgGel6pbCM6fT/kqrHAITNtWZQXgDlIIAAAAPAAAAC3Rva2VuX2luZGV4AAAAAAMAAAAA";

const MOCK_TX_XDR =
  "AAAAAgAAAADJrq4b4AopDZibkeBWpDxuWKUcY4FUUNQdIEF3Nm9dkQAAAGQAAAIiAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAACXlGN76T6NQcaUJxbEkH3mi1HHWsHnLqMDdlLl9NlJgQAAAAAAAAAABfXhAAAAAAAAAAAA";
