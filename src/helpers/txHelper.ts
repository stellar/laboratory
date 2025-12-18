import {
  FeeBumpTransaction,
  Keypair,
  StrKey,
  Transaction,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import Str from "@ledgerhq/hw-app-str";
import TrezorConnect, { StellarSignedTx } from "@trezor/connect-web";
import transformTransaction from "@trezor/connect-plugin-stellar";

import { validate } from "@/validate";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";

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
    innerTx = TransactionBuilder.fromXDR(
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
    result.xdr = feeBumpTx.toEnvelope().toXDR("base64");
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
  const tx = TransactionBuilder.fromXDR(txXdr, networkPassphrase);
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
          transaction.hash(),
        );
        ledgerSignature = signature;
      } else {
        const { signature } = await ledgerApi.signTransaction(
          bipPath,
          transaction.signatureBase(),
        );
        ledgerSignature = signature;
      }

      const keyPair = Keypair.fromPublicKey(publicKey);
      const hint = keyPair.signatureHint();
      const decorated = new xdr.DecoratedSignature({
        hint,
        signature: ledgerSignature,
      });

      return { signature: [decorated], error: undefined };
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

const signWithTrezor = async ({
  bipPath,
  transaction,
}: {
  bipPath: string;
  transaction: Transaction;
}): Promise<{
  signature: xdr.DecoratedSignature[] | undefined;
  error: string | undefined;
}> => {
  TrezorConnect.manifest({
    email: "accounts+trezor@stellar.org",
    appUrl: "https://lab.stellar.org/",
    appName: "Stellar Lab",
  });

  try {
    const trezorParams = transformTransaction(bipPath, transaction);
    const response = await TrezorConnect.stellarSignTransaction(trezorParams);

    if (response.success) {
      return {
        signature: getTrezorDecoratedSignature(response.payload),
        error: undefined,
      };
    } else {
      const errorPayload = response.payload as { error: string };
      return {
        signature: undefined,
        error:
          errorPayload.error || "Couldn't sign transaction with Trezor device.",
      };
    }
  } catch (error) {
    return {
      signature: undefined,
      error: `Couldn't sign transaction with Trezor device. Details: ${error}`,
    };
  }
};

const getTrezorDecoratedSignature = (
  payload: StellarSignedTx,
): xdr.DecoratedSignature[] => {
  const signature = Buffer.from(payload.signature, "hex");
  const publicKeyBytes = Buffer.from(payload.publicKey, "hex");
  const encodedPublicKey = StrKey.encodeEd25519PublicKey(publicKeyBytes);

  const keyPair = Keypair.fromPublicKey(encodedPublicKey);
  const hint = keyPair.signatureHint();
  const decorated = new xdr.DecoratedSignature({ hint, signature });

  return [decorated];
};

const extractLastSignature = ({
  txXdr,
  networkPassphrase,
}: {
  txXdr: string;
  networkPassphrase: string;
}) => {
  const tx = TransactionBuilder.fromXDR(txXdr, networkPassphrase);
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
    const tx = TransactionBuilder.fromXDR(txXdr, networkPassphrase);

    return tx.signatures.map((sig) => ({
      signature: sig.signature().toString("hex"),
      hint: sig.hint().toString("hex"),
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
      const newHint = keypair.signatureHint().toString("hex");

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
  extractLastSignature,
  extractSignaturesFromTx,
  secretKeySignature,
  decoratedSigFromHexSig,
};
