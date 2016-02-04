import {combineReducers} from 'redux';
import {
  IMPORT_FROM_XDR,
  CLEAR_TRANSACTION,
  SET_SECRETS,
} from '../actions/transactionSigner';
import {LOAD_STATE} from '../actions/routing';
import validateTxXdr from '../utilities/validateTxXdr';
import _ from 'lodash';

const transactionSigner = combineReducers({
  tx,
  signers,
})

export default transactionSigner;

function tx(state = {
  xdr: '',
  loaded: false,
}, action) {
  switch (action.type) {
  case LOAD_STATE:
    if (action.slug === 'txsigner' && action.payload.xdr &&
        validateTxXdr(action.payload.xdr).result === 'success') {
      return {
        xdr: action.payload.xdr,
        loaded: true,
      }
    }
    // If invalid xdr in the url, then we go back to step zero
    return {
      xdr: '',
      loaded: false,
    };
  case IMPORT_FROM_XDR:
    return {
      xdr: action.xdr,
      loaded: true,
    }
  case CLEAR_TRANSACTION:
    return {
      xdr: '',
      loaded: false,
    }
  }
  return state;
}

function signers(state = [], action) {
  switch (action.type) {
  case CLEAR_TRANSACTION:
    return []
  case SET_SECRETS:
    return action.secrets
  }
  return state;
}
