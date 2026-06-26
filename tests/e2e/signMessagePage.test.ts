import { baseURL } from "../../playwright.config";
import { test, expect } from "@playwright/test";

// A valid testnet keypair (reused from other e2e suites) so the signed result
// is deterministic.
const MOCK_SECRET = "SCX5AFVSAW7NUDWMYIO6E5BVLNHHU4YELSP2YI66YAQKPQXT2UXJWLJ6";
const MOCK_PUBLIC = "GBOTV3EYB4BO26MK3PFXNDWKI54XGXMLMK52F7TYLNOOQLL2GCJGBUQQ";
const MOCK_MESSAGE = "Hello, Stellar!";

test.describe("Sign Message Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/sign-message`);
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1").first()).toHaveText("Sign message");
  });

  test("Toggles between the Sign and Verify tabs", async ({ page }) => {
    // Defaults to the Sign tab.
    await expect(page.locator("#sign-message-input")).toBeVisible();
    await expect(page.locator("#verify-message-public-key")).toHaveCount(0);

    await page.getByTestId("verify").click();

    await expect(page.locator("#verify-message-public-key")).toBeVisible();
    await expect(page.locator("#sign-message-input")).toHaveCount(0);

    await page.getByTestId("sign").click();

    await expect(page.locator("#sign-message-input")).toBeVisible();
    await expect(page.locator("#verify-message-public-key")).toHaveCount(0);
  });

  test("Signs a message with a secret key and verifies it (round-trip)", async ({
    page,
  }) => {
    const messageInput = page.locator("#sign-message-input");
    const secretKeyContainer = page.getByTestId(
      "multipicker-sign-message-signer",
    );
    const secretKeyInput = secretKeyContainer.getByPlaceholder(
      "Secret key (starting with S)",
    );
    const signBtn = page
      .locator('[data-type="secretKey"]')
      .getByRole("button", { name: "Sign", exact: true });

    // Message signing produces a single signature, so there is no
    // "Add additional" secret-key button.
    await expect(
      secretKeyContainer.getByRole("button", { name: "Add additional" }),
    ).toHaveCount(0);

    // Sign button is disabled until both a message and a valid key are present.
    await expect(signBtn).toBeDisabled();

    await messageInput.fill(MOCK_MESSAGE);
    await secretKeyInput.fill(MOCK_SECRET);
    await expect(signBtn).toBeEnabled();

    await signBtn.click();

    // Success message + structured result (public key, signature — no XDR).
    await expect(page.getByText("Signed with", { exact: false })).toBeVisible();
    await expect(page.getByText("Message signed")).toBeVisible();
    await expect(page.getByText(MOCK_PUBLIC)).toBeVisible();

    // Click the "Verify" button on the signed-result card. This is the only
    // path that carries the signed result into the Verify tab (prefilled) and
    // surfaces the verification outcome — routing via the tab bar does not.
    await page.getByRole("button", { name: "Verify", exact: true }).click();

    const verifyPublicKey = page.locator("#verify-message-public-key");
    const verifyMessage = page.locator("#verify-message-message");
    const verifySignature = page.locator("#verify-message-signature");

    await expect(verifyPublicKey).toHaveValue(MOCK_PUBLIC);
    await expect(verifyMessage).toHaveValue(MOCK_MESSAGE);
    await expect(verifySignature).not.toHaveValue("");

    const verifyBtn = page.getByRole("button", { name: "Verify", exact: true });
    await verifyBtn.click();

    await expect(page.getByText("Signature is valid")).toBeVisible();
  });

  test("Verify fails when the message is tampered with", async ({ page }) => {
    const messageInput = page.locator("#sign-message-input");
    const secretKeyInput = page
      .getByTestId("multipicker-sign-message-signer")
      .getByPlaceholder("Secret key (starting with S)");
    const signBtn = page
      .locator('[data-type="secretKey"]')
      .getByRole("button", { name: "Sign", exact: true });

    await messageInput.fill(MOCK_MESSAGE);
    await secretKeyInput.fill(MOCK_SECRET);
    await signBtn.click();

    await expect(page.getByText(MOCK_PUBLIC)).toBeVisible();

    // Go to the Verify tab via the signed-result card's "Verify" button (the
    // path that prefills the form), then tamper with the message while keeping
    // the prefilled signature + public key.
    await page.getByRole("button", { name: "Verify", exact: true }).click();

    const verifyMessage = page.locator("#verify-message-message");
    await verifyMessage.fill("a different message");

    await page.getByRole("button", { name: "Verify", exact: true }).click();

    await expect(page.getByText("Signature is invalid")).toBeVisible();
  });

  test("Shows an error for an invalid secret key", async ({ page }) => {
    const messageInput = page.locator("#sign-message-input");
    const secretKeyInput = page
      .getByTestId("multipicker-sign-message-signer")
      .getByPlaceholder("Secret key (starting with S)");
    const signBtn = page
      .locator('[data-type="secretKey"]')
      .getByRole("button", { name: "Sign", exact: true });

    await messageInput.fill(MOCK_MESSAGE);
    await secretKeyInput.fill("not-a-valid-secret-key");

    await expect(
      page.getByText(
        "Invalid secret key. Please check your secret key and try again.",
      ),
    ).toBeVisible();
    await expect(signBtn).toBeDisabled();
  });
});
