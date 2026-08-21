import { baseURL } from "../../playwright.config";
import { test, expect } from "@playwright/test";

/**
 * Routing tests for the import flow's signature analysis.
 *
 * Offline the flow can only attribute signatures to signers derivable from the
 * envelope, so it routes on what it can prove:
 * - Every required signer accounted for → skip straight to submit, preserving
 *   the existing signatures.
 * - Anything less (e.g. a multisig tx signed by an on-chain cosigner) → route
 *   through the sign step so the user can review the existing signatures, while
 *   keeping submit reachable without adding another signature (an unnecessary
 *   one is rejected as txBadAuthExtra).
 */
test.describe("Import transaction — signature-based routing", () => {
  /**
   * Classic testnet tx whose source is GDJAIV… (a multisig account) with a
   * payment operation sourced by GB4H6GC7…. The single signature is GB4H6GC7's,
   * which the network treats as a cosigner covering GDJAIV too. Offline we can
   * only attribute it to GB4H6GC7, so GDJAIV reads as "missing".
   */
  const MULTISIG_XDR =
    "AAAAAgAAAADSBFf5wA+BWEc1jDmwvbVupg1OrohBSRvHtEUG0FmTSwAAAGQAJoazAAAAFgAAAAAAAAAAAAAAAQAAAAEAAAAAeH8YX2LLiZESynVxH8gRYbkGo9kp9WvTIKpupYBaGOwAAAABAAAAALeAVmIAOom1tFe0PE2ZHWOn+hSTZuYY136c6XpoWKBVAAAAAAAAAAAC+vCAAAAAAAAAAAGAWhjsAAAAQH33HKhPjIpWCuTTg0UwM2za+/cipMaDdrFliHBTmRcNRck0XW3Y5AYY4xu2+u/cUEzShd+1V2b7sRZdO8adGwg=";

  /** Shortened form of GB4H6GC7… as rendered in the signatures table. */
  const MULTISIG_SIGNER_SHORT = "GB4H...ZERA";

  /**
   * Classic testnet payment tx signed by its own source account (GBHKAZ4O…),
   * the only required signer — so offline analysis can prove it complete.
   */
  const FULLY_SIGNED_XDR =
    "AAAAAgAAAABOoGeOE2jFIJ/Ya0mBq/BBdk8dvRgUkY5swIKyjc9OtQAAAGQAAAAAAAACIgAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAAA55ZjOXdOOulfzeLPXjLDLdplq/5HGjapWAXjGSkdAkwAAAAAAAAAABfXhAAAAAAAAAAABjc9OtQAAAEDsO01zNJsMvXHO6p52XeEJ7SlitdoQyoOpboeDwYAp0I+YxoyEYUSS9q3DLlQhZFGB4FoMOsVuPtVQ+mZ4O70K";

  test("Multisig tx signed by a cosigner routes to sign, then submits without signing again", async ({
    page,
  }) => {
    await page.goto(`${baseURL}/transaction/import`);

    await page.getByLabel("Transaction envelope in XDR").fill(MULTISIG_XDR);

    // Offline analysis can't prove the multisig account is covered, so the
    // import step must not claim the tx is ready to submit.
    await expect(
      page.getByText("Transaction imported successfully."),
    ).toBeVisible();
    await expect(
      page.getByText("All required signatures are included."),
    ).toBeHidden();

    // The one signature present is attributed to the operation source
    // (GB4H6GC7…) on the Signatures tab.
    await page.getByTestId("signatures").click();
    await expect(page.getByText(MULTISIG_SIGNER_SHORT)).toBeVisible();

    // The default next action is the sign step, not submit.
    const nextButton = page.locator('[data-position="right"]');
    await expect(nextButton).toHaveText("Sign transaction");
    await nextButton.click();
    await expect(page.locator("h1")).toHaveText("Sign transaction");

    // Offline the source account still reads as unsigned, so the step asks for
    // a signature — and the existing signatures are surfaced for review so a
    // cosigner can decide whether one is actually needed.
    await expect(
      page.getByText("This transaction needs signature(s)."),
    ).toBeVisible();
    await expect(page.getByText(MULTISIG_SIGNER_SHORT)).toBeVisible();

    // The key fix: submit is reachable without adding another signature.
    await expect(nextButton).toHaveText("Submit transaction");
    await expect(nextButton).toBeEnabled();

    await nextButton.click();
    await expect(page.locator("h1")).toHaveText("Submit transaction");
  });

  test("Provably complete tx skips the sign step", async ({ page }) => {
    await page.goto(`${baseURL}/transaction/import`);

    await page.getByLabel("Transaction envelope in XDR").fill(FULLY_SIGNED_XDR);

    await expect(
      page.getByText("All required signatures are included."),
    ).toBeVisible();

    // Every required signer is accounted for, so Next jumps to submit and the
    // existing signature is carried through instead of being replaced.
    const nextButton = page.locator('[data-position="right"]');
    await expect(nextButton).toHaveText("Submit transaction");
    await nextButton.click();
    await expect(page.locator("h1")).toHaveText("Submit transaction");
  });
});
