import {combineReducers} from 'redux';
import {UPDATE_XDR_INPUT, UPDATE_XDR_TYPE, FETCHED_SIGNERS_SUCCESS, FETCHED_SIGNERS_FAIL, FETCHED_SIGNERS_START} from '../actions/xdrViewer';
import {LOAD_STATE} from '../actions/routing';
import {SET_PARAMS} from "../actions/network";

const routing = combineReducers({
  input,
  type,
  fetchedSigners,
});

export default routing;

function input(state = '', action) {
  switch (action.type) {
  case LOAD_STATE:
    if (action.slug === 'xdr-viewer' && action.queryObj.input) {
      return action.queryObj.input;
    }
    break;
  case UPDATE_XDR_INPUT:
    return action.input;
  }

  return state;
}

function type(state = 'TransactionEnvelope', action) {
  switch (action.type) {
  case LOAD_STATE:
    if (action.slug === 'xdr-viewer' && action.queryObj.type) {
      return action.queryObj.type;
    }
    break;
  case UPDATE_XDR_TYPE:
    return action.xdrType;
  }

  return state;
}

function fetchedSigners(state = null, action) {
  switch (action.type) {
  case FETCHED_SIGNERS_SUCCESS:
    return action.result;
  case FETCHED_SIGNERS_FAIL:
    return "ERROR";
  case FETCHED_SIGNERS_START:
    return "PENDING";
  case SET_PARAMS:
    return null;
  }
  return state;
}
