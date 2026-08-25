import * as StellarXdr from "@/helpers/StellarXdr";

/**
 * Every XDR type name the decoder accepts, sorted alphabetically.
 *
 * Sourced from `@stellar/stellar-xdr-json` — which is what actually decodes —
 * rather than the JS SDK's `xdr` namespace. The SDK exports hundreds of names
 * the decoder rejects (per-arm union classes, base classes, helpers) and omits
 * typedefs it accepts (`LedgerEntryChanges`, `UInt128Parts`, ...), so the two
 * lists drift apart on every SDK upgrade.
 *
 * Requires `StellarXdr.initialize()` to have resolved; call behind
 * `useIsXdrInit()`.
 */
export const getAllXdrTypes = () => StellarXdr.types().sort();
