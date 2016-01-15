import {combineReducers} from 'redux';
import {
  IMPORT_FROM_XDR,
  CLEAR_TRANSACTION,
  SET_SECRETS,
} from '../actions/transactionSigner';
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
