import { nativeToScVal } from "@stellar/stellar-sdk";

export const convertToScVal = (value: any) => {
  // - when `val` is an integer-like type (i.e. number|bigint), this will be
  //   forwarded to ScInt or forced to be u32/i32.

  // - when `val` is an array type, this is forwarded to the recursion

  // - when `val` is an object type (key-value entries), this should be an
  //   object in which each key has a pair of types (to represent forced types
  //   for the key and the value), where `null` (or a missing entry) indicates
  //   the default interpretation(s) (refer to the examples, below)

  // - when `val` is a string type, this can be 'string' or 'symbol' to force
  //   a particular interpretation of `val`.

  // - when `val` is a bytes-like type, this can be 'string', 'symbol', or
  //   'bytes' to force a particular interpretation

  // As a simple example, nativeToScVal("hello", {type: 'symbol'}) will return an scvSymbol, whereas without the type it would have been an scvString.
  try {
    return nativeToScVal(value, { type: "symbol" });
  } catch (e) {
    return null;
  }
};
