/**
 * `loadWalletConnectModule` caches the load in module scope, so every case needs
 * a fresh module registry — and the mock has to be re-imported alongside it, or
 * the assertions would run against a stale generation of the spy.
 */
jest.mock("@/components/WalletKit/labWalletConnectModule", () => ({
  WalletConnectTargetChain: {
    PUBLIC: "stellar:pubnet",
    TESTNET: "stellar:testnet",
  },
  // `signClient` is truthy so `waitForSignClient` resolves without polling.
  LabWalletConnectModule: jest.fn(() => ({
    wcParams: {} as { allowedChains?: string[] },
    modal: { setThemeMode: jest.fn() },
    signClient: {},
  })),
}));

const loadFreshModules = async () => {
  jest.resetModules();

  const { loadWalletConnectModule } = await import(
    "@/components/WalletKit/walletConnect"
  );
  const { LabWalletConnectModule } = await import(
    "@/components/WalletKit/labWalletConnectModule"
  );

  return {
    loadWalletConnectModule,
    constructor: LabWalletConnectModule as unknown as jest.Mock,
  };
};

describe("loadWalletConnectModule", () => {
  beforeAll(() => {
    // The module's metadata reads `window.location.origin`; jest runs in the
    // node environment, so there is no DOM to read it from.
    (global as unknown as { window: unknown }).window = {
      location: { origin: "https://lab.stellar.org" },
    };
  });

  it("never loads the chunk on a network WalletConnect has no Stellar chain for", async () => {
    const { loadWalletConnectModule, constructor } = await loadFreshModules();

    for (const networkId of ["futurenet", "custom"] as const) {
      expect(
        await loadWalletConnectModule({ networkId, isDarkTheme: false }),
      ).toBeUndefined();
    }

    expect(constructor).not.toHaveBeenCalled();
  });

  it("constructs one module for concurrent calls", async () => {
    const { loadWalletConnectModule, constructor } = await loadFreshModules();

    const [first, second] = await Promise.all([
      loadWalletConnectModule({ networkId: "testnet", isDarkTheme: false }),
      loadWalletConnectModule({ networkId: "testnet", isDarkTheme: true }),
    ]);

    // Two sign clients on one relay is the failure this guards against.
    expect(constructor).toHaveBeenCalledTimes(1);
    expect(first).toBe(second);
  });

  it("re-syncs chain and theme onto the cached instance", async () => {
    const { loadWalletConnectModule } = await loadFreshModules();

    const mainnet = await loadWalletConnectModule({
      networkId: "mainnet",
      isDarkTheme: true,
    });

    expect(mainnet?.wcParams.allowedChains).toEqual(["stellar:pubnet"]);
    expect(mainnet?.modal.setThemeMode).toHaveBeenCalledWith("dark");

    const testnet = await loadWalletConnectModule({
      networkId: "testnet",
      isDarkTheme: false,
    });

    // Same instance, updated in place rather than rebuilt.
    expect(testnet).toBe(mainnet);
    expect(testnet?.wcParams.allowedChains).toEqual(["stellar:testnet"]);
    expect(testnet?.modal.setThemeMode).toHaveBeenLastCalledWith("light");
  });

  it("clears the cache after a failure so a later call retries", async () => {
    const { loadWalletConnectModule, constructor } = await loadFreshModules();

    constructor.mockImplementationOnce(() => {
      throw new Error("construction failed");
    });

    await expect(
      loadWalletConnectModule({ networkId: "testnet", isDarkTheme: false }),
    ).rejects.toThrow("construction failed");

    expect(
      await loadWalletConnectModule({
        networkId: "testnet",
        isDarkTheme: false,
      }),
    ).toBeDefined();
    expect(constructor).toHaveBeenCalledTimes(2);
  });
});
