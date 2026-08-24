import type {
  WalletConnectModule,
  WalletConnectTargetChain,
} from "@creit.tech/stellar-wallets-kit/modules/wallet-connect";

import { getPublicResourcePath } from "@/helpers/getPublicResourcePath";
import { NetworkType } from "@/types/types";

/**
 * The wallet id the kit assigns to WalletConnect. It mirrors the kit's
 * `WALLET_CONNECT_ID` export, which we can't import without pulling the whole
 * WalletConnect chunk into the main bundle.
 */
export const WALLET_CONNECT_ID = "wallet_connect";

/**
 * Default Reown project id
 *
 * This is not a secret — it ships in every client bundle and appears in the
 * relay URL — and it can't be used from an arbitrary domain, because the relay
 * refuses origins missing from the project's allowlist with
 * `3000 (Unauthorized: origin not allowed)`.
 */
const DEFAULT_PROJECT_ID = "4f7610b5e90f0af6984d5e4a53da7024";
const PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || DEFAULT_PROJECT_ID;

/**
 * WalletConnect exposes Stellar as `stellar:pubnet` and `stellar:testnet` only
 */
const SUPPORTED_NETWORKS: NetworkType[] = ["mainnet", "testnet"];

/**
 * Whether WalletConnect can be offered on the given network.
 */
export const isWalletConnectSupported = (networkId: NetworkType): boolean =>
  SUPPORTED_NETWORKS.includes(networkId);

type LoadedWalletConnect = {
  walletConnectModule: WalletConnectModule;
  chainFor: (networkId: NetworkType) => WalletConnectTargetChain;
};

/**
 * The cached load. This holds the promise rather than the resolved module, so a
 * second caller awaits the first load instead of starting its own.
 *
 * That matters because the provider effect can fire twice in quick succession —
 * theme hydration re-runs it. If only the resolved module were cached, the
 * second call would find it still unset and build a module of its own, putting
 * two sign clients on one relay. It fails as "Init() was called 2 times", then
 * "No matching key. proposal:" once the wallet replies to whichever client
 * didn't send the request.
 */
let loadedWalletConnect: Promise<LoadedWalletConnect> | undefined;

/** How long to wait for the sign client, which the module creates async. */
const SIGN_CLIENT_READY_TIMEOUT_MS = 4000;

const waitForSignClient = async (
  loaded: WalletConnectModule,
): Promise<boolean> => {
  const deadline = Date.now() + SIGN_CLIENT_READY_TIMEOUT_MS;

  while (!loaded.signClient && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return Boolean(loaded.signClient);
};

const importAndCreate = async (
  networkId: NetworkType,
): Promise<LoadedWalletConnect> => {
  const { LabWalletConnectModule, WalletConnectTargetChain } = await import(
    "./labWalletConnectModule"
  );

  const chainFor = (id: NetworkType) =>
    id === "mainnet"
      ? WalletConnectTargetChain.PUBLIC
      : WalletConnectTargetChain.TESTNET;

  // Constructing the module starts a sign client (which opens a relay
  // websocket) and a Reown modal, so this must happen exactly once.
  const walletConnectModule = new LabWalletConnectModule({
    projectId: PROJECT_ID,
    metadata: {
      name: "Stellar Lab",
      description:
        "Build, sign, and submit Stellar transactions, and make requests to Stellar RPC and Horizon.",
      url: window.location.origin,
      icons: [`${window.location.origin}${getPublicResourcePath("icon2.png")}`],
    },
    allowedChains: [chainFor(networkId)],
  });

  return { walletConnectModule, chainFor };
};

/**
 * Dynamically imports and returns the kit's WalletConnect module, or
 * `undefined` when WalletConnect isn't available for the given network.
 *
 * The import is dynamic on purpose: the module depends on `@reown/appkit` and
 * the WalletConnect sign client, which we don't want in Lab's main bundle.
 */
export const loadWalletConnectModule = async ({
  networkId,
  isDarkTheme,
}: {
  networkId: NetworkType;
  isDarkTheme: boolean;
}): Promise<WalletConnectModule | undefined> => {
  if (!isWalletConnectSupported(networkId)) {
    return undefined;
  }

  if (!loadedWalletConnect) {
    // Assigned before the first `await` so concurrent callers share it. On
    // failure the cache is cleared so a later call can retry.
    loadedWalletConnect = importAndCreate(networkId).catch((error) => {
      loadedWalletConnect = undefined;
      throw error;
    });
  }

  const { walletConnectModule, chainFor } = await loadedWalletConnect;

  // The kit's `isAvailable()` is just `!!signClient && !!modal`, and the module
  // assigns `signClient` asynchronously in its constructor. Callers here open
  // the wallet modal right after this resolves, and the kit snapshots
  // availability at that moment — so without waiting, WalletConnect is listed
  // as unavailable with an "Install" link that sends the user to
  // walletconnect.com. Returns either way: a module that's merely slow to
  // initialise should still be registered for the next attempt.
  await waitForSignClient(walletConnectModule);

  // Network and theme can change after the module exists, so keep them in sync
  // on the one instance instead of rebuilding it. Note that `allowedChains`
  // only affects the *next* pairing — it cannot renegotiate a session that the
  // wallet has already approved, which is why `ConnectWallet` ends the session
  // when the network changes.
  walletConnectModule.wcParams.allowedChains = [chainFor(networkId)];
  walletConnectModule.modal.setThemeMode(isDarkTheme ? "dark" : "light");

  return walletConnectModule;
};

/**
 * Whether the sign client has a restored, unexpired session that authorizes
 * `address` on the chain for `networkId`.
 *
 * `StellarWalletsKit.getAddress()` only returns the address the kit cached in
 * localStorage, which survives independently of the session itself — the wallet
 * can drop or expire a session while Lab is closed. Without this check Lab would
 * show a connected wallet whose every signing request fails.
 */
export const hasLiveWalletConnectSession = async ({
  address,
  networkId,
}: {
  address: string;
  networkId: NetworkType;
}): Promise<boolean> => {
  // No load has been started, so there cannot be a session to restore.
  if (!isWalletConnectSupported(networkId) || !loadedWalletConnect) {
    return false;
  }

  try {
    const { walletConnectModule, chainFor } = await loadedWalletConnect;

    if (!(await waitForSignClient(walletConnectModule))) {
      return false;
    }

    // Accounts are formatted `<chain>:<address>`, e.g.
    // `stellar:testnet:GABC…`, so this checks the address and chain together.
    const account = `${chainFor(networkId)}:${address}`;
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const sessions = await walletConnectModule.getSessions();

    return sessions.some(
      (session) =>
        session.expiry > nowInSeconds &&
        (session.namespaces.stellar?.accounts || []).includes(account),
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // Treat an unreadable session store as "no session"
    return false;
  }
};
