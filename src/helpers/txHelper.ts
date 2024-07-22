import {
  FeeBumpTransaction,
  Keypair,
  StrKey,
  Transaction,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
import LedgerTransportWebUSB from "@ledgerhq/hw-transport-webusb";
import LedgerStr from "@ledgerhq/hw-app-str";
import TrezorConnect, { StellarSignedTx } from "@trezor/connect-web";
import transformTransaction from "@trezor/connect-plugin-stellar";

import { LedgerErrorResponse } from "@/types/types";

import { validate } from "@/validate";

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

/* Sign Transaction related */
interface LedgerApi {
  getPublicKey(path: string): Promise<{ publicKey: string }>;
  signHash(path: string, hash: Buffer): Promise<{ signature: Buffer }>;
  signTransaction(
    path: string,
    transaction: Buffer,
  ): Promise<{ signature: Buffer }>;
}

const signTx = ({
  txXdr,
  signers,
  networkPassphrase,
  hardWalletSigs,
}: {
  txXdr: string;
  signers: string[];
  networkPassphrase: string;
  hardWalletSigs: xdr.DecoratedSignature[] | [];
}) => {
  const validSecretKeys = [];
  const validPreimages = [];

  for (let i = 0; i < signers.length; i++) {
    const signer = signers[i];

    if (signer !== null && signer !== undefined && signer !== "") {
      const error = validate.getSecretKeyError(signer);

      if (error) {
        return {
          xdr: undefined,
          message: error,
        };
      }

      if (!error) {
        if (signer.charAt(0) === "S") {
          // Secret keys
          validSecretKeys.push(signer);
        } else {
          // Hash preimage
          validPreimages.push(signer);
        }
      }
    }
  }

  const newTx = TransactionBuilder.fromXDR(txXdr, networkPassphrase);
  const existingSigs = newTx.signatures.length;
  let addedSigs = 0;

  validSecretKeys.forEach((signer) => {
    addedSigs++;
    newTx.sign(Keypair.fromSecret(signer));
  });
  validPreimages.forEach((signer) => {
    addedSigs++;
    newTx.signHashX(Buffer.from(signer, "hex"));
  });
  hardWalletSigs.forEach((signer) => {
    addedSigs++;
    newTx.signatures.push(signer);
  });

  return {
    xdr: newTx.toEnvelope().toXDR("base64"),
    message: `${addedSigs} signature(s) added; ${
      existingSigs + addedSigs
    } signature(s) total`,
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

  const signTxWithLedger = async (ledgerApi: LedgerApi, isHash: boolean) => {
    let ledgerSignature;

    try {
      const { publicKey } = await ledgerApi.getPublicKey(bipPath);

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
    const transport = await LedgerTransportWebUSB.request();
    const ledgerApi = new LedgerStr(transport);
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
    appUrl: "https://laboratory.stellar.org/",
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

export const txHelper = {
  buildFeeBumpTx,
  signTx,
  signWithLedger,
  signWithTrezor,
};
