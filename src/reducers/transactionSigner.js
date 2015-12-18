import {combineReducers} from 'redux';
import {
  IMPORT_FROM_XDR,
  CLEAR_TRANSACTION,
  SET_SECRET,
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

function signers(state = {
  signer: '', // TODO: multiple signers
}, action) {
  switch (action.type) {
  case CLEAR_TRANSACTION:
    return {
      signer: '',
    }
  case SET_SECRET:
    return {
      signer: action.key
    }
  }
  return state;
}
