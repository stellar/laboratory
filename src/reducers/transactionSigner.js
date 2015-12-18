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
  xdr: 'AAAAAAJ6JsqETD62vmfnwnunIbeHkngYuSSR622WfZmHpz9yAAAAyAAAAAAAAATTAAAAAAAAAAEAAAAGdGV3ZmRzAAAAAAACAAAAAQAAAAD5NMv6q1ZjBafbOC4BmHn5UNVYlacnl8kooX5xIOPpYgAAAAEAAAAArqW21g0d1YLqh1F/m+mzhXj5w6T0v0bHkxIwvVllnZEAAAACMjM1MjM0dwAAAAAAAAAAAAJ6JsqETD62vmfnwnunIbeHkngYuSSR622WfZmHpz9yAAAAAA9/IfAAAAAAAAAAAAAAAAACeibKhEw+tr5n58J7pyG3h5J4GLkkkettln2Zh6c/cgAAAAAAmJaAAAAAAAAAAAA=',
  loaded: true,
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
