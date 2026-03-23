---
name: stellar-xdr-patterns
description: Reference for XDR encode/decode/validate patterns in Stellar Lab. Invoke when working with XDR strings, Stellar SDK parsing, or transaction serialization.
---

# Stellar XDR Patterns

## Core Principle

**Store as base64 strings. Parse lazily at point of use. Never persist SDK object instances.**

All XDR values in stores, props, and sessionStorage are base64-encoded strings.
Parse them back to SDK objects only when you need to read their contents or
modify them. This keeps serialization simple and avoids class instance issues
with Zustand persist.

## Import Patterns

### 1. Stellar SDK — for parsing/building XDR objects

```typescript
import { xdr, TransactionBuilder, StrKey } from "@stellar/stellar-sdk";

// Parse a transaction envelope
const tx = TransactionBuilder.fromXDR(xdrString, networkPassphrase);

// Parse specific XDR types
const entry = xdr.SorobanAuthorizationEntry.fromXDR(entryXdr, "base64");
const sorobanData = xdr.SorobanTransactionData.fromXDR(txData, "base64");

// Encode back to base64
const encoded = tx.toEnvelope().toXDR("base64");
```

### 2. StellarXdr helper — for XDR ↔ JSON conversion (display)

```typescript
import * as StellarXdr from "@/helpers/StellarXdr";

// Must initialize first (WASM module)
await StellarXdr.initialize();

// Decode XDR to JSON (for display in CodeEditor)
const json = StellarXdr.decode("TransactionEnvelope", xdrBlob);

// Encode JSON back to XDR
const xdrBlob = StellarXdr.encode("TransactionEnvelope", jsonString);

// Guess XDR type
const guessedType = StellarXdr.guess(xdrBlob);
```

### 3. decodeXdr helper — high-level decode with fallback

```typescript
import { decodeXdr } from "@/helpers/decodeXdr";

const { jsonString, error } = decodeXdr({
  xdrType: "TransactionEnvelope",
  xdrBlob: base64String,
  isReady: true,  // StellarXdr initialized
});
```

### 4. decodeScVal — for Soroban contract values

```typescript
import { decodeScVal } from "@/helpers/decodeScVal";

// Decode base64 ScVal XDR to native JS type
const value = decodeScVal(scValXdrString);  // Returns native type or null
```

## Validation

```typescript
import { validate } from "@/validate";

// Returns undefined if valid, { result, message } if invalid
const error = validate.getXdrError(xdrString, "TransactionEnvelope");
if (error) {
  console.error(error.message);
}
```

Validation flow:
1. Check base64 format (regex)
2. Attempt to parse with Stellar SDK (`fromXDR`)
3. Return descriptive error message on failure

## Common Operations

### Parse transaction and extract data

```typescript
const tx = TransactionBuilder.fromXDR(xdrString, networkPassphrase);
const sourceAccount = tx.source;
const fee = tx.fee;
const operations = tx.operations;
```

### Extract resources from simulation result

```typescript
const sorobanData = xdr.SorobanTransactionData.fromXDR(
  simulationResult.transactionData,
  "base64",
);
const resources = sorobanData.resources();
const footprint = resources.footprint();

const info = {
  instructions: resources.instructions(),
  readBytes: resources.diskReadBytes(),
  writeBytes: resources.writeBytes(),
  readOnlyKeys: footprint.readOnly().length,
  readWriteKeys: footprint.readWrite().length,
};
```

### Extract auth entries from simulation response

```typescript
const extractAuthEntries = (responseData: Record<string, any>): string[] => {
  const authEntries: string[] = [];
  const results = responseData?.result?.results;
  if (Array.isArray(results)) {
    for (const r of results) {
      if (Array.isArray(r.auth)) {
        authEntries.push(...r.auth);  // Each is base64 XDR
      }
    }
  }
  return authEntries;
};
```

### Sign and encode auth entry

```typescript
import { authorizeEntry } from "@stellar/stellar-sdk";

const signedEntry = await authorizeEntry(
  xdr.SorobanAuthorizationEntry.fromXDR(entryXdr, "base64"),
  keypair,
  validUntilLedgerSeq,
  networkPassphrase,
);
const signedXdr = signedEntry.toXDR("base64");
```

### Amount conversion (stroops ↔ decimal)

```typescript
import { xdrUtils } from "@/helpers/xdr/utils";

const stroops = xdrUtils.toAmount("10.5");     // → BigInt
const decimal = xdrUtils.fromAmount("105000000"); // → "10.5"
```

## Store Convention

In `createTransactionFlowStore.ts`, XDR and results are stored as strings:

```typescript
// XDR fields — always base64 strings
build.classic.xdr: string
build.soroban.xdr: string
simulate.authEntriesXdr: string[]
simulate.signedAuthEntriesXdr: string[]
simulate.assembledXdr: string
sign.signedXdr: string
validate.validatedXdr: string

// Result fields — always raw JSON strings
simulate.simulationResultJson: string
validate.validateResultJson: string
submit.submitResultJson: string
```

## Error Handling

Always wrap XDR parsing in try-catch:

```typescript
try {
  const entry = xdr.SorobanAuthorizationEntry.fromXDR(entryXdr, "base64");
  // use entry...
} catch (e) {
  // Invalid XDR — show error to user or return null
}
```

## Key Files

| Purpose | File |
|---------|------|
| XDR ↔ JSON wrapper | `src/helpers/StellarXdr.ts` |
| High-level decoder | `src/helpers/decodeXdr.ts` |
| ScVal decoder | `src/helpers/decodeScVal.ts` |
| Amount/price utils | `src/helpers/xdr/utils.ts` |
| XDR validation | `src/validate/methods/getXdrError.ts` |
| Transaction helpers | `src/helpers/txHelper.ts` |
