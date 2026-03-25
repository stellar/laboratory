import { Address, xdr } from "@stellar/stellar-sdk";

// =============================================================================
// Relative timestamp formatting
// =============================================================================

/**
 * Formats an ISO timestamp as a human-readable relative time string.
 * Matches the Figma spec: "~X seconds ago", "~X min ago", etc.
 *
 * @param isoTimestamp - ISO 8601 date string (ledgerClosedAt)
 * @returns Relative time string, e.g. "~15 seconds ago"
 *
 * @example
 * formatRelativeTime("2025-03-24T12:00:00Z"); // "~2 min ago"
 */
export const formatRelativeTime = (isoTimestamp: string): string => {
  const now = Date.now();
  const then = new Date(isoTimestamp).getTime();
  const elapsedMs = now - then;
  const elapsedSeconds = Math.floor(elapsedMs / 1000);

  if (elapsedSeconds < 60) {
    return `~${elapsedSeconds} seconds ago`;
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) {
    return `~${elapsedMinutes} min ago`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    return `~${elapsedHours} hours ago`;
  }

  const elapsedDays = Math.floor(elapsedHours / 24);
  return `~${elapsedDays} days ago`;
};

// =============================================================================
// ScVal introspection
// =============================================================================

export interface ParsedScVal {
  label: string;
  typeAnnotation: string;
  displayValue: string;
  isAddress: boolean;
}

/**
 * Truncates a hex hash to the format "2e887...b6f1f" (5 + 5 chars).
 *
 * @param hash - Full transaction hash
 * @returns Truncated hash string
 *
 * @example
 * truncateHash("2e887abcdef1234567890b6f1f"); // "2e887...b6f1f"
 */
export const truncateHash = (hash: string): string => {
  if (hash.length <= 12) return hash;
  return `${hash.slice(0, 5)}...${hash.slice(-5)}`;
};

/**
 * Converts an i128 ScVal (hi + lo parts) into a decimal string.
 *
 * @param parts - The i128 value from ScVal
 * @returns String representation of the 128-bit integer
 */
const i128ToString = (parts: xdr.Int128Parts): string => {
  const hi = BigInt(parts.hi().toString());
  const lo = BigInt(parts.lo().toString());
  // hi is the high 64 bits, lo is the unsigned low 64 bits
  const SHIFT = BigInt(64);
  const MASK = (BigInt(1) << SHIFT) - BigInt(1);
  const value = (hi << SHIFT) | (lo & MASK);
  return value.toString();
};

/**
 * Converts a u128 ScVal (hi + lo parts) into a decimal string.
 *
 * @param parts - The u128 value from ScVal
 * @returns String representation of the unsigned 128-bit integer
 */
const u128ToString = (parts: xdr.UInt128Parts): string => {
  const hi = BigInt(parts.hi().toString());
  const lo = BigInt(parts.lo().toString());
  const SHIFT = BigInt(64);
  const MASK = (BigInt(1) << SHIFT) - BigInt(1);
  const value = (hi << SHIFT) | (lo & MASK);
  return value.toString();
};

/**
 * Introspects an xdr.ScVal and returns a display-ready representation.
 * Maps ScVal types to labels, type annotations, and display values
 * per the spec's type-to-display mapping.
 *
 * @param scVal - A Stellar XDR ScVal object
 * @returns Parsed display data for the ScVal
 *
 * @example
 * const parsed = parseScVal(topic);
 * // { label: "Symbol", typeAnnotation: "sym", displayValue: '"transfer"', isAddress: false }
 */
export const parseScVal = (scVal: xdr.ScVal): ParsedScVal => {
  const typeName = scVal.switch().name;

  switch (typeName) {
    case "scvSymbol":
      return {
        label: "Symbol",
        typeAnnotation: "sym",
        displayValue: `"${scVal.sym().toString()}"`,
        isAddress: false,
      };

    case "scvAddress": {
      const addr = Address.fromScVal(scVal).toString();
      return {
        label: "Address",
        typeAnnotation: "address",
        displayValue: addr,
        isAddress: true,
      };
    }

    case "scvString":
      return {
        label: "string",
        typeAnnotation: "string",
        displayValue: `"${scVal.str().toString()}"`,
        isAddress: false,
      };

    case "scvI128":
      return {
        label: "Data",
        typeAnnotation: "i128",
        displayValue: `"${i128ToString(scVal.i128())}"`,
        isAddress: false,
      };

    case "scvU128":
      return {
        label: "Data",
        typeAnnotation: "u128",
        displayValue: `"${u128ToString(scVal.u128())}"`,
        isAddress: false,
      };

    case "scvBytes":
      return {
        label: "Data",
        typeAnnotation: "bytes",
        displayValue: scVal.bytes().toString("hex"),
        isAddress: false,
      };

    case "scvBool":
      return {
        label: "Data",
        typeAnnotation: "bool",
        displayValue: scVal.b().toString(),
        isAddress: false,
      };

    default: {
      // Fallback: JSON-serialize the ScVal
      let fallback: string;
      try {
        fallback = JSON.stringify(scVal.value());
      } catch {
        fallback = scVal.toXDR("base64");
      }
      return {
        label: "Data",
        typeAnnotation: typeName.replace("scv", "").toLowerCase(),
        displayValue: fallback,
        isAddress: false,
      };
    }
  }
};
