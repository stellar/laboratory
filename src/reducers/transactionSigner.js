import {combineReducers} from 'redux';
import {
  IMPORT_FROM_XDR,
  CLEAR_TRANSACTION,
  SET_SECRETS,
} from '../actions/transactionSigner';
import {LOAD_STATE} from '../actions/routing';
import _ from 'lodash';
import validateTxXdr from '../utilities/validateTxXdr';
import SLUG from '../constants/slug';

const transactionSigner = combineReducers({
  xdr,
  signers,
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
