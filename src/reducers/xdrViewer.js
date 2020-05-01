import {combineReducers} from 'redux';
import {UPDATE_XDR_INPUT, UPDATE_XDR_TYPE} from '../actions/xdrViewer';
import FETCHED_SIGNERS from '../constants/fetched_signers';
import {LOAD_STATE, } from '../actions/routing';
import {SET_PARAMS} from "../actions/network";
import SLUG from '../constants/slug';

const routing = combineReducers({
  input,
  type,
  fetchedSigners,
});

export default routing;

function input(state = '', action) {
  switch (action.type) {
  case LOAD_STATE:
    if (
      (action.slug === SLUG.XDRVIEWER || action.slug === SLUG.TXSUBMITTER) &&
      action.queryObj.input
    ) {
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
