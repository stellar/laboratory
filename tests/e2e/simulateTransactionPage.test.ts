import { test, expect } from "@playwright/test";

test.describe("Simulate Transaction Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/transaction/simulate");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Simulate transaction");
  });

  test.describe("Instruction Leeway Input", () => {
    test("error when inputting a non whole number", async ({ page }) => {
      const instructionLeewayOn = page.getByLabel("Instruction Leeway");
      await instructionLeewayOn.fill("aaa");
      await expect(page.getByText("Expected a whole number.")).toBeVisible();
    });

    test("previous response should be removed when inputting a non whole number", async ({
      page,
    }) => {
      const instructionLeewayOn = page.getByLabel("Instruction Leeway");

      // Getting a success response
      const xdrInput = page.getByLabel(
        "Input a base-64 encoded TransactionEnvelope",
      );
      const txResponseCard = page.getByTestId("simulate-tx-response");
      const simulateTxBtn = page.getByRole("button", {
        name: "Simulate transaction",
      });

      await xdrInput.fill(MOCK_VALID_SUCCESS_TX_XDR_RPC);

      expect(simulateTxBtn).toBeEnabled();

      // Mock the RPC submission api call
      await page.route("https://soroban-testnet.stellar.org", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            result: {
              status: "SUCCESS",
            },
          }),
        });
      });

      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes("soroban-testnet") &&
          response.status() === 200,
      );

      await simulateTxBtn.click();

      await responsePromise;

      await expect(txResponseCard).toBeVisible();

      // Typing in the wrong instruction leeway should remove the previous response
      await instructionLeewayOn.fill("aaa");
      await expect(page.getByText("Expected a whole number.")).toBeVisible();

      await expect(txResponseCard).toBeHidden();
    });

    test("simulate button to be enabled when inputting a whole number for instruction leeway and the correct format xdr", async ({
      page,
    }) => {
      const simulateTxBtn = page.getByRole("button", {
        name: "Simulate transaction",
      });
      const xdrInput = page.getByLabel(
        "Input a base-64 encoded TransactionEnvelope",
      );

      await expect(simulateTxBtn).toBeDisabled();

      const instructionLeewayOn = page.getByLabel("Instruction Leeway");
      await instructionLeewayOn.fill("23423423");

      // inputting the leeway alone isn't enough to enable the simulate tx button
      await expect(simulateTxBtn).toBeDisabled();

      await xdrInput.fill(MOCK_VALID_SUCCESS_TX_XDR_RPC);

      await expect(simulateTxBtn).toBeEnabled();
    });
  });

  test.describe("Invalid XDR Flow", () => {
    test("display an error with a random text", async ({ page }) => {
      const invalidXdrMsg = page.getByText(
        "Unable to parse input XDR into Transaction Envelope",
      );
      const xdrInput = page.getByLabel(
        "Input a base-64 encoded TransactionEnvelope",
      );
      await xdrInput.fill("ssdfsdf");
      await expect(invalidXdrMsg).toBeVisible();

      const simulateTxBtn = page.getByRole("button", {
        name: "Simulate transaction",
      });

      await expect(simulateTxBtn).toBeDisabled();
    });

    test("display an error with a valid XDR that is not TX Envelope", async ({
      page,
    }) => {
      const invalidXdrMsg = page.getByText(
        "Unable to parse input XDR into Transaction Envelope",
      );
      const xdrInput = page.getByLabel(
        "Input a base-64 encoded TransactionEnvelope",
      );
      const simulateTxBtn = page.getByRole("button", {
        name: "Simulate transaction",
      });

      // Simulate transaction button to be disabled by default
      await expect(simulateTxBtn).toBeDisabled();

      // Input an XDR in correct format
      await xdrInput.fill(MOCK_VALID_FAILED_TX_XDR);

      // Simulate transaction button to be enabled since the correct XDR input
      await expect(simulateTxBtn).toBeEnabled();

      // Input an XDR in unsupported format
      await xdrInput.fill(MOCK_SC_VAL_XDR);

      // Error message to be visible
      await expect(invalidXdrMsg).toBeVisible();

      // Simulate transaction button to be disabled
      await expect(simulateTxBtn).toBeDisabled();
    });
  });

  test.describe("Valid XDR with a Failed 400 Submission Flow", () => {
    test("Submit via RPC", async ({ page }) => {
      const xdrInput = page.getByLabel(
        "Input a base-64 encoded TransactionEnvelope",
      );
      const txResponseCard = page.getByTestId("simulate-tx-response");

      await xdrInput.fill(MOCK_VALID_FAILED_TX_XDR);

      const simulateTxBtn = page.getByRole("button", {
        name: "Simulate transaction",
      });

      await expect(simulateTxBtn).toBeEnabled();

      // Mock the RPC submission api call
      await page.route("https://soroban-testnet.stellar.org", async (route) => {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify(MOCK_TX_XDR_FAILED_RPC_RESPONSE),
        });
      });

      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes("soroban") && response.status() === 400,
      );

      await simulateTxBtn.click();

      await responsePromise;

      await expect(txResponseCard).toBeVisible();

      const responseText = await txResponseCard.textContent();

      expect(responseText).toContain("ERROR");
    });
  });

  test.describe("Valid XDR with a Successful Submission Flow", () => {
    test("Submit via RPC", async ({ page }) => {
      const xdrInput = page.getByLabel(
        "Input a base-64 encoded TransactionEnvelope",
      );
      const txResponseCard = page.getByTestId("simulate-tx-response");
      const simulateTxBtn = page.getByRole("button", {
        name: "Simulate transaction",
      });

      await xdrInput.fill(MOCK_VALID_SUCCESS_TX_XDR_RPC);

      expect(simulateTxBtn).toBeEnabled();

      // Mock the RPC submission api call
      await page.route("https://soroban-testnet.stellar.org", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            result: {
              status: "SUCCESS",
            },
          }),
        });
      });

      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes("soroban-testnet") &&
          response.status() === 200,
      );

      await simulateTxBtn.click();

      await responsePromise;

      await expect(txResponseCard).toBeVisible();

      const responseText = await txResponseCard.textContent();

      expect(responseText).toContain("Simulation Result");

      // Omitting the API end result because the test gives inconsistenet results
    });
  });
});

