import { baseURL } from "../../playwright.config";
import { expect, Page, test } from "@playwright/test";
import {
  CST_EMPTY,
  CST_SUCCESS,
  CST_PARTIAL_FAIL,
  CST_ALL_FAIL,
  CST_LONG_PARAMS,
} from "./mock/txCallStackTrace";
import { mockRpcRequest } from "./mock/helpers";

test.describe("Transaction Dashboard: Call stack trace", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/transaction/dashboard`);
  });

  test("Empty state", async ({ page }) => {
    await loadCallStack({ page, mockResponse: CST_EMPTY });

    await expect(
      page.getByText("This transaction has no call stack trace."),
    ).toBeVisible();
    await expect(page.getByTestId("cst-root")).toBeHidden();
  });

  test("All calls failed shows error alert", async ({ page }) => {
    await loadCallStack({ page, mockResponse: CST_ALL_FAIL });

    await expect(
      page.getByRole("heading", { name: "Transaction failed" }),
    ).toBeVisible();
    await expect(page.getByTestId("cst-root")).toHaveAttribute(
      "data-error-level",
      "all",
    );
  });

  test("Some calls failed shows warning alert", async ({ page }) => {
    await loadCallStack({ page, mockResponse: CST_PARTIAL_FAIL });

    await expect(
      page.getByRole("heading", { name: "Transaction partially failed" }),
    ).toBeVisible();
    await expect(page.getByTestId("cst-root")).toHaveAttribute(
      "data-error-level",
      "some",
    );
  });

  test("Collapse params toggle truncates params with ellipsis", async ({
    page,
  }) => {
    await loadCallStack({ page, mockResponse: CST_LONG_PARAMS });

    // The SDS Toggle hides its <input>; click the "Collapse params" label
    // (a <label for=...>) to flip it.
    const collapseToggle = page.getByText("Collapse params");

    // Expanded (default): all params shown, no ellipsis.
    await expect(page.getByTestId("cst-ellipsis")).toHaveCount(0);

    // Collapse params -> truncated with an ellipsis.
    await collapseToggle.click();
    await expect(page.getByTestId("cst-ellipsis")).toBeVisible();

    // Expand again -> ellipsis removed.
    await collapseToggle.click();
    await expect(page.getByTestId("cst-ellipsis")).toHaveCount(0);
  });

  test("Expand/collapse a nested call via the chevron", async ({ page }) => {
    await loadCallStack({ page, mockResponse: CST_SUCCESS });

    // Top-level call + one nested call.
    await expect(page.getByTestId("cst-event")).toHaveCount(2);

    const chevron = page.getByTestId("cst-chevron").first();
    await expect(chevron).toHaveAttribute("data-is-expanded", "true");

    // Collapse -> nested call hidden.
    await chevron.click();
    await expect(chevron).toHaveAttribute("data-is-expanded", "false");
    await expect(page.getByTestId("cst-event")).toHaveCount(1);

    // Expand -> nested call back.
    await chevron.click();
    await expect(chevron).toHaveAttribute("data-is-expanded", "true");
    await expect(page.getByTestId("cst-event")).toHaveCount(2);
  });

  test("Renders account and contract explorer links", async ({ page }) => {
    await loadCallStack({ page, mockResponse: CST_SUCCESS });

    const root = page.getByTestId("cst-root");

    // Account address -> stellar.expert account link.
    await expect(
      root.locator('a[href*="stellar.expert/explorer/testnet/account/"]'),
    ).toHaveCount(1);

    // Contract id -> internal contract-explorer link opened in a new tab.
    const contractLink = root.locator(
      'a[href*="/smart-contracts/contract-explorer"]',
    );
    await expect(contractLink).toHaveCount(1);
    await expect(contractLink).toHaveAttribute("target", "_blank");
  });
});

// =============================================================================
// Helpers
// =============================================================================
const loadCallStack = async ({
  page,
  mockResponse,
}: {
  page: Page;
  mockResponse: { result: { txHash: string } };
}) => {
  const loadButton = page.getByRole("button", { name: "Load transaction" });

  await expect(loadButton).toBeDisabled();
  await page.getByLabel("Transaction hash").fill(mockResponse.result.txHash);
  await expect(loadButton).toBeEnabled();

  await mockRpcRequest({
    page,
    rpcMethod: "getTransaction",
    bodyJsonResponse: mockResponse,
  });

  await loadButton.click();

  // The Call stack trace tab is active by default.
  const tabButton = page.getByTestId("tx-call-stack-trace");
  await expect(tabButton).toHaveAttribute("data-is-active", "true");
};
