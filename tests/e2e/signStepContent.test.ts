import { baseURL } from "../../playwright.config";
import { test, expect, Page } from "@playwright/test";

/**
 * E2E tests for the Sign step in the single-page transaction build flow.
 *
 * Seeds sessionStorage with a pre-built classic transaction so the flow
 * starts at the sign step without requiring a full build.
 */
test.describe("Sign Step in Build Flow", () => {
  const MOCK_TX_XDR =
    "AAAAAgAAAADJrq4b4AopDZibkeBWpDxuWKUcY4FUUNQdIEF3Nm9dkQAAAGQAAAIiAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAACXlGN76T6NQcaUJxbEkH3mi1HHWsHnLqMDdlLl9NlJgQAAAAAAAAAABfXhAAAAAAAAAAAA";

  const MOCK_SECRET_KEY =
    "SCAM6CZNCLJFQOGSC7LLE2KMBYCBD7S5IYV447MZX5NHPGCHRHPYITCF";

  const seedSessionStorageAndNavigate = async (page: Page) => {
    // Navigate to the build page first so sessionStorage is on the right origin
    await page.goto(`${baseURL}/transaction/build`);

    // Seed sessionStorage with flow store state at the sign step
    await page.evaluate(
      ({ xdr }) => {
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
      { xdr: MOCK_TX_XDR },
    );

    // Reload to pick up the seeded sessionStorage
    await page.reload();
  };

  test("Loads the sign step with correct heading and description", async ({
    page,
  }) => {
    await seedSessionStorageAndNavigate(page);

    await expect(page.locator("h1")).toHaveText("Sign transaction");
    await expect(
      page.getByText(
        "To be included in the ledger, the transaction must be signed and submitted to the network.",
      ),
    ).toBeVisible();
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

    const nextButton = page.getByRole("button", {
      name: "Submit transaction",
    });
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

    // Verify signed XDR is displayed in the result card
    const xdrBox = page.locator(".SignStepContent__xdrBox");
    await expect(xdrBox).toBeVisible();
    await expect(xdrBox).not.toBeEmpty();

    // Verify fee bump link is visible
    // @TODO add
    // await expect(
    //   page.getByText("Want another account to pay the fee?"),
    // ).toBeVisible();
    // await expect(page.getByText("Wrap with fee bump")).toBeVisible();

    // Next button should now be enabled
    const nextButton = page.getByRole("button", {
      name: "Submit transaction",
    });
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

    // Click Clear all
    await page.getByText("Clear all").click();

    // Should reset to build step
    await expect(page.locator("h1")).toHaveText("Build transaction");
  });
});
