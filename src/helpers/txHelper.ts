import {
  FeeBumpTransaction,
  Keypair,
  Networks,
  StrKey,
  Transaction,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import Str from "@ledgerhq/hw-app-str";
import TrezorConnect, { StellarSignedTx } from "@trezor/connect-web";

import { validate } from "@/validate";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import {
  assertTrezorCanSign,
  needsTrezorObjectForm,
  transformTrezorTransaction,
} from "@/helpers/trezorTransform";
import { getErrorMessage } from "@/helpers/errorUtils";

import { LedgerErrorResponse } from "@/types/types";

/* Build Transaction related */
export type FeeBumpedTxResponse = {
  errors: string[];
  xdr: string;
};

const buildFeeBumpTx = ({
  innerTxXdr,
  maxFee,
  sourceAccount,
  networkPassphrase,
}: {
  innerTxXdr: string;
  maxFee: string;
  sourceAccount: string;
  networkPassphrase: string;
}): FeeBumpedTxResponse => {
  const result = {
    errors: [] as string[],
    xdr: "",
  };

  let innerTx: Transaction;

  try {
    innerTx = TransactionBuilder.fromXdr(
      innerTxXdr,
      networkPassphrase,
    ) as Transaction;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    result.errors.push("Invalid inner transaction XDR.");
    return result;
  }

  if (typeof innerTx?.operations === "undefined") {
    result.errors.push("Inner transaction must be a regular transaction.");
    return result;
  }

  try {
    const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
      sourceAccount,
      maxFee,
      innerTx,
      networkPassphrase,
    );
    result.xdr = feeBumpTx.toEnvelope().toXdr("base64");
  } catch (err) {
    if (err instanceof Error) {
      result.errors.push(err.message);
    } else {
      result.errors.push("Unknown error in fee bump tx");
    }
  }
  return result;
};

const secretKeySignature = ({
  txXdr,
  networkPassphrase,
  signers,
}: {
  txXdr: string;
  networkPassphrase: string;
  signers: string[];
}): {
  signature: xdr.DecoratedSignature[];
  successMsg?: string;
  errorMsg?: string;
} => {
  const tx = TransactionBuilder.fromXdr(txXdr, networkPassphrase);
  const signature: xdr.DecoratedSignature[] = [];

  // Validate secret keys
  for (let i = 0; i < signers.length; i++) {
    const signer = signers[i];

    if (signer) {
      const error = validate.getSecretKeyError(signer);

      if (error) {
        return {
          signature: [],
          errorMsg: error,
        };
      }

      const keypair = Keypair.fromSecret(signer);
      const decor = keypair.signDecorated(tx.hash());

      signature.push(decor);
    }
  }

  if (signature.length === 0) {
    return {
      signature: [],
      errorMsg: "No valid signatures were added",
    };
  }

  return {
    signature,
    successMsg: `Successfully added ${signature.length} signature${signature.length == 1 ? "" : "s"}`,
  };
};

/**
 * Wraps a signature returned by a hardware wallet as a decorated signature,
 * after checking it is a valid signature of the transaction hash by the
 * device's public key. Throws otherwise, so a signature the network would
 * reject is never added to the transaction.
 */
const getVerifiedHardwareSignature = ({
  publicKey,
  signature,
  transaction,
}: {
  publicKey: string;
  signature: Uint8Array;
  transaction: FeeBumpTransaction | Transaction;
}): xdr.DecoratedSignature[] => {
  const keyPair = Keypair.fromPublicKey(publicKey);

  if (!keyPair.verify(transaction.hash(), signature)) {
    throw new Error(
      "The hardware wallet returned a signature that doesn’t match this transaction, so it wasn’t added. Try signing again.",
    );
  }

  return [
    new xdr.DecoratedSignature({ hint: keyPair.signatureHint(), signature }),
  ];
};

