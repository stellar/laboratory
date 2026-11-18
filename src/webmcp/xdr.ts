import * as StellarXdr from "@/helpers/StellarXdr";

// When the XDR could be several types, try these first: they are what people
// paste most often.
const PREFERRED_TYPES = [
  "TransactionEnvelope",
  "TransactionResult",
  "TransactionMeta",
  "LedgerEntryData",
  "LedgerEntry",
  "LedgerKey",
  "SorobanTransactionData",
  "SorobanAuthorizationEntry",
  "ScVal",
  "ContractEvent",
  "DiagnosticEvent",
];

const decodeAs = (type: string, xdr: string) => {
  try {
    return StellarXdr.decode(type, xdr);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // Some XDR (e.g. getEvents results) is a stream of values.
    return `[${StellarXdr.decode_stream(type, xdr).join(",")}]`;
  }
};

/**
 * Decodes base64 XDR to Lab's canonical XDR-JSON. Without a type, guesses it.
 * Returns serialized JSON so large integers keep full precision.
 */
export const decodeXdrToJson = async ({
  xdr,
  type,
}: {
  xdr: string;
  type?: string;
}) => {
  await StellarXdr.initialize();

  const blob = xdr.trim();
  let candidates: string[] = type ? [type] : [];

  if (!type) {
    const guessed = StellarXdr.guess(blob);

    if (!guessed.length) {
      throw new Error(
        "Could not identify this XDR. Check it is base64, or pass `type` explicitly (see lab_xdr_decode's description).",
      );
    }

    candidates = [
      ...PREFERRED_TYPES.filter((t) => guessed.includes(t)),
      ...guessed.filter((t) => !PREFERRED_TYPES.includes(t)),
    ];
  }

  const errors: string[] = [];

  // Try the most likely type first, falling back if it fails to decode.
  for (const candidate of candidates.slice(0, 5)) {
    try {
      const json = decodeAs(candidate, blob);

      return {
        json,
        type: candidate,
        otherPossibleTypes: candidates
          .filter((t) => t !== candidate)
          .slice(0, 10),
      };
    } catch (e) {
      errors.push(`${candidate}: ${e}`);
    }
  }

  throw new Error(`Unable to decode XDR. ${errors.join("; ")}`);
};

export const encodeJsonToXdr = async ({
  type,
  json,
}: {
  type: string;
  json: string;
}) => {
  await StellarXdr.initialize();
  return StellarXdr.encode(type, json);
};
