import {combineReducers} from 'redux';
import {UPDATE_XDR_INPUT, UPDATE_XDR_TYPE} from '../actions/xdrViewer';
import FETCHED_SIGNERS from '../constants/fetched_signers';
import {LOAD_STATE, UPDATE_LOCATION} from '../actions/routing';
import {SET_PARAMS} from "../actions/network";

const routing = combineReducers({
  input,
  type,
  fetchedSigners,
  canSubmit,
});

export default routing;

function canSubmit(state = false, action) {
  switch (action.type) {
    case UPDATE_LOCATION:
      if (action.slug === 'xdr-viewer' && state) {
        return true
      }
      return false;
    case LOAD_STATE:
      if (action.slug === 'xdr-viewer' && action.queryObj.canSubmit) {
        return action.queryObj.canSubmit;
      }
      return false;
    default:
      return state
  }
}

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

function fetchedSigners(state = {state: FETCHED_SIGNERS.NONE}, action) {
  switch (action.type) {
    case FETCHED_SIGNERS.SUCCESS:
      return {
        state: FETCHED_SIGNERS.SUCCESS,
        data: action.result
      };
    case FETCHED_SIGNERS.NONE:
    case FETCHED_SIGNERS.PENDING:
    case FETCHED_SIGNERS.FAIL:
    case FETCHED_SIGNERS.NOT_EXIST:
      return {state: action.type};
    case SET_PARAMS:
      return {state: FETCHED_SIGNERS.NONE};
    default:
      return state;
  }
}
