import { test, expect } from "@playwright/test";
import { baseURL } from "../../playwright.config";
import { SAVED_ACCOUNT_1 } from "./mock/localStorage";

const DEPLOY_CONTRACT_ROUTE = `${baseURL}/smart-contracts/deploy-contract`;
const FUTURENET_ROUTE = `${DEPLOY_CONTRACT_ROUTE}?$=network$id=futurenet&label=Futurenet&horizonUrl=https:////horizon-futurenet.stellar.org&rpcUrl=https:////rpc-futurenet.stellar.org&passphrase=Test%20SDF%20Future%20Network%20/;%20October%202022;;`;

test.describe("Smart Contracts: Deploy Contract", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(DEPLOY_CONTRACT_ROUTE);
  });

  test("Loads the upload and deploy flow", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Upload and deploy contract");
    await expect(page.getByLabel("Source account")).toHaveValue("");

    await expect(page.locator("#file-picker")).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Build upload transaction" }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Build deploy transaction" }),
    ).toBeDisabled();
  });

  test("Validates source account and file selection", async ({ page }) => {
    const sourceAccountInput = page.getByLabel("Source account");
    const fileInput = page.locator("#file-picker");
    const buildUploadButton = page.getByRole("button", {
      name: "Build upload transaction",
    });

    await sourceAccountInput.fill("not-a-public-key");
    await expect(page.getByText("Public key is invalid.")).toBeVisible();
    await expect(fileInput).toBeEnabled();

    await sourceAccountInput.fill(SAVED_ACCOUNT_1);
    await expect(page.getByText("Public key is invalid.")).toBeHidden();

    await fileInput.setInputFiles({
      name: "contract.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("not a wasm file"),
    });
    await expect(
      page.getByText(
        "The uploaded file is not a valid Wasm file. Please upload a .wasm file.",
      ),
    ).toBeVisible();
    await expect(buildUploadButton).toBeDisabled();

    await page.getByRole("button", { name: "Clear", exact: true }).click();
    await expect(sourceAccountInput).toHaveValue("");
    await expect(page.getByText("Public key is invalid.")).toBeHidden();
    await expect(fileInput).toBeDisabled();
  });

  test("Shows Futurenet unsupported state", async ({ page }) => {
    await page.goto(FUTURENET_ROUTE);

    await expect(page.locator("h1")).toHaveText("Upload and deploy contract");
    await expect(
      page.getByText(
        "Upload and deploy contract is not supported on Futurenet. Please switch to Testnet or Mainnet to get started.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Switch to testnet" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Switch to mainnet" }),
    ).toBeVisible();
    await expect(page.getByLabel("Source account")).toBeHidden();
  });
});
