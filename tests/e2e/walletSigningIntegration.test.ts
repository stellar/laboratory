import { test, expect, Page } from "@playwright/test";
import {
  Account,
  FeeBumpTransaction,
  Keypair,
  Networks,
  Operation,
  Transaction,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { baseURL } from "../../playwright.config";

const networkPassphrase = Networks.TESTNET;
const build = (source: Keypair, fee = "100") =>
  new TransactionBuilder(new Account(source.publicKey(), "1"), {
    fee,
    networkPassphrase,
  })
    .addOperation(
      Operation.manageData({ name: "wallet-integration", value: "test" }),
    )
    .setTimeout(0)
    .build();

const seed = async (page: Page, xdr: string) => {
  await page.addInitScript(
    ({ xdr }) => {
      if (window !== window.top) return;
      sessionStorage.setItem(
        "stellar_lab_tx_flow_build",
        JSON.stringify({
          version: 0,
          state: {
            activeStep: "sign",
            highestCompletedStep: "build",
            build: {
              classic: { operations: [], xdr },
              soroban: {
                operation: {
                  operation_type: "",
                  params: {},
                  source_account: "",
                },
                xdr: "",
              },
              params: {
                source_account: "",
                fee: "100",
                seq_num: "",
                cond: { time: { min_time: "", max_time: "" } },
                memo: {},
              },
              error: { params: [], operations: [] },
              isValid: { params: false, operations: false },
            },
            simulate: {
              xdrFormat: "base64",
              authMode: "record",
              simulationResultJson: "",
              isValid: false,
            },
            sign: { signedXdr: "" },
            submit: { submitResultJson: "" },
            feeBump: { source_account: "", fee: "", xdr: "" },
          },
        }),
      );
    },
    { xdr },
  );
  await page.goto(`${baseURL}/transaction/build`);
  await expect(page.locator("h1")).toHaveText("Sign transaction");
};

const signedXdr = (page: Page): Promise<string> =>
  page.evaluate(
    () =>
      JSON.parse(sessionStorage.getItem("stellar_lab_tx_flow_build") ?? "{}")
        .state?.sign?.signedXdr ?? "",
  );
const component = (page: Page) => page.getByTestId("sign-tx-xdr-sign-step");
const content = (page: Page, type: string) =>
  component(page).locator(
    `.SignTransactionXdr__tabContent[data-type="${type}"]`,
  );
const selectTab = (page: Page, label: string) =>
  component(page)
    .locator(".SignTransactionXdr__tab__label", { hasText: label })
    .click();
const chooseFreighter = async (page: Page) => {
  await page
    .locator(".stellar-wallets-kit")
    .getByText("Freighter", { exact: true })
    .click();
  await expect(page.locator(".stellar-wallets-kit")).toHaveCount(0);
};
const signWithWallet = async (page: Page, additional = false) => {
  await selectTab(page, "Wallet extension");
  await content(page, "extensionWallet")
    .getByRole("button", {
      name: additional ? "Add additional signer" : /^Sign with/,
    })
    .click();
  await chooseFreighter(page);
};
const expectSignatures = (
  tx: Transaction | FeeBumpTransaction,
  signers: Keypair[],
) => {
  expect(tx.signatures).toHaveLength(signers.length);
  for (const signer of signers)
    expect(
      tx.signatures.some((sig) =>
        signer.verify(tx.hash(), sig.signature.toBytes()),
      ),
    ).toBe(true);
};

type WalletRequest = {
  type: string;
  messageId: number;
  transactionXdr?: string;
  networkPassphrase?: string;
};
type WalletReply = {
  signedTransaction?: string;
  signerAddress?: string;
  apiError?: { code: number; message: string };
};

/**
 * Emulate only Freighter's content-script transport. The app's real React
 * component, hook, Wallets Kit chooser and Freighter API/adapter all run.
 * Signatures are generated in the test process with disposable random keys;
 * this does not claim installed-extension or physical-device verification.
 */
const walletBridge = async (page: Page, initialSigner: Keypair) => {
  let signer = initialSigner;
  let sign: (request: WalletRequest) => Promise<WalletReply> = async (
    request,
  ) => {
    const tx = TransactionBuilder.fromXdr(
      request.transactionXdr!,
      request.networkPassphrase!,
    );
    tx.sign(signer);
    return { signedTransaction: tx.toXDR(), signerAddress: signer.publicKey() };
  };
  const requests: WalletRequest[] = [];
  await page.exposeBinding(
    "labWalletRequest",
    async (_source, request: WalletRequest) => {
      requests.push(request);
      if (request.type === "SUBMIT_TRANSACTION") return sign(request);
      return {
        publicKey: signer.publicKey(),
        isConnected: true,
        isAllowed: true,
        network: "TESTNET",
        networkPassphrase,
        networkUrl: "https://horizon-testnet.stellar.org",
        sorobanRpcUrl: "https://soroban-testnet.stellar.org",
      };
    },
  );
  await page.addInitScript(() => {
    if (window !== window.top) return;
    const bridge = window as unknown as {
      freighter: boolean;
      labWalletRequest: (
        request: WalletRequest,
      ) => Promise<Record<string, unknown>>;
      labWalletCompleted: number;
    };
    bridge.freighter = true;
    bridge.labWalletCompleted = 0;
    window.addEventListener("message", async (event) => {
      if (event.source !== window) return;
      if (event.data?.source === "LAB_WALLET_TEST_BARRIER") {
        bridge.labWalletCompleted++;
        return;
      }
      if (event.data?.source !== "FREIGHTER_EXTERNAL_MSG_REQUEST") return;
      const request = event.data as WalletRequest;
      const reply = await bridge.labWalletRequest(request);
      window.postMessage(
        {
          ...reply,
          source: "FREIGHTER_EXTERNAL_MSG_RESPONSE",
          messagedId: request.messageId,
        },
        window.location.origin,
      );
      // Posted messages are FIFO. The barrier follows the API response and its
      // promise continuations, so assertions can wait for a late response safely.
      if (request.type === "SUBMIT_TRANSACTION")
        window.postMessage(
          { source: "LAB_WALLET_TEST_BARRIER" },
          window.location.origin,
        );
    });
  });
  return {
    requests,
    selectSigner: (next: Keypair) => {
      signer = next;
    },
    respond: (next: typeof sign) => {
      sign = next;
    },
    submissions: () =>
      requests.filter((request) => request.type === "SUBMIT_TRANSACTION"),
    completed: (count: number) =>
      expect
        .poll(() =>
          page.evaluate(
            () =>
              (window as unknown as { labWalletCompleted: number })
                .labWalletCompleted,
          ),
        )
        .toBe(count),
  };
};

test("real signing component accumulates two wallet accounts, deduplicates a secret-key signature, and clears one method", async ({
  page,
}) => {
  const first = Keypair.random();
  const second = Keypair.random();
  const bridge = await walletBridge(page, first);
  await seed(page, build(first).toXDR());
  await signWithWallet(page);
  await expect(
    content(page, "extensionWallet").getByText(
      "Successfully added 1 wallet signature",
      { exact: true },
    ),
  ).toBeVisible();
  bridge.selectSigner(second);
  await signWithWallet(page, true);
  await expect(
    content(page, "extensionWallet").getByText(
      "Successfully added 2 wallet signatures",
      { exact: true },
    ),
  ).toBeVisible();
  expectSignatures(
    TransactionBuilder.fromXdr(await signedXdr(page), networkPassphrase),
    [first, second],
  );
  expect(bridge.submissions()).toHaveLength(2);
  expect(
    bridge.requests.filter((request) => request.type === "REQUEST_ACCESS"),
  ).toHaveLength(2);

  await selectTab(page, "Sign with secret key");
  await content(page, "secretKey")
    .getByPlaceholder("Secret key (starting with S) or hash preimage (in hex)")
    .fill(first.secret());
  await content(page, "secretKey")
    .getByRole("button", { name: "Sign", exact: true })
    .click();
  await expect(
    component(page).locator(".SignTransactionXdr__tab__count"),
  ).toHaveText(["1", "1", "0", "0"]);
  expectSignatures(
    TransactionBuilder.fromXdr(await signedXdr(page), networkPassphrase),
    [first, second],
  );
  await content(page, "secretKey")
    .getByRole("button", { name: "Clear", exact: true })
    .click();
  await expect(
    component(page).locator(".SignTransactionXdr__tab__count"),
  ).toHaveText(["0", "2", "0", "0"]);
  expectSignatures(
    TransactionBuilder.fromXdr(await signedXdr(page), networkPassphrase),
    [first, second],
  );
});

test("wallet dismissal and rejection preserve collected signatures and allow retry", async ({
  page,
}) => {
  const existing = Keypair.random();
  const wallet = Keypair.random();
  const bridge = await walletBridge(page, wallet);
  await seed(page, build(existing).toXDR());
  await content(page, "secretKey")
    .getByPlaceholder("Secret key (starting with S) or hash preimage (in hex)")
    .fill(existing.secret());
  await content(page, "secretKey")
    .getByRole("button", { name: "Sign", exact: true })
    .click();
  await expect(
    content(page, "secretKey").getByText("Successfully added 1 signature", {
      exact: true,
    }),
  ).toBeVisible();
  const before = await signedXdr(page);
  await selectTab(page, "Wallet extension");
  await content(page, "extensionWallet")
    .getByRole("button", { name: /^Sign with/ })
    .click();
  await expect(page.locator(".stellar-wallets-kit")).toBeVisible();
  await page.locator(".stellar-wallets-kit header button").last().click();
  await expect(page.locator(".stellar-wallets-kit")).toHaveCount(0);
  await expect(
    content(page, "extensionWallet").getByRole("button", {
      name: /^Sign with/,
    }),
  ).toBeEnabled();
  expect(await signedXdr(page)).toBe(before);
  expect(bridge.submissions()).toHaveLength(0);

  bridge.respond(async () => ({
    apiError: { code: -4, message: "User declined the signature" },
  }));
  await signWithWallet(page);
  await expect(
    content(page, "extensionWallet").getByText("User declined the signature", {
      exact: true,
    }),
  ).toBeVisible();
  expect(await signedXdr(page)).toBe(before);
  bridge.respond(async (request) => {
    const tx = TransactionBuilder.fromXdr(
      request.transactionXdr!,
      request.networkPassphrase!,
    );
    tx.sign(wallet);
    return { signedTransaction: tx.toXDR(), signerAddress: wallet.publicKey() };
  });
  // The failed chooser connected the account, so retry uses it directly.
  await content(page, "extensionWallet")
    .getByRole("button", { name: /^Sign with/ })
    .click();
  await expect(
    content(page, "extensionWallet").getByText(
      "Successfully added 1 wallet signature",
      { exact: true },
    ),
  ).toBeVisible();
  expectSignatures(
    TransactionBuilder.fromXdr(await signedXdr(page), networkPassphrase),
    [existing, wallet],
  );
  expect(bridge.submissions()).toHaveLength(2);
});

test("late wallet response cannot sign the transaction after a network change", async ({
  page,
}) => {
  const signer = Keypair.random();
  const bridge = await walletBridge(page, signer);
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  bridge.respond(async (request) => {
    await pending;
    const tx = TransactionBuilder.fromXdr(
      request.transactionXdr!,
      request.networkPassphrase!,
    );
    tx.sign(signer);
    return { signedTransaction: tx.toXDR(), signerAddress: signer.publicKey() };
  });
  await seed(page, build(signer).toXDR());
  await signWithWallet(page);
  await expect.poll(() => bridge.submissions().length).toBe(1);
  await page.getByTestId("networkSelector-button").click();
  await page
    .getByTestId("networkSelector-option")
    .filter({ hasText: "Futurenet" })
    .click();
  await page.getByTestId("networkSelector-submit-button").click();
  await expect(page.locator("h1")).toHaveText("Build transaction");
  release();
  await bridge.completed(1);
  expect(await signedXdr(page)).toBe("");
  await expect(
    page.getByText("Transaction signed and ready to submit."),
  ).toBeHidden();
});

test("signs both inner-transaction accounts before wrapping, then adds fee-bump wallet signatures without losing inner signatures", async ({
  page,
}) => {
  const innerFirst = Keypair.random();
  const innerSecond = Keypair.random();
  const feeFirst = Keypair.random();
  const feeSecond = Keypair.random();
  await seed(page, build(innerFirst).toXDR());
  const inputs = content(page, "secretKey").getByPlaceholder(
    "Secret key (starting with S) or hash preimage (in hex)",
  );
  await inputs.first().fill(innerFirst.secret());
  await content(page, "secretKey")
    .getByRole("button", { name: "Sign", exact: true })
    .click();
  await expect(
    content(page, "secretKey").getByText("Successfully added 1 signature", {
      exact: true,
    }),
  ).toBeVisible();
  await content(page, "secretKey")
    .getByRole("button", { name: "Add additional", exact: true })
    .click();
  await inputs.nth(1).fill(innerSecond.secret());
  await content(page, "secretKey")
    .getByRole("button", { name: "Sign", exact: true })
    .click();
  await expect(
    content(page, "secretKey").getByText("Successfully added 2 signatures", {
      exact: true,
    }),
  ).toBeVisible();
  const innerXdr = await signedXdr(page);
  const inner = TransactionBuilder.fromXdr(innerXdr, networkPassphrase);
  if (!(inner instanceof Transaction))
    throw new Error("Expected inner transaction");
  expectSignatures(inner, [innerFirst, innerSecond]);
  const outer = TransactionBuilder.buildFeeBumpTransaction(
    feeFirst.publicKey(),
    "100",
    inner,
    networkPassphrase,
  );

  const feePage = await page.context().newPage();
  try {
    const bridge = await walletBridge(feePage, feeFirst);
    await seed(feePage, outer.toXDR());
    await signWithWallet(feePage);
    await expect(
      content(feePage, "extensionWallet").getByText(
        "Successfully added 1 wallet signature",
        { exact: true },
      ),
    ).toBeVisible();
    bridge.selectSigner(feeSecond);
    await signWithWallet(feePage, true);
    await expect(
      content(feePage, "extensionWallet").getByText(
        "Successfully added 2 wallet signatures",
        { exact: true },
      ),
    ).toBeVisible();
    const result = TransactionBuilder.fromXdr(
      await signedXdr(feePage),
      networkPassphrase,
    );
    if (!(result instanceof FeeBumpTransaction))
      throw new Error("Expected fee bump transaction");
    expectSignatures(result, [feeFirst, feeSecond]);
    expectSignatures(result.innerTransaction, [innerFirst, innerSecond]);
    expect(result.innerTransaction.toXDR()).toBe(innerXdr);
    for (const request of bridge.submissions()) {
      const requested = TransactionBuilder.fromXdr(
        request.transactionXdr!,
        networkPassphrase,
      );
      if (!(requested instanceof FeeBumpTransaction))
        throw new Error("Wallet must receive fee bump envelope");
      expectSignatures(requested.innerTransaction, [innerFirst, innerSecond]);
    }
  } finally {
    await feePage.close();
  }
});
