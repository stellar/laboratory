import * as amplitude from "@amplitude/analytics-browser";
import { parse } from "zustand-querystring";
import { AnyObject } from "@/types/types";

const AMPLITUDE_API_KEY_DEV = "21f9b86405da037f7b9d1f00a235a4fd";
const AMPLITUDE_API_KEY_PROD = "660a7cac35ad6ee81adc20f74cc74bba";

declare global {
  interface Window {
    __STELLAR_TRACKING_ENABLED__?: boolean;
  }
}

export const initTracking = () => {
  if (window.__STELLAR_TRACKING_ENABLED__) {
    return;
  }

  let apiKey = "";

  const { hostname } = window.location;

  if (hostname === "lab.stellar.org") {
    apiKey = AMPLITUDE_API_KEY_PROD;
  } else if (hostname.includes("previews.kube001.services.stellar-ops.com")) {
    apiKey = AMPLITUDE_API_KEY_DEV;
  }

  if (!apiKey) {
    return;
  }

  const options: amplitude.Types.BrowserOptions = {
    defaultTracking: false,
    // Disabling any "autocapture" events to make sure we don't track any
    // unwanted user info from the URL. Enabling only sessions tracking.
    autocapture: {
      attribution: false,
      pageViews: false,
      sessions: true,
      formInteractions: false,
      fileDownloads: false,
      elementInteractions: false,
    },
    trackingOptions: {
      ipAddress: false,
      language: true,
      platform: true,
    },
    logLevel:
      process.env.NODE_ENV === "development"
        ? amplitude.Types.LogLevel.Warn
        : amplitude.Types.LogLevel.None,
  };

  try {
    amplitude.init(apiKey, options);
    window.__STELLAR_TRACKING_ENABLED__ = true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // Do nothing
  }
};

