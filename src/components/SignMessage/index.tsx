"use client";

import { useContext } from "react";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";

import { SignShell, SignActionResult } from "@/components/SignShell";
import { WalletKitContext } from "@/components/WalletKit/WalletKitContextProvider";

import { getWalletKitNetwork } from "@/helpers/getWalletKitNetwork";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import {
  signMessageWithSecretKey,
  SignedMessage,
} from "@/helpers/messageHelper";
import { useStore } from "@/store/useStore";

const HARDWARE_UNSUPPORTED_NOTE =
  "Hardware wallet message signing is not yet supported. Use a secret key or wallet extension.";

/**
 * SEP-53 message-signing strategy rendered through the generic `SignShell`.
 * Produces a detached signature — there is no transaction or XDR involved.
 * The signed result is surfaced via `onSigned` so the page can display it and
 * prefill the verify form.
 */
export const SignMessage = ({
  id,
  message,
  isDisabled = false,
  onSigned,
}: {
  id: string;
  message: string;
  isDisabled?: boolean;
  /** Called with the signed result on success, or `null` when cleared. */
  onSigned?: (result: SignedMessage | null) => void;
}) => {
  const { network, walletKit, updateWalletKit } = useStore();
  const walletKitInstance = useContext(WalletKitContext);

  const onSignSecretKeys = async (
    secretKeys: string[],
  ): Promise<SignActionResult> => {
    try {
      const result = signMessageWithSecretKey({
        secretKey: secretKeys[0],
        message,
      });

      onSigned?.(result);

      return {
        successMessage: `Signed with ${shortenStellarAddress(result.publicKey)}`,
      };
    } catch (e) {
      onSigned?.(null);

      return {
        errorMessage:
          e instanceof Error ? e.message : "Failed to sign the message",
      };
    }
  };

  const onSignExtension = async (): Promise<SignActionResult> => {
    if (!walletKitInstance?.isInitialized) {
      return { errorMessage: "Wallet is not initialized, please try again" };
    }

    const networkPassphrase = getWalletKitNetwork(network.id);

    try {
      let address = walletKit?.publicKey;

      // Not connected via the main nav — open the kit's auth modal to pick one.
      if (!address) {
        const auth = await StellarWalletsKit.authModal();
        address = auth.address;

        if (address) {
          updateWalletKit({ publicKey: address });
        }
      }

      if (!address) {
        // User dismissed the modal without selecting an account.
        return {};
      }

      const { signedMessage, signerAddress } =
        await StellarWalletsKit.signMessage(message, {
          address,
          networkPassphrase,
        });

      const result: SignedMessage = {
        publicKey: signerAddress ?? address,
        message,
        // The kit returns the signature already base64-encoded.
        signature: signedMessage,
      };

      onSigned?.(result);

      return {
        successMessage: `Signed with ${shortenStellarAddress(result.publicKey)}`,
      };
    } catch (e: any) {
      // Kit rejects with code -1 when the user dismisses the modal.
      if (e?.code === -1) {
        return {};
      }

      return {
        errorMessage:
          e?.message || "Couldn’t sign with wallet, please try again",
      };
    }
  };

  return (
    <SignShell
      id={id}
      isDisabled={isDisabled}
      tabs={["secretKey", "extensionWallet", "hardwareWallet"]}
      hardwareUnsupportedNote={HARDWARE_UNSUPPORTED_NOTE}
      secretKey={{
        onSign: onSignSecretKeys,
        onClear: () => onSigned?.(null),
        // A message signature proves ownership of a single key; multiple keys
        // would just yield independent signatures, not a combined one.
        limit: 1,
        placeholder: "Secret key (starting with S)",
      }}
      extension={{
        onSign: onSignExtension,
        onClear: () => onSigned?.(null),
        label: `Sign with ${
          walletKit?.publicKey
            ? shortenStellarAddress(walletKit.publicKey)
            : "wallet"
        }`,
      }}
    />
  );
};
