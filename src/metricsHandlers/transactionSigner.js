import {
  LEDGER_WALLET_SIGN_START,
  LEDGER_WALLET_SIGN_SUCCESS,
  LEDGER_WALLET_SIGN_ERROR,
  TREZOR_WALLET_SIGN_START,
  TREZOR_WALLET_SIGN_SUCCESS,
  TREZOR_WALLET_SIGN_ERROR,
  SET_SECRETS,
} from "../actions/transactionSigner";
import { logEvent } from "../utilities/metrics";
import { LOAD_STATE } from "../actions/routing";

const metricsEvents = {
  startLedgerSign: "transaction signer: ledger signature: begin",
  ledgerSignSuccess: "transaction signer: ledger signature: success",
  ledgerSignFailed: "transaction signer: ledger signature: failed",
  startTrezorSign: "transaction signer: trezor signature: begin",
  trezorSignSuccess: "transaction signer: trezor signature: success",
  trezorSignFailed: "transaction signer: trezor signature: failed",
  addSecret: "transaction signer: add secret",
  submitTransaction: "transaction signer: begin submitting transaction",
};

export default function networkMetrics(state, action) {
  const { type, ...payload } = action;
  switch (type) {
    case LEDGER_WALLET_SIGN_START: {
      logEvent(metricsEvents.startLedgerSign);
      return;
    }
    case LEDGER_WALLET_SIGN_SUCCESS: {
      logEvent(metricsEvents.ledgerSignSuccess);
      return;
    }
    case LEDGER_WALLET_SIGN_ERROR: {
      logEvent(metricsEvents.ledgerSignFailed, { error: payload.error });
      return;
    }
    case TREZOR_WALLET_SIGN_START: {
      logEvent(metricsEvents.startTrezorSign);
      return;
    }
    case TREZOR_WALLET_SIGN_SUCCESS: {
      logEvent(metricsEvents.trezorSignSuccess);
      return;
    }
    case TREZOR_WALLET_SIGN_ERROR: {
      logEvent(metricsEvents.trezorSignFailed, { error: payload.error });
      return;
    }
    case SET_SECRETS: {
      logEvent(metricsEvents.addSecret, {
        secretCount: payload.secrets.length,
      });
      return;
    }
    case LOAD_STATE: {
      const { location } = state.routing;
      // If we're on the txsigner and loading state, we might be transitioning
      // to another feature with a complete transaction.
      if (location === "txsigner") {
        if (payload.slug === "xdr-viewer") {
          logEvent(metricsEvents.submitTransaction);
        }
      }
    }
  }
}
