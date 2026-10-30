import * as StellarXdr from "@/helpers/StellarXdr";
import { normalizeXdrStream } from "@/helpers/xdrStream";

// XDR types stored as streams in contract Wasm custom sections
const GUESSABLE_STREAM_TYPES = ["ScSpecEntry", "ScMetaEntry", "ScEnvMetaEntry"];

/**
 * Returns the stream types that decode `xdrBlob` into 2+ values. Used when
 * `guess()` finds no single-value type.
 */
export const guessXdrStreamTypes = (xdrBlob: string): string[] => {
  const stream = normalizeXdrStream(xdrBlob);

  return GUESSABLE_STREAM_TYPES.filter((type) => {
    try {
      return StellarXdr.decode_stream(type, stream).length > 1;
    } catch {
      return false;
    }
  });
};
