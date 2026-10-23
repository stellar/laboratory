import { baseURL } from "../../playwright.config";
import { test, expect, Locator } from "@playwright/test";

test.describe("Introduction Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/`);
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText(
      "Simulate, analyze, and explore — all in one place",
    );

    // Ask chat field
    await expect(page.locator("#home-ask-input")).toBeVisible();
    await expect(page.getByText("Start", { exact: true })).toBeDisabled();
  });

  test("Section headers", async ({ page }) => {
    await expect(page.locator(".SectionHeader h2")).toHaveText([
      "Start building",
      "Explore & inspect",
      "Network",
      "Learn by building",
      "Save and share your work",
    ]);
  });

  test("Start building", async ({ page }) => {
    const cards = page.locator(".StartBuilding .CardGrid__cell");

    await expect(cards).toHaveCount(4);
    await expect(cards.locator(".StartBuilding__heading")).toHaveText([
      "Fund account",
      "Build a transaction",
      "Deploy a smart contract",
      "Sign message",
    ]);
  });

  test("Explore & inspect", async ({ page }) => {
    const cards = page.locator(".ExploreInspect .CardGrid__cell");

    await expect(cards).toHaveCount(4);
    await expect(cards.locator(".ExploreInspect__title")).toHaveText([
      "Transactions.",
      "Smart contracts.",
      "API explorer.",
      "XDR tools.",
    ]);
  });

  test("Learn by building", async ({ page }) => {
    const cards = page.locator(".LearnByBuilding .CardGrid__cell");

    await expect(cards).toHaveCount(3);
    await expect(cards.locator(".LearnByBuilding__title")).toHaveText([
      "Create an account",
      "Payments",
      "Hello world",
    ]);
  });

  test("Networks", async ({ browser }) => {
    // Isolated context so the network change won’t affect other tests.
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${baseURL}/`);

    const networkCards = page.locator(".NetworkPicker .CardGrid__cell");

    await expect(networkCards).toHaveCount(3);

    await assertNetworkCardContent({
      cards: networkCards,
      index: 0,
      title: "Testnet",
      description: "Safely test transactions without real funds.",
    });
    await assertNetworkCardContent({
      cards: networkCards,
      index: 1,
      title: "Mainnet",
      description: "Build, test, and run real transactions on Stellar.",
    });
    await assertNetworkCardContent({
      cards: networkCards,
      index: 2,
      title: "Local network",
      description: "Run a local Stellar network for development.",
    });

    // Testnet is the default network, so its card shows the active status and
    // Mainnet offers a Switch button.
    await expect(
      networkCards.nth(0).locator(".NetworkPicker__status"),
    ).toHaveText("You’re on Testnet");

    const mainnetSwitch = networkCards
      .nth(1)
      .locator("button", { hasText: "Switch" });

    await expect(mainnetSwitch).toBeEnabled();
    await mainnetSwitch.click({ timeout: 2000 });

    const modal = page.locator(".Modal__container");
    await expect(modal).toBeVisible();

    const switchButton = modal.locator("button", {
      hasText: "Switch to Mainnet",
    });
    await expect(switchButton).toBeVisible();
    await switchButton.click();

    // Mainnet is now active; Testnet offers the Switch button instead.
    await expect(
      networkCards.nth(1).locator(".NetworkPicker__status"),
    ).toHaveText("You’re on Mainnet");
    await expect(
      networkCards.nth(0).locator("button", { hasText: "Switch" }),
    ).toBeEnabled();

    await context.close();
  });
});

// =============================================================================
// Helpers
// =============================================================================
const assertNetworkCardContent = async ({
  cards,
  index,
  title,
  description,
}: {
  cards: Locator;
  index: number;
  title: string;
  description: string;
}) => {
  await expect(cards.nth(index).locator(".NetworkIndicator")).toContainText(
    title,
  );
  await expect(
    cards.nth(index).locator(".NetworkPicker__description"),
  ).toHaveText(description);
};
