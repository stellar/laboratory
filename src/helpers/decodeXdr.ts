import * as StellarXdr from "@/helpers/StellarXdr";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import { parseToLosslessJson } from "@/helpers/parseToLosslessJson";

export const decodeXdr = ({
  xdrType,
  xdrBlob,
  isReady,
  customErrorMessage = "Select another XDR type.",
  trackingEvents,
}: {
  xdrType: string;
  xdrBlob: string;
  isReady: boolean;
  customErrorMessage?: string;
  trackingEvents?: {
    success: TrackingEvent;
    successStream: TrackingEvent;
    error: TrackingEvent;
  };
}) => {
  const maybeStreamXdr = (
    xdrType: string,
    xdrString: string,
    originalError: any,
  ) => {
    try {
      const streamXdrJson = StellarXdr.decode_stream(xdrType, xdrString);

      if (trackingEvents?.successStream) {
        trackEvent(trackingEvents.successStream, {
          xdrType,
        });
      }

      return {
        jsonString: JSON.stringify(streamXdrJson),
        jsonArray: streamXdrJson.map((s) => parseToLosslessJson(s)),
        error: "",
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      if (trackingEvents?.error) {
        trackEvent(trackingEvents.error, { xdrType });
      }

      // If the stream fails, assume that the XDR is invalid and return the original error.
      return {
        jsonString: "",
        error: `Unable to decode input as ${xdrType}: ${originalError}. ${customErrorMessage}`,
      };
    }
  };

  const decoded = () => {
    if (!(isReady && xdrBlob && xdrType)) {
      return null;
    }

    try {
      const xdrJson = StellarXdr.decode(xdrType, xdrBlob);

      if (trackingEvents?.success) {
        trackEvent(trackingEvents.success, { xdrType: xdrType });
      }

      return {
        jsonString: xdrJson,
        jsonArray: [parseToLosslessJson(xdrJson)],
        error: "",
      };
    } catch (e) {
      // It's possible that the XDR is a stream
      return maybeStreamXdr(xdrType, xdrBlob, e);
    }
  };

  return decoded();
};

/**
 * Decodes a list of Base64 XDR blocks, guessing the XDR type of each block
 * independently. Used by the View XDR page when several XDR values are pasted
 * at once (e.g. the per-entry `ScSpecEntry` output of the Contract Explorer).
 *
 * For each block it runs `StellarXdr.guess()` and decodes with the first
 * candidate type that succeeds. Blocks that no candidate can decode are
 * returned with an `error` and an empty `jsonArray`, so callers can render the
 * successful entries alongside a list of failures.
 */
export const decodeXdrList = ({
  xdrBlobs,
  isReady,
  trackingEvents,
}: {
  xdrBlobs: string[];
  isReady: boolean;
  trackingEvents?: {
    success: TrackingEvent;
    successStream: TrackingEvent;
    error: TrackingEvent;
  };
}) => {
  if (!isReady) {
    return null;
  }

  return xdrBlobs.map((xdrBlob, index) => {
    let guesses: string[] = [];

    try {
      guesses = StellarXdr.guess(xdrBlob);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      guesses = [];
    }

    for (const xdrType of guesses) {
      const res = decodeXdr({ xdrType, xdrBlob, isReady, trackingEvents });

      if (res?.jsonString) {
        return { index, xdrType, jsonArray: res.jsonArray ?? [], error: "" };
      }
    }

    return {
      index,
      xdrType: "",
      jsonArray: [] as ReturnType<typeof parseToLosslessJson>[],
      error: `Entry ${index + 1}: unable to decode as any known XDR type.`,
    };
  });
};
