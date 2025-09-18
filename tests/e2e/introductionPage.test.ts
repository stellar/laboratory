import { test, expect, Locator } from "@playwright/test";

test.describe("Introduction Page", () => {
  let sections: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
    sections = page.locator(".Lab__home__section");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText(
      "Simulate, Analyze, and Explore — All in One place",
    );
    await expect(sections).toHaveCount(6);
  });

  test("Slider", async ({ page }) => {
    const sliderCards = page.locator(
      ".Lab__home__introCards > .Lab__home__intro__card",
    );

    await expect(sliderCards).toHaveCount(4);

    await assertSliderCardTitle({
      sliderCards,
      index: 0,
      title: "Decode and Inspect",
    });

    await assertSliderCardTitle({
      sliderCards,
      index: 1,
      title: "Build, Sign, Simulate & Submit Transactions",
    });

    await assertSliderCardTitle({
      sliderCards,
      index: 2,
      title: "Interact with API Endpoints",
    });

    await assertSliderCardTitle({
      sliderCards,
      index: 3,
      title: "Contract Explorer",
    });
  });

  test("Tutorials", async () => {
    const tutorialsSection = sections.nth(2);

    await assertSectionHeader({
      section: tutorialsSection,
      eyebrow: "Learn from tutorials",
      heading: "Follow our step-by-step tutorials to start building",
    });

    await expect(
      tutorialsSection.locator(".Lab__home__tutorials__item"),
    ).toHaveCount(20);
  });

  test("Save and Share", async () => {
    const saveShareSection = sections.nth(4);

    await assertSectionHeader({
      section: saveShareSection,
      eyebrow: "Save and share",
      heading: "Save and share your work to revisit experiment and collaborate",
    });
  });

  test("Resources", async () => {
    const resourcesSection = sections.nth(5);

    await assertSectionHeader({
      section: resourcesSection,
      eyebrow: "Resources",
      heading: "Everything you need to build and connect",
    });

    const items = resourcesSection.locator(".Lab__home__resources__item");

    await expect(items).toHaveCount(5);
    await expect(items.locator(".Lab__home__resources__title")).toHaveText([
      "YouTube",
      "Discord",
      "Stellar Quest",
      "X (Twitter)",
      "Developer Docs",
    ]);
  });

  test("Networks", async ({ page }) => {
    const networksSection = sections.nth(3);

    await assertSectionHeader({
      section: networksSection,
      eyebrow: "Use on multiple networks",
      heading: "Choose your network to get started",
    });

    const networkCards = networksSection.locator(".Lab__home__networks__item");

    await expect(networkCards).toHaveCount(3);

    // Cards
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
      title: "Local Network",
      description: "Run a local Stellar network for development.",
    });

    // Switch network buttons
    const testnetBtn = networkCards
      .nth(0)
      .locator("button", { hasText: "Switch to Testnet" });
    const mainnetBtn = networkCards
      .nth(1)
      .locator("button", { hasText: "Switch to Mainnet" });

    await expect(testnetBtn).toBeDisabled();
    await expect(mainnetBtn).toBeEnabled();
    await mainnetBtn.click({ timeout: 2000 });

    const modal = page.locator(".Modal__container");
    await expect(modal).toBeVisible();

    const switchButton = modal.locator("button", {
      hasText: "Switch to Mainnet",
    });
    await expect(switchButton).toBeVisible();
    await switchButton.click();

    await expect(testnetBtn).toBeEnabled();
    await expect(mainnetBtn).toBeDisabled();
  });
});

// =============================================================================
// Helpers
// =============================================================================
const assertSliderCardTitle = async ({
  sliderCards,
  index,
  title,
}: {
  sliderCards: Locator;
  index: number;
  title: string;
}) => {
  await expect(
    sliderCards.nth(index).locator(".Lab__home__introCards__title"),
  ).toHaveText(title);
};

const assertSectionHeader = async ({
  section,
  eyebrow,
  heading,
}: {
  section: Locator;
  eyebrow: string;
  heading: string;
}) => {
  await expect(section.locator(".Lab__home__eyebrow")).toHaveText(eyebrow);
  await expect(section.locator("h2")).toHaveText(heading);
};

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
  await expect(
    cards.nth(index).locator(".Lab__home__networks__title"),
  ).toHaveText(title);
  await expect(
    cards.nth(index).locator(".Lab__home__networks__description"),
  ).toHaveText(description);
};
