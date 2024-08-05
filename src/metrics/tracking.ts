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
  if (!process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
    return;
  }

  try {
    amplitude.track(type, properties);
  } catch (e) {
    // Do nothing
  }
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
  // Transactions - build
  TRANSACTION_BUILD_TAB = "transaction: build: tab",
  TRANSACTION_BUILD_ADD_OPERATIONS = "transaction: build: add operations",
  TRANSACTION_BUILD_CLEAR_PARAMS = "transaction: build: clear params",
  TRANSACTION_BUILD_SAVE_POPUP = "transaction: build: save: popup",
  TRANSACTION_BUILD_SAVE_SAVE = "transaction: build: save: save",
  TRANSACTION_BUILD_SAVE_CANCEL = "transaction: build: save: cancel",
  TRANSACTION_BUILD_OPERATIONS_ADD = "transaction: build: operations: add",
  TRANSACTION_BUILD_OPERATIONS_CLEAR = "transaction: build: operations: clear",
  TRANSACTION_BUILD_OPERATIONS_ACTION_DUPLICATE = "transaction: build: operations: action: duplicate",
  TRANSACTION_BUILD_OPERATIONS_ACTION_UP = "transaction: build: operations: action: up",
  TRANSACTION_BUILD_OPERATIONS_ACTION_DOWN = "transaction: build: operations: action: down",
  TRANSACTION_BUILD_OPERATIONS_ACTION_DELETE = "transaction: build: operations: action: delete",
  // Transactions - saved
  TRANSACTION_SAVED_VIEW_BUILDER = "transaction: saved: view in builder",
  TRANSACTION_SAVED_DELETE = "transaction: saved: delete",
  TRANSACTION_SAVED_EDIT_POPUP = "transaction: saved: edit: popup",
  TRANSACTION_SAVED_EDIT_SAVE = "transaction: saved: edit: save",
  TRANSACTION_SAVED_EDIT_CANCEL = "transaction: saved: edit: cancel",
  // Transactions - sign
  TRANSACTION_SIGN_IMPORT = "transaction: sign: import",
  TRANSACTION_SIGN_CLEAR = "transaction: sign: clear",
  TRANSACTION_SIGN_SIGNATURE_ADD = "transaction: sign: signature: add",
  TRANSACTION_SIGN_TRANSACTION = "transaction: sign: transaction",
  TRANSACTION_SIGN_HARDWARE_SUCCESS = "transaction: sign: hardware: success",
  TRANSACTION_SIGN_HARDWARE_ERROR = "transaction: sign: hardware: error",
  TRANSACTION_SIGN_WALLET_SUCCESS = "transaction: sign: wallet: success",
  TRANSACTION_SIGN_WALLET_ERROR = "transaction: sign: wallet: error",
}
