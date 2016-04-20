import {combineReducers} from 'redux';
import {UPDATE_XDR_INPUT, UPDATE_XDR_TYPE} from '../actions/xdrViewer';
import {LOAD_STATE} from '../actions/routing';
import url from 'url';

const routing = combineReducers({
  input,
  type,
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