const signWithLedger = async ({
  bipPath,
  transaction,
  isHash = false,
}: {
  bipPath: string;
  transaction: FeeBumpTransaction | Transaction;
  isHash: boolean;
}): Promise<{
  signature: xdr.DecoratedSignature[] | undefined;
  error: string | undefined;
}> => {
  const onError = (err: LedgerErrorResponse) => {
    let error;

    if (err.message) {
      error = err.message;
    } else {
      switch (err.errorCode) {
        case 2:
          error = `Couldn't connect to Ledger device. Connection can only be established using a secure connection.`;
          break;
        case 5:
          error = `Connection timeout.`;
          break;
        default:
          error = `Unknown error occurred.`;
      }
    }

    return error;
  };

  const signTxWithLedger = async (ledgerApi: Str, isHash: boolean) => {
    let ledgerSignature;

    try {
      const { rawPublicKey } = await ledgerApi.getPublicKey(bipPath);
      const publicKey = StrKey.encodeEd25519PublicKey(rawPublicKey);

      if (isHash) {
        const { signature } = await ledgerApi.signHash(
          bipPath,
          Buffer.from(transaction.hash()),
        );
        ledgerSignature = signature;
      } else {
        const { signature } = await ledgerApi.signTransaction(
          bipPath,
          Buffer.from(transaction.signatureBase()),
        );
        ledgerSignature = signature;
      }

      return {
        signature: getVerifiedHardwareSignature({
          publicKey,
          signature: ledgerSignature,
          transaction,
        }),
        error: undefined,
      };
    } catch (error) {
      const ledgerError = error as LedgerErrorResponse;
      return { signature: undefined, error: onError(ledgerError) };
    }
  };

  try {
    // Close existing connections to avoid the "device already open" error
    const existingTransports = await TransportWebHID.list();

    await Promise.all(
      existingTransports.map((existingTransport) =>
        existingTransport.close().catch(() => {
          // Ignore close errors - the device might already be closed
        }),
      ),
    );

    const transport = await TransportWebHID.request();
    const ledgerApi = new Str(transport);
    return await signTxWithLedger(ledgerApi, isHash);
  } catch (error) {
    const ledgerError = error as LedgerErrorResponse;
    return { signature: undefined, error: onError(ledgerError) };
  }
};

const TREZOR_MANIFEST = {
  appName: "Stellar Lab",
  email: "accounts+trezor@stellar.org",
  appUrl: "https://lab.stellar.org/",
};

let trezorInit: Promise<void> | undefined;

/**
 * Initializes Trezor Connect once per page load. In "auto" mode Connect uses
 * Trezor Suite Desktop when it is running and the Suite Web tab otherwise.
 */
const initTrezorConnect = () => {
  if (!trezorInit) {
    trezorInit = TrezorConnect.init({
      manifest: TREZOR_MANIFEST,
      coreMode: "auto",
    }).catch((error) => {
      trezorInit = undefined;
      throw error;
    });
  }

  return trezorInit;
};

/** Initializes Trezor Connect ahead of signing; errors surface on sign. */
const prepareTrezor = () => initTrezorConnect().catch(() => undefined);

const getTrezorErrorMessage = (error: {
  code?: string;
  message?: string;
}): string => {
  const reason = error.message || error.code || "";

  if (reason.includes("popup-blocked")) {
    return `The browser blocked the Trezor Suite tab. Allow popups for this site and try again. (${reason})`;
  }

  if (reason.includes("iframe-blocked") || reason.includes("iframe-timeout")) {
    return `The Trezor Suite bootstrap frame could not load. Check content blockers and the Content Security Policy for suite.trezor.io. (${reason})`;
  }

  if (error.code === "Browser_LocalNetworkPermissionMissing") {
    return 'The browser denied this site access to Trezor Suite Desktop. Allow "apps on your device" (local network access) for this site and try again.';
  }

  if (error.message && error.code && !error.message.includes(error.code)) {
    return `${error.message} (${error.code})`;
  }

  return reason || "Couldn't sign transaction with Trezor device.";
};

const signWithTrezor = async ({
  bipPath,
  transaction,
}: {
  bipPath: string;
  transaction: Transaction | FeeBumpTransaction;
}): Promise<{
  signature: xdr.DecoratedSignature[] | undefined;
  error: string | undefined;
}> => {
  if (!(transaction instanceof Transaction)) {
    return {
      signature: undefined,
      error: "Trezor does not support signing fee bump transactions.",
    };
  }

  try {
    // Both throw early for anything Trezor cannot sign as is.
    assertTrezorCanSign(transaction);
    const trezorTransaction = transformTrezorTransaction(transaction);

    await initTrezorConnect();

    const { networkPassphrase } = transaction;
    const isTestnet = networkPassphrase === Networks.TESTNET;
    const isPublic = networkPassphrase === Networks.PUBLIC;

    // Connect only knows the public and test networks by flag; other networks
    // (and Manage Data removals) go in object form with an explicit passphrase.
    const response = await TrezorConnect.stellarSignTransaction(
      (isPublic || isTestnet) && !needsTrezorObjectForm(transaction)
        ? {
            path: bipPath,
            xdrBase64: transaction.toXdr(),
            testnet: isTestnet,
          }
        : {
            path: bipPath,
            networkPassphrase,
            transaction: trezorTransaction,
          },
    );

    if (response.success) {
      return {
        signature: getTrezorDecoratedSignature(response.payload, transaction),
        error: undefined,
      };
    } else {
      return {
        signature: undefined,
        error: getTrezorErrorMessage(response.error),
      };
    }
  } catch (error) {
    return {
      signature: undefined,
      error: getTrezorErrorMessage({
        code: (error as { code?: string })?.code,
        message: getErrorMessage(error),
      }),
    };
  }
};

