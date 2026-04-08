import { baseURL } from "../../playwright.config";
import { test, expect, Page } from "@playwright/test";

/**
 * E2E tests for the Validate step in the single-page transaction build flow.
 *
 * Seeds sessionStorage with a signed Soroban transaction (with auth entries)
 * so the flow starts at the validate step. Mocks the RPC simulateTransaction
 * endpoint to return enforce-mode responses.
 */
test.describe("Validate Step in Build Flow", () => {
  // A minimal signed Soroban transaction XDR (classic shape, used as placeholder)
  const MOCK_SIGNED_XDR =
    "AAAAAgAAAADJrq4b4AopDZibkeBWpDxuWKUcY4FUUNQdIEF3Nm9dkQAAAGQAAAIiAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAACXlGN76T6NQcaUJxbEkH3mi1HHWsHnLqMDdlLl9NlJgQAAAAAAAAAABfXhAAAAAAAAAAAA";

  const MOCK_AUTH_ENTRY_XDR = "AAAAAAAAAAAAAAAA";

  const buildStoreState = (signedXdr: string, authEntryXdr: string) => ({
    state: {
      activeStep: "validate",
      highestCompletedStep: "sign",
      build: {
        classic: { operations: [], xdr: "" },
        soroban: {
          operation: {
            operation_type: "invoke_contract",
            params: {},
            source_account: "",
          },
          xdr: signedXdr,
        },
        params: {
          source_account: "",
          fee: "100",
          seq_num: "",
          cond: { time: { min_time: "", max_time: "" } },
          memo: {},
        },
        error: { params: [], operations: [] },
        isValid: { params: true, operations: true },
      },
      simulate: {
        xdrFormat: "base64",
        authMode: "record",
        simulationResultJson: JSON.stringify({ result: {} }),
        authEntriesXdr: [authEntryXdr],
        signedAuthEntriesXdr: [authEntryXdr],
        isValid: true,
      },
      sign: { signedXdr },
      submit: { submitResultJson: "" },
      feeBump: { source_account: "", fee: "", xdr: "" },
    },
    version: 0,
  });

  const seedSessionStorageAndNavigate = async (page: Page) => {
    const storeState = buildStoreState(MOCK_SIGNED_XDR, MOCK_AUTH_ENTRY_XDR);

    // Navigate to the build page first so sessionStorage is on the right origin
    await page.goto(`${baseURL}/transaction/build`);

    // Seed sessionStorage with flow store state at the validate step
    await page.evaluate((stateJson) => {
      sessionStorage.setItem("stellar_lab_tx_flow_build", stateJson);

      // Seed localStorage with testnet so the NetworkSelector doesn't open
      // a "Load Network" modal on reload (CI has no saved network).
      localStorage.setItem(
        "stellar_lab_network",
        JSON.stringify({
          id: "testnet",
          label: "Testnet",
          horizonUrl: "https://horizon-testnet.stellar.org",
          rpcUrl: "https://soroban-testnet.stellar.org",
          passphrase: "Test SDF Network ; September 2015",
        }),
      );
    }, JSON.stringify(storeState));

    // Reload to pick up the seeded sessionStorage
    await page.reload();
  };

  const mockEnforceSimulationSuccess = async (page: Page) => {
    await page.route("https://soroban-testnet.stellar.org", async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      if (postData?.method === "simulateTransaction") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            result: {
              transactionData:
                "AAAAAAAAAAIAAAAGAAAAARnq08sSEoEilnFmB13IYqWkolLMae9GhgGISQALh10AAAAUAAAAAQAAAAcAAAAAAAAAAG7VFQQKZAOG4SA0Y79BQPYFSRHY9CJFGL/YFVJKiF9sAAAAEAAAAAEAAAACAAAADwAAAAdCYWxhbmNlAAAAABIAAAAAAAAAAJeUY3vpPo1BxpQnFsSQfeaLUcdawecuowN2UuX02UmBAAAAEAAAAAEAAAACAAAADwAAAAdCYWxhbmNlAAAAABIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgAAAA==",
              minResourceFee: "93373",
              cost: {
                cpuInsns: "12345678",
                memBytes: "654321",
              },
              latestLedger: 567838,
            },
          }),
        });
      } else {
        await route.continue();
      }
    });
  };

  const mockEnforceSimulationFailure = async (page: Page) => {
    await page.route("https://soroban-testnet.stellar.org", async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      if (postData?.method === "simulateTransaction") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            result: {
              error: "Authorization failed: invalid signature",
            },
          }),
        });
      } else {
        await route.continue();
      }
    });
  };

  test("Loads the validate step with correct heading", async ({ page }) => {
    await seedSessionStorageAndNavigate(page);

    await expect(page.locator("h1")).toHaveText("Validate auth entries");
  });

  test("Shows auth mode selector defaulting to Enforce", async ({ page }) => {
    await seedSessionStorageAndNavigate(page);

    const authModeSelect = page.locator("#validate-auth-mode");
    await expect(authModeSelect).toBeVisible();
    await expect(authModeSelect).toHaveValue("enforce");
  });

  test("Shows signed transaction XDR in read-only picker", async ({ page }) => {
    await seedSessionStorageAndNavigate(page);

    const xdrPicker = page.locator("#validate-xdr-blob");
    await expect(xdrPicker).toBeVisible();
    await expect(xdrPicker).toBeDisabled();
  });

  test("Validate button is enabled when signed XDR exists", async ({
    page,
  }) => {
    await seedSessionStorageAndNavigate(page);

    const validateButton = page.getByRole("button", { name: "Validate", exact: true });
    await expect(validateButton).toBeEnabled();
  });

  test("Shows success alert and result on successful enforce simulation", async ({
    page,
  }) => {
    await mockEnforceSimulationSuccess(page);
    await seedSessionStorageAndNavigate(page);

    const validateButton = page.getByRole("button", { name: "Validate", exact: true });
    await validateButton.click();

    // Wait for success alert
    await expect(page.getByText("Auth entries validated")).toBeVisible();
    await expect(
      page.getByText(
        "All authorization entry signatures are valid. The transaction is ready to submit.",
      ),
    ).toBeVisible();

    // Validation result JSON should be visible
    const resultArea = page.getByTestId("validate-step-response");
    await expect(resultArea).toBeVisible();
  });

  test("Shows error alert on failed enforce simulation", async ({ page }) => {
    await mockEnforceSimulationFailure(page);
    await seedSessionStorageAndNavigate(page);

    const validateButton = page.getByRole("button", { name: "Validate", exact: true });
    await validateButton.click();

    await expect(page.getByText("Validation failed")).toBeVisible();
  });

  test("Shows resource table toggle after successful validation", async ({
    page,
  }) => {
    await mockEnforceSimulationSuccess(page);
    await seedSessionStorageAndNavigate(page);

    const validateButton = page.getByRole("button", { name: "Validate", exact: true });
    await validateButton.click();

    await expect(
      page.getByText("View resources and fees from validation"),
    ).toBeVisible();
  });

  test("Stepper shows validate step as active", async ({ page }) => {
    await seedSessionStorageAndNavigate(page);

    const stepper = page.locator(".TransactionStepper");
    const validateStep = stepper.locator(
      '.TransactionStepper__step[data-is-active="true"]',
    );
    await expect(validateStep).toContainText("Validate transaction");
  });

  test("Stepper shows validate step description", async ({ page }) => {
    await seedSessionStorageAndNavigate(page);

    await expect(
      page.getByText(
        "This transaction contains authorization entries that need to be validated before submitting.",
      ),
    ).toBeVisible();
  });

  test("Next button is disabled before validation", async ({ page }) => {
    await seedSessionStorageAndNavigate(page);

    const nextButton = page.getByRole("button", {
      name: "Next: Submit transaction",
    });
    await expect(nextButton).toBeDisabled();
  });

  test("Next button is enabled after successful validation", async ({
    page,
  }) => {
    await mockEnforceSimulationSuccess(page);
    await seedSessionStorageAndNavigate(page);

    const validateButton = page.getByRole("button", { name: "Validate", exact: true });
    await validateButton.click();

    // Wait for success
    await expect(page.getByText("Auth entries validated")).toBeVisible();

    const nextButton = page.getByRole("button", {
      name: "Next: Submit transaction",
    });
    await expect(nextButton).toBeEnabled();
  });
});
