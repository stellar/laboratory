import { baseURL } from "../../playwright.config";
import { test, expect, Page } from "@playwright/test";

/**
 * Regression tests for resetting downstream steps when the transaction is
 * edited on the build step after the user has already progressed past it.
 *
 * A signature is produced against a specific transaction; if the build inputs
 * change afterwards, the signed envelope is stale and must not be carried
 * through to submit. Editing build inputs should clear the sign (and any
 * simulate/validate) results so the user re-runs those steps.
 */
test.describe("Build flow — reset downstream on build edit", () => {
  const SOURCE_ACCOUNT =
    "GAGSY6UVUIINHRHSSDO7NMCM7ADWUF5UJ4ZGGJSFSXKWNJDRW6AA4H3Q";
  const SEQUENCE_NUMBER = "4466559829409793";
  const DESTINATION = "GC3N3GAECL3PJOWIKAAKPOB677WHCUNWZRULANQMHEIL4WDX5FICMF3I";
  const MOCK_SECRET_KEY =
    "SCAM6CZNCLJFQOGSC7LLE2KMBYCBD7S5IYV447MZX5NHPGCHRHPYITCF";

  const SIGNED_MESSAGE = "Transaction signed and ready to submit.";

  const buildValidClassicTx = async (page: Page, startingBalance: string) => {
    await page.getByLabel("Source account").fill(SOURCE_ACCOUNT);
    await page
      .getByLabel("Transaction sequence number")
      .fill(SEQUENCE_NUMBER);

    const operation_0 = page.getByTestId("build-transaction-operation-0");
    await operation_0
      .getByLabel("Operation type")
      .selectOption({ value: "create_account" });
    await operation_0.getByLabel("Destination").fill(DESTINATION);
    await operation_0.getByLabel("Starting balance").fill(startingBalance);

    // XDR is built once params + operation are valid.
    await expect(
      page.getByTestId("build-transaction-envelope-xdr"),
    ).toBeVisible();
  };

  const signWithSecretKey = async (page: Page) => {
    const signComponent = page.getByTestId("sign-tx-xdr-sign-step");
    await signComponent
      .getByPlaceholder(
        "Secret key (starting with S) or hash preimage (in hex)",
      )
      .first()
      .fill(MOCK_SECRET_KEY);
    await signComponent.getByRole("button", { name: "Sign" }).click();
    await expect(page.getByText(SIGNED_MESSAGE)).toBeVisible();
  };

  const nextButton = (page: Page) => page.locator('[data-position="right"]');
  const backButton = (page: Page) => page.locator('[data-position="left"]');

  test("Editing a build input after signing clears the signature", async ({
    page,
  }) => {
    await page.goto(`${baseURL}/transaction/build`);

    // Build a valid classic tx, advance to sign, and sign it.
    await buildValidClassicTx(page, "1");
    await nextButton(page).click();
    await expect(page.locator("h1")).toHaveText("Sign transaction");
    await signWithSecretKey(page);

    // Navigating back and forth alone must NOT drop the signature.
    await backButton(page).click();
    await expect(page.locator("h1")).toHaveText("Build transaction");
    await nextButton(page).click();
    await expect(page.locator("h1")).toHaveText("Sign transaction");
    await expect(page.getByText(SIGNED_MESSAGE)).toBeVisible();

    // Now edit the transaction on the build step — this must reset the signature.
    await backButton(page).click();
    await expect(page.locator("h1")).toHaveText("Build transaction");
    await page
      .getByTestId("build-transaction-operation-0")
      .getByLabel("Starting balance")
      .fill("2");
    // Let the rebuilt XDR settle.
    await expect(
      page.getByTestId("build-transaction-envelope-xdr"),
    ).toBeVisible();

    // Back on the sign step the previous signature is gone and Next is blocked.
    await nextButton(page).click();
    await expect(page.locator("h1")).toHaveText("Sign transaction");
    await expect(page.getByText(SIGNED_MESSAGE)).toBeHidden();
    await expect(nextButton(page)).toBeDisabled();
  });
});
