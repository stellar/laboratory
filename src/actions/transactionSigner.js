import LedgerTransport from '@ledgerhq/hw-transport-u2f';
import LedgerStr from '@ledgerhq/hw-app-str';
import {Transaction, Keypair, xdr} from 'stellar-sdk';

var BP = require("bluebird");

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

export function signWithLedger(txXDR, bipPath) {
  return dispatch => {
    dispatch({ type: LEDGER_WALLET_SIGN_START });

    let transaction = new Transaction(txXDR);

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

    const openTimeout = 60 * 1000;
    LedgerTransport.create(openTimeout).then((transport) => {
      transport.setDebugMode(true);
      onConnect(new LedgerStr(transport));
    }).catch(onError);
  };
}



