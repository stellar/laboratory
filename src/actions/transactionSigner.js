import LedgerTransportWebUSB from "@ledgerhq/hw-transport-webusb";
import LedgerStr from '@ledgerhq/hw-app-str';
import TrezorConnect from "trezor-connect";
import { TransactionBuilder, Keypair, xdr, StrKey } from 'stellar-sdk';
import { signTransaction } from "@stellar/freighter-api";
import { trezorTransformTransaction } from "../utilities/trezorTransformTransaction"

export const IMPORT_FROM_XDR = 'IMPORT_FROM_XDR';
export function importFromXdr(xdr) {
  return {
    type: IMPORT_FROM_XDR,
    xdr,
  }
}

export const CLEAR_TRANSACTION = 'CLEAR_TRANSACTION';
export function clearTransaction() {
  return {
    type: CLEAR_TRANSACTION,
  }
}

export const SET_SECRETS = 'SET_SECRETS';
export function setSecrets(secrets) {
  return {
    type: SET_SECRETS,
    secrets,
  };
}

export const SET_BIP_PATH = 'SET_BIP_PATH';
export function setBIPPath(bipPath) {
  return {
    type: SET_BIP_PATH,
    bipPath,
  };
}

export const LEDGER_WALLET_SIGN_START = 'LEDGER_WALLET_SIGN_START';
export const LEDGER_WALLET_SIGN_SUCCESS = 'LEDGER_WALLET_SIGN_SUCCESS';
export const LEDGER_WALLET_SIGN_ERROR = 'LEDGER_WALLET_SIGN_ERROR';
export const TREZOR_WALLET_SIGN_START = 'TREZOR_WALLET_SIGN_START';
export const TREZOR_WALLET_SIGN_SUCCESS = 'TREZOR_WALLET_SIGN_SUCCESS';
export const TREZOR_WALLET_SIGN_ERROR = 'TREZOR_WALLET_SIGN_ERROR';
export const FREIGHTER_WALLET_SIGN_START = 'FREIGHTER_WALLET_SIGN_START';
export const FREIGHTER_WALLET_SIGN_SUCCESS = 'FREIGHTER_WALLET_SIGN_SUCCESS';
export const FREIGHTER_WALLET_SIGN_ERROR = 'FREIGHTER_WALLET_SIGN_ERROR';

export function signWithLedger(txXDR, bipPath, networkPassphrase) {
  return dispatch => {
    dispatch({ type: LEDGER_WALLET_SIGN_START });

    let transaction = TransactionBuilder.fromXDR(txXDR, networkPassphrase);

    let onError = err => {
      if (err.message) {
        err = err.message;
      } else if (err.errorCode == 2) {
        err = `Couldn't connect to Ledger device. Connection can only be established using a secure connection.`;
      } else if (err.errorCode == 5) {
        err = `Connection timeout.`;
      }

      dispatch({
        type: LEDGER_WALLET_SIGN_ERROR,
        error: err,
       });
    };

    let onConnect = (ledgerApi) => {
      let publicKey;

      ledgerApi.getPublicKey(bipPath).then(result => publicKey = result.publicKey)
        .then(() => ledgerApi.signTransaction(bipPath, transaction.signatureBase()))
        .then(result => {
          let {signature} = result;
          let keyPair = Keypair.fromPublicKey(publicKey);
          let hint = keyPair.signatureHint();
          let decorated = new xdr.DecoratedSignature({hint, signature});

          dispatch({
              type: LEDGER_WALLET_SIGN_SUCCESS,
              signature: decorated,
            });
        })
        .catch(onError);
    };

    LedgerTransportWebUSB.request().then((transport) => {
      onConnect(new LedgerStr(transport));
    }).catch(onError);
  };
}

export function signWithTrezor(txXDR, bipPath, networkPassphrase) {
  return dispatch => {
    dispatch({ type: TREZOR_WALLET_SIGN_START });

    let transaction = TransactionBuilder.fromXDR(txXDR, networkPassphrase);
    const path = `m/${bipPath}`;

    let onError = err => {
      err = err || "Couldn't sign transaction with Trezor device."

      dispatch({
        type: TREZOR_WALLET_SIGN_ERROR,
        error: err,
       });
    };

    let onConnect = (trezorResponse) => {
      if (trezorResponse.success) {
        const signature = Buffer.from(trezorResponse.payload.signature, "hex");
        const publicKeyBytes = Buffer.from(trezorResponse.payload.publicKey, "hex");
        const encodedPublicKey = StrKey.encodeEd25519PublicKey(publicKeyBytes);

        let keyPair = Keypair.fromPublicKey(encodedPublicKey);
        let hint = keyPair.signatureHint();
        let decorated = new xdr.DecoratedSignature({ hint, signature });

        dispatch({
          type: TREZOR_WALLET_SIGN_SUCCESS,
          signature: decorated,
        });
      } else {
        onError(trezorResponse.payload.error);
      }
    };

    TrezorConnect.manifest({
      email: "accounts+trezor@stellar.org",
      appUrl: "https://laboratory.stellar.org/",
    });

    const trezorParams = trezorTransformTransaction(path, transaction);

    TrezorConnect.stellarSignTransaction(trezorParams)
      .then(onConnect)
      .catch(onError)
  };
}

export function signWithFreighter(txXDR, txNetwork) {
  return dispatch => {
    dispatch({ type: FREIGHTER_WALLET_SIGN_START });

    signTransaction(txXDR, txNetwork)
      .then(signedTx => {
        dispatch({
          type: FREIGHTER_WALLET_SIGN_SUCCESS,
          signedTx,
        });
      })
      .catch(e => {
        dispatch({
          type: FREIGHTER_WALLET_SIGN_ERROR,
          error: e,
        });
      });
  };
}



