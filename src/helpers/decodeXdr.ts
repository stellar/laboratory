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
        isStream: streamXdrJson.length > 1,
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
        isStream: false,
      };
    }
  };

  const decoded = () => {
    if (!(isReady && xdrBlob && xdrType)) {
      return null;
    }

    try {
      const xdrJson = StellarXdr.decode(xdrType, xdrBlob);

      // Even though single decode succeeded, also try stream decoding
      // to check if there are additional XDR values concatenated together.
      // This handles cases like contract specs where multiple XDR values
      // are encoded as a single base64 string.
      try {
        const streamXdrJson = StellarXdr.decode_stream(xdrType, xdrBlob);

        // If stream decode returns more than one item, use the stream result
        if (streamXdrJson.length > 1) {
          if (trackingEvents?.successStream) {
            trackEvent(trackingEvents.successStream, {
              xdrType,
            });
          }

          return {
            jsonString: JSON.stringify(streamXdrJson),
            jsonArray: streamXdrJson.map((s) => parseToLosslessJson(s)),
            error: "",
            isStream: true,
          };
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (streamError) {
        // Stream decode failed, fall through to return single decode result
      }

      if (trackingEvents?.success) {
        trackEvent(trackingEvents.success, { xdrType: xdrType });
      }

      return {
        jsonString: xdrJson,
        jsonArray: [parseToLosslessJson(xdrJson)],
        error: "",
        isStream: false,
      };
    } catch (e) {
      // It's possible that the XDR is a stream
      return maybeStreamXdr(xdrType, xdrBlob, e);
    }
  };

  return decoded();
};
