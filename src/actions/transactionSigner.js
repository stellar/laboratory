import StellarLedger from 'stellar-ledger-api';
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

export const LEDGER_WALLET_SIGN_START = 'LEDGER_WALLET_SIGN_START';
export const LEDGER_WALLET_SIGN_SUCCESS = 'LEDGER_WALLET_SIGN_SUCCESS';
export const LEDGER_WALLET_SIGN_ERROR = 'LEDGER_WALLET_SIGN_ERROR';

const DEFAULT_BIP = "44'/148'/0'";

export function signWithLedger(txXDR) {
  return dispatch => {
    dispatch({ type: LEDGER_WALLET_SIGN_START });

    let ledgerApi = new StellarLedger.Api(new StellarLedger.comm(120));
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

    let onConnect = () => {
      BP.all([
        ledgerApi.getPublicKey_async(DEFAULT_BIP),
        ledgerApi.signTx_async(DEFAULT_BIP, transaction),
      ]).then(results => {
        let {publicKey} = results[0];
        let {signature} = results[1];
        let keyPair = Keypair.fromPublicKey(publicKey);
        let hint = keyPair.signatureHint();
        let decorated = new xdr.DecoratedSignature({hint, signature});

        dispatch({
          type: LEDGER_WALLET_SIGN_SUCCESS,
          signature: decorated,
        });
      }).catch(onError);
    };

    ledgerApi.connect(onConnect, onError);
  };
}



