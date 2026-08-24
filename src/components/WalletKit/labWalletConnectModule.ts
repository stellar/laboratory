import { WalletConnectModule } from "@creit.tech/stellar-wallets-kit/modules/wallet-connect";

// Re-exported so `walletConnect.ts` gets the enum from the same dynamic import
// that loads this file, instead of needing a second one.
export { WalletConnectTargetChain } from "@creit.tech/stellar-wallets-kit/modules/wallet-connect";

/**
 * How long to give the relay to come up once pairing has started. Generous on
 * purpose: overshooting only delays an error message, while undershooting would
 * wrongly reject a working wallet on a slow connection.
 */
const RELAY_READY_TIMEOUT_MS = 8000;

const isRelayConnected = (loaded: WalletConnectModule): boolean =>
  Boolean(loaded.signClient?.core?.relayer?.connected);

/**
 * Waits for the WalletConnect relay to report a live connection.
 *
 * This has to be called *after* pairing has been initiated: the relay socket is
 * opened by `connect()`, not when the sign client is constructed, so before that
 * point `connected` is legitimately false and says nothing about health.
 */
const waitForRelay = async (loaded: WalletConnectModule): Promise<boolean> => {
  const deadline = Date.now() + RELAY_READY_TIMEOUT_MS;

  while (!isRelayConnected(loaded) && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return isRelayConnected(loaded);
};

/**
 * The kit's WalletConnect module, with a relay health check added to
 * `getAddress`.
 *
 * Subclassed rather than wrapped because the kit calls `getAddress()` itself —
 * from its wallet-picker page — so there is no Lab call site to wrap, and the
 * check has to run inside the call: `getAddress` is what starts pairing, and
 * pairing is what opens the relay socket.
 *
 * This module is only ever reached through a dynamic `import()`, which is what
 * keeps `@reown/appkit` and the sign client out of Lab's main bundle.
 */
export class LabWalletConnectModule extends WalletConnectModule {
  async getAddress(): Promise<{ address: string }> {
    // Start pairing first — this is what opens the relay socket — then watch for
    // the connection to come up. Only the relay is raced, never the user: once
    // it's live they can take as long as they need to scan.
    const addressPromise = super.getAddress();

    // Keeps a rejection from being reported as unhandled while we wait; the
    // real rejection still reaches the caller when the promise is returned.
    addressPromise.catch(() => undefined);

    if (!(await waitForRelay(this))) {
      // The kit uses code -1 for "the user dismissed the modal", which Lab
      // deliberately swallows, so this needs a code of its own to be shown.
      throw {
        code: -2,
        message:
          "Couldn’t reach WalletConnect. The relay refused the connection — this domain may not be allowed for Lab’s WalletConnect project.",
      };
    }

    return addressPromise;
  }
}
