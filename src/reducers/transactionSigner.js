import {combineReducers} from 'redux';
import {
  IMPORT_FROM_XDR,
  CLEAR_TRANSACTION,
  SET_SECRETS,
  SET_BIP_PATH,
  LEDGER_WALLET_SIGN_START,
  LEDGER_WALLET_SIGN_ERROR,
  LEDGER_WALLET_SIGN_SUCCESS,
  TREZOR_WALLET_SIGN_START,
  TREZOR_WALLET_SIGN_ERROR,
  TREZOR_WALLET_SIGN_SUCCESS,
  FREIGHTER_WALLET_SIGN_START,
  FREIGHTER_WALLET_SIGN_ERROR,
  FREIGHTER_WALLET_SIGN_SUCCESS,
} from '../actions/transactionSigner';
import {LOAD_STATE} from '../actions/routing';
import validateTxXdr from '../utilities/validateTxXdr';
import SLUG from '../constants/slug';

const transactionSigner = combineReducers({
  xdr,
  signers,
  bipPath,
  hardwarewalletStatus,
  freighterwalletStatus,
})

export default transactionSigner;

function xdr(state = '', action) {
  switch (action.type) {
  case LOAD_STATE:
    if (action.slug === SLUG.TXSIGNER && action.queryObj.xdr) {
      const validationResult = validateTxXdr(action.queryObj.xdr)
      if (validationResult.result === 'success') {
        return action.queryObj.xdr;
      }
      console.error(validationResult.message, validationResult.originalError)
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

function hardwarewalletStatus(state = {}, action) {
  switch (action.type) {
  case IMPORT_FROM_XDR:
  case CLEAR_TRANSACTION:
    return {};
  case LEDGER_WALLET_SIGN_START:
  case TREZOR_WALLET_SIGN_START:
    return Object.assign({}, state, {
      status: 'loading',
      message: 'Waiting for wallet',
    });
  case LEDGER_WALLET_SIGN_ERROR:
  case TREZOR_WALLET_SIGN_ERROR:
    return Object.assign({}, state, {
      status: 'failure',
      message: 'Error:' + JSON.stringify(action.error),
    });
  case LEDGER_WALLET_SIGN_SUCCESS:
  case TREZOR_WALLET_SIGN_SUCCESS:
    return Object.assign({}, state, {
      status: 'success',
      message: 'Success!',
      signatures: [action.signature]
    });
  }
  return state;
}

function freighterwalletStatus(state = {}, action) {
  switch (action.type) {
  case IMPORT_FROM_XDR:
  case CLEAR_TRANSACTION:
    return {};
  case FREIGHTER_WALLET_SIGN_START:
    return Object.assign({}, state, {
      status: 'loading',
      message: 'Waiting for wallet',
    });
  case FREIGHTER_WALLET_SIGN_ERROR:
    return Object.assign({}, state, {
      status: 'failure',
      message: 'Error:' + JSON.stringify(action.error),
    });
  case FREIGHTER_WALLET_SIGN_SUCCESS:
    return Object.assign({}, state, {
      status: 'success',
      message: 'Success!',
      signedTx: action.signedTx,
    });
  }
  return state;
}