export const trackEvent = (type: TrackingEvent, properties?: AnyObject) => {
  if (!window.__STELLAR_TRACKING_ENABLED__) {
    return;
  }

  const trimmedParams = window.location.search
    ? window.location.search.substring(3)
    : "";
  const searchParams: AnyObject | null = parse(trimmedParams);

  const props = {
    network: searchParams?.network?.id,
    ...properties,
  };

  try {
    amplitude.track(type, props);

    if (process.env.NODE_ENV === "development") {
      console.log("Amplitude tracking: ", type, props);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // Do nothing
  }
};

export enum TrackingEvent {
  // Global
  MAIN_NAV_CLICKED = "main nav clicked",
  MOBILE_NAV_CLICKED = "mobile nav clicked",
  SUBNAV_CLICKED = "subnav clicked",
  NETWORK_SWITCH = "network: switch",
  THEME_SET = "theme set",
  WALLET_KIT_SELECTED = "wallet kit selected",
  // XDR
  XDR_TO_JSON_SUCCESS = "xdr: to json: success",
  XDR_TO_JSON_STREAM_SUCCESS = "xdr: to json stream: success",
  XDR_TO_JSON_ERROR = "xdr: to json: error",
  XDR_TO_JSON_FETCH_XDR = "xdr: to json: fetch xdr",
  XDR_TO_JSON_CLEAR = "xdr: to json: clear",
  XDR_FROM_JSON_SUCCESS = "xdr: from json: success",
  XDR_FROM_JSON_ERROR = "xdr: from json: error",
  XDR_FROM_JSON_CLEAR = "xdr: from json: clear",
  XDR_DIFF_SUCCESS = "xdr: diff: success",
  XDR_DIFF_ERROR = "xdr: diff: error",
  XDR_DIFF_CLEAR = "xdr: diff: clear",
  // Account
  ACCOUNT_CREATE_GENERATE_KEYPAIR = "account: create: generate keypair",
  ACCOUNT_CREATE_FUND_ACCOUNT = "account: create: fund account",
  ACCOUNT_CREATE_SAVE = "account: create: save account",
  ACCOUNT_FUND_FUND_ACCOUNT = "account: fund: fund account",
  ACCOUNT_FUND_FILL = "account: fund: fill generated key",
  ACCOUNT_MUXED_CREATE = "account: muxed: create",
  ACCOUNT_MUXED_PARSE = "account: muxed: parse",
  // Transactions - build
  TRANSACTION_BUILD_ADD_OPERATION = "transaction: build: add operation",
  TRANSACTION_BUILD_SAVE = "transaction: build: save",
  TRANSACTION_BUILD_CLEAR_PARAMS = "transaction: build: clear params",
  TRANSACTION_BUILD_OPERATIONS_OP_TYPE = "transaction: build: operations: operation type",
  TRANSACTION_BUILD_OPERATIONS_CLEAR = "transaction: build: operations: clear",
  TRANSACTION_BUILD_OPERATIONS_ACTION_DUPLICATE = "transaction: build: operations: action: duplicate",
  TRANSACTION_BUILD_OPERATIONS_ACTION_UP = "transaction: build: operations: action: up",
  TRANSACTION_BUILD_OPERATIONS_ACTION_DOWN = "transaction: build: operations: action: down",
  TRANSACTION_BUILD_OPERATIONS_ACTION_DELETE = "transaction: build: operations: action: delete",
  TRANSACTION_BUILD_SIGN_IN_TX_SIGNER = "transaction: build: sign in transaction signer",
  TRANSACTION_BUILD_VIEW_IN_XDR = "transaction: build: view in xdr",
  TRANSACTION_BUILD_INVOKE_CONTRACT = "transaction: build: invoke contract",
  // Transactions - sign
  TRANSACTION_SIGN_IMPORT_SUCCESS = "transaction: sign: import: success",
  TRANSACTION_SIGN_IMPORT_ERROR = "transaction: sign: import: error",
  TRANSACTION_SIGN_CLEAR = "transaction: sign: clear",
  TRANSACTION_SIGN_SECRET_KEY_SUCCESS = "transaction: sign: secret key: success",
  TRANSACTION_SIGN_SECRET_KEY_ERROR = "transaction: sign: secret key: error",
  TRANSACTION_SIGN_HARDWARE_SUCCESS = "transaction: sign: hardware: success",
  TRANSACTION_SIGN_HARDWARE_ERROR = "transaction: sign: hardware: error",
  TRANSACTION_SIGN_SIGNATURE_SUCCESS = "transaction: sign: signature: success",
  TRANSACTION_SIGN_SIGNATURE_ERROR = "transaction: sign: signature: error",
  TRANSACTION_SIGN_WALLET = "transaction: sign: wallet",
  TRANSACTION_SIGN_SUBMIT_IN_TX_SUBMITTER = "transaction: sign: submit in transaction submitter",
  TRANSACTION_SIGN_SIMULATE = "transaction: sign: simulate",
  TRANSACTION_SIGN_VIEW_IN_XDR = "transaction: sign: view in xdr",
  TRANSACTION_SIGN_FEE_BUMP = "transaction: sign: fee bump",
  // Transactions - simulate
  TRANSACTION_SIMULATE = "transaction: simulate",
  // Transactions - submit
  TRANSACTION_SUBMIT_SUCCESS = "transaction: submit: success",
  TRANSACTION_SUBMIT_ERROR = "transaction: submit: error",
  TRANSACTION_SUBMIT_SIMULATE = "transaction: submit: simulate",
  TRANSACTION_SUBMIT_SAVE = "transaction: submit: save",
  // Transactions - fee bump
  TRANSACTION_FEE_BUMP_SIGN_IN_TX_SIGNER = "transaction: fee bump: sign in transaction signer",
  TRANSACTION_FEE_BUMP_VIEW_XDR = "transaction: fee bump: view xdr",
  TRANSACTION_FEE_BUMP_CLEAR = "transaction: fee bump: clear",
  // Transactions - saved
  TRANSACTION_SAVED_VIEW_SUBMITTER = "transaction: saved: view in submitter",
  TRANSACTION_SAVED_VIEW_BUILDER = "transaction: saved: view in builder",
  TRANSACTION_SAVED_DELETE = "transaction: saved: delete",
  TRANSACTION_SAVED_EDIT_SAVE = "transaction: saved: edit: save",
  // Transactions - CLI sign
  TRANSACTION_CLI_SIGN = "transaction: cli: sign",
  // Endpoints
  ENDPOINTS_SUBMIT = "endpoints: submit",
  ENDPOINTS_COPY = "endpoints: horizon: copy",
  ENDPOINTS_SAVE = "endpoints: horizon: save",
  // Endpoints - saved
  ENDPOINTS_SAVED_TAB = "endpoints: saved: tab",
  ENDPOINTS_SAVED_VIEW = "endpoints: saved: view",
  ENDPOINTS_SAVED_EDIT = "endpoints: saved: edit",
  ENDPOINTS_SAVED_DELETE = "endpoints: saved: delete",
  // Smart Contracts - Contract Explorer
  SMART_CONTRACTS_EXPLORER_LOAD_CONTRACT = "smart contracts: explorer: load contract",
  SMART_CONTRACTS_EXPLORER_CLEAR_CONTRACT = "smart contracts: explorer: clear contract",
  SMART_CONTRACTS_EXPLORER_TAB = "smart contracts: explorer: tab",
  SMART_CONTRACTS_EXPLORER_SAVE = "smart contracts: explorer: save contract id",
  SMART_CONTRACTS_SAVED_VIEW_IN_EXPLORER = "smart contracts: saved: view in contract explorer",
  SMART_CONTRACTS_EXPLORER_STORAGE_RESTORE = "smart contracts: explorer: storage: restore",
  // Smart Contracts - Invoke Contract
  SMART_CONTRACTS_EXPLORER_INVOKE_CONTRACT_SIMULATE = "smart contracts: explorer: invoke contract: simulate",
  SMART_CONTRACTS_EXPLORER_INVOKE_CONTRACT_SIMULATE_SUCCESS = "smart contracts: explorer: invoke contract: simulate: success",
  SMART_CONTRACTS_EXPLORER_INVOKE_CONTRACT_SIMULATE_ERROR = "smart contracts: explorer: invoke contract: simulate: error",
  SMART_CONTRACTS_EXPLORER_INVOKE_CONTRACT_SUBMIT = "smart contracts: explorer: invoke contract: submit",
  SMART_CONTRACTS_EXPLORER_INVOKE_CONTRACT_SUBMIT_SUCCESS = "smart contracts: explorer: invoke contract: submit: success",
  SMART_CONTRACTS_EXPLORER_INVOKE_CONTRACT_SUBMIT_ERROR = "smart contracts: explorer: invoke contract: submit: error",
  // Transaction Dashboard
  TRANSACTION_DASHBOARD_LOAD_TX = "transaction dashboard: load tx",
  TRANSACTION_DASHBOARD_CLEAR_TX = "transaction dashboard: clear tx",
}
