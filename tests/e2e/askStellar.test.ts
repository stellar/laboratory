import { baseURL } from "../../playwright.config";
import { test, expect, Page } from "@playwright/test";

const NEEVAI_CHAT_ORIGIN = "https://prism-chat.neevai.io";

// Stand-in for the NeevAI chat iframe. It speaks the same embed protocol:
// announces NEEVAI_READY, acknowledges each question, and renders what it got.
// It also tries to read Lab's localStorage to prove the sandbox blocks it.
const MOCK_CHAT_HTML = `<!doctype html>
<html>
  <body>
    <p id="parent-access"></p>
    <ul id="questions"></ul>
    <button id="close" type="button">Close</button>
    <script>
      try {
        window.parent.localStorage.getItem("stellar_lab_saved_keypairs");
        document.getElementById("parent-access").textContent = "allowed";
      } catch (e) {
        document.getElementById("parent-access").textContent = "blocked";
      }

      window.addEventListener("message", (event) => {
        const data = event.data || {};

        if (data.type === "neevai:ask") {
          const item = document.createElement("li");
          item.textContent = data.question;
          document.getElementById("questions").appendChild(item);
          event.source.postMessage(
            { type: "NEEVAI_ASK_RECEIVED", id: data.id },
            event.origin,
          );
        }
      });

      document.getElementById("close").addEventListener("click", () => {
        window.parent.postMessage({ type: "NEEVAI_CLOSE" }, "*");
      });

      window.parent.postMessage({ type: "NEEVAI_READY", protocol: 2 }, "*");
    </script>
  </body>
</html>`;

const mockNeevaiChat = async (page: Page) => {
  await page.route(`${NEEVAI_CHAT_ORIGIN}/**`, (route) =>
    route.fulfill({ contentType: "text/html", body: MOCK_CHAT_HTML }),
  );
};

test.describe("Ask Stellar chat", () => {
  test.beforeEach(async ({ page }) => {
    await mockNeevaiChat(page);
    await page.goto(`${baseURL}/`);
  });

  test("Loads no NeevAI script on Lab's origin", async ({ page }) => {
    await expect(page.locator('script[src*="neevai"]')).toHaveCount(0);
    // The iframe is created only when the visitor shows intent
    await expect(page.locator(".AskStellar__frame")).toHaveCount(0);
  });

  test("Launcher opens and closes the panel", async ({ page }) => {
    const launcher = page.getByRole("button", {
      name: "Open Ask Stellar chat",
    });
    const panel = page.locator(".AskStellar__panel");

    await launcher.click();
    await expect(panel).toHaveAttribute("data-state", "widget");

    // Close from inside the chat (NEEVAI_CLOSE)
    await page
      .frameLocator(".AskStellar__frame")
      .getByRole("button", { name: "Close" })
      .click();
    await expect(panel).toHaveAttribute("data-state", "collapsed");
  });

  test("Homepage input sends the question to the chat", async ({ page }) => {
    await page.locator("#home-ask-input").fill("How do I fund a test account?");
    await page.getByRole("button", { name: "Start", exact: true }).click();

    await expect(page.locator(".AskStellar__panel")).toHaveAttribute(
      "data-state",
      "widget",
    );

    const chat = page.frameLocator(".AskStellar__frame");
    await expect(chat.locator("#questions li")).toHaveText([
      "How do I fund a test account?",
    ]);
  });

  test("Chat iframe cannot read Lab's storage", async ({ page }) => {
    await page.getByRole("button", { name: "Open Ask Stellar chat" }).click();

    await expect(
      page.frameLocator(".AskStellar__frame").locator("#parent-access"),
    ).toHaveText("blocked");
  });

  test("Removes chat UTM tags on landing and keeps store state", async ({
    page,
  }) => {
    await page.goto(
      `${baseURL}/xdr/view?utm_source=neevai&utm_medium=chat&$=network$id=futurenet;;`,
    );

    await expect(page).toHaveURL(/\/xdr\/view\?\$=network\$id=futurenet/);
    expect(page.url()).not.toContain("utm_");
  });
});
