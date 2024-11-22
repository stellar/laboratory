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
    const sigExtView = page.getByTestId("sign-tx-signature");
    const validationView = page.getByTestId("sign-tx-validation-card");
    const signedXdr = page.getByTestId("validation-card-response");

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
    const invalidSecretKeyErrorMsg = page.getByText(
      "Invalid secret key. Please check your secret key and try again.",
    );
    const successSecretKeyMsg = secretKeysView.getByText(
      "Successfully added 1 signature",
    );

    await expect(multiPickerInput).toHaveCount(1);
    await addAddlSecretBtn.click();
    await expect(multiPickerInput).toHaveCount(2);

    // Type in a string in an invalid secret key format
    await multiPickerInput.nth(0).fill("lkjlsdkjflksdjf");
    await expect(invalidSecretKeyErrorMsg).toBeVisible();

    // Type in a string in an valid secret key format
    await multiPickerInput
      .nth(0)
      .fill("SCAM6CZNCLJFQOGSC7LLE2KMBYCBD7S5IYV447MZX5NHPGCHRHPYITCF");
    await expect(invalidSecretKeyErrorMsg).toBeHidden();
    await expect(secretKeysSignBtn).toBeEnabled();

    await secretKeysSignBtn.click();

    await expect(successSecretKeyMsg).toBeVisible();

    const firstSignedResponse = await signedXdr.getByText(
      "AAAAAgAAAADJrq4b4AopDZibkeBWpDxuWKUcY4FUUNQdIEF3Nm9dkQAAAGQAAAIiAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAACXlGN76T6NQcaUJxbEkH3mi1HHWsHnLqMDdlLl9NlJgQAAAAAAAAAABfXhAAAAAAAAAAABjc9OtQAAAEBrpI8Q90yqEqjcLSubVj5nqtyt53bpVzi8Bzikps4xuom0xHQgrM6MsQS503ortwLcYOw0gyLPyst7J88ZDoQJ",
    );

    await expect(firstSignedResponse).toBeVisible();

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

    const hardwareSignBtn = hardwareView.getByText("Sign transaction");

    await hardwareSignBtn.isDisabled();

    await hardwareSelect.selectOption("Trezor");

    await expect(hardwareSelect).toHaveValue("trezor");

    await hardwareSignBtn.isEnabled();

    await hardwareSelect.selectOption("Ledger");

    await expect(hardwareSelect).toHaveValue("ledger");

    await hardwareSelect.selectOption("Hash with Ledger");

    await expect(hardwareSelect).toHaveValue("ledger_hash");

    /*** Signatures: Wallet Extension ***/
    const walletExtSignBtn = walletExtView.getByRole("button", {
      name: "Sign with wallet",
    });
    await walletExtSignBtn.click();

    await expect(
      page.getByRole("heading", { name: "Connect a Wallet" }),
    ).toBeVisible();

    // Wallet Extension to display 6 wallets
    await expect(page.getByRole("listitem")).toHaveCount(6);

    // Exit out of the wallet extension modal
    await page.click("body", { position: { x: 10, y: 10 } });

    /*** Signatures: Add a signature ***/
    const addSigBtn = sigExtView.getByText("Add signature to transaction");
    await addSigBtn.isDisabled();

    const pubKeyInput = sigExtView.getByPlaceholder("Public key");
    const sigInput = sigExtView.getByPlaceholder(
      "Hex encoded 64-byte ed25519 signature",
    );
    const pubKeyErrorMsg = sigExtView.getByText("Public key is invalid.");
    const addSigErrorMsg = sigExtView.getByText(
      "Error: invalid encoded string",
    );
    const addSigSuccessMsg = sigExtView.getByText(
      "Successfully added 1 signature",
    );

    await expect(pubKeyInput).toBeVisible();
    await expect(sigInput).toBeVisible();

    pubKeyInput.fill("sdfsdf");

    await expect(pubKeyErrorMsg).toBeVisible();

    sigInput.fill(
      "ef6db30947dafea9f87f821751812dc15180f084c70dfab6e359bc92fa892f10aa0eb403c37ccc77c67cb0fabc77eba6e151485a72c5e549c58a2f57f0c26101",
    );

    await addSigBtn.isEnabled();
    await addSigBtn.click();

    await expect(addSigErrorMsg).toBeVisible();

    pubKeyInput.fill(
      "GDBE5AQAPXR6DYK7WPTWY25KM4TN552VZ3543DZUGUND7KI2TB2SIAJX",
    );

    await expect(addSigErrorMsg).toBeHidden();

    await addSigBtn.click();

    await expect(addSigSuccessMsg).toBeVisible();

    await expect(signedXdr).toContainText(
      "AAAAAgAAAADJrq4b4AopDZibkeBWpDxuWKUcY4FUUNQdIEF3Nm9dkQAAAGQAAAIiAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAACXlGN76T6NQcaUJxbEkH3mi1HHWsHnLqMDdlLl9NlJgQAAAAAAAAAABfXhAAAAAAAAAAACjc9OtQAAAEBrpI8Q90yqEqjcLSubVj5nqtyt53bpVzi8Bzikps4xuom0xHQgrM6MsQS503ortwLcYOw0gyLPyst7J88ZDoQJGph1JAAAAEDvbbMJR9r+qfh/ghdRgS3BUYDwhMcN+rbjWbyS+okvEKoOtAPDfMx3xnyw+rx366bhUUhacsXlScWKL1fwwmEB",
    );

    const submitBtn = validationView.getByText(
      "Submit in Transaction Submitter",
    );
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();
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

  test("Use an XDR that includes 3 operations", async ({ page }) => {
    // sections
    const overview = page.getByTestId("sign-tx-overview");
    const signaturesView = page.getByTestId("sign-tx-sigs");

    // Import Screen
    const importBtn = page.getByText("Import transaction");
    const validMsg = page.getByText("Valid Transaction Envelope XDR");

    const xdrInput = page.getByLabel(
      "Import a transaction envelope in XDR format",
    );
    await xdrInput.fill(MOCK_TX_XDR_3_OPERATIONS);

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
    await expect(overviewTxXDR).toHaveValue(MOCK_TX_XDR_3_OPERATIONS);

    // TX HASH
    const overviewTxHash = page.getByLabel("Transaction Hash");
    await expect(overviewTxHash).toHaveValue(
      "892110aecc9f30662d5ececcf2a1f2fdd03fc42f3b3ca55c475a05d421838e60",
    );

    // Source Account
    const overviewSource = page.getByLabel("Source account");
    await expect(overviewSource).toHaveValue(
      "GBTQEP2NS6WSRRXYXZ4JJLLLO4OWH5LWHZFEGL5PMOQQDELD4MY5YUWJ",
    );

    // Sequence number
    const overviewSeq = page.getByLabel("Sequence number");
    await expect(overviewSeq).toHaveValue("4552819952582657");

    // Transaction Fee (stroops)
    const overviewTxFee = page.getByLabel("Transaction Fee (stroops)");
    await expect(overviewTxFee).toHaveValue("300");

    // Number of operations
    const overviewOpsNum = page.getByLabel("Number of operations");
    await expect(overviewOpsNum).toHaveValue("3");
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

const MOCK_TX_XDR_3_OPERATIONS =
  "AAAAAgAAAABnAj9Nl60oxvi+eJSta3cdY/V2PkpDL69joQGRY+Mx3AAAASwAECzEAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAEAAAAABHLXc6lPRFz7BJua75KzEQi1Iw3Hj6bUXLrNdMRPZmYwAAAAAAAAAAAAAAAEctdzqU9EXPsEm5rvkrMRCLUjDcePptRcus10xE9mZjAAAAAAExLQAAAAAAAAAAEQAAAAAAAAAA";
