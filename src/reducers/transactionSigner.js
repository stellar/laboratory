import {combineReducers} from 'redux';
import {
  IMPORT_FROM_XDR,
  CLEAR_TRANSACTION,
  SET_SECRETS,
  SET_BIP_PATH,
  LEDGER_WALLET_SIGN_START,
  LEDGER_WALLET_SIGN_ERROR,
  LEDGER_WALLET_SIGN_SUCCESS,
} from '../actions/transactionSigner';
import {LOAD_STATE} from '../actions/routing';
import _ from 'lodash';
import validateTxXdr from '../utilities/validateTxXdr';
import SLUG from '../constants/slug';

const transactionSigner = combineReducers({
  xdr,
  signers,
  bipPath,
  ledgerwalletStatus,
})

export default transactionSigner;

function xdr(state = '', action) {
  switch (action.type) {
  case LOAD_STATE:
    if (action.slug === SLUG.TXSIGNER && action.queryObj.xdr) {
      if (validateTxXdr(action.queryObj.xdr).result === 'success') {
        return action.queryObj.xdr;
      }
      // If invalid xdr in the url, then we go back to step zero
      return '';
    }
    return state;
  case IMPORT_FROM_XDR:
    return action.xdr;
  case CLEAR_TRANSACTION:
    return '';
  }
  return state;
}

function signers(state = [], action) {
  switch (action.type) {
  case IMPORT_FROM_XDR:
  case CLEAR_TRANSACTION:
    return []
  case SET_SECRETS:
    return action.secrets
  }
  return state;
}

function bipPath(state = [], action) {
  switch (action.type) {
  case LOAD_STATE:
  case IMPORT_FROM_XDR:
  case CLEAR_TRANSACTION:
    return "44'/148'/0'"
  case SET_BIP_PATH:
    return action.bipPath
  }
  return state;
}

function ledgerwalletStatus(state = {}, action) {
  switch (action.type) {
  case IMPORT_FROM_XDR:    
  case CLEAR_TRANSACTION:
    return {};
  case LEDGER_WALLET_SIGN_START:
    return Object.assign({}, state, {
      status: 'loading',
      message: 'Waiting for wallet',
    });
  case LEDGER_WALLET_SIGN_ERROR:
    return Object.assign({}, state,  {
      status: 'failure',
      message: 'Error:' + JSON.stringify(action.error),
    });
  case LEDGER_WALLET_SIGN_SUCCESS:
    return Object.assign({}, state,  {
      status: 'success',
      message: 'Success!',
      signatures: [action.signature]
    });
  }
  return state;
}
