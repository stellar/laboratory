import { NetworkType } from "@/types/types";

const ALL_NETWORKS: NetworkType[] = [
  "mainnet",
  "testnet",
  "futurenet",
  "custom",
];

/**
 * The project id is read from `process.env` when the module is first evaluated,
 * so each case needs a fresh module registry.
 */
const loadIsWalletConnectSupported = async (projectId?: string) => {
  jest.resetModules();

  if (projectId === undefined) {
    delete process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
  } else {
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID = projectId;
  }

  const { isWalletConnectSupported } = await import(
    "@/components/WalletKit/walletConnect"
  );

  return isWalletConnectSupported;
};

describe("isWalletConnectSupported", () => {
  const originalProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

  afterEach(() => {
    if (originalProjectId === undefined) {
      delete process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
    } else {
      process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID = originalProjectId;
    }
  });

  it("supports mainnet and testnet when a project id is set", async () => {
    const isWalletConnectSupported =
      await loadIsWalletConnectSupported("project-id");

    expect(isWalletConnectSupported("mainnet")).toBe(true);
    expect(isWalletConnectSupported("testnet")).toBe(true);
  });

  it("doesn't support networks WalletConnect has no Stellar chain for", async () => {
    const isWalletConnectSupported =
      await loadIsWalletConnectSupported("project-id");

    expect(isWalletConnectSupported("futurenet")).toBe(false);
    expect(isWalletConnectSupported("custom")).toBe(false);
  });
});
