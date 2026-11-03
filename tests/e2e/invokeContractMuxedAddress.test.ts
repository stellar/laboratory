import { baseURL } from "../../playwright.config";
import { test, expect } from "@playwright/test";
import {
  Account,
  encodeMuxedContractAddress,
  MuxedAccount,
} from "@stellar/stellar-sdk";
import { STELLAR_EXPERT_API } from "@/constants/settings";
import {
  MOCK_SAC_CONTRACT_ID,
  MOCK_SAC_CONTRACT_TYPE_RESPONSE,
} from "./mock/smartContracts";
import { mockRpcRequest } from "./mock/helpers";

const ACCOUNT = "GDVOT2ALMUF3G54RBHNJUEV6LOAZCQQCARHEVNUPKGMVPWFC4PFN33QR";
const MUXED_ACCOUNT = new MuxedAccount(
  new Account(ACCOUNT, "0"),
  "2",
).accountId();
const MUXED_CONTRACT = encodeMuxedContractAddress(MOCK_SAC_CONTRACT_ID, "42");

/**
 * The SAC's `transfer` takes a plain `Address` for `from` and a `MuxedAddress`
 * for `to`. Uses the SAC spec path (no wasm decoding required); see
 * invokeContractSigningMethod.test.ts.
 */
test.describe("Smart Contracts: Invoke Contract — Address and MuxedAddress params", () => {
  test.beforeEach(async ({ page }) => {
    await mockRpcRequest({
      page,
      rpcMethod: "getLedgerEntries",
      bodyJsonResponse: MOCK_SAC_CONTRACT_TYPE_RESPONSE,
    });

    await page.route(
      `${STELLAR_EXPERT_API}/testnet/contract/${MOCK_SAC_CONTRACT_ID}`,
      async (route) => {
        await route.fulfill({
          status: 404,
          contentType: "application/json",
          body: "{}",
        });
      },
    );
  });

  test("SAC transfer accepts a muxed `to` and rejects a muxed `from`", async ({
    page,
  }) => {
    await page.goto(`${baseURL}/smart-contracts/contract-explorer`);

    await page.getByLabel("Contract ID").fill(MOCK_SAC_CONTRACT_ID);
    await page.getByRole("button", { name: "Load contract" }).click();

    await page.getByTestId("contract-invoke").click();

    const invokeContainer = page.getByTestId("invoke-contract-container");
    // The function card title; the `to` tooltip also mentions `transfer`
    const transferTitle = invokeContainer
      .locator(".Text--w-bold")
      .getByText("transfer", { exact: true });
    await expect(transferTitle).toBeVisible();

    const transferCard = transferTitle.locator(
      'xpath=ancestor::*[contains(@class, "Card")][1]',
    );
    const fromInput = transferCard.locator('input[id="from"]');
    const toInput = transferCard.locator('input[id="to"]');

    // `to` is a MuxedAddress: G, M, C and W are all valid
    for (const address of [
      ACCOUNT,
      MUXED_ACCOUNT,
      MOCK_SAC_CONTRACT_ID,
      MUXED_CONTRACT,
    ]) {
      await toInput.fill(address);
      await expect(toInput).toHaveAttribute("aria-invalid", "false");
    }

    // `from` is a plain Address: muxed addresses are rejected
    await fromInput.fill(MUXED_CONTRACT);
    await expect(fromInput).toHaveAttribute("aria-invalid", "true");
    await expect(
      transferCard.getByText(/Muxed addresses \(M\.\.\. or W\.\.\.\)/),
    ).toBeVisible();

    await fromInput.fill(ACCOUNT);
    await expect(fromInput).toHaveAttribute("aria-invalid", "false");
  });
});
