import { DependencyList, useEffect } from "react";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import { AnyObject } from "@/types/types";

/**
 * Tracks `event` once `deps` have stayed the same for `delay` ms.
 *
 * Use it for events that describe the result of user input (for example,
 * decoding XDR). Re-renders that don't change `deps` send nothing, and typing
 * sends one event after the user pauses instead of one per keystroke.
 *
 * `event` and `properties` must only change when `deps` change
 * Pass `null` as `event` to skip tracking.
 */
export const useDebouncedTrackEvent = (
  {
    event,
    properties,
    delay = 1000,
  }: {
    event: TrackingEvent | null;
    properties?: AnyObject;
    delay?: number;
  },
  deps: DependencyList,
) => {
  useEffect(() => {
    if (!event) {
      return;
    }

    const timeout = setTimeout(() => {
      trackEvent(event, properties);
    }, delay);

    return () => clearTimeout(timeout);
    // `event` and `properties` are derived from `deps`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
};
