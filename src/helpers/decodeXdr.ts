import * as StellarXdr from "@/helpers/StellarXdr";
import { parseToLosslessJson } from "@/helpers/parseToLosslessJson";
import { normalizeXdrStream } from "@/helpers/xdrStream";

/** How the XDR was decoded: as a single value, as a stream, or not at all. */
export type DecodeXdrOutcome = "success" | "stream" | "error";

/**
 * Decodes a base64 XDR blob to JSON, falling back to decoding it as an XDR
 * stream. Pure: it does not track events, so callers can run it on every
 * render. Returns `null` until XDR is initialized and both inputs are set.
 */
export const decodeXdr = ({
  xdrType,
  xdrBlob,
  isReady,
  customErrorMessage = "Select another XDR type.",
}: {
  xdrType: string;
  xdrBlob: string;
  isReady: boolean;
  customErrorMessage?: string;
}) => {
  const maybeStreamXdr = (
    xdrType: string,
    xdrString: string,
    originalError: any,
  ) => {
    try {
      const streamXdrJson = StellarXdr.decode_stream(
        xdrType,
        normalizeXdrStream(xdrString),
      );

      return {
        jsonString: JSON.stringify(streamXdrJson),
        jsonArray: streamXdrJson.map((s) => parseToLosslessJson(s)),
        error: "",
        outcome: "stream" as DecodeXdrOutcome,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // If the stream fails, assume that the XDR is invalid and return the original error.
      return {
        jsonString: "",
        error: `Unable to decode input as ${xdrType}: ${originalError}. ${customErrorMessage}`,
        outcome: "error" as DecodeXdrOutcome,
      };
    }
  };

  const decoded = () => {
    if (!(isReady && xdrBlob && xdrType)) {
      return null;
    }

    try {
      const xdrJson = StellarXdr.decode(xdrType, xdrBlob);

      return {
        jsonString: xdrJson,
        jsonArray: [parseToLosslessJson(xdrJson)],
        error: "",
        outcome: "success" as DecodeXdrOutcome,
      };
    } catch (e) {
      // It's possible that the XDR is a stream
      return maybeStreamXdr(xdrType, xdrBlob, e);
    }
  };

  return decoded();
};
