import * as StellarXdr from "@/helpers/StellarXdr";
import { rpc as StellarRpc } from "@stellar/stellar-sdk";

function isPrimitive(obj: unknown): boolean {
  return ["number", "string", "boolean"].includes(typeof obj) || obj === null;
}

function camelize(input: unknown): unknown {
  if (Array.isArray(input)) {
    return input.map(camelize);
  }

  if (isPrimitive(input)) {
    return input;
  }

  // @ts-expect-error assume it's an object, we don't care about type
  const output = Object.keys(input).reduce((buffer, key) => {
    const newKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase(),
    );
    // @ts-expect-error assume it's an object, we don't care about type
    return Object.assign(buffer, { [newKey]: camelize(input[key]) });
  }, {});

  return output;
}

export type NormalizedTransaction = {
  txHash: string;
  createdAt: number;
  status: string;
  payload: Record<string, unknown>;
};

export async function normalizeTransaction(
  txinfo: StellarRpc.Api.TransactionInfo,
): Promise<NormalizedTransaction | null> {
  await StellarXdr.initialize();

  const xdr = txinfo.envelopeXdr.toXDR().toString("base64");
  const guesses = StellarXdr.guess(xdr);

  const decodedTx = guesses
    .map((guess) => {
      try {
        return StellarXdr.decode(guess, xdr);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        return null;
      }
    })
    .find(Boolean);

  if (!decodedTx) {
    return null;
  }

  return {
    payload: camelize(JSON.parse(decodedTx)) as Record<string, unknown>,
    txHash: txinfo.txHash,
    status: txinfo.status,
    createdAt: txinfo.createdAt,
  };
}
