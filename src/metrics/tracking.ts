import * as amplitude from "@amplitude/analytics-browser";
import { AnyObject } from "@/types/types";

export const initTracking = () => {
  if (!process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
    return;
  }

  const options = {
    defaultTracking: false,
    attribution: false,
    pageViews: true,
    sessions: true,
    formInteractions: false,
    fileDownloads: false,
    logLevel:
      process.env.NODE_ENV === "development"
        ? amplitude.Types.LogLevel.Warn
        : amplitude.Types.LogLevel.None,
  };

  try {
    amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY, options);
  } catch (e) {
    // Do nothing
  }
};

export const trackEvent = (type: TrackingEvent, properties?: AnyObject) => {
  amplitude.track(type, properties);
};

export enum TrackingEvent {
  // Global
  TOP_NAV_CLICKED = "top nav clicked",
  NETWORK_SWITCH_TO = "network: switch to",
  // Account
  ACCOUNT_CREATE_GENERATE_KEYPAIR = "account: create: generate keypair",
  ACCOUNT_CREATE_FUND_ACCOUNT = "account: create: fund account",
  ACCOUNT_FUND_FUND_ACCOUNT = "account: fund: fund account",
  ACCOUNT_FUND_FILL = "account: fund: fill generated key",
  ACCOUNT_MUXED_CREATE = "account: muxed: create",
  ACCOUNT_MUXED_PARSE = "account: muxed: parse",
  // Endpoints
  ENDPOINTS_HORIZON_SUBMIT = "endpoints: horizon: submit",
  ENDPOINTS_HORIZON_COPY = "endpoints: horizon: copy",
  ENDPOINTS_HORIZON_SAVE = "endpoints: horizon: save",
  ENDPOINTS_RPC_SUBMIT = "endpoints: rpc: submit",
  ENDPOINTS_RPC_COPY = "endpoints: rpc: copy",
  ENDPOINTS_RPC_SAVE = "endpoints: rpc: save",
}
