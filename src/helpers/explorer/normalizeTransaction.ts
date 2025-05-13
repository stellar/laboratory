import * as StellarXdr from "@/helpers/StellarXdr";
import { rpc as StellarRpc } from "@stellar/stellar-sdk";

function isPrimitive(obj: unknown): boolean {
  return ["number", "string", "null", "boolean"].includes(typeof obj);
}

function camelize(input: unknown): unknown {
  if (Array.isArray(input)) {
    return input.map(camelize);
  }

  if (isPrimitive(input)) {
    return input;
  }

  // @ts-expect-error
  const output = Object.keys(input).reduce((buffer, key) => {
    const newKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase(),
    );
    // @ts-expect-error
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

  try {
    const xdr = txinfo.envelopeXdr.toXDR().toString("base64");
    const guesses = StellarXdr.guess(xdr);
    return {
      payload: camelize(
        JSON.parse(StellarXdr.decode(guesses[0], xdr)),
      ) as Record<string, unknown>,
      txHash: txinfo.txHash,
      status: txinfo.status,
      createdAt: txinfo.createdAt,
    };
  } catch (e) {
    return null;
  }
}
