import { baseURL } from "../../playwright.config";
import { test, expect } from "@playwright/test";

test.describe("Import Transaction Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/transaction/import`);
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Import transaction");
  });

  test("Imports a VALID Classic Transaction and shows the overview", async ({
    page,
  }) => {
    const xdrInput = page.getByLabel("Transaction envelope in XDR");
    await xdrInput.fill(MOCK_TX_XDR);

    // Once the XDR parses, the input is replaced by a success alert and the
    // overview card appears.
    await expect(
      page.getByText("Transaction imported successfully."),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Transaction overview" }),
    ).toBeVisible();

    /*** TX Overview Details ***/
    // Network passphrase
    await expect(page.getByLabel("Signing for")).toHaveValue(
      "Test SDF Network ; September 2015",
    );

    // TX XDR
    await expect(page.getByLabel("Transaction envelope XDR")).toHaveValue(
      MOCK_TX_XDR,
    );

    // TX HASH
    await expect(page.getByLabel("Transaction hash")).toHaveValue(
      "794e2073e130dc09d2b7e8b147b51f6ef75ff171c83c603bc8ab4cffa3f341a1",
    );

    // Source Account
    await expect(page.getByLabel("Source account")).toHaveValue(
      "GDE25LQ34AFCSDMYTOI6AVVEHRXFRJI4MOAVIUGUDUQEC5ZWN5OZDLAZ",
    );

    // Sequence number
    await expect(page.getByLabel("Sequence number")).toHaveValue(
      "2345052143617",
    );

    // Transaction Fee (stroops)
    await expect(page.getByLabel("Transaction fee (stroops)")).toHaveValue(
      "100",
    );

    // Number of operations
    await expect(page.getByLabel("Number of operations")).toHaveValue("1");

    // This envelope carries no signatures, so the Signatures section is hidden.
    await expect(page.getByText("Signer", { exact: true })).toBeHidden();

    // The Next button defaults to signing for an unsigned classic tx.
    const nextButton = page.locator('[data-position="right"]');
    await expect(nextButton).toHaveText("Sign transaction");
    await expect(nextButton).toBeEnabled();
  });

  test("Imports a VALID Soroban Transaction and shows the overview", async ({
    page,
  }) => {
    const xdrInput = page.getByLabel("Transaction envelope in XDR");
    await xdrInput.fill(MOCK_SOROBAN_XDR);

    await expect(
      page.getByText("Transaction imported successfully."),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Transaction overview" }),
    ).toBeVisible();

    /*** TX Overview Details ***/
    // Network passphrase
    await expect(page.getByLabel("Signing for")).toHaveValue(
      "Test SDF Network ; September 2015",
    );

    // TX XDR
    await expect(page.getByLabel("Transaction envelope XDR")).toHaveValue(
      MOCK_SOROBAN_XDR,
    );

    // TX HASH
    await expect(page.getByLabel("Transaction hash")).toHaveValue(
      "ab12155abb53a5f8177e47683a870976621fcac62cc3441d997cc0aafaac99ad",
    );

    // Source Account
    await expect(page.getByLabel("Source account")).toHaveValue(
      "GBOTV3EYB4BO26MK3PFXNDWKI54XGXMLMK52F7TYLNOOQLL2GCJGBUQQ",
    );

    // Sequence number
    await expect(page.getByLabel("Sequence number")).toHaveValue(
      "1112100176920589",
    );

    // Transaction Fee (stroops)
    await expect(page.getByLabel("Transaction fee (stroops)")).toHaveValue(
      "1920974",
    );

    // Number of operations
    await expect(page.getByLabel("Number of operations")).toHaveValue("1");

    // An unsigned Soroban tx must be simulated before signing, so the Next
    // button defaults to the simulate step.
    const nextButton = page.locator('[data-position="right"]');
    await expect(nextButton).toHaveText("Simulate transaction");
    await expect(nextButton).toBeEnabled();
  });

  test("Imports a transaction with 3 operations", async ({ page }) => {
    const xdrInput = page.getByLabel("Transaction envelope in XDR");
    await xdrInput.fill(MOCK_TX_XDR_3_OPERATIONS);

    await expect(
      page.getByRole("heading", { name: "Transaction overview" }),
    ).toBeVisible();

    /*** TX Overview Details ***/
    // Network passphrase
    await expect(page.getByLabel("Signing for")).toHaveValue(
      "Test SDF Network ; September 2015",
    );

    // TX XDR
    await expect(page.getByLabel("Transaction envelope XDR")).toHaveValue(
      MOCK_TX_XDR_3_OPERATIONS,
    );

    // TX HASH
    await expect(page.getByLabel("Transaction hash")).toHaveValue(
      "892110aecc9f30662d5ececcf2a1f2fdd03fc42f3b3ca55c475a05d421838e60",
    );

    // Source Account
    await expect(page.getByLabel("Source account")).toHaveValue(
      "GBTQEP2NS6WSRRXYXZ4JJLLLO4OWH5LWHZFEGL5PMOQQDELD4MY5YUWJ",
    );

    // Sequence number
    await expect(page.getByLabel("Sequence number")).toHaveValue(
      "4552819952582657",
    );

    // Transaction Fee (stroops)
    await expect(page.getByLabel("Transaction fee (stroops)")).toHaveValue(
      "300",
    );

    // Number of operations
    await expect(page.getByLabel("Number of operations")).toHaveValue("3");
  });

  test("Advances to the sign step", async ({ page }) => {
    const xdrInput = page.getByLabel("Transaction envelope in XDR");
    await xdrInput.fill(MOCK_TX_XDR);

    const nextButton = page.locator('[data-position="right"]');
    await expect(nextButton).toHaveText("Sign transaction");
    await nextButton.click();

    await expect(page.locator("h1")).toHaveText("Sign transaction");
    await expect(
      page.getByText(
        "To be included in the ledger, the transaction must be signed and submitted to the network.",
      ),
    ).toBeVisible();
  });

  test("Shows an error for an ScVal Type XDR that is not a Transaction Envelope", async ({
    page,
  }) => {
    const decodeErrorMsg = page.getByText(
      "Unable to parse input XDR into Transaction Envelope",
    );

    await expect(decodeErrorMsg).toBeHidden();

    const xdrInput = page.getByLabel("Transaction envelope in XDR");
    await xdrInput.fill(MOCK_SC_VAL_XDR);

    await expect(decodeErrorMsg).toBeVisible();
  });

  test("Shows an error for invalid XDR", async ({ page }) => {
    const decodeErrorMsg = page.getByText(
      "Unable to parse input XDR into Transaction Envelope",
    );

    await expect(decodeErrorMsg).toBeHidden();

    const xdrInput = page.getByLabel("Transaction envelope in XDR");
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

const MOCK_SOROBAN_XDR =
  "AAAAAgAAAABdOuyYDwLteYrby3aOykd5c12LYrui/nhbXOgtejCSYAAdT84AA/NzAAAADQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAGAAAAAAAAAABlL5dkzzoyLMbmYEsrdy39HekdojWLuKyg7lC02jClEoAAAAEbWludAAAAAIAAAASAAAAAAAAAADRh2IaEYIegGIrvdxKRF5FM9AGClfaqPnxY7SmWduVggAAAAoAAAAAAAAAAAAAAAAAAAABAAAAAQAAAAAAAAAAAAAAAZS+XZM86MizG5mBLK3ct/R3pHaI1i7isoO5QtNowpRKAAAABG1pbnQAAAACAAAAEgAAAAAAAAAA0YdiGhGCHoBiK73cSkReRTPQBgpX2qj58WO0plnblYIAAAAKAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAABAAAAAAAAAAEAAAAHJ9d4ncm4GZ+WLWTVqsnHAEkBZcuJ/PoXwvzFTQBx5ygAAAACAAAABgAAAAGUvl2TPOjIsxuZgSyt3Lf0d6R2iNYu4rKDuULTaMKUSgAAABAAAAABAAAAAgAAAA8AAAAHQmFsYW5jZQAAAAASAAAAAAAAAADRh2IaEYIegGIrvdxKRF5FM9AGClfaqPnxY7SmWduVggAAAAEAAAAGAAAAAZS+XZM86MizG5mBLK3ct/R3pHaI1i7isoO5QtNowpRKAAAAFAAAAAEAL4fdAABS/AAAAfwAAAAAAB1PBgAAAAA=";
