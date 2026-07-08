import { baseURL } from "../../playwright.config";
import { test, expect } from "@playwright/test";

/**
 * Regression test for importing a multisig transaction that is already signed
 * by a cosigner the network — but not offline analysis — recognizes.
 *
 * This classic tx (testnet) has source GDJAIV… (a multisig account) and a
 * payment operation sourced by GB4H6GC7…. The single signature is GB4H6GC7's,
 * which the network treats as a cosigner covering GDJAIV too. Offline we can
 * only attribute it to GB4H6GC7, so GDJAIV looks "missing" — but the tx is in
 * fact submittable. The flow must let the user reach submit without adding a
 * signature (adding an unnecessary one is rejected as txBadAuthExtra).
 */
test.describe("Import multisig tx — submit without extra signature", () => {
  const MULTISIG_XDR =
    "AAAAAgAAAADSBFf5wA+BWEc1jDmwvbVupg1OrohBSRvHtEUG0FmTSwAAAGQAJoazAAAAFgAAAAAAAAAAAAAAAQAAAAEAAAAAeH8YX2LLiZESynVxH8gRYbkGo9kp9WvTIKpupYBaGOwAAAABAAAAALeAVmIAOom1tFe0PE2ZHWOn+hSTZuYY136c6XpoWKBVAAAAAAAAAAAC+vCAAAAAAAAAAAGAWhjsAAAAQH33HKhPjIpWCuTTg0UwM2za+/cipMaDdrFliHBTmRcNRck0XW3Y5AYY4xu2+u/cUEzShd+1V2b7sRZdO8adGwg=";

  test("Reaches submit without signing again", async ({ page }) => {
    await page.goto(`${baseURL}/transaction/import`);

    await page.getByLabel("Transaction envelope in XDR").fill(MULTISIG_XDR);
    await expect(
      page.getByText("Transaction imported successfully."),
    ).toBeVisible();

    // Offline analysis can't confirm the multisig account is covered, so it
    // must NOT hard-assert a missing signature.
    await expect(page.getByText("Missing signature")).toBeHidden();
    await expect(
      page.getByText("you can submit to let the network verify").first(),
    ).toBeVisible();

    // Advance to the sign step (default action for a not-provably-complete tx).
    const nextButton = page.locator('[data-position="right"]');
    await expect(nextButton).toHaveText("Sign transaction");
    await nextButton.click();
    await expect(page.locator("h1")).toHaveText("Sign transaction");

    // The key fix: submit is reachable without adding another signature.
    await expect(nextButton).toHaveText("Submit transaction");
    await expect(nextButton).toBeEnabled();

    await nextButton.click();
    await expect(page.locator("h1")).toHaveText("Submit transaction");
  });
});
