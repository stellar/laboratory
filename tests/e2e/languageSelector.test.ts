import { test, expect } from "@playwright/test";

test.describe("Language selector", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
  });

  test("Defaults to English", async ({ page }) => {
    await expect(page.getByTestId("language-selector-trigger")).toHaveText(
      "Language: English",
    );
    await expect(page.getByTestId("language-selector-menu")).toBeHidden();
  });

  test("Opens dropdown and shows language options", async ({ page }) => {
    await page.getByTestId("language-selector-trigger").click();
    await expect(page.getByTestId("language-selector-menu")).toBeVisible();
    await expect(page.getByTestId("language-selector-option")).toContainText([
      "English",
      "Español",
      "Français",
      "Português",
      "Deutsch",
    ]);
  });

  test("Active language shows Current marker", async ({ page }) => {
    await page.getByTestId("language-selector-trigger").click();

    const activeOption = page
      .getByTestId("language-selector-option")
      .filter({ hasText: "English" });

    await expect(activeOption).toHaveAttribute("data-is-active", "true");
    await expect(activeOption).toContainText("Current");
  });

  test("Escape closes the dropdown", async ({ page }) => {
    await page.getByTestId("language-selector-trigger").click();
    await expect(page.getByTestId("language-selector-menu")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByTestId("language-selector-menu")).toBeHidden();
  });

  test("Selecting a language sets the googtrans cookie", async ({
    page,
    context,
  }) => {
    await page.getByTestId("language-selector-trigger").click();

    await Promise.all([
      page.waitForNavigation({ waitUntil: "load" }),
      page
        .getByTestId("language-selector-option")
        .filter({ hasText: "Español" })
        .click(),
    ]);

    const cookies = await context.cookies();
    const googtrans = cookies.find((c) => c.name === "googtrans");
    expect(googtrans?.value).toBe("/en/es");
  });

  test("Selecting English resets the language", async ({ page, context }) => {
    // Set a non-English language first
    await page.getByTestId("language-selector-trigger").click();
    await Promise.all([
      page.waitForNavigation({ waitUntil: "load" }),
      page
        .getByTestId("language-selector-option")
        .filter({ hasText: "Español" })
        .click(),
    ]);

    // Reset back to English
    await page.getByTestId("language-selector-trigger").click();
    await Promise.all([
      page.waitForNavigation({ waitUntil: "load" }),
      page
        .getByTestId("language-selector-option")
        .filter({ hasText: "English" })
        .click(),
    ]);

    const cookies = await context.cookies();
    const googtrans = cookies.find((c) => c.name === "googtrans");
    expect(googtrans).toBeUndefined();
  });
});