// =============================================================================
// Mock data
// =============================================================================
const MOCK_SC_VAL_XDR =
  "AAAAEQAAAAEAAAAGAAAADwAAAAZhbW91bnQAAAAAAAoAAAAAAAAAAAAACRhOcqAAAAAADwAAAAxib290c3RyYXBwZXIAAAASAAAAARssFqxD/prgmYc9vGkaqslWrGlPINzMYTLc4yqRfO3AAAAADwAAAAxjbG9zZV9sZWRnZXIAAAADAz6ilAAAAA8AAAAIcGFpcl9taW4AAAAKAAAAAAAAAAAAAAARdlkuAAAAAA8AAAAEcG9vbAAAABIAAAABX/a7xfliM8nFgGel6pbCM6fT/kqrHAITNtWZQXgDlIIAAAAPAAAAC3Rva2VuX2luZGV4AAAAAAMAAAAA";

const MOCK_VALID_FAILED_TX_XDR =
  "AAAAAgAAAADJrq4b4AopDZibkeBWpDxuWKUcY4FUUNQdIEF3Nm9dkQAAAGQAAAIiAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAACXlGN76T6NQcaUJxbEkH3mi1HHWsHnLqMDdlLl9NlJgQAAAAAAAAAABfXhAAAAAAAAAAAA";

const MOCK_VALID_SUCCESS_TX_XDR_RPC =
  "AAAAAgAAAAAg4dbAxsGAGICfBG3iT2cKGYQ6hK4sJWzZ6or1C5v6GAAAAGQAJsOiAAAAEQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAGAAAAAAAAAABzAP+dP0PsNzYvFF1pv7a8RQXwH5eg3uZBbbWjE9PwAsAAAAJaW5jcmVtZW50AAAAAAAAAgAAABIAAAAAAAAAACDh1sDGwYAYgJ8EbeJPZwoZhDqEriwlbNnqivULm/oYAAAAAwAAAAMAAAAAAAAAAAAAAAA=";

const MOCK_TX_XDR_FAILED_RPC_RESPONSE = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    errorResultXdr: "AAAAAAAAAGT////7AAAAAA==",
    status: "ERROR",
    hash: "794e2073e130dc09d2b7e8b147b51f6ef75ff171c83c603bc8ab4cffa3f341a1",
    latestLedger: 1305084,
    latestLedgerCloseTime: "1733355115",
  },
};
