import { baseURL } from "../../playwright.config";
import { test, expect, Page } from "@playwright/test";
import { Networks, TransactionBuilder } from "@stellar/stellar-sdk";

/**
 * E2E tests for the Sign step in the single-page transaction build flow.
 *
 * Seeds sessionStorage with a pre-built classic transaction so the flow
 * starts at the sign step without requiring a full build.
 */
test.describe("Sign Step in Build Flow", () => {
  const MOCK_TX_XDR =
    "AAAAAgAAAADJrq4b4AopDZibkeBWpDxuWKUcY4FUUNQdIEF3Nm9dkQAAAGQAAAIiAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAACXlGN76T6NQcaUJxbEkH3mi1HHWsHnLqMDdlLl9NlJgQAAAAAAAAAABfXhAAAAAAAAAAAA";

  const MOCK_TX_BEFORE_SIMULATION_XDR =
    "AAAAAgAAAAAEBW1n0nAevyLINGQshSBzpSIjWfA/0Z6Kg3CRxRl8jwAAAMgAPSFNAAAAHQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAGAAAAAAAAAABUEXNXsBymnaP1a0CUFhS308Cjc6DDlrFIgm6SEg7LwEAAAAIdHJhbnNmZXIAAAADAAAAEgAAAAAAAAAABAVtZ9JwHr8iyDRkLIUgc6UiI1nwP9GeioNwkcUZfI8AAAASAAAAAAAAAAAh5dYXbG+vCChQsGMYfg8k2ABTTz0GHlyHZd1Q+bf9dAAAAAoAAAAAAAAAAAAAAAAAAABkAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";

  const MOCK_TX_SIMULATED_XDR =
    "AAAAAgAAAAAEBW1n0nAevyLINGQshSBzpSIjWfA/0Z6Kg3CRxRl8jwAAL9AAPSFNAAAAHQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAGAAAAAAAAAABUEXNXsBymnaP1a0CUFhS308Cjc6DDlrFIgm6SEg7LwEAAAAIdHJhbnNmZXIAAAADAAAAEgAAAAAAAAAABAVtZ9JwHr8iyDRkLIUgc6UiI1nwP9GeioNwkcUZfI8AAAASAAAAAAAAAAAh5dYXbG+vCChQsGMYfg8k2ABTTz0GHlyHZd1Q+bf9dAAAAAoAAAAAAAAAAAAAAAAAAABkAAAAAQAAAAAAAAAAAAAAAVBFzV7Acpp2j9WtAlBYUt9PAo3Ogw5axSIJukhIOy8BAAAACHRyYW5zZmVyAAAAAwAAABIAAAAAAAAAAAQFbWfScB6/Isg0ZCyFIHOlIiNZ8D/RnoqDcJHFGXyPAAAAEgAAAAAAAAAAIeXWF2xvrwgoULBjGH4PJNgAU089Bh5ch2XdUPm3/XQAAAAKAAAAAAAAAAAAAAAAAAAAZAAAAAAAAAABAAAAAAAAAAEAAAAGAAAAAVBFzV7Acpp2j9WtAlBYUt9PAo3Ogw5axSIJukhIOy8BAAAAFAAAAAEAAAACAAAAAQAAAAAEBW1n0nAevyLINGQshSBzpSIjWfA/0Z6Kg3CRxRl8jwAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAAAQAAAAAh5dYXbG+vCChQsGMYfg8k2ABTTz0GHlyHZd1Q+bf9dAAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAOdHwAAAOgAAADoAAAAAAAALwgAAAAA";

  const MOCK_SECRET_KEY =
    "SCAM6CZNCLJFQOGSC7LLE2KMBYCBD7S5IYV447MZX5NHPGCHRHPYITCF";

  const MOCK_SECRET_KEY_2 =
    "SADVGAH3VA3NGZ5VLX2ZICV7JQAINB2ZJZYOPMBXUNI3YRLGWLOA2OFY";

  const seedSessionStorageAndNavigate = async (
    page: Page,
    options: { buildXdr?: string; assembledXdr?: string } = {},
  ) => {
    // Seed sessionStorage with flow store state at the sign step, before any
    // app script runs. Seeding after page load races with mount effects that
    // write the default flow state back to sessionStorage, which makes the
    // page open on the build step.
    // The init script is serialized and runs in the browser, so it can only
    // read values passed through its argument, not variables from this scope.
    await page.addInitScript(
      ({ xdr, assembledXdr }) => {
        const storeState = {
          state: {
            activeStep: "sign",
            highestCompletedStep: "build",
            build: {
              classic: { operations: [], xdr },
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
              isValid: { params: false, operations: false },
            },
            simulate: {
              xdrFormat: "base64",
              authMode: "record",
              simulationResultJson: "",
              isValid: false,
              ...(assembledXdr ? { assembledXdr } : {}),
            },
            sign: { signedXdr: "" },
            submit: { submitResultJson: "" },
            feeBump: { source_account: "", fee: "", xdr: "" },
          },
          version: 0,
        };
        sessionStorage.setItem(
          "stellar_lab_tx_flow_build",
          JSON.stringify(storeState),
        );
      },
      {
        xdr: options.buildXdr ?? MOCK_TX_XDR,
        assembledXdr: options.assembledXdr,
      },
    );

    await page.goto(`${baseURL}/transaction/build`);
    await expect(page.locator("h1")).toHaveText("Sign transaction");
  };

  test("Loads the sign step with correct heading", async ({ page }) => {
    await seedSessionStorageAndNavigate(page);

    await expect(page.locator("h1")).toHaveText("Sign transaction");

    // The signature-status guidance is only shown in the import flow, where
    // existing signatures are reviewed; a freshly built tx doesn't need it
    await expect(
      page.getByText("This transaction needs signature(s)."),
    ).toBeHidden();
  });

  test("Shows the simulated XDR above the signing UI when the tx was simulated", async ({
    page,
  }) => {
    await seedSessionStorageAndNavigate(page, {
      assembledXdr: MOCK_TX_SIMULATED_XDR,
    });

    const simulatedXdr = page.locator("#sign-step-simulated-xdr");
    await expect(simulatedXdr).toBeVisible();
    await expect(simulatedXdr).toHaveValue(MOCK_TX_SIMULATED_XDR);
    await expect(
      page.getByText("Simulated transaction (Base64 XDR)"),
    ).toBeVisible();
  });

  test("Signs the simulated transaction, not the pre-simulation one", async ({
    page,
  }) => {
    await seedSessionStorageAndNavigate(page, {
      buildXdr: MOCK_TX_BEFORE_SIMULATION_XDR,
      assembledXdr: MOCK_TX_SIMULATED_XDR,
    });

    const signComponent = page.getByTestId("sign-tx-xdr-sign-step");
    await signComponent
      .getByPlaceholder(
        "Secret key (starting with S) or hash preimage (in hex)",
      )
      .first()
      .fill(MOCK_SECRET_KEY);
    await signComponent.getByRole("button", { name: "Sign" }).click();

    await expect(
      page.getByText("Transaction signed and ready to submit."),
    ).toBeVisible();

    const signedXdr = await page.evaluate(
      () =>
        JSON.parse(sessionStorage.getItem("stellar_lab_tx_flow_build") ?? "{}")
          .state?.sign?.signedXdr as string,
    );

    // The tx hash excludes signatures, so it identifies which envelope was
    // signed. The two inputs differ in fee and Soroban resource data.
    const txHash = (xdr: string) =>
      Buffer.from(
        TransactionBuilder.fromXdr(xdr, Networks.TESTNET).hash(),
      ).toString("hex");

    expect(txHash(signedXdr)).toBe(txHash(MOCK_TX_SIMULATED_XDR));
    expect(txHash(signedXdr)).not.toBe(txHash(MOCK_TX_BEFORE_SIMULATION_XDR));
  });

  test("Hides the simulated XDR when the tx was not simulated", async ({
    page,
  }) => {
    await seedSessionStorageAndNavigate(page);

    await expect(page.locator("#sign-step-simulated-xdr")).toBeHidden();
  });

  test("Shows SignTransactionXdr component with tabs", async ({ page }) => {
    await seedSessionStorageAndNavigate(page);

    const signComponent = page.getByTestId("sign-tx-xdr-sign-step");
    await expect(signComponent).toBeVisible();

    // Verify all four tabs are present
    const tabs = signComponent.locator(".SignTransactionXdr__tab__label");
    await expect(tabs.getByText("Sign with secret key")).toBeVisible();
    await expect(tabs.getByText("Wallet extension")).toBeVisible();
    await expect(tabs.getByText("Hardware wallet")).toBeVisible();
    await expect(tabs.getByText("Transaction envelope")).toBeVisible();
  });

  test("Next button is disabled before signing", async ({ page }) => {
    await seedSessionStorageAndNavigate(page);

    // Wait for the sign step to hydrate from sessionStorage
    await expect(page.locator("h1")).toHaveText("Sign transaction");

    const nextButton = page.locator('[data-position="right"]');
    await expect(nextButton).toBeDisabled();
  });

  test("Signs with secret key and shows result card", async ({ page }) => {
    await seedSessionStorageAndNavigate(page);

    const signComponent = page.getByTestId("sign-tx-xdr-sign-step");

    // Fill in secret key
    const secretKeyInput = signComponent.getByPlaceholder(
      "Secret key (starting with S) or hash preimage (in hex)",
    );
    await secretKeyInput.first().fill(MOCK_SECRET_KEY);

    // Click sign button
    const signButton = signComponent.getByRole("button", {
      name: "Sign",
    });
    await signButton.click();

    // Verify success alert appears
    await expect(
      page.getByText("Transaction signed and ready to submit."),
    ).toBeVisible();

    // Verify the signed transaction is shown in the result card's code editor,
    // with the JSON/XDR format toggle available.
    await expect(
      page.locator(".CodeEditor__header__title", {
        hasText: "Signed transaction",
      }),
    ).toBeVisible();
    await expect(page.locator("#code-editor-languages")).toBeVisible();

    // Verify fee bump link is visible
    // @TODO add
    // await expect(
    //   page.getByText("Want another account to pay the fee?"),
    // ).toBeVisible();
    // await expect(page.getByText("Wrap with fee bump")).toBeVisible();

    // Next button should now be enabled
    const nextButton = page.locator('[data-position="right"]');
    await expect(nextButton).toBeEnabled();
  });

  test("Clear all resets the sign step", async ({ page }) => {
    await seedSessionStorageAndNavigate(page);

    const signComponent = page.getByTestId("sign-tx-xdr-sign-step");

    // Sign the transaction first
    const secretKeyInput = signComponent.getByPlaceholder(
      "Secret key (starting with S) or hash preimage (in hex)",
    );
    await secretKeyInput.first().fill(MOCK_SECRET_KEY);
    await signComponent.getByRole("button", { name: "Sign" }).click();

    // Verify signed state
    await expect(
      page.getByText("Transaction signed and ready to submit."),
    ).toBeVisible();

    // Click Clear all (opens confirmation modal, then confirm)
    await page.getByTestId("clear-all-button").click();
    await page.getByText("Clear all").click();

    // Should reset to build step
    await expect(page.locator("h1")).toHaveText("Build transaction");
  });

  test("Switching tabs reveals the matching tab content", async ({ page }) => {
    await seedSessionStorageAndNavigate(page);

    const signComponent = page.getByTestId("sign-tx-xdr-sign-step");

    const content = (type: string) =>
      signComponent.locator(
        `.SignTransactionXdr__tabContent[data-type="${type}"]`,
      );
    const tabLabel = (label: string) =>
      signComponent.locator(".SignTransactionXdr__tab__label", {
        hasText: label,
      });

    // Secret key tab is selected by default.
    await expect(content("secretKey")).toHaveAttribute(
      "data-is-visible",
      "true",
    );
    await expect(content("signature")).toHaveAttribute(
      "data-is-visible",
      "false",
    );

    // Switching to the Transaction envelope tab flips visibility.
    await tabLabel("Transaction envelope").click();
    await expect(content("signature")).toHaveAttribute(
      "data-is-visible",
      "true",
    );
    await expect(content("secretKey")).toHaveAttribute(
      "data-is-visible",
      "false",
    );

    // And to the Hardware wallet tab.
    await tabLabel("Hardware wallet").click();
    await expect(content("hardwareWallet")).toHaveAttribute(
      "data-is-visible",
      "true",
    );
    await expect(content("signature")).toHaveAttribute(
      "data-is-visible",
      "false",
    );
  });

  test("Invalid secret key shows a validation error and keeps Sign disabled", async ({
    page,
  }) => {
    await seedSessionStorageAndNavigate(page);

    const signComponent = page.getByTestId("sign-tx-xdr-sign-step");

    const secretKeyInput = signComponent.getByPlaceholder(
      "Secret key (starting with S) or hash preimage (in hex)",
    );
    await secretKeyInput.first().fill("SNOTAVALIDKEY");

    // Validation error surfaces and the Sign button stays disabled.
    await expect(signComponent.getByText("Invalid secret key")).toBeVisible();
    await expect(
      signComponent.getByRole("button", { name: "Sign" }),
    ).toBeDisabled();
  });

  test("Signing with secret key fills the tab signature count badge", async ({
    page,
  }) => {
    await seedSessionStorageAndNavigate(page);

    const signComponent = page.getByTestId("sign-tx-xdr-sign-step");

    await signComponent
      .getByPlaceholder(
        "Secret key (starting with S) or hash preimage (in hex)",
      )
      .first()
      .fill(MOCK_SECRET_KEY);
    await signComponent.getByRole("button", { name: "Sign" }).click();

    // In-component success message reflects the single signature.
    await expect(
      signComponent.getByText("Successfully added 1 signature", {
        exact: true,
      }),
    ).toBeVisible();

    // The secret key tab's count badge updates to 1 and is marked filled.
    const secretKeyCount = signComponent
      .locator(".SignTransactionXdr__tab", { hasText: "Sign with secret key" })
      .locator(".SignTransactionXdr__tab__count");
    await expect(secretKeyCount).toHaveText("1");
    await expect(secretKeyCount).toHaveAttribute("data-is-filled", "true");
  });

  test("Per-tab Clear resets the secret key signature", async ({ page }) => {
    await seedSessionStorageAndNavigate(page);

    const signComponent = page.getByTestId("sign-tx-xdr-sign-step");

    await signComponent
      .getByPlaceholder(
        "Secret key (starting with S) or hash preimage (in hex)",
      )
      .first()
      .fill(MOCK_SECRET_KEY);
    await signComponent.getByRole("button", { name: "Sign" }).click();

    await expect(
      signComponent.getByText("Successfully added 1 signature", {
        exact: true,
      }),
    ).toBeVisible();

    // The component's own Clear button (not the flow's "Clear all").
    await signComponent.getByRole("button", { name: "Clear" }).click();

    // Success message is gone, badge is back to 0, and Sign is available again.
    await expect(
      signComponent.getByText("Successfully added 1 signature", {
        exact: true,
      }),
    ).toBeHidden();

    const secretKeyCount = signComponent
      .locator(".SignTransactionXdr__tab", { hasText: "Sign with secret key" })
      .locator(".SignTransactionXdr__tab__count");
    await expect(secretKeyCount).toHaveText("0");
    await expect(secretKeyCount).toHaveAttribute("data-is-filled", "false");
    await expect(
      signComponent.getByRole("button", { name: "Sign" }),
    ).toBeVisible();
  });

  test("Signing with multiple secret keys reports both signatures", async ({
    page,
  }) => {
    await seedSessionStorageAndNavigate(page);

    const signComponent = page.getByTestId("sign-tx-xdr-sign-step");

    const secretKeyInputs = signComponent.getByPlaceholder(
      "Secret key (starting with S) or hash preimage (in hex)",
    );
    await secretKeyInputs.first().fill(MOCK_SECRET_KEY);

    // Add a second secret key input and fill it.
    await signComponent.getByRole("button", { name: "Add additional" }).click();
    await secretKeyInputs.nth(1).fill(MOCK_SECRET_KEY_2);

    await signComponent.getByRole("button", { name: "Sign" }).click();

    // Pluralized message and badge reflect two signatures.
    await expect(
      signComponent.getByText("Successfully added 2 signatures", {
        exact: true,
      }),
    ).toBeVisible();

    const secretKeyCount = signComponent
      .locator(".SignTransactionXdr__tab", { hasText: "Sign with secret key" })
      .locator(".SignTransactionXdr__tab__count");
    await expect(secretKeyCount).toHaveText("2");
  });

  test("Transaction envelope tab supports adding, validating, and removing signature rows", async ({
    page,
  }) => {
    await seedSessionStorageAndNavigate(page);

    const signComponent = page.getByTestId("sign-tx-xdr-sign-step");

    await signComponent
      .locator(".SignTransactionXdr__tab__label", {
        hasText: "Transaction envelope",
      })
      .click();

    const signatureContent = signComponent.locator(
      '.SignTransactionXdr__tabContent[data-type="signature"]',
    );

    // With empty fields, the "add to transaction" button is disabled.
    const addToTxButton = signatureContent.getByRole("button", {
      name: "Add signature to transaction",
    });
    await expect(addToTxButton).toBeDisabled();

    // An invalid public key surfaces a validation error.
    await signatureContent.getByPlaceholder("Public key").fill("GNOTVALID");
    await expect(
      signatureContent.getByText("Public key is invalid."),
    ).toBeVisible();

    // "Add additional signature" creates a second row (a Remove button appears).
    await signatureContent
      .getByRole("button", { name: "Add additional signature" })
      .click();
    const removeButton = signatureContent.getByRole("button", {
      name: "Remove",
    });
    await expect(removeButton).toBeVisible();

    // Removing it returns to a single row.
    await removeButton.click();
    await expect(
      signatureContent.getByRole("button", { name: "Remove" }),
    ).toHaveCount(0);
  });
});