const getTrezorDecoratedSignature = (
  payload: StellarSignedTx,
  transaction: Transaction,
): xdr.DecoratedSignature[] => {
  const publicKeyBytes = Buffer.from(payload.publicKey, "hex");

  return getVerifiedHardwareSignature({
    publicKey: StrKey.encodeEd25519PublicKey(publicKeyBytes),
    signature: Buffer.from(payload.signature, "hex"),
    transaction,
  });
};

const extractLastSignature = ({
  txXdr,
  networkPassphrase,
}: {
  txXdr: string;
  networkPassphrase: string;
}) => {
  const tx = TransactionBuilder.fromXdr(txXdr, networkPassphrase);
  const lastSig = tx.signatures.slice(-1);

  return lastSig.length === 1 ? lastSig : undefined;
};

const extractSignaturesFromTx = ({
  txXdr,
  networkPassphrase,
}: {
  txXdr: string;
  networkPassphrase: string;
}): { signature: string; hint: string }[] => {
  try {
    const tx = TransactionBuilder.fromXdr(txXdr, networkPassphrase);

    return tx.signatures.map((sig) => ({
      signature: Buffer.from(sig.signature.toBytes()).toString("hex"),
      hint: Buffer.from(sig.hint.toBytes()).toString("hex"),
    }));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return [];
  }
};

const decoratedSigFromHexSig = (
  hexSigs: { signature: string; publicKey: string }[],
  existingSigs: { signature: string; hint: string }[] = [],
) => {
  try {
    // Check for duplicate public keys
    const publicKeys = hexSigs.map((item) => item.publicKey);
    const seenKeys = new Set<string>();

    for (const key of publicKeys) {
      if (seenKeys.has(key)) {
        throw `Duplicate signer detected: ${shortenStellarAddress(key)}. Every account can only sign once.`;
      }
      seenKeys.add(key);
    }

    // Check for duplicate signatures within new signatures
    const signatures = hexSigs.map((item) => item.signature);
    const seenSignatures = new Set<string>();

    for (const sig of signatures) {
      if (seenSignatures.has(sig)) {
        throw `Duplicate signature detected. The same signature cannot be used multiple times.`;
      }
      seenSignatures.add(sig);
    }

    // Check for duplicate signatures against existing transaction signatures
    const existingSignatures = existingSigs.map((item) => item.signature);

    for (const newSig of signatures) {
      if (existingSignatures.includes(newSig)) {
        throw `Signature already exists in transaction. The same signature cannot be used multiple times.`;
      }
    }

    // Check for duplicate public keys against existing transaction signatures
    // We need to compare signature hints (derived from public keys) with existing hints
    for (const hexSig of hexSigs) {
      const keypair = Keypair.fromPublicKey(hexSig.publicKey);
      const newHint = Buffer.from(keypair.signatureHint()).toString("hex");

      const existingHints = existingSigs.map((item) => item.hint);

      if (existingHints.includes(newHint)) {
        throw `Signer ${shortenStellarAddress(hexSig.publicKey)} has already signed this transaction.`;
      }
    }

    const decoratedSig = hexSigs.reduce((decorated, item) => {
      const sig = Buffer.from(item.signature, "hex");
      const keypair = Keypair.fromPublicKey(item.publicKey);

      const hint = keypair.signatureHint();
      const decoratedSig = new xdr.DecoratedSignature({ hint, signature: sig });

      return [...decorated, decoratedSig];
    }, [] as xdr.DecoratedSignature[]);

    if (decoratedSig.length === 0) {
      throw "No valid signatures were added";
    }

    return {
      signature: decoratedSig,
      successMsg: `Successfully added ${decoratedSig.length} signature${decoratedSig.length == 1 ? "" : "s"}`,
    };
  } catch (e: any) {
    return {
      signature: [],
      errorMsg: e.toString(),
    };
  }
};

export const txHelper = {
  buildFeeBumpTx,
  signWithLedger,
  signWithTrezor,
  prepareTrezor,
  getVerifiedHardwareSignature,
  extractLastSignature,
  extractSignaturesFromTx,
  secretKeySignature,
  decoratedSigFromHexSig,
};
