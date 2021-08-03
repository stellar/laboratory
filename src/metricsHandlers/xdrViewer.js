import { FETCH_LATEST_TX } from "../actions/xdrViewer";
import { logEvent } from "../helpers/metrics";

export const metricsEvents = {
  fetchLatestTx: "xdr viewer: fetch latest transaction",
  decodeFailed: 'xdr viewer: decode XDR: failed',
  decodeSuccess: 'xdr viewer: decode XDR: success',
};

export default function networkMetrics(state, action) {
  const { type, ...payload } = action;
  switch (type) {
    case FETCH_LATEST_TX: {
      logEvent(metricsEvents.fetchLatestTx);
    }
  }
}
